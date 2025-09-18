import React, { useState } from "react";
import "./Login.css"; // Import CSS file
import { useNavigate } from "react-router-dom";
import {toast} from 'react-toastify'

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const navigate=useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("Email:", email, "Password:", password, "Remember:", remember);

  const url = "http://localhost:5000/api/auth/login";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message || "Wrong Login Credentials");
      return; // stop navigation ❌
    }

    toast.success(data.message);
    localStorage.setItem("token", data.token);
    localStorage.setItem("email", data.email);

    navigate("/dashboard"); // ✅ only runs when login success
  } catch (error) {
    console.error("Login error:", error);
    toast.error("Something went wrong. Please try again.");
  }
};


  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome Back!</h2>
        <p className="subtitle">Sign in to continue</p>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Remember me */}
          <div className="form-options">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
              />
              Remember me
            </label>
            <a href="#" className="forgot-link">
              Forgot Password?
            </a>
          </div>

          {/* Login button */}
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        {/* Signup link */}
        <p className="signup-text">
          Don’t have an account? <a href="#">Sign up</a>
        </p>
      </div>
    </div>
  );
}
