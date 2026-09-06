import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const Lightbox = ({ item, onClose }) => {
  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            aria-label="Close"
          >
            <X size={28} />
          </button>

          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl max-h-[85vh]"
          >
            {item.type === "video" ? (
              <video src={item.url} className="max-w-full max-h-[85vh] rounded-lg" controls autoPlay />
            ) : (
              <img src={item.url} alt="memory" className="max-w-full max-h-[85vh] rounded-lg object-contain" />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Lightbox;