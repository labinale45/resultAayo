"use client";

import React, { useState, useEffect } from "react";
import Addteacher from "@/components/admin/Addteacher";
import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";

export default function Teachertable() {
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");
  const [years, setYears] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [state, setState] = useState("teachers");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    YearSelect();
    if (selectedYear) {
      fetchTeachers();
    }
  }, [selectedYear]);

  //Select the Year
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
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error("Failed to fetch years:", error.message);
      setError("Failed to fetch years. Please try again later.");
      setYears([]); // Reset years on error
    }
  };

  //Fetch Teachers
  const fetchTeachers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:4000/api/auth/records/${selectedYear}?status=${state}`,
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
      setTeachers(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  {
    isLoading && (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
      </div>
    );
  }

  {
    error && (
      <div className="text-red-500 text-center py-4">Error: {error}</div>
    );
  }

  const filteredteachers = teachers.filter(
    (teacher) =>
      teacher.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="relative mt-7">
      <div className="flex justify-center items-center mb-4">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 mr-3"
        >
          <option value="">Select Year</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search teachers..."
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-[#2A2B32] border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        <button
          onClick={() => setShowAddTeacher(true)}
          className="bg-[#7ba0e4] dark:bg-[#8AA4D6] hover:bg-[#4c94ec] dark:hover:bg-[#253553] hover:text-white  text-center py-2 px-4 rounded text-xs absolute right-4"
        >
          +Add Teacher
        </button>
      </div>

      {showAddTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[101]">
          <Addteacher onClose={() => setShowAddTeacher(false)} />
        </div>
      )}

      {selectedYear && (
        <div className="overflow-x-auto relative">
          <div className="max-h-[400px] overflow-y-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400 sticky top-0 z-30">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 sticky left-0 z-20 bg-gray-200 dark:bg-gray-700"
                  >
                    Full Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Email
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
                {filteredteachers.map((teacher) => (
                  <tr
                    key={teacher.id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <th
                      scope="row"
                      className="flex items-center px-6 py-4 text-gray-900 break-words dark:text-white sticky left-0 z-10 bg-white dark:bg-gray-800 max-w-[200px]"
                    >
                      <div className="flex flex-col">
                        <img
                          className="w-10 h-10 rounded-full object-cover mb-2"
                          src={teacher.img_url || "/assets/profile.png"}
                          alt={`${teacher.fullName}'s photo`}
                          onError={(e) => {
                            e.target.src = "/default-avatar.png";
                          }}
                        />
                        <div className="text-base font-semibold break-words">
                          {teacher.fullName}
                        </div>
                      </div>
                    </th>

                    <td className="px-6 py-4">{teacher.email}</td>
                    <td className="px-6 py-4">{teacher.contact}</td>
                    <td className="px-6 py-4">{teacher.address}</td>
                    <td className="px-6 py-4">{teacher.dateOfBirth}</td>
                    <td className="px-6 py-4">{teacher.username}</td>
                    <td className="px-6 py-4">{teacher.password}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleEdit(teacher)}
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(teacher.id)}
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
