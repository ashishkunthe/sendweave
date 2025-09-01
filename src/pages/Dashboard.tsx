import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

export function Dashboard() {
  const navigate = useNavigate();
  const [flows, setFlows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // fetch flows
  const fetchFlows = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/flows`,
        {
          headers: { Authorization: token },
        }
      );

      setFlows(res.data.flows || []);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load flows");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlows();
  }, [navigate]);

  // Execute flow
  const handleExecute = async (id: string) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/flow/${id}/execute`,
        {},
        { headers: { Authorization: localStorage.getItem("token") || "" } }
      );
      alert("✅ Flow execution started!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Execution failed ❌");
    }
  };

  //  Delete flow
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this flow?")) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/flows/${id}`, {
        headers: { Authorization: localStorage.getItem("token") || "" },
      });
      alert("🗑️ Flow deleted successfully");
      fetchFlows();
    } catch (err: any) {
      alert(err.response?.data?.message || "Delete failed ❌");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white">
        <p className="text-lg animate-pulse">Loading your flows...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white px-6 py-10">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-yellow-400">Your Flows</h1>
        <div className="flex gap-4">
          <motion.button
            onClick={() => navigate("/templates")}
            className="bg-blue-400 text-black font-semibold px-6 py-2 rounded-full shadow-lg hover:bg-blue-500 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            📧 Templates
          </motion.button>
          <motion.button
            onClick={() => navigate("/flow-builder")}
            className="bg-yellow-400 text-black font-semibold px-6 py-2 rounded-full shadow-lg hover:bg-yellow-500 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            + Create New Flow
          </motion.button>

          <motion.button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}
            className="bg-red-500 text-white font-semibold px-6 py-2 rounded-full shadow-lg hover:bg-red-600 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Logout
          </motion.button>
        </div>
      </header>

      {error ? (
        <p className="text-red-400">{error}</p>
      ) : flows.length === 0 ? (
        <p className="text-gray-400">No flows found. Start by creating one!</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {flows.map((flow) => (
            <motion.div
              key={flow._id}
              className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-bold text-yellow-300 mb-2">
                {flow.name || "Untitled Flow"}
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                Created at: {new Date(flow.createdAt).toLocaleDateString()}
              </p>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => navigate(`/flows/${flow._id}`)}
                  className="px-4 py-2 text-sm bg-indigo-500 rounded-lg hover:bg-indigo-600 transition"
                >
                  View
                </button>
                <button
                  onClick={() => handleExecute(flow._id)}
                  className="px-4 py-2 text-sm bg-green-500 rounded-lg hover:bg-green-600 transition"
                >
                  Execute
                </button>
                <button
                  onClick={() => handleDelete(flow._id)}
                  className="px-4 py-2 text-sm bg-red-500 rounded-lg hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
