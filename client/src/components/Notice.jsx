import React from "react";
import Image from "next/image";
import { FaBell } from "react-icons/fa";

function Notice({ title, imageUrl }) {
  return (
    <div className="relative overflow-x-hidden min-h-screen ">
      {/* Layered Blue Background */}
      <div className="  absolute  inset-x-0 top-0 z-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          className="w-full "
        >
          <path
            className="dark:fill-[#253553]"
            fill="#437FC7"
            fillOpacity="1"
            d="M0,32L1440,160L1440,0L0,0Z"
          ></path>
        </svg>
      </div>

      {/* Notices Section */}
      <section className="mt-28 flex flex-col items-center justify-center p-4">
        <div
          className="flex items-center justify-center w-full mb-8 px-4"
          data-aos="fade-up"
        >
          <div className="w-1/4 max-w-xs h-px bg-gray-300"></div>
          <h2
            className="break-words
          text-3xl font-bold mx-4 px-4 py-2 bg-[#437FC7] text-white rounded-3xl whitespace-nowrap"
          >
            Notices
          </h2>
          <div className="w-1/4 max-w-xs h-px bg-gray-300"></div>
        </div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full max-w-7xl"
          data-aos="fade-left"
        >
          <div className="w-full bg-gray-100 p-4 rounded-lg shadow-md ">
            <div className="flex justify-center items-center text-black py-10 px-4">
              <FaBell className="text-2xl mr-2 text-black" />
              <h2 className="text-black  text-3xl text-center break-words">
                gdfgdfgsfg
              </h2>
            </div>
            <div className="mt-4">
              {imageUrl && (
                <Image
                  src={imageUrl}
                  alt="Notice Image"
                  width={300}
                  height={200}
                  layout="responsive"
                  className="rounded-lg"
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Notice;
