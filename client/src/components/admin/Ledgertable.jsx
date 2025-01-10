"use client";

import React, { useState, useEffect, useRef } from "react";
import Gradesheet from "./Gradesheet";
import Print from "@/components/Mini Component/Print";
import adbs from "ad-bs-converter";

export default function Ledgertable() {
  const [showGradesheet, setShowGradesheet] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedExamType, setSelectedExamType] = useState("");
  const [years, setYears] = useState([]);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [state, setState] = useState("marksheets");
  const [examTypes, setExamTypes] = useState([]);
  const [classes, setClasses] = useState([]);
  const [schoolName, setSchoolName] = useState("");
  const [schoolAddress, setSchoolAddress] = useState("");
  const [establishmentYear, setEstablishmentYear] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
  };

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/api/auth/classes/${selectedYear}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch classes");
        const data = await response.json();
        setClasses(data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };
    const fetchLedgerData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:4000/api/auth/records/${selectedYear}?status=${state}&class=${selectedClass}&examType=${selectedExamType}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        console.log("marksheets Data:", data);
        // Group students by roll number and aggregate marks
        const groupedStudents = groupStudentsByRollNo(data);
        console.log("Grouped Students:", groupedStudents);
        setStudents(groupedStudents); // Update the state with grouped data
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    const groupStudentsByRollNo = (students) => {
      const grouped = {};

      students.forEach((student) => {
        const {
          rollNo,
          schoolName,
          schoolAddress,
          estdYear,
          students: studentName,
          subjects,
          TH,
          PR,
        } = student;

        // Ensure we have a student record for this rollNo
        if (!grouped[rollNo]) {
          grouped[rollNo] = {
            rollNo: rollNo,
            name: studentName,
            schoolName: schoolName,
            schoolAddress: schoolAddress,
            estdYear: estdYear,
            subjects: {}, // Store subjects as keys
            totalMarks: 0,
            totalMaxMarks: 0,
            totalGPA: 0,
          };
        }

        // Add the marks for the specific subject
        if (!grouped[rollNo].subjects[subjects]) {
          grouped[rollNo].subjects[subjects] = {
            theory: 0,
            practical: 0,
            total: 0,
          };
        }

        // Ensure missing marks are handled as 0
        const theoryMarks = TH || 0; // Default to 0 if missing
        const practicalMarks = PR || 0; // Default to 0 if missing

        // Aggregate marks for this subject
        grouped[rollNo].subjects[subjects].theory += theoryMarks;
        grouped[rollNo].subjects[subjects].practical += practicalMarks;
        grouped[rollNo].subjects[subjects].total += theoryMarks + practicalMarks;

        // Update total marks for the student
        grouped[rollNo].totalMarks += theoryMarks + practicalMarks;

        // Update the total maximum marks for this student (100 for theory and 100 for practical per subject)
        grouped[rollNo].totalMaxMarks += 100; // Each subject has 100 total marks
      });

      // After grouping, calculate GPA (if needed) and return as an array
      Object.values(grouped).forEach((studentData) => {
        // Check if totalMaxMarks is greater than 0 to avoid division by zero
        if (studentData.totalMaxMarks > 0) {
          // Calculate percentage based GPA (assuming max GPA is 4)
          const percentage =
            (studentData.totalMarks / studentData.totalMaxMarks) * 100;

          // Calculate GPA using a scale of 4.0
          const maxGPA = 4.0;
          studentData.totalGPA = ((percentage / 100) * maxGPA).toFixed(2); // GPA out of 4.0
        } else {
          studentData.totalGPA = 0; // Set GPA to 0 if totalMaxMarks is 0
        }
      });

      return Object.values(grouped); // Return grouped students as an array
    };

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
        setError(null);
      } catch (error) {
        console.error("Failed to fetch years:", error.message);
        setError("Failed to fetch years. Please try again later.");
        setYears([]);
      }
    };
    YearSelect();
    if (selectedYear) {
      fetchClasses();
    } else {
      setClasses([]);
    }
    if (selectedYear && selectedClass && selectedExamType) {
      fetchLedgerData();
    }
  }, [state, selectedYear, selectedClass, selectedExamType]);

  useEffect(() => {
    const fetchExamTypes = async () => {
      try {
        // Correct the URL structure to use a query parameter or path parameter
        const response = await fetch(
          `http://localhost:4000/api/auth/exam-types?year=${selectedYear}`
        );

        if (!response.ok) throw new Error("Failed to fetch exam types");

        const examData = await response.json();
        setExamTypes(examData);
      } catch (error) {
        console.error("Error fetching exam types:", error);
      }
    };
    if (selectedYear && selectedClass) {
      fetchExamTypes();
    } else {
      setExamTypes([]);
    }
  }, [selectedYear, selectedClass]);

  const handleInputChange = (studentIndex, subject, field, value) => {
    const updatedStudents = students.map((student, index) => {
      if (index === studentIndex) {
        const updatedStudent = { ...student };

        // Ensure subjects exist in the student object
        updatedStudent.subjects = updatedStudent.subjects || {};

        // Ensure the selected subject exists with default values
        const subjectData = updatedStudent.subjects[subject] || {
          theory: 0,
          practical: 0,
          total: 0,
        };

        // Update the selected field (theory or practical)
        const updatedValue = value ? parseFloat(value) : 0; // Use a simple check for invalid input

        if (field === "theory") {
          // Ensure total theory and practical don't exceed 100
          if (updatedValue + subjectData.practical <= 100) {
            subjectData.theory = updatedValue;
          } else {
            // Prevent updating if the total exceeds 100
            alert(
              "The combined total of theory and practical cannot exceed 100!"
            );
            return student; // Don't update the student
          }
        }

        if (field === "practical") {
          // Ensure total theory and practical don't exceed 100
          if (updatedValue + subjectData.theory <= 100) {
            subjectData.practical = updatedValue;
          } else {
            // Prevent updating if the total exceeds 100
            alert(
              "The combined total of theory and practical cannot exceed 100!"
            );
            return student; // Don't update the student
          }
        }

        // Recalculate the total for the subject (theory + practical)
        subjectData.total = subjectData.theory + subjectData.practical;

        updatedStudent.subjects[subject] = subjectData;

        // Recalculate total marks for the student
        const totalMarks = Object.values(updatedStudent.subjects).reduce(
          (sum, subj) => sum + (subj.theory || 0) + (subj.practical || 0),
          0
        );

        // GPA calculation
        const gpa = (
          totalMarks /
          (Object.keys(updatedStudent.subjects).length * 2)
        ).toFixed(2);

        return {
          ...updatedStudent,
          totalMarks,
          gpa: parseFloat(gpa), // Ensure GPA is a float
        };
      }

      return student; // Return unchanged student
    });

    setStudents(updatedStudents); // Update state with new data
  };

  const gradesheetRef = useRef(null);

  const handlePrint = () => {
    const printWindow = window.open("", "", "width=800,height=600");

    // Get all unique subjects from the first student
    const subjects =
      students.length > 0 ? Object.keys(students[0].subjects) : [];

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Ledger Table - ${selectedClass} ${selectedExamType} ${selectedYear}</title>
        <style>
          @page { size: landscape; }
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            margin: 0;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .school-name {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .school-info {
            font-size: 14px;
            margin-bottom: 5px;
          }
          .exam-info {
            font-size: 18px;
            margin: 15px 0;
          }
          .class-info {
            text-align: left;
            margin: 15px 0;
            font-weight: bold;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
          }
          th, td {
            border: 1px solid black;
            padding: 6px;
            text-align: center;
          }
          .subject-column {
            min-width: 120px;
          }
          .marks-container {
            display: flex;
            justify-content: space-between;
          }
          .marks-cell {
            width: 33%;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="school-name">${schoolName || "School Name"}</div>
          <div class="school-info">${schoolAddress || "School Address"}</div>
          <div class="school-info">Estd: ${establishmentYear || ""}</div>
          <div class="exam-info">${selectedExamType} - ${selectedYear}</div>
          <div class="class-info">Class: ${selectedClass}</div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th rowspan="2">Roll No</th>
              <th rowspan="2">Name</th>
              ${subjects
                .map(
                  (subject) => `
                <th colspan="3" class="subject-column">${subject}</th>
              `
                )
                .join("")}
              <th rowspan="2">Total</th>
              <th rowspan="2">GPA</th>
            </tr>
            <tr>
              ${subjects
                .map(
                  () => `
                <th>TH</th>
                <th>PR</th>
                <th>Total</th>
              `
                )
                .join("")}
            </tr>
          </thead>
          <tbody>
            ${students
              .map(
                (student) => `
              <tr>
                <td>${student.rollNo}</td>
                <td>${student.name}</td>
                ${subjects
                  .map((subject) => {
                    const subjectData = student.subjects[subject] || {
                      theory: 0,
                      practical: 0,
                      total: 0,
                    };
                    return `
                    <td>${subjectData.theory || 0}</td>
                    <td>${subjectData.practical || 0}</td>
                    <td>${subjectData.total || 0}</td>
                  `;
                  })
                  .join("")}
                <td>${student.totalMarks || 0}</td>
                <td>${student.totalGPA || 0}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();

    // Wait for content to load before printing
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const handlePublishResult = async () => {
    try {
      console.log("Students:", students);
      // Validate if we have all required data
      if (
        !selectedYear ||
        !selectedClass ||
        !selectedExamType ||
        !students.length
      ) {
        alert(
          "Please ensure all fields are filled and students data is available"
        );
        return;
      }

      const response = await fetch(
        "http://localhost:4000/api/auth/publish-result",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            year: selectedYear,
            class: selectedClass,
            examType: selectedExamType,
            schoolName: schoolName,
            schoolAddress: schoolAddress,
            establishmentYear: establishmentYear,
            students,
            isPublished: true,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to publish result");
      }
      alert("Result Published Successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to publish result: " + error.message);
    }
  };

  const handleGenerateGradesheet = () => {
    setShowGradesheet(true);
    console.log("Gradesheet Data:", gradesheetData);
  };

  // Update the function to pass the required props
  const gradesheetData = {
    schoolName: schoolName,
    schoolAddress: schoolAddress,
    establishmentYear: establishmentYear,
    studentsData: students.map((student) => ({
      students: student.name,
      dateOfBirthAD: student.dateOfBirth,
      dateOfBirth: student.dateOfBirth
        ? adbs.ad2bs(student.dateOfBirth).en.date
        : "",
      rollNo: student.rollNo,
      examType: selectedExamType,
      year: selectedYear,
      subjects: Object.keys(student.subjects).map((subject, index) => ({
        name: subject,
        th: {
          creditHour: 3, // Add default credit hour for theory
          gpa: student.totalGPA,
          grade:
            student.totalGPA >= 3.5 ? "A" : student.totalGPA >= 2.5 ? "B" : "C",
          marks: student.subjects[subject].theory,
        },
        pr: {
          creditHour: 1, // Add default credit hour for practical
          gpa: student.totalGPA,
          grade:
            student.totalGPA >= 3.5 ? "A" : student.totalGPA >= 2.5 ? "B" : "C",
          marks: student.subjects[subject].practical,
        },
        finalGrade:
          student.totalGPA >= 3.5 ? "A" : student.totalGPA >= 2.5 ? "B" : "C",
        remarks: "Good",
      })),
    })),
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
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <select
          value={selectedClass}
          onChange={(e) => {
            setSelectedClass(e.target.value);
            setStudents([]);
          }}
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
          onChange={(e) => {setSelectedExamType(e.target.value);
            setStudents([]);
          }}
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
          {/* <Print targetRef={gradesheetRef} /> */}
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
        <div
          ref={gradesheetRef}
          className="border border-gray-300 rounded-lg p-4 min-h-fit w-full overflow-auto"
        >
          <div className="mb-8 flex flex-col items-center justify-center w-full">
            <h2 className="text-4xl font-semibold">
              {students[0]?.schoolName || "School Name"}
            </h2>
            <p>{students[0]?.schoolAddress || "School Address"}</p>
            <p>Estd: {students[0]?.estdYear || "Year Established"}</p>
            <p className="text-3xl text-center">
              {selectedExamType}-{selectedYear}
            </p>
            <div className="w-full px-4">
              <p className="text-2xl text-left">Class: {selectedClass}</p>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
          </div>

          {isEditing && (
            <div className="mb-8 text-center">
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="School Name"
                className="border p-2 rounded mr-2"
              />
              <input
                type="text"
                value={schoolAddress}
                onChange={(e) => setSchoolAddress(e.target.value)}
                placeholder="School Address"
                className="border p-2 rounded mr-2"
              />
              <input
                type="text"
                value={establishmentYear}
                onChange={(e) => setEstablishmentYear(e.target.value)}
                placeholder="Establishment Year"
                className="border p-2 rounded mr-2"
              />
              <button
                onClick={handleSave}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-red-500 text-white px-4 py-2 rounded ml-2"
              >
                Cancel
              </button>
            </div>
          )}
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2" rowSpan="2">
                  Roll No
                </th>
                <th className="border border-gray-300 p-2" rowSpan="2">
                  Name
                </th>
                {/* Render subject headers dynamically */}
                {students.length > 0 &&
                  Object.keys(students[0].subjects).map(
                    (subject, subjectIndex) => (
                      <th
                        key={subjectIndex}
                        className="border border-gray-300  border-r-slate-400  p-2"
                      >
                        {subject}
                        <hr className="border border-slate-200"></hr>
                        <div className="flex justify-between">
                          <span className="text-gray-700 px-2">Theory</span>
                          <span className="text-gray-700 px-2">Practical</span>
                          <span className="text-gray-700 px-2">Total</span>
                        </div>
                      </th>
                    )
                  )}

                <th className="border border-gray-300 p-2" rowSpan="2">
                  Total Marks
                </th>
                <th className="border border-gray-300 p-2" rowSpan="2">
                  GPA
                </th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center text-red-600">
                    No students found.
                  </td>
                </tr>
              ) : (
                students.map((student, studentIndex) => (
                  <tr key={student.rollNo}>
                    <td className="border border-gray-300 p-2">
                      {student.rollNo}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {student.name}
                    </td>

                    {Object.keys(students[0].subjects).map(
                      (subject, subjectIndex) => {
                        const marks = student.subjects[subject] || {
                          theory: 0,
                          practical: 0,
                          total: 0,
                        };

                        return (
                          <td
                            key={subjectIndex}
                            className="border border-gray-300 p-2"
                          >
                            <div className="flex justify-between">
                              {/* Theory Marks */}
                              <input
                                type="number"
                                value={marks.theory || 0}
                                onChange={(e) =>
                                  handleInputChange(
                                    studentIndex,
                                    subject,
                                    "theory",
                                    e.target.value
                                  )
                                }
                                className="w-16 text-center"
                              />

                              {/* Practical Marks */}
                              <input
                                type="number"
                                value={marks.practical}
                                onChange={(e) =>
                                  handleInputChange(
                                    studentIndex,
                                    subject,
                                    "practical",
                                    e.target.value
                                  )
                                }
                                className="w-16 text-center"
                              />

                              {/* Total Marks */}
                              <input
                                type="number"
                                value={marks.total}
                                readOnly
                                className="w-16 text-center font-semibold"
                              />
                            </div>
                          </td>
                        );
                      }
                    )}

                    <td className="border border-gray-300 p-2 text-center">
                      {student.totalMarks}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      {student.totalGPA}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {showGradesheet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[101]">
          <Gradesheet
            onClose={() => setShowGradesheet(false)}
            {...gradesheetData} // Pass the data as props
          />
        </div>
      )}
    </div>
  );
}
