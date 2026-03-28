import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import logo from "../assets/medimind-logo.png";
import { UserContext } from "../context/UserContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Navbar() {
  const { userInfo, setUserInfo, loading } = useContext(UserContext); 
  const [isMobile, setIsMobile] = useState(false);

  const logout = async () => {
    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL + "/api/v1/users/logout",
        {
          credentials: "include",
          method: "POST",
        }
      );
      if (response.ok) {
        setUserInfo(null);
        toast.success("You have been logged out successfully!", {
          autoClose: 2000,
        });
        setTimeout(() => {
          window.location = "/"; 
        }, 2000);
      }
    } catch (error) {
      console.error("Logout failed with error:", error);
    }
  };

  const username = userInfo?.data?.username;

  const toggleMobileMenu = () => {
    setIsMobile(!isMobile);
  };

  const handleLinkClick = () => {
    if (isMobile) {
      setIsMobile(false);
    }
  };

  if (loading) {
    return null; 
  }

  return (
    <nav className="navbar">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="navbar-logo">
        <img src={logo} alt="MediMind" />
      </div>
      <div className={`navbar-links ${isMobile ? "mobile active" : ""}`}>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "navbar-link active" : "navbar-link"
          }
          onClick={handleLinkClick}
        >
          Home
        </NavLink>
        <NavLink
          to="/predictors"
          className={({ isActive }) =>
            isActive ? "navbar-link active" : "navbar-link"
          }
          onClick={handleLinkClick}
        >
          Predictors
        </NavLink>

        {/* --- ADDED DASHBOARD LINK (ONLY FOR LOGGED IN USERS) --- */}
        {username && (
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "navbar-link active" : "navbar-link"
            }
            onClick={handleLinkClick}
          >
            Dashboard
          </NavLink>
        )}

        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? "navbar-link active" : "navbar-link"
          }
          onClick={handleLinkClick}
        >
          About us
        </NavLink>

        {username ? (
          <div className={`navbar-auth ${isMobile ? "mobile" : ""}`}>
            <span
              style={{
                fontFamily: "Arial, sans-serif",
                fontWeight: "bold",
                fontSize: "1.2rem",
              }}
            >
              Hello, {username}
            </span>
            <button
              onClick={logout}
              className="btn btn-logout"
              style={{ cursor: "pointer" }}
            >
              Logout
            </button>
          </div>
        ) : (
          <div className={`navbar-auth ${isMobile ? "mobile" : ""}`}>
            <NavLink
              to="/login"
              className="btn btn-login"
              onClick={handleLinkClick}
            >
              Log In
            </NavLink>
            <NavLink
              to="/signup"
              className="btn btn-signup"
              onClick={handleLinkClick}
            >
              Sign Up
            </NavLink>
          </div>
        )}
      </div>
      <div className="hamburger" onClick={toggleMobileMenu}>
        {isMobile ? <FaTimes size={30} /> : <FaBars size={30} />}
      </div>
    </nav>
  );
}

export default Navbar;