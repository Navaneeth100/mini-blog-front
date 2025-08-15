import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}

        <Link to="/" className="flex items-center gap-2 text-decoration-none">
          <img
            src="https://www.shutterstock.com/image-vector/write-blog-post-icon-blogging-600nw-2417074323.jpg"
            alt="Logo"
            className="h-8 w-8"
          />
          <span className="text-lg font-semibold">QuickPost</span>
        </Link>

        {/* Links */}

        <div className="flex items-center gap-3">
          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 border border-black-500 text-black-500 rounded hover:bg-white-50 transition text-decoration-none"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 border border-black-500 text-black-500 rounded hover:bg-white-50 transition text-decoration-none"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                className="px-4 py-2 border border-green-500 text-green-500 rounded hover:bg-green-50 transition text-decoration-none"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-white-500 text-black rounded hover:bg-black-600 transition text-decoration-none"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
export default Navbar