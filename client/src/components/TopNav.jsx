import React from 'react';
import './TopNav.css';

const TopNav = ({ title = "Student Attendance Dashboard" }) => {
  return (
    <div className="top-nav">
      <h2 className="page-title">{title}</h2>
      <div className="user-profile">
        <span className="username">Ramkumar G</span>
        <div className="avatar">R</div>
      </div>
    </div>
  );
};

export default TopNav;