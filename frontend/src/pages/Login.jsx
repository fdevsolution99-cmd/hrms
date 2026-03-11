// src/pages/Login.jsx
import axios from "axios";
import { useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../utils/apiConfig";
import { FiEye, FiEyeOff, FiLock, FiMail } from "react-icons/fi";
import useMeta from "../utils/useMeta";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState({ email: false, password: false });
  const [btnHovered, setBtnHovered] = useState(false);

  const canonical = useMemo(() => `${window.location.origin}/login`, []);
  useMeta({
    title: "Login — FDEV HRMS",
    description: "Access your FDEV HRMS account to manage attendance, leaves, payslips and more.",
    keywords: "HRMS login, employee portal, FDEV",
    url: canonical,
    image: "/images/fdev.jpeg",
  });

  const validateEmail = (e) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE}/api/auth/login`,
        { email, password }
      );

      if (response.data?.success) {
        login(response.data.user);
        localStorage.setItem("token", response.data.token || "");
        if (remember) localStorage.setItem("rememberEmail", email);
        else localStorage.removeItem("rememberEmail");

        // redirect based on role
        if (response.data.user.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/employee-dashboard/attendance");
        }
      } else {
        setError(response.data?.error || "Login failed");
      }
    } catch (err) {
      // friendly error reporting
      if (err.response?.data?.error) setError(err.response.data.error);
      else setError("Server error — try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="login-container"
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        backgroundColor: "#0d2116",
        backgroundImage: "url('/images/fdev.jpeg')",
        backgroundSize: "100% 135%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* floating card */}
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: "380px",
          maxWidth: "420px",
          width: "92%",
          borderRadius: "24px",
          padding: "40px",
          background: "rgba(0, 0, 0, 0.45)",
          backdropFilter: "blur(1.5px)",
          WebkitBackdropFilter: "blur(1.5px)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          boxShadow: hovered
            ? "0 25px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)"
            : "0 15px 35px rgba(0, 0, 0, 0.4)",
          transform: hovered ? "translateY(-8px)" : "translateY(0)",
          transition: "all 600ms cubic-bezier(.2,.9,.2,1)",
          color: "#fff",
          animation: "fadeIn 800ms ease-out both",
        }}
      >
        <h1
          style={{
            fontSize: "26px",
            fontWeight: 800,
            marginBottom: "12px",
            textAlign: "center",
            letterSpacing: "0.5px",
            color: "#FFFFFF",
            textShadow: "0 2px 10px rgba(0,0,0,0.3)",
            lineHeight: "1.2",
          }}
        >
          WELCOME TO<br />
          <span style={{
            color: "#C1F7E6",
            fontSize: "30px",
            background: "linear-gradient(to right, #fff, #C1F7E6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>FDEV SOLUTIONS</span>
        </h1>

        <p
          style={{
            textAlign: "center",
            marginBottom: "24px",
            color: "rgba(255, 255, 255, 0.7)",
            fontSize: "14px",
            fontWeight: "400",
          }}
        >
          Securely login to your account
        </p>

        {error && (
          <div
            role="alert"
            style={{
              background: "linear-gradient(90deg,#40120b,#7a1c1c)",
              color: "#fff",
              padding: "8px 12px",
              borderRadius: "8px",
              marginBottom: "14px",
              fontSize: "13px",
              boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.08)",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div style={{ marginBottom: "14px" }}>
            <label
              htmlFor="email"
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                marginBottom: "8px",
                color: focused.email ? "#C1F7E6" : "rgba(255, 255, 255, 0.8)",
                transition: "color 300ms ease",
              }}
            >
              Email Address
            </label>
            <div style={{ position: "relative" }}>
              {/* input */}
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocused((s) => ({ ...s, email: true }))}
                onBlur={() => setFocused((s) => ({ ...s, email: false }))}
                placeholder="you@example.com"
                required
                style={{
                  width: "100%",
                  padding: "14px 16px 14px 46px",
                  borderRadius: "12px",
                  border: focused.email
                    ? "1px solid rgba(193, 247, 230, 0.5)"
                    : "1px solid rgba(255, 255, 255, 0.15)",
                  background: focused.email
                    ? "rgba(255, 255, 255, 0.08)"
                    : "rgba(255, 255, 255, 0.04)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  color: "#ffffff",
                  fontSize: "15px",
                  fontWeight: "500",
                  outline: "none",
                  transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: focused.email
                    ? "0 0 0 4px rgba(193, 247, 230, 0.1)"
                    : "none",
                }}
              />

              <FiMail
                size={20}
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  opacity: focused.email ? 1 : 0.6,
                  color: focused.email ? "#C1F7E6" : "#fff",
                  zIndex: 10,
                  pointerEvents: "none",
                  transition: "all 300ms ease",
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: "12px" }}>
            <label
              htmlFor="password"
              style={{
                display: "block",
                fontSize: "13px",
                marginBottom: "6px",
                color: focused.password ? "#C1F7E6" : "#BFDCD3",
              }}
            >
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocused((s) => ({ ...s, password: true }))}
                onBlur={() => setFocused((s) => ({ ...s, password: false }))}
                placeholder="Enter your password"
                required
                style={{
                  width: "100%",
                  padding: "14px 50px 14px 44px",
                  borderRadius: "12px",
                  border: focused.password
                    ? "1px solid rgba(193, 247, 230, 0.5)"
                    : "1px solid rgba(255, 255, 255, 0.15)",
                  background: focused.password
                    ? "rgba(255, 255, 255, 0.08)"
                    : "rgba(255, 255, 255, 0.04)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  color: "#ffffff",
                  fontSize: "15px",
                  fontWeight: "500",
                  outline: "none",
                  transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: focused.password
                    ? "0 0 0 4px rgba(193, 247, 230, 0.1)"
                    : "none",
                }}
              />

              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  color: focused.password ? "#C1F7E6" : "rgba(255,255,255,0.5)",
                  cursor: "pointer",
                  padding: "4px",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 20,
                  transition: "all 300ms ease",
                }}
              >
                {showPassword ? (
                  <FiEyeOff size={18} />
                ) : (
                  <FiEye size={18} />
                )}
              </button>

              <FiLock
                size={20}
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  opacity: focused.password ? 1 : 0.6,
                  color: focused.password ? "#C1F7E6" : "#fff",
                  zIndex: 10,
                  pointerEvents: "none",
                  transition: "all 300ms ease",
                }}
              />
            </div>
          </div>

          {/* remember + forgot */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "right",
              marginBottom: "16px",
            }}
          >


            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              onMouseEnter={(e) => (e.target.style.color = "#C1F7E6")}
              onMouseLeave={(e) => (e.target.style.color = "#BFDCD3")}
              style={{
                background: "transparent",
                border: "none",
                color: "#BFDCD3",
                fontSize: "13px",
                textDecoration: "none",
                cursor: "pointer",
                padding: "2px 4px",
                transition: "color 200ms ease",
                fontWeight: "500",
              }}
            >
              Forgot password?
            </button>
          </div>

          {/* submit */}
          <div style={{ marginBottom: "6px" }}>
            <button
              type="submit"
              disabled={loading}
              onMouseEnter={() => setBtnHovered(true)}
              onMouseLeave={() => setBtnHovered(false)}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "12px",
                background: loading
                  ? "rgba(193, 247, 230, 0.2)"
                  : btnHovered
                    ? "linear-gradient(135deg, #C1F7E6 0%, #3B82F6 100%)"
                    : "#3B82F6",
                color: btnHovered ? "#0a1f16" : "#fff",
                fontSize: "16px",
                fontWeight: "700",
                cursor: loading ? "not-allowed" : "pointer",
                border: "none",
                boxShadow: btnHovered
                  ? "0 12px 24px rgba(59, 130, 246, 0.4), 0 0 0 2px rgba(193, 247, 230, 0.4)"
                  : "0 4px 12px rgba(0, 0, 0, 0.2)",
                transition: "all 400ms cubic-bezier(0.4, 0, 0.2, 1)",
                transform: btnHovered ? "translateY(-2px)" : "translateY(0)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                marginTop: "12px",
              }}
            >
              {loading ? (
                <>
                  <div className="spinner" />
                  Signing in...
                </>
              ) : (
                "Login to Dashboard"
              )}
            </button>

          </div>

          {/* small note */}

        </form>
      </div>

      {/* local style for keyframes */}
      <style>
        {`
          .login-container {
             justify-content: center;
             padding: 32px;
          }
          input::placeholder {
             color: rgba(255, 255, 255, 0.5) !important;
             font-weight: 400;
          }
          input:focus::placeholder {
             color: rgba(255, 255, 255, 0.7) !important;
          }
          input {
            color: #ffffff !important;
          }
          input:focus {
            color: #ffffff !important;
            -webkit-text-fill-color: #ffffff !important;
          }
          input:-webkit-autofill,
          input:-webkit-autofill:hover, 
          input:-webkit-autofill:focus, 
          input:-webkit-autofill:active  {
            -webkit-box-shadow: 0 0 0 1000px #0a1f16 inset !important;
            -webkit-text-fill-color: #ffffff !important;
            caret-color: white !important;
            transition: background-color 5000s ease-in-out 0s;
          }
          @media (max-width: 768px) {
             .login-container {
                justify-content: center;
                padding: 32px 16px;
                background-size: contain !important;
                background-position: center !important;
             }
          }
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(6px) scale(0.995); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}
      </style>
    </div>
  );
};

export default Login;
