"use client";
import React, { useRef } from "react";
import Download from "@/components/Mini Component/Download";
import Print from "@/components/Mini Component/Print";

export default function Gradesheet({ onClose, studentsData = [], schoolName, schoolAddress, establishmentYear }) {
  const gradesheetRef = useRef(null);
  
  if (!studentsData || studentsData.length === 0) {
    return (
      <div className="text-center">
        <p>No student data available.</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[102]">
      <div className="container mx-auto p-8 dark:bg-[#253553] dark:text-white max-h-[90vh] overflow-y-auto relative bg-white rounded-lg max-w-4xl">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-3xl font-bold"
        >
          &times;
        </button>

        <div className="flex space-x-2 mb-4">
          <Download targetRef={gradesheetRef} />
          <Print targetRef={gradesheetRef} />
        </div>

        {studentsData.map((studentData, studentIndex) => (
          <div key={studentIndex} ref={gradesheetRef} className="border-8 border-black p-8 mb-4">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold">{schoolName}</h1>
              <p>{schoolAddress}</p>
              <p>Estd: {establishmentYear}</p>
              <div className="inline-block border-2 border-black px-4 py-2 mt-2">
                <h2 className="text-xl font-semibold">GRADESHEET</h2>
              </div>
            </div>

            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 dark:bg-[#253553] dark:text-white ">
              <p className="mb-4">
                THE GRADE OBTAINED BY:{" "}
                <span className="text-black inline-block border-b border-black dark:border-white pb-1 w-48">
                  {studentData.students || "N/A"}
                </span>
                {" "}DATE OF BIRTH:{"  "}
                <span className="inline-block border-b border-black pb-1 w-32 dark:border-white">
                  {studentData.dateOfBirth || "N/A"}
                </span>{"  "}
                B.S (
                <span className="inline-block border-b border-black pb-1 w-32 dark:border-white">
                  {studentData.dateOfBirthAD || "N/A"}
                </span>{" "}
                A.D) ROLL NO:{" "}
                <span className="inline-block border-b border-black pb-1 w-16 dark:border-white">
                  {studentData.rollNo || "N/A"}
                </span>
                {" "}IN THE{" "}
                <span className="inline-block border-b border-black pb-1 w-48 dark:border-white">
                  {studentData.examType || "N/A"}
                </span>
                {" "}CONDUCTED BY THE SCHOOL IN THE ACADEMIC YEAR{"  "}
                <span className="inline-block border-b border-black pb-1 w-12 dark:border-white">
                  {studentData.year || "N/A"}
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
                  {studentData.subjects && studentData.subjects.length > 0 ? (
                    studentData.subjects.map((subject, index) => (
                      <React.Fragment key={index}>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                          <td className="border border-gray-300 px-4 py-2">{subject.name} (TH)</td>
                          <td className="border border-gray-300 px-4 py-2">{subject.th.creditHour}</td>
                          <td className="border border-gray-300 px-4 py-2">{subject.th.gpa}</td>
                          <td className="border border-gray-300 px-4 py-2">{subject.th.grade}</td>
                          <td className="border border-gray-300 px-4 py-2">{subject.finalGrade}</td>
                          <td className="border border-gray-300 px-4 py-2">{subject.remarks}</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2"></td>
                          <td className="border border-gray-300 px-4 py-2">{subject.name} (PR)</td>
                          <td className="border border-gray-300 px-4 py-2">{subject.pr.creditHour}</td>
                          <td className="border border-gray-300 px-4 py-2">{subject.pr.gpa}</td>
                          <td className="border border-gray-300 px-4 py-2">{subject.pr.grade}</td>
                          <td className="border border-gray-300 px-4 py-2"></td>
                          <td className="border border-gray-300 px-4 py-2"></td>
                        </tr>
                      </React.Fragment>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="border border-gray-300 px-4 py-2 text-center">
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
                    Class Teacher's Signature
                  </div>
                </div>

                <div className="text-center">
                  <div className="border-t border-black pt-2 inline-block dark:border-white">
                    Principal's Signature
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}