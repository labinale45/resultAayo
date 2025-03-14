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
          console.log("Publication status ok retriving data:");
  
          const gradesheetResponse = await fetch(
            `http://localhost:4000/api/auth/gradesheet/${selectedYear}?status=${state}&class=${selectedClass}&examType=${selectedExamType}&studentId=${studentId}`
          );
    
          if (!gradesheetResponse.ok) {
            throw new Error("Failed to fetch gradesheet");
          }
    
          const gradesheetData = await gradesheetResponse.json();
          console.log("Gradesheet data:", gradesheetData);
          const groupedData = groupStudentsByRollNo(gradesheetData);
          console.log("Grouped data:", groupedData);
          setStudents(groupedData[0]);
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

// Update the groupStudentsByRollNo function to handle single student object
const groupStudentsByRollNo = (studentData) => {
  if (!studentData || typeof studentData !== 'object') {
      console.error("Invalid student data:", studentData);
      return [];
  }

  const { dateOfBirth,rollNo, schoolName, schoolAddress, estdYear, students: studentName, subjects } = studentData;
  
  const processedStudent = {
      rollNo,
      name: studentName,
      subjects: subjects.map(subject => {
        // Ensure missing marks are handled as 0
        const theoryMarks = subject.th || 0; // Default to 0 if missing
        const practicalMarks = subject.pr || 0; // Default to 0 if missing
    
        // Calculate theory and practical GPAs
        const theoryGPA = (theoryMarks / 50) * 4;
        const practicalGPA = (practicalMarks / 50) * 4;
        
        // Calculate weighted GPA (assuming 3 credit hours for theory and 1 for practical)
        const finalGPA = (parseFloat(theoryGPA) + parseFloat(practicalGPA)) / 2;
           
        // Calculate final grade based on weighted GPA
        const finalGrade =
          finalGPA >= 3.6 ? "A+" :
          finalGPA >= 3.2 ? "A" :
          finalGPA >= 2.8 ? "B+" :
          finalGPA >= 2.5 ? "B" :
          finalGPA >= 2.0 ? "C+" :
          finalGPA >= 1.6 ? "C" :
          finalGPA >= 1.2 ? "D+" :
          finalGPA >= 0.8 ? "D" : "NG";
    
        return {
            name: subject.name,
            theory: {
                creditHour: 2,
                gpa: theoryGPA,
                grade:
                theoryGPA >= 3.6 ? "A+":theoryGPA >= 3.2 ? "A":theoryGPA>= 2.8 ? "B+" : theoryGPA >= 2.5 ? "B" :theoryGPA >= 2.0 ? "C+":theoryGPA >= 1.6 ? "C":theoryGPA >= 1.2 ? "D+":theoryGPA >= 0.8 ? "D": "NG",
                marks: subject.th || 0,
                remarks: theoryGPA >= 3.6 ? 'OutStanding' : theoryGPA >= 3.2 ? 'Excellent' :theoryGPA >= 2.8 ? 'Very Good' :theoryGPA >= 2.5 ? 'Good' :theoryGPA >= 2.0 ? 'Satisfactory' : theoryGPA >= 1.6 ? 'Acceptable' :theoryGPA >= 1.2 ? 'Basic' : 'Not Graded'
            },
            practical: {
                creditHour: 2,
                gpa: practicalGPA,
                grade:
                practicalGPA >= 3.6 ? "A+":practicalGPA >= 3.2 ? "A":practicalGPA>= 2.8 ? "B+" : practicalGPA >= 2.5 ? "B" :practicalGPA >= 2.0 ? "C+":practicalGPA >= 1.6 ? "C":practicalGPA >= 1.2 ? "D+":practicalGPA >= 0.8 ? "D": "NG",
                marks: subject.th || 0,
                remarks: practicalGPA >= 3.6 ? 'OutStanding' : practicalGPA >= 3.2 ? 'Excellent' :practicalGPA >= 2.8 ? 'Very Good' :practicalGPA >= 2.5 ? 'Good' :practicalGPA >= 2.0 ? 'Satisfactory' : practicalGPA >= 1.6 ? 'Acceptable' :practicalGPA >= 1.2 ? 'Basic' : 'Not Graded'
            },
            finalGPA,
            finalGrade
        };
    }),    
      schoolName,
      schoolAddress,
      estdYear,
      dob:dateOfBirth
  };

  return [processedStudent];
};

  

