"use client";

import React, { useState } from "react";
import Addstudent from "@/components/admin/Addstudent";

export default function Studenttable() {
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedClass, setSelectedClass] = useState("");

  const showTable = selectedYear && selectedClass;

  return (
    <div className="relative mt-7">
      <div className="flex justify-center items-center mb-4">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 mr-2"
        >
          <option value="">Select Year</option>
          <option value="2080">2080</option>
          <option value="2081">2081</option>
        </select>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 mr-2"
        >
          <option value="">Select Class</option>
          <option value="8">8</option>
          <option value="9">9</option>
        </select>
        <button className="bg-[#8AA4D6] hover:bg-[#253553] hover:text-white text-gray-700 py-2 px-4 rounded text-xs absolute right-4">
          Save
        </button>
        <button
          onClick={() => setShowAddStudent(true)}
          className="bg-[#8AA4D6] hover:bg-[#253553] hover:text-white text-gray-700 py-2 px-4 rounded text-xs absolute right-4"
        >
          +Add Student
        </button>
      </div>
      {showAddStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[101]">
          <Addstudent onClose={() => setShowAddStudent(false)} />
        </div>
      )}
      {showTable && (
        <div className="overflow-x-auto relative">
          <div className="max-h-[500px] overflow-y-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0 z-20">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 sticky left-0 z-10 bg-gray-50 dark:bg-gray-700"
                  >
                    Joined Year
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 sticky left-[120px] z-10 bg-gray-50 dark:bg-gray-700"
                  >
                    Class
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 sticky left-[200px] z-10 bg-gray-50 dark:bg-gray-700"
                  >
                    Full Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Roll No
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Parent's Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Address
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Date of Birth
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Username
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Password
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-6 py-4 sticky left-0 z-10 bg-white dark:bg-gray-800">
                    2080
                  </td>
                  <td className="px-6 py-4 sticky left-[120px] z-10 bg-white dark:bg-gray-800">
                    8
                  </td>
                  <td className="px-6 py-4 sticky left-[200px] z-10 bg-white dark:bg-gray-800">
                    Supriya Shrestha
                  </td>
                  <td className="px-6 py-4">1</td>
                  <td className="px-6 py-4">supriyabicte@gmail.com</td>
                  <td className="px-6 py-4">Parent Name</td>
                  <td className="px-6 py-4">1234567890</td>
                  <td className="px-6 py-4">Address</td>
                  <td className="px-6 py-4">2002-12-23</td>
                  <td className="px-6 py-4">username123</td>
                  <td className="px-6 py-4">password123</td>
                  <td className="px-6 py-4">
                    <a
                      href="#"
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      Edit
                    </a>
                    <a
                      href="#"
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline ml-2"
                    >
                      Delete
                    </a>
                  </td>
                </tr>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-6 py-4 sticky left-0 z-10 bg-white dark:bg-gray-800">
                    2080
                  </td>
                  <td className="px-6 py-4 sticky left-[120px] z-10 bg-white dark:bg-gray-800">
                    8
                  </td>
                  <td className="px-6 py-4 sticky left-[200px] z-10 bg-white dark:bg-gray-800">
                    Supriya Shrestha
                  </td>
                  <td className="px-6 py-4">1</td>
                  <td className="px-6 py-4">supriyabicte@gmail.com</td>
                  <td className="px-6 py-4">Parent Name</td>
                  <td className="px-6 py-4">1234567890</td>
                  <td className="px-6 py-4">Address</td>
                  <td className="px-6 py-4">2002-12-23</td>
                  <td className="px-6 py-4">username123</td>
                  <td className="px-6 py-4">password123</td>
                  <td className="px-6 py-4">
                    <a
                      href="#"
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      Edit
                    </a>
                    <a
                      href="#"
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline ml-2"
                    >
                      Delete
                    </a>
                  </td>
                </tr>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-6 py-4 sticky left-0 z-10 bg-white dark:bg-gray-800">
                    2080
                  </td>
                  <td className="px-6 py-4 sticky left-[120px] z-10 bg-white dark:bg-gray-800">
                    8
                  </td>
                  <td className="px-6 py-4 sticky left-[200px] z-10 bg-white dark:bg-gray-800">
                    Supriya Shrestha
                  </td>
                  <td className="px-6 py-4">1</td>
                  <td className="px-6 py-4">supriyabicte@gmail.com</td>
                  <td className="px-6 py-4">Parent Name</td>
                  <td className="px-6 py-4">1234567890</td>
                  <td className="px-6 py-4">Address</td>
                  <td className="px-6 py-4">2002-12-23</td>
                  <td className="px-6 py-4">username123</td>
                  <td className="px-6 py-4">password123</td>
                  <td className="px-6 py-4">
                    <a
                      href="#"
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      Edit
                    </a>
                    <a
                      href="#"
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline ml-2"
                    >
                      Delete
                    </a>
                  </td>
                </tr>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-6 py-4 sticky left-0 z-10 bg-white dark:bg-gray-800">
                    2080
                  </td>
                  <td className="px-6 py-4 sticky left-[120px] z-10 bg-white dark:bg-gray-800">
                    8
                  </td>
                  <td className="px-6 py-4 sticky left-[200px] z-10 bg-white dark:bg-gray-800">
                    Supriya Shrestha
                  </td>
                  <td className="px-6 py-4">1</td>
                  <td className="px-6 py-4">supriyabicte@gmail.com</td>
                  <td className="px-6 py-4">Parent Name</td>
                  <td className="px-6 py-4">1234567890</td>
                  <td className="px-6 py-4">Address</td>
                  <td className="px-6 py-4">2002-12-23</td>
                  <td className="px-6 py-4">username123</td>
                  <td className="px-6 py-4">password123</td>
                  <td className="px-6 py-4">
                    <a
                      href="#"
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      Edit
                    </a>
                    <a
                      href="#"
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline ml-2"
                    >
                      Delete
                    </a>
                  </td>
                </tr>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-6 py-4 sticky left-0 z-10 bg-white dark:bg-gray-800">
                    2080
                  </td>
                  <td className="px-6 py-4 sticky left-[120px] z-10 bg-white dark:bg-gray-800">
                    8
                  </td>
                  <td className="px-6 py-4 sticky left-[200px] z-10 bg-white dark:bg-gray-800">
                    Supriya Shrestha
                  </td>
                  <td className="px-6 py-4">1</td>
                  <td className="px-6 py-4">supriyabicte@gmail.com</td>
                  <td className="px-6 py-4">Parent Name</td>
                  <td className="px-6 py-4">1234567890</td>
                  <td className="px-6 py-4">Address</td>
                  <td className="px-6 py-4">2002-12-23</td>
                  <td className="px-6 py-4">username123</td>
                  <td className="px-6 py-4">password123</td>
                  <td className="px-6 py-4">
                    <a
                      href="#"
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      Edit
                    </a>
                    <a
                      href="#"
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline ml-2"
                    >
                      Delete
                    </a>
                  </td>
                </tr>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-6 py-4 sticky left-0 z-10 bg-white dark:bg-gray-800">
                    2080
                  </td>
                  <td className="px-6 py-4 sticky left-[120px] z-10 bg-white dark:bg-gray-800">
                    8
                  </td>
                  <td className="px-6 py-4 sticky left-[200px] z-10 bg-white dark:bg-gray-800">
                    Supriya Shrestha
                  </td>
                  <td className="px-6 py-4">1</td>
                  <td className="px-6 py-4">supriyabicte@gmail.com</td>
                  <td className="px-6 py-4">Parent Name</td>
                  <td className="px-6 py-4">1234567890</td>
                  <td className="px-6 py-4">Address</td>
                  <td className="px-6 py-4">2002-12-23</td>
                  <td className="px-6 py-4">username123</td>
                  <td className="px-6 py-4">password123</td>
                  <td className="px-6 py-4">
                    <a
                      href="#"
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      Edit
                    </a>
                    <a
                      href="#"
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline ml-2"
                    >
                      Delete
                    </a>
                  </td>
                </tr>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-6 py-4 sticky left-0 z-10 bg-white dark:bg-gray-800">
                    2080
                  </td>
                  <td className="px-6 py-4 sticky left-[120px] z-10 bg-white dark:bg-gray-800">
                    8
                  </td>
                  <td className="px-6 py-4 sticky left-[200px] z-10 bg-white dark:bg-gray-800">
                    Supriya Shrestha
                  </td>
                  <td className="px-6 py-4">1</td>
                  <td className="px-6 py-4">supriyabicte@gmail.com</td>
                  <td className="px-6 py-4">Parent Name</td>
                  <td className="px-6 py-4">1234567890</td>
                  <td className="px-6 py-4">Address</td>
                  <td className="px-6 py-4">2002-12-23</td>
                  <td className="px-6 py-4">username123</td>
                  <td className="px-6 py-4">password123</td>
                  <td className="px-6 py-4">
                    <a
                      href="#"
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      Edit
                    </a>
                    <a
                      href="#"
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline ml-2"
                    >
                      Delete
                    </a>
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
