import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { api } from "../api/axiosInstance.js";
import Modal from "./Modal";

const JoinGroupModal = ({ isOpen, onClose, onGroupJoined }) => {
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post(`/groups/join/${inviteCode}`);
      toast.success("Joined group!");
      onGroupJoined();
      setInviteCode("");
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Couldn't join group");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4 text-black dark:text-white">Join a Group</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Invite code"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
          required
          className="border border-gray-300 dark:border-gray-700 bg-transparent text-black dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <motion.button
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={loading}
          className="bg-primary text-white rounded-lg py-2 font-medium disabled:opacity-50"
        >
          {loading ? "Joining..." : "Join"}
        </motion.button>
      </form>
    </Modal>
  );
};

export default JoinGroupModal;