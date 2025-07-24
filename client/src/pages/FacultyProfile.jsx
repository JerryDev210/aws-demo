import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";
import Profile from "../components/Profile";
import FacultySidebar from '../components/FacultySidebar';
import { BASE_URL } from '../config';
const FacultyProfile = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [facultyData, setFacultyData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    
    // Fetch faculty data from the backend
    useEffect(() => {
        const fetchFacultyProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }
                
                const response = await axios.get(`${BASE_URL}/faculty/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                setFacultyData(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching faculty profile:', err);
                setError('Failed to load profile data');
                setLoading(false);
                
                // If unauthorized, redirect to login
                if (err.response && err.response.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            }
        };
        
        fetchFacultyProfile();
    }, [navigate]);

    const handleProfileUpdate = (updatedData) => {
        setFacultyData({...facultyData, ...updatedData});
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="dashboard-container">
            <FacultySidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} activeItem="profile" />
            
            <div className={`content-area ${!isSidebarOpen ? 'sidebar-closed' : ''}`}>
                <TopNav title="Faculty Profile" />
                
                <div className="main-content">
                    {loading ? (
                        <div className="loading-container">Loading profile data...</div>
                    ) : error ? (
                        <div className="error-container">{error}</div>
                    ) : (
                        <Profile 
                            userType="faculty" 
                            userData={facultyData} 
                            onProfileUpdate={handleProfileUpdate}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default FacultyProfile;