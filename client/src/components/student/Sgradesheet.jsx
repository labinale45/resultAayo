"use client";

import React, { useState } from "react";
import Gradesheet from "../admin/Gradesheet";

export default function Sgradesheet() {
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedExamType, setSelectedExamType] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [showGradesheet, setShowGradesheet] = useState(false);

  const handleShowGradesheet = () => {
    if (selectedYear && selectedExamType && selectedClass) {
      setShowGradesheet(true);
    }
  };

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
        <button
          onClick={handleShowGradesheet}
          className="bg-[#7ba0e4] dark:bg-[#8AA4D6] hover:bg-[#4c94ec] dark:hover:bg-[#253553] hover:text-white text-center py-2 px-4 rounded text-xs"
          disabled={!selectedYear || !selectedExamType || !selectedClass}
        >
          Show Gradesheet
        </button>
      </div>
      {showGradesheet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[101]">
          <Gradesheet onClose={() => setShowGradesheet(false)} />
        </div>
      )}
    </div>
  );
}
