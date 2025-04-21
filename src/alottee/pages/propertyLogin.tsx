import React, { useState } from 'react';
import { ArrowLeft, Phone, Loader2, Timer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ComingSoonModal from '../components/ComingSoonModal';
import { loginUser, verifyOTP } from '../services/api';

function PropertyLogin() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState('');

  // Start OTP timer
  const startTimer = () => {
    setTimer(120); // 2 minutes
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevents default form navigation
    setLoading(true);
    setError('');

    try {
      console.log("handle phone submit triggered");
      console.log("Entered phone is:", phone);

      // If desired, re-format the phone to 10 digits:
      // const formattedPhone = formatPhoneNumber(phone);
      const formattedPhone = phone;

      // Trigger your API call to request an OTP
      await loginUser(formattedPhone);
      console.log('OTP request sent successfully.');

      startTimer();
      setLoading(false);
      setStep('otp');
    } catch (err) {
      console.error(err);
      setError('Failed to send OTP. Please try again.');
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const enteredOTP = otp.join('');
      console.log('Verifying OTP:', enteredOTP);

      const { token } = await verifyOTP(phone, enteredOTP);

      // Store the token
      localStorage.setItem('bida_token', token);
      localStorage.setItem('bida_phone', phone);

      setLoading(false);
      navigate('/alottee');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'OTP Verification failed. Please try again.');
      setLoading(false);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-2 bg-white shadow-xl">
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold ml-2">Property & EMIs</h1>
        </div>
        <img
          src="https://www.bidabhadohi.com/assets/images/newlogo.jpg"
          alt="BIDA Logo"
          className="h-12 w-12 object-contain"
        />
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/20 to-blue-600/5"></div>
        <img
          src="https://www.bidabhadohi.com/assets/downloadmedia/HomePage/Header/bida0.jpg"
          alt="Modern Building"
          className="w-full h-48 object-cover"
        />
      </div>

      <div className="p-6 mt-6 relative">
        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* Welcome Message */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              Welcome Back
            </h2>
            <p className="text-gray-600">
              Login to manage your property and EMI payments
            </p>
          </div>

          {step === 'phone' ? (
            // =============== PHONE NUMBER FORM ===============
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div className="relative">
                <label 
                  htmlFor="phone" 
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-blue-500" />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setPhone(numericValue);
                    }}
                    className="block w-full pl-10 pr-3 py-3.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your 10-digit phone number"
                    required
                  />
                </div>
              </div>

              {/* Error message if any */}
              {error && (
                <div className="text-red-500 text-sm text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={phone.length !== 10 || loading}
                className={`w-full py-3.5 px-4 flex items-center justify-center rounded-lg text-white font-medium transition-all duration-200 shadow-md hover:shadow-lg
                  ${phone.length === 10 && !loading
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-gray-400 cursor-not-allowed'}`}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Get OTP'
                )}
              </button>
            </form>
          ) : (
            // =============== OTP VERIFICATION FORM ===============
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div>
                <label 
                  htmlFor="otp-0" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Enter OTP
                </label>
                <p className="text-sm text-gray-500 mb-4">
                  We've sent a verification code to +91 {phone}
                </p>
                <div className="flex gap-2 justify-between mb-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  ))}
                </div>
                <div className="flex justify-between items-center mt-2">
                  <button
                    type="button"
                    onClick={() => setStep('phone')}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Change phone number
                  </button>
                  {timer > 0 ? (
                    <div className="flex items-center text-sm text-gray-600">
                      <Timer className="w-4 h-4 mr-1" />
                      {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handlePhoneSubmit}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-sm text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={otp.some(digit => !digit) || loading}
                className={`w-full py-3.5 px-4 flex items-center justify-center rounded-lg text-white font-medium transition-all duration-200 shadow-md hover:shadow-lg
                  ${!otp.some(digit => !digit) && !loading
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-gray-400 cursor-not-allowed'}`}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Verify OTP'
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Coming Soon Modal */}
      <ComingSoonModal 
        isOpen={showComingSoon}
        onClose={() => setShowComingSoon(false)}
      />
    </div>
  );
}

export default PropertyLogin;