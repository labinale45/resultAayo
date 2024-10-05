"use client";

import { useState } from "react";
import Gradesheet from "./Gradesheet";

const Ledgertable = () => {
  const [year, setYear] = useState("");
  const [className, setClassName] = useState("");
  const [examType, setExamType] = useState("");
  const [showGradesheet, setShowGradesheet] = useState(false);
  const [students, setStudents] = useState([
    {
      rollNo: 1,
      name: "Aasha Shrestha",
      mathTheory: "",
      mathPractical: "",
      mathTotal: "",
      nepaliTheory: "",
      nepaliPractical: "",
      nepaliTotal: "",
      total: "",
      gpa: "",
    },
    {
      rollNo: 2,
      name: "Supriya Shrestha",
      mathTheory: "",
      mathPractical: "",
      mathTotal: "",
      nepaliTheory: "",
      nepaliPractical: "",
      nepaliTotal: "",
      total: "",
      gpa: "",
    },
  ]);

  const handleInputChange = (index, field, value) => {
    const updatedStudents = students.map((student, i) => {
      if (i === index) {
        const updatedStudent = { ...student, [field]: value };
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

  const handlePublishResult = () => {
    alert("Result Published!");
  };

  const handleGenerateGradesheet = () => {
    setShowGradesheet(true);
  };

  const isFormComplete = year && className && examType;

  return (
    <div className="relative mt-7">
      <div className="flex justify-start ml-60 items-center mb-4">
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 mr-3"
        >
          <option value="">Select Year</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
        </select>
        <select
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 mr-3"
        >
          <option value="">Select Class</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
        </select>
        <select
          value={examType}
          onChange={(e) => setExamType(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 mr-3"
        >
          <option value="">Select Exam Type</option>
          <option value="Midterm">Midterm</option>
          <option value="Final">Final</option>
          <option value="Unit Test">Unit Test</option>
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
};

export default Ledgertable;
