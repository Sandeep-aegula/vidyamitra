import { FaUserCircle, FaMedal, FaChartLine, FaCalendarCheck, FaRocket, FaClipboardCheck, FaBookOpen, FaQuestionCircle, FaStar, FaCheckCircle, FaPlayCircle, FaUserEdit, FaTasks, FaComments, FaSuitcase } from "react-icons/fa";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-linear-to-b from-[#7B6EF6]/80 to-[#f5f6fa] p-6 text-gray-900">
      {/* Header */}
      <div className="rounded-xl bg-linear-to-r from-[#7B6EF6] to-[#8F7CF8] p-6 flex justify-between items-center shadow-lg">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-2">Welcome back, John! <span>👋</span></h1>
          <p className="text-white/90 text-lg">Ready to advance your career today?</p>
        </div>
        <div className="flex items-center gap-3 bg-white/10 rounded-lg px-5 py-3">
          <FaUserCircle className="text-3xl text-white" />
          <div>
            <div className="font-semibold text-white">Sandeep Aegula</div>
            <div className="text-xs opacity-80 text-white">sandeepaegula@gmail.com</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
        <StatCard icon={<FaClipboardCheck />} label="Skills Assessed" value="12" sub="+3 this week" color="text-blue-500" />
        <StatCard icon={<FaMedal />} label="Achievements" value="8" sub="New badge earned" color="text-green-500" />
        <StatCard icon={<FaChartLine />} label="Profile Score" value="85%" sub="+5% this month" color="text-yellow-500" />
        <StatCard icon={<FaCalendarCheck />} label="Streak Days" value="15" sub="Keep it up!" color="text-purple-500" />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Quick Actions */}
        <div className="col-span-2 flex flex-col gap-6">
          <div className="bg-white rounded-xl shadow p-6 text-gray-900">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2 text-gray-900"><FaRocket className="text-blue-400" /> Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <ActionCard icon={<FaUserEdit className="text-blue-400" />} title="Start Career Journey" desc="Begin with resume analysis and career planning" />
              <ActionCard icon={<FaClipboardCheck className="text-green-400" />} title="Skill Evaluation" desc="Assess your skills vs job requirements" />
              <ActionCard icon={<FaBookOpen className="text-yellow-400" />} title="Learning Plan" desc="Get personalized training roadmap" />
              <ActionCard icon={<FaQuestionCircle className="text-purple-400" />} title="Practice Quiz" desc="Test your knowledge with AI quizzes" />
            </div>
          </div>

          {/* Recommended for You */}
          <div className="bg-white rounded-xl shadow p-6 text-gray-900">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2 text-gray-900"><FaStar className="text-yellow-400" /> Recommended for You</h2>
            <div className="flex flex-col gap-6">
              <RecommendedCard title="Complete Your Profile" desc="Add your work experience to get better job matches" percent={75} buttonLabel="Complete Now" buttonColor="bg-blue-500" />
              <RecommendedCard title="Take Skill Assessment" desc="Evaluate your JavaScript skills to unlock new opportunities" percent={0} buttonLabel="Start Assessment" buttonColor="bg-green-500" />
              <RecommendedCard title="Practice Interview" desc="Prepare for your next interview with AI-powered practice" percent={25} buttonLabel="Continue" buttonColor="bg-purple-500" />
            </div>
          </div>
        </div>

        {/* Right Side: Recent Activity & More Actions */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-xl shadow p-6 text-gray-900">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2 text-gray-900"><FaCheckCircle className="text-green-400" /> Recent Activity</h2>
            <ul className="flex flex-col gap-3 text-sm">
              <li className="flex items-center gap-2"><FaClipboardCheck className="text-blue-400" /> Completed Resume Analysis <span className="ml-auto text-xs text-gray-400">2 hours ago</span></li>
              <li className="flex items-center gap-2"><FaBookOpen className="text-yellow-400" /> Started JavaScript Course <span className="ml-auto text-xs text-gray-400">1 day ago</span></li>
              <li className="flex items-center gap-2"><FaMedal className="text-green-400" /> Earned "Profile Builder" Badge <span className="ml-auto text-xs text-gray-400">3 days ago</span></li>
              <li className="flex items-center gap-2"><FaQuestionCircle className="text-purple-400" /> Scored 97% in React Quiz <span className="ml-auto text-xs text-gray-400">1 week ago</span></li>
              <li className="flex items-center gap-2"><FaQuestionCircle className="text-purple-400" /> Scored 92% in React Quiz <span className="ml-auto text-xs text-gray-400">1 week ago</span></li>
            </ul>
          </div>
          <div className="bg-white rounded-xl shadow p-6 text-gray-900">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2 text-gray-900"><FaTasks className="text-pink-400" /> More Actions</h2>
            <div className="flex flex-col gap-3">
              <ActionLink icon={<FaComments className="text-pink-400" />} label="Mock Interview" />
              <ActionLink icon={<FaSuitcase className="text-green-400" />} label="Job Matching" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div className="bg-white rounded-xl shadow flex flex-col items-center p-5">
      <div className={`text-3xl mb-2 ${color}`}>{icon}</div>
      <div className="text-2xl font-bold mb-1 text-gray-900">{value}</div>
      <div className="text-sm font-medium text-gray-700 mb-1">{label}</div>
      <div className="text-xs text-gray-400">{sub}</div>
    </div>
  );
}

function ActionCard({ icon, title, desc }) {
  return (
    <div className="flex flex-col items-start bg-gray-50 rounded-lg p-4 gap-2 shadow-sm border border-gray-100">
      <div className="text-2xl">{icon}</div>
      <div className="font-semibold text-base text-gray-900">{title}</div>
      <div className="text-xs text-gray-500">{desc}</div>
    </div>
  );
}

function RecommendedCard({ title, desc, percent, buttonLabel, buttonColor }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <div>
          <div className="font-semibold text-base text-gray-900">{title}</div>
          <div className="text-xs text-gray-500">{desc}</div>
        </div>
        <button className={`text-white px-4 py-1 rounded-full text-xs font-semibold shadow ${buttonColor}`}>{buttonLabel}</button>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
        <div className={`h-2 rounded-full ${buttonColor}`} style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  );
}

function ActionLink({ icon, label }) {
  return (
    <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-sm font-medium border border-gray-100 shadow-sm">
      {icon} {label}
    </button>
  );
}