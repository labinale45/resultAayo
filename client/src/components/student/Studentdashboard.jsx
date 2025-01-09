"use client";

import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
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

const StudentDashboard = () => {
  const [selectedYear, setSelectedYear] = useState("");
  const [startYear, setStartYear] = useState(null);
  const [availableYears, setAvailableYears] = useState([]);
  const [examTypes, setExamTypes] = useState([]);
  const [studentId, setStudentId] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [recentExams, setRecentExams] = useState([]);
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [overallPerformance, setOverallPerformance] = useState(0);
  const [theoryAverage, setTheoryAverage] = useState(0);
  const [practicalAverage, setPracticalAverage] = useState(0);
  const [showViewProfile, setShowViewProfile] = useState(false);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Theory Marks",
        data: [],
        borderColor: "#6391c9",
        backgroundColor: "rgba(99, 145, 201, 0.1)",
        tension: 0.4,
      },
      {
        label: "Practical Marks",
        data: [],
        borderColor: "#4CAF50",
        backgroundColor: "rgba(76, 175, 80, 0.1)",
        tension: 0.4,
      },
    ],
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      if (decodedToken.role === "students") {
        setStudentId(decodedToken.id);
      }
    }
  }, []);

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
      setAvailableYears(years);
      setSelectedYear(currentYear.toString());
    }
  }, [startYear]);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/api/auth/student-exams/${studentId}/${selectedYear}`
        );
        if (!response.ok) throw new Error("Failed to fetch exams");

        const data = await response.json();
        setRecentExams(data.completedExams || []);
        setUpcomingExams(data.upcomingExams || []);
      } catch (error) {
        console.error("Error fetching exams:", error);
      }
    };

    if (studentId && selectedYear) {
      fetchExams();
    }else{
      setRecentExams([]);
      setUpcomingExams([]);
    }

  }, [studentId, selectedYear]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/api/auth/student-subjects/${studentId}/${selectedYear}`
        );
        if (!response.ok) throw new Error("Failed to fetch subjects");

        const data = await response.json();
        setSubjects(data);

        const theory =
          data.reduce((sum, subject) => sum + (subject.theoryMarks || 0), 0) /
          data.length;
        const practical =
          data.reduce(
            (sum, subject) => sum + (subject.practicalMarks || 0),
            0
          ) / data.length;
        const overall = (theory + practical) / 2;

        setTheoryAverage(theory);
        setPracticalAverage(practical);
        setOverallPerformance(overall);

        setChartData({
          labels: data.map((subject) => subject.name),
          datasets: [
            {
              label: "Theory Marks",
              data: data.map((subject) => subject.theoryMarks),
              borderColor: "#6391c9",
              backgroundColor: "rgba(99, 145, 201, 0.1)",
              tension: 0.4,
            },
            {
              label: "Practical Marks",
              data: data.map((subject) => subject.practicalMarks),
              borderColor: "#4CAF50",
              backgroundColor: "rgba(76, 175, 80, 0.1)",
              tension: 0.4,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    if (studentId && selectedYear) {
      fetchSubjects();
    }else{
      setSubjects([]);
      setTheoryAverage(0);
      setPracticalAverage(0);
      setOverallPerformance(0);
      setChartData({
        labels: [],
        datasets: [
          {
            label: "Theory Marks",
            data: [],
            borderColor: "#6391c9",
            backgroundColor: "rgba(99, 145, 201, 0.1)",
            tension: 0.4,
          },
          {
            label: "Practical Marks",
            data: [],
            borderColor: "#4CAF50",
            backgroundColor: "rgba(76, 175, 80, 0.1)",
            tension: 0.4,
          },
        ],
      });
    }
  }, [studentId, selectedYear]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const subject = subjects[context.dataIndex];
            return [
              `${context.dataset.label}: ${context.formattedValue}%`,
              `Subject: ${subject?.name || "N/A"}`,
            ];
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
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
          <div
            key={exam.id}
            className="border-l-4 border-[#6391c9] p-4 bg-gray-50 rounded"
          >
            <div className="flex justify-between items-center">
              <div>
                {/* <h3 className="font-semibold">{exam.subject}</h3>               */}
                <p className="text-sm text-gray-600">{exam.exam_type}</p>
                {isUpcoming && (
                  <p className="text-sm text-gray-500">
                    {`${new Date(exam.deadline_date).toLocaleDateString()} - ${
                      exam.deadline_time
                    }`}
                  </p>
                )}
              </div>
              {!isUpcoming && (
             <p className="flex justify-between items-center text-sm text-gray-500 w-full">
             <span className="flex-shrink-0">{exam.exams.exam_type}</span>
             <span className="flex-shrink-0">{new Date(exam.exams.resultDate).toLocaleDateString()}</span>
           </p>            
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">
          Welcome back, {userData?.first_name + " " + userData?.last_name}! 👋
        </h1>
        <div className="flex items-center gap-2">
          Year:{" "}
          <select
            className="border rounded-md px-2 py-1 text-base"
            onChange={(e) => setSelectedYear(e.target.value)}
            value={selectedYear}
          >
            <option value="">Select Year</option>
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnalyticsCard
          percentage={Math.round(overallPerformance)}
          label="Overall Average"
        />
        <AnalyticsCard
          percentage={Math.round(theoryAverage)}
          label="Theory Average"
        />

        <div className="dark:bg-[#1F2937] bg-[#6391c9] text-white p-6 rounded-lg">
          <div className="flex flex-col items-center">
            <Image
              src={userData?.img_url || "/assets/profile.png"}
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
