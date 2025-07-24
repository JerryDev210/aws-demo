import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";

export default function Feedback() {
  const [feedbackData, setFeedbackData] = useState({
    category: "general",
    subject: "",
    message: "",
    rating: 5
  });
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeedbackData({ ...feedbackData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Feedback Submitted:", feedbackData);
    // Add API call to submit feedback
    setSubmitted(true);
    
    // Reset form after submission
    setFeedbackData({
      category: "general",
      subject: "",
      message: "",
      rating: 5
    });
    
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleCancel = () => {
    // Reset form data
    setFeedbackData({
      category: "general",
      subject: "",
      message: "",
      rating: 5
    });
  };

  return (
    <div className="feedback-container">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} activeItem="feedback" />
      
      <div className={`content-area ${!isSidebarOpen ? 'sidebar-closed' : ''}`}>
        <TopNav title="Student Feedback Section" />
        
        <div className="feedback-content">
          <h1 className="feedback-header">Submit Your Feedback</h1>
          
          {submitted && (
            <div className="success-message">
              Thank you! Your feedback has been submitted successfully!
            </div>
          )}
          
          <form className="feedback-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group half">
                <label>Category:</label>
                <select 
                  name="category" 
                  value={feedbackData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="general">General Feedback</option>
                  <option value="course">Course Content</option>
                  <option value="faculty">Faculty</option>
                  <option value="facilities">Facilities</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="form-group half">
                <label>Rating:</label>
                <div className="rating-container">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span 
                      key={star} 
                      className={`star ${parseInt(feedbackData.rating) >= star ? 'selected' : ''}`}
                      onClick={() => setFeedbackData({...feedbackData, rating: star})}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <label>Subject:</label>
              <input
                type="text"
                name="subject"
                value={feedbackData.subject}
                onChange={handleChange}
                placeholder="Brief subject of your feedback"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Your Message:</label>
              <textarea
                name="message"
                value={feedbackData.message}
                onChange={handleChange}
                placeholder="Please share your thoughts, suggestions, or concerns..."
                required
              />
            </div>
            
            <div className="form-actions">
              <button type="button" className="cancel-button" onClick={handleCancel}>Cancel</button>
              <button className="submit-button" type="submit">Submit Feedback</button>
            </div>
          </form>
          
          <div className="feedback-info">
            <h3>Feedback Guidelines</h3>
            <ul>
              <li>Your feedback is anonymous and confidential.</li>
              <li>Please be specific and constructive in your comments.</li>
              <li>All feedback is reviewed by our academic team to improve our services.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}