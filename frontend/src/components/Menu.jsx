"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import React from "react";
import { RiDashboardFill } from "react-icons/ri";
import { AiFillEnvironment } from "react-icons/ai";
import { BsArrowLeftShort } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { LuClipboardEdit } from "react-icons/lu";
import {
  FaGraduationCap,
  FaClipboardCheck,
  FaChalkboardTeacher,
} from "react-icons/fa";
import { IoIosClipboard } from "react-icons/io";
import { MdNotificationsActive } from "react-icons/md";

const Menu = ({ setMenuOpen }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(true);
  const Menus = [
    { title: "Dashboard", path: "/admin/Admindashboard" },
    { title: "Teacher", icon: <CgProfile />, path: "/admin/teacher" },
    { title: "Student", icon: <FaGraduationCap />, path: "/admin/student" },
    { title: "Exam", icon: <FaClipboardCheck />, path: "/admin/exam" },

    { title: "Ledger", icon: <IoIosClipboard />, path: "/admin/ledger" },
    { title: "Class", icon: <FaChalkboardTeacher />, path: "/admin/class" },
    { title: "Notice", icon: <MdNotificationsActive />, path: "/admin/notice" },
  ];

  useEffect(() => {
    setMenuOpen(open);
  }, [open, setMenuOpen]);

  return (
    <div>
      <div
        className={`bg-[#253553] h-screen p-5 pt-8 ${
          open ? "w-72" : "w-20"
        } duration-300 relative`}
      >
        <BsArrowLeftShort
          className={`bg-white text-[#253553] text-3xl rounded-full absolute -right-3 top-9 border border-[#253553] cursor-pointer 
          ${!open && "rotate-180"}`}
          onClick={() => setOpen(!open)}
        />

        <div className="inline-flex">
          <AiFillEnvironment
            className={`bg-blue-300 ml-3 text-4xl rounded cursor-pointer block float-left mr-2 duration-500 ${
              open && "rotate-[360deg]"
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

        <ul className="pt-2 ">
          {Menus.map((menu, index) => (
            <li
              key={index}
              className={`text-gray-300 text-sm flex justify-center top-2 gap-x-4 cursor-pointer p-4 hover:bg-[#8AA4D6] rounded-md mt-2 ${
                pathname === menu.path
                  ? "bg-[#8AA4D6] text-white font-bold"
                  : ""
              } relative group`}
              onClick={() => router.push(menu.path)}
            >
              <span className="text-2xl">
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
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 rounded-md px-2 py-1 mb-2 bg-[#8AA4D6] text-white text-sm invisible opacity-20 translate-y-1 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-7 group-hover:translate-y-12 ">
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

export default Menu;
