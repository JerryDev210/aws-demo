import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Login.css";

const Login = ({ isAdmin = false, isFaculty = false }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Basic validation
    if (!email || !password) {
      alert("Please fill in both fields.");
      return;
    }

    // Validate email format using regex
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      // Determine which endpoint to call based on login type
      let endpoint = "http://localhost:5000/login"; // Default student login
      if (isAdmin) {
        endpoint = "http://localhost:5000/admin/login";
      } else if (isFaculty) {
        endpoint = "http://localhost:5000/faculty/login";
      }
      
      // Send POST request to the server for login validation
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        // Store the token and user type in localStorage
        localStorage.setItem("token", result.token);
        
        // Set the appropriate user type
        if (isAdmin) {
          localStorage.setItem("userType", "admin");
          navigate("/ManageStudents");
        } else if (isFaculty) {
          localStorage.setItem("userType", "faculty");
          navigate("/faculty");
        } else {
          localStorage.setItem("userType", "student");
          navigate("/student");
        }
      } else {
        // Show error message from the server
        alert(result.message || "Invalid username or password.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred while logging in. Please try again later.");
    }
  };

  // Determine the title and button text based on login type
  const getTitle = () => {
    if (isAdmin) return "Admin Login";
    if (isFaculty) return "Faculty Login";
    return "Student Attendance Management Portal";
  };

  const getButtonText = () => {
    if (isAdmin) return "Admin Login";
    if (isFaculty) return "Faculty Login";
    return "Student Login";
  };

  return (
    <div className="login-page">
      <div className="container">
        <div className="portal-title">
          {getTitle()}
        </div>
        <form className="login-box" onSubmit={handleSubmit}>
          <div className="login-row">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="login-row">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="login-row forgot">
            <a href="#" style={{ textDecoration: "none" }}>
              Forgot Password?
            </a>
          </div>
          <button type="submit">
            {getButtonText()}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;