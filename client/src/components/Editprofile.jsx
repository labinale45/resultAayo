"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { FaTimes, FaCamera } from "react-icons/fa";

export default function EditProfile({ onClose }) {
  const fileInputRef = useRef(null);
  const [profile, setProfile] = useState({
    name: "User",
    email: "user@gmail.com",
    phone: "9824104129",
    joinDate: "2023-01-01",
    avatar: "/assets/Rabin.jpg",
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const response = await fetch('http://localhost:4000/api/auth/profile/avatar', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({ avatar: reader.result })
          });

          if (!response.ok) {
            throw new Error('Failed to upload avatar');
          }

          const data = await response.json();
          setProfile(prev => ({ ...prev, avatar: data.avatar_url }));
        } catch (error) {
          console.error('Error uploading avatar:', error);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    console.log("Profile updated:", profile);
    onClose();
  };

  return (
    <div className="w-96  dark:bg-[#253553]  dark:text-white bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Edit Profile</h1>
        <button onClick={onClose} className="text-red-500 hover:text-red-700">
          <FaTimes size={20} />
        </button>
      </div>

      <div className="flex flex-col items-center mb-4">
        <div className="relative mb-2">
          <Image
            src={profile.avatar || "/assets/profile.png"}
            width={150}
            height={150}
            alt="Profile Avatar"
            className="rounded-full"
          />
          <button
            onClick={() => fileInputRef.current.click()}
            className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2"
          >
            <FaCamera size={14} />
          </button>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
          accept="image/*"
        />
      </div>

      {["name", "email", "phone"].map((field) => (
        <div key={field} className="mb-3 ">
          <label
            className="block text-gray-700 dark:text-white text-sm font-semibold mb-1"
            htmlFor={field}
          >
            {field.charAt(0).toUpperCase() + field.slice(1)}
          </label>
          <input
            className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 dark:text-black focus:ring-blue-500"
            id={field}
            type={field === "email" ? "email" : "text"}
            name={field}
            value={profile[field]}
            onChange={handleChange}
          />
        </div>
      ))}

      <div className="mb-4 ">
        <label
          className="block text-gray-700 dark:text-white text-sm font-semibold mb-1"
          htmlFor="joinDate"
        >
          Join Date
        </label>
        <input
          className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 dark:text-black focus:ring-blue-500"
          id="joinDate"
          type="date"
          name="joinDate"
          value={profile.joinDate}
          onChange={handleChange}
        />
      </div>

      <button
        className="w-full shadow-lg text-white bg-[#7ba0e4] dark:bg-[#8AA4D6] hover:bg-[#4c94ec] dark:hover:bg-[#253553] hover:text-white  font-semibold py-2 px-4 rounded-md transition duration-300"
        onClick={handleSave}
      >
        Save Changes
      </button>
    </div>
  );
}
