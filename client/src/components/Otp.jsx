import React, { useState } from "react";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";


function Otp({ onVerify, onClose }) {
  const [otpValues, setOtpValues] = useState(new Array(4).fill(""));
  const [error, setError] = useState("");

  const handleChange = (index, value) => {
    const newOtp = [...otpValues];
    newOtp[index] = value;
    setOtpValues(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.querySelector(`input[name='otp-${index + 1}']`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleVerify = () => {
    const otp = otpValues.join("");
    if (otp.length !== 4) {
      toast.error("Please enter complete OTP");
      return;
    }
    onVerify(otp);
  };

  const handleResend = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      await fetch('http://localhost:4000/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: userData.email
        })
      });
      toast.success("OTP resent successfully");
    } catch (error) {
      toast.error("Failed to resend OTP");
    }
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="w-96 p-9 shadow-lg bg-white rounded-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Enter verification code</h1>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <p className="text-center mt-2">
          We&apos;ve sent you a code on your email
        </p>

        <div className="flex justify-center items-center mt-4 space-x-2">
          {otpValues.map((digit, index) => (
            <input
              key={index}
              name={`otp-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              className="border border-gray-300 rounded-md text-center w-12 h-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>

        {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}

        <div className="flex justify-center items-center mt-4">
          Didn&apos;t get a code?{" "}
          <button
            onClick={handleResend}
            className="text-blue-600 font-semibold ml-1 hover:underline"
          >
            Click to resend
          </button>
        </div>

        <div className="mt-5 gap-5 flex justify-center items-center">
          <button
            onClick={onClose}
            className="border-2 text-black py-1 w-1/2 rounded-md hover:bg-gray-100 font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleVerify}
            className="border-2 bg-blue-600 text-white py-1 w-1/2 rounded-md hover:bg-blue-700 font-semibold"
          >
            Verify
          </button>
        </div>
      </div>
    </div>
    </>
  );
}

export default Otp;
