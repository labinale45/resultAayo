import React from "react";
import Image from "next/image";
import { FaBell } from "react-icons/fa";

function Notice({ title, imageUrl }) {
  return (
    <div>
      <h1 className="mt-28 text-4xl font-bold mb-8 text-center dark:text-white">
        Notices
      </h1>
      <div className="mt-30 cursor-pointer m-1 rounded-lg flex flex-col justify-start items-center w-96 border-2 border-gray-200 bg-white dark:bg-[#253553] dark:text-white dark:border-[#252c3c] shadow-lg h-48">
        <div className="w-full p-4">
          <div className="flex justify-center items-center py-4">
            <FaBell className="text-2xl mr-2 text-black dark:text-white" />
            <h2 className="text-black dark:bg-[#253553] dark:text-white text-3xl text-center">
              {title || "Notice Title"}
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
    </div>
  );
}

export default Notice;
