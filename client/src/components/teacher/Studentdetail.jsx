"use client";

import React, { useState } from "react";

export default function Studentdetail() {
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedClass, setSelectedClass] = useState("");

  const showTable = selectedYear && selectedClass;

  return (
    <div className="relative mt-7 ">
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
      </div>

      {showTable && (
        <div className="overflow-x-auto relative">
          <div className="max-h-[400px] overflow-y-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400 sticky top-0 z-30">
                <tr>
                  <th
                    className="sticky left-0 z-30 bg-gray-200 dark:bg-gray-700"
                    style={{ width: "400px" }}
                  >
                    <div className="flex">
                      <div className="w-[120px] px-6 py-3">Joined Year</div>
                      <div className="w-[80px] px-6 py-3">Class</div>
                      <div className="w-[200px] px-6 py-3">Full Name</div>
                    </div>
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
                {[...Array(20)].map((_, index) => (
                  <tr
                    key={index}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td
                      className="sticky left-0 z-20 bg-white dark:bg-gray-800"
                      style={{ width: "400px" }}
                    >
                      <div className="flex">
                        <div className="w-[120px] px-6 py-4">2080</div>
                        <div className="w-[80px] px-6 py-4">8</div>
                        <div className="w-[200px] px-6 py-4">
                          Supriya Shrestha
                        </div>
                      </div>
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
