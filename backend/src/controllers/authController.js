import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AuthModel from "../models/authModel.js";
import config from "../config/config.js";
import { sendOTP } from "../services/emailService.js";
import User from "../models/user.js";
//here when the user asks for a verification code, (when he tryes to login). this function triggers.
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByEmail({ userEmail: email });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    // 10 minutes expiry
    const expiresAt = new Date(Date.now() + 10 * 30000);

    await AuthModel.storeVerificationCode({
      userId: user.userId,
      otpCode,
      expiresAt,
    });

    await sendOTP({ user: user, otpCode: otpCode });

    res.json({
      mfaRequired: true,
      userId: user.userId,
      expiresAt: expiresAt.toISOString(),
      message: "Verification code sent to your email.",
    });
  } catch (error) {
    res.status(500).json({ message: "Login error", error: error.message });
  }
};

//resending otp, but didnt implement it yet.
export const resendOTP = async (req, res) => {
  const { userId } = req.body;
  try {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60000);

    await AuthModel.storeVerificationCode({ userId, otpCode, expiresAt });
    // await sendOTP({ userId, otpCode }); // Implement email sending

    res.json({
      success: true,
      expiresAt: expiresAt.toISOString(),
      message: "New code sent!",
    });
  } catch (error) {
    res.status(500).json({ message: "Resend error" });
  }
};

//verifyng the otp .
export const verifyOTP = async (req, res) => {
  const { userId, code } = req.body;

  try {
    const validRecord = await AuthModel.verifyCode(userId, code);
    if (!validRecord) {
      return res.status(400).json({ message: "Invalid or expired code." });
    }

    await AuthModel.consumeCode(userId);
    const user = await User.findById({ userId });

    // IMPORTANT: Include the role so your authorizeRoles middleware works!
    const token = jwt.sign(
      { userId: user.userId, role: user.userRole },
      config.jwtSecret,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      token,
      message: "Authenticated successfully",
      user: {
        userId: user.userId,
        username: user.userName,
        email: user.userEmail,
        userRole: user.userRole,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Verification error" });
  }
};
//validating the token, each time the user tryes to do something.
export const validateToken = async (req, res) => {
  try {
    // req.user comes from authenticateToken middleware
    const user = await User.findById({ userId: req.user.userId });

    if (!user) return res.status(404).json({ success: false });
    console.log(user);
    res.status(200).json({
      success: true,
      user: {
        userId: user.userId,
        username: user.userName,
        email: user.userEmail,
        userRole: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
