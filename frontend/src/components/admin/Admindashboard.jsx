"use client";

import React from "react";
import Link from "next/link";
import {
  FaUsers,
  FaChalkboardTeacher,
  FaGraduationCap,
  FaBook,
} from "react-icons/fa";

export default function Admindashboard() {
  // Placeholder values for statistics
  const totalTeachers = 25;
  const totalStudents = 120;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900">
            School Admin Dashboard
          </h1>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<FaUsers className="text-blue-500" />}
            title="Total Students"
            value={totalStudents}
          />
          <StatCard
            icon={<FaChalkboardTeacher className="text-green-500" />}
            title="Total Teachers"
            value={totalTeachers}
          />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <QuickActions />
        </div>
      </main>
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

function QuickActions() {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <Link
          href="/admin/add-student"
          className=" bg-[#8AA4D6] hover:bg-[#253553] hover:text-white text-gray-700 
       font-semibold py-2 px-4 rounded text-center"
        >
          Add Student
        </Link>
        <Link
          href="/admin/add-teacher"
          className=" bg-[#8AA4D6] hover:bg-[#253553] hover:text-white text-gray-700 
       font-semibold py-2 px-4 rounded text-center"
        >
          Add Teacher
        </Link>
        <Link
          href="/admin/create-class"
          className=" bg-[#8AA4D6] hover:bg-[#253553] hover:text-white text-gray-700 
       font-semibold py-2 px-4 rounded text-center"
        >
          Create Class
        </Link>
        <Link
          href="/admin/create-exam"
          className=" bg-[#8AA4D6] hover:bg-[#253553] hover:text-white text-gray-700 
          font-semibold py-2 px-4 rounded text-center"
        >
          Create Exam
        </Link>
      </div>
    </div>
  );
}
