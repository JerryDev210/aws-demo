import React, { useState, useEffect } from "react";
import "../styles/ManageStudents.css"; 

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    rollNumber: "",
    email: "",
    password: "",
    department: "",
    phone: "",         // Added phone field
    address: "",       // Added address field
    dateOfBirth: "",   // Added date of birth field
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState("add"); // For tab navigation
  const [searchTerm, setSearchTerm] = useState(""); // For student search
  const [isEditing, setIsEditing] = useState(false); // Track if editing a student
  const [editingId, setEditingId] = useState(null); // ID of student being edited
  const [showDeleteModal, setShowDeleteModal] = useState(false); // For delete confirmation
  const [studentToDelete, setStudentToDelete] = useState(null); // Student to delete
  const [editPasswordRequired, setEditPasswordRequired] = useState(false); // Password not required during edit

  // Update the fetch students function
  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("${BASE_URL}/students", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch student records");
      }
      
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
      setError("Failed to load student records");
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch departments
  const fetchDepartments = async () => {
    try {
      const response = await fetch("${BASE_URL}/departments", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setDepartments(data);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear errors when user starts typing again
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(null);

    const { name, rollNumber, email, password, department } = formData;

    // Form validation
    if (!name || !rollNumber || !email || !department) {
      setError("Please fill in all required fields");
      return;
    }
    
    // Password is required for new students, optional for editing
    if (!isEditing && !password) {
      setError("Password is required for new students");
      return;
    }
    
    // Password validation if provided
    if (password && password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Determine if we're adding or editing
      const url = isEditing 
        ? `${BASE_URL}/students/${editingId}`
        : "${BASE_URL}/add-student";
      
      const method = isEditing ? "PUT" : "POST";
      
      // Only include password if it's provided or required
      const bodyData = {...formData};
      if (!bodyData.password) delete bodyData.password;
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(bodyData),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(isEditing ? "Student updated successfully!" : "Student added successfully!");
        setFormData({
          name: "",
          rollNumber: "",
          email: "",
          password: "",
          department: "",
          phone: "",       // Reset phone
          address: "",     // Reset address
          dateOfBirth: "", // Reset date of birth
        });
        setIsEditing(false);
        setEditingId(null);
        fetchStudents(); // Refresh student list
        
        // Auto-switch to the View tab after successful addition/edit
        setTimeout(() => {
          setActiveTab("view");
        }, 1500);
      } else {
        setError(result.message || `Failed to ${isEditing ? 'update' : 'add'} student`);
      }
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'adding'} student:`, error);
      setError(`An error occurred while ${isEditing ? 'updating' : 'adding'} the student`);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit student
  const handleEditStudent = async (studentId) => {
    try {
      setLoading(true);
      
      const response = await fetch(`${BASE_URL}/students/${studentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch student details");
      }
      
      const student = await response.json();
      
      // Map the API response to form fields
      setFormData({
        name: student.name || "",
        rollNumber: student.roll_number || "",
        email: student.email || "",
        password: "", // Don't set password for editing
        department: student.department || "",
        phone: student.phone || "",           // Added phone
        address: student.address || "",       // Added address
        dateOfBirth: student.date_of_birth || "", // Added date of birth
      });
      
      setIsEditing(true);
      setEditingId(student.student_id);
      setActiveTab("add"); // Switch to add/edit tab
      setSuccess(null);
      setError(null);
      
    } catch (error) {
      console.error("Error fetching student for edit:", error);
      setError("Failed to load student details for editing");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete confirmation
  const confirmDelete = (student) => {
    setStudentToDelete(student);
    setShowDeleteModal(true);
  };

  // Handle actual delete
  const handleDeleteStudent = async () => {
    if (!studentToDelete) return;
    
    try {
      setLoading(true);
      
      const response = await fetch(`${BASE_URL}/students/${studentToDelete.student_id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete student");
      }
      
      await response.json();
      
      setSuccess("Student deleted successfully!");
      setShowDeleteModal(false);
      fetchStudents(); // Refresh the list
      
    } catch (error) {
      console.error("Error deleting student:", error);
      setError("Failed to delete student");
    } finally {
      setLoading(false);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setFormData({
      name: "",
      rollNumber: "",
      email: "",
      password: "",
      department: "",
      phone: "",       // Reset phone
      address: "",     // Reset address
      dateOfBirth: "", // Reset date of birth
    });
    setIsEditing(false);
    setEditingId(null);
    setError(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    window.location.href = "/login";
  };

  // Filter students based on search term
  const filteredStudents = students.filter(student => {
    if (!student) return false;
    
    return (
      (student.name && student.name.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (student.roll_number && student.roll_number.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.email && student.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.department && student.department.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  useEffect(() => {
    fetchStudents();
    fetchDepartments();
    
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("userType");
    
    if (!token || userType !== "admin") {
      window.location.href = "/login";
    }
  }, []);

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-section">
            <h1>e-Tick <span>Admin</span></h1>
          </div>
          <div className="user-section">
            <div className="user-info">
              <span className="welcome-text">Welcome, Admin</span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-content">
        <div className="sidebar">
          <div className="sidebar-header">
            <h3>Dashboard</h3>
          </div>
          <nav className="sidebar-nav">
            <ul>
              <li className={activeTab === "add" ? "active" : ""}>
                <button onClick={() => setActiveTab("add")}>
                  <i className={isEditing ? "fas fa-user-edit" : "fas fa-user-plus"}></i>
                  <span>{isEditing ? "Edit Student" : "Add Student"}</span>
                </button>
              </li>
              <li className={activeTab === "view" ? "active" : ""}>
                <button onClick={() => setActiveTab("view")}>
                  <i className="fas fa-users"></i>
                  <span>View Students</span>
                  {students.length > 0 && (
                    <span className="badge">{students.length}</span>
                  )}
                </button>
              </li>
              <li>
                <button>
                  <i className="fas fa-building"></i>
                  <span>Departments</span>
                </button>
              </li>
              <li>
                <button>
                  <i className="fas fa-chart-bar"></i>
                  <span>Reports</span>
                </button>
              </li>
              <li>
                <button>
                  <i className="fas fa-cog"></i>
                  <span>Settings</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>

        <div className="content-area">
          {activeTab === "add" && (
            <div className="tab-content">
              <div className="card">
                <div className="card-header">
                  <h2>{isEditing ? "Edit Student" : "Add New Student"}</h2>
                  {isEditing && (
                    <button 
                      className="btn btn-secondary cancel-edit-btn"
                      onClick={handleCancelEdit}
                    >
                      <i className="fas fa-times"></i> Cancel Editing
                    </button>
                  )}
                </div>
                <div className="card-body">
                  {error && <div className="alert alert-danger">{error}</div>}
                  {success && <div className="alert alert-success">{success}</div>}
                  
                  <form className="add-student-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="name">
                          <i className="fas fa-user"></i> Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          placeholder="Enter student's full name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="rollNumber">
                          <i className="fas fa-id-card"></i> Roll Number
                        </label>
                        <input
                          type="text"
                          id="rollNumber"
                          name="rollNumber"
                          placeholder="Enter roll number"
                          value={formData.rollNumber}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="email">
                          <i className="fas fa-envelope"></i> Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          placeholder="Enter email address"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="password">
                          <i className="fas fa-lock"></i> Password {isEditing && <span className="optional-text">(Leave blank to keep current password)</span>}
                        </label>
                        <input
                          type="password"
                          id="password"
                          name="password"
                          placeholder={isEditing ? "Enter new password or leave blank" : "Minimum 8 characters"}
                          value={formData.password}
                          onChange={handleInputChange}
                          minLength={formData.password ? 8 : undefined}
                          required={!isEditing}
                        />
                      </div>
                    </div>

                    {/* New row for phone and date of birth */}
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="phone">
                          <i className="fas fa-phone"></i> Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          placeholder="Enter phone number"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="dateOfBirth">
                          <i className="fas fa-calendar-alt"></i> Date of Birth
                        </label>
                        <input
                          type="date"
                          id="dateOfBirth"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div className="form-group full-width">
                      <label htmlFor="department">
                        <i className="fas fa-building"></i> Department
                      </label>
                      <select
                        id="department"
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="" disabled>Select Department</option>
                        <option value="CSE">Computer Science & Engineering</option>
                        <option value="IT">Information Technology</option>
                        <option value="MCA">Master of Computer Applications</option>
                        <option value="ECE">Electronics & Communication</option>
                        <option value="EEE">Electrical & Electronics</option>
                        <option value="MECH">Mechanical Engineering</option>
                        <option value="CIVIL">Civil Engineering</option>
                      </select>
                    </div>

                    {/* New field for address */}
                    <div className="form-group full-width">
                      <label htmlFor="address">
                        <i className="fas fa-home"></i> Address
                      </label>
                      <textarea
                        id="address"
                        name="address"
                        placeholder="Enter student's address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows="3"
                      />
                    </div>
                    
                    <div className="form-actions">
                      {!isEditing && (
                        <button 
                          type="reset" 
                          className="btn btn-secondary"
                          onClick={() => {
                            setFormData({
                              name: "",
                              rollNumber: "",
                              email: "",
                              password: "",
                              department: "",
                              phone: "",
                              address: "",
                              dateOfBirth: "",
                            });
                            setError(null);
                          }}
                        >
                          <i className="fas fa-eraser"></i> Clear Form
                        </button>
                      )}
                      
                      <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <i className="fas fa-spinner fa-spin"></i> Processing...
                          </>
                        ) : (
                          <>
                            <i className={isEditing ? "fas fa-save" : "fas fa-user-plus"}></i> 
                            {isEditing ? "Update Student" : "Add Student"}
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {activeTab === "view" && (
            <div className="tab-content">
              <div className="card">
                <div className="card-header">
                  <h2>Student Records</h2>
                  <div className="search-container">
                    <input
                      type="text"
                      placeholder="Search students..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="search-input"
                    />
                    <i className="fas fa-search search-icon"></i>
                  </div>
                </div>
                <div className="card-body">
                  {success && <div className="alert alert-success">{success}</div>}
                  
                  {loading ? (
                    <div className="loading-container">
                      <i className="fas fa-spinner fa-spin"></i>
                      <p>Loading student records...</p>
                    </div>
                  ) : error ? (
                    <div className="alert alert-danger">{error}</div>
                  ) : (
                    <div className="table-responsive">
                      <table className="student-table">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Roll Number</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Department</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredStudents.length > 0 ? (
                            filteredStudents.map((student) => (
                              <tr key={student.student_id}>
                                <td>{student.name}</td>
                                <td>{student.roll_number}</td>
                                <td>{student.email}</td>
                                <td>{student.phone || '-'}</td>
                                <td>
                                  <span className="department-badge">
                                    {student.department}
                                  </span>
                                </td>
                                <td>
                                  <div className="action-buttons">
                                    {/* <button 
                                      className="btn-icon btn-view" 
                                      title="View Details"
                                      onClick={() => alert(`
Student Details:
Name: ${student.name}
Roll No: ${student.roll_number}
Email: ${student.email}
Phone: ${student.phone || 'Not provided'}
Department: ${student.department}
Birth Date: ${student.date_of_birth || 'Not provided'}
                                      `)}
                                    >
                                      <i className="fas fa-eye"></i>
                                    </button> */}
                                    <button 
                                      className="btn-icon btn-edit" 
                                      title="Edit Student"
                                      onClick={() => handleEditStudent(student.student_id)}
                                    >
                                      <i className="fas fa-edit"></i>
                                    </button>
                                    <button 
                                      className="btn-icon btn-delete" 
                                      title="Delete Student"
                                      onClick={() => confirmDelete(student)}
                                    >
                                      <i className="fas fa-trash"></i>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="6" className="no-records">
                                <i className="fas fa-folder-open"></i>
                                <p>No student records found</p>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="dashboard-footer">
        <p>© {new Date().getFullYear()} e-Tick Student Management System. All Rights Reserved.</p>
      </footer>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Confirm Deletion</h3>
              <button 
                className="close-modal"
                onClick={() => setShowDeleteModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete the student <strong>{studentToDelete?.name}</strong>?</p>
              <p className="warning-text"><i className="fas fa-exclamation-triangle"></i> This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowDeleteModal(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                className="btn btn-danger"
                onClick={handleDeleteStudent}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Deleting...
                  </>
                ) : (
                  <>
                    <i className="fas fa-trash"></i> Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStudents;