function Home() {
  return (
    <div>
      <div className="navbar">
      <h1>Student Attendance Management Portal</h1>
      <div>
        <a href="#">Home</a>
        <a href="#about">About Us</a>
        <a href="#contact">Contact</a>
        <a href="/login/">Login</a>
      </div>
    </div>

    <div className="hero">
      <h1>Welcome to the Student Attendance Management Portal</h1>
      <p>Effortlessly manage attendance, student records, and more.</p>
      <a href="/login">Get Started</a>
    </div>
    
    <div className="content" id="about">
      <h2>About Us</h2>
      <p>
        Our portal is designed to streamline the management of student attendance and records. It provides a user-friendly interface for both students and administrators, ensuring efficiency and accuracy in academic management.
      </p>
    </div>

    <div className="content" id="contact">
      <h2>Contact Us</h2>
      <p>Email: attendance-management@tce.edu | Phone: +91 86085 67890</p>
    </div>

    <div className="footer">
      <p>&copy; 2025 Student Attendance Management Portal. All rights reserved.</p>
    </div>
    </div>
  );
}

export default Home;