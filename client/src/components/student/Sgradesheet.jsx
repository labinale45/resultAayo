"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Gradesheet from "../admin/Gradesheet";

export default function Sgradesheet() {
  const [selectedYear,setSelectedYear] = useState(null);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedExamType, setSelectedExamType] = useState("");
  const [classes, setClasses] = useState([]);
  const [studentId, setStudentId] = useState(null);
  const [examTypes, setExamTypes] = useState([]);
  const [students, setStudents] = useState([]);
  const [years, setYears] = useState([]);
  const [error, setError] = useState(null);
  const [state, setState] = useState("marksheets");
  const [isLoading, setIsLoading] = useState(false);
  const [isPublished, setIsPublished] = useState(false) ;

  useEffect(() => {
    // Fetch teacherId from token
    const token = localStorage.getItem("token"); // Assuming you store the token in localStorage
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode the token
      console.log("decotedTOken",decodedToken); // Log the decoded token for debugging
      if (decodedToken.role === "students") {
        setStudentId(decodedToken.id); // Assuming the student ID is stored as 'id' in the token
      }
    }
},[setStudentId]);

useEffect(() => {
  const fetchClasses = async (teacherId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/auth/student/${studentId}/classes`);
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
  if (studentId) {
    fetchClasses(studentId);
  }
}, [studentId]);

useEffect(()=>{
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
  YearSelect();

  const fetchExamTypes = async () => {
    try {
      // Correct the URL structure to use a query parameter or path parameter
      const response = await fetch(`http://localhost:4000/api/auth/exam-types?year=${selectedYear}`);
  
      if (!response.ok) throw new Error("Failed to fetch exam types");

      const examData = await response.json();
      setExamTypes(examData);

    } catch (error) {
      console.error("Error fetching exam types:", error);
    }
  };

  if(selectedYear){
    fetchExamTypes();
  }else{
    setExamTypes([]);
  }
},[state,selectedYear]);








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
        
  
          const gradesheetResponse = await fetch(
            `http://localhost:4000/api/auth/gradesheet/${selectedYear}?status=${state}&class=${selectedClass}&examType=${selectedExamType}&studentId=${studentId}`
          );
    
          if (!gradesheetResponse.ok) {
            throw new Error("Failed to fetch gradesheet");
          }
    
          const gradesheetData = await gradesheetResponse.json();
          setStudents(gradesheetData);
          console.log("Gradesheet data:", gradesheetData);
        }
      } catch (error) {
        console.error("Error:", error);
        setIsPublished(false);
      } finally {
        setIsLoading(false);
      }
    };
    if ( selectedYear && selectedClass && selectedExamType) {
      checkPublicationStatus();
    }
  }, [studentId,state,selectedYear, selectedClass, selectedExamType]);


  

  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open('', '', 'width=800,height=600');
    
    // Generate the print content
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Gradesheet</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 40px;
            margin: 0;
          }
          .container {
            border: 2px solid black;
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
          .school-name {
            font-size: 24px;
            font-weight: bold;
            margin: 0;
          }
          .exam-title {
            font-size: 20px;
            margin: 15px 0;
          }
          .student-info {
            margin: 20px 0;
            line-height: 2;
          }
          .underline {
            border-bottom: 1px solid black;
            padding: 0 10px;
            display: inline-block;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          th, td {
            border: 1px solid black;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f0f0f0;
          }
          .signatures {
            margin-top: 100px;
            display: flex;
            justify-content: space-between;
          }
          .signature-line {
            border-top: 1px solid black;
            width: 200px;
            text-align: center;
            padding-top: 5px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <p class="school-name">${students.schoolName || "ABC"}</p>
            <p>${students.schoolAddress || "XYZ"}</p>
            <p>Estd: ${students.estdYear || "1665"}</p>
            <p class="exam-title">${selectedExamType}-${selectedYear}</p>
          </div>
  
          <div class="student-info">
            THE GRADE OBTAINED BY: <span class="underline">${students?.students || "Manita Thapa"}</span>
            DATE OF BIRTH: <span class="underline">${students?.dateOfBirth || "2000-12-18"}</span>
            B.S ( <span class="underline">${students?.dateOfBirthAD || "N/A"}</span> A.D)
            ROLL NO: <span class="underline">${students?.rollNo || "3"}</span>
            IN THE <span class="underline">${selectedExamType}</span>
            CONDUCTED BY THE SCHOOL IN THE ACADEMIC YEAR <span class="underline">${selectedYear}</span>
            ARE GIVEN BELOW:
          </div>
  
          <table>
            <thead>
              <tr>
                <th>S.N</th>
                <th>SUBJECT</th>
                <th>CREDIT HOUR</th>
                <th>GPA</th>
                <th>GRADE</th>
                <th>FINAL GRADE</th>
                <th>REMARKS</th>
              </tr>
            </thead>
            <tbody>
              ${students?.subjects?.map((subject, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${subject.name} (TH)</td>
                  <td>${subject.th?.creditHour || ''}</td>
                  <td>${subject.th?.gpa || ''}</td>
                  <td>${subject.th?.grade || ''}</td>
                  <td>${subject.finalGrade || ''}</td>
                  <td>${subject.remarks || ''}</td>
                </tr>
                <tr>
                  <td></td>
                  <td>${subject.name} (PR)</td>
                  <td>${subject.pr?.creditHour || ''}</td>
                  <td>${subject.pr?.gpa || ''}</td>
                  <td>${subject.pr?.grade || ''}</td>
                  <td></td>
                  <td></td>
                </tr>
              `).join('') || `
                <tr>
                  <td colspan="7" style="text-align: center; color: red;">
                    No subjects available
                  </td>
                </tr>
              `}
            </tbody>
          </table>
  
          <div class="signatures">
            <div>
              <p>Date: ................................</p>
            </div>
            <div>
              <div class="signature-line">Class Teacher's Signature</div>
            </div>
            <div>
              <div class="signature-line">Principal's Signature</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  
    // Write the content to the new window and print it
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    
    // Wait for content to load before printing
    printWindow.onload = function() {
      printWindow.print();
      printWindow.close();
    };
  };
  

  const showTable =
  selectedYear && selectedExamType && selectedClass && isPublished;

  


  return (
    <div className="relative mt-7">
      <div className="flex justify-cent px-8                                                                                                                                                                                            er items-center mb-4">
        
        <select
           value={selectedClass}
           onChange={(e) => setSelectedClass(e.target.value)}
           className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 transition-all p-2.5 mr-3"   
         >
           <option value="">Select Class</option>
           {classes.map((cls) => (
             <option key={cls.id} value={cls.name}>
               {cls.name}
             </option>
           ))}
        </select>

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
      </div>
      <div className="flex justify-center items-center">
      
      </div>
      {isLoading && (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      )}


{showTable && !isLoading && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="container mx-auto p-8 bg-white rounded-lg shadow-lg"
  >
    <div id="ledger" className="border-8 border-black p-8 mb-4">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">{students.schoolName || "School Name"}</h1>
        <p>{ students.schoolAddress || "School Address"}</p>
        <p>Estd: { students.estdYear || "Year Established"}</p>
        <p className="mt-2 text-3xl">
          {selectedExamType}-{selectedYear}
        </p>
      </div>

      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 dark:bg-[#253553] dark:text-white">
        <p className="mb-4">
          THE GRADE OBTAINED BY: {"  "}
          <span className="text-black text-center font-semibold inline-block border-b border-black dark:border-white pb-1 w-48">
            {students?.students || "N/A"}
          </span>
          {" "}DATE OF BIRTH:{"  "}
          <span className="inline-block text-center font-semibold border-b border-black pb-1 w-32 dark:border-white">
            {students?.dateOfBirthAD || "N/A"}
          </span>{"  "}
          B.S (
          <span className="inline-block text-center font-semibold border-b border-black pb-1 w-32 dark:border-white">
            {students?.dateOfBirth || "N/A"}
          </span>{" "}
          A.D) ROLL NO:{" "}
          <span className="inline-block text-center font-semibold border-b border-black pb-1 w-16 dark:border-white">
            {students?.rollNo || "N/A"}
          </span>
          {" "}IN THE{" "}
          <span className="inline-block  text-center font-semibold border-b border-black pb-1 w-48 dark:border-white">
            {selectedExamType || "N/A"}
          </span>
          {" "}CONDUCTED BY THE SCHOOL IN THE ACADEMIC YEAR{"  "}
          <span className="inline-block text-center font-semibold border-b border-black pb-1 w-12 dark:border-white">
            {selectedYear || "N/A"}
          </span>{" "}
          ARE GIVEN BELOW:
        </p>

        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 dark:bg-[#253553] dark:text-white">
              <th className="border border-gray-300 px-4 py-2">S.N</th>
              <th className="border border-gray-300 px-4 py-2">SUBJECT</th>
              <th className="border border-gray-300 px-4 py-2">CREDIT HOUR</th>
              <th className="border border-gray-300 px-4 py-2">GPA</th>
              <th className="border border-gray-300 px-4 py-2">GRADE</th>
              <th className="border border-gray-300 px-4 py-2">FINAL GRADE</th>
              <th className="border border-gray-300 px-4 py-2">REMARKS</th>
            </tr>
          </thead>
          <tbody>
            {students?.subjects ? (
              students.subjects.map((subject, index) => (
                <React.Fragment key={index}>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                    <td className="border border-gray-300 px-4 py-2">{subject.name} (TH)</td>
                    <td className="border border-gray-300 px-4 py-2">{subject.th?.creditHour}</td>
                    <td className="border border-gray-300 px-4 py-2">{subject.th?.gpa}</td>
                    <td className="border border-gray-300 px-4 py-2">{subject.th?.grade}</td>
                    <td className="border border-gray-300 px-4 py-2">{subject.finalGrade}</td>
                    <td className="border border-gray-300 px-4 py-2">{subject.remarks}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2"></td>
                    <td className="border border-gray-300 px-4 py-2">{subject.name} (PR)</td>
                    <td className="border border-gray-300 px-4 py-2">{subject.pr?.creditHour}</td>
                    <td className="border border-gray-300 px-4 py-2">{subject.pr?.gpa}</td>
                    <td className="border border-gray-300 px-4 py-2">{subject.pr?.grade}</td>
                    <td className="border border-gray-300 px-4 py-2"></td>
                    <td className="border border-gray-300 px-4 py-2"></td>
                  </tr>
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="7" className=" border border-gray-300 px-4 py-2 text-red-500 text-center">
                  No subjects available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-24">
        <div className="flex justify-between items-end">
          <div>
            <p>Date: ................................</p>
          </div>

          <div className="text-center">
            <div className="border-t border-black pt-2 inline-block dark:border-white">
              Class Teacher&apos;s Signature
            </div>
          </div>

          <div className="text-center">
            <div className="border-t border-black pt-2 inline-block dark:border-white">
              Principal&apos;s Signature
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="mt-6 flex justify-start">
      <button
        onClick={handlePrint}
        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
      >
        Print Gradesheet
      </button>
    </div>
  </motion.div>
)}

      {!isPublished && selectedYear && selectedClass && selectedExamType && (
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
}
