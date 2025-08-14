import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";


const TopNav = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("userName"); // optional
    if (token) {
      setIsAuthenticated(true);
      setUserName(user || "User");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setIsAuthenticated(false);
    setShowDropdown(false);
    navigate("/login");
  };

  return (
    <div className="flex justify-end items-center px-6 py-3 bg-white border-b shadow-sm relative">
      {isAuthenticated ? (
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 focus:outline-none"
          >
            <FaUserCircle className="text-2xl" />
            <span className="hidden sm:inline">{userName}</span>
          </button>

          {/* Dropdown */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-white border shadow-lg rounded-md z-50">
              <button
                onClick={() => navigate("/settings")}
                className="block px-4 py-2 w-full text-left hover:bg-gray-100"
              >
                Settings
              </button>
              <button
                onClick={handleLogout}
                className="block px-4 py-2 w-full text-left text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <Link
          to="/login"
          className="text-blue-600 font-medium hover:underline"
        >
          Login
        </Link>
      )}
    </div>
  );
};

export default TopNav;
