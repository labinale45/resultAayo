"use client";
import { useEffect, useState } from "react";
import { FaMoon } from "react-icons/fa";
import { BsSunFill } from "react-icons/bs";

const Darklightmode = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") setDarkMode(false);
  }, []);
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);
  return (
    <div
      className="relative w-16 h-8 flex items-center dark:bg-gray-900  bg-blue-400 cursor-pointer rounded-full p-1 "
      onClick={() => setDarkMode(!darkMode)}
    >
      <BsSunFill className="text-yellow-400" size={18} />
      <div
        className="absolute bg-white  dark:bg-gray-500 w-6 h-6 rounded-full shadow-md transform transition-transform duration-300"
        style={darkMode ? { left: "2px" } : { right: "2px" }}
      ></div>
      <FaMoon className="ml-auto text-white" size={18} />
    </div>
  );
};

export default Darklightmode;
