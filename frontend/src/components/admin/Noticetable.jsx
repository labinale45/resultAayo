"use client";

import React, { useState } from "react";
import Createnotice from "./Createnotice";

export default function Noticetable() {
  const [showCreateNotice, setShowCreateNotice] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");

  const showTable = selectedYear;

  return (
    <div className="relative overflow-x-auto mt-7">
      <div className="flex justify-center items-center mb-4">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 mr-2"
        >
          <option value="">Select Year</option>
          <option value="2023">2080</option>
          <option value="2024">2081</option>
        </select>
        <button
          onClick={() => setShowCreateNotice(true)}
          className="bg-[#8AA4D6] hover:bg-[#253553] hover:text-white text-gray-700 py-2 px-4 rounded text-xs absolute right-4"
        >
          +Create Notice
        </button>
      </div>

      {showCreateNotice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[101]">
          <Createnotice onClose={() => setShowCreateNotice(false)} />
        </div>
      )}

      {showTable && (
        <div className="overflow-x-auto relative">
          <div className="max-h-[500px] overflow-y-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0 z-30">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 sticky left-0 z-30 bg-gray-50 dark:bg-gray-700"
                  >
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Date Created
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Image
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-6 py-4 sticky left-0 z-20 bg-white dark:bg-gray-800">
                    1
                  </td>
                  <td className="px-6 py-4">{selectedYear}</td>
                  <td className="px-6 py-4">Sample Notice</td>
                  <td className="px-6 py-4">image.jpg</td>
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
                  <td className="px-6 py-4 sticky left-0 z-20 bg-white dark:bg-gray-800">
                    1
                  </td>
                  <td className="px-6 py-4">{selectedYear}</td>
                  <td className="px-6 py-4">Sample Notice</td>
                  <td className="px-6 py-4">image.jpg</td>
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
                  <td className="px-6 py-4 sticky left-0 z-20 bg-white dark:bg-gray-800">
                    1
                  </td>
                  <td className="px-6 py-4">{selectedYear}</td>
                  <td className="px-6 py-4">Sample Notice</td>
                  <td className="px-6 py-4">image.jpg</td>
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
                  <td className="px-6 py-4 sticky left-0 z-20 bg-white dark:bg-gray-800">
                    1
                  </td>
                  <td className="px-6 py-4">{selectedYear}</td>
                  <td className="px-6 py-4">Sample Notice</td>
                  <td className="px-6 py-4">image.jpg</td>
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
                  <td className="px-6 py-4 sticky left-0 z-20 bg-white dark:bg-gray-800">
                    1
                  </td>
                  <td className="px-6 py-4">{selectedYear}</td>
                  <td className="px-6 py-4">Sample Notice</td>
                  <td className="px-6 py-4">image.jpg</td>
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
                  <td className="px-6 py-4 sticky left-0 z-20 bg-white dark:bg-gray-800">
                    1
                  </td>
                  <td className="px-6 py-4">{selectedYear}</td>
                  <td className="px-6 py-4">Sample Notice</td>
                  <td className="px-6 py-4">image.jpg</td>
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
                  <td className="px-6 py-4 sticky left-0 z-20 bg-white dark:bg-gray-800">
                    1
                  </td>
                  <td className="px-6 py-4">{selectedYear}</td>
                  <td className="px-6 py-4">Sample Notice</td>
                  <td className="px-6 py-4">image.jpg</td>
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
                  <td className="px-6 py-4 sticky left-0 z-20 bg-white dark:bg-gray-800">
                    1
                  </td>
                  <td className="px-6 py-4">{selectedYear}</td>
                  <td className="px-6 py-4">Sample Notice</td>
                  <td className="px-6 py-4">image.jpg</td>
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
                  <td className="px-6 py-4 sticky left-0 z-20 bg-white dark:bg-gray-800">
                    1
                  </td>
                  <td className="px-6 py-4">{selectedYear}</td>
                  <td className="px-6 py-4">Sample Notice</td>
                  <td className="px-6 py-4">image.jpg</td>
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
                  <td className="px-6 py-4 sticky left-0 z-20 bg-white dark:bg-gray-800">
                    1
                  </td>
                  <td className="px-6 py-4">{selectedYear}</td>
                  <td className="px-6 py-4">Sample Notice</td>
                  <td className="px-6 py-4">image.jpg</td>
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
                  <td className="px-6 py-4 sticky left-0 z-20 bg-white dark:bg-gray-800">
                    1
                  </td>
                  <td className="px-6 py-4">{selectedYear}</td>
                  <td className="px-6 py-4">Sample Notice</td>
                  <td className="px-6 py-4">image.jpg</td>
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
                  <td className="px-6 py-4 sticky left-0 z-20 bg-white dark:bg-gray-800">
                    1
                  </td>
                  <td className="px-6 py-4">{selectedYear}</td>
                  <td className="px-6 py-4">Sample Notice</td>
                  <td className="px-6 py-4">image.jpg</td>
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
                  <td className="px-6 py-4 sticky left-0 z-20 bg-white dark:bg-gray-800">
                    1
                  </td>
                  <td className="px-6 py-4">{selectedYear}</td>
                  <td className="px-6 py-4">Sample Notice</td>
                  <td className="px-6 py-4">image.jpg</td>
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
                  <td className="px-6 py-4 sticky left-0 z-20 bg-white dark:bg-gray-800">
                    1
                  </td>
                  <td className="px-6 py-4">{selectedYear}</td>
                  <td className="px-6 py-4">Sample Notice</td>
                  <td className="px-6 py-4">image.jpg</td>
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
