"use client";

import React, { useState, useEffect } from "react";
import Createexam from "@/components/admin/Createexam";

export default function Examtable() {
  const [showCreateExam, setShowCreateExam] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedExamType, setSelectedExamType] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [years, setYears] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [state, setState] = useState("exams");
  const [subjects, setSubjects] = useState([
    { name: "Computer Science", fullMarks: "", passMarks: "" },
    { name: "Mathematics", fullMarks: "", passMarks: "" },
    { name: "Science", fullMarks: "", passMarks: "" },
    { name: "English", fullMarks: "", passMarks: "" },
    { name: "Social Studies", fullMarks: "", passMarks: "" },
    { name: "HPE", fullMarks: "", passMarks: "" },
    { name: "O.Math", fullMarks: "", passMarks: "" },
  ]);
  const [examTypes, setExamTypes] = useState([]);
  const [classes, setClasses] = useState([]);
const [selectedSubject, setSelectedSubject] = useState("");

  useEffect(() => {
    YearSelect();
    fetchExamTypes();
    fetchClasses();
    if (selectedYear) { fetchExamData(); }
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

  const fetchExamData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:4000/api/auth/records/${selectedYear}?status=${state}&examType=${selectedExamType}&class=${selectedClass}`,
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
      setSubjects(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchExamTypes = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/auth/exam-types');
      if (!response.ok) throw new Error('Failed to fetch exam types');
      const data = await response.json();
      setExamTypes(data);
    } catch (error) {
      console.error('Error fetching exam types:', error);
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

  const handleInputChange = (index, field, value) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index][field] = value;
    setSubjects(updatedSubjects);
  };

  const showTable = selectedYear && selectedExamType && selectedClass;

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
        <select
          value={selectedExamType}
          onChange={(e) => setSelectedExamType(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 mr-3"
        >
          <option value="">Select Exam Type</option>
          {examTypes.map((type) => (
            <option key={type.name} value={type.name}>
              {type.name}
            </option>
          ))}
        </select>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 mr-3"
        >
          <option value="">Select Class</option>
          {classes.map((cls) => (
            <option key={cls.grade} value={cls.grade}>
              {cls.grade}
            </option>
          ))}
        </select>

        <div className="flex space-x-2 absolute right-4">
          <button
            onClick={() => setShowCreateExam(true)}
            className=" bg-[#7ba0e4] dark:bg-[#8AA4D6] hover:bg-[#4c94ec] dark:hover:bg-[#253553] hover:text-white  text-center py-2 px-4 rounded text-xs"
          >
            +Create Exam
          </button>
          <button className="         bg-[#7ba0e4] dark:bg-[#8AA4D6] hover:bg-[#4c94ec] dark:hover:bg-[#253553] hover:text-white  text-center py-2 px-4 rounded text-xs ">
            Edit
          </button>
          <button className="bg-[#7ba0e4] dark:bg-[#8AA4D6] hover:bg-[#4c94ec] dark:hover:bg-[#253553] hover:text-white  text-center py-2 px-4 rounded text-xs ">
            Delete
          </button>
        </div>
      </div>

      {showCreateExam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[101]">
          <Createexam onClose={() => setShowCreateExam(false)} />
        </div>
      )}

      {showTable && (
        <div className="overflow-x-auto relative">
          <div className="max-h-[450px] overflow-y-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400 sticky top-0 z-30">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Subject
                  </th>
                  <th scope="col" className="px-6 py-3 ">
                    Full Marks
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Pass Marks
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
                      <input
                        type="text"
                        value={subject.fullMarks}
                        onChange={(e) =>
                          handleInputChange(index, "fullMarks", e.target.value)
                        }
                        className="w-12 h-8 text-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 sticky left-[240px] z-20 bg-white dark:bg-gray-800">
                      <input
                        type="text"
                        value={subject.passMarks}
                        onChange={(e) =>
                          handleInputChange(index, "passMarks", e.target.value)
                        }
                        className="w-12 h-8 text-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500"
                      />
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="3" className="px-6 py-4">
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
