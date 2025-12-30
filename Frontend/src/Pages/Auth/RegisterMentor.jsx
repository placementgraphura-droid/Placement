import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    Eye,
    EyeOff,
    User,
    Mail,
    Phone,
    Lock,
    Briefcase,
    Code,
    FileText,
    Linkedin,
    Github,
    Shield,
    RefreshCw,
    CheckCircle,
    XCircle,
    Award,
    Calendar,
    Upload,
    Key,
    LogIn,
    AlertCircle
} from "lucide-react";

const getRandomInt = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

const createCaptcha = () => {
    const operations = [
        { op: "+", fn: (a, b) => a + b },
        { op: "-", fn: (a, b) => a - b },
        { op: "×", fn: (a, b) => a * b }
    ];
    const operation = operations[getRandomInt(0, 2)];
    const a = getRandomInt(1, 12);
    const b = getRandomInt(1, 12);
    const answer = operation.fn(a, b);
    return {
        question: `${a} ${operation.op} ${b}`,
        answer: answer.toString(),
        operation: operation.op
    };
};

const MentorRegister = () => {
    const navigate = useNavigate();

    // Form state
    const [formData, setFormData] = useState({
        // 👤 Basic Details
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        privateKey: "", // New private key field

        // 💼 Professional Details
        experience: "",
        domain: "", // Single domain selection
        profileImage: null,
        linkedinUrl: "",
        githubUrl: ""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [captcha, setCaptcha] = useState(createCaptcha());
    const [captchaInput, setCaptchaInput] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showPrivateKey, setShowPrivateKey] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [shake, setShake] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        feedback: ""
    });
    const [imagePreview, setImagePreview] = useState("");

    // Admin-controlled domains
    const domains = [
        "Frontend Development",
        "Backend Development",
        "Full Stack Development",
        "MERN Stack",
        "MEAN Stack",

        "Data Science",
        "Machine Learning",
        "Artificial Intelligence",

        "DevOps",
        "Cloud Computing",
        "Cyber Security",

        "UI/UX Design",
        "Android Development",
        "iOS Development",

        "Software Testing / QA",
        "Blockchain Development",
        "Game Development",


        "Human Resources",
        "Business Development",
        "Digital Marketing",
        "Social Media Management",

        "Content Writing",
        "Graphic Design",
        "Finance",
        "Accounting",

        "Sales & Marketing",
        "Customer Support",
        "Operations Management",
        "Project Management",
        "Email and Outreaching",
        "Public Relations",
        "Event Management", 
        "Quality Assurance",
    ];


    // Password strength checker
    const checkPasswordStrength = (password) => {
        let score = 0;
        let feedback = [];

        if (password.length >= 8) score++;
        else feedback.push("At least 8 characters");

        if (/[A-Z]/.test(password)) score++;
        else feedback.push("One uppercase letter");

        if (/[a-z]/.test(password)) score++;
        else feedback.push("One lowercase letter");

        if (/[0-9]/.test(password)) score++;
        else feedback.push("One number");

        if (/[^A-Za-z0-9]/.test(password)) score++;
        else feedback.push("One special character");

        return {
            score,
            feedback: feedback.length > 0 ? `Missing: ${feedback.join(", ")}` : "Strong password!"
        };
    };

    useEffect(() => {
        if (error) {
            setShake(true);
            const timer = setTimeout(() => setShake(false), 500);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Check password strength in real-time
        if (field === "password") {
            setPasswordStrength(checkPasswordStrength(value));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type and size
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            const maxSize = 5 * 1024 * 1024; // 5MB

            if (!validTypes.includes(file.type)) {
                setError('Please select a valid image file (JPEG, PNG, GIF)');
                setShake(true);
                setTimeout(() => setShake(false), 500);
                return;
            }

            if (file.size > maxSize) {
                setError('Image size should be less than 5MB');
                setShake(true);
                setTimeout(() => setShake(false), 500);
                return;
            }

            setFormData(prev => ({
                ...prev,
                profileImage: file
            }));

            // Create image preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
            setError("");
        }
    };

    const validateForm = () => {
        // Required fields validation
        const requiredFields = [
            'name', 'email', 'phone', 'password', 'confirmPassword',
            'privateKey', 'experience', 'domain'
        ];

        const missingFields = requiredFields.filter(field => !formData[field]);
        if (missingFields.length > 0) {
            setError(`Please fill in all required fields`);
            setShake(true);
            setTimeout(() => setShake(false), 500);
            return false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError("Please enter a valid email address");
            setShake(true);
            setTimeout(() => setShake(false), 500);
            return false;
        }

        // Phone validation (basic)
        if (formData.phone.length < 10) {
            setError("Please enter a valid phone number");
            setShake(true);
            setTimeout(() => setShake(false), 500);
            return false;
        }

        // Password confirmation
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setShake(true);
            setTimeout(() => setShake(false), 500);
            return false;
        }

        // Password strength
        if (passwordStrength.score < 3) {
            setError("Please choose a stronger password");
            setShake(true);
            setTimeout(() => setShake(false), 500);
            return false;
        }

        // Experience validation
        const experience = parseInt(formData.experience);
        if (isNaN(experience) || experience < 0 || experience > 50) {
            setError("Experience must be between 0 and 50 years");
            setShake(true);
            setTimeout(() => setShake(false), 500);
            return false;
        }

        // Private key validation (basic length check)
        if (formData.privateKey.length < 8) {
            setError("Private key must be at least 8 characters long");
            setShake(true);
            setTimeout(() => setShake(false), 500);
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!validateForm()) {
            return;
        }

        if (captchaInput !== captcha.answer) {
            setError("Captcha answer is incorrect. Please try again.");
            setCaptcha(createCaptcha());
            setCaptchaInput("");
            setShake(true);
            setTimeout(() => setShake(false), 500);
            return;
        }

        setIsLoading(true);

        try {
            // Create FormData for file upload
            const submitData = new FormData();
            submitData.append('name', formData.name);
            submitData.append('email', formData.email);
            submitData.append('phone', formData.phone);
            submitData.append('password', formData.password);
            submitData.append('privateKey', formData.privateKey);
            submitData.append('experience', formData.experience);
            submitData.append('domain', formData.domain);
            submitData.append('linkedinUrl', formData.linkedinUrl);
            submitData.append('githubUrl', formData.githubUrl);

            if (formData.profileImage) {
                submitData.append('profileImage', formData.profileImage);
            }

            await axios.post('/api/mentor/register', submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setSuccess("Mentor registered successfully! Redirecting to login...");

            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate("/mentor-login");
            }, 2000);

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Registration failed. Please try again."
            );
            setCaptcha(createCaptcha());
            setCaptchaInput("");
            setShake(true);
            setTimeout(() => setShake(false), 500);
        } finally {
            setIsLoading(false);
        }
    };

    const refreshCaptcha = () => {
        setCaptcha(createCaptcha());
        setCaptchaInput("");
    };

    const getPasswordStrengthColor = () => {
        if (passwordStrength.score === 0) return "bg-white/20";
        if (passwordStrength.score <= 2) return "bg-red-500";
        if (passwordStrength.score <= 3) return "bg-yellow-500";
        return "bg-green-500";
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-cover bg-center bg-fixed"
            style={{
                backgroundImage: `
                    linear-gradient(
                        to bottom right,
                        rgba(13,93,132,0.85),
                        rgba(42,151,206,0.85),
                        rgba(9,67,95,0.85)
                    ),
                    url('/herobg.png')
                `
            }}>
            {/* Subtle Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(#FEFEFE 10px, transparent 10px)`,
                    backgroundSize: '30px 30px'
                }}></div>
            </div>

            {/* Logo */}
            <div className="absolute top-6 left-6">
                <img
                    src="/logoWhite.png"
                    alt="Graphura Logo"
                    className="w-60"
                />
            </div>

            {/* Main Container */}
            <div className="w-full mt-10 max-w-4xl mx-auto relative py-8">
                {/* Transparent Glass Form */}
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-auto max-h-[90vh]">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                            Mentor Registration
                        </h1>
                        <p className="text-white/80 text-sm sm:text-base">
                            Join our platform as a mentor and guide the next generation
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* 👤 Basic Details Section */}
                        <div className="border-b border-white/20 pb-6">
                            <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 flex items-center">
                                <User className="w-5 h-5 mr-2 text-[#D4E5EE]" />
                                Basic Details
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="flex items-center text-sm font-medium text-white/90 mb-2">
                                        <User className="w-4 h-4 mr-2 text-[#D4E5EE]" />
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter your full name"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange("name", e.target.value)}
                                        className="w-full p-3 bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:border-[#D4E5EE] focus:ring-2 focus:ring-[#D4E5EE]/30 text-white placeholder-white/50 transition-all duration-200"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center text-sm font-medium text-white/90 mb-2">
                                        <Mail className="w-4 h-4 mr-2 text-[#D4E5EE]" />
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="Enter your email address"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange("email", e.target.value)}
                                        className="w-full p-3 bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:border-[#D4E5EE] focus:ring-2 focus:ring-[#D4E5EE]/30 text-white placeholder-white/50 transition-all duration-200"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center text-sm font-medium text-white/90 mb-2">
                                        <Phone className="w-4 h-4 mr-2 text-[#D4E5EE]" />
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        placeholder="Enter your phone number"
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange("phone", e.target.value)}
                                        className="w-full p-3 bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:border-[#D4E5EE] focus:ring-2 focus:ring-[#D4E5EE]/30 text-white placeholder-white/50 transition-all duration-200"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center text-sm font-medium text-white/90 mb-2">
                                        <Key className="w-4 h-4 mr-2 text-[#D4E5EE]" />
                                        Private Key *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPrivateKey ? "text" : "password"}
                                            placeholder="Enter your private key"
                                            value={formData.privateKey}
                                            onChange={(e) => handleInputChange("privateKey", e.target.value)}
                                            className="w-full p-3 pl-10 pr-10 bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:border-[#D4E5EE] focus:ring-2 focus:ring-[#D4E5EE]/30 text-white placeholder-white/50 transition-all duration-200"
                                            required
                                        />
                                        <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#D4E5EE]" />
                                        <button
                                            type="button"
                                            onClick={() => setShowPrivateKey(!showPrivateKey)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                                        >
                                            {showPrivateKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    <p className="text-xs text-[#D4E5EE]/80 mt-1">
                                        Contact admin to get your private registration key
                                    </p>
                                </div>

                                <div>
                                    <label className="flex items-center text-sm font-medium text-white/90 mb-2">
                                        <Lock className="w-4 h-4 mr-2 text-[#D4E5EE]" />
                                        Password *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Create a strong password"
                                            value={formData.password}
                                            onChange={(e) => handleInputChange("password", e.target.value)}
                                            className="w-full p-3 pl-10 pr-10 bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:border-[#D4E5EE] focus:ring-2 focus:ring-[#D4E5EE]/30 text-white placeholder-white/50 transition-all duration-200"
                                            required
                                        />
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#D4E5EE]" />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>

                                    {/* Password Strength Indicator */}
                                    {formData.password && (
                                        <div className="mt-2">
                                            <div className="flex justify-between text-xs text-white/80 mb-1">
                                                <span>Password Strength:</span>
                                                <span>{passwordStrength.feedback}</span>
                                            </div>
                                            <div className="w-full bg-white/20 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                                                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="flex items-center text-sm font-medium text-white/90 mb-2">
                                        <Lock className="w-4 h-4 mr-2 text-[#D4E5EE]" />
                                        Confirm Password *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Confirm your password"
                                            value={formData.confirmPassword}
                                            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                                            className="w-full p-3 pl-10 pr-10 bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:border-[#D4E5EE] focus:ring-2 focus:ring-[#D4E5EE]/30 text-white placeholder-white/50 transition-all duration-200"
                                            required
                                        />
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#D4E5EE]" />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>

                                    {/* Password Match Indicator */}
                                    {formData.confirmPassword && (
                                        <div className="mt-2 flex items-center space-x-2">
                                            {formData.password === formData.confirmPassword ? (
                                                <>
                                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                                    <span className="text-xs text-green-300">Passwords match</span>
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle className="w-4 h-4 text-red-400" />
                                                    <span className="text-xs text-red-300">Passwords don't match</span>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 💼 Professional Details Section */}
                        <div className="border-b border-white/20 pb-6">
                            <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 flex items-center">
                                <Briefcase className="w-5 h-5 mr-2 text-[#D4E5EE]" />
                                Professional Details
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="flex items-center text-sm font-medium text-white/90 mb-2">
                                        <Calendar className="w-4 h-4 mr-2 text-[#D4E5EE]" />
                                        Years of Experience *
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="50"
                                        placeholder="Enter years of experience"
                                        value={formData.experience}
                                        onChange={(e) => handleInputChange("experience", e.target.value)}
                                        className="w-full p-3 bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:border-[#D4E5EE] focus:ring-2 focus:ring-[#D4E5EE]/30 text-white placeholder-white/50 transition-all duration-200 appearance-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center text-sm font-medium text-white/90 mb-2">
                                        <Code className="w-4 h-4 mr-2 text-[#D4E5EE]" />
                                        Primary Domain *
                                    </label>
                                    <select
                                        value={formData.domain}
                                        onChange={(e) => handleInputChange("domain", e.target.value)}
                                        className="w-full p-3 bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:border-[#D4E5EE] focus:ring-2 focus:ring-[#D4E5EE]/30 text-white placeholder-white/50 transition-all duration-200 appearance-none"
                                        required
                                    >
                                        <option value="" className="bg-[#0D5D84]">Select Your Domain</option>
                                        {domains.map((domain, index) => (
                                            <option key={index} value={domain} className="bg-[#0D5D84]">
                                                {domain}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-xs text-[#D4E5EE]/80 mt-1">
                                        Select your primary expertise domain
                                    </p>
                                </div>

                                <div>
                                    <label className="flex items-center text-sm font-medium text-white/90 mb-2">
                                        <Linkedin className="w-4 h-4 mr-2 text-[#D4E5EE]" />
                                        LinkedIn Profile
                                    </label>
                                    <input
                                        type="url"
                                        placeholder="https://linkedin.com/in/yourprofile"
                                        value={formData.linkedinUrl}
                                        onChange={(e) => handleInputChange("linkedinUrl", e.target.value)}
                                        className="w-full p-3 bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:border-[#D4E5EE] focus:ring-2 focus:ring-[#D4E5EE]/30 text-white placeholder-white/50 transition-all duration-200"
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center text-sm font-medium text-white/90 mb-2">
                                        <Github className="w-4 h-4 mr-2 text-[#D4E5EE]" />
                                        GitHub Profile
                                    </label>
                                    <input
                                        type="url"
                                        placeholder="https://github.com/yourusername"
                                        value={formData.githubUrl}
                                        onChange={(e) => handleInputChange("githubUrl", e.target.value)}
                                        className="w-full p-3 bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:border-[#D4E5EE] focus:ring-2 focus:ring-[#D4E5EE]/30 text-white placeholder-white/50 transition-all duration-200"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 📸 Profile Photo Upload */}
                        <div className="border-b border-white/20 pb-6">
                            <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 flex items-center">
                                <Upload className="w-5 h-5 mr-2 text-[#D4E5EE]" />
                                Profile Photo
                            </h2>

                            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                                {/* Image Preview */}
                                <div className="flex-shrink-0">
                                    <div className="w-32 h-32 rounded-full border-2 border-white/30 overflow-hidden bg-white/10 flex items-center justify-center">
                                        {imagePreview ? (
                                            <img
                                                src={imagePreview}
                                                alt="Profile preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <User className="w-12 h-12 text-white/60" />
                                        )}
                                    </div>
                                </div>

                                {/* Upload Area */}
                                <div className="flex-1">
                                    <label className="flex items-center text-sm font-medium text-white/90 mb-2">
                                        <Upload className="w-4 h-4 mr-2 text-[#D4E5EE]" />
                                        Upload Profile Image
                                    </label>
                                    <div className="border-2 border-dashed border-white/30 rounded-xl p-6 text-center hover:border-[#D4E5EE] transition-colors duration-200 bg-white/5">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            id="profileImage"
                                        />
                                        <label
                                            htmlFor="profileImage"
                                            className="cursor-pointer block"
                                        >
                                            <Upload className="w-12 h-12 text-white/40 mx-auto mb-3" />
                                            <div className="flex flex-col items-center space-y-1">
                                                <span className="text-[#D4E5EE] font-medium">Click to upload</span>
                                                <span className="text-white/60 text-sm">or drag and drop</span>
                                                <span className="text-white/40 text-xs">PNG, JPG, GIF up to 5MB</span>
                                            </div>
                                        </label>
                                    </div>
                                    {formData.profileImage && (
                                        <p className="mt-2 text-sm text-green-300 flex items-center">
                                            <CheckCircle className="w-4 h-4 mr-1" />
                                            Selected: {formData.profileImage.name}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 🔒 Security Check */}
                        <div>
                            <label className="flex items-center text-sm font-medium text-white/90 mb-2">
                                <Shield className="w-4 h-4 mr-2 text-[#D4E5EE]" />
                                Security Check *
                            </label>
                            <div className="bg-white/5 border border-white/20 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-medium text-white/90">Solve this:</span>
                                    <button
                                        type="button"
                                        onClick={refreshCaptcha}
                                        className="flex items-center space-x-1 text-[#D4E5EE] hover:text-white transition-colors text-sm font-medium"
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                        <span>New Challenge</span>
                                    </button>
                                </div>
                                <div className="flex items-center justify-between space-x-4">
                                    <div className="flex-1 bg-white/10 border border-white/20 rounded-lg p-3 text-center">
                                        <span className="text-xl font-bold text-white font-mono">
                                            {captcha.question}
                                        </span>
                                    </div>
                                    <span className="text-xl font-bold text-white">=</span>
                                    <input
                                        type="text"
                                        placeholder="?"
                                        value={captchaInput}
                                        onChange={(e) => setCaptchaInput(e.target.value)}
                                        className="w-20 p-3 bg-white/10 border border-white/20 rounded-lg text-center text-xl font-bold font-mono focus:outline-none focus:border-[#D4E5EE] focus:ring-2 focus:ring-[#D4E5EE]/30 text-white transition-all duration-200"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Error/Success Messages */}
                        {error && (
                            <div className={`bg-red-500/20 border border-red-500/30 rounded-lg p-4 transform transition-all duration-300 ${shake ? 'animate-shake' : ''}`}>
                                <div className="flex items-center space-x-2 text-red-200">
                                    <AlertCircle className="w-5 h-5" />
                                    <span className="font-medium">{error}</span>
                                </div>
                            </div>
                        )}

                        {success && (
                            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                                <div className="flex items-center space-x-2 text-green-200">
                                    <CheckCircle className="w-5 h-5" />
                                    <span className="font-medium">{success}</span>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-[#3287B1] to-[#09435F] hover:from-[#3287B1]/90 hover:to-[#09435F]/90 text-white font-semibold p-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl text-lg"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <LogIn className="w-5 h-5" />
                            )}
                            <span>{isLoading ? "Creating Mentor Account..." : "Register as Mentor"}</span>
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-white/70">
                            Already have an account?{" "}
                            <button
                                onClick={() => navigate("/mentor-login")}
                                className="font-semibold text-[#D4E5EE] hover:text-white transition-colors duration-200 underline underline-offset-2"
                            >
                                Sign In
                            </button>
                        </p>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#3287B1]/20 rounded-full blur-xl -z-10"></div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#09435F]/20 rounded-full blur-xl -z-10"></div>
            </div>

            {/* Custom CSS */}
            <style jsx>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                .animate-shake {
                    animation: shake 0.5s ease-in-out;
                }
                
                /* Custom scrollbar */
                ::-webkit-scrollbar {
                    width: 8px;
                }
                
                ::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 4px;
                }
                
                ::-webkit-scrollbar-thumb {
                    background: rgba(212, 229, 238, 0.3);
                    border-radius: 4px;
                }
                
                ::-webkit-scrollbar-thumb:hover {
                    background: rgba(212, 229, 238, 0.5);
                }

                /* Remove number input arrows */
                input[type="number"]::-webkit-inner-spin-button,
                input[type="number"]::-webkit-outer-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
                
                input[type="number"] {
                    -moz-appearance: textfield;
                }

                /* Select dropdown arrow */
                select {
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23D4E5EE'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
                    background-repeat: no-repeat;
                    background-position: right 1rem center;
                    background-size: 1em;
                    padding-right: 2.5rem;
                }
            `}</style>
        </div>
    );
};

export default MentorRegister;