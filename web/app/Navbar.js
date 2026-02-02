"use client";

import Link from "next/link";
import { FaGraduationCap, FaChartBar, FaFileAlt, FaBookOpen, FaUserCheck, FaComments, FaSuitcase, FaSignOutAlt, FaUser } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Check for token on mount and when it changes (simplified)
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const name = localStorage.getItem('user_name');
      setIsLoggedIn(!!token);
      setUserName(name || "");
    };

    checkAuth();
    // Listen for storage events (if user logs in in another tab)
    window.addEventListener('storage', checkAuth);

    // Check periodically for changes in this tab as well (since login might not trigger 'storage' event here)
    const interval = setInterval(checkAuth, 1000);

    return () => {
      window.removeEventListener('storage', checkAuth);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_name');
    setIsLoggedIn(false);
    router.push('/login');
  };

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-[#FDFBF7] text-[#4A4E69] border-b border-[#E9E1D6] shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
      <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-[#E67E22] transition-colors hover:text-[#D35400] cursor-pointer">
        <FaGraduationCap className="text-3xl" />
        <span className="tracking-tight font-sans">VidyāMitra</span>
      </Link>

      <div className="flex gap-6 items-center">
        {isLoggedIn && (
          <>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold hover:bg-[#F2EDE4] active:bg-[#E8D9CB] focus:outline-none transition-all duration-200"
            >
              <FaGraduationCap className="text-[#5D8AA8]" /> Dashboard
            </Link>
            <Link href="/resume" className="flex items-center gap-2 px-2 py-1 rounded hover:text-[#5D8AA8] transition-colors font-medium">
              <FaFileAlt className="text-[#5D8AA8]" /> Resume
            </Link>
            <Link href="/evaluate" className="flex items-center gap-2 px-2 py-1 rounded hover:text-[#5F8575] transition-colors font-medium">
              <FaChartBar className="text-[#5F8575]" /> Evaluate
            </Link>
            <Link href="/plan" className="flex items-center gap-2 px-2 py-1 rounded hover:text-[#B38B00] transition-colors font-medium">
              <FaBookOpen className="text-[#B38B00]" /> Plan
            </Link>
            <Link href="/quiz" className="flex items-center gap-2 px-2 py-1 rounded hover:text-[#8E7CC3] transition-colors font-medium">
              <FaUserCheck className="text-[#8E7CC3]" /> Quiz
            </Link>
            <Link href="/interview" className="flex items-center gap-2 px-2 py-1 rounded hover:text-[#E17055] transition-colors font-medium">
              <FaComments className="text-[#E17055]" /> Interview
            </Link>
            <Link href="/jobs" className="flex items-center gap-2 px-2 py-1 rounded hover:text-[#5F8575] transition-colors font-medium">
              <FaSuitcase className="text-[#A3C4BC]" /> Jobs
            </Link>

            <div className="h-6 w-[1px] bg-[#E9E1D6] mx-2"></div>

            <div className="flex items-center gap-3 ml-2">
              <div className="flex flex-col items-end">
                <span className="text-xs font-bold text-[#4A4E69] leading-none">{userName}</span>
                <button
                  onClick={handleLogout}
                  className="text-[10px] text-[#E17055] font-bold hover:underline mt-1 flex items-center gap-1"
                >
                  <FaSignOutAlt size={8} /> Logout
                </button>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#F2DFCE] flex items-center justify-center border border-[#E8D9CB]">
                <FaUser className="text-[#E67E22] text-sm" />
              </div>
            </div>
          </>
        )}

        {!isLoggedIn && (
          <div className="flex gap-4">
            <Link href="/login" className="px-5 py-2 rounded-xl text-sm font-bold text-[#4A4E69] hover:bg-[#F2EDE4] transition-all">
              Login
            </Link>
            <Link href="/signup" className="px-5 py-2 rounded-xl text-sm font-bold bg-[#5D8AA8] text-white shadow-md hover:bg-[#4A7A9A] transition-all">
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

