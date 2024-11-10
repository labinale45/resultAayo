"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaBell, FaCalendar, FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";


function Notice() {
  const [notices, setNotices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedYear, setSelectedYear] = useState("");
  const [years, setYears] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [state] = useState("notices");

  const fetchYears = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/auth/year?status=${state}`);
      const data = await response.json();
      setYears(data);
      // Set the latest year by default (first year in the sorted array)
      if (data && data.length > 0) {
        setSelectedYear(data[0]);
      }
    } catch (error) {
      setError('Failed to fetch years');
    }
  };

  const fetchNotices = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:4000/api/auth/records/${selectedYear}?status=${state}`
      );
      const data = await response.json();
      setNotices(data);
    } catch (error) {
      setError('Failed to fetch notices');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchYears();
  }, []);

  useEffect(() => {
    if (selectedYear) {
      fetchNotices();
    }
  }, [selectedYear]);

  const filteredNotices = notices.filter(notice => {
    const matchesSearch = notice.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || 
                         (filter === "important" && notice.is_important);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="relative overflow-x-hidden min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-800 dark:to-gray-900">

      <div className="absolute inset-x-0 top-0 z-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
          <motion.path
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="dark:fill-[#253553]"
            fill="#437FC7"
            fillOpacity="1"
            d="M0,32L1440,160L1440,0L0,0Z"
          ></motion.path>
        </svg>
      </div>


      <div className="relative z-10 pt-20 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="">Select Year</option>
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search notices..."
              className="w-full px-4 py-2 pl-10 rounded-lg border focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === "all"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("important")}
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === "important"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              Important
            </button>
          </div>
        </div>


        {isLoading && (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          </div>
        )}

        {error && (
          <div className="text-red-500 text-center">{error}</div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >

          {filteredNotices.map((notice) => (
            <motion.div

              key={notice.id}
              whileHover={{ scale: 1.02 }}

              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
            >
              <div className="relative">

















                {notice.img_url && (
                  <div className="aspect-video relative cursor-pointer" onClick={() => setSelectedImage(notice.img_url)}>
                    <Image
                      src={notice.img_url}
                      alt={notice.title}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform hover:scale-105"
                    />
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-3">
                  <FaCalendar className="text-sm" />

                  <span className="text-sm">{notice.created_at}</span>
                </div>
                
                <h3 className="text-xl font-semibold mb-3 dark:text-white">

                  {notice.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4">

                  {notice.description}
                </p>




              </div>
            </motion.div>
          ))}
        </motion.div>

        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-[90%] max-h-[90vh]">
              <img 
                src={selectedImage} 
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
    </div>
  );
}

export default Notice;