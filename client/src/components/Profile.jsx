import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = ({ userType, userData = {}, onProfileUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: userData.name || '',
    email: userData.email || '',
    phone: userData.phone || '',
    department: userData.department || '',
    rollNumber: userData.roll_number || '',  // For students
    employeeId: userData.faculty_id || '',  // For faculty
    address: userData.address || '',
    dateOfBirth: userData.date_of_birth || '',
    specialization: userData.specialization || '', // For faculty
    profilePicture: userData.profile_picture || '',
  });

  // Update form data when userData changes (e.g. after initial fetch)
  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        department: userData.department || '',
        rollNumber: userData.roll_number || '',
        employeeId: userData.faculty_id || '',
        address: userData.address || '',
        dateOfBirth: userData.date_of_birth || '',
        specialization: userData.specialization || '',
        profilePicture: userData.profile_picture || '',
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    // Handle profile picture upload
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          profilePicture: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      const endpoint = userType === 'faculty' ? '/faculty/profile' : '/student/profile';
      const response = await axios.put(`${BASE_URL}${endpoint}`, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        dateOfBirth: formData.dateOfBirth,
        // Include the profile picture if it's been changed to a data URL
        ...(formData.profilePicture && formData.profilePicture.startsWith('data:') 
          ? { profilePicture: formData.profilePicture } 
          : {})
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Update the parent component with the new data
      if (onProfileUpdate && response.data) {
        onProfileUpdate(response.data.faculty || response.data.student);
      }
      
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>{userType === 'student' ? 'Student Profile' : 'Faculty Profile'}</h2>
        <button 
          className="edit-button" 
          onClick={() => setIsEditing(!isEditing)}
          disabled={isLoading}
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="profile-content">
        <div className="profile-picture-container">
          {formData.profilePicture ? (
            <img 
              src={formData.profilePicture} 
              alt="Profile" 
              className="profile-picture" 
            />
          ) : (
            <div className="profile-picture-placeholder">
              {formData.name ? formData.name.charAt(0).toUpperCase() : '?'}
            </div>
          )}
          {isEditing && (
            <div className="profile-picture-upload">
              <label htmlFor="profile-picture-input" className="upload-label">
                Change Picture
              </label>
              <input 
                id="profile-picture-input"
                type="file" 
                accept="image/*" 
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditing || isLoading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing || isLoading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!isEditing || isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="department">Department</label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              disabled={true}
            />
          </div>

          {userType === 'student' ? (
            <div>

            <div className="form-group">
              <label htmlFor="rollNumber">Roll Number</label>
              <input
                type="text"
                id="rollNumber"
                name="rollNumber"
                value={formData.rollNumber}
                onChange={handleChange}
                disabled={true}
                />
            </div>
            <div className="form-group">
            <label htmlFor="dateOfBirth">Date of Birth</label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              disabled={!isEditing || isLoading}
            />
          </div>
            </div>
          ) : (
            <div>

            <div className="form-group">
              <label htmlFor="employeeId">Employee ID</label>
              <input
                type="text"
                id="employeeId"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                disabled={true}
                />
            </div>

            <div className="form-group">
            <label htmlFor="dateOfBirth">Specialization</label>
            <input
              type="text"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.specialization}
              onChange={handleChange}
              disabled={!isEditing || isLoading}
            />
          </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              disabled={!isEditing || isLoading}
              rows="3"
            />
          </div>

          

          {isEditing && (
            <div className="form-actions">
              <button 
                type="submit" 
                className="save-button" 
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;