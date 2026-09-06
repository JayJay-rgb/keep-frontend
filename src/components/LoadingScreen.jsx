import { motion } from "framer-motion";

const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-4 border-gray-200 dark:border-gray-800 border-t-primary rounded-full"
      />
      <motion.h1
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="text-lg font-semibold text-primary"
      >
        Keep
      </motion.h1>
    </div>
  );
};

export default LoadingScreen;