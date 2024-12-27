
 "use client";

import React, { useState, useEffect ,useRef} from "react";
import Gradesheet from "./Gradesheet";
import Print from "@/components/Mini Component/Print"

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

  const handleSave =() =>{
    setIsEditing(false);
  }


  useEffect(() => {
    YearSelect();
    fetchClasses();
    if (selectedYear && selectedClass && selectedExamType) {
      fetchLedgerData();
    }
  }, [selectedYear, selectedClass, selectedExamType]);

  useEffect(()=>{
    if(selectedYear){
      fetchExamTypes();
    }else{
      setExamTypes([]);
    }
  },[selectedYear]);

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
  

  const fetchLedgerData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:4000/api/auth/records/${selectedYear}?status=${state}&class=${selectedClass}&examType=${selectedExamType}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      console.log("marksheets Data:", data);
    
        // Process the data to group subjects by student
        const groupedStudents = {};

        data.forEach(record => {
            const key = `${record.students}-${record.rollNo}-${record.exam_type}-${record.class}`;
            if (!groupedStudents[key]) {
                groupedStudents[key] = {
                    id: [],
                    rollNo: record.rollNo,
                    students: record.students,
                    exam_type: record.exam_type,
                    class: record.class,
                    schoolName: record.schoolName,
                    schoolAddress: record.schoolAddress,
                    estdYear: record.estdYear,
                    TH:[],
                    PR:[],
                    subjects: []
                };
            }
            groupedStudents[key].subjects.push(record.subjects);
            groupedStudents[key].TH.push(record.TH); 
           groupedStudents[key].PR.push(record.PR);
           groupedStudents[key].id.push(record.id); 

        });

        // Convert the grouped object back to an array
        const formattedStudents = Object.values(groupedStudents).map(student => ({
            ...student,
            subjects: student.subjects.join(', '), // Join subjects into a single string or format as needed
            totalScores: student.TH.map((_, index) => ( // Initialize totalScores based on the number of subjects
                (parseFloat(student.TH[index] || 0) || 0) + (parseFloat(student.PR[index] || 0) || 0) // Calculate total for each subject

                
            ))
        }));
        console.log("Formatted Data:", formattedStudents);
        setStudents(formattedStudents);

    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
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

  const handleInputChange = (index, subjectIndex, field, value) => {
    const updatedStudents = students.map((student, i) => {
      if (i === index) {
        const updatedStudent = { ...student };
  
        // Ensure TH and PR are initialized as arrays if they are undefined
        updatedStudent.TH = updatedStudent.TH || [];
        updatedStudent.PR = updatedStudent.PR || [];
  
        // Update the specific field based on the input
        if (field === "TH") {
          updatedStudent.TH[subjectIndex] = value; // Update Theory score
        } else if (field === "PR") {
          updatedStudent.PR[subjectIndex] = value; // Update Practical score
        }

         // Calculate total for the specific subject
      const theoryScore = parseFloat(updatedStudent.TH[subjectIndex]) || 0; // Parse Theory score
      const practicalScore = parseFloat(updatedStudent.PR[subjectIndex]) || 0; // Parse Practical score
      const totalScores = theoryScore + practicalScore; // Total marks for the subject
  
        // Calculate totals and GPA based on arrays for each subject
        const totalTheory = updatedStudent.TH.reduce((acc, curr) => acc + parseFloat(curr || 0), 0);
        const totalPractical = updatedStudent.PR.reduce((acc, curr) => acc + parseFloat(curr || 0), 0);
        const total = totalTheory + totalPractical; // Total marks
        const gpa = (total / (updatedStudent.TH.length + updatedStudent.PR.length)).toFixed(2); // Calculate GPA
  
        return { ...updatedStudent,totalScores, total, gpa }; // Return updated student object
      }
      return student; // Return unchanged student
    });
    setStudents(updatedStudents); // Update state with new students array
  };

  const gradesheetRef = useRef(null);

  const handlePrint = () => {
    
  };

  const handlePublishResult = async () => {
    try {
      // Validate if we have all required data
      if (!selectedYear || !selectedClass || !selectedExamType || !students.length) {
        alert('Please ensure all fields are filled and students data is available');
        return;
      }

      const response = await fetch('http://localhost:4000/api/auth/publish-result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          year: selectedYear,
          class: selectedClass,
          examType: selectedExamType,
          schoolName: schoolName,
          schoolAddress: schoolAddress,
          establishmentYear: establishmentYear,
          students,
          isPublished: true
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to publish result');
      }

      alert('Result Published Successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to publish result: ' + error.message);
    }
  };

  const handleGenerateGradesheet = () => {
    setShowGradesheet(true);
  }
  
  // Update the function to pass the required props
  const gradesheetData = {
    schoolName,
    schoolAddress,
    establishmentYear,
    studentsData: students.map(student => ({
        students: student.students,
        dateOfBirth: student.dateOfBirth, // Assuming you have this data
        dateOfBirthAD: student.dateOfBirthAD, // Assuming you have this data
        rollNo: student.rollNo,
        examType: selectedExamType,
        year: selectedYear,
        subjects: student.subjects.split(', ').map((subject, index) => ({
            name: subject,
            th: {
                creditHour: 3, // Example value, adjust as needed
                gpa: student.gpa, // Assuming GPA is calculated for the student
                grade: student.gpa >= 3.5 ? 'A' : student.gpa >= 2.5 ? 'B' : 'C' // Example grading logic
            },
            pr: {
                creditHour: 1, // Example value, adjust as needed
                gpa: student.gpa, // Assuming GPA is calculated for the student
                grade: student.gpa >= 3.5 ? 'A' : student.gpa >= 2.5 ? 'B' : 'C' // Example grading logic
            },
            finalGrade: student.gpa >= 3.5 ? 'A' : student.gpa >= 2.5 ? 'B' : 'C', // Example final grade logic
            remarks: 'Good' // Example remarks, adjust as needed
        }))
    }))
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
            <option key={year} value={year}>{year}</option>
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

        <div className="flex space-x-2 absolute right-4">
          {/* <button
            onClick={handlePrint}
            className="bg-[#7ba0e4] dark:bg-[#8AA4D6] hover:bg-[#4c94ec] dark:hover:bg-[#253553] hover:text-white  text-center py-2 px-4 rounded text-xs"
          >
            Print Ledger
          </button> */}
          <Print targetRef={gradesheetRef} />
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
        <div ref={gradesheetRef} className="border border-gray-300 rounded-lg p-4 ">
          <div className="mb-8 text-center">
          <h2 className="text-4xl font-semibold">{schoolName}</h2>
      <p>{schoolAddress}</p>
      <p>Estd: {establishmentYear}</p>
            <p className="text-3xl">
              {selectedExamType}-{selectedYear}
            </p>
            <p className="text-left text-2xl">Class: {selectedClass}</p>
            <button onClick={() => setIsEditing(true)} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
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
          <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded">
            Save
          </button>
          <button onClick={() => setIsEditing(false)} className="bg-red-500 text-white px-4 py-2 rounded ml-2">
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
                
                {students[0] && students[0].subjects.split(', ').map((subject, subjectIndex) => (
                  <th key={subjectIndex} className=" border border-gray-300 border-r-slate-400  p-2">
                    {subject}
                    <hr className="border border-slate-200"></hr>
                    <tr className="flex justify-between ">
                <td className=" text-gray-700  ">Theory</td>
                <td className=" text-gray-700  ">Practical</td>
                <td className=" text-gray-700 ">Total</td>
              </tr>
                  </th>
                ))}

                <th className="border border-gray-300 p-2" rowSpan="2">
                  Total Marks
                </th>
                <th className="border border-gray-300 p-2" rowSpan="2">
                  GPA
                </th>
              </tr>
            </thead>
            <tbody>
            {students.length === 0 ?(
              <tr>
                <td colSpan="10" className="text-center text-red-600">
                  No students found.
                </td>
              </tr>
            ) :students.map((student, index) => (
    <tr key={student.rollNo}>
      <td className="border border-gray-300 p-2">{student.rollNo}</td>
      <td className="border border-gray-300 p-2">{student.students}</td>
      
      {students[0] && students[0].subjects.split(', ').map((subject, subjectIndex) => (
        <td className="w-72 border border-r-slate-400 " key={subjectIndex}>
          <td className="w-24 border border-gray-300 p-2">
            <input
              type="number"
              placeholder="TH"
              value={student.TH[subjectIndex] || ""}
              onChange={(e) =>
                handleInputChange(index, subjectIndex, "TH", e.target.value)
              }
              className="w-full p-1 border border-gray-300 rounded-md"
            />
          </td>
          <td className="w-24 border border-gray-300 p-2">
            <input
              type="number"
              placeholder="PR"
              value={student.PR[subjectIndex] || ""}
              onChange={(e) =>
                handleInputChange(index, subjectIndex, "PR", e.target.value)
              }
              className="w-full p-1 border border-gray-300 rounded-md"
            />
          </td>
          <td className="w-24 border border-gray-300 p-2 text-center">
            {student.totalScores[subjectIndex] || student.totalScores}
          </td>
        </td>
      ))}

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
