"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";

export default function Studentdetail() {
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [years, setYears] = useState([]);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [state] = useState("students");
  const [classes, setClasses] = useState([]);
  const [teacherId, setTeacherId] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [isClassTeacher, setIsClassTeacher] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [targetClass, setTargetClass] = useState('');


  const handleUpgradeStudents = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/auth/upgrade-students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentIds: selectedStudents,
          targetClass: targetClass
        })
      });
  
      if (response.ok) {
        setIsUpgradeModalOpen(false);
        setSelectedStudents([]);
        fetchStudents(); // Refresh the student list
      }
    } catch (error) {
      console.error('Error upgrading students:', error);
    }
  };
  

  // Update the useEffect that runs when selectedClass changes
  useEffect(() => {
    if (selectedYear && selectedClass && teacherId) {
      fetchStudents();
      // Find the selected class object from classes array
      const selectedClassObj = classes.find(cls => cls.name === selectedClass);
      checkIfClassTeacher(selectedClass, selectedClassObj?.section, teacherId);
    } else {
      setStudents([]);
    }
  }, [selectedYear, selectedClass, teacherId]);
  

  const checkIfClassTeacher = async (classId, sec, teacherId) => {
    try {
      // Find the selected class object from classes array to get the section
      const selectedClassObj = classes.find(cls => cls.name === classId);
      const section = selectedClassObj?.section;
  
      const response = await fetch(`http://localhost:4000/api/auth/class/${classId}/${section}/${selectedYear}`);
      const subjects = await response.json();
      const classTeacherInfo = subjects[0]?.classTeacher ===  teacherId;
      setIsClassTeacher(classTeacherInfo);
      console.log("Class Teacher Info:", classTeacherInfo);
    } catch (error) {
      console.error("Error checking class teacher status:", error);
      setIsClassTeacher(false);
    }
  };
  
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedStudents(filteredStudents.map(student => student.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleSelectStudent = (studentId) => {
    setSelectedStudents(prev => {
      if (prev.includes(studentId)) {
        return prev.filter(id => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };

  useEffect(() => {
    // Fetch teacherId from token
    const token = localStorage.getItem("token"); // Assuming you store the token in localStorage
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode the token
      console.log("decotedTOken",decodedToken); // Log the decoded token for debugging
      if (decodedToken.role === "teachers") {
        setTeacherId(decodedToken.id); // Assuming the teacher ID is stored as 'id' in the token
      }
    }
})
useEffect(() => {
  if (teacherId) {
    fetchClasses(teacherId);
    console.log("classes : ", classes);
  }
}, [teacherId]);

  const fetchYears = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/auth/year?status=${state}`
      );
      const data = await response.json();
      setYears(data);
      if (data && data.length > 0) {
        setSelectedYear(data[0]);
      }else{
        setYears([]);
      }
    } catch (error) {
      setError("Failed to fetch years");
    }
  };

  const fetchClasses = async (teacherId) => {
    try {
        const response = await fetch(`http://localhost:4000/api/auth/teacher/${teacherId}/classes`);
        if (!response.ok) throw new Error("Failed to fetch classes");

        const classData = await response.json();
        const classes = classData.map(item => ({
            id: item.class,
            name: `${item.class}`,
            section: item.section
        }));

        setClasses(classes);
    } catch (error) {
        console.error("Error fetching classes:", error);
    }
};


  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:4000/api/auth/records/${selectedYear}?status=${state}&class=${selectedClass}`
      );
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      setError("Failed to fetch students");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchYears();
  }, []);

  useEffect(() => {
    if (selectedYear && selectedClass) {
      fetchStudents();
    }else {
      setStudents([]);
    }
  }, [selectedYear, selectedClass]);

  const filteredStudents = students.filter(
    (student) =>
      student.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="px-9 py-8 relative mt-7">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
        <div className="flex gap-4 w-full md:w-auto">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-white dark:bg-[#2A2B32] border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 transition-all"
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
  className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 transition-all"
>
  <option value="">Select Class</option>
  {classes.map((cls) => (
    <option key={cls.id} value={cls.name}>
      {cls.name}
    </option>
  ))}
</select>


{isClassTeacher && (
 <button 
 onClick={() => setIsUpgradeModalOpen(true)}
 className={`flex items-center gap-2 px-6 py-2.5 font-medium rounded-lg transition-colors ${
   selectedStudents.length > 0 
     ? 'bg-blue-600 text-white hover:bg-blue-700' 
     : 'bg-gray-300 text-gray-500 cursor-not-allowed'
 }`}
 disabled={selectedStudents.length === 0}
>

    <span>Upgrade</span>
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24"
      className="w-5 h-5 fill-current"
    >
      <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
    </svg>
  </button>
)}

        </div>

        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search students..."
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-[#2A2B32] border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center p-4">{error}</div>
      ) : (
        <div className="overflow-x-auto relative">
          <div className="max-h-[450px] overflow-y-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400 sticky top-0 z-30">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                  </th>
                 <th scope="col" className="px-6 py-3">
                    Full Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Parent's Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Address
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Date of Birth
                  </th>
                 
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ?(
                  <tr>
                  <td colSpan="10" className="text-center py-4 text-red-500">
                   Student Not Found.
                  </td>
                </tr>
                ) : filteredStudents.map((student) => (
                  <motion.tr
                    key={student.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => handleSelectStudent(student.id)}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4">{student.fullName}</td>
                    <td className="px-6 py-4">{student.email}</td>
                    <td className="px-6 py-4">{student.contact}</td>
                    <td className="px-6 py-4">{student.parentName}</td>
                    <td className="px-6 py-4">{student.address}</td>
                    <td className="px-6 py-4">{student.dateOfBirth}</td>
                    </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        
          {isUpgradeModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-96">
      <h2 className="text-xl font-bold mb-4">Upgrade Students</h2>
      <select
        value={targetClass}
        onChange={(e) => setTargetClass(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      >
        <option value="">Select Target Class</option>
        {classes.map((cls) => (
          <option key={cls.id} value={cls.name}>
            {cls.name}
          </option>
        ))}
      </select>
      <div className="flex justify-end gap-2">
        <button
          onClick={() => setIsUpgradeModalOpen(false)}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={handleUpgradeStudents}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
)}

        </div>
        
      )}
    </div>
  );
}
