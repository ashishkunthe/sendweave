import { useCallback, useEffect, useState } from "react";
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
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import axios from "axios";
import { EmailNode } from "../nodes/EmailNode";
import { WaitNode } from "../nodes/WaitNode";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

type NodeData = {
  label?: string;
  to?: string;
  subject?: string;
  body?: string;
  delay?: string;
  onChange: (nodeId: string, field: string, value: string) => void;
};

type CustomNode = Node<NodeData>;

let id = 1;
const getId = () => `${id++}`;

export default function FlowBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState<CustomNode>([]);
  //   @ts-ignore
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const [flowName, setFlowName] = useState("My New Flow");
  const [loading, setLoading] = useState(false);

  // Function to update node data dynamically
  const updateNodeData = (nodeId: string, field: string, value: string) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                [field]: value,
                onChange: updateNodeData,
              },
            }
          : node
      )
    );
  };

  // Add Email Node
  const addEmailNode = () => {
    const newNode: CustomNode = {
      id: getId(),
      type: "email",
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { to: "", subject: "", body: "", onChange: updateNodeData },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  // Add Wait Node
  const addWaitNode = () => {
    const newNode: CustomNode = {
      id: getId(),
      type: "wait",
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { delay: "1 minute", onChange: updateNodeData },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const onConnect = useCallback(
    // @ts-ignore
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const { id: flowId } = useParams();

  useEffect(() => {
    const fetchFlow = async () => {
      if (!flowId) return;
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/flows/${flowId}`,
          { headers: { Authorization: token || "" } }
        );

        const { name, nodes, edges } = res.data.flow;

        // Reattach `onChange` handlers
        const updatedNodes = nodes.map((node: CustomNode) => ({
          ...node,
          data: { ...node.data, onChange: updateNodeData },
        }));

        setFlowName(name);
        setNodes(updatedNodes);
        setEdges(edges);
      } catch (err) {
        console.error(err);
        alert("Failed to load flow ❌");
      }
    };

    fetchFlow();
  }, [flowId]);

  // Save flow to backend
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in first!");
        return;
      }

      setLoading(true);
      const flowData = { name: flowName, nodes, edges };
      const url = flowId
        ? `${import.meta.env.VITE_API_BASE_URL}/flows/${flowId}`
        : `${import.meta.env.VITE_API_BASE_URL}/flows`;

      const method = flowId ? "put" : "post";

      const res = await axios[method](url, flowData, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });

      alert(
        flowId ? "Flow updated successfully ✅" : "Flow created successfully ✅"
      );
      console.log("Saved Flow:", res.data);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to save flow ❌");
    } finally {
      setLoading(false);
    }
  };

  const nodeTypes = {
    email: EmailNode,
    wait: WaitNode,
  };

  const navigate = useNavigate();

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      {/* Top bar */}
      <div className="p-4 flex items-center gap-4 bg-gray-900 text-white">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white hover:text-gray-300 transition"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

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

        <button
          onClick={addEmailNode}
          className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition"
        >
          + Email Node
        </button>
        <button
          onClick={addWaitNode}
          className="px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600 transition"
        >
          + Wait Node
        </button>
      </div>

      {/* Flow Canvas */}
      <ReactFlow
        nodes={nodes} // @ts-ignore
        edges={edges}
        onNodesChange={onNodesChange} // @ts-ignore
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
