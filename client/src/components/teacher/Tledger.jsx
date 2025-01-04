"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const TLedger = () => {
  const [year, setYear] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedExamType, setSelectedExamType] = useState("");
  const [isPublished, setIsPublished] = useState(false) ;
  const [state, setState] = useState("marksheets");
  const [years, setYears] = useState([]);
  const [error, setError] = useState(null);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [examTypes, setExamTypes] = useState([]);
  const [teacherId, setTeacherId] = useState(null);
  const [selectedYear,setSelectedYear] = useState(null);
  useEffect(() => {
    // Fetch teacherId from token
    const token = localStorage.getItem("token"); // Assuming you store the token in localStorage
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode the token
      console.log("decotedTOken",decodedToken); // Log the decoded token for debugging
      if (decodedToken.role === "teachers") {
        setTeacherId(decodedToken.id); // Assuming the teacher ID is stored as 'id' in the token
      }
    }
})


useEffect(() => {
  if (teacherId,selectedYear) {
    fetchClasses(teacherId,selectedYear);
    console.log("classes : ", classes);
  }
}, [teacherId,selectedYear]);

useEffect(() => {
  fetchYears();
  if (selectedYear) {
    fetchExamTypes();
  }else{
    setExamTypes([]);
  }
}, [selectedYear]);

  useEffect(() => {
    if (year && selectedClass && selectedExamType) {
      checkPublicationStatus();
    }
  }, [year, selectedClass, selectedExamType]);

  const fetchYears = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/auth/year?status=${state}`
      );
      const data = await response.json();
      setYears(data);
      if (data && data.length > 0) {
        setYear(data[0]);
      }else{
        setYears([]);
      }
    } catch (error) {
      setError("Failed to fetch years");
    }
  };

  const fetchClasses = async (teacherId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/auth/assigned-class/${teacherId}/${selectedYear}`);
      if (!response.ok) throw new Error("Failed to fetch classes");

      const { classes, count } = await response.json();
      console.log("Class Data:", classes);

      const formattedClasses = classes.map(item => ({
          id: `${item.class}`,
          name: item.class,
          section: item.section,
          studentCount: item.studentCount || 0
      }));
      
      console.log("tmClass:", formattedClasses);
      setClasses(formattedClasses);
    } catch (error) {
      console.error("Error fetching classes:", error);
      setClasses([]);
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
          `http://localhost:4000/api/auth/records/${year}?status=${state}&class=${selectedClass}&examType=${selectedExamType}`
        );
  
        if (ledgerResponse.ok) {
          const ledgerData = await ledgerResponse.json();
          console.log("Student records:", ledgerData);
          setStudents(ledgerData);
        }
      }

    } catch (error) {
      setIsPublished(false);
    } finally {
      setIsLoading(false);
    }
  };
  

  const handlePrint = () => {
    window.print();
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
  <h2 className="text-4xl font-semibold">{students.length > 0 ? students.schoolName : "School Name"}</h2>
  <p>{students.length > 0 ? students.schoolAddress : "School Address"}</p>
  <p>Estd: {students.length > 0 ? students.estdYear : "Year Established"}</p>

            <p className="text-3xl"></p>
              <p className="text-3xl mt-4">
              {selectedExamType} {selectedYear}
              </p>
              <p className="text-left text-2xl">Class: {selectedClass}</p>
            </div>
                  
            <table className="min-w-full border-collapse border border-gray-300">
            <thead>
  <tr>
    <th className="border border-gray-300 p-2" rowSpan="2">Roll No</th>
    <th className="border border-gray-300 p-2" rowSpan="2">Name</th>
    {Array.from(new Set(students.map(student => student.subjects))).map((subject, subjectIndex) => (
      <th key={subjectIndex} className="border border-gray-300 border-r-slate-400 p-2">
        {subject}
        <hr className="border border-slate-200" />
        <tr className="flex justify-between">
          <td className="text-gray-700 px-2">Theory</td>
          <td className="text-gray-700 px-2">Practical</td>
          <td className="text-gray-700 px-2">Total</td>
        </tr>
      </th>
    ))}
    <th className="border border-gray-300 p-2" rowSpan="2">Total Marks</th>
    <th className="border border-gray-300 p-2" rowSpan="2">GPA</th>
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
    // Group students by roll number to avoid duplicates
    Array.from(new Set(students.map(s => s.rollNo))).map(rollNo => {
      const studentData = students.find(s => s.rollNo === rollNo);
      return (
        <tr key={rollNo}>
          <td className="border border-gray-300 p-2">{studentData.rollNo}</td>

          <td className="border border-gray-300 p-2">{studentData.students}</td>
          
          {/* Map through unique subjects */}
          {Array.from(new Set(students.map(s => s.subjects))).map((subject, index) => (
  <td key={index} className="w-72 border border-r-slate-400">
    <td className="w-24 border border-gray-300 p-2">
      <div className="w-full p-1 text-center">
        {studentData.TH || ""}

      </div>
    </td>
    <td className="w-24 border border-gray-300 p-2">
      <div className="w-full p-1 text-center">
        {studentData.PR || ""}
      </div>
    </td>
    <td className="w-24 border border-gray-300 p-2 text-center">
      {(studentData.TH || 0) + (studentData.PR || 0) || ""}
    </td>
  </td>
))}

          
          <td className="border border-gray-300 p-2 text-center">{studentData.total}</td>
          <td className="border border-gray-300 p-2 text-center">{studentData.gpa}</td>
        </tr>
      );
    })
  )}
</tbody>

</table>

            <div className="mt-6 flex justify-start">
            <button
            onClick={handlePrint}
            className="bg-[#7ba0e4] dark:bg-[#8AA4D6] hover:bg-[#4c94ec] dark:hover:bg-[#253553] hover:text-white  text-center py-2 px-4 rounded text-xs"
          >
            Print Ledger
          </button>
            </div>
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
