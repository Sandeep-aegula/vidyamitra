"use client";

import React from 'react';
import {
  BarChart2, Target, Mic, CheckCircle, XCircle,
  Calendar, RotateCcw, TrendingUp, TrendingDown, BookOpen, Zap, TrendingUpIcon
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProgressPage() {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [userId] = React.useState("550e8400-e29b-41d4-a716-446655440000"); // Mock UUID match

  React.useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await fetch(`http://localhost:8000/progress/${userId}`);
        const result = await response.json();
        if (result.stats) {
          setData(result);
        }
      } catch (error) {
        console.error("Failed to fetch progress:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  if (loading || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-gray-500 font-medium">Loading your profile journey...</p>
      </div>
    );
  }

  const { stats, quiz_history, interview_history, insights } = data;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Your Career Dashboard</h1>
          <p className="text-gray-500 text-lg">Real-time tracking of your growth and market potential</p>
        </div>

        {/* Stats & Badges Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Stats */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm"
            >
              <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-blue-600 font-bold">
                <CheckCircle size={24} />
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.completed_modules}</div>
              <div className="text-sm font-medium text-gray-500">Modules Completed</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm"
            >
              <div className="bg-indigo-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-indigo-600 font-bold">
                <Target size={24} />
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.average_quiz_score}%</div>
              <div className="text-sm font-medium text-gray-500">Avg Quiz Score</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm"
            >
              <div className="bg-pink-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-pink-600 font-bold">
                <Mic size={24} />
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.interviews_done}</div>
              <div className="text-sm font-medium text-gray-500">Interviews Practice</div>
            </motion.div>
          </div>

          {/* Badges Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-xl"
          >
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp size={20} /> Your Badges
            </h3>
            <div className="flex flex-wrap gap-4">
              {stats.badges && stats.badges.length > 0 ? stats.badges.map((badge, i) => (
                <div key={i} className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-bold border border-white/30 flex items-center gap-2">
                  <Calendar size={14} /> {badge}
                </div>
              )) : (
                <p className="text-indigo-100 text-sm italic">Complete courses to earn your first badge!</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Middle Section: History & Market Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* History Tabs/Cards */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-2 text-xl font-bold text-gray-800 mb-6 font-sans">
                <BarChart2 className="text-indigo-600" /> Recent Quiz Performance
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500">
                    <tr>
                      <th className="px-6 py-4 text-left font-bold">Topic</th>
                      <th className="px-6 py-4 text-left font-bold">Score</th>
                      <th className="px-6 py-4 text-left font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {quiz_history.slice(0, 5).map((q, i) => (
                      <tr key={i} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4 font-bold text-gray-900">{q.domain}</td>
                        <td className="px-6 py-4 font-bold text-indigo-600">{q.score}%</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${q.score >= 70 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {q.score >= 70 ? 'PASSED' : 'SKILL GAP'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {quiz_history.length === 0 && (
                      <tr><td colSpan="3" className="px-6 py-8 text-center text-gray-400 italic">No quizzes taken yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Market Insights (Real API Data) */}
          <div className="space-y-8">
            <div className="flex items-center gap-2 text-xl font-bold text-gray-800 mb-6">
              <TrendingUp className="text-green-600" /> Market Intelligence
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
              {/* News Section */}
              <div>
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Latest Tech Trends</h4>
                <div className="space-y-4">
                  {insights.news.map((news, i) => (
                    <a key={i} href={news.url} target="_blank" rel="noopener noreferrer" className="block group">
                      <p className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">{news.title}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{news.source.name} • {new Date(news.publishedAt).toLocaleDateString()}</p>
                    </a>
                  ))}
                </div>
              </div>

              <div className="h-px bg-gray-100 w-full" />

              {/* Exchange/Currency Section */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Market Exchange (USD/INR)</h4>
                  <p className="text-xs text-gray-400">Current global market trend proxy</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-green-600">₹{insights.market.rates?.INR || 'N/A'}</div>
                  <div className="text-[10px] font-bold text-green-500">+Real-time</div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}