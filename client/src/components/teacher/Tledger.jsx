"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const TLedger = () => {
  const [year, setYear] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedExamType, setSelectedExamType] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [state, setState] = useState("marksheets");
  const [years, setYears] = useState([]);
  const [error, setError] = useState(null);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [examTypes, setExamTypes] = useState([]);
  const [teacherId, setTeacherId] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);

  useEffect(() => {
    // Fetch teacherId from token
    const token = localStorage.getItem("token"); // Assuming you store the token in localStorage
    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode the token
      console.log("decotedTOken", decodedToken); // Log the decoded token for debugging
      if (decodedToken.role === "teachers") {
        setTeacherId(decodedToken.id); // Assuming the teacher ID is stored as 'id' in the token
      }
    }
  }, []);

  useEffect(() => {
    const fetchClasses = async (teacherId) => {
      try {
        const response = await fetch(
          `http://localhost:4000/api/auth/assigned-class/${teacherId}/${selectedYear}`
        );
        if (!response.ok) throw new Error("Failed to fetch classes");

        const { classes, count } = await response.json();
        console.log("Class Data:", classes);

        const formattedClasses = classes.map((item) => ({
          id: `${item.class}`,
          name: item.class,
          section: item.section,
          studentCount: item.studentCount || 0,
        }));

        console.log("tmClass:", formattedClasses);
        setClasses(formattedClasses);
      } catch (error) {
        console.error("Error fetching classes:", error);
        setClasses([]);
      }
    };
    if ((teacherId, selectedYear)) {
      fetchClasses(teacherId, selectedYear);
    } else {
      setClasses([]);
    }
  }, [teacherId, selectedYear]);

  useEffect(() => {
    const fetchYears = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/api/auth/year?status=${state}`
        );
        const data = await response.json();
        setYears(data);
        if (data && data.length > 0) {
          setYear(data[0]);
        } else {
          setYears([]);
        }
      } catch (error) {
        setError("Failed to fetch years");
      }
    };
    fetchYears();
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
    if (selectedYear) {
      fetchExamTypes();
    } else {
      setExamTypes([]);
    }
  }, [state, selectedYear]);

  useEffect(() => {
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
              year: selectedYear,
              class: selectedClass,
              examType: selectedExamType,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to check publication status");
        }

        const data = await response.json();

        console.log("Full ledger data:", data);
        console.log("isPublished:", data.isPublished);
        setIsPublished(data.isPublished);

        if (data.isPublished) {
          console.log("Result is published");
          // Fetch and display student records
          const ledgerResponse = await fetch(
            `http://localhost:4000/api/auth/records/${selectedYear}?status=${state}&class=${selectedClass}&examType=${selectedExamType}`
          );

          if (ledgerResponse.ok) {
            const ledgerData = await ledgerResponse.json();
            console.log("Student records:", ledgerData);
            // Group students by roll number and aggregate marks
            const groupedStudents = groupStudentsByRollNo(ledgerData);
            console.log("Grouped Students:", groupedStudents);
            setStudents(groupedStudents); // Update the state with grouped data
          }
        }
      } catch (error) {
        setIsPublished(false);
      } finally {
        setIsLoading(false);
      }
    };
    if (year && selectedClass && selectedExamType) {
      checkPublicationStatus();
    }
  }, [year, selectedYear, state, selectedClass, selectedExamType]);

  // Helper function to group students by roll number and aggregate marks by subject
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
          subjects: {}, // Store subjects as keys
          totalMarks: 0,
          totalGPA: 0,
          schoolName: schoolName,
          schoolAddress: schoolAddress,
          estdYear: estdYear,
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
    });

    // After grouping, calculate GPA (if needed) and return as an array
    Object.values(grouped).forEach((studentData) => {
      studentData.totalGPA = (studentData.totalMarks / 100).toFixed(2); // You can modify this logic based on your GPA calculation rules
    });

    return Object.values(grouped); // Return grouped students as an array
  };

  const handlePrint = () => {
    const ledgerElement = document.getElementById("ledger");
    if (!ledgerElement) {
      console.error("Ledger element not found");
      return;
    }

    // Open a new window for printing
    const printWindow = window.open("", "_blank");

    // Add necessary styles
    const styles = `
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: center;
        }
        th {
          background-color: #f4f4f4;
          font-weight: bold;
        }
        .text-center {
          text-align: center;
        }
        .text-left {
          text-align: left;
        }
        .flex {
  display: flex;
  justify-content: space-between;
  padding-left: 4px;
  padding-right: 4px;
}
        .marks-container > div {
          flex: 1;
          text-align: center;
        }
      </style>
    `;

    // Write the ledger content to the new window
    printWindow.document.write(`
      <html>
        <head>
          <title>Ledger Print</title>
          ${styles}
        </head>
        <body>
          ${ledgerElement.outerHTML}
        </body>
      </html>
    `);

    // Close the document to apply styles
    printWindow.document.close();

    // Wait for content to load, then print and close the window
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  };

  const showTable =
    selectedYear && selectedExamType && selectedClass && isPublished;

  return (
    <div className="px-9 py-8 container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 flex flex-wrap justify-center gap-4"
      >
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

      {showTable && !isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <div id="ledger" className="overflow-x-auto">
            <div className="mb-8 text-center">
              <h2 className="text-4xl font-semibold">
                {students[0]?.schoolName || "School Name"}
              </h2>
              <p>{students[0]?.schoolAddress || "School Address"}</p>
              <p>Estd: {students[0]?.estdYear || "Year Established"}</p>
              <p className="text-3xl mt-4">
                {selectedExamType} {selectedYear}
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

                  {/* Render subject headers dynamically */}
                  {students.length > 0 &&
                    Object.keys(students[0].subjects).map(
                      (subject, subjectIndex) => (
                        <th
                          key={subjectIndex}
                          className="border border-gray-300 p-2"
                        >
                          {subject}
                          <div className="flex justify-between">
                            <span className="text-gray-700 px-2">Theory</span>
                            <span className="text-gray-700 px-2">
                              Practical
                            </span>
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
                  students.map((studentData) => (
                    <tr key={studentData.rollNo}>
                      <td className="border border-gray-300 p-2">
                        {studentData.rollNo}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {studentData.name}
                      </td>

                      {/* Loop through subjects and display the marks */}
                      {Object.keys(students[0].subjects).map(
                        (subject, index) => {
                          // Check if the student has marks for this subject
                          const marks = studentData.subjects[subject] || {
                            theory: 0,
                            practical: 0,
                            total: 0,
                          };
                          return (
                            <td
                              key={index}
                              className="border border-gray-300 p-2"
                            >
                              <div className="px-4 flex justify-between">
                                <div className="text-center">
                                  {marks.theory || 0}
                                </div>{" "}
                                {/* Show 0 if theory marks are missing */}
                                <div className="text-center">
                                  {marks.practical || 0}
                                </div>{" "}
                                {/* Show 0 if practical marks are missing */}
                                <div className="text-center font-semibold">
                                  {marks.total || 0}
                                </div>{" "}
                                {/* Show 0 if total marks are missing */}
                              </div>
                            </td>
                          );
                        }
                      )}

                      {/* Total Marks and GPA */}
                      <td className="border border-gray-300 p-2 text-center">
                        {studentData.totalMarks}
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        {studentData.totalGPA}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-6 flex justify-start">
            <button
              onClick={handlePrint}
              className="bg-[#7ba0e4] dark:bg-[#8AA4D6] hover:bg-[#4c94ec] dark:hover:bg-[#253553] hover:text-white  text-center py-2 px-4 rounded text-xs"
            >
              Print Ledger
            </button>
          </div>
        </motion.div>
      )}

      {!isPublished && year && selectedClass && selectedExamType && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <div className="text-center p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
            <p className="text-yellow-700">Results not published yet</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TLedger;
