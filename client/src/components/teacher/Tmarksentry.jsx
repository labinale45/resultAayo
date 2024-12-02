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
    const [state, setState] = useState("exams");
    const [isLoading, setIsLoading] = useState(false);
    const [teacherId, setTeacherId] = useState("");


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
    }, []);

    console.log("teacherId", teacherId);

    useEffect(() => {
      YearSelect();
      if (selectedYear) {
        fetchExamTypes();
      }
    }, [selectedYear]);


    useEffect(() => {
      if (teacherId) {
        fetchClasses(teacherId);
        fetchSubjects(teacherId);
        console.log("classes, Subjects ", classes, subjects);
      }
    }, [teacherId]);



    
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
      } catch (error) {
        console.error("Failed to fetch years:", error.message);
        setYears([]);
      }
    };

    const fetchExamTypes = async () => {
      try {
        // Correct the URL structure to use a query parameter or path parameter
        const response = await fetch(`http://localhost:4000/api/auth/exam-types?year=${selectedYear}`);
    
        if (!response.ok) throw new Error("Failed to fetch exam types");

        const examData = await response.json();
        setExamTypes(examData);
      } catch (error) {
        console.error("Error fetching exam types:", error);
      }
    };

    const fetchClasses = async (teacherId) => {
      try {
        const response = await fetch(`http://localhost:4000/api/auth/teacher/${teacherId}/classes`);
        if (!response.ok) throw new Error("Failed to fetch classes");
        const classIds = await response.json();
        const classes = classIds.map(id => ({
          id: id,
          name: `Class ${id}`
        }));
        setClasses(classes);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    const fetchSubjects = async (teacherId) => {
      try {
       
        const response = await fetch(`http://localhost:4000/api/auth/teacher/${teacherId}/subjects`);
        if (!response.ok) throw new Error("Failed to fetch subjects");
        const subjectIds = await response.json();
        console.log("subjectIds", subjectIds);
        const subject = subjectIds.map(id => ({
          name: ` ${id} `
        }));
        console.log("subject", subject);
        setSubjects(subject);
        
      } catch (error) {
        console.error("Error fetching Subjects:", error);
      }
    };

    const showTable =
    selectedYear && selectedExamType && selectedClass && selectedSubject;

  // Add these new functions in your component

  const handleInputChange = (index, field, value) => {
    const updatedStudents = [...students];
    updatedStudents[index][field] = value;
    // Calculate total
    updatedStudents[index].total =
      (parseInt(updatedStudents[index].th) || 0) +
      (parseInt(updatedStudents[index].pr) || 0);
    setStudents(updatedStudents);
  };

  const handleSaveMarks = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:4000/api/auth/enter-marks",
        {
          year: selectedYear,
          examType: selectedExamType,
          className: selectedClass,
          subject: selectedSubject,
          marks: students,
        }
      );

      if (response.status === 200) {
        alert("Marks saved successfully!");
        // Optionally reset form or refresh data
      }
    } catch (error) {
      console.error("Error saving marks:", error);
      alert("Failed to save marks. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Add this function to fetch students when class is selected
  const fetchStudents = async () => {
    if (selectedClass) {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:4000/api/auth/records/${selectedYear}?status=students`
        );
        const classStudents = response.data
          .filter((student) => student.grade === selectedClass)
          .map((student) => ({
            rollNo: student.id,
            name: student.fullName,
            th: "",
            pr: "",
            total: 0,
          }));
        setStudents(classStudents);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Add this useEffect to trigger student fetch
  useEffect(() => {
    if (selectedClass && selectedYear) {
      fetchStudents();
    }
  }, [selectedClass, selectedYear]);
    return (
      <div className="relative mt-5 p-4 bg-white rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 transition-all"
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
            className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 transition-all"
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
  className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 transition-all"
>
  <option value="">Select Class</option>
  {classes.map((cls) => (
    <option key={cls.id} value={cls.name}>
      {cls.name}
    </option>
  ))}
</select>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option value="">Select Subject</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
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
                    <th scope="col" className="px-4 py-2 sticky left-0 z-30">
                      Roll No
                    </th>
                    <th scope="col" className="px-4 py-2 sticky left-[120px] z-30">
                      Full Name
                    </th>
                    <th scope="col" className="px-4 py-2 sticky left-[240px] z-30">
                      TH
                    </th>
                    <th scope="col" className="px-4 py-2 sticky left-[360px] z-30">
                      PR
                    </th>
                    <th scope="col" className="px-4 py-2 sticky left-[480px] z-30">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, index) => (
                    <tr
                      key={index}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <td className="px-4 py-2 sticky left-0 z-20 bg-white dark:bg-gray-800">
                        {student.rollNo}
                      </td>
                      <td className="px-4 py-2 sticky left-[120px] z-20 bg-white dark:bg-gray-800">
                        {student.name}
                      </td>
                      <td className="px-4 py-2 sticky left-[240px] z-20 bg-white dark:bg-gray-800">
                        <input
                          type="text"
                          value={student.th}
                          onChange={(e) =>
                            handleInputChange(index, "th", e.target.value)
                          }
                          className="w-12 h-8 text-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500"
                        />
                      </td>
                      <td className="px-4 py-2 sticky left-[360px] z-20 bg-white dark:bg-gray-800">
                        <input
                          type="text"
                          value={student.pr}
                          onChange={(e) =>
                            handleInputChange(index, "pr", e.target.value)
                          }
                          className="w-12 h-8 text-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500"
                        />
                      </td>
                      <td className="px-4 py-2 sticky left-[480px] z-20 bg-white dark:bg-gray-800">
                        {student.total}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="5" className="px-4 py-4">
                      <div className="flex justify-end">
                        <button
                          onClick={handleSaveMarks}
                          disabled={loading}
                          className="w-20 bg-blue-500 hover:bg-blue-600 text-white text-center py-2 px-4 rounded-lg disabled:opacity-50"
                        >
                          {loading ? "Saving..." : "Save"}
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
