import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";

export function Templates() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any | null>(null);
  const [templateName, setTemplateName] = useState("");
  const [templateSubject, setTemplateSubject] = useState("");
  const [templateBody, setTemplateBody] = useState("");

  const fetchTemplates = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/templates`,
        { headers: { Authorization: `${token}` } }
      );

      setTemplates(res.data.templates || []);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load templates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [navigate]);

  const handleCreate = () => {
    setEditingTemplate(null);
    setTemplateName("");
    setTemplateSubject("");
    setTemplateBody("");
    setOpenModal(true);
  };

  const handleEdit = (template: any) => {
    setEditingTemplate(template);
    setTemplateName(template.name);
    setTemplateSubject(template.subject);
    setTemplateBody(template.body);
    setOpenModal(true);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const payload = {
        name: templateName,
        subject: templateSubject,
        body: templateBody,
      };

      if (editingTemplate) {
        await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/templates/${
            editingTemplate._id
          }`,
          payload,
          { headers: { Authorization: `${token}` } }
        );
        toast.success("Template updated successfully!");
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/templates`,
          payload,
          { headers: { Authorization: `${token}` } }
        );
        toast.success("Template created successfully!");
      }

      setOpenModal(false);
      fetchTemplates();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Save failed ❌");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this template?"))
      return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/templates/${id}`,
        {
          headers: { Authorization: localStorage.getItem("token") || "" },
        }
      );
      toast.success("🗑️ Template deleted successfully");
      fetchTemplates();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Delete failed ❌");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black text-white">
        {/* Spinner */}
        <div className="relative w-16 h-16 mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-t-yellow-500 border-gray-700 animate-spin"></div>
        </div>

        {/* Text */}
        <p className="text-lg font-medium text-gray-300 animate-pulse">
          Loading Templates...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white px-6 py-10">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">Your Templates</h1>
        <div className="flex gap-4">
          <motion.button
            onClick={handleCreate}
            className="bg-white text-black font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-gray-200 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            + Create Template
          </motion.button>

          <motion.button
            onClick={() => navigate("/dashboard")}
            className="bg-gray-800 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-gray-700 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back to Dashboard
          </motion.button>
        </div>
      </header>

      {error ? (
        <p className="text-red-400">{error}</p>
      ) : templates.length === 0 ? (
        <p className="text-gray-400">
          No templates found. Start by creating one!
        </p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {templates.map((template) => (
            <motion.div
              key={template._id}
              className="bg-gray-900/70 border border-gray-700 p-6 rounded-xl shadow-md hover:shadow-lg transition"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-bold text-white mb-2">
                {template.name || "Untitled Template"}
              </h3>
              <p className="text-sm text-gray-400 mb-2">
                <strong>Subject:</strong> {template.subject}
              </p>
              <p className="text-gray-400 text-sm mb-4">
                {template.global ? "🌍 Global Template" : "👤 Your Template"}
              </p>
              <div
                className="text-sm text-gray-300 mb-4 max-h-24 overflow-hidden"
                dangerouslySetInnerHTML={{ __html: template.body }}
              ></div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    const content = `Subject: ${template.subject}\n\n${template.body}`;
                    navigator.clipboard.writeText(content);
                    toast.success("📋 Template copied to clipboard!");
                  }}
                  className="px-4 py-2 text-sm bg-gray-800 text-white rounded-md hover:bg-gray-700 transition"
                >
                  Copy
                </button>

                {!template.global && (
                  <>
                    <button
                      onClick={() => handleEdit(template)}
                      className="px-4 py-2 text-sm bg-white text-black rounded-md hover:bg-gray-200 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(template._id)}
                      className="px-4 py-2 text-sm bg-black text-white rounded-md border border-red-500/30 hover:bg-red-600/20 hover:border-red-500 transition shadow-md"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {openModal && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl w-full max-w-lg text-white shadow-xl"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <h2 className="text-2xl font-bold mb-4 text-white">
                {editingTemplate ? "Edit Template" : "Create Template"}
              </h2>

              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="w-full mb-3 p-3 rounded-lg bg-black/40 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Template Name"
              />
              <input
                type="text"
                value={templateSubject}
                onChange={(e) => setTemplateSubject(e.target.value)}
                className="w-full mb-3 p-3 rounded-lg bg-black/40 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Template Subject"
              />
              <textarea
                value={templateBody}
                onChange={(e) => setTemplateBody(e.target.value)}
                className="w-full mb-3 p-3 rounded-lg bg-black/40 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Template Body (HTML allowed)"
                rows={6}
              ></textarea>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setOpenModal(false)}
                  className="px-5 py-2 bg-gray-700/70 text-white rounded-lg hover:bg-gray-600/80 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-5 py-2 bg-black text-white font-semibold rounded-lg border border-green-500/30 hover:bg-green-600/20 hover:border-green-500 transition shadow-md"
                >
                  {editingTemplate ? "Save Changes" : "Create Template"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
