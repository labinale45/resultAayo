"use client";

import { useState, useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Darklightmode from "./Mini Component/Darklightmode";
import toast, { Toaster } from "react-hot-toast";

//import Search from "./Mini Component/Search";
import Viewprofile from "./Viewprofile";
import Editprofile from "./Editprofile";
import Setting from "./admin/setting";
import {
  FaUser,
  FaEdit,
  FaSignOutAlt,
  FaExclamationTriangle,
  FaUserCog,
} from "react-icons/fa";

export default function Dnav({ currentPath }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [showViewProfile, setShowViewProfile] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showSetting, setShowSetting] = useState(false);
  const router = useRouter();
  const menuRef = useRef(null);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchSchoolSettings = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/api/auth/school-settings"
        );
        const data = await response.json();
        console.log("Fetched school settings:", data);

        const logoUrlWithTimestamp = `${
          data.logo_url
        }?t=${new Date().getTime()}`;
        setPreviewUrl(logoUrlWithTimestamp);
      } catch (error) {
        console.error("Error fetching school settings:", error);
        toast.error("Failed to load school settings");
      }
    };

    fetchSchoolSettings();
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("userData"));

        if (!userData?.username) {
          throw new Error("No user data found");
        }

        const response = await fetch(
          `http://localhost:4000/api/auth/profile/${userData.username}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        setUserData(data);
      } catch (err) {
        toast.error(err.message);
      }
    };
    fetchUserProfile();
  }, []);

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirmation(true);
    setShowProfileMenu(false);
  };

  const handleLogoutConfirm = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setShowLogoutConfirmation(false);
    router.push("/");
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirmation(false);
  };

  const handleMenuItemClick = (path) => {
    if (path !== currentPath) {
      router.push(path);
    }
    setShowProfileMenu(false);
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
    <div className="fixed bg-[#437FC7] dark:bg-[#253553] dark:text-white text-black w-full h-20 shadow-xl z-[100]">
      <div className="flex justify-between items-center w-full h-full px-2 2xl:px-16">
      <div className="bg-transparent w-52 h-20 overflow-hidden flex items-center justify-start"> 
         {previewUrl ? (
    <Image
      src={previewUrl}
      width={135}
      height={55}
      alt="School logo preview"
      className="py-4 px-4 bg-transparent w-full h-full object-contain"
      priority
    />
  ) : (
    <Image 
      src="/assets/Logo.png" 
      width={135} 
      height={55} 
      alt="Logo"
      className="max-w-full max-h-full object-contain"
      priority
    />
  )}
</div>

        {/* <Search /> */}
        <div className="flex items-center space-x-4">
          <Darklightmode />
          <div className="relative" ref={menuRef}>
            <button
              onClick={toggleProfileMenu}
              className="flex items-center space-x-2"
            >
              <Image
                src={
                  userData?.role === "Admin"
                    ? "/assets/Admin.png"
                    : userData?.img_url || "/assets/profile.png"
                }
                width={40}
                height={50}
                alt={userData?.first_name + " " + userData?.last_name}
                className="rounded-full bg-white"
              />
              <span className="">{userData?.username || "User"}</span>
            </button>
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                <button
                  onClick={() => {
                    setShowViewProfile(true);
                    setShowProfileMenu(false);
                  }}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FaUser className="mr-2" /> View Profile
                </button>
                {/* {userData?.role === "Admin" && (
                  <button
                    onClick={() => {
                      setShowEditProfile(true);
                      setShowProfileMenu(false);
                    }}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FaEdit className="mr-2" /> Edit Profile
                  </button>
                )} */}

                <button
                  onClick={() => {
                    setShowSetting(true);
                    setShowProfileMenu(false);
                  }}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FaUserCog className="mr-2" /> Setting
                </button>
                <hr className="shadow-slate-500"></hr>
                <button
                  onClick={handleLogoutClick}
                  className="flex justify-center items-center w-full text-left px-4 py-2 text-sm  hover:text-red-400 text-gray-700 hover:bg-gray-200"
                >
                  <FaSignOutAlt className="mr-2" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {showLogoutConfirmation && (
        <div className="fixed inset-0 bg-gray-600  bg-opacity-50  backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-5 rounded-lg dark:bg-[#253553]  dark:text-white shadow-xl">
            <div className="flex items-center mb-4">
              <FaExclamationTriangle
                className="text-yellow-500 mr-2"
                size={24}
              />
              <h3 className="text-lg font-semibold">Confirm Logout</h3>
            </div>
            <p className="mb-4">Are you sure you want to log out?</p>
            <div className="flex justify-end">
              <button
                onClick={handleLogoutCancel}
                className="mr-2 px-4 py-2 bg-gray-300 text-gray-800  rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
      {showViewProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[101]">
          <Viewprofile onClose={() => setShowViewProfile(false)} />
        </div>
      )}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[101]">
          <Editprofile onClose={() => setShowEditProfile(false)} />
        </div>
      )}
      {showSetting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[101]">
          <Setting
            onClose={() => setShowSetting(false)}
            role={userData?.role}
          />
        </div>
      )}
    </div>
    </>
  );
}
