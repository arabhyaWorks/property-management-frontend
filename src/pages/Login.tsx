import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Phone,
  Lock,
  ChevronLeft,
  User,
  Mail,
  Eye,
  EyeOff,
} from "lucide-react";
import newBaseEndpoint from "../services/enpoints";

export function Login() {
  const [userType, setUserType] = useState("allottee"); // 'allottee' or 'admin'
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOtp = async () => {
    if (!mobileNumber || mobileNumber.length !== 10) {
      setErrorMessage("Please enter a valid 10-digit mobile number");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(
        `${newBaseEndpoint}/api/users/login/otp/send`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mobile_number: mobileNumber }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setOtpSent(true);
        setCountdown(60); // Set countdown for 60 seconds
      } else {
        setErrorMessage(
          "Your mobile no. is not registered with BIDA, please contact BIDA office"
        );
      }
    } catch (error) {
      setErrorMessage(
        "Network error. Please check your connection and try again."
      );
      console.error("Send OTP failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setErrorMessage("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(
        `${newBaseEndpoint}/api/users/login/otp/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mobile_number: mobileNumber,
            otp: otp,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.token) {
        // Store allottee credentials
        localStorage.setItem("bida_phone", mobileNumber);
        localStorage.setItem("bida_token", data.token);
        navigate("/alottee");
      } else {
        setErrorMessage(data.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      setErrorMessage(
        "Network error. Please check your connection and try again."
      );
      console.error("Verify OTP failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(
        `${newBaseEndpoint}/api/users/login/password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.token) {
        // Store admin credentials
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", email);
        localStorage.setItem("role", data.role);
        localStorage.setItem("name", data.name);
        localStorage.setItem("userId", data.user_id);
        navigate("/dashboard");
      } else {
        setErrorMessage(
          data.message ||
            "Invalid credentials. Please check your email and password."
        );
      }
    } catch (error) {
      setErrorMessage(
        "Network error. Please check your connection and try again."
      );
      console.error("Admin login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setOtpSent(false);
    setOtp("");
    setErrorMessage("");
  };

  const renderAllotteeForm = () => {
    if (!otpSent) {
      return (
        <div className="space-y-6">
          <div>
            <label
              htmlFor="mobile_number"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Mobile Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="mobile_number"
                name="mobile_number"
                type="tel"
                pattern="[0-9]{10}"
                required
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your 10-digit mobile number"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleSendOtp}
            disabled={isLoading || mobileNumber.length !== 10}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-800 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Sending OTP..." : "Send OTP"}
          </button>
        </div>
      );
    } else {
      return (
        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <div className="flex items-center mb-4">
            <button
              type="button"
              onClick={resetForm}
              className="flex items-center text-blue-800 hover:text-blue-600"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              <span>Back</span>
            </button>
          </div>

          <p className="text-sm text-gray-600">
            We've sent a verification code to {mobileNumber}
          </p>

          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Enter OTP
            </label>
            <input
              id="otp"
              name="otp"
              type="text"
              maxLength="6"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-center text-xl tracking-widest"
              placeholder="• • • • • •"
            />
          </div>

          {countdown > 0 ? (
            <p className="text-sm text-gray-600 text-center">
              Resend OTP in {countdown} seconds
            </p>
          ) : (
            <button
              type="button"
              onClick={() => {
                handleSendOtp();
              }}
              className="w-full text-sm text-blue-800 hover:text-blue-600"
            >
              Didn't receive OTP? Resend
            </button>
          )}

          <button
            type="submit"
            disabled={isLoading || otp.length !== 6}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-800 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Verifying..." : "Verify & Login"}
          </button>
        </form>
      );
    }
  };

  const renderAdminForm = () => {
    return (
      <form onSubmit={handleAdminLogin} className="space-y-6">
        <div>
          <label
            htmlFor="admin_email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="admin_email"
              name="admin_email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your email"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-700"
            >
              Remember me
            </label>
          </div>
          <div className="text-sm">
            <a
              href="#"
              className="font-medium text-blue-800 hover:text-blue-700"
            >
              Forgot password?
            </a>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-800 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    );
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-16 bg-white">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-8">
            <Building2 className="h-16 w-16 text-blue-800 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 text-center">
              BIDA Property Management System
            </h2>
            <p className="text-gray-600 mt-2 text-center">
              Welcome back! Please login to your account.
            </p>
          </div>

          {/* User Type Tabs */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button
              className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center ${
                userType === "allottee"
                  ? "bg-white shadow-sm text-blue-800"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              onClick={() => {
                setUserType("allottee");
                resetForm();
                setErrorMessage("");
              }}
            >
              <User className="h-4 w-4 mr-2" />
              Allottee
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center ${
                userType === "admin"
                  ? "bg-white shadow-sm text-blue-800"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              onClick={() => {
                setUserType("admin");
                resetForm();
                setErrorMessage("");
              }}
            >
              <Lock className="h-4 w-4 mr-2" />
              Admin
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
              {errorMessage}
            </div>
          )}

          {userType === "allottee" ? renderAllotteeForm() : renderAdminForm()}
        </div>
      </div>

      <div className="hidden lg:block lg:w-1/2 bg-blue-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl opacity-20"></div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12">
          <div className="max-w-md text-center">
            <blockquote className="text-2xl font-light mb-4">
              "The beauty of e-governance is that a few keystrokes can bring
              smiles on a million faces."
            </blockquote>
            <cite className="text-lg">- Narendra Modi</cite>
          </div>
        </div>
      </div>
    </div>
  );
}
