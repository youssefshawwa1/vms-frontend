import React, { useState, useEffect } from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import {
  MailOutline,
  LockOutlined,
  VpnKeyOutlined,
  ArrowForward,
} from "@mui/icons-material";
import { Cancel } from "@mui/icons-material";
import { useAuth } from "../Contexts/AuthContext";
import fekra from "../assets/logo.png";

const LoginPage = () => {
  const [formData, setFormData] = useState({ userEmail: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({
    userEmail: "",
    password: "",
  });

  const [timeLeft, setTimeLeft] = useState(0);
  const [verifyCode, setVerifyCode] = useState("");
  const [error, setError] = useState("");
  const [verifyError, setVerifyError] = useState("");
  const [resend, setResend] = useState(false);
  const {
    verifyTheCode,
    login,
    loading,
    verificationRequired,
    resetVerification,
    resendCode,
    expiresAt, // This must be updated by your login/resend functions
  } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    let tempErrors = { userEmail: "", password: "" };
    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.userEmail) {
      tempErrors.userEmail = "Email is required!";
      isValid = false;
    } else if (!emailRegex.test(formData.userEmail)) {
      tempErrors.userEmail = "Please enter a valid email address!";
      isValid = false;
    }
    if (!formData.password) {
      tempErrors.password = "Password is required!";
      isValid = false;
    } else if (formData.password.length < 8) {
      tempErrors.password = "Password must be at least 8 characters!";
      isValid = false;
    }
    setFieldErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const result = await login(formData.userEmail, formData.password);
        if (!result.success) setError(result.message);
      } catch (err) {
        setError("Can't Reach Server!");
      }
    }
  };

  useEffect(() => {
    if (verificationRequired) {
      setError("");
    }
  }, [verificationRequired]);

  const muiFieldStyle = {
    "& .MuiInputLabel-root.Mui-focused": { color: "var(--color-main)" },
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#f9fafb",
      borderRadius: "16px",
      transition: "all 0.3s ease",
      "& fieldset": { borderColor: "transparent" },
      "&:hover": { backgroundColor: "#f3f4f6" },
      "&.Mui-focused": {
        backgroundColor: "#fff",
        "& fieldset": {
          borderColor: "var(--color-main)",
          borderWidth: "2px",
        },
      },
      "&.Mui-error": {
        backgroundColor: "#fff",
        "& fieldset": { borderColor: "#ef4444", borderWidth: "2px" },
      },
    },
  };

  const handleSubmitVerify = async (e) => {
    e.preventDefault();
    if (verifyCode.length !== 6) {
      setVerifyError("Must be 6 digits!");
      return;
    }
    const response = await verifyTheCode(verifyCode);
    if (!response.success) setVerifyError(response.message);
  };

  // --- UPDATED TIMER LOGIC ---
  useEffect(() => {
    if (!verificationRequired || !expiresAt) return;

    const calculateTimeLeft = () => {
      const expiry = new Date(expiresAt).getTime();
      const now = new Date().getTime();
      const diff = Math.floor((expiry - now) / 1000);
      return diff > 0 ? diff : 0;
    };

    const initialTime = calculateTimeLeft();
    setTimeLeft(initialTime);

    if (initialTime <= 0) return;

    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [verificationRequired, expiresAt, resend]);

  // Helper to format seconds into MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="mb-10">
        <img src={fekra} alt="Logo" className="w-32 h-auto" />
      </div>

      <div className="w-full max-w-[550px]">
        <form
          onSubmit={verificationRequired ? handleSubmitVerify : handleSubmit}
          className="w-full p-10 bg-white rounded-[32px] shadow-2xl shadow-gray-200/60 border border-gray-100"
        >
          <div className="mb-10 flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                {verificationRequired ? "Verify Code" : "Welcome Back"}
              </h2>
              <p className="text-gray-500 mt-1 text-sm">
                {verificationRequired
                  ? "Check your email for the code"
                  : "Please login to your account"}
              </p>
            </div>
            {verificationRequired && (
              <IconButton
                onClick={resetVerification}
                className="hover:bg-red-50"
              >
                <Cancel className=" text-main" />
              </IconButton>
            )}
          </div>

          <div className="grid grid-cols-1 gap-y-8">
            {!verificationRequired ? (
              <>
                <TextField
                  fullWidth
                  name="userEmail"
                  label="Email Address"
                  value={formData.userEmail}
                  onChange={handleInputChange}
                  error={!!fieldErrors.userEmail}
                  helperText={fieldErrors.userEmail}
                  sx={muiFieldStyle}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MailOutline className="text-gray-400" />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  type="password"
                  name="password"
                  label="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  error={!!fieldErrors.password}
                  helperText={fieldErrors.password}
                  sx={muiFieldStyle}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined className="text-gray-400" />
                      </InputAdornment>
                    ),
                  }}
                />
              </>
            ) : (
              <div className="space-y-6">
                <TextField
                  fullWidth
                  label="6-Digit Code"
                  value={verifyCode}
                  onChange={(e) => {
                    setVerifyCode(e.target.value);
                    if (verifyError) setVerifyError("");
                  }}
                  error={!!verifyError}
                  helperText={verifyError}
                  sx={muiFieldStyle}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <VpnKeyOutlined className="text-gray-400" />
                      </InputAdornment>
                    ),
                  }}
                />

                <div className="flex justify-center text-sm font-medium">
                  {timeLeft > 0 ? (
                    <span className="text-gray-400">
                      Resend in{" "}
                      <span className="text-main font-bold">
                        {formatTime(timeLeft)}
                      </span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setResend(!resend);
                        resendCode();
                      }}
                      className="text-main font-bold hover:underline cursor-pointer"
                    >
                      Resend Code
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {error && !verificationRequired && (
            <div className="mt-6 p-3 rounded-xl bg-red-50 text-red-600 text-xs font-bold text-center border border-red-100">
              {error}
            </div>
          )}

          <div className="mt-14 pt-8 border-t border-gray-50 flex items-center justify-between">
            <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">
              {loading ? "Processing..." : "Secure Login"}
            </span>
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer group relative px-10 py-4 font-bold text-white bg-main rounded-2xl hover:brightness-110 active:scale-95 shadow-lg disabled:opacity-50"
            >
              <span className="flex items-center gap-2">
                {verificationRequired ? "Verify" : "Login"}
                <ArrowForward className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
