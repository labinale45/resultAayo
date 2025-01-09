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
    datasets: [
      {
        label: "Subject Performance",
        data: [],
        borderColor: "rgb(99, 179, 237)",
        backgroundColor: "rgba(99, 179, 237, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  });
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [teacherId, setTeacherId] = useState(null);
  const [classes, setClasses] = useState([]);
  const [cls, setCls] = useState([]);
  const [totalClasses, setTotalClasses] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [averageperformance, setAveragePerformance] = useState(0);
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [subjectPerformance, setSubjectPerformance] = useState({});
  const [progressRate, setProgressRate] = useState(0);
  const [examTypes, setExamTypes] = useState([]);
  const [pastExams, setPastExams] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [startYear, setStartYear] = useState(null);

  const [stats, setStats] = useState({
    totalStudents: 0,
    totalClasses: 0,
    upcomingTests: 0,
    completedExams: 0,
  });

//   const [reload, setReload] = useState(false);

// const handleReload = () => {
//   setReload(prev => !prev);
// };


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      if (decodedToken.role === "teachers") {
        setTeacherId(decodedToken.id);
      }
    }
  }, []);

  useEffect(() => {
    const fetchClasses = async (teacherId) => {
      try {
        const currentYear = getCurrentYear();
        const response = await fetch(
          `http://localhost:4000/api/auth/assigned-class/${teacherId}/${selectedYear}`
        );
        if (!response.ok) throw new Error("Failed to fetch classes");

        const { classes, count } = await response.json();
        console.log("Class Data:", classes);

        const formattedClasses = classes.map((item) => ({
          id: `${item.class}-${item.section}`,
          name: item.class,
          section: item.section,
          studentCount: item.studentCount || 0,
        }));

        console.log("Classes Assigned:", formattedClasses);
        setCls(formattedClasses);
        setTotalClasses(count);
      } catch (error) {
        console.error("Error fetching classes:", error);
        setCls([]);
        setTotalClasses(0);
      }
    };
    fetchClasses(teacherId);

    const fetchClass = async (teacherId) => {
      try {
        const currentYear = getCurrentYear();
        const response = await fetch(
          `http://localhost:4000/api/auth/teacher-class/${teacherId}/${selectedYear}`
        );
        if (!response.ok) throw new Error("Failed to fetch classes");
        const classData = await response.json();
        const classes = classData.map((item) => ({
          id: item.class,
          name: `${item.class}`,
          section: item.section,
          year: new Date(item.updated_at).getFullYear(),
          totalStudent: item.studentCount,
        }));
        setClasses(classes);
        console.log("ClassTec :", classes);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };
    fetchClass(teacherId);
  }, [teacherId,selectedYear]);

  const getCurrentYear = () => {
    // Convert AD to BS year
    const currentDate = new Date();
    const adYear = currentDate.getFullYear();
    const bsYear = adYear + 56; // Converting AD to BS (approximate conversion)
    return adYear.toString();
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("userData"));
        if (!userData?.username) {
          throw new Error("No user data found");
        }
        const response = await fetch(
          `http://localhost:4000/api/auth/profile/${userData.username}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }
        const data = await response.json();
        setUserData(data);
        const creationYear = new Date(data.created_at).getFullYear();
        setStartYear(creationYear);
  
      } catch (err) {
        setError(err.message);
      }
    };
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (startYear) {
      const currentYear = new Date().getFullYear();
      const years = Array.from(
        { length: currentYear - startYear + 1 },
        (_, i) => startYear + i
      );
      setAvailableYears(years); // Save available years to state
    }
  }, [startYear]);
  
  const [availableYears, setAvailableYears] = useState([]);

  useEffect(() => {
    if (subjects.length > 0) {
      const totalScores = subjects.reduce(
        (acc, subject) => {
          const theory = subject.theoryAverage || 0;
          const practical = subject.practicalAverage || 0;
          const count = subject.practicalAverage !== null ? 2 : 1; // Count based on data
          acc.sum += theory + practical;
          acc.count += count;
          return acc;
        },
        { sum: 0, count: 0 }
      );

      const avg =
        totalScores.count > 0 ? totalScores.sum / totalScores.count : 0;
      setAveragePerformance(avg.toFixed(2)); // Rounded to 2 decimals
    }
  }, [subjects]);

  useEffect(() => {
    const fetchExamTypes = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/api/auth/exam-count/${new Date().getFullYear()}`
        );
        if (!response.ok) throw new Error("Failed to fetch exam types");

        const data = await response.json();
        setExamTypes(data.upcomingExams || []);
        setPastExams(data.pastExams || []);
        setStats((prevStats) => ({
          ...prevStats,
          upcomingTests: data.upcomingCount || 0,
          completedExams: data.pastExams?.length || 0,
        }));
      } catch (error) {
        console.error("Error fetching exam types:", error);
      }
    };

    fetchExamTypes();
  }, []);

  useEffect(() => {
    const fetchSubjects = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const subjectsPromises = classes.map(async (classItem) => {
          const response = await fetch(
            `http://localhost:4000/api/auth/subjects/${classItem.id}?section=${classItem.section}&year=${classItem.year}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to fetch subjects");
          }

          return await response.json();
        });

        const allSubjects = await Promise.all(subjectsPromises);
        const flatSubjects = allSubjects.flat();
        console.log("Flat Subjects:", flatSubjects);
        setSubjects(flatSubjects);
      } catch (error) {
        console.error("Error:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    if (classes.length > 0) {
      fetchSubjects();
    }
  }, [classes]);

  useEffect(() => {
    if (subjects.length > 0) {
      const updateChartData = () => {
        setChartData({
          labels: subjects.map((subject) => subject.name),
          datasets: [
            {
              label: "Theory Average",
              data: subjects.map((subject) => subject.theoryAverage),
              borderColor: "rgb(99, 179, 237)",
              backgroundColor: "rgba(99, 179, 237, 0.1)",
              tension: 0.4,
              fill: true,
            },
            {
              label: "Practical Average",
              data: subjects.map((subject) => subject.practicalAverage),
              borderColor: "rgb(237, 99, 99)",
              backgroundColor: "rgba(237, 99, 99, 0.1)",
              tension: 0.4,
              fill: true,
            },
          ],
        });
      };
      updateChartData();
      const updateProgressRate = () => {
        const totalTheory = subjects.reduce(
          (sum, subject) => sum + subject.theoryAverage,
          0
        );
        const totalPractical = subjects.reduce(
          (sum, subject) => sum + subject.practicalAverage,
          0
        );
        const totalSubjects = subjects.length;

        if (totalSubjects > 0) {
          const overallAverage =
            (totalTheory + totalPractical) / (2 * totalSubjects);
          setProgressRate(Math.round(overallAverage));
        } else {
          setProgressRate(0);
        }
      };
      updateProgressRate();
    }
  }, [classes, subjects]);

  useEffect(() => {
    const totalStudents = classes.reduce(
      (sum, classItem) => sum + classItem.totalStudent,
      0
    );
    const totalClasses = cls.length;
    const upcomingTests = examTypes.upcomingExams;
    setStats((prevStats) => ({
      ...prevStats,
      totalStudents: totalStudents,
      totalClasses: totalClasses,
      upcomingTests: upcomingTests,
    }));
  }, [classes, cls, examTypes]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true, // Changed to true to show both datasets
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const subject = subjects[context.dataIndex];
            return [
              `${context.dataset.label}: ${context.formattedValue}%`,
              `Teacher: ${subject.teacher}`,
            ];
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
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
      },
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
            Welcome back, {userData?.first_name + " " + userData?.last_name} !
            👋
          </h1>
        </div>
        <div className="px-2 text-xl font-semibold text-slate-800 flex justify-between items-center gap-4">
          <div className="flex items-center gap-2">
          CLASS :{" "}
          {classes.length > 0 ? (
            classes.map((classItem) => (
              <div key={classItem.id}>
                {classItem.name} {"'" + classItem.section + "'"}
              </div>
            ))
          ) : (
            <div className="text-gray-500">No class assigned</div>
          )}
          </div>
          <div className="flex items-center gap-2">
          Year :{" "} <select
      className="border rounded-md px-2 py-1 text-base"
      onChange={(e) => setSelectedYear(e.target.value)}
      value={selectedYear}
    >
      {availableYears.map((year) => (
        <option key={year} value={year}>
          {year}
        </option>
      ))}
    </select>
    </div>

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
                  strokeDasharray={`${progressRate * 2.83} ${100 * 2.83}`}
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
                  {progressRate}%
                </text>
              </svg>
            </div>
            <div className="mt-4 flex justify-between text-sm text-slate-600">
              <div>
                <p>Percentage</p>
                <p className="font-semibold text-slate-900">{progressRate} %</p>
              </div>
              <div>
                <p>Total Students</p>
                <p className="font-semibold text-slate-900">
                  {classes.map((classItem) => (
                    <div key={classItem.id}>{classItem.totalStudent}</div>
                  ))}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold">Subject Performance</h3>
                <p className="text-sm text-slate-500">
                  Average Score by Subject
                </p>
              </div>
              {/* <div className="flex gap-2">
                <select className="text-sm border rounded-lg px-3 py-1">
                  <option>This Term</option>
                  <option>Last Term</option>
                </select>
              </div> */}
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
            classes={cls}
          >
            <div className="hidden group-hover:block absolute z-10 bg-white p-3 rounded-lg shadow-lg left-0 mt-2 min-w-[200px] border border-gray-100">
              {cls.map((classItem) => (
                <div key={classItem.id} className="text-sm py-1">
                  Class {classItem.name} &apos;{classItem.section}&apos;
                </div>
              ))}
            </div>
          </StatCard>

          <StatCard
            icon={<FaChartLine className="text-purple-500 text-xl" />}
            title="Average Performance"
            value={`${averageperformance}%`}
          />

          <StatCard
            icon={<FaCalendarAlt className="text-red-500 text-xl" />}
            title="Upcoming Tests"
            value={stats.upcomingTests}
          >
            <div className="hidden group-hover:block absolute z-10 bg-white p-3 rounded-lg shadow-lg left-0 mt-2 min-w-[200px] border border-gray-100">
              {examTypes.map((exam) => (
                <div
                  key={exam.id}
                  className="flex justify-between items-center text-sm py-1"
                >
                  <span>{exam.exam_type}</span>
                  <span className="text-gray-500 text-xs">
                    {exam.deadline_date}
                  </span>
                </div>
              ))}
            </div>
          </StatCard>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Past Examinations</h3>
          <div className="space-y-4">
            {pastExams.map((exam, index) => (
              <ActivityItem
                key={exam.id}
                status="Complete"
                title={exam.exam_type}
                company={`Started on ${exam.deadline_date}`}
                type="Completed"
                date={new Date(exam.resultDate).toLocaleDateString()}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );

  function StatCard({ icon, title, value, children }) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group relative">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-slate-100 rounded-xl">{icon}</div>
          <div>
            <p className="text-sm text-slate-600">{title}</p>
            <p className="text-xl font-semibold mt-1">{value}</p>
          </div>
        </div>
        {children}
      </div>
    );
  }
}

function ActivityItem({ status, title, company, type, date }) {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-600";
      case "pending":
        return "bg-yellow-100 text-yellow-600";
      case "complete":
        return "bg-blue-100 text-blue-600";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0">
      <div>
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 text-xs rounded ${getStatusColor(status)}`}
          >
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
