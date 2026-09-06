import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { X, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../api/axiosInstance.js";

const MembersPanel = ({ group, currentUserId, isAdmin, groupId, onMemberKicked }) => {
  const navigate = useNavigate();
  const [leaving, setLeaving] = useState(false);

  const handleKick = async (targetUserId) => {
    try {
      await api.delete(`/groups/${groupId}/members/${targetUserId}`);
      toast.success("Member removed");
      onMemberKicked(targetUserId);
    } catch (error) {
      toast.error(error.response?.data?.message || "Couldn't remove member");
    }
  };

  const handleLeave = async () => {
    setLeaving(true);
    try {
      await api.post(`/groups/leave/${groupId}`);
      toast.success("You left the group");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Couldn't leave group");
      setLeaving(false);
    }
  };

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-4 mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-black dark:text-white">Members</h2>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleLeave}
          disabled={leaving}
          className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 transition-colors"
        >
          <LogOut size={16} /> {leaving ? "Leaving..." : "Leave group"}
        </motion.button>
      </div>

      <div className="flex flex-col gap-2">
        {group?.members?.map((member) => (
          <div
            key={member._id}
            className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900"
          >
            <div className="flex items-center gap-2">
              <img
                src={member.profilePicture}
                alt={member.username}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-sm text-black dark:text-white">
                {member.username}
                {group.admin?._id === member._id && (
                  <span className="text-xs text-primary ml-2">Admin</span>
                )}
              </span>
            </div>

            {isAdmin && member._id !== currentUserId && (
              <button
                onClick={() => handleKick(member._id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
                aria-label="Remove member"
              >
                <X size={16} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MembersPanel;