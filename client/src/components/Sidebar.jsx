import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.css"; // Assuming you have a CSS file for styling

const Sidebar = ({ isOpen, toggleSidebar, activeItem }) => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // Clear all authentication data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    
    // Redirect to login page
    navigate("/");
  };

  return (
    <div className={`sidebar ${!isOpen ? 'closed' : ''}`}>
      <div className="status-indicator"></div>
      <button className="toggle-btn" onClick={toggleSidebar}>
        <i className={`fas ${isOpen ? 'fa-chevron-left' : 'fa-chevron-right'}`}></i>
      </button>
      
      <ul className="menu">
        <li>
          <Link to="/student" className={`menu-item ${activeItem === 'dashboard' ? 'active' : ''}`}>
            <i className="fas fa-home icon"></i>
            {isOpen && <span>Dashboard</span>}
          </Link>
        </li>
        <li>
          <Link to="/attendance" className={`menu-item ${activeItem === 'attendance' ? 'active' : ''}`}>
            <i className="fas fa-chart-bar icon"></i>
            {isOpen && <span>Attendance</span>}
          </Link>
        </li>
        <li>
          <Link to="/leaverequest" className={`menu-item ${activeItem === 'leave' ? 'active' : ''}`}>
            <i className="fas fa-calendar-alt icon"></i>
            {isOpen && <span>Leave Request</span>}
          </Link>
        </li>
        <li>
          <Link to="/feedback" className={`menu-item ${activeItem === 'feedback' ? 'active' : ''}`}>
            <i className="fas fa-comment icon"></i>
            {isOpen && <span>Feedback</span>}
          </Link>
        </li>
        <li>
          <Link to="/student/profile" className={`menu-item ${activeItem === 'profile' ? 'active' : ''}`}>
            <i className="fas fa-user-circle icon"></i>
            {isOpen && <span>Profile</span>}
          </Link>
        </li>
        <li>
          <button onClick={handleLogout} className="menu-item logout-btn">
            <i className="fas fa-sign-out-alt icon"></i>
            {isOpen && <span>Logout</span>}
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;