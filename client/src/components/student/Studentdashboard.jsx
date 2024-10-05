"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaUsers,
  FaChalkboardTeacher,
  FaGraduationCap,
  FaBook,
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
import Viewprofile from "../Viewprofile";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Studentdashboard() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Students",
        data: [],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Teachers",
        data: [],
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  });

  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const fetchData = () => {
      const labels = [];
      const studentData = [];
      const teacherData = [];

      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString());
        studentData.push(Math.floor(Math.random() * 50) + 100);
        teacherData.push(Math.floor(Math.random() * 10) + 20);
      }

      setChartData({
        labels,
        datasets: [
          {
            ...chartData.datasets[0],
            data: studentData,
          },
          {
            ...chartData.datasets[1],
            data: teacherData,
          },
        ],
      });
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Student and Teacher Count Over Last 7 Days",
      },
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#B3B4BE] dark:text-white">
      <header className="bg-white shadow dark:bg-[#B3B4BE]">
        <div className="max-w-7xl mx-auto py-7 px-4 bg-white dark:bg-[#B3B4BE] dark:text-white">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            School Student Dashboard
          </h1>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="mt-3 flex flex-col lg:flex-row gap-8 py-3 ">
          <div className="lg:w-2/3 bg-gray-100 p-6 rounded-lg shadow">
            <div className="h-[400px]">
              <Line options={options} data={chartData} />
            </div>
          </div>
          <div className="lg:w-1/3">
            <QuickActions onViewProfile={() => setShowProfile(true)} />
          </div>
        </div>
      </main>
      {showProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-65 backdrop-blur-sm flex items-center justify-center z-[101]">
          <Viewprofile onClose={() => setShowProfile(false)} />
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="bg-gray-100 overflow-hidden shadow rounded-lg p-5">
      <div className="flex items-center">
        <div className="flex-shrink-0">{icon}</div>
        <div className="ml-5 w-0 flex-1">
          <dt className="text-sm font-medium text-gray-500 truncate">
            {title}
          </dt>
          <dd className="text-lg font-semibold text-gray-900">{value}</dd>
        </div>
      </div>
    </div>
  );
}

function QuickActions({ onViewProfile }) {
  return (
    <div className="bg-gray-100 shadow rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <Link
          href="/student/Sgradesheet"
          className="bg-[#7ba0e4] dark:bg-[#8AA4D6] hover:bg-[#4c94ec] dark:hover:bg-[#253553] hover:text-white text-gray-700 font-semibold py-2 px-4 rounded text-center"
        >
          Gradesheet
        </Link>
        <button
          onClick={onViewProfile}
          className="bg-[#7ba0e4] dark:bg-[#8AA4D6] hover:bg-[#4c94ec] dark:hover:bg-[#253553] hover:text-white text-gray-700 font-semibold py-2 px-4 rounded text-center"
        >
          Profile
        </button>
      </div>
    </div>
  );
}
