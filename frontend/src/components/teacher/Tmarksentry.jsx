"use client";

import React, { useState } from "react";

export default function Tmarksentry() {
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedExamType, setSelectedExamType] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [students, setStudents] = useState([
    { rollNo: "1", name: "Supriya Shrestha", th: "", pr: "", total: "" },
    { rollNo: "2", name: "Aasha Shrestha", th: "", pr: "", total: "" },
    { rollNo: "3", name: "Rabin Ale", th: "", pr: "", total: "" },
    { rollNo: "4", name: "YUbraj Dauliya", th: "", pr: "", total: "" },
    { rollNo: "5", name: "Byanjana Wagle", th: "", pr: "", total: "" },
    { rollNo: "6", name: "Rabin Ale", th: "", pr: "", total: "" },
    { rollNo: "7", name: "YUbraj Dauliya", th: "", pr: "", total: "" },
    { rollNo: "8", name: "Byanjana Wagle", th: "", pr: "", total: "" },
  ]);

  const handleInputChange = (index, field, value) => {
    const updatedStudents = [...students];
    updatedStudents[index][field] = value;

    const th = parseFloat(updatedStudents[index].th) || 0;
    const pr = parseFloat(updatedStudents[index].pr) || 0;
    updatedStudents[index].total = (th + pr).toFixed(2);

    setStudents(updatedStudents);
  };

  const showTable =
    selectedYear && selectedExamType && selectedClass && selectedSubject;

  return (
    <div className="relative mt-7">
      <div className="flex justify-center items-center mb-4">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 mr-3"
        >
          <option value="">Select Year</option>
          <option value="2080">2080</option>
          <option value="2081">2081</option>
        </select>
        <select
          value={selectedExamType}
          onChange={(e) => setSelectedExamType(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 mr-3"
        >
          <option value="">Select Exam Type</option>
          <option value="1st Term">1st Term-2081</option>
          <option value="2nd Term">2nd Term-2081</option>
        </select>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 mr-3"
        >
          <option value="">Select Class</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 mr-3"
        >
          <option value="">Select Subject</option>
          <option value="Math">Computer Science</option>
        </select>
      </div>
      {showTable && (
        <div className="overflow-x-auto relative">
          <div className="max-h-[500px] overflow-y-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0 z-30">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 sticky left-0 z-30 bg-gray-50 dark:bg-gray-700"
                  >
                    Roll No
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 sticky left-[120px] z-30 bg-gray-50 dark:bg-gray-700"
                  >
                    Full Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 sticky left-[240px] z-30 bg-gray-50 dark:bg-gray-700"
                  >
                    TH
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 sticky left-[360px] z-30 bg-gray-50 dark:bg-gray-700"
                  >
                    PR
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 sticky left-[480px] z-30 bg-gray-50 dark:bg-gray-700"
                  >
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
                    <td className="px-6 py-4 sticky left-0 z-20 bg-white dark:bg-gray-800">
                      {student.rollNo}
                    </td>
                    <td className="px-6 py-4 sticky left-[120px] z-20 bg-white dark:bg-gray-800">
                      {student.name}
                    </td>
                    <td className="px-6 py-4 sticky left-[240px] z-20 bg-white dark:bg-gray-800">
                      <input
                        type="text"
                        value={student.th}
                        onChange={(e) =>
                          handleInputChange(index, "th", e.target.value)
                        }
                        className="w-12 h-8 text-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 sticky left-[360px] z-20 bg-white dark:bg-gray-800">
                      <input
                        type="text"
                        value={student.pr}
                        onChange={(e) =>
                          handleInputChange(index, "pr", e.target.value)
                        }
                        className="w-12 h-8 text-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 sticky left-[480px] z-20 bg-white dark:bg-gray-800">
                      {student.total}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="5" className="px-6 py-4">
                    <div className="flex justify-end">
                      <button className="bg-[#8AA4D6] hover:bg-[#253553] hover:text-white text-gray-700 py-2 px-4 rounded text-xs">
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
