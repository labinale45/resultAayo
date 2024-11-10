"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FaCalendar } from "react-icons/fa";
import Image from "next/image";

export default function Redirect() {
  const router = useRouter();
  const [notices, setNotices] = useState([]);
  const [currentNoticeIndex, setCurrentNoticeIndex] = useState(0);

  useEffect(() => {
    const fetchRecentNotices = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/auth/year?status=notices`);
        const years = await response.json();
        
        if (years?.length > 0) {
          const latestYear = years[0];
          const noticesResponse = await fetch(
            `http://localhost:4000/api/auth/records/${latestYear}?status=notices`
          );
          const noticesData = await noticesResponse.json();
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          
          const recentNotices = noticesData.filter(notice => 
            new Date(notice.created_at) >= sevenDaysAgo
          );
          setNotices(recentNotices);
        }
      } catch (error) {
        console.error('Failed to fetch notices:', error);
      }
    };

    fetchRecentNotices();

    const noticeInterval = setInterval(() => {
      setCurrentNoticeIndex(prev => 
        prev === notices.length - 1 ? 0 : prev + 1
      );
    }, 5000); // Slower transition between notices

    const redirectTimer = setTimeout(() => {
      router.push("/Home");
    }, 5000); // 5 second delay before redirect

    return () => {
      clearTimeout(redirectTimer);
      clearInterval(noticeInterval);
    };
  }, [router, notices.length]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
     
      <AnimatePresence mode="wait">
        {notices[currentNoticeIndex] && (
          <motion.div
            key={currentNoticeIndex}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
          >
            {notices[currentNoticeIndex].img_url && (
              <div className="relative h-48 w-full">
                <Image
                  src={notices[currentNoticeIndex].img_url}
                  alt={notices[currentNoticeIndex].title}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform hover:scale-105"
                />
              </div>
            )}
            
            <div className="p-6">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-2">
                <FaCalendar className="text-sm" />
                <span className="text-sm">
                  {new Date(notices[currentNoticeIndex].created_at).toLocaleDateString()}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                {notices[currentNoticeIndex].title}
              </h3>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <h1 className="text-2xl text-gray-700 dark:text-gray-300 animate-pulse mt-8">
        Redirecting...
      </h1>

      <div className="w-16 h-16 mt-8">
        <div className="w-full h-full border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
}
