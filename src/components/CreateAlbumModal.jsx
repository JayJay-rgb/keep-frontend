import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { api } from "../api/axiosInstance.js";
import Modal from "./Modal.jsx";

const CreateAlbumModal = ({ isOpen, onClose, onAlbumCreated, groupId }) => {
  const [title, setTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post(`/albums/group/${groupId}`, { title, eventDate });
      toast.success("Album created!");
      onAlbumCreated(res.data.album);
      setTitle("");
      setEventDate("");
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Couldn't create album");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4 text-black dark:text-white">New Album</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Album title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="border border-gray-300 dark:border-gray-700 bg-transparent text-black dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
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
    </Modal>
  );
};

export default CreateAlbumModal;