"use client";
import React, { useEffect, useState } from "react";
import { FaUsers, FaChalkboardTeacher } from "react-icons/fa";
import supabase from "@/utils/client";

export default function Studentdashboard() {
  const [studentCount, setStudentCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Count students
        const { count: studentCount, error: studentError } = await supabase
          .from("students")
          .select("*", { count: "exact", head: true });

        if (studentError) throw studentError;

        setStudentCount(studentCount);

        // Count teachers
        const { count: teacherCount, error: teacherError } = await supabase
          .from("teachers")
          .select("*", { count: "exact", head: true });

        if (teacherError) throw teacherError;

        setTeacherCount(teacherCount);
      } catch (error) {
        console.error("Error fetching counts:", error.message);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Student Dashboard
          </h1>
        </div>
      </header>
    </div>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg p-5">
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

function RecentActivityFeed() {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
      <ul className="mt-4 space-y-4">
        <li className="flex space-x-3">
          <FaUsers className="flex-shrink-0 h-5 w-5 text-gray-400" />
          <div className="flex-1 space-y-1">
            <p className="text-sm text-gray-600">New student enrolled</p>
            <p className="text-xs text-gray-500">2 hours ago</p>
          </div>
        </li>
        {/* Add more activity items here */}
      </ul>
    </div>
  );
}
