import Link from "next/link";
import { FaGraduationCap, FaChartBar, FaFileAlt, FaBookOpen, FaUserCheck, FaComments, FaSuitcase, FaChartLine, FaSignOutAlt, FaWifi } from "react-icons/fa";
import React from "react";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-[#FDFBF7] text-[#4A4E69] border-b border-[#E9E1D6] shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
      <div className="flex items-center gap-2 text-2xl font-bold text-[#E67E22] transition-colors hover:text-[#D35400] cursor-pointer">
        <FaGraduationCap className="text-3xl" />
        <span className="tracking-tight font-sans">VidyāMitra</span>
      </div>
      <div className="flex gap-6 items-center">
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
      </div>
    </nav>
  );
}
