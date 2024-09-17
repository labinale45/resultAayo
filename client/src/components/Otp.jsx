import React from "react";

function Otp() {
  // Array to generate four OTP input fields
  const otp = new Array(4).fill("");

  return (
    <div className="flex justify-center items-center h-screen bg-blue-300">
      <div className="w-96 p-9 shadow-lg shadow-blue-700 bg-white rounded-md">
        <img src="/assets/Logo.png" alt="Logo" className="mb-4" />
        <h1 className="text-2xl block text-center font-semibold">
          Enter verification code
        </h1>
        <p className="text-center mt-2">
          We've sent you a code on your@gmail.com
        </p>

        <div className="flex justify-center items-center mt-4 space-x-2">
          {otp.map((_, i) => (
            <input
              key={i}
              type="text"
              maxLength="1"
              className="border border-gray-300 rounded-md text-center w-12 h-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>

        <div className="flex justify-center items-center mt-4">
          Didn't get a code?{" "}
          <a
            href="#"
            className="text-indigo-800 font-semibold ml-1 no-underline hover:underline ..."
          >
            Click to resend
          </a>
        </div>
        <hr className="mt-3" />
        <div className="mt-5 gap-5 flex justify-center items-center">
          <button
            type="button"
            className="border-2 text-black py-1 w-1/2 rounded-md hover:bg-transparent hover:text-indigo-700 font-semibold"
          >
            Cancel
          </button>
          <button
            type="button"
            className="border-2 bg-blue-300 text-white py-1 w-1/2 rounded-md hover:bg-transparent hover:text-indigo-700 font-semibold"
          >
            Verify
          </button>
        </div>
      </div>
    </div>
  );
}

export default Otp;
