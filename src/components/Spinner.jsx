import { motion } from "framer-motion";

export const Spinner = ({ size = 24 }) => {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      style={{ width: size, height: size }}
      className="border-2 border-gray-200 dark:border-gray-800 border-t-primary rounded-full mx-auto"
    />
  );
};

