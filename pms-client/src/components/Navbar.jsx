import { BellIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useEffect, useState, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation(); // 👈 this ensures re-evaluation on route change

  // 👇 Decode and set user from token
  const loadUserFromToken = () => {
    const token = localStorage.getItem("token");
    if (token && token.split(".").length === 3) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          name: decoded.name || decoded.sub || "User",
          role: decoded.role || "User",
          email: decoded.email || "",
          loginTime: decoded.iat
            ? new Date(decoded.iat * 1000).toLocaleString()
            : "",
        });
      } catch (error) {
        console.error("Invalid token", error);
        localStorage.removeItem("token");
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    loadUserFromToken(); // initial check

    const handleStorageChange = () => {
      loadUserFromToken(); // react to storage/token changes
    };

    window.addEventListener("storage", handleStorageChange);
    document.addEventListener("token-changed", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      document.removeEventListener("token-changed", handleStorageChange);
    };
  }, []);

  // 👇 Also check token again whenever route changes
  useEffect(() => {
    loadUserFromToken();
  }, [location.pathname]);

  // ✅ Outside Click Close Logic
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
    window.dispatchEvent(new Event("storage")); // Notify other tabs/components
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    return parts.map((p) => p[0]).join("").toUpperCase();
  };

  return (
    <header className="bg-white shadow-sm relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-800">
              Parcel Management
            </h1>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            <button
              type="button"
              className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <MagnifyingGlassIcon className="h-6 w-6" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <BellIcon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Show avatar only if user is logged in */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <div
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="relative h-10 w-10 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold cursor-pointer"
                >
                  {getInitials(user.name)}
                  <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></span>
                </div>

                {/* Dropdown Menu */}
                <div
                  className={`absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg p-4 z-50 transform origin-top-right transition-all duration-300 ease-out ${
                    dropdownOpen
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-95 pointer-events-none"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 flex items-center justify-center rounded-full bg-blue-500 text-white text-lg font-bold">
                      {getInitials(user.name)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {user.name}
                      </p>
                      <p className="text-sm text-gray-500">{user.role}</p>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-gray-600">
                    <p>
                      <span className="font-medium">Email:</span> {user.email}
                    </p>
                    <p>
                      <span className="font-medium">Login Time:</span>{" "}
                      {user.loginTime}
                    </p>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={handleLogout}
                      className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <a
                href="/login"
                className="text-blue-500 hover:text-blue-600 font-semibold"
              >
                Login
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
