"use client";

import React, { useState, useEffect } from "react";
import Gradesheet from "./Gradesheet";

export default function Ledgertable() {
  const [showGradesheet, setShowGradesheet] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedExamType, setSelectedExamType] = useState("");
  const [years, setYears] = useState([]);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [state, setState] = useState("ledgers");
  const [examTypes, setExamTypes] = useState([]);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    YearSelect();
    fetchExamTypes();
    fetchClasses();
    if (selectedYear && selectedClass && selectedExamType) {
      fetchLedgerData();
    }
  }, [selectedYear, selectedClass, selectedExamType]);

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

  const fetchLedgerData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:4000/api/auth/records/${selectedYear}?status=${state}&class=${selectedClass}&examType=${selectedExamType}`,
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
    const updatedStudents = students.map((student, i) => {
      if (i === index) {
        const updatedStudent = { ...student, [field]: value };
        // Calculate totals and GPA
        const mathTotal =
          parseFloat(updatedStudent.mathTheory || 0) +
          parseFloat(updatedStudent.mathPractical || 0);
        const nepaliTotal =
          parseFloat(updatedStudent.nepaliTheory || 0) +
          parseFloat(updatedStudent.nepaliPractical || 0);
        const total = mathTotal + nepaliTotal;
        const gpa = (total / 4).toFixed(2);
        return { ...updatedStudent, mathTotal, nepaliTotal, total, gpa };
      }
      return student;
    });
    setStudents(updatedStudents);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write("<html><head><title>Print Ledger</title>");
    printWindow.document.write("<style>");
    printWindow.document.write(`
      body { font-family: Arial, sans-serif; }
      table { border-collapse: collapse; width: 100%; }
      th, td { border: 1px solid black; padding: 8px; text-align: left; }
      th { background-color: #f2f2f2; }
    `);
    printWindow.document.write("</style></head><body>");
    printWindow.document.write(document.getElementById("ledger").innerHTML);
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  };

  const handlePublishResult = async () => {
    try {
      // Validate if we have all required data
      if (!selectedYear || !selectedClass || !selectedExamType || !students.length) {
        alert('Please ensure all fields are filled and students data is available');
        return;
      }

      const response = await fetch('http://localhost:4000/api/auth/publish-result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          year: selectedYear,
          class: selectedClass,
          examType: selectedExamType,
          students: students,
          isPublished: true
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to publish result');
      }

      alert('Result Published Successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to publish result: ' + error.message);
    }
  };

  const handleGenerateGradesheet = () => {
    setShowGradesheet(true);
  };

  const isFormComplete = selectedYear && selectedClass && selectedExamType;

  return (
    <div className="relative mt-7">
      <div className="flex justify-start ml-60 items-center mb-4">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 mr-3"
        >
          <option value="">Select Year</option>
          {years.map((year) => (
            <option key={year} value={year}>{year}</option>
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

        <div className="flex space-x-2 absolute right-4">
          <button
            onClick={handlePrint}
            className="bg-[#7ba0e4] dark:bg-[#8AA4D6] hover:bg-[#4c94ec] dark:hover:bg-[#253553] hover:text-white  text-center py-2 px-4 rounded text-xs"
          >
            Print Ledger
          </button>
          <button
            onClick={handlePublishResult}
            className="bg-[#7ba0e4] dark:bg-[#8AA4D6] hover:bg-[#4c94ec] dark:hover:bg-[#253553] hover:text-white  text-center py-2 px-4 rounded text-xs"
          >
            Publish Result
          </button>
          <button
            onClick={handleGenerateGradesheet}
            className=" bg-[#7ba0e4] dark:bg-[#8AA4D6] hover:bg-[#4c94ec] dark:hover:bg-[#253553] hover:text-white  text-center py-2 px-4 rounded text-xs"
          >
            Generate Gradesheet
          </button>
        </div>
      </div>

      {isFormComplete && (
        <div id="ledger" className="border border-gray-300 rounded-lg p-4 ">
          <div className="mb-8 text-center">
            <h2 className="text-4xl font-semibold">XYZ School</h2>
            <p>123 Street Name, City</p>
            <p>Estd: 1990</p>
            <p className="text-3xl">
              {selectedExamType}-{selectedYear}
            </p>
            <p className="text-left text-2xl">Class: {selectedClass}</p>
          </div>

          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2" rowSpan="2">
                  Roll No
                </th>
                <th className="border border-gray-300 p-2" rowSpan="2">
                  Name
                </th>
                <th className="border border-gray-300 p-2" colSpan="3">
                  Math
                </th>
                <th className="border border-gray-300 p-2" colSpan="3">
                  Nepali
                </th>
                <th className="border border-gray-300 p-2" rowSpan="2">
                  Total Marks
                </th>
                <th className="border border-gray-300 p-2" rowSpan="2">
                  GPA
                </th>
              </tr>
              <tr>
                <th className="border border-gray-300 p-2">Theory</th>
                <th className="border border-gray-300 p-2">Practical</th>
                <th className="border border-gray-300 p-2">Total</th>
                <th className="border border-gray-300 p-2">Theory</th>
                <th className="border border-gray-300 p-2">Practical</th>
                <th className="border border-gray-300 p-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student.rollNo}>
                  <td className="border border-gray-300 p-2 text-center">
                    {student.rollNo}
                  </td>
                  <td className="border border-gray-300 p-2">{student.name}</td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="number"
                      value={student.mathTheory}
                      onChange={(e) =>
                        handleInputChange(index, "mathTheory", e.target.value)
                      }
                      className="w-full p-1 border border-gray-300 rounded-md"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="number"
                      value={student.mathPractical}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          "mathPractical",
                          e.target.value
                        )
                      }
                      className="w-full p-1 border border-gray-300 rounded-md"
                    />
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {student.mathTotal}
                  </td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="number"
                      value={student.nepaliTheory}
                      onChange={(e) =>
                        handleInputChange(index, "nepaliTheory", e.target.value)
                      }
                      className="w-full p-1 border border-gray-300 rounded-md"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="number"
                      value={student.nepaliPractical}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          "nepaliPractical",
                          e.target.value
                        )
                      }
                      className="w-full p-1 border border-gray-300 rounded-md"
                    />
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {student.nepaliTotal}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {student.total}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {student.gpa}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showGradesheet && (
        <div className="fixed inset-0 bg-black  bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[101]">
          <Gradesheet onClose={() => setShowGradesheet(false)} />
        </div>
      )}
    </div>
  );
}
