import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";

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
      toast.success("🚀 Flow execution started!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Execution failed ❌");
    }
  };

  // Delete flow
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this flow?")) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/flows/${id}`, {
        headers: { Authorization: localStorage.getItem("token") || "" },
      });
      toast.success("🗑️ Flow deleted successfully");
      fetchFlows();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Delete failed ❌");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black text-white">
        <div className="relative w-16 h-16 mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-t-yellow-500 border-gray-700 animate-spin"></div>
        </div>

        <p className="text-lg font-medium text-gray-300 animate-pulse">
          Loading Flows...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white px-6 py-10">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">Your Flows</h1>
        <div className="flex gap-3">
          <motion.button
            onClick={() => navigate("/templates")}
            className="bg-gray-800 text-white font-medium px-5 py-2 rounded-lg hover:bg-gray-700 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            Templates
          </motion.button>

          <motion.button
            onClick={() => navigate("/contacts")}
            className="bg-gray-800 text-white font-medium px-5 py-2 rounded-lg hover:bg-gray-700 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            Contacts
          </motion.button>

          <motion.button
            onClick={() => navigate("/flow-builder")}
            className="bg-white text-black font-bold px-5 py-2 rounded-lg hover:bg-gray-200 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            + Create Flow
          </motion.button>

          <motion.button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}
            className="bg-red-600 text-white font-medium px-5 py-2 rounded-lg hover:bg-red-700 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
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
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {flows.map((flow) => (
            <motion.div
              key={flow._id}
              className="bg-gray-900/70 border border-gray-700 p-5 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <h3 className="text-lg font-semibold text-white mb-1">
                {flow.name || "Untitled Flow"}
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Created at: {new Date(flow.createdAt).toLocaleDateString()}
              </p>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => navigate(`/flows/${flow._id}`)}
                  className="px-4 py-2 text-sm rounded-md bg-black border border-indigo-500/40 text-white font-semibold hover:bg-indigo-500/20 hover:border-indigo-500 transition shadow-md"
                >
                  View
                </button>

                <button
                  onClick={() => handleExecute(flow._id)}
                  className="px-4 py-2 text-sm rounded-md bg-black border border-green-500/40 text-white font-semibold hover:bg-green-500/20 hover:border-green-500 transition shadow-md"
                >
                  Execute
                </button>

                <button
                  onClick={() => handleDelete(flow._id)}
                  className="px-4 py-2 text-sm rounded-md bg-black border border-red-500/40 text-white font-semibold hover:bg-red-500/20 hover:border-red-500 transition shadow-md"
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
