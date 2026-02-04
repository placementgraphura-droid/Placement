import Intern from "../model/RegisterDB/internSchema.js";
import Mentor from "../model/RegisterDB/mentorSchema.js";
import HiringTeam from "../model/RegisterDB/hiringSchema.js"
import Admin from "../model/RegisterDB/adminSchema.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";


//Intern Authentication Controllers .............................................. 

export const registerIntern = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      college,
      course,
      yearOfStudy,
      domain,
      skills,
      resumeUrl,
      linkedinUrl,
      githubUrl
    } = req.body;

    if (!name || !email || !phone || !password || !college || !course ) {
      return res.status(400).json({ message: "All required fields must be filled." });
    }

    const existingUser = await Intern.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let profileImage = "";
    if (req.file) {
      profileImage = req.file.path;
    }

    // ⭐ Parse skills safely
    let parsedSkills = [];

    if (skills) {
      try {
        const rawSkills = JSON.parse(skills);

        parsedSkills = rawSkills.map(s => {
          if (typeof s === "string") return { name: s };
          if (typeof s === "object" && s.name) return s;
          return null;
        }).filter(Boolean);

      } catch (err) {
        console.log("Invalid skills format", err);
      }
    }

    const newIntern = new Intern({
      name,
      email,
      phone,
      password: hashedPassword,
      college,
      course,
      yearOfStudy,
      domain,
      skills: parsedSkills,
      resumeUrl,
      linkedinUrl,
      githubUrl,
      profileImage
    });

    await newIntern.save();

    return res.status(201).json({
      message: "Registration successful",
      intern: {
        id: newIntern._id,
        name: newIntern.name,
        email: newIntern.email
      }
    });

  } catch (error) {
    console.error("Registration Error:", error);
    return res.status(500).json({ message: "Server error during registration" });
  }
};


export const internLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and Password are required" });
    }

    const intern = await Intern.findOne({ email });
    if (!intern) {
      return res.status(404).json({ message: "Intern not found" });
    }

    if (!intern.isActive) {
      return res.status(403).json({ message: "Account is inactive Please contact admin or support team." });
    }

    const isMatch = await bcrypt.compare(password, intern.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Create JWT with role = intern
    const token = jwt.sign(
      {
        id: intern._id,
        role: "intern",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      message: "Intern logged in successfully",
      token,
      intern: {
        name: intern.name,
        email: intern.email,
      },
    });

  } catch (error) {
    console.error("Intern Login Error =>", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const checkAuth = async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user, // contains { id, role }
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};




//mentor Authentication Controllers ..............................................




export const registerMentor = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      privateKey,
      experience,
      domain,
      linkedinUrl,
      githubUrl
    } = req.body;

    // 1. Check if admin private key correct
    if (privateKey !== process.env.MENTOR_PRIVATE_KEY) {
      return res.status(400).json({ message: "Invalid private key!" });
    }

    // 2. Check existing mentor
    const existing = await Mentor.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Get Cloudinary URL (if image exists)
    let profileImage = "";
    if (req.file) {
      profileImage = req.file.path;
    }

    const mentor = await Mentor.create({
      name,
      email,
      phone,
      password: hashedPassword,
      experience,
      domain,
      linkedinUrl,
      githubUrl,
      profileImage,
    });

    return res.status(201).json({
      message: "Mentor registered successfully",
      mentorId: mentor._id
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Server error during registration",
    });
  }
};


