"use client";

import React, { useState, useEffect } from "react";
import Addnotice from "@/components/admin/Createnotice";
import Image from "next/image";

export default function Noticetable() {
  const [showAddNotice, setShowAddNotice] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");
  const [years, setYears] = useState([]);
  const [notices, setNotices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [state, setState] = useState("notices");
  const [selectedImage, setSelectedImage] = useState(null);
console.log("notices", notices)
 



  useEffect(() => {
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
    const fetchNotices = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:4000/api/auth/records/${selectedYear}?status=${state}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        setNotices(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    if(selectedYear) { fetchNotices(); }
  }, [state,selectedYear]);

  

 



  return (
    <div className="relative overflow-x-auto mt-7">
      <div className="flex justify-center items-center mb-4">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 mr-2"
        >
          <option value="">Select Year</option>
           {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
             ))}
        </select>
        <button
          onClick={() => setShowAddNotice(true)}
          className="bg-[#7ba0e4] dark:bg-[#8AA4D6] hover:bg-[#4c94ec] dark:hover:bg-[#253553] hover:text-white  text-center py-2 px-4 rounded text-xs absolute right-4"
        >
          +Create Notice
        </button>
      </div>

      {showAddNotice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm  flex items-center justify-center z-[101]">
          <Addnotice onClose={() => setShowAddNotice(false)} />
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="text-red-500">
          {error}
        </div>
      )}

      {notices.length > 0 && (
        <div className="overflow-x-auto relative">
          <div className="max-h-[450px] overflow-y-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400 sticky top-0 z-30">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Description
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
                {notices.map((notice) => (
                  <tr key={notice.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4 sticky left-0 z-20 bg-white dark:bg-gray-800">
                      {notice.description}
                    </td>
                    <td className="px-6 py-4">{notice.created_at}</td>
                    <td className="px-6 py-4">{notice.title}</td>
                   <td className="px-6 py-4">
  {notice.img_url ? (
    <div
      className="relative w-24 h-24 cursor-pointer"
      onClick={() => setSelectedImage(notice.img_url)}
    >
    <Image
  src={ notice?.img_url}
  alt={notice.title}
  layout="fill"
  objectFit="cover"
  className="rounded"
  onError={(e) => {
    console.error('Failed to load image:', notice.img_url);
    e.target.src = "/assets/profile.png";
  }}
  placeholder="blur"
  blurDataURL="/placeholder-image.jpg"
/>
    </div>
  ) : (
    <span className="text-gray-400">No image</span>
  )}
</td> 
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

      {/* Image Preview Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[102]"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-[90%] max-h-[90vh]">
            <Image
              src={selectedImage}
              width={1000}
              height={1000} 
              alt="Preview"
              className="max-w-full max-h-[90vh] object-contain"
            />
            <button 
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2"
              onClick={() => setSelectedImage(null)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
