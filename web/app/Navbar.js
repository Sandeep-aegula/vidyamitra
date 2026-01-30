import Link from "next/link";
import { FaGraduationCap, FaChartBar, FaFileAlt, FaBookOpen, FaUserCheck, FaComments, FaSuitcase, FaChartLine, FaSignOutAlt, FaWifi } from "react-icons/fa";
import React from "react";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-3 bg-[#7B6EF6] text-white shadow-md">
      <div className="flex items-center gap-2 text-2xl font-bold">
        <FaGraduationCap />
        <span>VidyāMitra</span>
      </div>
      <div className="flex gap-6 items-center">
        <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[#8F7CF8] focus:bg-white focus:text-[#7B6EF6] focus:outline-none focus:shadow-outline transition-all duration-200">
          <FaGraduationCap /> Dashboard
        </Link>
        <div className="flex flex-col items-start px-2">
          <span className="flex items-center gap-2"><FaWifi /> API</span>
          <span className="text-xs ml-6">Test</span>
        </div>
        <Link href="/resume" className="flex items-center gap-2"><FaFileAlt /> Resume</Link>
        <Link href="/evaluate" className="flex items-center gap-2"><FaChartBar /> Evaluate</Link>
        <Link href="/plan" className="flex items-center gap-2"><FaBookOpen /> Plan</Link>
        <Link href="/quiz" className="flex items-center gap-2"><FaUserCheck /> Quiz</Link>
        <Link href="/interview" className="flex items-center gap-2"><FaComments /> Interview</Link>
        <Link href="/jobs" className="flex items-center gap-2"><FaSuitcase /> Jobs</Link>
        <Link href="/progress" className="flex items-center gap-2"><FaChartLine /> Progress</Link>
        <Link href="/logout" className="flex items-center gap-2"><FaSignOutAlt /> Logout</Link>
      </div>
    </nav>
  );
}
