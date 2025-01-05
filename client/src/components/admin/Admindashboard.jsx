"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaUsers,
  FaChalkboardTeacher,
  FaGraduationCap,
  FaBook,
} from "react-icons/fa";
import dynamic from "next/dynamic";
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

const Line = dynamic(() => import("react-chartjs-2").then((mod) => mod.Line), {
  ssr: false,
  loading: () => <div>Loading Chart...</div>,
});

export default function Admindashboard() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Student",
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
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });
  const [selectedClass, setSelectedClass] = useState("");
  const [classes, setClasses] = useState([]);

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
    ); // Cleanup on unmount
    const fetchDashboardData = async () => {
      try {
        // Fetch total counts
        const countsResponse = await fetch(
          "http://localhost:4000/api/auth/dashboard/counts"
        );
        if (!countsResponse.ok) throw new Error("Failed to fetch counts");
        const countsData = await countsResponse.json();
        setTotalCounts({
          students: countsData.totalStudents || 0,
          teachers: countsData.totalTeachers || 0,
        });

        // Fetch historical data
        const historyResponse = await fetch(
          `http://localhost:4000/api/auth/dashboard/history?startDate=${
            dateRange.startDate
          }&endDate=${dateRange.endDate}${
            selectedClass ? `&class=${selectedClass}` : ""
          }`
        );
        if (!historyResponse.ok)
          throw new Error("Failed to fetch historical data");
        const historicalData = await historyResponse.json();

        if (!Array.isArray(historicalData)) {
          console.error("Invalid historical data format:", historicalData);
          return;
        }
        // Process historical data with persistent counts
        const processedHistoricalData = processChartData(historicalData);

        setChartData({
          labels: processedHistoricalData.labels,
          datasets: [
            {
              label: "Students",
              data: processedHistoricalData.studentData,
              borderColor: "rgb(255, 99, 132)",
              backgroundColor: "rgba(255, 99, 132, 0.5)",
              tension: 0.4,
            },
            {
              label: "Teachers",
              data: processedHistoricalData.teacherData,
              borderColor: "rgb(53, 162, 235)",
              backgroundColor: "rgba(53, 162, 235, 0.5)",
              tension: 0.4,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    fetchDashboardData();
  }, [dateRange.startDate, dateRange.endDate, selectedClass]);

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
            weight: "bold",
          },
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      title: {
        display: true,
        text: `Student and Teacher Count ${
          selectedClass ? `for Class ${selectedClass}` : ""
        } (${new Date(dateRange.startDate).toLocaleDateString()} - ${new Date(
          dateRange.endDate
        ).toLocaleDateString()})`,
        font: {
          size: 20,
          weight: "bold",
        },
        padding: {
          top: 10,
          bottom: 30,
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#000",
        bodyColor: "#000",
        borderColor: "#e0e0e0",
        borderWidth: 1,
        padding: 10,
        displayColors: true,
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.parsed.y}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
          drawBorder: false,
        },
        ticks: {
          font: {
            size: 12,
          },
          stepSize: 1,
        },
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
    animation: {
      duration: 1000,
      easing: "easeInOutQuart",
    },
  };

  const fetchClasses = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/auth/classes");
      if (!response.ok) throw new Error("Failed to fetch classes");
      const data = await response.json();
      setClasses(data);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  // New helper function to process chart data
  const processChartData = (historicalData) => {
    const labels = [];
    const studentData = [];
    const teacherData = [];

    let lastStudentCount = 0;
    let lastTeacherCount = 0;

    // Sort historical data by date to ensure chronological processing
    const sortedData = historicalData.sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    sortedData.forEach((item) => {
      const date = new Date(item.date).toLocaleDateString();

      // Update last known counts
      if (item.counts.students !== undefined) {
        lastStudentCount = item.counts.students;
      }
      if (item.counts.teachers !== undefined) {
        lastTeacherCount = item.counts.teachers;
      }

      // Add to labels and data arrays
      labels.push(date);
      studentData.push(lastStudentCount);
      teacherData.push(lastTeacherCount);
    });

    return {
      labels,
      studentData,
      teacherData,
    };
  };

  const handleDateRangeChange = (type, value) => {
    if (type === "startDate" && new Date(value) > new Date(dateRange.endDate)) {
      alert("Start date cannot be after end date");
      return;
    }
    if (type === "endDate" && new Date(value) < new Date(dateRange.startDate)) {
      alert("End date cannot be before start date");
      return;
    }
    setDateRange((prev) => ({ ...prev, [type]: value }));
  };

  useEffect(() => {
    const fetchAllData = async () => {
      await Promise.all([fetchClasses(), fetchDashboardData()]);
    };
    fetchAllData();
  }, [dateRange, selectedClass]);

  return (
    <div className="flex flex-col min-h-screen bg-white  dark:bg-[#B3B4BE] dark:text-white">
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
            <div className="mb-6 bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <div className="flex flex-wrap gap-6 items-center justify-between">
                {/* Date Range Section */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <input
                      type="date"
                      value={dateRange.startDate}
                      onChange={(e) =>
                        handleDateRangeChange("startDate", e.target.value)
                      }
                      max={new Date().toISOString().split("T")[0]}
                      className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    />
                  </div>
                  <span className="text-gray-500">to</span>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <input
                      type="date"
                      value={dateRange.endDate}
                      onChange={(e) =>
                        handleDateRangeChange("endDate", e.target.value)
                      }
                      max={new Date().toISOString().split("T")[0]}
                      className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Class Selection Section */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  >
                    <option value="">All Classes</option>
                    {classes.map((cls) => (
                      <option key={cls.grade} value={cls.grade}>
                        Class {cls.grade}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
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
