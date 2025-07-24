import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.css"; // Using the same styling as student sidebar

const FacultySidebar = ({ isOpen, toggleSidebar, activeItem }) => {
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
      <div className="status-indicator faculty"></div> {/* Add faculty class for different color */}
      <button className="toggle-btn" onClick={toggleSidebar}>
        <i className={`fas ${isOpen ? 'fa-chevron-left' : 'fa-chevron-right'}`}></i>
      </button>
      
      <ul className="menu">
        <li>
          <Link to="/faculty" className={`menu-item ${activeItem === 'dashboard' ? 'active' : ''}`}>
            <i className="fas fa-tachometer-alt icon"></i>
            {isOpen && <span>Dashboard</span>}
          </Link>
        </li>
        <li>
          <Link to="/faculty/attendance" className={`menu-item ${activeItem === 'attendance' ? 'active' : ''}`}>
            <i className="fas fa-clipboard-check icon"></i>
            {isOpen && <span>Mark Attendance</span>}
          </Link>
        </li>
        <li>
          <Link to="/faculty/leave-requests" className={`menu-item ${activeItem === 'leave-requests' ? 'active' : ''}`}>
            <i className="fas fa-calendar-alt icon"></i>
            {isOpen && <span>Leave Requests</span>}
          </Link>
        </li>
        <li>
          <Link to="/faculty/timetable" className={`menu-item ${activeItem === 'timetable' ? 'active' : ''}`}>
            <i className="fas fa-clock icon"></i>
            {isOpen && <span>Timetable</span>}
          </Link>
        </li>
        <li>
          <Link to="/faculty/feedback" className={`menu-item ${activeItem === 'feedback' ? 'active' : ''}`}>
            <i className="fas fa-comment-alt icon"></i>
            {isOpen && <span>Feedbacks</span>}
          </Link>
        </li>
        <li>
          <Link to="/faculty/profile" className={`menu-item ${activeItem === 'profile' ? 'active' : ''}`}>
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

export default FacultySidebar;