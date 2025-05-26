import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from '../api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const passwordPattern = /^[A-Z][a-z]{2,}[#@!$%^&*][0-9]{3,}$/;

  const validateField = (name, value) => {
    let error = '';

    if (name === 'email') {
      if (!value.trim()) {
        error = 'Email is required';
      } else if (!emailPattern.test(value)) {
        error = 'Invalid email format';
      }
    }

    if (name === 'password') {
      if (!value.trim()) {
        error = 'Password is required';
      } else if (!passwordPattern.test(value)) {
        error = 'Invalid password format (e.g., Pavan@123)';
      }
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const validateAll = () => {
    const allErrors = {};

    if (!email.trim()) {
      allErrors.email = 'Email is required';
    } else if (!emailPattern.test(email)) {
      allErrors.email = 'Invalid email format';
    }

    if (!password.trim()) {
      allErrors.password = 'Password is required';
    } else if (!passwordPattern.test(password)) {
      allErrors.password = 'Invalid password format (e.g., Pavan@123)';
    }

    setErrors(allErrors);
    return Object.keys(allErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateAll()) return;

    try {
      const response = await axios.post('/login', { email, password });
      toast.success(response.data.message || 'Login successful');
      localStorage.setItem('token', response.data.token);
      sessionStorage.setItem("loginEmail", JSON.stringify(email));
      navigate('/home');
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(errorMessage);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }

    validateField(name, value); 
  };

  return (
    <div className="card">
      <div className="card-header">Login User</div>
      <div className="card-body">
        <form onSubmit={handleLogin}>
          <input
            className="mar_top4"
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            placeholder="Email*"
          />
          {errors.email && <div className="errorCls">{errors.email}</div>}

          <input
            className="mar_top20"
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
            placeholder="Password*"
          />
          {errors.password && <div className="errorCls">{errors.password}</div>}

          <button className="mar_top20" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
