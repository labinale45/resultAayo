"use client";

import React, { useState, useEffect } from "react";
import supabase from "@/utils/client";
import { IoPersonAddSharp } from "react-icons/io5";
import { MdOutlineAddReaction } from "react-icons/md";
import Image from "next/image";

function Addteacher({ onClose, teacher, onSave }) {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");

  const [email, setEmail] = useState("");
  const [phone_number, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [dob, setDob] = useState("");
  const [role, setRole] = useState("teachers");
  const [gender, setGender] = useState("Male");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    if (teacher) {
      setFirstName(teacher.first_name || '');
      setLastName(teacher.last_name || '');
      setEmail(teacher.email || '');
      setContact(teacher.phone_number || '');
      setAddress(teacher.address || '');
      setDob(teacher.dob || '');
      setGender(teacher.gender || 'Male');
      setUsername(teacher.username || '');
      setPassword(teacher.password || '');
    }
  }, [teacher]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageBase64 = '';
      if (image) {
        const reader = new FileReader();
        imageBase64 = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(image);
        });
      }

      const endpoint = teacher 
        ? `http://localhost:4000/api/auth/teacher/${teacher.id}`
        : "http://localhost:4000/api/auth/register";

      const method = teacher ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name,
          last_name,
          email,
          phone_number,
          address,
          dob,
          gender,
          role: 'teachers',
          username,
          password,
          image: imageBase64 || teacher?.img_url,
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed ${teacher ? 'updating' : 'adding'} teacher`);
      }

      const data = await response.json();
      setSuccessMessage(data.message);
      alert(data.message);
      
      if (onSave) {
        onSave();
      }

      if (!teacher) {
        // Clear form only for new teacher
        setFirstName("");
        setLastName("");
        setEmail("");
        setContact("");
        setAddress("");
        setDob("");
        setImage("");
      }

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

    } catch (error) {
      console.error('Error:', error.message);
      setErrorMessage(error.message);
    }
  };

  return (
    <div>
      <div className="bg-white dark:bg-[#253553] dark:text-white flex rounded-3xl shadow-2xl max-w-4xl p-3 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-3xl font-bold z-50 bg-white rounded-full w-8 h-8 flex items-center justify-center"
        >
          &times;
        </button>

        <div className="w-2/3 px-6 ">
          <div className="flex items-center mt-4">
            <IoPersonAddSharp className="h-7 w-12 mr-2  " />
            <h1 className=" underline text-2xl font-bold">
              __A d d _T e a c h e r
            </h1>
          </div>

          {successMessage && (
            <div className="text-green-600 text-center mb-4">
              {successMessage}
            </div>
          )}

          <form className="grid grid-cols-2 gap-4 mt-3" onSubmit={handleSubmit}>
            <div>
              <label className=" text-sm font-medium ">First Name</label>
              <input
                className="txt p-2 mt-1 w-full rounded-xl border shadow-xl text-black"
                type="text"
                value={first_name}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
               <label className=" text-sm font-medium ">Last Name</label>
              <input
                className="txt p-2 mt-1 w-full rounded-xl border shadow-xl text-black"
                type="text"
                value={last_name}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className=" text-sm font-medium ">Gender</label>
              <select
                className="txt p-2 mt-1 w-full rounded-xl border shadow-xl text-black"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Others">Others</option>
              </select>

              <div>
              <label className="text-sm font-medium ">Date of Birth</label>
              <input
                className="txt p-2 mt-1 w-full rounded-xl border shadow-xl text-black"
                type="date"
                value={dob}
                onChange={(e) => {
                  const selectedDate = new Date(e.target.value);
                  const today = new Date();
                  const age = today.getFullYear() - selectedDate.getFullYear();
                  const isValidAge =
                    age > 18 ||
                    (age === 18 &&
                      (today.getMonth() > selectedDate.getMonth() ||
                        (today.getMonth() === selectedDate.getMonth() &&
                          today.getDate() >= selectedDate.getDate())));

                  if (isValidAge) {
                    setDob(e.target.value);
                  } else {
                    alert("You must be at least 18 year old.");
                    setDob(""); // Optionally clear the input if the age is invalid
                  }
                }}
                required
              />
            </div>

            </div>
            <div>
              <label className=" text-sm font-medium ">Email</label>
              <input
                className="txt p-2 mt-1 w-full rounded-xl border shadow-xl text-black"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className=" text-sm font-medium ">Contact</label>
              <input
                className="txt p-2 mt-1 w-full rounded-xl border shadow-xl text-black"
                type="tel"
                pattern="(\+977?)?[9][6-9]\d{8}"
                maxLength="10"
                value={phone_number}
                onChange={(e) => setContact(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium ">Address</label>
              <input
                className="txt p-2 mt-1 w-full rounded-xl border shadow-xl text-black"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            <div className="ps-20 absolute top-5 right-16 z-10 p-4">
  <label htmlFor="photo-upload" className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-full cursor-pointer hover:border-blue-500 transition-all duration-200">
    {image ? (
      <Image
      
        src={URL.createObjectURL(image)} 
        alt="Preview"
        width={20}
        height={20} 
        className="w-full h-full object-cover rounded-full"
      />
    ) : (
      <>
        <MdOutlineAddReaction className="w-12 h-12 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
        <span className="mt-2 text-sm text-gray-500 group-hover:text-blue-500">Upload Photo</span>
      </>
    )}
  </label>
  <input
    id="photo-upload"
    type="file"
    accept="image/*"
    onChange={(e) => setImage(e.target.files[0])}
    className="hidden"
  />
</div>

            <div className="col-span-2 flex justify-center">
              <button
                type="submit"
                className="w-72 p-3 mt-6 rounded-xl bg-[#7ba0e4] dark:bg-[#8AA4D6] hover:bg-[#4c94ec] dark:hover:bg-[#253553] hover:text-white  text-center  shadow-xl font-bold "
              >
                A D D
              </button>
            </div>
          </form>
        </div>

        <div className="w-1/3 relative">
          
          <Image
            className="rounded-3xl h-full w-full object-cover"
            src="/assets/popup.png"
            alt=""
            width={1000}
            height={1000}
          />
        </div>
      </div>
    </div>
  );
}
export default Addteacher;
