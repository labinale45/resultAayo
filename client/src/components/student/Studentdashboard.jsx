"use client";

import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import Viewprofile from "@/components/Viewprofile";
import Image from "next/image";


import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState({
    analytics: { percentage: 90, count: 1298 },
    history: [],
    studentRecord: 330
  });
  const [showViewProfile, setShowViewProfile] = useState(false);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);


  useEffect(() => {
  
    const fetchUserProfile = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData'));

        if (!userData?.username) {
          throw new Error('No user data found');
        }

        const response = await fetch(`http://localhost:4000/api/auth/profile/${userData.username}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError(err.message);
      } 
    };
    fetchUserProfile();
  }, []);

  // Analytics circle progress component
  const AnalyticsCard = ({ percentage, count }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full" viewBox="0 0 36 36">
          <path
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#eee"
            strokeWidth="3"
          />
          <path
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#6391c9"
            strokeWidth="4"
            strokeDasharray={`${percentage}, 100`}
          />
        </svg>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <span className="text-2xl font-bold">{percentage}%</span>
        </div>
      </div>
      <div className="mt-4">
        <span className="text-lg font-semibold">{count}</span>
      </div>
    </div>
  );

  // Chart configuration
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Student Record',
        data: [250, 280, 300, 330, 290, 330],
        fill: true,
        borderColor: '#6391c9',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
 
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Welcome back, {userData?.first_name + " " + userData?.last_name}! 👋</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Analytics Cards */}
        <AnalyticsCard 
          percentage={studentData.analytics.percentage}
          count={studentData.analytics.count}
        />
        <AnalyticsCard 
          percentage={studentData.analytics.percentage}
          count={studentData.analytics.count}
        />
        
        {/* Profile Card */}
        <div className="dark:bg-[#1F2937] bg-[#6391c9] text-white p-6 rounded-lg">
          <div className="flex flex-col items-center">
             <Image
                src={ userData?.role === "Admin" ? "/assets/Admin.png" :  userData?.img_url || "/assets/profile.png"}
                width={40}
                height={50}
                alt={userData?.first_name + " " + userData?.last_name}
                className="w-20 h-20 rounded-full mb-4"
              />
            <h3 className="text-xl font-semibold"> Class : {userData?.class}</h3>
            <button
                  onClick={() => {
                    setShowViewProfile(true);
                  }}
                  className="mt-4 px-4 py-2 border hover:bg-slate-600 border-white rounded-lg"
                >
                  View Profile
                </button>
          </div>
        </div>
      </div>

      {/* Student Record Chart */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Student Record</h2>
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* History Section */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">History</h2>
        <div className="space-y-4">
          {/* Sample history items */}
          <HistoryItem 
            title="Senior UI/UX Designer"
            date="February 2024"
            status="Applied"
          />
          <HistoryItem 
            title="Frontend Developer"
            date="January 2024"
            status="Completed"
          />
        </div>
      </div>
    
      {showViewProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[101]">
          <Viewprofile onClose={() => setShowViewProfile(false)} />
        </div>
      )}
    </div>
  );
};
// History item component
const HistoryItem = ({ title, date, status }) => (
  <div className="flex items-center justify-between p-4 border rounded-lg">
    <div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-gray-500">{date}</p>
    </div>
    <span className={`px-3 py-1 rounded-full ${
      status === 'Applied' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
    }`}>
      {status}
    </span>
  </div>
 

);

export default StudentDashboard;