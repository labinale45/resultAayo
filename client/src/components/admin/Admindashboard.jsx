"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaUsers,
  FaChalkboardTeacher,
  FaGraduationCap,
  FaBook,
} from "react-icons/fa";
import dynamic from 'next/dynamic';
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
import Addteacher from "@/components/admin/Addteacher";
import Addstudent from "@/components/admin/Addstudent";
import Createexam from "@/components/admin/Createexam";
import Createclass from "@/components/admin/Createclass";

const Line = dynamic(() => import('react-chartjs-2').then(mod => mod.Line), {
  ssr: false,
  loading: () => <div>Loading Chart...</div>
});

export default function Admindashboard() {
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
  const [totalCounts, setTotalCounts] = useState({ students: 0, teachers: 0 });
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showCreateExam, setShowCreateExam] = useState(false);
  const [showCreateClass, setShowCreateClass] = useState(false);

  useEffect(() => {
    // Register ChartJS components only on client-side
    ChartJS.register(
      CategoryScale,
      LinearScale,
      PointElement,
      LineElement,
      Title,
      Tooltip,
      Legend
    );

    const fetchDashboardData = async () => {
      try {
        // Fetch total counts
        const countsResponse = await fetch('http://localhost:4000/api/auth/dashboard/counts');
        const { totalStudents, totalTeachers } = await countsResponse.json();
        setTotalCounts({ students: totalStudents, teachers: totalTeachers });

        // Fetch historical data
        const historyResponse = await fetch('http://localhost:4000/api/auth/dashboard/history');
        const historicalData = await historyResponse.json();
        
        setChartData({
          labels: historicalData.map(([date]) => date),
          datasets: [
            {
              ...chartData.datasets[0],
              data: historicalData.map(([, counts]) => counts.students),
            },
            {
              ...chartData.datasets[1],
              data: historicalData.map(([, counts]) => counts.teachers),
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          padding: 20,
          font: {
            size: 14,
            weight: 'bold'
          },
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      title: {
        display: true,
        text: "Student and Teacher Count Over Last 7 Days",
        font: {
          size: 20,
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 30
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#000',
        bodyColor: '#000',
        borderColor: '#e0e0e0',
        borderWidth: 1,
        padding: 10,
        displayColors: true,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 12
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          drawBorder: false
        },
        ticks: {
          font: {
            size: 12
          },
          stepSize: 1
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart'
    }
  };


  return (    <div className="flex flex-col min-h-screen bg-white  dark:bg-[#B3B4BE] dark:text-white">
      <header className="bg-white shadow dark:bg-[#B3B4BE]">
        <div className="max-w-7xl mx-auto py-7 px-4 bg-white dark:bg-[#B3B4BE] dark:text-white">
          <h1 className="text-3xl font-bold text-gray-900">
            School Admin Dashboard
          </h1>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<FaUsers className="text-blue-500" />}
            title="Total Students"
            value={totalCounts.students}
          />
          <StatCard
            icon={<FaChalkboardTeacher className="text-green-500" />}
            title="Total Teachers"
            value={totalCounts.teachers}
          />
        </div>

        <div className="mt-3 flex flex-col lg:flex-row gap-8 py-3 ">
          <div className="lg:w-2/3 bg-gray-100 p-6 rounded-lg shadow">
            <div className="h-[400px]">
              <Line options={options} data={chartData} />
            </div>
          </div>

          <div className="lg:w-1/3">
            <QuickActions
              onAddStudent={() => setShowAddStudent(true)}
              onAddTeacher={() => setShowAddTeacher(true)}
              onCreateClass={() => setShowCreateClass(true)}
              onCreateExam={() => setShowCreateExam(true)}
            />

            {showAddStudent && (
              <div className="fixed inset-0 bg-black bg-opacity-65 backdrop-blur-sm flex items-center justify-center z-[101]">
                <Addstudent onClose={() => setShowAddStudent(false)} />
              </div>
            )}
            {showAddTeacher && (
              <div className="fixed inset-0 bg-black bg-opacity-65 backdrop-blur-sm  flex items-center justify-center z-[101]">
                <Addteacher onClose={() => setShowAddTeacher(false)} />
              </div>
            )}
            {showCreateClass && (
              <div className="fixed inset-0 bg-black bg-opacity-65 backdrop-blur-sm flex items-center justify-center z-[101]">
                <Createclass onClose={() => setShowCreateClass(false)} />
              </div>
            )}
            {showCreateExam && (
              <div className="fixed inset-0 bg-black bg-opacity-65 backdrop-blur-sm flex items-center justify-center z-[101]">
                <Createexam onClose={() => setShowCreateExam(false)} />
              </div>
            )}
          </div>
        </div>
      </main>
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

function QuickActions({
  onAddStudent,
  onAddTeacher,
  onCreateClass,
  onCreateExam,
}) {
  return (
    <div className="bg-gray-100 shadow rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <button
          onClick={onAddStudent}
          className="bg-[#7ba0e4] dark:bg-[#8AA4D6] hover:bg-[#4c94ec] dark:hover:bg-[#253553] hover:text-white text-gray-700 font-semibold py-2 px-4 rounded text-center"
        >
          Add Student
        </button>
        <button
          onClick={onAddTeacher}
          className="bg-[#7ba0e4] dark:bg-[#8AA4D6] hover:bg-[#4c94ec] dark:hover:bg-[#253553] hover:text-white text-gray-700 font-semibold py-2 px-4 rounded text-center"
        >
          Add Teacher
        </button>
        <button
          onClick={onCreateClass}
          className="bg-[#7ba0e4] dark:bg-[#8AA4D6] hover:bg-[#4c94ec] dark:hover:bg-[#253553] hover:text-white text-gray-700 font-semibold py-2 px-4 rounded text-center"
        >
          Create Class
        </button>
        <button
          onClick={onCreateExam}
          className="bg-[#7ba0e4] dark:bg-[#8AA4D6] hover:bg-[#4c94ec] dark:hover:bg-[#253553] hover:text-white text-gray-700 font-semibold py-2 px-4 rounded text-center"
        >
          Create Exam
        </button>
      </div>
    </div>
  );
}
