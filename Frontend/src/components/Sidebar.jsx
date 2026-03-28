import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FaChartLine, 
  FaHistory, 
  FaUserCircle, 
  FaRobot, 
  FaSignOutAlt 
} from 'react-icons/fa';
import { UserContext } from '../context/UserContext'; // Import your context
import { toast } from 'react-toastify';
import './Sidebar.css';

const Sidebar = () => {
  const { setUserInfo } = useContext(UserContext);
  const navigate = useNavigate();

  // Functional Logout Logic
  const handleLogout = async () => {
    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL + "/api/v1/users/logout",
        {
          credentials: "include",
          method: "POST",
        }
      );
      if (response.ok) {
        setUserInfo(null); // Clear user state
        toast.success("Logged out successfully");
        navigate("/"); // Send back to home page
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="sidebar-container">
      <div className="sidebar-header">
        <h3 className="sidebar-title">MediMind <span>Pro</span></h3>
      </div>
      
      <nav className="sidebar-menu">
        {/* 'end' ensures this is only active on /dashboard, not its children */}
        <NavLink to="/dashboard" end className={({ isActive }) => isActive ? "menu-link active" : "menu-link"}>
          <FaChartLine className="icon" /> <span>Analytics Overview</span>
        </NavLink>
        
        <NavLink to="/dashboard/chat" className={({ isActive }) => isActive ? "menu-link active" : "menu-link"}>
          <FaRobot className="icon" /> <span>AI MediBot</span>
        </NavLink>

        <NavLink to="/dashboard/history" className={({ isActive }) => isActive ? "menu-link active" : "menu-link"}>
          <FaHistory className="icon" /> <span>Test History</span>
        </NavLink>

        <NavLink to="/dashboard/profile" className={({ isActive }) => isActive ? "menu-link active" : "menu-link"}>
          <FaUserCircle className="icon" /> <span>My Profile</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="logout-zone" onClick={handleLogout} style={{ cursor: 'pointer' }}>
             <FaSignOutAlt /> <span>Logout</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;