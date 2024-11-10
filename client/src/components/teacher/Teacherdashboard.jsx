"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import {
  FaUsers,
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaClipboardList,
  FaChartLine
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
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Students Performance",
        data: [],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Class Average",
        data: [],
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  });

  const [stats, setStats] = useState({
    totalStudents: 0,
    totalClasses: 0,
    averagePerformance: 0,
    upcomingTests: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('/api/teacher/dashboard-stats');
        setStats(response.data);
        
        // Fetch performance data for chart
        const performanceData = await axios.get('/api/teacher/performance-trends');
        updateChartData(performanceData.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  const updateChartData = (data) => {
    setChartData({
      labels: data.dates,
      datasets: [
        {
          ...chartData.datasets[0],
          data: data.studentPerformance,
        },
        {
          ...chartData.datasets[1],
          data: data.classAverage,
        },
      ],
    });
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Performance Trends",
        color: 'rgb(51, 51, 51)'
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-800">
      <header className="bg-white shadow dark:bg-gray-700">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Teacher Dashboard
          </h1>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<FaUsers className="text-blue-500 text-2xl" />}
            title="Total Students"
            value={stats.totalStudents}
          />
          <StatCard
            icon={<FaChalkboardTeacher className="text-green-500 text-2xl" />}
            title="Classes Assigned"
            value={stats.totalClasses}
          />
          <StatCard
            icon={<FaChartLine className="text-purple-500 text-2xl" />}
            title="Average Performance"
            value={`${stats.averagePerformance}%`}
          />
          <StatCard
            icon={<FaCalendarAlt className="text-red-500 text-2xl" />}
            title="Upcoming Tests"
            value={stats.upcomingTests}
          />
        </div>

        <div className="mt-8 flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3 bg-white dark:bg-gray-700 p-6 rounded-lg shadow">
            <div className="h-[400px]">
              <Line options={options} data={chartData} />
            </div>
          </div>

          <div className="lg:w-1/3">
            <QuickActions />
            <RecentActivities />
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="bg-white dark:bg-gray-700 overflow-hidden shadow rounded-lg p-5 transition-transform duration-300 hover:scale-105">
      <div className="flex items-center">
        <div className="flex-shrink-0">{icon}</div>
        <div className="ml-5 w-0 flex-1">
          <dt className="text-sm font-medium text-gray-500 dark:text-gray-300 truncate">
            {title}
          </dt>
          <dd className="text-lg font-semibold text-gray-900 dark:text-white">{value}</dd>
        </div>
      </div>
    </div>
  );
}

function QuickActions() {
  return (
    <div className="bg-white dark:bg-gray-700 shadow rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/teacher/marks-entry"
          className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-300"
        >
          <FaClipboardList className="mr-2" /> Marks Entry
        </Link>
        <Link
          href="/teacher/ledger"
          className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-300"
        >
          <FaCalendarAlt className="mr-2" /> Ledger
        </Link>
        <Link
          href="/teacher/students"
          className="flex items-center justify-center bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-300"
        >
          <FaUsers className="mr-2" /> Students
        </Link>
      </div>
    </div>
  );
}

function RecentActivities() {
  return (
    <div className="bg-white dark:bg-gray-700 shadow rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activities</h3>
      <div className="space-y-4">
        {/* Add your recent activities list here */}
      </div>
    </div>
  );
}
