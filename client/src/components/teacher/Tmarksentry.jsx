"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Tmarksentry() {
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedExamType, setSelectedExamType] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [years, setYears] = useState([]);
  const [examTypes, setExamTypes] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [state] = useState("exams");
  const [isLoading, setIsLoading] = useState(false);
  const [teacherId, setTeacherId] = useState("");

  const getTeacherIdFromToken = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      return decodedToken.role === "teachers" ? decodedToken.id : null;
    } catch (error) {
      console.error("Invalid token format");
      return null;
    }
  };

  useEffect(() => {
    const id = getTeacherIdFromToken();
    if (id) setTeacherId(id);
  }, []);

  useEffect(() => {
    const fetchYearAndExams = async () => {
      try {
        const yearResponse = await fetch(
          `http://localhost:4000/api/auth/year?status=${state}`
        );
        if (yearResponse.ok) {
          const yearData = await yearResponse.json();
          if (Array.isArray(yearData)) setYears(yearData);
        }

        if (selectedYear) {
          const examResponse = await fetch(
            `http://localhost:4000/api/auth/exam-types?year=${selectedYear}`
          );
          if (examResponse.ok) {
            const examData = await examResponse.json();
            setExamTypes(examData);
          }
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchYearAndExams();
  }, [state, selectedYear]);

  useEffect(() => {
    const fetchClassesAndSubjects = async () => {
      if (!teacherId || !selectedYear) return;

      try {
        const classResponse = await fetch(
          `http://localhost:4000/api/auth/assigned-class/${teacherId}/${selectedYear}`
        );
        if (classResponse.ok) {
          const { classes } = await classResponse.json();
          const formattedClasses = classes.map(item => ({
            id: `${item.class}`,
            name: item.class,
            section: item.section,
            studentCount: item.studentCount || 0
          }));
          setClasses(formattedClasses);
        }

        if (selectedClass) {
          const subjectResponse = await fetch(
            `http://localhost:4000/api/auth/teacher/${teacherId}/subjects?classId=${selectedClass}`
          );
          if (subjectResponse.ok) {
            const subjectIds = await subjectResponse.json();
            setSubjects(subjectIds.map(id => ({ name: ` ${id} ` })));
          }
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchClassesAndSubjects();
  }, [teacherId, selectedClass, selectedYear]);



  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:4000/api/auth/studentRecords/${selectedYear}`,
          {
            params: {
              status: 'students',
              cls: selectedClass,
              subject: selectedSubject,
              examType: selectedExamType
            }
          });

        console.log("Response Data:", response.data);
    
        // Extracting the marks and other necessary details
        const classStudents = response.data.students.map(student => {
          // Find the marks for the student, assuming marks are present in an array
          const studentMarks = response.data.marks?.find(m => m.student_id === student.id) || {};
          
          // Find the max marks setup for the class and subject (assuming single mark setup)
          const markSetup = response.data.markSetup[0] || {};
    
          return {
            rollNo: student.rollNo || "N/A",
            name: `${student.first_name} ${student.last_name}`.trim() || "Unknown",
            id: student.id,
            th: studentMarks?.TH || "",  // Theory marks
            pr: studentMarks?.PR || "",  // Practical marks
            total: (studentMarks?.TH || 0) + (studentMarks?.PR || 0),  // Total marks
            passMark: markSetup?.PM || 30,  // Pass Marks (PM)
            fullMark: markSetup?.FM || 100     // full Marks (FM)
          };
        });
    
        console.log("Final Retrieved Data:", classStudents);
        setStudents(classStudents);


    
      } catch (error) {
        console.error("Error fetching students:", error);
        setStudents([]);  // In case of an error, set the students list to an empty array
      } finally {
        setLoading(false);
      }
    };
    if (selectedYear && selectedExamType && selectedClass && selectedSubject) {
      fetchStudents();
    }
  }, [selectedYear, selectedClass, selectedSubject, selectedExamType]);

  const handleInputChange = (index, field, value) => {
    if (!/^\d*$/.test(value)) return; // Only accept numeric input
  
    const marks = parseInt(value) || 0;
    if (marks < 0 || marks > 100) return; // Ensure marks are between 0 and 100
  
    const updatedStudents = [...students];
    const student = updatedStudents[index];
    const fullMark = student.fullMark; // Max full marks for TH and PR combined
  
    // If modifying Theory (TH) marks
    if (field === 'th') {
      // Ensure the sum of TH and PR does not exceed the fullMark
      const totalMarks = marks + parseInt(student.pr || 0);
      if (totalMarks > fullMark) {
        alert(`The sum of TH and PR cannot exceed ${fullMark}`);
        return;
      }
    }
  
    // If modifying Practical (PR) marks
    if (field === 'pr') {
      // Ensure the sum of TH and PR does not exceed the fullMark
      const totalMarks = marks + parseInt(student.th || 0);
      if (totalMarks > fullMark) {
        alert(`The sum of TH and PR cannot exceed ${fullMark}`);
        return;
      }
    }
  
    // Update the mark field
    student[field] = value;
  
    // Recalculate the total marks (TH + PR)
    student.total = (parseInt(student.th) || 0) + (parseInt(student.pr) || 0);
  
    setStudents(updatedStudents); // Update the state with the modified students list
  };
  

  const handleSaveMarks = async () => {
    if (isLoading) return;
    setIsLoading(true);
    
    try {
      const validMarks = students.map(student => ({
        rollNo: student.rollNo,
        name: student.name,
        th: parseInt(student.th) || 0,
        pr: parseInt(student.pr) || 0,
        total: parseInt(student.total) || 0
      }));

      const response = await axios.post(
        "http://localhost:4000/api/auth/enter-marks",
        {
          year: selectedYear,
          examType: selectedExamType,
          className: selectedClass,
          subject: selectedSubject,
          marks: validMarks
        }
      );

      if (response.status === 200) {
        alert("Marks saved successfully!");
        window.location.reload();
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save marks");
    } finally {
      setIsLoading(false);
    }
  };

  const showTable = selectedYear && selectedExamType && selectedClass && selectedSubject;

  return (
    <div className="relative mt-5 px-9 py-8 bg-white rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Year Select */}
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 transition-all"
        >
          <option value="">Select Year</option>
          {years.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        {/* Exam Type Select */}
        <select
          value={selectedExamType}
          onChange={(e) => setSelectedExamType(e.target.value)}
          className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 transition-all"
        >
          <option value="">Select Exam Type</option>
          {examTypes.map((type) => (
            <option key={type.name} value={type.name}>{type.name}</option>
          ))}
        </select>

        {/* Class Select */}
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 transition-all"
        >
          <option value="">Select Class</option>
          {classes.map((cls) => (
            <option key={cls.id} value={cls.name}>{cls.name}</option>
          ))}
        </select>

        {/* Subject Select */}
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 transition-all"
        >
          <option value="">Select Subject</option>
          {subjects.map((subject) => (
            <option key={subject.name} value={subject.name}>{subject.name}</option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      )}

      {showTable && !loading && (
        <div className="overflow-x-auto relative">
          <div className="max-h-[400px] overflow-y-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400 sticky top-0 z-30">
                <tr>
                  <th scope="col" className="px-4 py-2 sticky left-0 z-30">Roll No</th>
                  <th scope="col" className="px-4 py-2 sticky left-[120px] z-30">Full Name</th>
                  <th scope="col" className="px-4 py-2 sticky left-[240px] z-30">TH</th>
                  <th scope="col" className="px-4 py-2 sticky left-[360px] z-30">PR</th>
                  <th scope="col" className="px-4 py-2 sticky left-[480px] z-30">Total</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-red-500">
                      Full Marks Not Set Yet, Contact to Admin !
                    </td>
                  </tr>
                ) : (
                  students.map((student, index) => (
                    <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <td className="px-4 py-2 sticky left-0 z-20 bg-white dark:bg-gray-800">{student.rollNo}</td>
                      <td className="px-4 py-2 sticky left-[120px] z-20 bg-white dark:bg-gray-800">{student.name}</td>
                      <td className="px-4 py-2 sticky left-[240px] z-20 bg-white dark:bg-gray-800">
                        <input
                          type="number"
                          value={student.th}
                          onChange={(e) => handleInputChange(index, "th", e.target.value)}
                          className="w-12 h-8 text-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500"
                        />
                      </td>
                      <td className="px-4 py-2 sticky left-[360px] z-20 bg-white dark:bg-gray-800">
                        <input
                          type="number"
                          value={student.pr}
                          onChange={(e) => handleInputChange(index, "pr", e.target.value)}
                          className="w-12 h-8 text-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500"
                        />
                      </td>
                      <td className="px-4 py-2 sticky left-[480px] z-20 bg-white dark:bg-gray-800">{student.total}</td>
                    </tr>
                  ))
                )}
                <tr>
                  <td colSpan="5" className="px-4 py-4">
                    <div className="flex justify-end">
                      <button
                        onClick={handleSaveMarks}
                        disabled={isLoading}
                        className="w-20 bg-blue-500 hover:bg-blue-600 text-white text-center py-2 px-4 rounded-lg disabled:opacity-50"
                      >
                        {isLoading ? "Saving..." : "Save"}
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
