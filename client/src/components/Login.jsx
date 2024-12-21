"use client";

import React, { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Spinner = () => (
  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
);

export default function Login({ onClose }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const route = useRouter();

  const handleLogin = async (formData) => {
    setIsLoading(true);
    setErrorMessage("");
  
    try {
      const response = await fetch("http://localhost:4000/api/auth/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          password
        })
      });

      const data = await response.json();
    
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('userData', JSON.stringify(data.userData));
      localStorage.setItem('token', data.token);
      document.cookie = `token=${data.token}; path=/`;
      document.cookie = `userData=${JSON.stringify(data.userData)}; path=/`;
    
      // Use a Promise to ensure page load before stopping spinner
      await new Promise((resolve) => {
        switch (data.message) {
          case "Admin":
            route.push("/admin");
            break;
          case "teachers":
            if (data.stat === "active"){
              route.push("/teacher");
            }else{
              setIsLoading(false);
              setErrorMessage("Your account is not active yet. Please contact the admin.");
            }
            break;
          case "students":
            route.push("/student");
            break;
          default:
            throw new Error('Invalid role');
        }
        
        // Add a small delay to ensure spinner shows during page transition
        setTimeout(resolve, 1000);
      });
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage(error.message);
      setIsLoading(false);
    }
  };  return (
    <div className="bg-white dark:bg-[#253553] dark:text-white flex rounded-xl shadow-lg max-w-4xl p-6 relative">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-red-600 hover:text-gray-300 text-3xl font-bold"
      >
        &times;
      </button>
      <div className="sm:w-1/2 px=18 dark:text-white">
        <br />
        <br />
        <h1 className="text-[#253553] dark:text-white text-3xl font-bold flex items-center justify-center">
          L O G I N
        </h1>
        <p className="text-[#253553] dark:text-white text-l mt-4 flex items-center justify-center">
          If you're a registered member, log in here.
        </p>
        {errorMessage && (
          <p className="text-red-500 text-center mt-4">{errorMessage}</p>
        )}
        <form onSubmit={(e) => {
          e.preventDefault();
          handleLogin({ username, password });
        }} className="flex-col gap-2">
          <input
            className="txt p-3 mt-8 w-72 rounded-xl border"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <br />
          <input
            className="txt p-3 mt-8 w-72 rounded-xl border"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <br />
          <button
            className="text-white  bbg-[#7ba0e4] bg-[#8AA4D6] hover:bg-[#4c94ec] dark:hover:bg-[#253553] hover:text-white
                shadow-lgtext-center w-72 p-3 mt-10 rounded-xl  duration-300 flex items-center justify-center
                 dark:bg-[#8AA4D6]     text-center  shadow-xl font-bold"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? <Spinner /> : "L O G I N"}
          </button>
        </form>
      </div>
      <div className="sm:block hidden w-1/2">
        <Image
          className="rounded-2xl"
          width={500}
          height={500}
          src="/assets/popup.png"
          alt="Login Illustration"
        />
      </div>
    </div>
  );
}
