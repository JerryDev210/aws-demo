import Login from './pages/Login';
import Home from './pages/Home';
import ManageStudents from './pages/ManageStudents';
import Faculty from './pages/Faculty';
import FacultyAttendance from './pages/FacultyAttendance'; // Add this import
import Student from './pages/Student';
import LeaveRequest from './pages/LeaveRequest';
import Feedback from './pages/Feedback';
import Attendance from './pages/Attendance';
import StudentProfile from './pages/StudentProfile';
import FacultyProfile from './pages/FacultyProfile';
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import './App.css';
import './styles/profile.css'; 
import './App2.css'; // Add this impor


const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/login-sudoadmin", element: <Login isAdmin = {true} /> },
  { path: "/login-faculty", element: <Login isFaculty = {true} /> },
  { path: "/ManageStudents", element: <ManageStudents /> },
  { path: "/faculty", element: <Faculty /> },
  { path: "/faculty/attendance", element: <FacultyAttendance /> }, // Add this route
  { path: "/student", element: <Student /> },
  { path: "/leaverequest", element: <LeaveRequest /> },
  { path: "/feedback", element: <Feedback /> },
  { path: "/attendance", element: <Attendance /> },
  { path: "/student/profile", element: <StudentProfile /> },
  { path: "/faculty/profile", element: <FacultyProfile /> },
]);

export default function App() {
  return (
      <>
          <RouterProvider router={router} />
      </>
  );
}