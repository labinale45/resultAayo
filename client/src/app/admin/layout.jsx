"use client";

import { useState } from "react";
import Menu from "@/components/Menu";
import Dnav from "../../components/Dnav";
import Copyright from "../../components/Mini Component/Copyright";

export default function RootLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(true);

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Dnav />
        <div className="flex flex-1 mt-20 mb-16 dark:bg-[#253553] dark:text-white">
          {" "}
          <div className="fixed top-13 left-0 h-[calc(100vh-5rem)] z-50">
            <Menu setMenuOpen={setMenuOpen} />
          </div>
          <main
            className={`flex-1 ${
              menuOpen ? "ml-72" : "ml-20"
            } transition-all duration-300 overflow-x-hidden`}
          >
            <div className="p-1 ">{children}</div>
          </main>
        </div>
        <div className="fixed bottom-0 left-64 right-0 z-0 ">
          <Copyright />
        </div>
      </body>
    </html>
  );
}
