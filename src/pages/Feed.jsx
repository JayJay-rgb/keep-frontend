import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, RefreshCw, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { Download } from "lucide-react";
import { api } from "../api/axiosInstance.js";
import { Spinner } from "../components/Spinner.jsx";
import { SocketContext } from "../context/SocketContext";

export const Feed = () => {
  const { groupId } = useParams();
  const { socket } = useContext(SocketContext);

  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeed = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/media/group/${groupId}/feed`);
      setFeed(res.data.feed);
    } catch (error) {
      toast.error("Couldn't load feed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, [groupId]);

  useEffect(() => {
    if (!socket) return;

    socket.emit("join-group", groupId);

    const handleNewMedia = (media) => {
      setFeed((prev) => [media, ...prev]);
      toast.success("New memory added!");
    };

    const handleNewReaction = ({ mediaId, reactions }) => {
      setFeed((prev) =>
        prev.map((item) =>
          item._id === mediaId ? { ...item, reactions } : item,
        ),
      );
    };

    const handleDownloadSingle = async (url, id, type) => {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        const objectUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = objectUrl;
        link.setAttribute(
          "download",
          `keep-memory-${id}.${type === "video" ? "mp4" : "jpg"}`,
        );
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(objectUrl);
      } catch (error) {
        toast.error("Couldn't download");
      }
    };

    socket.on("new-media", handleNewMedia);
    socket.on("new-reaction", handleNewReaction);

    return () => {
      socket.off("new-media", handleNewMedia);
      socket.off("new-reaction", handleNewReaction);
    };
  }, [socket, groupId]);

  const handleReact = async (mediaId, emoji) => {
    try {
      const res = await api.post(`/media/${mediaId}/react`, { emoji });
      setFeed((prev) =>
        prev.map((item) =>
          item._id === mediaId
            ? { ...item, reactions: res.data.reactions }
            : item,
        ),
      );
    } catch (error) {
      toast.error("Couldn't react");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            to={`/groups/${groupId}`}
            className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-black dark:text-white">
            Feed
          </h1>
        </div>

        <motion.button
          whileTap={{ scale: 0.9, rotate: 180 }}
          onClick={fetchFeed}
          disabled={loading}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-200 dark:bg-blue-900 transition-colors"
          aria-label="Shuffle feed"
        >
          <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
        </motion.button>
      </div>

      {loading ? <Spinner />  : feed.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 dark:text-gray-400 mb-2">
            No memories in this group yet.
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm">
            Upload some photos to see them here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {feed.map((item) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800"
            >
              {item.type === "video" ? (
                <video
                  src={item.url}
                  className="w-full h-64 object-cover"
                  controls
                />
              ) : (
                <img
                  src={item.url}
                  alt="memory"
                  className="w-full h-64 object-cover"
                />
              )}

              <div className="p-3 flex items-center justify-between">
                <button
                  onClick={() => handleReact(item._id, "❤️")}
                  className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200"
                >
                  <Heart
                    size={16}
                    fill={item.reactions?.["❤️"]?.length ? "#ef4444" : "none"}
                    color={
                      item.reactions?.["❤️"]?.length
                        ? "#ef4444"
                        : "currentColor"
                    }
                  />
                  {item.reactions?.["❤️"]?.length || 0}
                </button>

                <button
                  onClick={() => handleReact(item._id, "😂")}
                  className="text-sm px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  😂 {item.reactions?.["😂"]?.length || 0}
                </button>

                <button
                  onClick={() => handleReact(item._id, "🔥")}
                  className="text-sm px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  🔥 {item.reactions?.["🔥"]?.length || 0}
                </button>

                <button
                  onClick={() =>
                    handleDownloadSingle(item.url, item._id, item.type)
                  }
                  className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200"
                  aria-label="Download"
                >
                  <Download size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
