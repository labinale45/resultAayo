"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import "../app/globals.css";
import Image from "next/image";
import { AiOutlineClose, AiOutlineMail, AiOutlineMenu } from "react-icons/ai";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import Darklightmode from "./Mini Component/Darklightmode";
import Login from "./Login";

export default function Navbar() {
  const [nav, setNav] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50); // Adjust this value based on when you want the background to change
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navhandle = async () => {
    setNav(!nav);
    console.log(nav);
  };

  return (
    <div
      className={`fixed w-full h-20 z-[100] ${
        scrolled
          ? "  bg-[#437FC7] dark:bg-[#253553] dark:text-white text-black shadow-md"
          : "bg-transparent"
      } transition-all duration-300`}
    >
      <div className="flex justify-between items-center w-full h-full px-2 2xl:px-16 pl-12 pr-12">
        <Image src="/assets/Logo.png" width="135" height="55" alt="Logo" />
        <div className="flex-grow flex justify-center">
          <ul className="hidden md:flex items-center space-x-20">
            <Link href="Home">
              <li className="text-white text-m uppercase hover:border-b">
                Home
              </li>
            </Link>
            <Link href="Notice">
              <li className="text-white text-m uppercase hover:border-b">
                Notice
              </li>
            </Link>
            <Link href="About">
              <li className="text-white text-m uppercase hover:border-b">
                About us
              </li>
            </Link>
            <Link href="Module">
              <li className="text-white text-m uppercase hover:border-b">
                Module
              </li>
            </Link>
          </ul>
        </div>
        <div className="hidden md:flex items-center space-x-5">
          <Darklightmode />
          <button
            onClick={() => setShowLogin(true)}
            className="bg-[#7ba0e4] dark:bg-[#8AA4D6] hover:bg-[#4c94ec] dark:hover:bg-[#253553]  text-white py-2 px-4 rounded text-sm"
          >
            LOGIN
          </button>
        </div>

        <div className="md:hidden z-10 text-white" onClick={navhandle}>
          <AiOutlineMenu size={35} />
        </div>
      </div>

      {/* Overlay and Mobile Menu */}
      <div
        className={
          nav ? "md:hidden fixed left-0 top-0 w-full h-screen bg-black/50" : ""
        }
      >
        <div
          className={
            nav
              ? "fixed left-0 top-0 w-[75%] sm:w-[60%] md:w-[45%] h-screen bg-[#ecf0f3] p-10 ease-in duration-500"
              : "fixed left-[-100%] top-0 p-10 ease-in duration-500"
          }
        >
          <div>
            <div className="flex w-full items-center justify-between">
              <Image
                src="/assets/Logo.png"
                width="200"
                height="35"
                alt="Logo"
              />
              <div
                onClick={navhandle}
                className="rounded-full shadow-lg shadow-gray-500 p-3 cursor-pointer"
              >
                <AiOutlineClose />
              </div>
            </div>
            <div className="py-4 flex flex-col">
              <ul className="uppercase">
                <Link href="Home">
                  <li onClick={() => setNav(false)} className="py-4 text-sm">
                    Home
                  </li>
                </Link>
                <Link href="Notice">
                  <li onClick={() => setNav(false)} className="py-4 text-sm">
                    Notice
                  </li>
                </Link>
                <Link href="About">
                  <li onClick={() => setNav(false)} className="py-4 text-sm">
                    About us
                  </li>
                </Link>
                <Link href="Module">
                  <li onClick={() => setNav(false)} className="py-4 text-sm">
                    Module
                  </li>
                </Link>
                
                <button
                  onClick={() => {
                    setShowLogin(true);
                    setNav(false);
                  }}
                  className="text-white p-2 sm:col-span-4 h-10 justify-left shadow-xl font-bold bg-[#8AA4D6] hover:bg-[#253553] focus:bg-[#253553] hover:text-white py-2 px-4 rounded text-sm hover:scale-105 duration-300"
                >
                  Login
                </button>
              </ul>
              <div className="pt-40">
                <p className="uppercase tracking-widest text-[#8AA4D6]">
                  Let&apos;s connect
                </p>
                <div className="flex items-center justify-between my-4 w-full sm:w-[80%]">
                  <a
                    href="https://www.linkedin.com/feed/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <div className="rounded-full shadow-lg shadow-gray-400 p-3 cursor-pointer hover:scale-105 ease-in duration-300">
                      <FaLinkedinIn />
                    </div>
                  </a>
                  <a
                    href="https://github.com/AashaShrestha2058"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <div className="rounded-full shadow-lg shadow-gray-400 p-3 cursor-pointer hover:scale-105 ease-in duration-300">
                      <FaGithub />
                    </div>
                  </a>
                  <Link href="About">
                    <div
                      onClick={() => setNav(!nav)}
                      className="rounded-full shadow-lg shadow-gray-400 p-3 cursor-pointer hover:scale-105 ease-in duration-300"
                    >
                      <AiOutlineMail />
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm  flex items-center justify-center z-[101]">
          <Login onClose={() => setShowLogin(false)} />
        </div>
      )}
    </div>
  );
}
