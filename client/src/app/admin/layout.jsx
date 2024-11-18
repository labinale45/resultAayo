"use client";

import { useState } from "react";
import Menu from "@/components/Menu";
import Dnav from "../../components/DNav";
import Copyright from "../../components/Mini Component/Copyright";
import FloatingAIChat from '@/components/FloatingAIChat';

export default function AdminLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(true);

  return (
    <div className="flex flex-col min-h-screen dark:bg-[#B3B4BD]">
      <Dnav />
      <div className="flex flex-1 mt-20 relative">
        <div className="fixed top-20 left-0 h-[calc(100vh-5rem)] z-50">
          <Menu setMenuOpen={setMenuOpen} />
        </div>
        <div
          className={`flex flex-col flex-1 ${
            menuOpen ? "ml-72" : "ml-20"
          } transition-all duration-300 overflow-hidden`}
        >
          <main className="flex-1 overflow-x-auto overflow-y-auto pb-16">
            <div className="min-w-0">{children}</div>
          </main>
          <FloatingAIChat />
        </div>
      </div>
      <footer
        className={`fixed bottom-0 z-10 bg-inherit transition-all duration-300 ${
          menuOpen ? "left-72" : "left-20"
        } right-0`}
      >
        <Copyright />
      </footer>
    </div>
  );
}
