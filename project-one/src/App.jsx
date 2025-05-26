import React from 'react';
import {  Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import OTPVerify from './pages/OTPVerify';
import PrivateRoute from './components/PrivateRoute';
import Header from './pages/Header';

function App() {
   const location = useLocation();
   const isHomePage = location.pathname === '/home';

  return (
    <div>
       <Toaster position="top-right" reverseOrder={false} />
    {!isHomePage && <Header />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/otp-verify" element={<OTPVerify />} />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
      </Routes>
      </div>
    
  );
}

export default App;
