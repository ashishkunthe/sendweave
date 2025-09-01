import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

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
        alert("✅ Template updated successfully!");
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/templates`,
          payload,
          { headers: { Authorization: `${token}` } }
        );
        alert("✅ Template created successfully!");
      }

      setOpenModal(false);
      fetchTemplates();
    } catch (err: any) {
      console.error("Template save error:", err.response || err);
      alert(err.response?.data?.message || "Save failed ❌");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this template?"))
      return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/templates/${id}`,
        {
          headers: { Authorization: ` ${localStorage.getItem("token")}` },
        }
      );
      alert("🗑️ Template deleted successfully");
      fetchTemplates();
    } catch (err: any) {
      alert(err.response?.data?.message || "Delete failed ❌");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white">
        <p className="text-lg animate-pulse">Loading your templates...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white px-6 py-10">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-yellow-400">Your Templates</h1>
        <div className="flex gap-4">
          <motion.button
            onClick={handleCreate}
            className="bg-yellow-400 text-black font-semibold px-6 py-2 rounded-full shadow-lg hover:bg-yellow-500 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            + Create Template
          </motion.button>

          <motion.button
            onClick={() => navigate("/dashboard")}
            className="bg-gray-700 text-white font-semibold px-6 py-2 rounded-full shadow-lg hover:bg-gray-600 transition"
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
              className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-bold text-yellow-300 mb-2">
                {template.name || "Untitled Template"}
              </h3>
              <p className="text-sm text-gray-400 mb-2">
                <strong>Subject:</strong> {template.subject}
              </p>
              <p className="text-gray-300 text-sm mb-4">
                {template.global ? "🌍 Global Template" : "👤 Your Template"}
              </p>
              <div
                className="text-sm text-white/80 mb-4 max-h-24 overflow-hidden"
                dangerouslySetInnerHTML={{ __html: template.body }}
              ></div>

              <div className="flex flex-wrap gap-2">
                {/* Copy Button */}
                <button
                  onClick={() => {
                    const content = `Subject: ${template.subject}\n\n${template.body}`;
                    navigator.clipboard.writeText(content);
                    alert("📋 Template copied to clipboard!");
                  }}
                  className="px-4 py-2 text-sm bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition"
                >
                  Copy
                </button>

                {!template.global && (
                  <>
                    <button
                      onClick={() => handleEdit(template)}
                      className="px-4 py-2 text-sm bg-indigo-500 rounded-lg hover:bg-indigo-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(template._id)}
                      className="px-4 py-2 text-sm bg-red-500 rounded-lg hover:bg-red-600 transition"
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
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-900 p-6 rounded-xl w-full max-w-lg text-white"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h2 className="text-2xl font-bold mb-4">
                {editingTemplate ? "Edit Template" : "Create Template"}
              </h2>
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="w-full mb-3 p-2 rounded bg-gray-800 text-white border border-gray-700"
                placeholder="Template Name"
              />
              <input
                type="text"
                value={templateSubject}
                onChange={(e) => setTemplateSubject(e.target.value)}
                className="w-full mb-3 p-2 rounded bg-gray-800 text-white border border-gray-700"
                placeholder="Template Subject"
              />
              <textarea
                value={templateBody}
                onChange={(e) => setTemplateBody(e.target.value)}
                className="w-full mb-3 p-2 rounded bg-gray-800 text-white border border-gray-700"
                placeholder="Template Body (HTML allowed)"
                rows={6}
              ></textarea>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setOpenModal(false)}
                  className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600"
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
