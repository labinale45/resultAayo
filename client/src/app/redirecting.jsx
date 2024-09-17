"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Redirect() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/Home");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="w-16 h-16 mb-4">
        <div className="w-full h-full border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <h1 className="text-2xl text-gray-700 animate-pulse">Redirecting...</h1>
    </div>
  );
}
