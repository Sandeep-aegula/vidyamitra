"use client";

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Calendar, BookOpen, PlayCircle, CheckCircle, Clock,
  ExternalLink, Video, ChevronRight, Award, ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const ROLE_ID_TO_TITLE = {
  'software-engineer': 'Software Engineer',
  'data-scientist': 'Data Scientist',
  'devops-engineer': 'DevOps Engineer',
  'product-manager': 'Product Manager'
};

export default function PlanPage() {
  const searchParams = useSearchParams();
  const [weeks, setWeeks] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [planId, setPlanId] = React.useState(null);
  const [userId] = React.useState("user_123"); // Mock user for now

  React.useEffect(() => {
    const fetchPlan = async () => {
      try {
        const evaluation = JSON.parse(localStorage.getItem('evaluationResults') || '{}');
        const roleFromUrl = searchParams.get('role');
        const role = roleFromUrl
          ? (ROLE_ID_TO_TITLE[roleFromUrl] || roleFromUrl.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()))
          : (localStorage.getItem('targetRole') || 'Software Engineer');
        if (role) localStorage.setItem('targetRole', role);

        // Prepare request
        const requestBody = {
          role: role,
          skills_found: evaluation.skills || [],
          missing_skills: evaluation.recommendations || [] // Using recommendations as a proxy for gaps
        };

        const response = await fetch(`http://localhost:8000/plan/?user_id=${userId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        if (data.weeks) {
          setWeeks(data.weeks);
          // If we had a plan ID from the DB, we'd set it here. 
          // For now, let's assume the backend returns one or we search for it.
          // Since it's a new plan every time in this mock, we might need to fetch the ID.
          // Let's modify the backend briefly if needed, but for now just local state.
        }
      } catch (error) {
        console.error("Failed to fetch plan:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, []);

  const handleCompleteWeek = async (weekNum) => {
    // In a real app, we'd call the PATCH /complete/{planId} here
    // For now, just update local state to show 'wow' factor
    setWeeks(weeks.map(w => w.week === weekNum ? { ...w, completed: true } : w));

    // Optional: Toast or feedback
    console.log(`Week ${weekNum} marked as completed!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-gray-500 font-medium">Generating your personalized roadmap...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header Card */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 flex items-center gap-6">
          <div className="bg-blue-100 p-4 rounded-xl">
            <Calendar className="text-blue-600 w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Your AI Career Roadmap</h1>
            <p className="text-gray-600">Based on your evaluation, here is your path to becoming a professional.</p>
          </div>
        </div>

        {/* Section Title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xl font-bold text-gray-800">
            <BookOpen className="text-indigo-600" /> Weekly Schedule
          </div>
          <div className="text-sm font-medium text-gray-500">
            {weeks.filter(w => w.completed).length} of {weeks.length} Weeks Completed
          </div>
        </div>

        {/* Weeks */}
        <div className="space-y-6">
          {weeks.map((week, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-2xl border ${week.completed ? 'border-green-200' : 'border-gray-200'} shadow-sm overflow-hidden transition-all`}
            >
              <div className="p-6">

                {/* Week Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start gap-4">
                    <div className={`${week.completed ? 'bg-green-500' : 'bg-indigo-600'} text-white font-bold rounded-lg w-12 h-12 flex items-center justify-center flex-shrink-0 transition-colors`}>
                      {week.completed ? <CheckCircle size={24} /> : `W${week.week}`}
                    </div>
                    <div>
                      <h2 className={`text-xl font-bold ${week.completed ? 'text-green-700' : 'text-gray-900'}`}>{week.focus}</h2>
                      <p className="text-sm text-gray-500 mt-1">{week.description}</p>
                    </div>
                  </div>
                  {!week.completed && (
                    <button
                      onClick={() => handleCompleteWeek(week.week)}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 px-3 py-1 rounded-full border border-indigo-100 hover:bg-indigo-50"
                    >
                      Mark Completed
                    </button>
                  )}
                </div>

                {/* Tasks */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-sm font-bold text-indigo-600 mb-3">
                    <TargetIcon size={16} /> Tasks
                  </div>
                  <ul className="space-y-3">
                    {week.tasks.map((task, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                        <span className={`w-1.5 h-1.5 ${week.completed ? 'bg-green-400' : 'bg-gray-300'} rounded-full mt-2 flex-shrink-0`}></span>
                        <span className={week.completed ? 'line-through text-gray-400' : ''}>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* YouTube Resource Card */}
                {week.videos && week.videos[0] && (
                  <div className="bg-blue-50 rounded-xl border border-blue-100 p-4 mb-6">
                    <div className="flex items-center gap-2 text-sm font-bold text-blue-600 mb-3">
                      <Video size={16} /> Recommended YouTube Course
                    </div>
                    <a
                      href={week.videos[0].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white rounded-lg border border-blue-100 p-4 flex flex-col sm:flex-row gap-4 hover:shadow-md transition-shadow cursor-pointer block"
                    >
                      <div className="w-full sm:w-40 h-24 rounded-lg overflow-hidden flex-shrink-0 relative group">
                        <img
                          src={week.videos[0].thumbnail}
                          alt={week.videos[0].title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <PlayCircle className="text-white w-10 h-10" />
                        </div>
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">{week.videos[0].title}</h3>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-2">
                          <span className="flex items-center gap-1 font-semibold text-indigo-600">
                            {week.videos[0].channel}
                          </span>
                          <span className="flex items-center gap-1 text-gray-400">
                            Click to watch on YouTube <ExternalLink size={12} />
                          </span>
                        </div>
                      </div>
                    </a>
                  </div>
                )}

                {/* Outcomes */}
                <div>
                  <div className="flex items-center gap-2 text-sm font-bold text-indigo-600 mb-3">
                    <TrendingIcon size={16} /> Learning Goals
                  </div>
                  <ul className="space-y-2">
                    {week.outcomes.map((outcome, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></span>
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </motion.div>
          ))}
        </div>

        {/* Next Step */}
        <div className="flex justify-center pt-8">
          <Link href="/quiz">
            <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-4 rounded-full text-lg font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-3">
              Go to Quiz Central <ArrowRight />
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}

// Helper Icons
function TargetIcon({ size = 24, className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function TrendingIcon({ size = 24, className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}