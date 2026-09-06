import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Copy } from "lucide-react";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import EmotionAwards from "../components/EmotionAwards";
import { Spinner } from "./Spinner.jsx";
import { api } from "../api/axiosInstance.js";
import { AuthContext } from "../context/AuthContext";
import CreateAlbumModal from "../components/CreateAlbumModal";
import GroupExtras from "../components/GroupExtras";
import MembersPanel from "../components/MembersPanel";

export const GroupView = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [albums, setAlbums] = useState([]);
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchAlbums = async () => {
    try {
      const res = await api.get(`/albums/group/${groupId}`);
      setAlbums(res.data.foundAlbums);
    } catch (error) {
      toast.error("Couldn't load albums");
    } finally {
      setLoading(false);
    }
  };

  const fetchGroup = async () => {
    try {
      const res = await api.get(`/groups/${groupId}`);
      setGroup(res.data.group);
    } catch (error) {
      toast.error("Couldn't load group");
    }
  };

  useEffect(() => {
    fetchGroup();
    fetchAlbums();
  }, [groupId]);

  const handleAlbumCreated = (newAlbum) => {
    setAlbums((prev) => [...prev, newAlbum]);
  };

  const handleDeleteAlbum = async (e, albumId) => {
    e.stopPropagation();
    if (
      !window.confirm(
        "Delete this album? Photos inside will stay, but the album will be gone.",
      )
    )
      return;

    try {
      await api.delete(`/albums/${albumId}`);
      setAlbums((prev) => prev.filter((a) => a._id !== albumId));
      toast.success("Album deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Couldn't delete album");
    }
  };

  const handleMemberKicked = (targetUserId) => {
    setGroup((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m._id !== targetUserId),
    }));
  };

  const isAdmin = group?.admin?._id === user?._id;

  return (
    <div>
      {group?.inviteCode && (
        <div className="flex items-center justify-between border border-gray-200 dark:border-gray-800 rounded-xl p-4 mb-6">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Invite code
            </p>
            <p className="text-lg font-mono font-semibold text-black dark:text-white">
              {group.inviteCode}
            </p>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(group.inviteCode);
              toast.success("Invite code copied!");
            }}
            className="flex items-center gap-2 text-primary text-sm font-medium"
          >
            <Copy size={16} /> Copy
          </button>
        </div>
      )}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-black dark:text-white">
            {group?.name}
          </h1>
        </div>
        <div className="flex gap-3">
          <Link
            to={`/groups/${groupId}/feed`}
            className="flex items-center gap-2 border border-primary text-primary rounded-lg px-4 py-2 font-medium"
          >
            View Feed
          </Link>
          {isAdmin && (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-primary text-white rounded-lg px-4 py-2 font-medium"
            >
              <Plus size={18} /> New Album
            </motion.button>
          )}
        </div>
      </div>

      {group && <GroupExtras groupId={groupId} />}
      {group && <EmotionAwards groupId={groupId} />}

      {group && (
        <MembersPanel
          group={group}
          currentUserId={user?._id}
          isAdmin={isAdmin}
          groupId={groupId}
          onMemberKicked={handleMemberKicked}
        />
      )}

      <h2 className="text-lg font-semibold text-black dark:text-white mb-3">
        Albums
      </h2>

      {loading ? (
        <Spinner />
      ) : albums.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 dark:text-gray-400 mb-2">
            No albums yet.
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm">
            Create one to start uploading memories.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {albums.map((album) => (
            <motion.div
              key={album._id}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/albums/${album._id}`)}
              className="relative cursor-pointer border border-gray-200 dark:border-gray-800 rounded-xl p-4 hover:border-primary transition-colors group"
            >
              <h3 className="font-semibold text-black dark:text-white">
                {album.title}
              </h3>
              {album.eventDate && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {new Date(album.eventDate).toLocaleDateString()}
                </p>
              )}
              {isAdmin && (
                <button
                  onClick={(e) => handleDeleteAlbum(e, album._id)}
                  className="absolute top-3 right-3 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Delete album"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </motion.div>
          ))}
        </div>
      )}

      <CreateAlbumModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onAlbumCreated={handleAlbumCreated}
        groupId={groupId}
      />
    </div>
  );
};
