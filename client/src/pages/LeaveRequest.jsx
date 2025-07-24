import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";

export default function LeaveRequest() {
  const [formData, setFormData] = useState({
    reason: "",
    startDate: "",
    endDate: "",
    leaveType: "sick", // Default value
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Leave Request Submitted:", formData);
    // Add API call to submit leave request
    setSubmitted(true);
    
    // Reset form after submission
    setFormData({
      reason: "",
      startDate: "",
      endDate: "",
      leaveType: "sick",
    });
    
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleCancel = () => {
    // Reset form data
    setFormData({
      reason: "",
      startDate: "",
      endDate: "",
      leaveType: "sick", 
    });
  };

  return (
    <div className="leave-request-container">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} activeItem="leave" />
      
      <div className={`content-area ${!isSidebarOpen ? 'sidebar-closed' : ''}`}>
        <TopNav title="Leave Request Form" />
        
        <div className="leave-content">
          <h1 className="leave-request-header">Submit Leave Request</h1>
          
          {submitted && (
            <div className="success-message">
              Your leave request has been submitted successfully!
            </div>
          )}
          
          <form className="leave-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Leave Type:</label>
              <select 
                name="leaveType" 
                value={formData.leaveType}
                onChange={handleChange}
                required
              >
                <option value="sick">Sick Leave</option>
                <option value="personal">Personal Leave</option>
                <option value="family">Family Emergency</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="form-row">
              <div className="form-group half">
                <label>Start Date:</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group half">
                <label>End Date:</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Reason for Leave:</label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Please provide a detailed explanation for your leave request..."
                required
              />
            </div>
            
            <div className="form-actions">
              <button type="button" className="cancel-button" onClick={handleCancel}>Cancel</button>
              <button className="submit-button" type="submit">Submit Request</button>
            </div>
          </form>
          
          <div className="leave-info">
            <h3>Leave Request Guidelines</h3>
            <ul>
              <li>All leave requests must be submitted at least 3 days in advance.</li>
              <li>For medical leaves, a doctor's certificate may be required upon return.</li>
              <li>Emergency leaves will be reviewed on a case-by-case basis.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}