import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../api/axiosInstance.js";
import Modal from "./Modal";

const CreateGroupModal = ({ isOpen, onClose, onGroupCreated }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [createdGroup, setCreatedGroup] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/groups/", { name });
      toast.success("Group created!");
      onGroupCreated(res.data.group);
      setCreatedGroup(res.data.group);
      setName("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Couldn't create group");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(createdGroup.inviteCode);
    setCopied(true);
    toast.success("Copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setCreatedGroup(null);
    setCopied(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      {createdGroup ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center gap-3"
        >
          <h2 className="text-xl font-bold text-black dark:text-white">
            🎉 {createdGroup.name} is ready!
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Share this invite code with your people
          </p>

          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-3 w-full justify-center">
            <span className="text-xl font-mono font-bold text-primary">
              {createdGroup.inviteCode}
            </span>
            <button onClick={handleCopy} className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleClose}
            className="bg-primary text-white rounded-lg py-2 px-6 font-medium mt-2"
          >
            Done
          </motion.button>
        </motion.div>
      ) : (
        <>
          <h2 className="text-xl font-bold mb-4 text-black dark:text-white">Create a Group</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Group name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="border border-gray-300 dark:border-gray-700 bg-transparent text-black dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="bg-primary text-white rounded-lg py-2 font-medium disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create"}
            </motion.button>
          </form>
        </>
      )}
    </Modal>
  );
};

export default CreateGroupModal;