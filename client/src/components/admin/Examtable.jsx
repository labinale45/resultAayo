"use client";

import React, { useState, useEffect } from "react";
import Createexam from "@/components/admin/Createexam";

export default function Examtable() {
  const [showCreateExam, setShowCreateExam] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedExamType, setSelectedExamType] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [years, setYears] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [state, setState] = useState("exams");
  const [subjects, setSubjects] = useState([]);
  const [examTypes, setExamTypes] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [marksData, setMarksData] = useState([]);
  const [passMarks,setPassMarks] =useState([]);
  const [fullMarks, setFullMarks] = useState([]);
  const [FM,setFM] = useState([]);
  const [PM,setPM] = useState([]);

  useEffect(() => {
    YearSelect();
    fetchExamTypes();
    fetchClasses();
    if (selectedYear && selectedClass) {
      fetchMarksData();
    }
  }, [selectedYear, selectedExamType, selectedClass]);

  useEffect(() => {
    if (subjects.length > 0) {
      setSelectedSubjects(subjects.map(subject => subject.subject_name));
    }
  }, [subjects]);

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

  const fetchMarksData = async () => {
    try {
      console.log('Fetching marks data with parameters:', {
        year: selectedYear,
        examType: selectedExamType,
        class: selectedClass
      });

      const response = await fetch(
        `http://localhost:4000/api/auth/marks?year=${selectedYear}&examType=${selectedExamType}&classes=${selectedClass}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to fetch marks data:', errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched marks data:', data);

      if (Array.isArray(data) && data.length > 0) {
        setMarksData(data);
      } else {
        console.warn('No marks data found, fetching subjects instead.');
        const subjectsResponse = await fetch(`http://localhost:4000/api/auth/subjects?classId=${selectedClass}&year=${selectedYear}`);
        const subjectsData = await subjectsResponse.json();
        setSubjects(subjectsData);
        console.log(subjectsData);
      }
    } catch (error) {
      console.error('Error in fetchMarksData:', error.message);
      setMarksData([]);
      setSubjects([]);
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

  const showTable = selectedYear && selectedExamType && selectedClass;

  const handleSaveMarks = async () => {
    try {
      console.log("saveData",selectedSubjects);
        const response = await fetch('http://localhost:4000/api/auth/enter-marks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                year: selectedYear,
                examType: selectedExamType,
                classes: selectedClass,
                subjects: subjects,// Assuming marksData is structured correctly
                fullMarks: fullMarks,
                passMarks: passMarks
            }),
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message);
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Error saving marks:', error);
        alert('Failed to save marks. Please try again.');
    }
  };

  const toggleSubjectSelection = (subjectName) => {
    setSelectedSubjects((prevSelected) => {
      if (prevSelected.includes(subjectName)) {
        // If already selected, remove it
        return prevSelected.filter((name) => name !== subjectName);
      } else {
        // Otherwise, add it to the selection
        return [...prevSelected, subjectName];
      }
    });
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
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
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

        <div className="flex space-x-2 absolute right-4">
          <button
            onClick={() => setShowCreateExam(true)}
            className=" bg-[#7ba0e4] dark:bg-[#8AA4D6] hover:bg-[#4c94ec] dark:hover:bg-[#253553] hover:text-white  text-center py-2 px-4 rounded text-xs"
          >
            +Create Exam
          </button>
          <button className="  bg-[#7ba0e4] dark:bg-[#8AA4D6] hover:bg-[#4c94ec] dark:hover:bg-[#253553] hover:text-white  text-center py-2 px-4 rounded text-xs ">
            Edit
          </button>
          <button className="bg-[#7ba0e4] dark:bg-[#8AA4D6] hover:bg-[#4c94ec] dark:hover:bg-[#253553] hover:text-white  text-center py-2 px-4 rounded text-xs ">
            Delete
          </button>
        </div>
      </div>

      {showCreateExam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[101]">
          <Createexam onClose={() => setShowCreateExam(false)} />
        </div>
      )}

      {showTable && (
        <div className="overflow-x-auto relative">
          <div className="max-h-[450px] overflow-y-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400 sticky top-0 z-30">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Subject
                  </th>
                  <th scope="col" className="px-6 py-3 ">
                    Full Marks
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Pass Marks
                  </th>
                </tr>
              </thead>
              <tbody>
              {Array.isArray(marksData) && marksData.length > 0 ? (
    marksData.map((mark, index) => (
      <tr
        key={index}
        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
      >
         <td
          className="px-6 py-4 sticky left-0 z-20 bg-white dark:bg-gray-800"
          onClick={() => toggleSubjectSelection(mark.subjects.subject_name)} // Updated to match subjects
          style={{
            backgroundColor: selectedSubjects.includes(mark.subjects.subject_name) ? '#d1e7dd' : 'transparent',
          }}
        >
          {mark.subjects.subject_name} {/* Assuming marksData contains subject_name */}
        </td>
        <td className="px-6 py-4 sticky left-[120px] z-20 bg-white dark:bg-gray-800">
          <input
            type="text"
            value={mark.FM || ''} // Updated to use fullMarks from marksData
            onChange={(e) => {
              const updatedFullMarks = [...FM]; // Create a copy of the current fullMarks array
              updatedFullMarks[index] = e.target.value; // Update the specific index
              setFM(updatedFullMarks); // Set the new state
            }}
            className="w-12 h-8 text-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500"
          />
        </td>
        <td className="px-6 py-4 sticky left-[240px] z-20 bg-white dark:bg-gray-800">
          <input
            type="text"
            value={mark.PM || ''} // Updated to use passMarks from marksData
            onChange={(e) => {
              const updatedPassMarks = [...PM]; // Create a copy of the current passMarks array
              updatedPassMarks[index] = e.target.value; // Update the specific index
              setPM(updatedPassMarks); // Set the new state
            }}
            className="w-12 h-8 text-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500"
          />
        </td>
      </tr>
    ))
  ) : Array.isArray(subjects) && subjects.length > 0 ? (
    subjects.map((subject, index) => (
      <tr
        key={index}
        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
      >
        <td
          className="px-6 py-4 sticky left-0 z-20 bg-white dark:bg-gray-800"
          onClick={() => toggleSubjectSelection(subject.subject_name)} // Unchanged
          style={{
            backgroundColor: selectedSubjects.includes(subject.subject_name) ? '#d1e7dd' : 'transparent',
          }}
        >
          {subject.subject_name} {/* Display subject name */}
        </td>
        <td className="px-6 py-4 sticky left-[120px] z-20 bg-white dark:bg-gray-800">
          <input
            type="text"
            value={fullMarks[index] || ''} // Individual full marks for each subject
            onChange={(e) => {
              const updatedFullMarks = [...fullMarks]; // Create a copy of the current fullMarks array
              updatedFullMarks[index] = e.target.value; // Update the specific index
              setFullMarks(updatedFullMarks); // Set the new state
            }}
            className="w-12 h-8 text-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500"
          />
        </td>
        <td className="px-6 py-4 sticky left-[240px] z-20 bg-white dark:bg-gray-800">
          <input
            type="text"
            value={passMarks[index] || ''} // Individual pass marks for each subject
            onChange={(e) => {
              const updatedPassMarks = [...passMarks]; // Create a copy of the current passMarks array
              updatedPassMarks[index] = e.target.value; // Update the specific index
              setPassMarks(updatedPassMarks); // Set the new state
            }}
            className="w-12 h-8 text-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500"
          />
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
        No data available
      </td>
    </tr>
  )}
  <tr>
    <td colSpan="3" className="px-6 py-4">
      <div className="flex justify-end">
        <button onClick={handleSaveMarks} className=" w-20 bg-[#7ba0e4] dark:bg-[#8AA4D6] hover:bg-[#4c94ec]  text-black dark:hover:bg-[#253553] hover:text-white  text-center py-2 px-4 rounded text-xs ">
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
