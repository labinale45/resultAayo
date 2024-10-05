"use client";

import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

function Module() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      offset: 100,
      easing: "ease-in-out",
    });
  }, []);

  return (
    <div className="relative overflow-x-hidden min-h-screen">
      {/* Layered Blue Background */}
      <div className="absolute inset-x-0 top-0 z-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          className="w-full"
        >
          <path
            className="dark:fill-[#253553]"
            fill="#437FC7"
            fillOpacity="1"
            d="M0,32L1440,160L1440,0L0,0Z"
          ></path>
        </svg>
      </div>
      <div className="bg-white-600 mt-20">
        <div className="m-0 grid sm:grid-cols-12 grid-cols-1 p-4 h-auto">
          <div
            className="sm:col-span-6 p-4 ms-20"
            data-aos="fade-right"
            data-aos-delay="100"
          >
            <img src="/assets/Modules.png" alt="Logo" className="mb-4" />
          </div>

          <div
            className="sm:col-span-6 p-4 ms-20"
            data-aos="fade-left"
            data-aos-delay="200"
          >
            <div className="text-lg font-semibold mb-2">Individual Remarks</div>
            <div>
              The following remarks are common, subject-specific, &
              exam-specific.According to their individual performances on exams,
              terms, or in a subject,educators can add, delete, or edit remarks
              for each student. Teachers can use the Custom student remarks
              module to send parents instant alerts on how a student's
              performance can be improved using constructive feedback.Student
              remark features in school ERP
            </div>
            <ul className="list-disc">
              <li className="mb-1">
                Give general remarks about how each student performed on each
                subject
              </li>
              <li className="mb-1">
                Describe a typical student's performance on a particular exam.
              </li>
              <li className="mb-1">
                For the daily update, students/parents can see the comments on
                their profiles.
              </li>
              <li className="mb-1">
                The Manage Remarks page allows you to append remarks to
                students.
              </li>
            </ul>
          </div>
        </div>

        <div className="m-0 grid sm:grid-cols-12 grid-cols-1 p-4 h-auto">
          <div
            className="sm:col-span-6 p-4 ms-20"
            data-aos="fade-right"
            data-aos-delay="300"
          >
            <div className="text-lg font-semibold mb-2">Exam Management</div>
            <div>
              Students' progress can be tracked through online exams, customized
              report cards, and custom report cards. Moreover, schools can
              conduct descriptive & objective exams, stop printing report cards,
              reduce administrative burden, & get instant feedback on students'
              progress.{" "}
            </div>
            <ul className="list-disc">
              <li className="mb-1">Management of exams</li>
              <li className="mb-1">Detailed Reports</li>
              <li className="mb-1">Managing Grade book</li>
            </ul>
          </div>
          <div
            className="sm:col-span-6 p-4 ms-20"
            data-aos="fade-left"
            data-aos-delay="400"
          >
            <img src="/assets/Modules.png" alt="Logo" className="mb-4" />
          </div>
        </div>

        <div className="m-0 grid sm:grid-cols-12 grid-cols-1 p-4 h-auto">
          <div
            className="sm:col-span-6 p-4 ms-20"
            data-aos="fade-right"
            data-aos-delay="500"
          >
            <img src="/assets/Modules.png" alt="Logo" className="mb-4" />
          </div>
          <div
            className="sm:col-span-6 p-4 ms-20"
            data-aos="fade-left"
            data-aos-delay="600"
          >
            <div className="text-lg font-semibold mb-2">User Management</div>
            <div>
              Assuring the highest level of security for each user provide each
              with their own login credentials. Assigning different access
              levels to different features/modules.
              <ul className="list-disc">
                <li className="mb-1">Username & Password generation</li>
                <li className="mb-1">Set users' access level control</li>
                <li className="mb-1">Grant special permission</li>
                <li className="mb-1">Edit user details & reset password</li>
                <li className="mb-1">Block any user</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Module;
