const User = require('../models/User');
const Otp = require('../models/Otp');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendOtp } = require('../utils/sendOtp');
const { v4: uuidv4 } = require('uuid');

exports.sendOtp = async (req, res) => {
   
  const { email } = req.body;
  if (!email) {
  return res.status(400).json({ message: 'Email is required' });
}

try {
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  

} catch (error) {
  return res.status(500).json({ message: 'Server error. Please try again later.' });
}
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60000); // 10 min expiry
  await Otp.findOneAndUpdate({ email }, { otp, expiresAt }, { upsert: true });
  await sendOtp(email, otp);
  res.json({ message: 'OTP sent to email' });
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const record = await Otp.findOne({ email });

  if (!record || record.otp !== otp || record.expiresAt < new Date())
    return res.status(400).json({ message: 'Invalid or expired OTP' });

  res.json({ message: 'OTP verified' });
};

exports.signup = async (req, res) => {
    
  const { firstName, lastName, email, mobile, password, otp } = req.body;

  const otpRecord = await Otp.findOne({ email });
  if (!otpRecord || otpRecord.otp !== otp || otpRecord.expiresAt < new Date())
    return res.status(400).json({ message: 'Invalid OTP' });

  

  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = uuidv4();

  await User.create({
    userId,
    firstName,
    lastName,
    email,
    mobile,
    password: hashedPassword,
    emailVerified: true
  });

  res.json({ message: 'User registered successfully' });
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' }); // generic for security
    }

   
    if (user.lockUntil && user.lockUntil > Date.now()) {
      return res.status(403).json({ message: 'Too many failed attempts. Try again after 3 hours.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
     
      user.loginAttempts = (user.loginAttempts || 0) + 1;

     
      if (user.loginAttempts >= 3) {
        user.lockUntil = new Date(Date.now() + 3 * 60 * 60 * 1000); // 3 hours
      }

      await user.save();
      return res.status(401).json({ message: 'Invalid email or password' }); // generic message
    }

    
    user.loginAttempts = 0;
    user.lockUntil = null;
    await user.save();

  
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(200).json({ token });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getUser = async (req, res) => {
  const  {loginEmail} = req.body;
  const user = await User.findOne({ email: loginEmail });
  res.json(user);
};


exports.updatePassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.status(400).json({ message: "Email and new password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        user.password = hashedPassword;
        await user.save();

        res.json({ message: "Password updated successfully" });

    } catch (err) {
        console.error("Update error:", err);
        res.status(500).json({ message: "Server error while updating password" });
    }
};


