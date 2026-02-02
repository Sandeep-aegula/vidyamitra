"use client";

import React, { useState, useEffect } from "react";
import { FaUserCircle, FaMedal, FaChartLine, FaCalendarCheck, FaRocket, FaClipboardCheck, FaBookOpen, FaQuestionCircle, FaStar, FaCheckCircle, FaUserEdit, FaTasks, FaComments, FaSuitcase } from "react-icons/fa";
import Link from "next/link";

export default function Dashboard() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const name = localStorage.getItem('user_name');
    if (name) setUserName(name);
  }, []);

  return (
    <div className="min-h-screen bg-[#F9F7F2] p-6 text-[#4A4E69]">
      {/* Header */}
      <div className="rounded-xl bg-linear-to-r from-[#F2DFCE] to-[#D7E9E9] border border-[#E8D9CB] p-6 flex justify-between items-center shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
        <div>
          <h1 className="text-3xl font-bold text-[#4A4E69] mb-1 flex items-center gap-2">
            Welcome{userName ? `, ${userName}` : " to VidyāMitra"}! <span>👋</span>
          </h1>
          <p className="text-[#4A4E69]/80 text-lg">Ready to advance your career today?</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
        <StatCard icon={<FaClipboardCheck />} label="Skills Assessed" value="12" sub="+3 this week" bgColor="bg-[#E3F2FD]" iconColor="text-[#5D8AA8]" />
        <StatCard icon={<FaMedal />} label="Achievements" value="8" sub="New badge earned" bgColor="bg-[#E8F5E9]" iconColor="text-[#5F8575]" />
        <StatCard icon={<FaChartLine />} label="Profile Score" value="85%" sub="+5% this month" bgColor="bg-[#FFF9C4]" iconColor="text-[#B38B00]" />
        <StatCard icon={<FaCalendarCheck />} label="Streak Days" value="15" sub="Keep it up!" bgColor="bg-[#F3E5F5]" iconColor="text-[#8E7CC3]" />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Quick Actions */}
        <div className="col-span-2 flex flex-col gap-6">
          <div className="bg-[#FCFBF7] rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#E9E1D6] p-6 text-[#4A4E69]">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2 text-[#4A4E69] font-sans"><FaRocket className="text-[#78A1BB]" /> Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <ActionCard icon={<FaUserEdit className="text-[#78A1BB]" />} title="Start Career Journey" desc="Begin with resume analysis and career planning" />
              <ActionCard icon={<FaClipboardCheck className="text-[#A3C4BC]" />} title="Skill Evaluation" desc="Assess your skills vs job requirements" />
              <ActionCard icon={<FaBookOpen className="text-[#F2D0A9]" />} title="Learning Plan" desc="Get personalized training roadmap" />
              <ActionCard icon={<FaQuestionCircle className="text-[#BFACC8]" />} title="Practice Quiz" desc="Test your knowledge with AI quizzes" />
            </div>
          </div>

          {/* Recommended for You */}
          <div className="bg-[#FCFBF7] rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#E9E1D6] p-6 text-[#4A4E69]">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2 text-[#4A4E69]"><FaStar className="text-[#F2D0A9]" /> Recommended for You</h2>
            <div className="flex flex-col gap-6">
              <RecommendedCard title="Complete Your Profile" desc="Add your work experience to get better job matches" percent={75} buttonLabel="Complete Now" buttonColor="bg-[#78A1BB]" progressColor="bg-[#78A1BB]" />
              <RecommendedCard title="Take Skill Assessment" desc="Evaluate your JavaScript skills to unlock new opportunities" percent={0} buttonLabel="Start Assessment" buttonColor="bg-[#A3C4BC]" progressColor="bg-[#A3C4BC]" />
              <RecommendedCard title="Practice Interview" desc="Prepare for your next interview with AI-powered practice" percent={25} buttonLabel="Continue" buttonColor="bg-[#BFACC8]" progressColor="bg-[#BFACC8]" />
            </div>
          </div>
        </div>

        {/* Right Side: Recent Activity & More Actions */}
        <div className="flex flex-col gap-6">
          <div className="bg-[#FCFBF7] rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#E9E1D6] p-6 text-[#4A4E69]">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2 text-[#4A4E69]"><FaCheckCircle className="text-[#A3C4BC]" /> Recent Activity</h2>
            <ul className="flex flex-col gap-3 text-sm text-[#4A4E69]/80">
              <li className="flex items-center gap-2"><FaClipboardCheck className="text-[#78A1BB]" /> Completed Resume Analysis <span className="ml-auto text-xs text-[#9B9B9B]">2 hours ago</span></li>
              <li className="flex items-center gap-2"><FaBookOpen className="text-[#F2D0A9]" /> Started JavaScript Course <span className="ml-auto text-xs text-[#9B9B9B]">1 day ago</span></li>
              <li className="flex items-center gap-2"><FaMedal className="text-[#A3C4BC]" /> Earned "Profile Builder" Badge <span className="ml-auto text-xs text-[#9B9B9B]">3 days ago</span></li>
              <li className="flex items-center gap-2"><FaQuestionCircle className="text-[#BFACC8]" /> Scored 97% in React Quiz <span className="ml-auto text-xs text-[#9B9B9B]">1 week ago</span></li>
              <li className="flex items-center gap-2"><FaQuestionCircle className="text-[#BFACC8]" /> Scored 92% in React Quiz <span className="ml-auto text-xs text-[#9B9B9B]">1 week ago</span></li>
            </ul>
          </div>
          <div className="bg-[#FCFBF7] rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#E9E1D6] p-6 text-[#4A4E69]">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2 text-[#4A4E69]"><FaTasks className="text-[#E17055]" /> More Actions</h2>
            <div className="flex flex-col gap-3">
              <ActionLink icon={<FaComments className="text-[#E17055]" />} label="Mock Interview" href="/interview" />
              <ActionLink icon={<FaSuitcase className="text-[#A3C4BC]" />} label="Job Matching" href="/job-listings" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub, bgColor, iconColor }) {
  return (
    <div className={`${bgColor} rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-[#E9E1D6]/50 flex flex-col items-center p-5`}>
      <div className={`text-3xl mb-2 ${iconColor}`}>{icon}</div>
      <div className="text-2xl font-bold mb-1 text-[#2D3436]">{value}</div>
      <div className="text-sm font-medium text-[#4A4E69] mb-1">{label}</div>
      <div className="text-xs text-[#9B9B9B]">{sub}</div>
    </div>
  );
}

function ActionCard({ icon, title, desc }) {
  return (
    <div className="flex flex-col items-start bg-white border border-[#F2EDE4] rounded-lg p-4 gap-2 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:bg-[#F9F7F2] transition-colors">
      <div className="text-2xl">{icon}</div>
      <div className="font-semibold text-base text-[#4A4E69]">{title}</div>
      <div className="text-xs text-[#9B9B9B]">{desc}</div>
    </div>
  );
}

function RecommendedCard({ title, desc, percent, buttonLabel, buttonColor, progressColor }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <div>
          <div className="font-semibold text-base text-[#4A4E69]">{title}</div>
          <div className="text-xs text-[#9B9B9B]">{desc}</div>
        </div>
        <button className={`text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-md hover:filter hover:brightness-95 transition-all ${buttonColor}`}>{buttonLabel}</button>
      </div>
      <div className="w-full h-2 bg-[#F2EDE4] rounded-full mt-2 overflow-hidden">
        <div className={`h-2 rounded-full ${progressColor}`} style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  );
}

function ActionLink({ icon, label, href }) {
  return (
    <Link href={href || "#"} className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white hover:bg-[#F9F7F2] text-sm font-semibold border border-[#F2EDE4] shadow-[0_2px_8px_rgba(0,0,0,0.01)] text-[#4A4E69] transition-all">
      {icon} {label}
    </Link>
  );
}