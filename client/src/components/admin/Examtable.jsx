"use client";
import React, { useState, useEffect } from "react";
import Createexam from "@/components/admin/Createexam";

const API_BASE_URL = "http://localhost:4000/api/auth";

const fetchData = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    if (!response.ok)
      throw new Error(`Select the year, exam type and class first.`);
    return await response.json();
  } catch (error) {
    console.error(`API Error: ${error.message}`);
    throw error;
  }
};

export default function Examtable() {
  const [examSettings, setExamSettings] = useState({
    year: "",
    examType: "",
    class: "",
  });
  const [showCreateExam, setShowCreateExam] = useState(false);
  const [years, setYears] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [examTypes, setExamTypes] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [marksData, setMarksData] = useState([]);
  const [marksInfo, setMarksInfo] = useState({
    fullMarks: [],
    passMarks: [],
  });

  useEffect(() => {
    const fetchYearsAndExams = async () => {
      setError(null);
      setIsLoading(true);
      try {
        const yearsData = await fetchData(`${API_BASE_URL}/year?status=exams`);
        setYears(yearsData);
        if (examSettings.year) {
          const examTypesData = await fetchData(
            `${API_BASE_URL}/exam-types?year=${examSettings.year}`
          );
          setExamTypes(examTypesData);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchYearsAndExams();
  }, [examSettings.year]);

  useEffect(() => {
    const fetchClassesAndMarks = async () => {
      setError(null);
      if (!examSettings.year) return;
      setIsLoading(true);
      try {
        const classesData = await fetchData(
          `${API_BASE_URL}/classes/${examSettings.year}`
        );
        setClasses(classesData);

        if (examSettings.class) {
          // First try to fetch existing marks
          const marksResponse = await fetchData(
            `${API_BASE_URL}/marks?year=${examSettings.year}&examType=${examSettings.examType}&classes=${examSettings.class}`
          );

          if (Array.isArray(marksResponse) && marksResponse.length > 0) {
            // If marks exist, populate the form with them
            setSubjects(marksResponse.map((mark) => mark.subjects));
            setMarksInfo({
              fullMarks: marksResponse.map((mark) => mark.FM || ""),
              passMarks: marksResponse.map((mark) => mark.PM || ""),
            });
          } else {
            // If no marks exist, fetch subjects and initialize empty marks
            const subjectsData = await fetchData(
              `${API_BASE_URL}/subjects?classId=${examSettings.class}&year=${examSettings.year}`
            );
            setSubjects(subjectsData);
            setMarksInfo({
              fullMarks: new Array(subjectsData.length).fill(""),
              passMarks: new Array(subjectsData.length).fill(""),
            });
          }
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClassesAndMarks();
  }, [examSettings.year, examSettings.examType, examSettings.class]);

  const handleSaveMarks = async () => {
    setIsLoading(true);
    try {
      // Validate inputs
      const hasEmptyMarks =
        marksInfo.fullMarks.some((mark) => !mark) ||
        marksInfo.passMarks.some((mark) => !mark);

      if (hasEmptyMarks) {
        throw new Error("Please fill all marks fields");
      }
      console.log(subjects);

      const marksPayload = {
        year: examSettings.year,
        examType: examSettings.examType,
        subjects: subjects.map((subject) => ({
          id: subject.subject_id || subject.id,
          subject_name: subject.subject_name,
        })),
        fullMarks: marksInfo.fullMarks.map((mark) => parseInt(mark)),
        passMarks: marksInfo.passMarks.map((mark) => parseInt(mark)),
      };

      console.log("Sending payload:", marksPayload);

      const response = await fetchData(`${API_BASE_URL}/setup-marks`, {
        method: "POST",
        body: JSON.stringify(marksPayload),
      });

      alert("Marks setup saved successfully!");
    } catch (error) {
      console.error("Error details:", error);
      alert(error.message || "Please check all fields are filled correctly");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSubjectSelection = (subjectName) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectName)
        ? prev.filter((name) => name !== subjectName)
        : [...prev, subjectName]
    );
  };

  return (
    <div className="relative mt-7">
      <div className="flex justify-center items-center mb-4">
        <select
          value={examSettings.year}
          onChange={(e) =>
            setExamSettings((prev) => ({ ...prev, year: e.target.value }))
          }
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
          value={examSettings.examType}
          onChange={(e) =>
            setExamSettings((prev) => ({ ...prev, examType: e.target.value }))
          }
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
          value={examSettings.class}
          onChange={(e) =>
            setExamSettings((prev) => ({ ...prev, class: e.target.value }))
          }
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
            className="bg-[#7ba0e4] dark:bg-[#8AA4D6] hover:bg-[#4c94ec] dark:hover:bg-[#253553] hover:text-white text-center py-2 px-4 rounded text-xs"
          >
            +Create Exam
          </button>
        </div>
      </div>

      {showCreateExam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[101]">
          <Createexam onClose={() => setShowCreateExam(false)} />
        </div>
      )}

      {isLoading && <div className="text-center py-4">Loading...</div>}
      {error && <div className="text-red-500 text-center py-4">{error}</div>}

      {examSettings.year &&
        examSettings.examType &&
        examSettings.class &&
        !isLoading &&
        !error && (
          <div className="overflow-x-auto relative">
            <div className="max-h-[450px] overflow-y-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400 sticky top-0 z-30">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Subject
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Full Marks
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Pass Marks
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map((subject, index) => (
                    <tr
                      key={index}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <td className="px-6 py-4 sticky left-0 z-20 bg-white dark:bg-gray-800">
                        {subject.subject_name}
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          value={marksInfo.fullMarks[index]}
                          onChange={(e) => {
                            const newFullMarks = [...marksInfo.fullMarks];
                            const value = parseInt(e.target.value, 10);

                            // Validate that Full Marks is not negative
                            if (value < 0) {
                              alert("Full Marks cannot be negative.");
                              return;
                            }
                            if (value > 100) {
                              alert(
                                "Full Marks cannot be greater than 100."
                              );
                              return;
                            }

                            newFullMarks[index] = value || ""; // Set empty if input is cleared
                            setMarksInfo((prev) => ({
                              ...prev,
                              fullMarks: newFullMarks,
                            }));
                          }}
                          className="w-20 h-8 text-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          value={marksInfo.passMarks[index]}
                          onChange={(e) => {
                            const newPassMarks = [...marksInfo.passMarks];
                            const value = parseInt(e.target.value, 10);

                            // Validate that Pass Marks is not negative
                            if (value < 0) {
                              alert("Pass Marks cannot be negative.");
                              return;
                            }

                            // Validate that Pass Marks is not greater than Full Marks
                            if (value > marksInfo.fullMarks[index]) {
                              alert(
                                "Pass Marks cannot be greater than Full Marks."
                              );
                              return;
                            }

                            newPassMarks[index] = value || ""; // Set empty if input is cleared
                            setMarksInfo((prev) => ({
                              ...prev,
                              passMarks: newPassMarks,
                            }));
                          }}
                          className="w-20 h-8 text-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500"
                        />
                      </td>
                    </tr>
                  ))}

                  <tr>
                    <td colSpan="3" className="px-6 py-4">
                      <div className="flex justify-end">
                        <button
                          onClick={handleSaveMarks}
                          disabled={isLoading}
                          className="w-20 bg-[#7ba0e4] dark:bg-[#8AA4D6] hover:bg-[#4c94ec] text-black dark:hover:bg-[#253553] hover:text-white text-center py-2 px-4 rounded text-xs disabled:opacity-50"
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
