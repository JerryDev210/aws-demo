import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";
import axios from 'axios';

const Attendance = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [attendanceData, setAttendanceData] = useState([]);
    const [overallAttendance, setOverallAttendance] = useState({ present: 0, total: 0, percentage: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAttendanceData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }
                
                const response = await axios.get(`${BASE_URL}/student/attendance`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                // Transform the data for our component
                const formattedData = response.data.courses.map(course => ({
                    subject: course.course_name,
                    present: course.present_hours,
                    absent: course.total_hours - course.present_hours,
                    total: course.total_hours,
                    percentage: course.percentage,
                    status: getStatusLabel(course.percentage)
                }));
                
                setAttendanceData(formattedData);
                setOverallAttendance(response.data.overall);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching attendance data:', err);
                setError('Failed to load attendance data');
                setLoading(false);
                
                // If unauthorized, redirect to login
                if (err.response && err.response.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('userType');
                    navigate('/login');
                }
            }
        };
        
        fetchAttendanceData();
    }, [navigate]);

    // Get color based on attendance percentage
    const getStatusColor = (percentage) => {
        if (percentage >= 90) return '#1E8449'; // Green
        if (percentage >= 75) return '#2E86C1'; // Blue
        if (percentage >= 60) return '#F39C12'; // Orange
        return '#C0392B'; // Red
    };

    const getStatusLabel = (percentage) => {
        if (percentage >= 90) return 'Excellent';
        if (percentage >= 75) return 'Good';
        if (percentage >= 60) return 'Warning';
        return 'Critical';
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="attendance-container">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} activeItem="attendance" />
            
            <div className={`content-area ${!isSidebarOpen ? 'sidebar-closed' : ''}`}>
                <div className="content-wrapper">
                    <TopNav title="Attendance Dashboard" />
                    
                    <div className="main-content">
                        {loading ? (
                            <div className="loading-container">Loading attendance data...</div>
                        ) : error ? (
                            <div className="error-container">{error}</div>
                        ) : (
                            <>
                                <div className="attendance-header">
                                    <h2>My Attendance Summary</h2>
                                    <div className="overall-attendance">
                                        <div className="overall-circle" style={{
                                            background: `conic-gradient(
                                                ${getStatusColor(overallAttendance.percentage)} ${overallAttendance.percentage}%, 
                                                #f0f0f0 ${overallAttendance.percentage}%
                                            )`
                                        }}>
                                            <div className="circle-inner">
                                                <span className="percentage">{overallAttendance.percentage}%</span>
                                            </div>
                                        </div>
                                        <div className="overall-details">
                                            <h3>Overall Attendance</h3>
                                            <p>Status: <span style={{ color: getStatusColor(overallAttendance.percentage) }}>
                                                {getStatusLabel(overallAttendance.percentage)}
                                            </span></p>
                                            <p>Present: {overallAttendance.present} / {overallAttendance.total} periods</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="attendance-cards">
                                    {attendanceData.length > 0 ? (
                                        attendanceData.map((subject, index) => (
                                            <div className="attendance-card" key={index}>
                                                <h3>{subject.subject}</h3>
                                                <div className="progress-container">
                                                    <div 
                                                        className="progress-bar" 
                                                        style={{ 
                                                            width: `${subject.percentage}%`,
                                                            backgroundColor: getStatusColor(subject.percentage)
                                                        }}
                                                    ></div>
                                                </div>
                                                <div className="attendance-details">
                                                    <p className="percentage">{subject.percentage}%</p>
                                                    <p className="status" style={{ color: getStatusColor(subject.percentage) }}>
                                                        {getStatusLabel(subject.percentage)}
                                                    </p>
                                                </div>
                                                <p className="attendance-count">
                                                    Present: {subject.present} / {subject.total} periods
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="no-data-message">
                                            No attendance records found. Records will appear after classes begin.
                                        </div>
                                    )}
                                </div>

                                <div className="attendance-info">
                                    <h3>Attendance Guidelines</h3>
                                    <ul>
                                        <li><span className="dot" style={{ backgroundColor: '#1E8449' }}></span> Excellent: 90% and above</li>
                                        <li><span className="dot" style={{ backgroundColor: '#2E86C1' }}></span> Good: 75% to 89%</li>
                                        <li><span className="dot" style={{ backgroundColor: '#F39C12' }}></span> Warning: 60% to 74%</li>
                                        <li><span className="dot" style={{ backgroundColor: '#C0392B' }}></span> Critical: Below 60%</li>
                                    </ul>
                                    <p className="attendance-note">
                                        <strong>Note:</strong> A minimum of 75% attendance is required to appear for final examinations.
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Attendance;