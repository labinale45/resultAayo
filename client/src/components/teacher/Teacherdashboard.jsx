"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  FaUsers,
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaClipboardList,
  FaChartLine,
  FaDownload,
} from "react-icons/fa";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Teacherdashboard() {
  const route = useRouter();
  const [chartData, setChartData] = useState({
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Students Performance",
        data: [65, 70, 68, 75, 72, 80, 78, 85, 82, 88, 85, 90],
        borderColor: "rgb(99, 179, 237)",
        backgroundColor: "rgba(99, 179, 237, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  });

  const [stats, setStats] = useState({
    totalStudents: 1298,
    totalClasses: 12,
    averagePerformance: 90,
    upcomingTests: 5,
  });

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        border: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
      }
    },
    elements: {
      point: {
        radius: 2,
      },
    },
  };

  const activities = [
    {
      status: "Active",
      title: "Chinese Translator",
      company: "with Training (Jurong East, Singapore)",
      type: "Remote",
      date: "Contract",
    },
    {
      status: "Pending",
      title: "Frontend Developer",
      company: "Nirvana Digital Indonesia (Bandung, South Jakarta)",
      type: "Freelance",
      date: "3 months ago",
    },
    {
      status: "Interview",
      title: "Website Designer",
      company: "Argona Studio (Sydney, Australia)",
      type: "Full-time",
      date: "2 weeks ago",
    },
  ];


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

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto py-4 px-6 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-slate-800">
            Welcome back, {userData?.first_name + " " + userData?.last_name}! 👋
          </h1>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Analytics</h3>
            <div className="relative w-48 h-48 mx-auto">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="10"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#60A5FA"
                  strokeWidth="10"
                  strokeDasharray={`${90 * 2.83} ${100 * 2.83}`}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
                <text
                  x="50"
                  y="50"
                  textAnchor="middle"
                  dy="0.3em"
                  className="text-3xl font-bold"
                >
                  90%
                </text>
              </svg>
            </div>
            <div className="mt-4 flex justify-between text-sm text-slate-600">
              <div>
                <p>Percentage</p>
                <p className="font-semibold text-slate-900">90%</p>
              </div>
              <div>
                <p>Total Students</p>
                <p className="font-semibold text-slate-900">1,298</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold">Student Record</h3>
                <p className="text-sm text-slate-500">Total Student in 2024: 330</p>
              </div>
            </div>
            <div className="h-[300px]">
              <Line options={options} data={chartData} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<FaUsers className="text-blue-500 text-xl" />}
            title="Total Students"
            value={stats.totalStudents}
          />
          <StatCard
            icon={<FaChalkboardTeacher className="text-green-500 text-xl" />}
            title="Classes Assigned"
            value={stats.totalClasses}
          />
          <StatCard
            icon={<FaChartLine className="text-purple-500 text-xl" />}
            title="Average Performance"
            value={`${stats.averagePerformance}%`}
          />
          <StatCard
            icon={<FaCalendarAlt className="text-red-500 text-xl" />}
            title="Upcoming Tests"
            value={stats.upcomingTests}
          />
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">History</h3>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <ActivityItem key={index} {...activity} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-slate-100 rounded-xl">{icon}</div>
        <div>
          <p className="text-sm text-slate-600">{title}</p>
          <p className="text-xl font-semibold mt-1">{value}</p>
        </div>
      </div>
    </div>
  );
}

function ActivityItem({ status, title, company, type, date }) {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-600';
      case 'pending':
        return 'bg-yellow-100 text-yellow-600';
      case 'interview':
        return 'bg-blue-100 text-blue-600';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0">
      <div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${getStatusColor(status)}`}>
            {status}
          </span>
          <h4 className="font-medium">{title}</h4>
        </div>
        <p className="text-sm text-slate-600 mt-1">{company}</p>
      </div>
      <div className="flex items-center gap-3 text-sm text-slate-600">
        <span>{type}</span>
        <span>•</span>
        <span>{date}</span>
      </div>
    </div>
  );
}