import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import  Signup  from "../components/Register.jsx";
import Login  from "../components/Login.jsx";

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black px-4">
      
      {/* MOBILE VIEW — single form, fades between login/signup */}
      <div className="w-full max-w-sm md:hidden">
        <AnimatePresence mode="wait">
          {isLogin ? (
            <motion.div
              key="login"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              
              <Login />
              <button onClick={() => setIsLogin(false)} className="text-primary mt-4">
                Don't have an account? Sign up
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="signup"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <Signup />
              <button onClick={() => setIsLogin(true)} className="text-primary mt-4">
                Already have an account? Log in
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* DESKTOP VIEW — split panel with sliding overlay */}
      <div className="hidden md:block relative w-[768px] h-[480px] overflow-hidden rounded-2xl shadow-lg">
        
        <div className="absolute top-0 left-0 w-1/2 h-full flex items-center justify-center">
          <Signup />
          
        </div>

        <div className="absolute top-0 right-0 w-1/2 h-full flex items-center justify-center">
          <Login/>
        </div>

        <motion.div
          animate={{ x: isLogin ? "0%" : "100%" }}
          transition={{ type: "tween", duration: 0.5, ease: "easeInOut" }}
          className="absolute top-0 left-0 w-1/2 h-full bg-primary text-white flex flex-col items-center justify-center gap-4 px-8"
        >
          {isLogin ? (
            <>
              <h2 className="text-2xl font-bold">New here?</h2>
              <p className="text-center text-sm">Sign up and start keeping memories with your people.</p>
              <button onClick={() => setIsLogin(false)} className="border border-white rounded-lg px-6 py-2 font-medium">
                Sign up
              </button>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold">Welcome back</h2>
              <p className="text-center text-sm">Already have an account? Log back in.</p>
              <button onClick={() => setIsLogin(true)} className="border border-white rounded-lg px-6 py-2 font-medium">
                Log in
              </button>
            </>
          )}
        </motion.div>

      </div>
    </div>
  );
}

export default AuthPage;