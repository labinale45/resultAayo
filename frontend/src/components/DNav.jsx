"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Darklightmode from "./Mini Component/Darklightmode";
import Search from "./Mini Component/Search";
import {
  FaUser,
  FaEdit,
  FaSignOutAlt,
  FaExclamationTriangle,
} from "react-icons/fa";

export default function Dnav({ currentPath }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const router = useRouter();
  const menuRef = useRef(null);

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

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirmation(true);
    setShowProfileMenu(false);
  };

  const handleLogoutConfirm = () => {
    localStorage.removeItem("authToken");
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
    <div className="fixed bg-[#253553] w-full h-20 shadow-xl z-[100]">
      <div className="flex justify-between items-center w-full h-full px-2 2xl:px-16">
        <Image src="/assets/Logo.png" width={135} height={55} alt="Logo" />
        <Search />
        <div className="flex items-center space-x-4">
          <Darklightmode />
          <div className="relative" ref={menuRef}>
            <button
              onClick={toggleProfileMenu}
              className="flex items-center space-x-2"
            >
              <Image
                src="/assets/Rabin.jpg"
                width={40}
                height={50}
                alt="Admin"
                className="rounded-full"
              />
              <span className="text-white">Admin</span>
            </button>
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                <button
                  onClick={() => handleMenuItemClick("/admin/Adminprofile")}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FaUser className="mr-2" /> View Profile
                </button>
                <button
                  onClick={() => handleMenuItemClick("/admin/Editprofile")}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FaEdit className="mr-2" /> Edit Profile
                </button>
                <button
                  onClick={handleLogoutClick}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FaSignOutAlt className="mr-2" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {showLogoutConfirmation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-5 rounded-lg shadow-xl">
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
                className="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
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
    </div>
  );
}
