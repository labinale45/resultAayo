"use client";

import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Link from "next/link";

function Home() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      offset: 100,
      easing: "ease-in-out",
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
        <div className="absolute inset-0 bg-black opacity-50"></div>

        <div className="relative text-center z-10" data-aos="fade-up">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome to Our Website!
          </h1>
          <p className="text-white mb-8">
            Discover how we can help you achieve your goals.
          </p>

          <Link
            href="Module"
            className="  py-2 px-4 rounded-lg  bg-[#7ba0e4] dark:bg-[#8AA4D6] hover:bg-[#4c94ec] dark:hover:bg-[#253553]  text-white font-semibold  text-center"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* Container for the rest of the content with margins */}
      <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
        {/* Features Section */}
        <section className="flex flex-col items-center justify-center py-16">
          <div
            className="flex items-center justify-center w-full mb-8"
            data-aos="fade-up"
          >
            <div className="w-1/4 max-w-xs h-px bg-gray-300"></div>
            <h2 className="text-3xl font-bold mx-4 px-4 py-2 bg-[#437FC7] text-white rounded-3xl whitespace-nowrap">
              Our Features
            </h2>
            <div className="w-1/4 max-w-xs h-px bg-gray-300"></div>
          </div>
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            data-aos="fade-right"
          >
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">Feature 1</h3>
              <p className="text-gray-600">
                Individual Remarks according to their individual performances on
                exams.
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
        <section className="flex flex-col items-center justify-center mb-16">
          <div
            className="flex items-center justify-center w-full mb-8"
            data-aos="fade-up"
          >
            <div className="w-1/4 max-w-xs h-px bg-gray-300"></div>
            <h2 className="text-3xl font-bold mx-4 px-4 py-2 bg-[#437FC7] text-white rounded-3xl whitespace-nowrap">
              Testimonials
            </h2>
            <div className="w-1/4 max-w-xs h-px bg-gray-300"></div>
          </div>
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            data-aos="fade-left"
          >
            <div className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-gray-600">
                "Result Aayo is a web app for handling student results, offering
                GPA calculations and secure data management."
              </p>
              <p className="text-gray-900 mt-2">- Rabin Ale</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-gray-600">
                "Result Aayo is a web application designed for managing student
                results, featuring GPA calculations and secure data management."
              </p>
              <p className="text-gray-900 mt-2">- Aasha Shrestha</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-gray-600">
                "Result Aayo is a web app for managing student results, offering
                features like GPA calculation and performance analytics to
                simplify and secure academic result tracking."
              </p>
              <p className="text-gray-900 mt-2">- Yubraj Dauliya</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-gray-600">
                "Result Aayo is a web app for managing student results, offering
                GPA calculation and secure data handling."
              </p>
              <p className="text-gray-900 mt-2">- Supriya Shrestha</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
