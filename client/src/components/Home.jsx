"use client";
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS styles
import Link from "next/link";

function Home() {
  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 1000, // animation duration
      offset: 100, // offset to trigger animation earlier or later
      easing: "ease-in-out", // animation easing
    });
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section
        className="relative flex items-center justify-center h-screen bg-cover bg-center"
        style={{
          backgroundImage: "url('/assets/bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Overlay for Opacity */}
        <div className="absolute inset-0 bg-black opacity-50"></div>

        <div className="relative text-center z-10" data-aos="fade-up">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome to Our Website!
          </h1>
          <p className="text-white mb-8">
            Discover how we can help you achieve your goals.
          </p>
          
     <Link href="Module" className="bg-white text-blue-500 py-2 px-4 rounded-lg hover:bg-blue-100">
      Learn More
    
</Link>

        </div>
      </section>

      {/* Features Section */}
      <section className="flex flex-col items-center justify-center p-4">
        <h2 className="text-3xl font-bold mb-8" data-aos="fade-up">
          Our Features
        </h2>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          data-aos="fade-right"
        >
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">Feature 1</h3>
            <p className="text-gray-600">
            Individual Remarks according to their individual performances on exams.
            </p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">Feature 2</h3>
            <p className="text-gray-600">
            Exam Management to reduce administrative burden.
            </p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">Feature 3</h3>
            <p className="text-gray-600">
              User Management assuring the highest level of security.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="flex flex-col items-center justify-center p-4">
        <h2 className="text-3xl font-bold mb-8" data-aos="fade-up">
          Testimonials
        </h2>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          data-aos="fade-left"
        >
          <div className="bg-white p-4 rounded-lg shadow-md">
            <p className="text-gray-600">
              "Result Aayo is a web app for handling student results,
               offering GPA calculations and secure data management."
            </p>
            <p className="text-gray-900 mt-2">- Rabin Ale</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <p className="text-gray-600">
              "Result Aayo is a web application designed for managing student results, 
              featuring GPA calculations and secure data management."
            </p>
            <p className="text-gray-900 mt-2">- Aasha Shrestha</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <p className="text-gray-600">
              "Result Aayo is a web app for managing student results, offering features 
              like GPA calculation and performance analytics to simplify and secure 
              academic result tracking."
            </p>
            <p className="text-gray-900 mt-2">- Yubraj Dauliya</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <p className="text-gray-600">
              "Result Aayo is a web app for managing student results, 
              offering GPA calculation and secure data handling."
            </p>
            <p className="text-gray-900 mt-2">- Supriya Shrestha</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;