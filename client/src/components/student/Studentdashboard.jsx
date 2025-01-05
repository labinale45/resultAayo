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
  const [selectedExamType, setSelectedExamType] = useState('');
  const [examTypes, setExamTypes] = useState([
    { id: 'first-term', name: 'First Term' },
    { id: 'mid-term', name: 'Mid Term' },
    { id: 'final-term', name: 'Final Term' }
  ]);
  
  const [marksData, setMarksData] = useState({
    theory: [75, 82, 68, 90, 85],
    practical: [80, 85, 70, 88, 92],
    overallAverage: 82
  });

  const [recentExams, setRecentExams] = useState([
    {
      id: 1,
      examType: 'First Term',
      subject: 'Mathematics',
      date: '2024-02-15',
      score: 85
    },
    {
      id: 2,
      examType: 'First Term',
      subject: 'Science',
      date: '2024-02-10',
      score: 92
    }
  ]);

  const [upcomingExams, setUpcomingExams] = useState([
    {
      id: 1,
      examType: 'Mid Term',
      subject: 'English',
      date: '2024-03-20',
      time: '10:00 AM'
    },
    {
      id: 2,
      examType: 'Mid Term',
      subject: 'Social Studies',
      date: '2024-03-25',
      time: '11:30 AM'
    }
  ]);

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

  const AnalyticsCard = ({ percentage, label }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full" viewBox="0 0 36 36">
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#eee"
            strokeWidth="3"
          />
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
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
        <span className="text-lg font-semibold">{label}</span>
      </div>
    </div>
  );

  const ExamCard = ({ title, exams, isUpcoming }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="space-y-4">
        {exams.map((exam) => (
          <div key={exam.id} className="border-l-4 border-[#6391c9] p-4 bg-gray-50 rounded">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{exam.subject}</h3>
                <p className="text-sm text-gray-600">{exam.examType}</p>
                <p className="text-sm text-gray-500">
                  {new Date(exam.date).toLocaleDateString()}
                  {isUpcoming && ` - ${exam.time}`}
                </p>
              </div>
              {!isUpcoming && (
                <div className="text-lg font-bold text-[#6391c9]">
                  {exam.score}%
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const chartData = {
    labels: ['Science', 'Math', 'English', 'Social', 'Computer'],
    datasets: [
      {
        label: 'Theory Marks',
        data: marksData.theory,
        borderColor: '#6391c9',
        backgroundColor: 'rgba(99, 145, 201, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Practical Marks',
        data: marksData.practical,
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        tension: 0.4,
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };
 
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Welcome back, {userData?.first_name + " " + userData?.last_name}! 👋</h1>
      </div>

      <div className="mb-6">
        <select 
          value={selectedExamType}
          onChange={(e) => setSelectedExamType(e.target.value)}
          className="p-2 border rounded-lg w-48"
        >
          <option value="">Select Exam Type</option>
          {examTypes.map((type) => (
            <option key={type.id} value={type.name}>
              {type.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnalyticsCard 
          percentage={marksData.overallAverage}
          label="Overall Average"
        />
        <AnalyticsCard 
          percentage={Math.round(marksData.theory.reduce((a, b) => a + b) / marksData.theory.length)}
          label="Theory Average"
        />
        
        <div className="dark:bg-[#1F2937] bg-[#6391c9] text-white p-6 rounded-lg">
          <div className="flex flex-col items-center">
             <Image
                src={userData?.role === "Admin" ? "/assets/Admin.png" : userData?.img_url || "/assets/profile.png"}
                width={40}
                height={50}
                alt={userData?.first_name + " " + userData?.last_name}
                className="w-20 h-20 rounded-full mb-4"
              />
            <h3 className="text-xl font-semibold">Class: {userData?.class}</h3>
            <button
              onClick={() => setShowViewProfile(true)}
              className="mt-4 px-4 py-2 border hover:bg-slate-600 border-white rounded-lg"
            >
              View Profile
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Performance Analysis</h2>
        <Line data={chartData} options={chartOptions} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <ExamCard 
          title="Recent Exams" 
          exams={recentExams} 
          isUpcoming={false}
        />
        <ExamCard 
          title="Upcoming Exams" 
          exams={upcomingExams} 
          isUpcoming={true}
        />
      </div>

      {showViewProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[101]">
          <Viewprofile onClose={() => setShowViewProfile(false)} />
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
