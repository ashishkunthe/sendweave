import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft } from "lucide-react";

interface NodeData {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: { [key: string]: any };
}

interface EdgeData {
  id: string;
  source: string;
  target: string;
}

interface FlowStructure {
  _id: string;
  name: string;
  nodes: NodeData[];
  edges: EdgeData[];
  createdAt: string;
  updatedAt: string;
}

export default function FlowDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [flow, setFlow] = useState<FlowStructure | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFlow = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/flows/${id}`,
          {
            headers: { Authorization: localStorage.getItem("token") || "" },
          }
        );
        if (!res.data.flow) throw new Error("Flow not found");
        setFlow(res.data.flow);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      }
    };
    fetchFlow();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this flow?")) return;
    try {
      setLoading(true);
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/flows/${id}`, {
        headers: { Authorization: localStorage.getItem("token") || "" },
      });
      alert("Flow deleted successfully ✅");
      navigate("/dashboard");
    } catch (err: any) {
      alert(err.response?.data?.message || "Delete failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleExecute = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/flow/${id}/execute`,
        {},
        { headers: { Authorization: localStorage.getItem("token") || "" } }
      );
      alert(res.data.message || "Flow execution started ✅");
    } catch (err: any) {
      alert(err.response?.data?.message || "Execution failed ❌");
    } finally {
      setLoading(false);
    }
  };

  if (error)
    return (
      <p className="text-center text-red-400 mt-10 font-semibold">{error}</p>
    );

  if (!flow)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black text-white">
        {/* Spinner */}
        <div className="relative w-16 h-16 mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-t-yellow-500 border-gray-700 animate-spin"></div>
        </div>

        {/* Text */}
        <p className="text-lg font-medium text-gray-300 animate-pulse">
          Loading Flow Details...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white px-6 py-10">
      <div className="max-w-4xl mx-auto bg-gray-900/60 backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-gray-800">
        {/* 🔙 Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-400 hover:text-yellow-400 mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        {/* Title & Meta */}
        <h1 className="text-3xl font-bold text-gray-100 mb-2">
          {flow.name || "Untitled Flow"}
        </h1>
        <p className="text-sm text-gray-400 mb-1">ID: {flow._id}</p>
        <p className="text-sm text-gray-500 mb-6">
          Created: {new Date(flow.createdAt).toLocaleString()} <br />
          Updated: {new Date(flow.updatedAt).toLocaleString()}
        </p>

        {/* Nodes */}
        <h2 className="text-xl font-semibold text-gray-200 mb-3">Nodes</h2>
        <div className="space-y-4">
          {flow.nodes.map((node) => (
            <div
              key={node.id}
              className="p-4 bg-gray-800/60 rounded-lg border border-gray-700"
            >
              <p className="font-bold mb-1 text-gray-100">
                {node.type === "email" ? "📧 Email Node" : "⏳ Wait Node"}
              </p>
              {node.type === "email" ? (
                <div className="text-sm text-gray-400">
                  <p>
                    <span className="font-semibold text-gray-300">To:</span>{" "}
                    {node.data.to}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-300">
                      Subject:
                    </span>{" "}
                    {node.data.subject}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-300">Body:</span>{" "}
                    {node.data.body}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-400">
                  Delay: {node.data.delay}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Edges */}
        <h2 className="text-xl font-semibold text-gray-200 mt-6 mb-3">Edges</h2>
        <ul className="list-disc pl-6 text-sm text-gray-400">
          {flow.edges.map((edge) => (
            <li key={edge.id}>
              {edge.source} ➝ {edge.target}
            </li>
          ))}
        </ul>

        {/* Raw JSON (debug) */}
        <details className="mt-6">
          <summary className="cursor-pointer text-yellow-400 hover:text-yellow-300">
            View Raw JSON
          </summary>
          <pre className="bg-black/60 p-4 rounded-lg mt-2 text-xs overflow-x-auto border border-gray-700">
            {JSON.stringify(flow, null, 2)}
          </pre>
        </details>

        {/* Actions */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => navigate(`/flows/${flow._id}/edit`)}
            className="px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg font-medium hover:bg-indigo-600 hover:text-white transition"
            disabled={loading}
          >
            Edit Flow
          </button>
          <button
            onClick={handleExecute}
            className="px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg font-medium hover:bg-green-600 hover:text-white transition"
            disabled={loading}
          >
            Execute Flow
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg font-medium hover:bg-red-600 hover:text-white transition"
            disabled={loading}
          >
            Delete Flow
          </button>
        </div>
      </div>
    </div>
  );
}
