import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axios from '../api';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [profile, setProfile] = useState({});
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const passwordPattern = /^[A-Z][a-z]{2,}[#@!$%^&*][0-9]{3,}$/;

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const loginEmail = JSON.parse(sessionStorage.getItem("loginEmail"));
        const res = await axios.post('/user-details', { loginEmail });
        setProfile(res.data);
      } catch (err) {
        toast.error('Failed to load user details');
      }
    };

    fetchUserDetails();
  }, []);

  const validatePassword = (value) => {
    if (!value.trim()) return 'Password is required';
    if (!passwordPattern.test(value)) return 'Invalid password format (e.g., Pavan@123)';
    return '';
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(validatePassword(value));
  };

  const updatePassword = async () => {
    const error = validatePassword(password);
    if (error) {
      setPasswordError(error);
      toast.error(error);
      return;
    }

    try {
       const loginEmail = JSON.parse(sessionStorage.getItem("loginEmail"));
      const response = await axios.put('/update-password', {email : loginEmail, newPassword: password });
      toast.success(response.data.message || 'Password updated successfully');
      logout();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Something went wrong. Please try again.';
      toast.error(errorMessage);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    sessionStorage.clear(); 
    navigate('/');
  };

  return (
    <div className="card">
      <div className="card-header">
        <h1>Welcome, {profile.firstName}</h1>
      </div>
      <div className="card-body">
        <p>Email: {profile.email}</p>
        <div className="adjustUpdBtnPos jusContBetween alignItemCenter">
          <div className="h_50">
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={handlePasswordChange}
          />
          {passwordError && <div className="errorCls">{passwordError}</div>}
          </div>
          <div><button onClick={updatePassword} disabled={!!passwordError}>Update Password</button></div>
        </div>
        <div className="mar_top20 adjustUpdBtnPos">
          <button onClick={logout}>Logout</button>
        </div>
      </div>
    </div>
  );
}

export default Home;
