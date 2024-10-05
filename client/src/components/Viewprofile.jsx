"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendar,
  FaTimes,
} from "react-icons/fa";

export default function Viewprofile({ onClose }) {
  const [profile, setProfile] = useState({
    name: "User",
    email: "user@gmail.com",
    phone: "9824104129",
    joinDate: "2023-01-01",
    avatar: "/assets/Rabin.jpg",
  });

  useEffect(() => {
    // Fetch admin profile data from API
    // setProfile(fetchedData);
  }, []);

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="dark:bg-[#253553] bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto mt-10 relative">
      <button
        onClick={handleClose}
        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
      >
        <FaTimes size={24} />
      </button>
      <h1 className="text-2xl font-bold mb-6 text-center">Profile</h1>
      <div className="flex flex-col md:flex-row items-center md:items-start">
        <div className="mb-6 md:mr-8">
          <Image
            src={profile.avatar}
            width={150}
            height={150}
            alt="Admin Avatar"
            className="rounded-full"
          />
        </div>
        <div className="flex-grow">
          <ProfileItem icon={<FaUser />} label="Name" value={profile.name} />
          <ProfileItem
            icon={<FaEnvelope />}
            label="Email"
            value={profile.email}
          />
          <ProfileItem icon={<FaPhone />} label="Phone" value={profile.phone} />
          <ProfileItem
            icon={<FaCalendar />}
            label="Join Date"
            value={profile.joinDate}
          />
        </div>
      </div>
    </div>
  );
}

function ProfileItem({ icon, label, value }) {
  return (
    <div className="flex items-center mb-4">
      <span className="text-gray-500 mr-2">{icon}</span>
      <span className="font-semibold mr-2">{label}:</span>
      <span>{value}</span>
    </div>
  );
}
