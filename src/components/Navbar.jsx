import { useContext } from "react";
import { Link } from "react-router-dom";
import { Sun, Moon, LayoutDashboard } from "lucide-react";
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";
import Logout from "./Logout.jsx";

const Navbar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
      <Link to="/">
        <h1 className="text-xl font-bold text-primary">Keep</h1>
      </Link>

      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
        >
          <LayoutDashboard size={18} />
          <span className="hidden sm:inline">Dashboard</span>
        </Link>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors dark:bg-blue-900"
          aria-label="Toggle theme"
        >
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        <NotificationBell />

        <Link to="/profile">
          <img
            src={user?.profilePicture}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover border border-gray-300 dark:border-gray-700"
          />
        </Link>

        <Logout />
      </div>
    </nav>
  );
};

export default Navbar;