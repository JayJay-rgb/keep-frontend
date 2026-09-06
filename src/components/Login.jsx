import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext.jsx";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate("/");
      setEmail("");
      setPassword("");
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-sm mx-auto bg-white dark:bg-black p-6 rounded-2xl"
    >
      <h1 className="text-2xl font-bold text-primary mb-6">Log In</h1>
      <div>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {errorMessage && (
            <div className="text-sm text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400 rounded-lg px-3 py-2">
              {errorMessage}
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-300 dark:border-gray-700 bg-transparent text-black dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-300 dark:border-gray-700 bg-transparent text-black dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="bg-primary text-white rounded-lg py-2 font-medium mt-2 hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log in"}
          </motion.button>

          <div className="flex items-center gap-2 my-2">
            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
            <span className="text-xs text-gray-500 dark:text-gray-400">OR</span>
            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
          </div>

          
           <a href={`${import.meta.env.VITE_API_URL}/auth/google`}
            className="border border-gray-300 dark:border-gray-700 rounded-lg py-2 text-center font-medium text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
          >
            Continue with Google
          </a>
        </form>
      </div>
    </motion.div>
  );
};

export default Login;