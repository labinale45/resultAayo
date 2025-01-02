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
    labels: [],
    datasets: [{
      label: "Subject Performance",
      data: [],
      borderColor: "rgb(99, 179, 237)",
      backgroundColor: "rgba(99, 179, 237, 0.1)",
      tension: 0.4,
      fill: true,
    }]
  });
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [teacherId, setTeacherId] = useState(null);
  const [classes, setClasses] = useState([]);
  const [studentCount, setStudentCount] = useState(0);
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [subjectPerformance, setSubjectPerformance] = useState({});
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalClasses: 12,
    averagePerformance: 90,
    upcomingTests: 5,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      if (decodedToken.role === "teachers") {
        setTeacherId(decodedToken.id);
      }
    }
  }, []);

  useEffect(() => {
    if (teacherId) {
      fetchClass(teacherId);
    }
  }, [teacherId]);

  const fetchClass = async (teacherId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/auth/teacher/${teacherId}/class-teacher`);
      if (!response.ok) throw new Error("Failed to fetch classes");
      const classData = await response.json();
      const classes = classData.map(item => ({
        id: item.class,
        name: `${item.class}`,
        section: item.section,
        year: new Date(item.updated_at).getFullYear(),
        totalStudent: item.studentCount
      }));
      setClasses(classes);
      console.log("Classes :",classes);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

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

  const fetchSubjects = async () => {
    setIsLoading(true);
    setError(null);
  
    try {
      const subjectsPromises = classes.map(async (classItem) => {
        const response = await fetch(
          `http://localhost:4000/api/auth/subjects/${classItem.id}?section=${classItem.section}&year=${classItem.year}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch subjects');
        }
  
        return await response.json();
      });
  
      const allSubjects = await Promise.all(subjectsPromises);
      const flatSubjects = allSubjects.flat();
      console.log("Flat Subjects:", flatSubjects);
      setSubjects(flatSubjects);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  

  useEffect(() => {
    if (classes.length > 0) {
      fetchSubjects();
    }
  }, [classes]);

  useEffect(() => {
    if (subjects.length > 0) {
      updateChartData();
    }
  }, [subjects]);

  const updateChartData = () => {
    setChartData({
      labels: subjects.map(subject => subject.name), // Use subject.name instead of subject_name
      datasets: [{
        label: "Subject Performance",
        data: subjects.map(subject => {
          // Generate random marks between 60 and 95 for demonstration
          return Math.floor(Math.random() * 35) + 60;
        }),
        borderColor: "rgb(99, 179, 237)",
        backgroundColor: "rgba(99, 179, 237, 0.1)",
        tension: 0.4,
        fill: true,
      }]
    });
  };
  

  useEffect(() => {
    const totalStudents = classes.reduce((sum, classItem) => sum + classItem.totalStudent, 0);
    setStats(prevStats => ({
      ...prevStats,
      totalStudents: totalStudents
    }));
  }, [classes]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const subject = subjects[context.dataIndex];
            return [
              `Score: ${context.formattedValue}%`,
              `Teacher: ${subject.teacher}`
            ];
          }
        }
      }
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
      title: "Class 10 Mathematics",
      company: "Chapter 3 - Trigonometry",
      type: "In Progress",
      date: "Today",
    },
    {
      status: "Pending",
      title: "Class 9 Science",
      company: "Chapter 4 - Forces and Motion",
      type: "Upcoming",
      date: "Tomorrow",
    },
    {
      status: "Complete",
      title: "Class 8 English",
      company: "Chapter 2 - Grammar",
      type: "Completed",
      date: "Yesterday",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <header className="px-4 flex flex-col bg-white border-b">
        <div className="max-w-7xl mx-auto py-4 px-6 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-slate-800">
            Welcome back, {userData?.first_name + " " + userData?.last_name} ! 👋
          </h1>
        </div>
        <div className="px-2 text-xl font-semibold text-slate-800 flex items-center gap-4">
          CLASS : {classes.map(classItem => (
            <div key={classItem.id}>
              {classItem.name} {"'"+ classItem.section + "'"}
            </div>
          ))}
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Progress Rate</h3>
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
                <p className="font-semibold text-slate-900">
                  {classes.map(classItem => (
                    <div key={classItem.id}>
                      {classItem.totalStudent}
                    </div>
                  ))}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold">Subject Performance</h3>
                <p className="text-sm text-slate-500">Average Score by Subject</p>
              </div>
              <div className="flex gap-2">
                <select className="text-sm border rounded-lg px-3 py-1">
                  <option>This Term</option>
                  <option>Last Term</option>
                </select>
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
          <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
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
      case 'complete':
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
