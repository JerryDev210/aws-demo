import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";
import { BASE_URL } from '../config';
const Dashboard = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
     
    const handleLogout = () => {
        // localStorage.removeItem("token")
        navigate("/login")  
    }

    const handleSearch = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    const timetableData = [
        { period: 1, time: '9:00 AM - 10:00 AM', subject: 'Mathematics', class: 'B.Sc. Computer Science' },
        { period: 2, time: '10:00 AM - 11:00 AM', subject: 'Database Management System', class: 'BCA' },
        { period: 3, time: '11:00 AM - 12:00 PM', subject: 'English', class: 'B.A. English Literature' },
        { period: 4, time: '12:00 PM - 1:00 PM', subject: 'Tamil', class: 'B.A. History' },
        { period: 5, time: '2:00 PM - 3:00 PM', subject: 'OOPS with Java', class: 'B.Sc. Computer Science' },
        { period: 6, time: '3:00 PM - 4:00 PM', subject: 'Discrete Mathematics', class: 'B.Tech. Information Technology' },
    ];

    return (
        <div className="dashboard-container">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} activeItem="dashboard" />
            
            <div className={`content-area ${!isSidebarOpen ? 'sidebar-closed' : ''}`}>
                <TopNav title="Student Dashboard" />
                
                <div className="main-content">
                    <div className="timetable">
                        <center>
                            <h2 style={{ paddingBottom: '8px' }}>Ramkumar's Timetable</h2>
                        </center>
                        {/* <input
                            type="text"
                            id="search"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={handleSearch}
                            style={{ margin: '12px 0', padding: '8px', borderRadius: '8px', border: '1px solid #ccc', width: '100%' }}
                        /> */}
                        <table>
                            <thead>
                                <tr>
                                    <th>Period</th>
                                    <th>Time</th>
                                    <th>Subject</th>
                                    <th>Class</th>
                                </tr>
                            </thead>
                            <tbody>
                                {timetableData
                                    .filter(item =>
                                        item.subject.toLowerCase().includes(searchTerm) ||
                                        item.class.toLowerCase().includes(searchTerm)
                                    )
                                    .map(item => (
                                        <tr key={item.period}>
                                            <td>{item.period}</td>
                                            <td>{item.time}</td>
                                            <td>{item.subject}</td>
                                            <td>{item.class}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;