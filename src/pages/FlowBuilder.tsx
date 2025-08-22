import { useCallback, useState } from "react";
import {
  ReactFlow,
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  type Edge,
  type Connection,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import axios from "axios";
import { EmailNode } from "../nodes/EmailNode";
import { WaitNode } from "../nodes/WaitNode";

const initialNodes = [
  {
    id: "1",
    position: { x: 250, y: 5 },
    data: { label: "Start Node" },
    type: "default",
  },
];

const initialEdges: Edge[] = [];

let id = 2; // counter for unique ids
const getId = () => `node-${id++}`;

export default function FlowBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [flowName, setFlowName] = useState("My New Flow");
  const [loading, setLoading] = useState(false);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const nodeTypes = {
    email: EmailNode,
    wait: WaitNode,
  };

  // 👉 Add Email Node
  const addEmailNode = () => {
    const newNode = {
      id: getId(),
      type: "email",
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { to: "", subject: "", body: "" },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  // 👉 Add Wait Node
  const addWaitNode = () => {
    const newNode = {
      id: getId(),
      type: "wait",
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { delay: "1 minute" },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  // Save flow to backend
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in first!");
        return;
      }

      setLoading(true);
      const flowData = {
        name: flowName,
        nodes,
        edges,
      };

      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/flows`,
        flowData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Flow saved successfully ✅");
      console.log("Saved Flow:", res.data);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to save flow ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      {/* Top bar */}
      <div className="p-4 flex items-center gap-4 bg-gray-900 text-white">
        <input
          value={flowName}
          onChange={(e) => setFlowName(e.target.value)}
          className="px-3 py-2 rounded-md text-black"
          placeholder="Enter flow name..."
        />
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-4 py-2 bg-yellow-400 text-black rounded-lg font-bold hover:bg-yellow-500 transition"
        >
          {loading ? "Saving..." : "Save Flow"}
        </button>

        {/* Node Add Buttons */}
        <button
          onClick={addEmailNode}
          className="px-3 py-2 bg-indigo-500 rounded-lg hover:bg-indigo-600"
        >
          + Email Node
        </button>
        <button
          onClick={addWaitNode}
          className="px-3 py-2 bg-pink-500 rounded-lg hover:bg-pink-600"
        >
          + Wait Node
        </button>
      </div>

      {/* Flow canvas */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        nodeTypes={nodeTypes}
      >
        <MiniMap />
        <Controls />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}
