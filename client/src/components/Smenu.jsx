"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import React from "react";
import { RiDashboardFill } from "react-icons/ri";
import { AiFillEnvironment } from "react-icons/ai";
import { BsArrowLeftShort } from "react-icons/bs";
import { FaGraduationCap } from "react-icons/fa";

const Smenu = ({ setMenuOpen }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(true);
  const Menus = [
    { title: "Dashboard", path: "/student/Studentdashboard" },
    {
      title: "Gradesheet",
      icon: <FaGraduationCap />,
      path: "/student/Sgradesheet",
    },
  ];

  useEffect(() => {
    setMenuOpen(open);
  }, [open, setMenuOpen]);

  return (
    <div>
    <div
      className={`bg-[rgb(67,127,199)] dark:bg-[#253553] h-screen ${
        open ? "w-56" : "w-14"
      } duration-300 relative`}
    >
      <BsArrowLeftShort
        className={`bg-white dark:bg-[#B3B4BE] text-[#437FC7] dark:text-white text-3xl rounded-full outline outline-2 outline-white  absolute -right-3 top-9 dark:border-[#B3B4BE] cursor-pointer 
        ${!open && "rotate-180 translate-x-2"}`}
        onClick={() => setOpen(!open)}
      />

      <div className="inline-flex pt-8 px-4">
        <AiFillEnvironment
          className={`bg-transparent ml-0 text-4xl rounded cursor-pointer block float-left duration-500 ${
            open && "rotate-[360deg] "
          }`}
        />
        <h1
          className={`text-white origin-left font-medium text-2xl duration-300 ${
            !open && "scale-0 text-sm"
          }`}
        >
          Result Aayo
        </h1>
      </div>
      
      <ul className="">
        {Menus.map((menu, index) => (
          <li
            key={index}
            className={`text-gray-100 text-sm flex justify-center top-2 gap-x-4 cursor-pointer p-4 hover:bg-[#4c94ec] hover:dark:bg-[#8AA4D6] rounded-md mt-2 ${
              pathname === menu.path
                ? " bg-[#4c94ec] dark:bg-[#8AA4D6] text-white font-bold"
                : ""
            } relative group`}
            onClick={() => router.push(menu.path)}
          >
            <span className="text-xl">
              {menu.icon ? menu.icon : <RiDashboardFill />}
            </span>
            <span
              className={`text-base font-medium flex-1 duration-200 ${
                !open && "hidden"
              }`}
            >
              {menu.title}
            </span>
            {!open && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 rounded-md px-2 py-1 mb-2  bg-[#4c94ec] dark:bg-[#8AA4D6] text-white text-sm invisible opacity-20 translate-y-1 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-7 group-hover:translate-y-12 ">
                {menu.title}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  </div>
);
};


export default Smenu;
