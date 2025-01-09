"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaTimes, FaCamera } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";

const Setting = ({ onClose, role }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [estdYear, setEstdYear] = useState("");
  const [schoolLocation, setSchoolLocation] = useState("");
  const [error, setError] = useState("");
  const [logo, setLogo] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSchoolSettings = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/api/auth/school-settings"
        );
        const data = await response.json();
        console.log("Fetched school settings:", data);

        // Update all states with fetched data
        setSchoolName(data.schoolName);
        setSchoolLocation(data.schoolLocation);
        setEstdYear(data.estd);
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

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
  };

  const handleSaveSettings = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/auth/settings/schoolDetails`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            schoolName: schoolName || "",
            schoolLocation: schoolLocation || "",
            estd: estdYear || "",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("School Detail updated successfully:", data);
      toast.success("School Detail updated successfully");
      setSchoolName(data.schoolName);
      setSchoolLocation(data.schoolLocation);
      setEstdYear(data.estd);
      return data;
    } catch (error) {
      toast.error("Failed to update School Detail");
      console.error("Error saving School Detail:", error);
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogo(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSaveLogo = async () => {
    if (!logo) return;

    const convertToBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    };

    try {
      const logoBase64 = await convertToBase64(logo);

      const response = await fetch(
        `http://localhost:4000/api/auth/settings/logo`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            logo: logoBase64,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Logo updated successfully:", data);
      toast.success("Logo updated successfully");

      return data;
    } catch (error) {
      toast.error("Failed to update logo");
      console.error("Error saving logo:", error);
    }
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="w-[500px] dark:bg-[#253553] dark:text-white bg-white rounded-lg shadow-md p-6 max-w-md mx-auto settings-container px-9 py-7 max-h-[80vh] overflow-y-auto">
        {" "}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Settings</h1>
          <button onClick={onClose} className="text-red-500 hover:text-red-700">
            <FaTimes size={20} />
          </button>
        </div>
        {role === "Admin" && (
          <div className="card">
            <div className="card mt-6 ">
              <h2 className="text-xl font-semibold mb-4">School Logo</h2>
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 mb-4">
                  {previewUrl ? (
                    <Image
                      src={previewUrl}
                      width={200}
                      height={200}
                      alt="School logo preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                      <FaCamera className="text-gray-400 text-3xl" />
                    </div>
                  )}
                  <label
                    htmlFor="logo-upload"
                    className="absolute bottom-2 right-2 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-700"
                  >
                    <FaCamera className="text-white text-sm" />
                  </label>
                  <input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                </div>
                <button
                  onClick={() => {
                    handleSaveLogo();
                  }}
                  className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-lg transition-all"
                >
                  Upload Logo
                </button>
              </div>
            </div>

            <h2 className="my-6 text-xl font-semibold">School Details</h2>
            <div className="flex items-start justify-startr my-5">
              <div className="relative">
                <input
                  id="schoolName"
                  name="schoolName"
                  type="text"
                  placeholder=""
                  className="border-b border-gray-300 py-1 focus:border-b-2 focus:border-blue-700 transition-colors focus:outline-none peer bg-inherit"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  required
                />
                <label
                  htmlFor="schoolName"
                  className="absolute text-gray-400 -top-4 text-xs left-0 cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all peer-focus:text-blue-700 peer-placeholder-shown:top-1 peer-placeholder-shown:text-sm"
                >
                  School Name
                </label>
              </div>
            </div>
            <div className="flex items-start justify-start my-5">
              <div className="relative">
                <input
                  id="schoolLocation"
                  name="schoolLocation"
                  type="text"
                  placeholder=""
                  className="border-b border-gray-300 py-1 focus:border-b-2 focus:border-blue-700 transition-colors focus:outline-none peer bg-inherit"
                  value={schoolLocation}
                  onChange={(e) => setSchoolLocation(e.target.value)}
                  required
                />
                <label
                  htmlFor="schoolLocation"
                  className="absolute text-gray-400  -top-4 text-xs left-0 cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all peer-focus:text-blue-700 peer-placeholder-shown:top-1 peer-placeholder-shown:text-sm"
                >
                  School Location
                </label>
              </div>
            </div>
            <div className="flex items-start justify-start mt-8 mb-4">
              <div className="relative">
                <input
                  id="estdYear"
                  name="estdYear"
                  type="date"
                  placeholder=""
                  className="border-b border-gray-300 py-1 focus:border-b-2 focus:border-blue-700 transition-colors focus:outline-none peer bg-inherit"
                  value={estdYear}
                  onChange={(e) => {
                    const selectedDate = new Date(e.target.value);
                    const today = new Date();

                    if (selectedDate <= today) {
                      setEstdYear(e.target.value);
                    } else {
                      toast.error("Please select a valid date before today.");
                    }
                  }}
                  max={new Date().toISOString().split("T")[0]}
                  required
                />

                <label
                  htmlFor="estdYear"
                  className="absolute text-gray-400  -top-4 text-xs left-0 cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all peer-focus:text-blue-700 peer-placeholder-shown:top-1 peer-placeholder-shown:text-sm"
                >
                  Established Year
                </label>
              </div>
            </div>
            <div className=" flex justify-start mb-6">
              <button
                className="cursor-pointer px-2 w-13 h-8 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-lg transition-all group active:w-11 active:h-11 active:rounded-full active:duration-300 ease-in-out"
                onClick={handleSaveSettings}
              >
                <svg
                  className="animate-spin hidden group-active:block mx-auto"
                  width="12"
                  height="12"
                  viewBox="0 0 33 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.1792 0.129353C10.6088 0.646711 8.22715 1.74444 6.16886 3.36616C4.13416 4.96799 2.42959 7.14686 1.38865 9.48493C0.202866 12.1414 -0.241805 15.156 0.125386 18.0413C0.684593 22.4156 3.02922 26.3721 6.63375 29.0186C8.01155 30.0301 9.65549 30.8757 11.2725 31.3997C12.0405 31.6518 13.4857 32 13.7518 32H13.8361V30.7232V29.4464L13.762 29.4331C11.8485 29.0252 10.2787 28.3818 8.7493 27.3802C7.50961 26.5644 6.29688 25.4402 5.40416 24.2794C3.88824 22.3095 2.98206 20.0908 2.66203 17.5736C2.57781 16.8905 2.57781 15.1029 2.66203 14.4396C2.88773 12.7317 3.31556 11.3288 4.06678 9.863C5.88589 6.3045 9.23103 3.67791 13.1286 2.746C13.4352 2.67303 13.7182 2.60671 13.762 2.59676L13.8361 2.58349V1.29009C13.8361 0.577066 13.8327 -0.00330353 13.8293 1.33514e-05C13.8226 1.33514e-05 13.5329 0.0597076 13.1792 0.129353Z"
                    fill="white"
                  ></path>
                  <path
                    d="M19.563 1.38627V2.67967L19.7078 2.71615C20.8768 3.01463 21.7527 3.32968 22.6723 3.78071C24.8249 4.84528 26.6878 6.467 28.042 8.47011C29.248 10.251 29.9858 12.2375 30.2654 14.4562C30.3126 14.831 30.326 15.1792 30.326 16.0149C30.326 17.169 30.2923 17.5869 30.1205 18.5022C29.7365 20.575 28.8404 22.5681 27.5266 24.2761C26.8158 25.2014 25.8019 26.2029 24.862 26.9027C23.3056 28.0634 21.7324 28.7997 19.7078 29.3137L19.563 29.3502V30.6436V31.9403L19.691 31.9204C20.0616 31.8541 21.1362 31.5689 21.6516 31.4031C24.8216 30.365 27.6041 28.3951 29.6152 25.7652C30.2789 24.8996 30.7337 24.1667 31.2356 23.1618C31.8959 21.8419 32.3102 20.6479 32.5999 19.2318C33.4354 15.1394 32.6606 10.9441 30.417 7.40886C28.4126 4.24833 25.3067 1.8373 21.692 0.640079C21.1867 0.470943 20.038 0.169149 19.7078 0.112772L19.563 0.0895557V1.38627Z"
                    fill="white"
                  ></path>
                </svg>
                <span className="group-active:hidden"> Save Details </span>
              </button>
            </div>
          </div>
        )}
        <div className="card mb-6">
          <form onSubmit={handleChangePassword}>
            <h2 className="text-xl font-semibold">Change Password</h2>
            <div className="flex items-start justify-start my-4">
              <div className="relative">
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  placeholder=""
                  className="border-b border-gray-300 py-1 focus:border-b-2 focus:border-blue-700 transition-colors focus:outline-none peer bg-inherit"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
                <label
                  htmlFor="currentPassword"
                  className="absolute text-gray-400 -top-4 text-xs left-0 cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all peer-focus:text-blue-700 peer-placeholder-shown:top-1 peer-placeholder-shown:text-sm"
                >
                  Current Password
                </label>
              </div>
            </div>
            <div className="flex items-start justify-start my-4">
              <div className="relative">
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  placeholder=""
                  className="border-b border-gray-300 py-1 focus:border-b-2 focus:border-blue-700 transition-colors focus:outline-none peer bg-inherit"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (e.target.value.length < 8) {
                      setError("Password must be at least 8 characters long");
                    } else {
                      setError("");
                    }
                  }}
                  minLength={8}
                  required
                />
                <label
                  htmlFor="newPassword"
                  className="absolute text-gray-400 -top-4 text-xs left-0 cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all peer-focus:text-blue-700 peer-placeholder-shown:top-1 peer-placeholder-shown:text-sm"
                >
                  New Password
                </label>
              </div>
            </div>
            <div className="flex items-start justify-start my-4">
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder=""
                  className="border-b border-gray-300 py-1 focus:border-b-2 focus:border-blue-700 transition-colors focus:outline-none peer bg-inherit"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (e.target.value !== newPassword) {
                      setError("Passwords do not match !");
                    } else {
                      setError("");
                    }
                  }}
                  required
                />
                <label
                  htmlFor="confirmPassword"
                  className="absolute text-gray-400 -top-4 text-xs left-0 cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all peer-focus:text-blue-700 peer-placeholder-shown:top-1 peer-placeholder-shown:text-sm"
                >
                  Confirm New Password
                </label>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            <div className=" flex justify-start my-4">
              <button
                className=" cursor-pointer px-2 w-15 h-8 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-lg transition-all group active:w-11 active:h-11 active:rounded-full active:duration-300 ease-in-out"
                type="submit"
              >
                <svg
                  className="animate-spin hidden group-active:block mx-auto"
                  width="12"
                  height="12"
                  viewBox="0 0 30 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.1792 0.129353C10.6088 0.646711 8.22715 1.74444 6.16886 3.36616C4.13416 4.96799 2.42959 7.14686 1.38865 9.48493C0.202866 12.1414 -0.241805 15.156 0.125386 18.0413C0.684593 22.4156 3.02922 26.3721 6.63375 29.0186C8.01155 30.0301 9.65549 30.8757 11.2725 31.3997C12.0405 31.6518 13.4857 32 13.7518 32H13.8361V30.7232V29.4464L13.762 29.4331C11.8485 29.0252 10.2787 28.3818 8.7493 27.3802C7.50961 26.5644 6.29688 25.4402 5.40416 24.2794C3.88824 22.3095 2.98206 20.0908 2.66203 17.5736C2.57781 16.8905 2.57781 15.1029 2.66203 14.4396C2.88773 12.7317 3.31556 11.3288 4.06678 9.863C5.88589 6.3045 9.23103 3.67791 13.1286 2.746C13.4352 2.67303 13.7182 2.60671 13.762 2.59676L13.8361 2.58349V1.29009C13.8361 0.577066 13.8327 -0.00330353 13.8293 1.33514e-05C13.8226 1.33514e-05 13.5329 0.0597076 13.1792 0.129353Z"
                    fill="white"
                  ></path>
                  <path
                    d="M19.563 1.38627V2.67967L19.7078 2.71615C20.8768 3.01463 21.7527 3.32968 22.6723 3.78071C24.8249 4.84528 26.6878 6.467 28.042 8.47011C29.248 10.251 29.9858 12.2375 30.2654 14.4562C30.3126 14.831 30.326 15.1792 30.326 16.0149C30.326 17.169 30.2923 17.5869 30.1205 18.5022C29.7365 20.575 28.8404 22.5681 27.5266 24.2761C26.8158 25.2014 25.8019 26.2029 24.862 26.9027C23.3056 28.0634 21.7324 28.7997 19.7078 29.3137L19.563 29.3502V30.6436V31.9403L19.691 31.9204C20.0616 31.8541 21.1362 31.5689 21.6516 31.4031C24.8216 30.365 27.6041 28.3951 29.6152 25.7652C30.2789 24.8996 30.7337 24.1667 31.2356 23.1618C31.8959 21.8419 32.3102 20.6479 32.5999 19.2318C33.4354 15.1394 32.6606 10.9441 30.417 7.40886C28.4126 4.24833 25.3067 1.8373 21.692 0.640079C21.1867 0.470943 20.038 0.169149 19.7078 0.112772L19.563 0.0895557V1.38627Z"
                    fill="white"
                  ></path>
                </svg>
                <span className="group-active:hidden">change Password</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Setting;
