import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FacultySidebar from "../components/FacultySidebar";
import TopNav from "../components/TopNav";
import axios from 'axios';
// import '../styles/FacultyAttendance.css';
import { BASE_URL } from '../config';
const FacultyAttendance = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [students, setStudents] = useState([]);
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Fetch courses taught by the faculty
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        const userType = localStorage.getItem('userType');
        
        console.log('Fetching courses with token:', token ? 'Token exists' : 'No token');
        console.log('User type:', userType);
        
        if (!token || userType !== 'faculty') {
          console.log('Not authenticated as faculty, redirecting');
          navigate('/login-faculty');
          return;
        }

        console.log('Making API request to fetch courses');
        const response = await axios.get(`${BASE_URL}/faculty/courses`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log('Courses fetched:', response.data);
        setCourses(response.data);
      } catch (err) {
        console.error('Error fetching courses:', err);
        
        if (err.response) {
          console.error('Response status:', err.response.status);
          console.error('Response data:', err.response.data);
        }
        
        setError('Failed to fetch courses');
        
        // If unauthorized, redirect to login
        if (err.response && err.response.status === 401) {
          console.log('Unauthorized, clearing tokens and redirecting');
          localStorage.removeItem('token');
          localStorage.removeItem('userType');
          navigate('/login-faculty');
        }
      }
    };

    fetchCourses();
  }, [navigate]);

  // Fetch students for the selected course
  const fetchStudentsForCourse = async (courseId) => {
    if (!courseId) return;
    
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/faculty/course/${courseId}/students`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setStudents(response.data);
      
      // Initialize all students as present by default
      const initialStatus = {};
      response.data.forEach(student => {
        initialStatus[student.student_id] = true;
      });
      setAttendanceStatus(initialStatus);
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Failed to fetch students for this course');
      setLoading(false);
    }
  };

  const handleCourseChange = (e) => {
    const courseId = e.target.value;
    setSelectedCourse(courseId);
    if (courseId) {
      fetchStudentsForCourse(courseId);
    } else {
      setStudents([]);
    }
  };

  const handleStatusChange = (studentId, isPresent) => {
    setAttendanceStatus(prev => ({
      ...prev,
      [studentId]: isPresent
    }));
  };

  const handleSubmitAttendance = async () => {
    if (!selectedCourse) {
      setError('Please select a course');
      return;
    }

    if (students.length === 0) {
      setError('No students found for this course');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const attendanceData = {
        courseId: selectedCourse,
        date: new Date().toISOString().split('T')[0], // current date in YYYY-MM-DD format
        attendance: Object.keys(attendanceStatus).map(studentId => ({
          studentId,
          isPresent: attendanceStatus[studentId]
        }))
      };

      await axios.post(`${BASE_URL}/faculty/mark-attendance`, attendanceData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess('Attendance marked successfully!');
      setSubmitting(false);
    } catch (err) {
      console.error('Error marking attendance:', err);
      setError(err.response?.data?.message || 'Failed to mark attendance');
      setSubmitting(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="dashboard-container">
      <FacultySidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar} 
        activeItem="attendance" 
      />
      
      <div className={`content-area ${!isSidebarOpen ? 'sidebar-closed' : ''}`}>
        <TopNav title="Mark Attendance" />
        
        <div className="main-content">
          <div className="attendance-form-container">
            <h2>Mark Attendance</h2>
            
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            
            <div className="form-group">
              <label htmlFor="course">Select Course:</label>
              <select 
                id="course" 
                value={selectedCourse} 
                onChange={handleCourseChange}
                disabled={submitting}
              >
                <option value="">-- Select Course --</option>
                {courses.map(course => (
                  <option key={course.course_id} value={course.course_id}>
                    {course.course_name} ({course.course_code})
                  </option>
                ))}
              </select>
            </div>

            {loading ? (
              <div className="loading-spinner">Loading students...</div>
            ) : (
              <>
                {students.length > 0 ? (
                  <div className="attendance-table-container">
                    <table className="attendance-table">
                      <thead>
                        <tr>
                          <th>Roll Number</th>
                          <th>Student Name</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map(student => (
                          <tr key={student.student_id}>
                            <td>{student.roll_number}</td>
                            <td>{student.name}</td>
                            <td>
                              <div className="attendance-radio-group">
                                <label>
                                  <input
                                    type="radio"
                                    name={`attendance-${student.student_id}`}
                                    checked={attendanceStatus[student.student_id] === true}
                                    onChange={() => handleStatusChange(student.student_id, true)}
                                    disabled={submitting}
                                  />
                                  Present
                                </label>
                                <label>
                                  <input
                                    type="radio"
                                    name={`attendance-${student.student_id}`}
                                    checked={attendanceStatus[student.student_id] === false}
                                    onChange={() => handleStatusChange(student.student_id, false)}
                                    disabled={submitting}
                                  />
                                  Absent
                                </label>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="attendance-actions">
                      <button 
                        className="mark-attendance-btn" 
                        onClick={handleSubmitAttendance}
                        disabled={submitting}
                      >
                        {submitting ? 'Submitting...' : 'Submit Attendance'}
                      </button>
                    </div>
                  </div>
                ) : (
                  selectedCourse && <p>No students found for this course.</p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyAttendance;