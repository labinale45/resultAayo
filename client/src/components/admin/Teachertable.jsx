// This is a React component for managing a teacher table in an admin interface.
"use client";

import React, { useState, useEffect } from "react"; // Importing React and hooks
import Addteacher from "@/components/admin/Addteacher"; // Importing the Addteacher component
import { FaSearch, FaEdit } from "react-icons/fa"; // Importing icons for search and edit
import Image from "next/image"; // Importing Image component from Next.js

// Main functional component for the teacher table
export default function Teachertable() {
  // State variables for managing component state
  const [showAddTeacher, setShowAddTeacher] = useState(false); // Controls visibility of the Add Teacher modal
  const [selectedYear, setSelectedYear] = useState(""); // Stores the selected academic year
  const [years, setYears] = useState([]); // Stores the list of available years
  const [teachers, setTeachers] = useState([]); // Stores the list of teachers
  const [isLoading, setIsLoading] = useState(false); // Indicates loading state
  const [error, setError] = useState(null); // Stores error messages
  const [state, setState] = useState("teachers"); // Current state (e.g., teachers)
  const [searchTerm, setSearchTerm] = useState(""); // Stores the search term for filtering teachers
  const [selectedTeacher, setSelectedTeacher] = useState(null); // Stores the currently selected teacher for editing

  // Effect hook to fetch years and teachers when the selected year changes
  useEffect(() => {
    YearSelect(); // Fetch available years
    if (selectedYear) {
      fetchTeachers(); // Fetch teachers if a year is selected
    }
  }, [selectedYear]);

  // Function to fetch available years from the API
  const YearSelect = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/auth/year?status=${state}`, // API endpoint to get years
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Check if the response is OK
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json(); // Parse the response data
      if (!Array.isArray(data)) {
        throw new Error("Invalid data format received"); // Validate data format
      }

      setYears(data); // Update years state
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error("Failed to fetch years:", error.message); // Log error
      setError("Failed to fetch years. Please try again later."); // Set error message
      setYears([]); // Reset years state
    }
  };

  // Function to fetch teachers based on the selected year
  const fetchTeachers = async () => {
    setIsLoading(true); // Set loading state
    setError(null); // Clear previous errors
    try {
      const response = await fetch(
        `http://localhost:4000/api/auth/records/${selectedYear}?status=${state}` // API endpoint to get teachers
      );

      // Check if the response is OK
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json(); // Parse the response data
      //console.log("Fetched teachers data:", data); // Log fetched data

      // Map through the data to include status
      const teachersWithStatus = data.map(teacher => ({
        ...teacher,
        status: teacher.tstatus
      }));
     // console.log("teacher with Status",teachersWithStatus);
      setTeachers(teachersWithStatus); // Update teachers state
    } catch (error) {
      setError(error.message); // Set error message
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  // Function to handle editing a teacher's details
  const handleEdit = async (teacher) => {
    try {
      setError(null); // Clear previous errors
      const response = await fetch(`http://localhost:4000/api/auth/teacher/${teacher.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Check if the response is OK
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Teacher not found'); // Handle not found error
        }
        throw new Error('Failed to fetch teacher details'); // Handle other errors
      }

      const teacherData = await response.json(); // Parse the response data
      
      // Safely handle name splitting with fallback values
      let firstName = '', lastName = '';
      if (teacherData.fullName && typeof teacherData.fullName === 'string') {
        const nameParts = teacherData.fullName.split(' ').filter(part => part);
        firstName = nameParts[0] || ''; // Get first name
        lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : ''; // Get last name
      }

      // Set selected teacher state with fetched data
      setSelectedTeacher({
        id: teacherData.id,
        first_name: firstName,
        last_name: lastName,
        email: teacherData.email || '',
        phone_number: teacherData.contact || '',
        address: teacherData.address || '',
        dob: teacherData.dateOfBirth || '',
        gender: teacherData.gender || 'Male',
        username: teacherData.username || '',
        password: teacherData.password || '',
        img_url: teacherData.img_url || ''
      });
      
      setShowAddTeacher(true); // Show the Add Teacher modal
    } catch (error) {
      console.error('Error fetching teacher details:', error); // Log error
      setError(error.message); // Set error message
    }
  };

  // Function to handle status change of a teacher
  const handleStatusChange = async (teacherId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'; // Toggle status

    try {
      const response = await fetch(`http://localhost:4000/api/auth/teacher/status/${teacherId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus }) // Send new status in request body
      });

      // Check if the response is OK
      if (!response.ok) {
        throw new Error('Failed to update status'); // Handle error
      }

      // Update teachers state with new status
      setTeachers(prevTeachers =>
        prevTeachers.map(teacher =>
          teacher.id === teacherId
            ? { ...teacher, status: newStatus }
            : teacher
        )
      );
    } catch (error) {
      console.error('Error updating status:', error); // Log error
      setError('Failed to update teacher status'); // Set error message
    }
  };

  // Filter teachers based on the search term
  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (teacher.user?.email || teacher.email)?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ActionCell component for rendering action buttons for each teacher
  const ActionCell = ({ teacher }) => (
    <td className="px-6 py-4">
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <button
            onClick={() => handleStatusChange(teacher.id, teacher.status)} // Toggle status on click
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              teacher.status === 'active' ? 'bg-green-500' : 'bg-gray-200'
            }`}
          >
            <span className="sr-only">Toggle status</span>
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                teacher.status === 'active' ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={`ml-2 text-sm ${
            teacher.status === 'active' ? 'text-green-600' : 'text-gray-500'
          }`}>
            {teacher.status === 'active' ? 'Active' : 'Inactive'} 
          </span>
        </div>
        {state === 'teachers' && (
          <button
            onClick={() => handleEdit(teacher)} // Open edit modal on click
            className="text-blue-600 hover:text-blue-900"
          >
            <FaEdit className="w-4 h-4" /> 
          </button>
        )}
      </div>
    </td>
  );

  // Loading state UI
  if (isLoading) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div> 
      </div>
    );
  }

  // Error state UI
  if (error) {
    return (
      <div className="text-red-500 text-center py-4">Error: {error}</div> // Display error message
    );
  }

  // Main render of the component
  return (
    <div className="relative mt-7">
      <div className="flex justify-center items-center mb-4">
        <select
          value={selectedYear} // Bind selected year to state
          onChange={(e) => setSelectedYear(e.target.value)} // Update state on change
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 mr-3"
        >
          <option value="">Select Year</option> 
          {years.map((year) => (
            <option key={year} value={year}>
              {year} 
            </option>
          ))}
        </select>

        <div className="flex relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search teachers..." // Placeholder for search input
            className="w-full h-10 pl-12 pr-4 py-3 bg-white dark:bg-[#2A2B32] border-2 border-gray-200 dark:border-gray-700 rounded-full focus:ring-2 focus:ring-blue-500 transition-all"
            value={searchTerm} // Bind search term to state
            onChange={(e) => setSearchTerm(e.target.value)} // Update state on change
          />
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" /> 
        </div>

        <button
          onClick={() => setShowAddTeacher(true)} // Open Add Teacher modal on click
          className="bg-[#7ba0e4] dark:bg-[#8AA4D6] hover:bg-[#4c94ec] dark:hover:bg-[#253553] hover:text-white text-center py-2 px-4 rounded text-xs absolute right-4"
        >
          +Add Teacher 
        </button>
      </div>

      {showAddTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[101]">
          <Addteacher 
            onClose={() => {
              setShowAddTeacher(false); // Close modal
              setSelectedTeacher(null); // Reset selected teacher
            }} 
            teacher={selectedTeacher} // Pass selected teacher data
            onSave={() => {
              fetchTeachers(); // Refresh teacher list after saving
              setShowAddTeacher(false); // Close modal
              setSelectedTeacher(null); // Reset selected teacher
            }}
          />
        </div>
      )}

      {selectedYear && (
        <div className="overflow-x-auto relative">
          <div className="max-h-[400px] overflow-y-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400 sticky top-0 z-30">
                <tr>
                  <th scope="col" className="px-6 py-3 sticky left-0 z-20 bg-gray-200 dark:bg-gray-700">
                    Full Name 
                  </th>
                  <th scope="col" className="px-6 py-3">Email</th>  
                  <th scope="col" className="px-6 py-3">Contact</th> 
                  <th scope="col" className="px-6 py-3">Address</th> 
                  <th scope="col" className="px-6 py-3">Date of Birth</th> 
                  <th scope="col" className="px-6 py-3">Username</th> 
                  <th scope="col" className="px-6 py-3">Password</th> 
                  <th scope="col" className="px-6 py-3">Action</th> 
                </tr>
              </thead>
              <tbody>
                {filteredTeachers.map((teacher) => ( // Map through filtered teachers to render rows
                  <tr
                    key={teacher.id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <th scope="row" className="flex items-center px-6 py-4 text-gray-900 break-words dark:text-white sticky left-0 z-10 bg-white dark:bg-gray-800 max-w-[200px]">
                      <div className="flex flex-col">
                        <Image
                          width={200}
                          height={200}
                          className="w-10 h-10 rounded-full object-cover mb-2"
                          src={teacher.img_url || "/assets/profile.png"} // Display teacher's image or default
                          alt={`${teacher.fullName}'s photo`} // Alt text for image
                          onError={(e) => {
                            e.target.src = "/default-avatar.png"; // Fallback image on error
                          }}
                        />
                        <div className="text-base font-semibold break-words">
                          {teacher.fullName} 
                        </div>
                      </div>
                    </th>
                    <td className="px-6 py-4">{teacher.user?.email || teacher.email}</td> 
                    <td className="px-6 py-4">{teacher.contact}</td> 
                    <td className="px-6 py-4">{teacher.address}</td> 
                    <td className="px-6 py-4">{teacher.dateOfBirth}</td> 
                    <td className="px-6 py-4">{teacher.username}</td> 
                    <td className="px-6 py-4">{teacher.password}</td> 
                    <ActionCell teacher={teacher} /> 
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}