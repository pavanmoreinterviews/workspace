import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from '../api';

function Signup() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', mobile: '', password: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  
  const regexPatterns = {
    firstName: /^[A-Za-z\s]{2,30}$/,
    lastName: /^[A-Za-z\s]{2,30}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
    mobile: /^[6-9]\d{9}$/,
    password: /^[A-Z][a-z]{2,}[#@!$%^&*][0-9]{3,}$/,
  };


  const validateField = (key, value) => {
    const pattern = regexPatterns[key];
    if (!pattern) return '';
    if (!value.trim()) return 'This field is required.';
    if (!pattern.test(value)) return `Invalid ${key}`;
    return '';
  };

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });

    const errorMsg = validateField(key, value);
    setErrors(prev => ({ ...prev, [key]: errorMsg }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();


    const newErrors = {};
    for (const key in form) {
      const error = validateField(key, form[key]);
      if (error) newErrors[key] = error;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

   
   await axios.post('/send-otp', form)
  .then((response) => {
    if (response.status === 200) {
      toast.success(response.data.message);

      sessionStorage.setItem("regForm", JSON.stringify(form));
      navigate('/otp-verify');
    } else {
      toast.error(response.data?.message || 'An error occurred');
    }
  })
  .catch((error) => {
    const errorMessage = error.response?.data?.message || 'An error occurred';
    toast.error(errorMessage);
  });

};

  return (
    <div className="card">
      <div className="card-header">Registration User</div>
      <div className="card-body">
        <form onSubmit={handleSignup}>
          {[
            { name: 'firstName', placeHolder: 'First Name' },
            { name: 'lastName', placeHolder: 'Last Name' },
            { name: 'email', placeHolder: 'Email' },
            { name: 'mobile', placeHolder: 'Mobile' },
            { name: 'password', placeHolder: 'Password' }
          ].map(field => (
            <div key={field.name} className={field.name === 'firstName' ? 'mar_top4' : 'mar_top20'}>
              <input
                className="form-control"
                placeholder={field.placeHolder}
                type={field.name === 'password' ? 'password' : 'text'}
                value={form[field.name]}
                onChange={e => handleChange(field.name, e.target.value)}
              />
              {errors[field.name] && (
                <div class="errorCls">{errors[field.name]}</div>
              )}
            </div>
          ))}
          <button type="submit" className="btn btn-primary mar_top20">Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
