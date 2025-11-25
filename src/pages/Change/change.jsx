import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import './change.css';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  
  const navigate = useNavigate();
  const [showOld, setShowOld] = useState(false);
const [showNew, setShowNew] = useState(false);
const [showConfirm, setShowConfirm] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('Please log in to change your password');
      navigate('/login');
      return;
    }

    if (!oldPassword || !newPassword || !confirmPassword) {
      setMessage(' All fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage(' New password and confirm password do not match');
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:8000/user/change-password/${userId}`,
        { oldPassword, newPassword }
      );

      if (res.data.success) {
        setMessage(' Password changed successfully!');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');

        setTimeout(() => navigate('/'), 1500);
      } else {
        setMessage(res.data.message || ' Failed to change password');
      }
    } catch (err) {
      console.error(err);
      setMessage(
        err.response?.data?.message || ' Something went wrong. Try again.'
      );
    }
  };

  return (
    <div className="change-password-container">
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Old Password</label>
          <input
  type={showOld ? 'text' : 'password'}
  placeholder="Enter old password"
  value={oldPassword}
  onChange={(e) => setOldPassword(e.target.value)}
  required
/>
{showOld
  ? <FaEyeSlash onClick={() => setShowOld(false)} className="eye-icon" />
  : <FaEye onClick={() => setShowOld(true)} className="eye-icon" />
}
</div>
        <div className="form-group">
          <label>New Password</label>
        <input
  type={showNew ? 'text' : 'password'}
  placeholder="Enter new password"
  value={newPassword}
  onChange={(e) => setNewPassword(e.target.value)}
  required
/>
{showNew
  ? <FaEyeSlash onClick={() => setShowNew(false)} className="eye-icon" />
  : <FaEye onClick={() => setShowNew(true)} className="eye-icon" />
}

        </div>

        <div className="form-group">
          <label>Confirm Password</label>
<input
  type={showConfirm ? 'text' : 'password'}
  placeholder="Confirm new password"
  value={confirmPassword}
  onChange={(e) => setConfirmPassword(e.target.value)}
  required
/>
{showConfirm
  ? <FaEyeSlash onClick={() => setShowConfirm(false)} className="eye-icon" />
  : <FaEye onClick={() => setShowConfirm(true)} className="eye-icon" />
}

        </div>

        <button type="submit">Change Password</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default ChangePassword;
