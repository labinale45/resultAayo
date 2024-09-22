"use client";
import React, { useState, useEffect } from "react";
import supabase from "@/utils/client";

function Addstudent({ onClose, student, onSave }) {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [dob, setDob] = useState("");
  const [role, setRole] = useState("Student");
  const [gender, setGender] = useState("Male");
  const [joinedYear, setJoinedYear] = useState("2080");
  const [studentClass, setStudentClass] = useState("8");
  const [rollNo, setRollNo] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [parent_name, setParentName] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // useEffect(() => {
  //   if (student) {
  //     setFullName(student.Fullname);
  //     setEmail(student.Email);
  //     setContact(student.Contact);
  //     setAddress(student.Address);
  //     setDob(student.DOB);
  //     setGender(student.Gender);
  //     setJoinedYear(student.Year);
  //     setStudentClass(student.Class);
  //     setRollNo(student.Rollno);
  //     setUsername(student.username);
  //     setPassword(student.password);
  //     setParentName(student.Parentsname);
  //   }
  // }, [student]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
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


  return (
    <div>
      <div className="bg-white flex rounded-3xl shadow-2xl max-w-4xl p-3 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-3xl font-bold z-50 bg-white rounded-full w-8 h-8 flex items-center justify-center"
        >
          &times;
        </button>

        <div className="w-2/3 px-6">
          <div className="flex items-center mt-4">
            <img
              src="/assets/Addstudentorteacher.png"
              className="h-12 w-12 mr-2"
            />
            <h1 className="text-[#253553] underline text-2xl font-bold">
              ____A d d _ S t u d e n t
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
                className="txt p-2 mt-6  w-full rounded-xl border shadow-xl"
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
              >
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
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
                //maxLength="10"
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
            

            <div className="col-span-2 flex justify-center">
              <button
                type="submit"
                className="text-white shadow-xl font-bold bg-[#8AA4D6] w-80 p-3 mt-6 rounded-xl hover:bg-[#253553] duration-300"
              >
                {student ? "U P D A T E" : "A D D"}
              </button>
            </div>
          </form>
        </div>

        <div className="w-1/3 relative">
          <label htmlFor="photo-upload" className="cursor-pointer">
            <div className="rounded-full overflow-hidden">
              <img
                src="/assets/Importimage.png"
                alt="Student Photo"
                className="absolute inset-0 max-h-32 max-w-32 object-top mt-[8%] ml-[55%]"
              />
            </div>
          </label>
          <input type="file" id="photo-upload" className="hidden" />
          <img className="ml-3 rounded-3xl h-full" src="/assets/popup.png" alt="" />
        </div>
      </div>
    </div>
  );
}

export default Addstudent;
