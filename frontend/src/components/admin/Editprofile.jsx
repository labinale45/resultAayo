"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  FaUser,
  FaEdit,
  FaSignOutAlt,
  FaExclamationTriangle,
  FaTimes,
  FaEnvelope,
  FaPhone,
  FaCalendar,
} from "react-icons/fa";

export default function EditProfile() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin123@gmail.com",
    phone: "9824104129",
    joinDate: "2023-01-01",
    avatar: "/assets/Rabin.jpg",
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    console.log("Profile updated:", profile);
    router.push("/admin");
  };

  const handleClose = () => {
    router.push("/admin");
  };

  return (
    <div className="container mx-auto mt-10 p-6 bg-white rounded-lg shadow-md relative">
      <button
        onClick={handleClose}
        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
      >
        <FaTimes size={24} />
      </button>
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

      <div className="flex items-center mb-4">
        <div className="relative">
          <Image
            src={profile.avatar}
            width={100}
            height={100}
            alt="Admin Avatar"
          />
        </div>
        <button
          onClick={() => fileInputRef.current.click()}
          className="ml-4 bg-[#253553] text-white rounded-full px-4 py-2"
        >
          Change Profile Picture
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
          accept="image/*"
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="name"
        >
          Name
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="name"
          type="text"
          name="name"
          value={profile.name}
          onChange={handleChange}
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="email"
        >
          Email
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="email"
          type="email"
          name="email"
          value={profile.email}
          onChange={handleChange}
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="phone"
        >
          Phone
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="phone"
          type="tel"
          name="phone"
          value={profile.phone}
          onChange={handleChange}
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="joinDate"
        >
          Join Date
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="joinDate"
          type="date"
          name="joinDate"
          value={profile.joinDate}
          onChange={handleChange}
        />
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={handleSave}
      >
        Save Changes
      </button>
    </div>
  );
}
