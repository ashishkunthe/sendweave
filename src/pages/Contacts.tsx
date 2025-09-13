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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black text-white">
        <div className="relative w-16 h-16 mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-t-yellow-500 border-gray-700 animate-spin"></div>
        </div>

        <p className="text-lg font-medium text-gray-300 animate-pulse">
          Loading Contacts...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white px-6 py-10">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-white">Your Contacts</h1>
        <div className="flex gap-4">
          <motion.button
            onClick={() => setOpenAddModal(true)}
            className="px-6 py-2 rounded-lg bg-black border border-yellow-500/40 text-white font-semibold hover:bg-yellow-500/20 hover:border-yellow-500 transition shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            + Add Contact
          </motion.button>
          <motion.button
            onClick={() => setOpenUploadModal(true)}
            className="px-6 py-2 rounded-lg bg-black border border-blue-500/40 text-white font-semibold hover:bg-blue-500/20 hover:border-blue-500 transition shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Upload CSV
          </motion.button>
          <motion.button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-2 rounded-lg bg-black border border-green-500/40 text-white font-semibold hover:bg-green-500/20 hover:border-green-500 transition shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back to Dashboard
          </motion.button>
        </div>
      </header>

      {error ? (
        <p className="text-red-500">{error}</p>
      ) : contacts.length === 0 ? (
        <p className="text-gray-500">No contacts found. Start by adding one!</p>
      ) : (
        <div className="max-w-3xl mx-auto bg-black/60 rounded-xl shadow-lg overflow-y-auto max-h-[70vh] custom-scrollbar">
          <ul className="divide-y divide-gray-700">
            {contacts.map((contact) => (
              <li
                key={contact._id}
                className="flex items-center justify-between p-4"
              >
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {contact.name || "Unnamed Contact"}
                  </h3>
                  <p className="text-gray-300">{contact.email}</p>
                  {contact.tags?.length > 0 && (
                    <p className="text-sm text-gray-400">
                      Tags: {contact.tags.join(", ")}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(contact._id)}
                  className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
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
              className="bg-gradient-to-br from-black via-gray-900 to-black p-8 rounded-2xl w-full max-w-lg text-white shadow-xl border border-gray-800"
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
            >
              <h2 className="text-3xl font-extrabold mb-6 text-white text-center">
                Add New Contact
              </h2>

              <div className="space-y-4">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:border-yellow-500 focus:ring focus:ring-yellow-500/20 outline-none transition"
                  placeholder="Full Name"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:border-yellow-500 focus:ring focus:ring-yellow-500/20 outline-none transition"
                  placeholder="Email Address"
                />
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:border-yellow-500 focus:ring focus:ring-yellow-500/20 outline-none transition"
                  placeholder="Tags (comma separated)"
                />
              </div>

              <div className="flex justify-end gap-4 mt-8">
                <button
                  onClick={() => setOpenAddModal(false)}
                  className="px-5 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddContact}
                  className="px-5 py-2 rounded-lg bg-black border border-yellow-500/40 text-white font-semibold hover:bg-yellow-500/20 hover:border-yellow-500 transition text-sm shadow-md"
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
              className="bg-gradient-to-br from-black via-gray-900 to-black p-8 rounded-2xl w-full max-w-lg text-white shadow-xl border border-gray-800"
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
            >
              <h2 className="text-3xl font-extrabold mb-3 text-white">
                Upload Contacts CSV
              </h2>
              <p className="text-sm text-gray-300 mb-6 leading-relaxed">
                Please ensure your CSV contains columns:{" "}
                <span className="text-gray-200 font-medium">name</span>,{" "}
                <span className="text-gray-200 font-medium">email</span>, and{" "}
                <span className="text-gray-200 font-medium">tags</span>.
              </p>

              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-yellow-500 transition mb-6 bg-gray-900/40"
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

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setOpenUploadModal(false)}
                  className="px-5 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCSVUpload}
                  className="px-5 py-2 rounded-lg bg-black border border-yellow-500/40 text-white font-semibold hover:bg-yellow-500/20 hover:border-yellow-500 transition text-sm shadow-md"
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
