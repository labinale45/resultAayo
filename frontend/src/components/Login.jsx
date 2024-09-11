"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Spinner = () => (
  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
);

export default function Login({ onClose }) {
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (Username === "admin" && Password === "admin") {
      router.push("/admin");
    } else if (Username === "user" && Password === "user") {
      router.push("/user");
    } else {
      setErrorMessage("Invalid login credentials");
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 flex rounded-xl shadow-lg max-w-4xl p-6 relative">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-red-600 hover:text-gray-300 text-3xl font-bold"
      >
        &times;
      </button>
      <div className="sm:w-1/2 px=18">
        <br />
        <br />
        <h1 className="text-[#253553] text-3xl font-bold flex items-center justify-center">
          L O G I N
        </h1>
        <p className="text-[#253553] text-l mt-4 flex items-center justify-center">
          If you're a registered member, log in here.
        </p>
        {errorMessage && (
          <p className="text-red-500 text-center mt-4">{errorMessage}</p>
        )}
        <form onSubmit={handleLogin} className="flex-col gap-2">
          <input
            className="txt p-3 mt-8 w-72 rounded-xl border"
            type="text"
            placeholder="Username"
            value={Username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <br />
          <input
            className="txt p-3 mt-8 w-72 rounded-xl border"
            type="password"
            placeholder="Password"
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <br />
          <button
            className="text-white font-bold bg-[#8AA4D6] w-72 p-3 mt-10 rounded-xl hover:bg-[#253553] duration-300 flex items-center justify-center"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? <Spinner /> : "L O G I N"}
          </button>
        </form>
      </div>
      <div className="sm:block hidden w-1/2">
        <img
          className="rounded-2xl"
          src="/assets/popup.png"
          alt="Login Illustration"
        />
      </div>
    </div>
  );
}
