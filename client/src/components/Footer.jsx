import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaHome,
  FaBell,
  FaInfoCircle,
  FaCubes,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaLock,
  FaFileAlt,
} from "react-icons/fa";

function Footer() {
  return (
    <div className="m-0 grid sm:grid-cols-12 grid-cols-1 p-4 h-auto bg-[#437FC7] dark:bg-[#253553] text-white">
      <div className="sm:col-span-4 ms-20">
        <Image
          src="/assets/Logo.png"
          alt="Logo"
          className=" mb-4 mt-0 flex items-start"
          width={100}
          height={100}
        />
        <div>
          The Result Management System (RMS) is an academic software tailored
          for educational institutions to efficiently handle academic results.
        </div>
      </div>

      <div className="sm:col-span-4 p-4 ms-20 flex items-start">
        <ul>
          <div className="text-lg font-semibold mb-2">Quick Links</div>
          <li className="mb-1">
            <Link
              href="/Home"
              className="flex items-center hover:text-gray-300"
            >
              <FaHome className="mr-2" /> Home
            </Link>
          </li>
          <li className="mb-1">
            <Link
              href="/Notice"
              className="flex items-center hover:text-gray-300"
            >
              <FaBell className="mr-2" /> Notice
            </Link>
          </li>
          <li className="mb-1">
            <Link
              href="/About"
              className="flex items-center hover:text-gray-300"
            >
              <FaInfoCircle className="mr-2" /> About
            </Link>
          </li>
          <li className="mb-1">
            <Link
              href="/Module"
              className="flex items-center hover:text-gray-300"
            >
              <FaCubes className="mr-2" /> Modules
            </Link>
          </li>
        </ul>
      </div>

      <div className="sm:col-span-4 p-4 ms-20 me-20 flex items-start">
        <ul>
          <div className="text-lg font-semibold mb-2">Contact Us</div>
          <li className="mb-1 flex items-center">
            <FaPhone className="mr-2" /> 9826175904
          </li>
          <li className="mb-1 flex items-center">
            <FaEnvelope className="mr-2" /> resultaayo2024@gmail.com
          </li>
          <li className="mb-1 flex items-center">
            <FaMapMarkerAlt className="mr-2" /> Tanahun, Nepal
          </li>
          <li className="mb-1">
            <Link
              href="#"
              className="flex items-center hover:text-gray-300"
            >
              <FaLock className="mr-2" /> Privacy and Policy
            </Link>
          </li>
          <li className="mb-1">
            <Link
              href="#"
              className="flex items-center hover:text-gray-300"
            >
              <FaFileAlt className="mr-2" /> Terms and Conditions
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Footer;