export const loginMentor = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }


    // 2. Check mentor exists
    const mentor = await Mentor.findOne({ email });
    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    if (!mentor.isactive) {
      return res.status(403).json({ message: "Account is inactive Please contact admin or support team." });
    }

    // 3. Match password
    const isMatch = await bcrypt.compare(password, mentor.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // 4. Create JWT token
    const token = jwt.sign(
      {
        id: mentor._id,
        role: "mentor",
        email: mentor.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );


    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      message: "Login successful",
      token,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};




// Hiring Team authentication .................................................




export const registerHiringTeam = async (req, res) => {
  try {
    const { name, email, phone, role, experience, privateKey, password } = req.body;

    // Check required fields
    if (!name || !email || !privateKey || !password) {
      return res.status(400).json({ message: "Required fields missing." });
    }

    // Check if email already exists
    const existingUser = await HiringTeam.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered." });
    }

    if (privateKey !== process.env.HIRING_TEAM_PRIVET_KEY) {
      return res.status(400).json({ message: "Invalid private key!" });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Image path from multer
    let profileImage = "";
    if (req.file) {
      profileImage = req.file.path;
    }
    // Create new record
    const hiringTeamMember = await HiringTeam.create({
      name,
      email,
      phone,
      role,
      experience,
      password: hashedPassword,
      profileImage
    });

    res.status(201).json({
      message: "Hiring team member registered successfully",
      hiringTeamMember,
    });

  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



export const loginHiring = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // 2. Check mentor exists
    const Hiring = await HiringTeam.findOne({ email });
    if (!Hiring) {
      return res.status(404).json({ message: "HR not found" });
    }

    if (Hiring.isactive === false) {
      return res.status(403).json({ message: "Account is inactive Please contact admin or support team." });
    }

    // 3. Match password
    const isMatch = await bcrypt.compare(password, Hiring.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // 4. Create JWT token
    const token = jwt.sign(
      {
        id: Hiring._id,
        role: "HiringTeam",
        email: Hiring.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );


    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });


    return res.status(200).json({
      message: "Login successful",
      token,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};




//admin authentication .................................................... 

export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, privateKey } = req.body;

    // Validate private key
    if (privateKey !== process.env.ADMIN_PRIVET_KEY) {
      return res.status(401).json({
        success: false,
        message: 'Invalid private key. Registration not authorized.',
      });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin with this email already exists',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new admin
    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
    });

    // Remove password from response
    const adminResponse = {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      createdAt: admin.createdAt
    };

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      data: {
        admin: adminResponse
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};



export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // 2. Check if user exists
    const user = await Admin.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Debug: Log password field to catch undefined
    if (!user.password) {
      console.error("Error: Password field is missing for user:", user.email);
      return res.status(500).json({ message: "Password not found for this admin. Please check DB." });
    }

    // 3. Match password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // 4. Create JWT token
    const token = jwt.sign(
      {
        id: user._id,
        role: "admin",
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 5. Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      message: "Login successful",
      token,
    });

  } catch (error) {
    console.error("Login Error:", error.message || error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};



// Store OTPs temporarily (in production use Redis or database)
const otpStore = new Map();

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via Brevo - Fixed to work with your sendEmail function
const sendOTPEmail = async (email, otp, name) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #0D5D84, #09435F); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">Graphura</h1>
        <p style="color: #D4E5EE; margin: 10px 0 0 0;">Password Reset</p>
      </div>
      
      <div style="padding: 30px; background: white; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0;">
        <h2 style="color: #333; margin-bottom: 20px;">Password Reset Request</h2>
        <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
          Hello ${name},<br>
          You requested to reset your password. Use the OTP below to verify your identity:
        </p>
        
        <div style="background: #f8f9fa; border: 2px dashed #0D5D84; padding: 25px; text-align: center; border-radius: 8px; margin: 25px 0;">
          <p style="color: #666; margin: 0 0 10px 0; font-size: 14px;">Your OTP Code</p>
          <div style="font-size: 36px; font-weight: bold; letter-spacing: 10px; color: #0D5D84;">
            ${otp}
          </div>
          <p style="color: #999; font-size: 12px; margin: 10px 0 0 0;">
            This OTP will expire in 10 minutes
          </p>
        </div>
        
        <p style="color: #666; line-height: 1.6; font-size: 14px;">
          If you didn't request this password reset, please ignore this email or contact support if you have concerns.
        </p>
        
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
        
        <div style="text-align: center;">
          <p style="color: #999; font-size: 12px; margin: 0;">
            This email was sent from Graphura<br>
            © ${new Date().getFullYear()} Graphura. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  `;

  try {
    // Call sendEmail with correct parameters based on your function signature
    await sendEmail(email, 'Your Password Reset OTP - Graphura', htmlContent);
    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send OTP email: ' + error.message);
  }
};

// Forgot Password - Send OTP for Intern
export const forgotPasswordIntern = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false,
        message: "Email is required" 
      });
    }

    // Check if intern exists
    const intern = await Intern.findOne({ email });
    if (!intern) {
      return res.status(404).json({ 
        success: false,
        message: "No account found with this email" 
      });
    }

    if (!intern.isActive) {
      return res.status(403).json({ 
        success: false,
        message: "Account is inactive. Please contact support." 
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiryTime = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP with expiry
    otpStore.set(`intern_${email}`, {
      otp,
      expiresAt: expiryTime,
      userId: intern._id,
      role: 'intern'
    });

    // Send OTP email
    await sendOTPEmail(email, otp, intern.name);

    res.status(200).json({
      success: true,
      message: "OTP sent to your email",
      expiresIn: 600, // 10 minutes in seconds
      email: email,
      role: 'intern'
    });

  } catch (error) {
    console.error("Forgot password error (Intern):", error);
    res.status(500).json({ 
      success: false,
      message: error.message || "Server error" 
    });
  }
};

// Forgot Password - Send OTP for Mentor
export const forgotPasswordMentor = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false,
        message: "Email is required" 
      });
    }

    // Check if mentor exists
    const mentor = await Mentor.findOne({ email });
    if (!mentor) {
      return res.status(404).json({ 
        success: false,
        message: "No account found with this email" 
      });
    }

    if (!mentor.isactive) {
      return res.status(403).json({ 
        success: false,
        message: "Account is inactive. Please contact support." 
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiryTime = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP with expiry
    otpStore.set(`mentor_${email}`, {
      otp,
      expiresAt: expiryTime,
      userId: mentor._id,
      role: 'mentor'
    });

    // Send OTP email
    await sendOTPEmail(email, otp, mentor.name);

    res.status(200).json({
      success: true,
      message: "OTP sent to your email",
      expiresIn: 600, // 10 minutes in seconds
      email: email,
      role: 'mentor'
    });

  } catch (error) {
    console.error("Forgot password error (Mentor):", error);
    res.status(500).json({ 
      success: false,
      message: error.message || "Server error" 
    });
  }
};

// Forgot Password - Send OTP for Hiring Team
export const forgotPasswordHiring = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false,
        message: "Email is required" 
      });
    }

    // Check if hiring team member exists
    const hiringMember = await HiringTeam.findOne({ email });
    if (!hiringMember) {
      return res.status(404).json({ 
        success: false,
        message: "No account found with this email" 
      });
    }

    if (!hiringMember.isactive) {
      return res.status(403).json({ 
        success: false,
        message: "Account is inactive. Please contact support." 
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiryTime = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP with expiry
    otpStore.set(`hiring_${email}`, {
      otp,
      expiresAt: expiryTime,
      userId: hiringMember._id,
      role: 'hiring'
    });

    // Send OTP email
    await sendOTPEmail(email, otp, hiringMember.name);

    res.status(200).json({
      success: true,
      message: "OTP sent to your email",
      expiresIn: 600, // 10 minutes in seconds
      email: email,
      role: 'hiring'
    });

  } catch (error) {
    console.error("Forgot password error (Hiring):", error);
    res.status(500).json({ 
      success: false,
      message: error.message || "Server error" 
    });
  }
};

// Forgot Password - Send OTP for Admin
export const forgotPasswordAdmin = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false,
        message: "Email is required" 
      });
    }

    // Check if admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ 
        success: false,
        message: "No account found with this email" 
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiryTime = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP with expiry
    otpStore.set(`admin_${email}`, {
      otp,
      expiresAt: expiryTime,
      userId: admin._id,
      role: 'admin'
    });

    // Send OTP email
    await sendOTPEmail(email, otp, admin.name);

    res.status(200).json({
      success: true,
      message: "OTP sent to your email",
      expiresIn: 600, // 10 minutes in seconds
      email: email,
      role: 'admin'
    });

  } catch (error) {
    console.error("Forgot password error (Admin):", error);
    res.status(500).json({ 
      success: false,
      message: error.message || "Server error" 
    });
  }
};

// Verify OTP
const verifyOTP = (email, role, otp) => {
  const key = `${role}_${email}`;
  const storedData = otpStore.get(key);

  if (!storedData) {
    return { valid: false, message: "OTP not found or expired" };
  }

  if (Date.now() > storedData.expiresAt) {
    otpStore.delete(key);
    return { valid: false, message: "OTP has expired" };
  }

  if (storedData.otp !== otp) {
    return { valid: false, message: "Invalid OTP" };
  }

  return { 
    valid: true, 
    userId: storedData.userId,
    role: storedData.role 
  };
};

// Verify OTP for all roles
export const verifyOTPController = async (req, res) => {
  try {
    const { email, role, otp } = req.body;

    if (!email || !role || !otp) {
      return res.status(400).json({ 
        success: false,
        message: "Email, role and OTP are required" 
      });
    }

    const verification = verifyOTP(email, role, otp);

    if (!verification.valid) {
      return res.status(400).json({ 
        success: false,
        message: verification.message 
      });
    }

    // Generate reset token using crypto module
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes

    // Store reset token based on role
    const tokenKey = `${role}_reset_${email}`;
    otpStore.set(tokenKey, {
      userId: verification.userId,
      token: resetToken,
      expiresAt: resetTokenExpiry,
      role: verification.role
    });

    // Remove OTP after successful verification
    otpStore.delete(`${role}_${email}`);

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      resetToken: resetToken,
      email: email,
      role: role
    });

  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
};

// Resend OTP
export const resendOTPController = async (req, res) => {
  try {
    const { email, role } = req.body;

    if (!email || !role) {
      return res.status(400).json({ 
        success: false,
        message: "Email and role are required" 
      });
    }

    let user;
    let userModel;

    // Find user based on role
    switch (role) {
      case 'intern':
        userModel = Intern;
        break;
      case 'mentor':
        userModel = Mentor;
        break;
      case 'hiring':
        userModel = HiringTeam;
        break;
      case 'admin':
        userModel = Admin;
        break;
      default:
        return res.status(400).json({ 
          success: false,
          message: "Invalid role" 
        });
    }

    user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    const expiryTime = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP
    otpStore.set(`${role}_${email}`, {
      otp,
      expiresAt: expiryTime,
      userId: user._id,
      role: role
    });

    // Send OTP email
    await sendOTPEmail(email, otp, user.name);

    res.status(200).json({
      success: true,
      message: "New OTP sent to your email",
      expiresIn: 600
    });

  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({ 
      success: false,
      message: error.message || "Server error" 
    });
  }
};

// Reset Password
export const resetPasswordController = async (req, res) => {
  try {
    const { email, role, resetToken, newPassword } = req.body;

    if (!email || !role || !resetToken || !newPassword) {
      return res.status(400).json({ 
        success: false,
        message: "All fields are required" 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        success: false,
        message: "Password must be at least 6 characters" 
      });
    }

    // Verify reset token
    const tokenKey = `${role}_reset_${email}`;
    const tokenData = otpStore.get(tokenKey);

    if (!tokenData) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid or expired reset token" 
      });
    }

    if (Date.now() > tokenData.expiresAt) {
      otpStore.delete(tokenKey);
      return res.status(400).json({ 
        success: false,
        message: "Reset token has expired" 
      });
    }

    if (tokenData.token !== resetToken) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid reset token" 
      });
    }

    // Find user model based on role
    let userModel;
    switch (role) {
      case 'intern':
        userModel = Intern;
        break;
      case 'mentor':
        userModel = Mentor;
        break;
      case 'hiring':
        userModel = HiringTeam;
        break;
      case 'admin':
        userModel = Admin;
        break;
      default:
        return res.status(400).json({ 
          success: false,
          message: "Invalid role" 
        });
    }

    // Find user and update password
    const user = await userModel.findById(tokenData.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Clean up tokens
    otpStore.delete(tokenKey);

    res.status(200).json({
      success: true,
      message: "Password reset successful"
    });

  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
};