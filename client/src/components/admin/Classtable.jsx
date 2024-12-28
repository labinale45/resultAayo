"use client";

import React, { useState, useEffect } from "react";
import Createclass from "@/components/admin/Createclass";
import { colgroup } from "framer-motion/client";

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
    // { name: "Computer Science", teacher: "" },
    // { name: "Mathematics", teacher: "" },
    // { name: "Science", teacher: "" },
    // { name: "English", teacher: "" },
    // { name: "Social Studies", teacher: "" },
    // { name: "O.Maths", teacher: "" },
    // { name: "Nepali", teacher: "" },
  ]);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);

  console.log("ss",subjects);

  useEffect(() => {
    YearSelect();
    fetchClasses();
    fetchTeachers();
    if(selectedYear && selectedClass && selectedSection) { 
      fetchClassData(); 
    }
  }, [selectedYear, selectedClass, selectedSection]);

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
        `http://localhost:4000/api/auth/subjects/${selectedClass}?section=${selectedSection}&year=${selectedYear}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch subjects');
      }

      const data = await response.json();
      setSubjects(data);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
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

  const fetchTeachers = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/auth/teachers');
      if (!response.ok) throw new Error('Failed to fetch teachers');
      const data = await response.json();
      setTeachers(data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const handleSave = async () => {
    try {
      const promises = subjects.map(subject => 
        fetch('http://localhost:4000/api/auth/assign-teacher', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            subjectId: subject.id,
            teacherId: subject.teacherId,
            classId: selectedClass,
            section: selectedSection
          })
        })
      );

      await Promise.all(promises);
      
      fetchClassData();
    } catch (error) {
      console.error('Error saving teacher assignments:', error);
      setError('Failed to save teacher assignments');
    }
  };

  const handleTeacherChange = (index, teacherId) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index].teacherId = teacherId;
    setSubjects(updatedSubjects);
  };

  const showTable = selectedYear && selectedClass && selectedSection;

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
          {classes.map((cls) => (
            <option key={cls.grade} value={cls.grade}>
              {cls.grade}
            </option>
          ))}
        </select>
        <select
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 mr-3"
        >
          <option value="">Select Section</option>
          {classes.map((cls) => (
            <option key={cls.sections} value={cls.sections}>
              {cls.sections}
            </option>
          ))}
        </select>
        <div className="flex space-x-2 absolute right-4">
          <button
            onClick={() => setShowCreateClass(true)}
            className="bg-[#7ba0e4] dark:bg-[#8AA4D6] hover:bg-[#4c94ec] dark:hover:bg-[#253553] hover:text-white  text-center py-2 px-4 rounded text-xs"
          >
            +Create Class
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
            {subjects.length === 0 ? (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                    No subjects found for the selected class, section and year.
                </div>
            ) : (
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400 sticky top-0 z-30">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Subject
                            </th>
                            <th scope="col" className="px-6 py-3">
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
                                        value={subject.teacherId || ""}
                                        onChange={(e) => handleTeacherChange(index, e.target.value)}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                                    >
                                        {subject.teacher === null?<option value=""></option>:<option value="">{subject.teacher}</option>}
                                            {teachers.map((teacher) => (
                                              <option key={teacher.id} value={teacher.id}>
                                                {teacher.name}
                                              </option>
                                            ))}

                                    </select>
                                </td>
                            </tr>
                        ))}
                        {subjects.length > 0 && (
                            <tr>
                                <td colSpan="2" className="px-6 py-4">
                                    <div className="flex justify-end">
                                        <button 
                                            onClick={handleSave}
                                            className="w-20 bg-[#7ba0e4] dark:bg-[#8AA4D6] hover:bg-[#4c94ec] text-black dark:hover:bg-[#253553] hover:text-white text-center py-2 px-4 rounded text-xs"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