const handlePrint = () => {
  const printWindow = window.open('', '', 'width=800,height=600');
  
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
          <p class="school-name">${students?.schoolName || "School Name"}</p>
          <p>${students?.schoolAddress || "School Address"}</p>
          <p>Estd: ${students?.estdYear || "Year Established"}</p>
          <p class="exam-title">${selectedExamType}-${selectedYear}</p>
        </div>

        <div class="student-info">
          THE GRADE OBTAINED BY: <span class="underline">${students?.name || "N/A"}</span>
          DATE OF BIRTH: <span class="underline">${students?.dob || "N/A"}</span>
          ROLL NO: <span class="underline">${students?.rollNo || "N/A"}</span>
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
                <td>${subject.theory.creditHour}</td>
                <td>${subject.theory.gpa.toFixed(2)}</td>
                <td>${subject.theory.grade}</td>
                <td rowspan="2">${subject.finalGrade}</td>
                <td>${subject.theory.remarks}</td>
              </tr>
              <tr>
                <td></td>
                <td>${subject.name} (PR)</td>
                <td>${subject.practical.creditHour}</td>
                <td>${subject.practical.gpa.toFixed(2)}</td>
                <td>${subject.practical.grade}</td>
                <td>${subject.practical.remarks}</td>
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

  printWindow.document.write(printContent);
  printWindow.document.close();
  printWindow.focus();
  
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
        <h1 className="text-2xl font-bold">{students?.schoolName || "School Name"}</h1>
        <p>{students?.schoolAddress || "School Address"}</p>
        <p>Estd: {students?.estdYear || "Year Established"}</p>
        <p className="mt-2 text-3xl">
          {selectedExamType || "N/A"} - {selectedYear || "N/A"}
        </p>
      </div>

      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 dark:bg-[#253553] dark:text-white">
        <p className="mb-4">
          THE GRADE OBTAINED BY: {"  "}
          <span className="text-black text-center font-semibold inline-block border-b border-black dark:border-white pb-1 w-48">
            {students?.name || "N/A"}
          </span>
          {" "}DATE OF BIRTH:{"  "}
          <span className="inline-block text-center font-semibold border-b border-black pb-1 w-32 dark:border-white">
            {students?.dob || "N/A"}
          </span>
          {" "}ROLL NO:{" "}
          <span className="inline-block text-center font-semibold border-b border-black pb-1 w-16 dark:border-white">
            {students?.rollNo || "N/A"}
          </span>
          {" "}IN THE{" "}
          <span className="inline-block text-center font-semibold border-b border-black pb-1 w-56 dark:border-white whitespace-nowrap">
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
            {students?.subjects?.map((subject, index) => (
              <React.Fragment key={index}>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2">{subject.name} (TH)</td>
                  <td className="border border-gray-300 px-4 py-2">{subject.theory.creditHour}</td>
                  <td className="border border-gray-300 px-4 py-2">{subject.theory.gpa.toFixed(2)}</td>
                  <td className="border border-gray-300 px-4 py-2">{subject.theory.grade}</td>
                  <td className="border border-gray-300 px-4 py-2" rowSpan="2">{subject.finalGrade}</td>
                  <td className="border border-gray-300 px-4 py-2">{subject.theory.remarks}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2"></td>
                  <td className="border border-gray-300 px-4 py-2">{subject.name} (PR)</td>
                  <td className="border border-gray-300 px-4 py-2">{subject.practical.creditHour}</td>
                  <td className="border border-gray-300 px-4 py-2">{subject.practical.gpa.toFixed(2)}</td>
                  <td className="border border-gray-300 px-4 py-2">{subject.practical.grade}</td>
                  <td className="border border-gray-300 px-4 py-2">{subject.practical.remarks}</td>
                </tr>
              </React.Fragment>
            ))}
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
