"use client";

import React, { useState, useEffect } from "react";
import Addstudent from "@/components/admin/Addstudent";

export default function Studenttable() {
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [years, setYears] = useState([]);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [state, setState] = useState("students");
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
      const response = await fetch(`http://localhost:4000/api/auth/year?status=${state}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format received');
      }

      setYears(data);
      setError(null);

    } catch (error) {
      console.error('Failed to fetch years:', error.message);
      setError('Failed to fetch years. Please try again later.');
      setYears([]);
    }
  };
  const fetchClasses = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/auth/classes');
      if (!response.ok) throw new Error('Failed to fetch classes');
      const data = await response.json();
      setClasses(data);
    } catch (error) {
      console.error('Error fetching classes:', error);
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
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
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

  // Handle Edit
  const handleEdit = (student) => {
    // Implement edit functionality
    console.log('Edit student:', student);
  };

  // Handle Delete
  const handleDelete = (studentId) => {
    // Implement delete functionality
    console.log('Delete student:', studentId);
  };

  return (
    <div className="relative mt-7">
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

        <button
          onClick={() => setShowAddStudent(true)}
          className="bg-[#7ba0e4] dark:bg-[#8AA4D6] hover:bg-[#4c94ec] dark:hover:bg-[#253553] hover:text-white text-center py-2 px-4 rounded text-xs absolute right-4"
        >
          +Add Student
        </button>
      </div>

      {showAddStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[101]">
          <Addstudent onClose={() => setShowAddStudent(false)} />
        </div>
      )}

      {isLoading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      )}

      {error && (
        <div className="text-red-500 text-center py-4">
          Error: {error}
        </div>
      )}

      {selectedYear && selectedClass && (
        <div className="overflow-x-auto relative">
          <div className="max-h-[400px] overflow-y-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400 sticky top-0 z-30">
                <tr>
                  <th className="sticky left-0 z-30 bg-gray-200 dark:bg-gray-700" style={{ width: "400px" }}>
                    <div className="flex">
                      <div className="w-[120px] px-6 py-3">Joined Year</div>
                      <div className="w-[80px] px-6 py-3">Class</div>
                      <div className="w-[200px] px-6 py-3">Full Name</div>
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3">Roll No</th>
                  <th scope="col" className="px-6 py-3">Email</th>
                  <th scope="col" className="px-6 py-3">Parent's Name</th>
                  <th scope="col" className="px-6 py-3">Contact</th>
                  <th scope="col" className="px-6 py-3">Address</th>
                  <th scope="col" className="px-6 py-3">Date of Birth</th>
                  <th scope="col" className="px-6 py-3">Username</th>
                  <th scope="col" className="px-6 py-3">Password</th>
                  <th scope="col" className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="sticky left-0 z-20 bg-white dark:bg-gray-800" style={{ width: "400px" }}>
                      <div className="flex">
                        <div className="w-[120px] px-6 py-4">{selectedYear}</div>
                        <div className="w-[80px] px-6 py-4">{selectedClass}</div>
                        <div className="w-[200px] px-6 py-4">{student.fullName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{student.rollNo}</td>
                    <td className="px-6 py-4">{student.email}</td>
                    <td className="px-6 py-4">{student.parentName}</td>
                    <td className="px-6 py-4">{student.contact}</td>
                    <td className="px-6 py-4">{student.address}</td>
                    <td className="px-6 py-4">{student.dateOfBirth}</td>
                    <td className="px-6 py-4">{student.username}</td>
                    <td className="px-6 py-4">{student.password}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleEdit(student)}
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="font-medium text-red-600 dark:text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
