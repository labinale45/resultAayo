"use client";
import { useState } from "react";

const TLedger = () => {
  const [year, setYear] = useState("");
  const [className, setClassName] = useState("");
  const [examType, setExamType] = useState("");
  const [students, setStudents] = useState([
    {
      rollNo: 1,
      name: "John Doe",
      mathTheory: 0,
      mathPractical: 0,
      mathTotal: 0,
      nepaliTheory: 0,
      nepaliPractical: 0,
      nepaliTotal: 0,
      total: 0,
      gpa: 0,
    },
    {
      rollNo: 2,
      name: "Jane Smith",
      mathTheory: 0,
      mathPractical: 0,
      mathTotal: 0,
      nepaliTheory: 0,
      nepaliPractical: 0,
      nepaliTotal: 0,
      total: 0,
      gpa: 0,
    },
  ]);

  const handlePrint = () => {
    const printContent = document.getElementById("ledger").innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = (
      <html>
        <head>
          <style>${printStyles}</style>
        </head>
        <body>${printContent}</body>
      </html>
    );
    window.print();
    document.body.innerHTML = originalContent;
  };

  const printStyles = `
    @media print {
      body * {
        visibility: hidden;
      }
      #ledger, #ledger * {
        visibility: visible;
      }
      #ledger {
        position: absolute;
        left: 0;
        top: 0;
      }
    }
  `;

  const handleGenerateGradesheet = () => {
    alert("Gradesheet Generated!");
  };

  const isFormComplete = year && className && examType;

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex justify-center space-x-4">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Year</label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="" disabled>
              Select Year
            </option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Class</label>
          <select
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="" disabled>
              Select Class
            </option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Exam Type</label>
          <select
            value={examType}
            onChange={(e) => setExamType(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="" disabled>
              Select Exam Type
            </option>
            <option value="Midterm">Midterm</option>
            <option value="Final">Final</option>
            <option value="Unit Test">Unit Test</option>
          </select>
        </div>
      </div>

      {isFormComplete && (
        <div id="ledger" className="border border-gray-300 rounded-lg p-4">
          <div className="mb-8 text-center">
            <h2 className="text-4xl font-semibold">XYZ School</h2>
            <p>123 Street Name, City</p>
            <p>Estd: 1990</p>
            <p className="text-3xl">
              {examType}-{year}
            </p>
            <p className="text-left text-2xl">Class: {className}</p>
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
              {students.map((student) => (
                <tr key={student.rollNo}>
                  <td className="border border-gray-300 p-2 text-center">
                    {student.rollNo}
                  </td>
                  <td className="border border-gray-300 p-2">{student.name}</td>
                  <td className="border border-gray-300 p-2 text-center">
                    {student.mathTheory}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {student.mathPractical}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {student.mathTotal}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {student.nepaliTheory}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {student.nepaliPractical}
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

          <div className="mt-4 flex justify-between">
            <button
              onClick={handlePrint}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Print Ledger
            </button>
            <button
              onClick={handleGenerateGradesheet}
              className="bg-yellow-500 text-white px-4 py-2 rounded-md"
            >
              Generate Gradesheet
            </button>
          </div>
        </div>
      )}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #ledger,
          #ledger * {
            visibility: visible;
          }
          #ledger {
            position: absolute;
            left: 0;
            top: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default TLedger;
