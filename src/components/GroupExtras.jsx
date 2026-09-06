import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { api } from "../api/axiosInstance.js";

const GroupExtras = ({ groupId }) => {
  const [stats, setStats] = useState(null);
  const [onThisDay, setOnThisDay] = useState([]);
  const [memoryOfWeek, setMemoryOfWeek] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExtras = async () => {
      try {
        const [statsRes, otdRes, motwRes] = await Promise.all([
          api.get(`/media/group/${groupId}/stats`),
          api.get(`/media/group/${groupId}/on-this-day`),
          api.get(`/media/group/${groupId}/memory-of-week`),
        ]);
        setStats(statsRes.data);
        setOnThisDay(otdRes.data.memories || []);
        setMemoryOfWeek(motwRes.data.recap || []);
      } catch (error) {
        console.error("Failed to load extras:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExtras();
  }, [groupId]);

  if (loading) return null;

  return (
    <div className="flex flex-col gap-8 mb-8">
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-primary">{stats.totalMedia}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total memories</p>
          </div>
          <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-primary">🔥 {stats.currentStreak}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Current streak</p>
          </div>
          <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-primary">🏆 {stats.longestStreak}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Longest streak</p>
          </div>
          <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-primary">{stats.totalMembers}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Members</p>
          </div>
          {stats.mostActiveUploader && (
            <div className="col-span-2 sm:col-span-4 border border-gray-200 dark:border-gray-800 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Most active: <span className="font-semibold text-black dark:text-white">{stats.mostActiveUploader.username}</span> ({stats.mostActiveUploader.uploadCount} uploads)
              </p>
            </div>
          )}
        </motion.div>
      )}

      {onThisDay.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-black dark:text-white mb-3">On This Day 📅</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {onThisDay.map((item) => (
              <div key={item._id} className="flex-shrink-0 w-40 h-40 rounded-xl overflow-hidden">
                {item.type === "video" ? (
                  <video src={item.url} className="w-full h-full object-cover" />
                ) : (
                  <img src={item.url} alt="memory" className="w-full h-full object-cover" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {memoryOfWeek.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-black dark:text-white mb-3">This Week's Memories ✨</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {memoryOfWeek.map((item) => (
              <div key={item._id} className="flex-shrink-0 w-40 h-40 rounded-xl overflow-hidden">
                {item.type === "video" ? (
                  <video src={item.url} className="w-full h-full object-cover" />
                ) : (
                  <img src={item.url} alt="memory" className="w-full h-full object-cover" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupExtras;