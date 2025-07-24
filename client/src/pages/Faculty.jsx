import React, { useState } from "react";
import FacultySidebar from "../components/FacultySidebar";
import TopNav from "../components/TopNav";

const FacultyDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="dashboard-container">
      {/* Faculty Sidebar */}
      <FacultySidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar} 
        activeItem="dashboard" 
      />

      {/* Main Content */}
      <div className={`content-area ${!isSidebarOpen ? "sidebar-closed" : ""}`}>
        <div className="content-wrapper">
          {/* Top Navigation */}
          <TopNav title="Faculty Dashboard" />

          {/* Dashboard Content */}
          <div className="main-content">
            <section className="dashboard-content">
              <h2>Recent Activities</h2>
              <div className="activity-list">
                <div className="activity-item">
                  <span className="activity-time">10:45 AM</span>
                  <span className="activity-text">Marked attendance for B.Sc. Computer Science class</span>
                </div>
                <div className="activity-item">
                  <span className="activity-time">9:30 AM</span>
                  <span className="activity-text">Approved leave request from Student Ramkumar</span>
                </div>
                <div className="activity-item">
                  <span className="activity-time">Yesterday</span>
                  <span className="activity-text">Uploaded new assignment for Database Management class</span>
                </div>
                <div className="activity-item">
                  <span className="activity-time">Yesterday</span>
                  <span className="activity-text">Received 2 new feedback submissions</span>
                </div>
              </div>
            </section>
            
            <section className="upcoming-classes">
              <h2>Today's Classes</h2>
              <div className="class-schedule">
                <div className="class-item">
                  <div className="class-time">9:00 AM - 10:00 AM</div>
                  <div className="class-details">
                    <h4>Database Management Systems</h4>
                    <p>B.Sc. Computer Science - Room 305</p>
                  </div>
                  <div className="class-status completed">Completed</div>
                </div>
                <div className="class-item">
                  <div className="class-time">11:00 AM - 12:00 PM</div>
                  <div className="class-details">
                    <h4>OOPS with Java</h4>
                    <p>BCA - Room 203</p>
                  </div>
                  <div className="class-status upcoming">Upcoming</div>
                </div>
                <div className="class-item">
                  <div className="class-time">2:00 PM - 3:00 PM</div>
                  <div className="class-details">
                    <h4>Discrete Mathematics</h4>
                    <p>B.Tech. Information Technology - Room 401</p>
                  </div>
                  <div className="class-status upcoming">Upcoming</div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;