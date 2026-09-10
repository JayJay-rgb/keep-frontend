import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { api } from "../api/axiosInstance.js";

const AWARD_META = {
  happiest: { emoji: "😄", label: "Happiest Face" },
  saddest: { emoji: "😢", label: "Most Dramatic" },
  mostSurprised: { emoji: "😲", label: "Most Surprised" },
  angriest: { emoji: "😤", label: "Feistiest Face" },
};

const EmotionAwards = ({ groupId }) => {
  const [awards, setAwards] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAwards = async () => {
      try {
        const res = await api.get(`/media/group/${groupId}/emotion-awards`);
        setAwards(res.data.awards);
      } catch (error) {
        console.error("Couldn't load emotion awards:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAwards();
  }, [groupId]);

  if (loading || !awards || Object.keys(awards).length === 0) return null;

  const validAwards = Object.entries(awards).filter(([, data]) => data);
  if (validAwards.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-black dark:text-white mb-3">
  Today's Awards 🏅
</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {validAwards.map(([key, data]) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800"
          >
            <img src={data.url} alt={AWARD_META[key]?.label} className="w-full h-28 object-cover" />
            <div className="p-2 text-center">
              <p className="text-lg">{AWARD_META[key]?.emoji}</p>
              <p className="text-xs font-medium text-black dark:text-white">{AWARD_META[key]?.label}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default EmotionAwards;