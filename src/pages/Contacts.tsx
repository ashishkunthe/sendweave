import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function Contacts() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openUploadModal, setOpenUploadModal] = useState(false);

  // Add Contact
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [tags, setTags] = useState("");

  // CSV Upload
  const [csvFile, setCsvFile] = useState<File | null>(null);

  // Fetch contacts
  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/contacts`,
        {
          headers: { Authorization: token },
        }
      );
      setContacts(res.data.contacts || []);
    } catch (err: any) {
      console.log(err);
      setError(err.response?.data?.message || "Failed to load contacts");
      toast.error("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Handle Delete
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this contact?"))
      return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/contacts/${id}`,
        {
          headers: { Authorization: localStorage.getItem("token") || "" },
        }
      );
      toast.success("Contact deleted");
      fetchContacts();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  // Handle Add Contact
  const handleAddContact = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const payload = {
        name,
        email,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      };

      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/contacts`,
        payload,
        {
          headers: { Authorization: token },
        }
      );

      toast.success("Contact added successfully");
      setOpenAddModal(false);
      setName("");
      setEmail("");
      setTags("");
      fetchContacts();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add contact");
    }
  };

  // Handle CSV Upload
  const handleCSVUpload = async () => {
    if (!csvFile) {
      toast.error("Please select a CSV file first.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const formData = new FormData();
      formData.append("file", csvFile);

      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/contacts/upload`,
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Contacts uploaded successfully");
      setOpenUploadModal(false);
      setCsvFile(null);
      fetchContacts();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Upload failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p className="text-lg animate-pulse">Loading contacts...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white px-6 py-10">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-yellow-400">Your Contacts</h1>
        <div className="flex gap-4">
          <motion.button
            onClick={() => setOpenAddModal(true)}
            className="bg-yellow-400 text-black font-semibold px-6 py-2 rounded-full shadow-lg hover:bg-yellow-500 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            + Add Contact
          </motion.button>
          <motion.button
            onClick={() => setOpenUploadModal(true)}
            className="bg-blue-500 text-white font-semibold px-6 py-2 rounded-full shadow-lg hover:bg-blue-600 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Upload CSV
          </motion.button>
          <motion.button
            onClick={() => navigate("/dashboard")}
            className="bg-green-500 text-white font-semibold px-6 py-2 rounded-full shadow-lg hover:bg-green-600 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back to Dashboard
          </motion.button>
        </div>
      </header>

      {error ? (
        <p className="text-red-400">{error}</p>
      ) : contacts.length === 0 ? (
        <p className="text-gray-400">No contacts found. Start by adding one!</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {contacts.map((contact) => (
            <motion.div
              key={contact._id}
              className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-bold text-yellow-300 mb-2">
                {contact.name || "Unnamed Contact"}
              </h3>
              <p className="text-gray-300 mb-2">{contact.email}</p>
              {contact.tags?.length > 0 && (
                <p className="text-sm text-gray-400 mb-2">
                  Tags: {contact.tags.join(", ")}
                </p>
              )}
              <button
                onClick={() => handleDelete(contact._id)}
                className="px-4 py-2 text-sm bg-red-500 rounded-lg hover:bg-red-600 transition"
              >
                Delete
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Contact Modal */}
      <AnimatePresence>
        {openAddModal && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 rounded-2xl w-full max-w-lg text-white shadow-xl border border-gray-700"
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
            >
              {/* Title */}
              <h2 className="text-3xl font-extrabold mb-6 text-yellow-400 text-center">
                Add New Contact
              </h2>

              {/* Input Fields */}
              <div className="space-y-4">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-yellow-400 focus:ring focus:ring-yellow-400/20 outline-none transition"
                  placeholder="Full Name"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-yellow-400 focus:ring focus:ring-yellow-400/20 outline-none transition"
                  placeholder="Email Address"
                />
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-yellow-400 focus:ring focus:ring-yellow-400/20 outline-none transition"
                  placeholder="Tags (comma separated)"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-4 mt-8">
                <button
                  onClick={() => setOpenAddModal(false)}
                  className="px-5 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddContact}
                  className="px-5 py-2 rounded-lg bg-yellow-400 text-black font-semibold hover:bg-yellow-500 transition text-sm"
                >
                  Add Contact
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload CSV Modal */}
      <AnimatePresence>
        {openUploadModal && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 rounded-2xl w-full max-w-lg text-white shadow-xl border border-gray-700"
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
            >
              {/* Title */}
              <h2 className="text-3xl font-extrabold mb-3 text-yellow-400">
                Upload Contacts CSV
              </h2>
              <p className="text-sm text-gray-300 mb-6 leading-relaxed">
                Please ensure your CSV contains columns:{" "}
                <span className="text-yellow-300 font-medium">name</span>,{" "}
                <span className="text-yellow-300 font-medium">email</span>, and{" "}
                <span className="text-yellow-300 font-medium">tags</span>.
              </p>

              {/* File Input */}
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-yellow-400 transition mb-6 bg-gray-800/40"
              >
                <svg
                  className="w-10 h-10 mb-3 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 16V4a1 1 0 011-1h8a1 1 0 011 1v12m-4 0v4m0 0H7m4 0h6"
                  />
                </svg>
                <span className="text-gray-300 text-sm">
                  Click or Drag & Drop CSV
                </span>
                <input
                  id="file-upload"
                  type="file"
                  accept=".csv"
                  onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>

              {/* Buttons */}
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setOpenUploadModal(false)}
                  className="px-5 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCSVUpload}
                  className="px-5 py-2 rounded-lg bg-yellow-400 text-black font-semibold hover:bg-yellow-500 transition text-sm"
                >
                  Upload CSV
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
