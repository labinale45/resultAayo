"use client";
import React, { useState, useEffect } from "react";

import { IoPersonAddSharp } from "react-icons/io5";
import { MdOutlineAddReaction } from "react-icons/md";
import Image from "next/image";

function Addstudent({ onClose, student, onSave }) {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [dob, setDob] = useState("");
  const [role] = useState("students");
  const [gender, setGender] = useState("Male");
  const [joinedYear, setJoinedYear] = useState("2080");
  const [studentClass, setStudentClass] = useState("8");
  const [rollNo, setRollNo] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [parent_name, setParentName] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [image, setImage] = useState("");
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageBase64 = '';
      if (image) {
          // Convert file to base64
          const reader = new FileReader();
          imageBase64 = await new Promise((resolve, reject) => {
              reader.onload = () => resolve(reader.result);
              reader.onerror = reject;
              reader.readAsDataURL(image);
          });
      }
        const responseRegister = await fetch("http://localhost:4000/api/auth/register", {
            method: "POST",
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
                parent_name,
                role,
               studentClass,
               class_id: selectedClassId,
               image: imageBase64,
            })
        });

        if (!responseRegister.ok) {
            // Handle non-200 responses
            const errorData = await responseRegister.json();
            throw new Error(errorData.message || 'Failed adding Teacher');
        }
        if(responseRegister.ok){
          const data = await responseRegister.json();
          alert(data.message);
          setErrorMessage(null);
          setFirstName("");
          setLastName("");
          setEmail("");
          setContact("");
          setAddress("");
          setDob("");
          setParentName("");
          setImage("");
           // Clear the success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage("");
      }, 3000);
        }
        // Handle successful login, maybe set some state or redirect

    } catch (error) {
        console.log('Error:', error.message);
        setErrorMessage(error.message);
    }
};
const fetchClasses = async () => {
  try {
    const response = await fetch("http://localhost:4000/api/auth/classes");
    if (!response.ok) throw new Error("Failed to fetch classes");
    const data = await response.json();
    setClasses(data);
  } catch (error) {
    console.error("Error fetching classes:", error);
  }
};
useEffect(() => {
  fetchClasses();
}, []);

  return (
    <div>
      <div className="bg-white dark:bg-[#253553] dark:text-white flex rounded-3xl shadow-2xl max-w-4xl p-3 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-3xl font-bold z-50 bg-white rounded-full w-8 h-8 flex items-center justify-center"
        >
          &times;
        </button>

        <div className="w-2/3 px-6  ">
          <div className="flex items-center mt-4">
            <IoPersonAddSharp className="h-7 w-12 mr-2  " />

            <h1 className="text-[#253553]   dark:text-white underline text-2xl font-bold">
            __A d d _S t u d e n t
            </h1>
          </div>

          {successMessage && (
            <div className="text-green-600 text-center mb-4">
              {successMessage}
            </div>
          )}
<form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
            
            <div className="row-span-2">
              <label className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                className="txt p-2 mt-1 w-full rounded-xl border shadow-xl"
                type="text"
                value={first_name}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
               <label className="block mt-4 text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                className="txt p-2 mt-1 w-full rounded-xl border shadow-xl"
                type="text"
                value={last_name}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div className="flex w-64">
              <label className="block text-sm font-medium text-gray-700">
                Class
              </label>
             
              <select
          value={selectedClassId}
          onChange={(e) => setSelectedClassId(e.target.value)}
          className="txt p-2 mt-6  w-full rounded-xl border shadow-xl"
        >
          <option value="">Select Class</option>
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.grade}
            </option>
          ))}
        </select>

              <label className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                className="txt p-2 mt-6 w-full rounded-xl border shadow-xl"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                className="txt p-2 mt-1 w-full rounded-xl border shadow-xl"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Parent's Name
              </label>
              <input
                className="txt p-2 mt-1 w-full rounded-xl border shadow-xl"
                type="text"
                value={parent_name}
                onChange={(e) => setParentName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Contact
              </label>
              <input
                className="txt p-2 mt-1 w-full rounded-xl border shadow-xl"
                type="tel"
                pattern="(\+977?)?[9][6-9]\d{8}"      
                value={phone_number}
                onChange={(e) => setContact(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                className="txt p-2 mt-1 w-full rounded-xl border shadow-xl"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <input
                className="txt p-2 mt-1 w-full rounded-xl border shadow-xl"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
              />
            </div>
            <div className="ps-20 absolute top-40 right-14 z-10 p-4">
  <label htmlFor="photo-upload" className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-full cursor-pointer hover:border-blue-500 transition-all duration-200">
    {image ? (
      <Image
        src={URL.createObjectURL(image)} 
        alt="Preview" 
        className="w-full h-full object-cover rounded-full"
        width={20}
        height={20}
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

            <div className="col-span-2 flex justify-start">
              <button
                type="submit"
                className="text-white shadow-xl font-bold bg-[#8AA4D6] w-80 p-3 mt-6 rounded-xl hover:bg-[#253553] duration-300"
              >
                {student ? "U P D A T E" : "A D D"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Addstudent;
