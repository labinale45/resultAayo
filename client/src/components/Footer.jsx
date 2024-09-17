import React from "react";

function Footer() {
  return (
    <div className="m-0 grid sm:grid-cols-12 grid-cols-1 p-4 h-auto bg-blue-300 text-black dark:bg-gray-600 dark:text-white">
      <div className="sm:col-span-4  ms-20">
        <img
          src="/assets/Logo.png"
          alt="Logo"
          className="mb-4 mt-0 flex items-start"
        />

        <div>
          The Result Management System (RMS) is an academic software tailored
          for educational institutions to efficiently handle academic results.
        </div>
      </div>

      <div className="sm:col-span-4 p-4 ms-20 flex items-start ">
        <ul>
          <div className="text-lg font-semibold mb-2 ">Quick Links</div>
          <li className="mb-1">Home</li>
          <li className="mb-1">Notice</li>
          <li className="mb-1">About</li>
          <li className="mb-1">Services</li>
        </ul>
      </div>

      <div className="sm:col-span-4 p-4 ms-20 me-20 flex items-start ">
        <ul>
          <div className="text-lg font-semibold mb-2 ">Contact Us</div>
          <li className="mb-1">912222122</li>
          <li className="mb-1">rays@gmail.com</li>
          <li className="mb-1">Tanahun, Nepal</li>
          <li className="mb-1">Privacy and Policy</li>
          <li className="mb-1">Terms and Conditions</li>
        </ul>
      </div>
    </div>
  );
}

export default Footer;
