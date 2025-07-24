import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";
import Profile from "../components/Profile";

const StudentProfile = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [studentData, setStudentData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    
    // Fetch student data from the backend
    useEffect(() => {
        const fetchStudentProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/');
                    return;
                }
                
                // Use student profile endpoint instead of generic profile
                const response = await axios.get('http://localhost:5000/student/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                // Make sure we're accessing the data correctly
                setStudentData(response.data.student || response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching student profile:', err);
                setError('Failed to load profile data');
                setLoading(false);
                
                // If unauthorized, redirect to login
                if (err.response && err.response.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('userType');
                    navigate('/');
                }
            }
        };
        
        fetchStudentProfile();
    }, [navigate]);

    const handleProfileUpdate = (updatedData) => {
        setStudentData({...studentData, ...updatedData});
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="dashboard-container">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} activeItem="profile" />
            
            <div className={`content-area ${!isSidebarOpen ? 'sidebar-closed' : ''}`}>
                <TopNav title="My Profile" />
                
                <div className="main-content">
                    {loading ? (
                        <div className="loading-container">Loading profile data...</div>
                    ) : error ? (
                        <div className="error-container">{error}</div>
                    ) : (
                        <Profile 
                            userType="student" 
                            userData={studentData} 
                            onProfileUpdate={handleProfileUpdate}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;