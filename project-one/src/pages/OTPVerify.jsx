import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../api';

function OTPVerify() {
  const [otp, setOTP] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { state } = useLocation();

  const validateOTP = (value) => {
    if (!value.trim()) return 'OTP is required.';
    if (!/^\d{6}$/.test(value)) return 'OTP must be exactly 6 digits.';
    return '';
  };

 
  const handleChange = (e) => {
    const value = e.target.value;
    setOTP(value);

    const validationError = validateOTP(value);
    setError(validationError);
  };

 
  const verify = async (e) => {
    e.preventDefault();

    const validationError = validateOTP(otp);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setError('');
      const regForm = JSON.parse(sessionStorage.getItem("regForm"));

      const verifyResponse = await axios.post('/verify-otp', { email: regForm.email, otp });
      toast.success(verifyResponse.data.message);

      const signupResponse = await axios.post('/signup', { ...regForm, otp });
      toast.success(signupResponse.data.message);

      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred');
      
    }
  };

  return (
    <div className="card">
      <div className="card-header">Verify OTP</div>
      <div className="card-body">
        <form onSubmit={verify}>
          <input
            className="form-control mar_top4"
            value={otp}
            onChange={handleChange}
            placeholder="Enter 6-digit OTP"
          />
          {error && (
            <div className="errorCls">
              {error}
            </div>
          )}
          <button className="btn btn-primary mar_top20" type="submit">
            Verify
          </button>
        </form>
      </div>
    </div>
  );
}

export default OTPVerify;
