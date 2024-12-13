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

  useEffect(() => {
    YearSelect();
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedYear && selectedClass) {
      fetchStudents();
    }
  }, [selectedYear, selectedClass]);

  // Select the Year
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

  // Fetch Students
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
  console.log(students);
  // Handle Edit
  const handleEdit = async (student) => {
    try {
      setError(null);
      const response = await fetch(`http://localhost:4000/api/auth/student/${student.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Student not found');
        }
        throw new Error('Failed to fetch student details');
      }

      const studentData = await response.json();
      
      // Safely handle name splitting with fallback values
      // let firstName = '', lastName = '';
      // if (studentData.fullName && typeof studentData.fullName === 'string') {
      //   const nameParts = studentData.fullName.split(' ').filter(part => part);
      //   firstName = nameParts[0] || '';
      //   lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
      // }

      setSelectedStudent({
        id: studentData.id,
        first_name: studentData.first_name || '',
        last_name: studentData.last_name || '',
        email: studentData.email || '',
        phone_number: studentData.phone_number || '',
        address: studentData.address || '',
        dob: studentData.dob || '',
        gender: studentData.gender || 'Male',
        username: studentData.username || '',
        password: studentData.password || '',
        img_url: studentData.img_url || ''
      });
      
      setShowAddStudent(true);
    } catch (error) {
      console.error('Error fetching student details:', error);
      setError(error.message);
    }
  };

  // Handle Delete
  const handleDelete = async(studentId) => {
    if (window.confirm('Are you sure you want to delete this Student?')) {
      try {
        const response = await fetch(`http://localhost:4000/api/auth/student/${studentId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete student');
        }

        fetchStudents();
      } catch (error) {
        console.error('Error deleting student:', error);
        setError('Failed to delete student. Please try again.');
      }
    }
  };
  // const filteredStudents = students.filter(
  //   (student) =>
  //     student.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  return (
    <div className="relative mt-7 px-8">
      <div className="flex justify-center items-center mb-4">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
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
          onClick={() => setShowAddStudent(true)}
          className="bg-[#7ba0e4] dark:bg-[#8AA4D6] hover:bg-[#4c94ec] dark:hover:bg-[#253553] hover:text-white text-center py-2 px-4 rounded text-xs absolute right-4"
        >
          +Add Student
        </button>
      </div>

      {showAddStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[101]">
          <Addstudent 
            onClose={() => {
              setShowAddStudent(false);
              setSelectedStudent(null);
            }} 
            student={selectedStudent}
            onSave={() => {
              fetchStudents();
              setShowAddStudent(false);
              setSelectedStudent(null);
            }}
          />
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
          <div className="max-h-[400px] overflow-y-auto">
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
                    Parent's Name
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
                  <th scope="col" className="px-6 py-3">
                    Password
                  </th>
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
                  students.map((student) => (
                    <tr
                      key={student.id}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >

                      <th scope="row" className="flex items-center px-6 py-4 text-gray-900 break-words dark:text-white sticky left-0 z-10 bg-white dark:bg-gray-800 max-w-[200px]">
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
                      <td className="px-6 py-4">{student.password}</td>
                      <td className="px-6 py-4">
  <div className="flex-col  justify-around items-center py-3">
    <div className="flex gap-2 mb-3 text-gray-600 hover:scale-110 duration-200 hover:cursor-pointer">
      <svg className="w-4 stroke-green-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
      </svg>
      <button className="font-semibold text-sm text-green-700" onClick={() => handleEdit(student)}>Edit</button>
    </div>
    <div className="flex gap-2 text-gray-600 hover:scale-110 duration-200 hover:cursor-pointer">
      <svg className="w-4 stroke-red-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        <line x1="10" y1="11" x2="10" y2="17"></line>
        <line x1="14" y1="11" x2="14" y2="17"></line>
      </svg>
      <button className="font-semibold text-sm text-red-700" onClick={() => handleDelete(student.id)}>Delete</button>
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
