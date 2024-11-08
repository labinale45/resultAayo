"use client";

import React, { useState, useEffect } from "react";
import Createclass from "@/components/admin/Createclass";

export default function Classtable() {
  const [showCreateClass, setShowCreateClass] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [years, setYears] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [state, setState] = useState("class");
  const [subjects, setSubjects] = useState([
    { name: "Computer Science", teacher: "" },
    { name: "Mathematics", teacher: "" },
    { name: "Science", teacher: "" },
    { name: "English", teacher: "" },
    { name: "Social Studies", teacher: "" },
    { name: "O.Maths", teacher: "" },
    { name: "Nepali", teacher: "" },
  ]);

  useEffect(() => {
    YearSelect();
    if(selectedYear) { fetchClassData(); }
  }, [selectedYear]);

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

  const fetchClassData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:4000/api/auth/records/${selectedYear}?status=${state}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // Update subjects with fetched data
      setSubjects(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };



  const showTable = selectedYear && selectedClass && selectedSection;

  const handleTeacherChange = (index, value) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index].teacher = value;
    setSubjects(updatedSubjects);
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
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 mr-3"
        >
          <option value="">Select Class</option>
        </select>
        <select
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 mr-3"
        >
          <option value="">Select Section</option>
        </select>
        <div className="flex space-x-2 absolute right-4">
          <button
            onClick={() => setShowCreateClass(true)}
            className="bg-[#7ba0e4] dark:bg-[#8AA4D6] hover:bg-[#4c94ec] dark:hover:bg-[#253553] hover:text-white  text-center py-2 px-4 rounded text-xs"
          >
            +Create Class
          </button>
          <button className="bg-[#7ba0e4] dark:bg-[#8AA4D6] hover:bg-[#4c94ec] dark:hover:bg-[#253553] hover:text-white  text-center py-2 px-4 rounded text-xs ">
            Edit
          </button>
          <button className="bg-[#7ba0e4] dark:bg-[#8AA4D6] hover:bg-[#4c94ec] dark:hover:bg-[#253553] hover:text-white  text-center py-2 px-4 rounded text-xs">
            Delete
          </button>
        </div>
      </div>

      {showCreateClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[101]">
          <Createclass onClose={() => setShowCreateClass(false)} />
        </div>
      )}

      {showTable && (
        <div className="overflow-x-auto relative">
          <div className="max-h-[450px] overflow-y-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400 sticky top-0 z-30">
                <tr>
                  <th scope="col" className="px-6 py-3 ">
                    Subject
                  </th>
                  <th scope="col" className="px-6 py-3 ">
                    Teacher
                  </th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subject, index) => (
                  <tr
                    key={index}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="px-6 py-4 sticky left-0 z-20 bg-white dark:bg-gray-800">
                      {subject.name}
                    </td>
                    <td className="px-6 py-4 sticky left-[120px] z-20 bg-white dark:bg-gray-800">
                      <select
                        value={subject.teacher}
                        onChange={(e) =>
                          handleTeacherChange(index, e.target.value)
                        }
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                      >
                        <option value="">Select Teacher</option>
                        {teachers.map((teacher, i) => (
                          <option key={i} value={teacher}>
                            {teacher}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="2" className="px-6 py-4">
                    <div className="flex justify-end">
                      <button className=" w-20 bg-[#7ba0e4] dark:bg-[#8AA4D6] hover:bg-[#4c94ec]  text-black dark:hover:bg-[#253553] hover:text-white  text-center py-2 px-4 rounded text-xs ">
                        Save
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
