import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, LogIn } from "lucide-react";
import { Spinner } from "../components/Spinner.jsx";
import { api } from "../api/axiosInstance.js";
import { AuthContext } from "../context/AuthContext";
import CreateGroupModal from "../components/CreateGroupModal";
import JoinGroupModal from "../components/JoinGroupModal";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  const fetchGroups = async () => {
    try {
      const res = await api.get("/groups/mine");
      setGroups(res.data.groups);
    } catch (error) {
      console.error("Failed to fetch groups:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleGroupCreated = (newGroup) => {
    setGroups((prev) => [...prev, newGroup]);
  };

  const handleGroupJoined = () => {
    fetchGroups();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-black dark:text-white">
          Hey, {user?.username} 👋
        </h1>
      </div>

      <div className="flex gap-3 mb-8">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-primary text-white rounded-lg px-4 py-2 font-medium"
        >
          <Plus size={18} /> Create Group
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowJoinModal(true)}
          className="flex items-center gap-2 border border-primary text-primary rounded-lg px-4 py-2 font-medium"
        >
          <LogIn size={18} /> Join Group
        </motion.button>
      </div>

      {loading ? <Spinner />  : groups.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 dark:text-gray-400 mb-2">You're not in any groups yet.</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm">Create one or join with an invite code to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {groups.map((group) => (
            <motion.div
              key={group._id}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/groups/${group._id}`)}
              className="cursor-pointer border border-gray-200 dark:border-gray-800 rounded-xl p-4 hover:border-primary transition-colors"
            >
              <h3 className="font-semibold text-black dark:text-white">{group.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                🔥 {group.streakCount} day streak
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                {group.members.length} member{group.members.length !== 1 ? "s" : ""}
              </p>
            </motion.div>
          ))}
        </div>
      )}

      <CreateGroupModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onGroupCreated={handleGroupCreated}
      />
      <JoinGroupModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        onGroupJoined={handleGroupJoined}
      />
    </div>
  );
};

export default Dashboard;