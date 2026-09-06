import React from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { toast } from "react-hot-toast"
import { AuthContext } from "../context/AuthContext.jsx";
import { motion } from "framer-motion";

const Logout = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  async function handleLogout(e) {
    e.preventDefault();
    try {
      await logout();
      toast.success("Logged out");
      navigate("/auth");
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong logging out");
    }
  }
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={handleLogout}
      className="border border-primary text-primary rounded-lg px-4 py-2 font-medium hover:bg-primary hover:text-white transition-colors"
    >
      Log out
    </motion.button>
  );
};

export default Logout;
