"use client";

import React, { useState,useEffect } from "react";
import Addteacher from "@/components/admin/Addteacher";

export default function Teachertable() {
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");
  const [years, setYears] = useState([]);

  useEffect(() => {
    YearSelect();
  }, []);

  const YearSelect = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/auth/year", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      setYears(data);
      
    } catch (error) {
      console.error('Failed to fetch years:', error.message);
    }
  };
  
  return (
    
    <div className="relative mt-7">
      <div className="flex justify-center items-center mb-4">
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
        <button
          onClick={() => setShowAddTeacher(true)}
          className="bg-[#7ba0e4] dark:bg-[#8AA4D6] hover:bg-[#4c94ec] dark:hover:bg-[#253553] hover:text-white  text-center py-2 px-4 rounded text-xs absolute right-4"
        >
          +Add Teacher
        </button>
      </div>

      {showAddTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[101]">
          <Addteacher onClose={() => setShowAddTeacher(false)} />
        </div>
      )}

      {selectedYear && (
        <div className="overflow-x-auto relative">
          <div className="max-h-[400px] overflow-y-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400 sticky top-0 z-30">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 sticky left-0 z-20 bg-gray-200 dark:bg-gray-700"
                  >
                    Id
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 sticky left-[68px] z-20 bg-gray-200 dark:bg-gray-700"
                  >
                    Full Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Email
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
                    1
                  </td>
                  <th
                    scope="row"
                    className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white sticky left-[68px] z-10 bg-white dark:bg-gray-800"
                  >
                    <img
                      className="w-10 h-10 rounded-full"
                      src="vssvsd"
                      alt=" image"
                    />
                    <div className="ps-3">
                      <div className="text-base font-semibold">
                        Supriya Shrestha
                      </div>
                    </div>
                  </th>
                  <td className="px-6 py-4">supriyabicte@gmail.com</td>
                  <td className="px-6 py-4">supriyabicte@gmail.com</td>
                  <td className="px-6 py-4">Female</td>
                  <td className="px-6 py-4">2002-12-23</td>
                  <td className="px-6 py-4">supriyabicte@gmail.com</td>
                  <td className="px-6 py-4">2002-12-23</td>
                  <td className="px-6 py-4">
                    <a
                      href="#"
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      Edit{" "}
                    </a>
                    <a
                      href="#"
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      Delete{" "}
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