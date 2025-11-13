import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const createCaptcha = () => {
  const a = getRandomInt(1, 9);
  const b = getRandomInt(1, 9);
  return { question: `${a} + ${b}`, answer: (a + b).toString() };
};

const LoginPage = () => {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [error, setError] = useState("");       
  const [captcha, setCaptcha] = useState(createCaptcha());
  const [captchaInput, setCaptchaInput] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation: At least email or password required
    if (!email && !password) {
      setError("Please enter email or password to login.");
      return;
    }
    if (captchaInput !== captcha.answer) {
      setError("Captcha answer is incorrect");
      setCaptcha(createCaptcha());
      setCaptchaInput("");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Invalid email or password"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-sky-100 flex items-center justify-center">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-lg flex overflow-hidden">
        {/* Left cut-to-cut image */}
        <div className="hidden md:block w-1/2 h-full overflow-hidden">
          <img
            src="/image.png"
            alt="Student Illustration"
            className="w-full h-full object-cover"
            style={{ display: "block" }}
          />
        </div>

        {/* Right login form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-8">
          <h2 className="text-2xl font-bold text-black-800 mb-2">Intern Login</h2>
          <p className="text-gray-800 mb-6">Enter your email or password to log in</p>
          <form onSubmit={handleSubmit} className="flex flex-col">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-2.5 p-3 border rounded-md"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-3 p-3 border rounded-md"
            />
            <div className="mb-3 flex items-center gap-2">
              <span className="font-semibold">{captcha.question} = </span>
              <input
                type="text"
                placeholder="Captcha answer"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                className="p-3 border rounded-md flex-1"
                required
              />
              <button type="button" className="ml-2 text-blue-500" title="Refresh captcha" onClick={() => {
                setCaptcha(createCaptcha());
                setCaptchaInput("");
              }}>↻</button>
            </div>
            {error && <span className="text-red-500 mb-2">{error}</span>}
            <button
              type="submit"
              className="bg-blue-700 text-white font-semibold p-3 rounded-md mb-2"
            >
              Log In
            </button>
          </form>
          <div className="text-center text-gray-500 mt-2">
            Don’t have an account? <a href="#" className="text-blue-700 font-medium">create Account</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
