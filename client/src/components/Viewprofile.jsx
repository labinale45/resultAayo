"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendar,
  FaTimes,
  FaGraduationCap,
  FaSchool,
} from "react-icons/fa";

export default function Viewprofile({ onClose }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (!userData?.username) {
          throw new Error('No user data found');
        }

        const response = await fetch(`http://localhost:4000/api/auth/profile/${userData.username}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="dark:bg-[#253553] bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto mt-10 relative">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
      >
        <FaTimes size={24} />
      </button>
      <h1 className="text-2xl font-bold mb-6 text-center">Profile</h1>
      <div className="flex flex-col md:flex-row items-center md:items-start">
      <div className="mb-6 md:mr-8">
          <Image
            src={profile.role === 'Admin' ? "/assets/Admin.png" : (profile.img_url || "/assets/profile.png")}
            width={200}
            height={200}
            alt={profile.role==='Admin'?"Admin":profile.first_name + " " + profile.last_name}
            className="rounded-full"
          />
        </div>
        <div className="flex-grow">
          <ProfileItem icon={<FaUser />} label="Name" value={profile.role==='Admin'?" Admin ":`${profile.first_name} ${profile.last_name}`} />
          <ProfileItem icon={<FaEnvelope />} label="Email" value={profile.email} />
          <ProfileItem icon={<FaPhone />} label="Phone" value={profile.phone_number} />
          <ProfileItem icon={<FaCalendar />} label="Join Date" value={new Date(profile.created_at).toLocaleDateString()} />
          {profile.role === 'Student' && (
            <>
              <ProfileItem icon={<FaUser />} label="Parent's Name" value={profile.parent_name} />
              <ProfileItem icon={<FaGraduationCap />} label="Class" value={profile.studentClass} />
            </>
          )}
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
