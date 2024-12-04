"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const TLedger = () => {
  const [year, setYear] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedExamType, setSelectedExamType] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [state, setState] = useState("ledgers");
  const [years, setYears] = useState([]);
  const [error, setError] = useState(null);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [examTypes, setExamTypes] = useState([]);
  const [teacherId, setTeacherId] = useState(null);

  
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
    fetchYears();
    fetchClasses();
    fetchExamTypes();
    if (year && selectedClass && selectedExamType) {
      checkPublicationStatus();
    }
  }, [year, selectedClass, selectedExamType]);

  const fetchYears = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/auth/year?status=${state}`
      );
      const data = await response.json();
      setYears(data);
      if (data && data.length > 0) {
        setYear(data[0]);
      }
    } catch (error) {
      setError("Failed to fetch years");
    }
  };
  const fetchClasses = async (teacherId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/auth/teacher/${teacherId}/classes`);
      if (!response.ok) throw new Error("Failed to fetch classes");
      const classIds = await response.json();
      const classes = classIds.map(id => ({
        id: id,
        name: `${id}`
      }));
      setClasses(classes);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };
  const fetchExamTypes = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/auth/exam-types");
      if (!response.ok) throw new Error("Failed to fetch exam types");
      const data = await response.json();
      setExamTypes(data);
    } catch (error) {
      console.error("Error fetching exam types:", error);
    }
  };

  const checkPublicationStatus = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:4000/api/auth/ledger-status`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            year,
            class: selectedClass,
            examType: selectedExamType,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to check publication status");
      }

      const data = await response.json();
      console.log(data);
      setIsPublished(data.isPublished);

      if (data.isPublished) {
        const ledgerResponse = await fetch(
          `http://localhost:4000/api/auth/records/${year}?status=ledgers&class=${selectedClass}&examType=${selectedExamType}`
        );

        if (ledgerResponse.ok) {
          const ledgerData = await ledgerResponse.json();
          setStudents(ledgerData);
        }
      }
    } catch (error) {
      setError("Error checking publication status");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 flex flex-wrap justify-center gap-4"
      >
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
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
      </motion.div>

      {isLoading && (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      )}

      {error && <div className="text-red-500 text-center p-4">{error}</div>}

      {isPublished && students.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <div id="ledger" className="overflow-x-auto">
            <div className="mb-8 text-center">
              <h2 className="text-4xl font-semibold">School Name</h2>
              <p className="text-3xl mt-4">
                {examType} Examination {year}
              </p>
              <p className="text-left text-2xl">Class: {className}</p>
            </div>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Roll No
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Percentage
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Grade
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {students.map((student) => (
                  <tr key={student.rollNo}>
                    <td className="border p-2">{student.rollNo}</td>
                    <td className="border p-2">{student.name}</td>
                    <td className="border p-2">{student.total}</td>
                    <td className="border p-2">{student.percentage}%</td>
                    <td className="border p-2">{student.grade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={handlePrint}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
              >
                Print Ledger
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {!isPublished && year && selectedClass && selectedExamType && (
        <div className="text-center p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
          <p className="text-yellow-700">Results not published yet</p>
        </div>
      )}
    </div>
  );
};

export default TLedger;
