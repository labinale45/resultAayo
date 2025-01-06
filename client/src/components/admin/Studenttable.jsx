"use client";

import React, { useState, useEffect } from "react";
import Addstudent from "@/components/admin/Addstudent";
import { CgLaptop } from "react-icons/cg";
import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import Image from "next/image";

export default function Studenttable() {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [years, setYears] = useState([]);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [state, setState] = useState("students");
  const [searchTerm, setSearchTerm] = useState("");
  const [classes, setClasses] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [image, setImage] = useState("");
  const [changePassword, setChangePassword] = useState("");

  const handleAddStudent = () => {
    setSelectedStudent(null); // Reset selected student for adding a new student
    setIsEditing(false); // Set mode to add
    setShowAddStudent(true); // Show the Addstudent form
  };

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/api/auth/classes/${selectedYear}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch classes");
        const data = await response.json();
        setClasses(data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };
    const YearSelect = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/api/auth/year?status=${state}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || `HTTP error! status: ${response.status}`
          );
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Invalid data format received");
        }

        setYears(data);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch years:", error.message);
        setError("Failed to fetch years. Please try again later.");
        setYears([]);
      }
    };
    YearSelect();
    if (selectedYear) {
      fetchClasses();
    } else {
      setClasses([]);
    }
  }, [state, selectedYear]);

  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:4000/api/auth/records/${selectedYear}?status=${state}&class=${selectedClass}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setStudents(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    if (selectedYear && selectedClass) {
      fetchStudents();
    }
  }, [state, selectedYear, selectedClass]);

  // Select the Year

  // Fetch Students

  console.log(students);
  // Handle Edit
  const handleEdit = async (studentId) => {
    try {
      setError(null);
      setIsEditing(true);
      const response = await fetch(
        `http://localhost:4000/api/auth/student/${studentId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Student not found");
        }
        throw new Error("Failed to fetch student details");
      }

      const studentData = await response.json();
      console.log("client", studentData);
      setSelectedStudent({
        id: studentData.id,
        first_name: studentData.first_name || "",
        last_name: studentData.last_name || "",
        email: studentData.email || "",
        phone_number: studentData.phone_number || "",
        address: studentData.address || "",
        dob: studentData.dob || "",
        gender: studentData.gender || "Male",
        username: studentData.username || "",
        img_url: studentData.img_url || "",
      });

      // Show the add student form for editing
    } catch (error) {
      console.error("Error fetching student details:", error);
      setError(error.message);
    }
  };

  //update Student
  const handleSaveChanges = async () => {
    try {
      let imageBase64 = "";
      if (image) {
        const reader = new FileReader();
        imageBase64 = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(image);
        });
      }

      const response = await fetch(
        `http://localhost:4000/api/auth/student/${selectedStudent.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: selectedStudent.id,
            first_name: selectedStudent.first_name,
            last_name: selectedStudent.last_name,
            email: selectedStudent.email,
            phone_number: selectedStudent.phone_number,
            address: selectedStudent.address,
            dob: selectedStudent.dob,
            gender: selectedStudent.gender,
            // username: selectedStudent.username,
            password: selectedStudent.password,
            change_password: changePassword,
            img_url: selectedStudent.img_url,
            image: imageBase64, // Ensure to send the image URL if updated
          }),
        }
      );

      if (!response.ok) {
        alert("Failed to update student. Please try again.");
      }
      // Refresh the student list after successful update
      setImage(null);
      setChangePassword(null);
      //fetchStudents();
      setIsEditing(false);
      setSelectedStudent(null);
      // Show success message
    } catch (error) {
      console.error("Error saving changes:", error);
      setError("Failed to save changes. Please try again."); // Set error message
    }
  };

  // Handle Delete
  const handleDelete = async (studentId) => {
    if (window.confirm("Are you sure you want to delete this Student?")) {
      try {
        const response = await fetch(
          `http://localhost:4000/api/auth/student/${studentId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete student");
        }
      } catch (error) {
        console.error("Error deleting student:", error);
        setError("Failed to delete student. Please try again.");
      }
    }
  };
  const filteredStudents = students.filter(
    (student) =>
      student.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative mt-7 px-8">
      <div className="flex justify-center items-center mb-4">
        <select
          value={selectedYear}
          onChange={(e) => {
            setSelectedYear(e.target.value);
            setSelectedClass("");
          }}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 mr-2"
        >
          <option value="">Select Year</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 mr-2"
        >
          <option value="">Select Class</option>
          {classes.map((cls) => (
            <option key={cls.id} value={cls.grade}>
              {cls.grade}
            </option>
          ))}
        </select>

        <div className="relative px-2 w-full md:w-96">
          <input
            type="text"
            placeholder="Search students..."
            className="w-full h-10 pl-12 pr-4 py-3 bg-white dark:bg-[#2A2B32] border-2 border-gray-200 dark:border-gray-700 rounded-full focus:ring-2 focus:ring-blue-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        <button
          onClick={handleAddStudent} // Update the onClick handler
          className="bg-[#7ba0e4] dark:bg-[#8AA4D6] hover:bg-[#4c94ec] dark:hover:bg-[#253553] hover:text-white text-center py-2 px-4 rounded text-xs absolute right-4"
        >
          +Add Student
        </button>
      </div>

      {showAddStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[101]">
          <Addstudent
            onClose={() => setShowAddStudent(false)} // Close handler
            student={selectedStudent} // Pass selected student (null for new)
            onSave={() => {
              // Logic to refresh student list or handle after save
              fetchStudents();
              setShowAddStudent(false);
              setSelectedStudent(null);
            }}
            isEditing={isEditing} // Pass the editing state
          />
        </div>
      )}

      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[101]">
          <div className="bg-white p-10 rounded-lg shadow-lg">
            <div className="flex flex-wrap gap-5 items-center w-full max-md:max-w-full mb-10">
              <div className="flex flex-wrap flex-1 shrink gap-5 items-center self-stretch my-auto basis-0 min-w-[240px] max-md:max-w-full">
                <div className="flex relative flex-col justify-center self-stretch bg-gray-100 h-[70px] min-h-[70px] rounded-[16px] overflow-hidden w-[70px]">
                  <div className="w-[100px] h-[100px] aspect-auto">
                    <Image
                      src={
                        image
                          ? URL.createObjectURL(image)
                          : selectedStudent?.img_url || "/assets/profile.png"
                      }
                      alt="Student"
                      width={100}
                      height={100}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex flex-col self-stretch my-auto min-w-[240px]">
                  <div className="text-base text-gray-800">
                    {selectedStudent?.first_name} {selectedStudent?.last_name}
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    Edit Student Details
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-10">
              <div id="input" className="relative">
                <input
                  type="text"
                  id="first_name"
                  className="border-b border-gray-300 py-1 focus:border-b-2 focus:border-blue-700 transition-colors focus:outline-none peer bg-inherit"
                  placeholder=""
                  value={selectedStudent?.first_name || ""}
                  onChange={(e) =>
                    setSelectedStudent({
                      ...selectedStudent,
                      first_name: e.target.value,
                    })
                  }
                />
                <label
                  htmlFor="first_name"
                  className="absolute text-gray-400 -top-4 text-xs left-0 cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all peer-focus:text-blue-700 peer-placeholder-shown:top-1 peer-placeholder-shown:text-sm"
                >
                  First name
                </label>
              </div>

              <div id="input" className="relative">
                <input
                  type="text"
                  id="last_name"
                  className="border-b border-gray-300 py-1 focus:border-b-2 focus:border-blue-700 transition-colors focus:outline-none peer bg-inherit"
                  placeholder=""
                  value={selectedStudent?.last_name || ""}
                  onChange={(e) =>
                    setSelectedStudent({
                      ...selectedStudent,
                      last_name: e.target.value,
                    })
                  }
                />
                <label
                  htmlFor="last_name"
                  className="absolute text-gray-400 -top-4 text-xs left-0 cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all peer-focus:text-blue-700 peer-placeholder-shown:top-1 peer-placeholder-shown:text-sm"
                >
                  Last name
                </label>
              </div>

              <div id="input" className="relative">
                <input
                  type="email"
                  id="email"
                  className="border-b border-gray-300 py-1 focus:border-b-2 focus:border-blue-700 transition-colors focus:outline-none peer bg-inherit"
                  placeholder=""
                  value={selectedStudent?.email || ""}
                  onChange={(e) =>
                    setSelectedStudent({
                      ...selectedStudent,
                      email: e.target.value,
                    })
                  }
                />
                <label
                  htmlFor="email"
                  className="absolute text-gray-400 -top-4 text-xs left-0 cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all peer-focus:text-blue-700 peer-placeholder-shown:top-1 peer-placeholder-shown:text-sm"
                >
                  E-mail
                </label>
              </div>

              <div id="input" className="relative">
                <input
                  type="tel"
                  id="phone_number"
                  className="border-b border-gray-300 py-1 focus:border-b-2 focus:border-blue-700 transition-colors focus:outline-none peer bg-inherit"
                  placeholder=""
                  value={selectedStudent?.phone_number || ""}
                  onChange={(e) =>
                    setSelectedStudent({
                      ...selectedStudent,
                      phone_number: e.target.value,
                    })
                  }
                />
                <label
                  htmlFor="phone_number"
                  className="absolute text-gray-400 -top-4 text-xs left-0 cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all peer-focus:text-blue-700 peer-placeholder-shown:top-1 peer-placeholder-shown:text-sm"
                >
                  Phone
                </label>
              </div>

              <div id="input" className="relative">
                <input
                  type="text"
                  id="address"
                  className="border-b border-gray-300 py-1 focus:border-b-2 focus:border-blue-700 transition-colors focus:outline-none peer bg-inherit"
                  placeholder=""
                  value={selectedStudent?.address || ""}
                  onChange={(e) =>
                    setSelectedStudent({
                      ...selectedStudent,
                      address: e.target.value,
                    })
                  }
                />
                <label
                  htmlFor="address"
                  className="absolute text-gray-400 -top-4 text-xs left-0 cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all peer-focus:text-blue-700 peer-placeholder-shown:top-1 peer-placeholder-shown:text-sm"
                >
                  Address
                </label>
              </div>

              <div id="input" className="relative">
                <input
                  type="date"
                  id="dob"
                  className="border-b border-gray-300 py-1 focus:border-b-2 focus:border-blue-700 transition-colors focus:outline-none peer bg-inherit"
                  value={selectedStudent?.dob || ""}
                  onChange={(e) =>
                    setSelectedStudent({
                      ...selectedStudent,
                      dob: e.target.value,
                    })
                  }
                />
                <label
                  htmlFor="dob"
                  className="absolute text-gray-400 -top-4 text-xs left-0 cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all peer-focus:text-blue-700 peer-placeholder-shown:top-1 peer-placeholder-shown:text-sm"
                >
                  Date of Birth
                </label>
              </div>

              <div id="input" className="relative">
                <select
                  id="gender"
                  className="border-b border-gray-300 py-1 focus:border-b-2 focus:border-blue-700 transition-colors focus:outline-none peer bg-inherit"
                  value={selectedStudent?.gender || "Male"}
                  onChange={(e) =>
                    setSelectedStudent({
                      ...selectedStudent,
                      gender: e.target.value,
                    })
                  }
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <label
                  htmlFor="gender"
                  className="absolute text-gray-400 -top-4 text-xs left-0 cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all peer-focus:text-blue-700 peer-placeholder-shown:top-1 peer-placeholder-shown:text-sm"
                >
                  Gender
                </label>
              </div>
              {/* <div id="input" className="relative">
        <input
          type="text"
          id="username"
          className="border-b border-gray-300 py-1 focus:border-b-2 focus:border-blue-700 transition-colors focus:outline-none peer bg-inherit"
          placeholder=""
          value={selectedStudent?.username || ''}
          onChange={(e) => setSelectedStudent({ ...selectedStudent, username: e.target.value })}
        />
        <label htmlFor="username" className="absolute text-gray-400 -top-4 text-xs left-0 cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all peer-focus:text-blue-700 peer-placeholder-shown:top-1 peer-placeholder-shown:text-sm">
          Username
        </label>
      </div> */}

              <div id="input" className="relative">
                <input
                  type="password"
                  id="password"
                  className="border-b border-gray-300 py-1 focus:border-b-2 focus:border-blue-700 transition-colors focus:outline-none peer bg-inherit"
                  placeholder=""
                  value={changePassword || ""}
                  onChange={(e) => setChangePassword(e.target.value)}
                />
                <label
                  htmlFor="password"
                  className="absolute text-gray-400 -top-4 text-xs left-0 cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all peer-focus:text-blue-700 peer-placeholder-shown:top-1 peer-placeholder-shown:text-sm"
                >
                  Change Password
                </label>
              </div>
              <div id="input" className="relative">
                <input
                  type="file"
                  id="img_url"
                  className="border-b border-gray-300 py-1 focus:border-b-2 focus:border-blue-700 transition-colors focus:outline-none peer bg-inherit"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                />
                <label
                  htmlFor="img_url"
                  className="absolute text-gray-400 -top-4 text-xs left-0 cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all peer-focus:text-blue-700 peer-placeholder-shown:top-1 peer-placeholder-shown:text-sm"
                >
                  Upload Image
                </label>
              </div>
            </div>

            <div className="sm:flex sm:flex-row-reverse flex gap-4">
              <button
                className="w-fit rounded-lg text-sm px-5 py-2 focus:outline-none h-[50px] border bg-[#7ba0e4] hover:bg-blue-400 focus:bg-[#7ba0e4] border-[#7ba0e4] text-white focus:ring-4 focus:ring-violet-200 hover:ring-4 hover:ring-violet-100 transition-all duration-300"
                type="button"
                onClick={() => {
                  handleSaveChanges();
                }}
              >
                <div className="flex gap-2 items-center">Save changes</div>
              </button>
              <button
                className="w-fit rounded-lg text-sm px-5 py-2 focus:outline-none h-[50px] border bg-transparent border-primary text-primary focus:ring-4 focus:ring-gray-100"
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setSelectedStudent(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      )}

      {error && (
        <div className="text-red-500 text-center py-4">Error: {error}</div>
      )}

      {selectedYear && selectedClass && (
        <div className="overflow-x-auto relative">
          <div className="max-h-[440px] overflow-y-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400 sticky top-0 z-30">
                <tr>
                  <th
                    className="sticky left-0 z-30 bg-gray-200 dark:bg-gray-700"
                    style={{ width: "400px" }}
                  >
                    <div className="flex">
                      <div className="w-[120px] px-6 py-3">Class</div>
                      <div className="w-[80px] px-6 py-3">Full Name </div>
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Roll No
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Parent`&apos;s Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Address
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Date of Birth
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Username
                  </th>
                  {/* <th scope="col" className="px-6 py-3">
                    Password
                  </th> */}
                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center py-4 text-red-500">
                      No records found for the selected year and class.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <th
                        scope="row"
                        className="flex items-center px-6 py-4 text-gray-900 break-words dark:text-white sticky left-0 z-10 bg-white dark:bg-gray-800 max-w-[200px]"
                      >
                        <div className="w-[80px] text-black px-2 py-4">
                          {student.class}
                        </div>

                        <div className="ml-12 flex flex-col">
                          <Image
                            width={200}
                            height={200}
                            className="w-10 h-10 rounded-full object-cover mb-2"
                            src={student.img_url || "/assets/profile.png"}
                            alt={`${student.fullName}'s photo`}
                            onError={(e) => {
                              e.target.src = "/assets/profile.png";
                            }}
                          />
                          <div className="text-base font-semibold break-words">
                            {student.fullName}
                          </div>
                        </div>
                      </th>
                      <td className="px-6 py-4">{student.rollNo}</td>
                      <td className="px-6 py-4">{student.email}</td>
                      <td className="px-6 py-4">{student.parentName}</td>
                      <td className="px-6 py-4">{student.contact}</td>
                      <td className="px-6 py-4">{student.address}</td>
                      <td className="px-6 py-4">{student.dateOfBirth}</td>
                      <td className="px-6 py-4">{student.username}</td>
                      {/* <td className="px-6 py-4">{student.password}</td> */}
                      <td className="px-6 py-4">
                        <div className="flex-col  justify-around items-center py-3">
                          <div
                            onClick={() => handleEdit(student.id)}
                            className="flex gap-2 mb-3 text-gray-600 hover:scale-110 duration-200 hover:cursor-pointer"
                          >
                            <svg
                              className="w-4 stroke-green-700"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                            <button className="font-semibold text-sm text-green-700">
                              Edit
                            </button>
                          </div>
                          <div
                            onClick={() => handleDelete(student.id)}
                            className="flex gap-2 text-gray-600 hover:scale-110 duration-200 hover:cursor-pointer"
                          >
                            <svg
                              className="w-4 stroke-red-700"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              <line x1="10" y1="11" x2="10" y2="17"></line>
                              <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                            <button className="font-semibold text-sm text-red-700">
                              Delete
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
