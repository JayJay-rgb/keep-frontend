import { useState, useContext } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { api } from "../api/axiosInstance.js";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export const Profile = () => {
  const { user, fetchProfile } = useContext(AuthContext);
  const [username, setUsername] = useState(user?.username || "");
  const [faceRecognitionOptIn, setFaceRecognitionOptIn] = useState(user?.faceRecognitionOptIn || false);
  const [loading, setLoading] = useState(false);
  const [pictureLoading, setPictureLoading] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.patch("/users/me", { username, faceRecognitionOptIn });
      await fetchProfile();
      toast.success("Profile updated!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Couldn't update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePicture", file);

    setPictureLoading(true);
    try {
      await api.patch("/users/me/picture", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await fetchProfile();
      toast.success("Profile picture updated!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Couldn't update picture");
    } finally {
      setPictureLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
     <div className="flex items-center gap-3 mb-6">
  <Link to="/" className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">
    <ArrowLeft size={20} />
  </Link>
  <h1 className="text-2xl font-bold text-black dark:text-white">Your Profile</h1>
</div>
      <div className="flex flex-col items-center gap-3 mb-8">
        <img
          src={user?.profilePicture}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border-2 border-primary"
        />
        <label className="text-primary text-sm font-medium cursor-pointer">
          {pictureLoading ? "Uploading..." : "Change photo"}
          <input
            type="file"
            accept="image/*"
            onChange={handlePictureChange}
            disabled={pictureLoading}
            className="hidden"
          />
        </label>
      </div>

      <motion.form
        onSubmit={handleProfileUpdate}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 bg-transparent text-black dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex items-center justify-between border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3">
          <div>
            <p className="text-sm font-medium text-black dark:text-white">Face recognition</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Let Keep suggest tags for you in group photos</p>
          </div>
          <button
            type="button"
            onClick={() => setFaceRecognitionOptIn((prev) => !prev)}
            className={`w-11 h-6 rounded-full transition-colors relative ${
              faceRecognitionOptIn ? "bg-primary" : "bg-gray-300 dark:bg-gray-700"
            }`}
          >
            <motion.div
              animate={{ x: faceRecognitionOptIn ? 20 : 2 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="w-5 h-5 bg-white rounded-full absolute top-0.5"
            />
          </button>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={loading}
          className="bg-primary text-white rounded-lg py-2 font-medium disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save changes"}
        </motion.button>
      </motion.form>
    </div>
  );
};

