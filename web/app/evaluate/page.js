"use client";

import React from 'react';
import {
  User, Briefcase, Code, CheckCircle, AlertCircle,
  TrendingUp, ArrowRight, Sparkles, BookOpen
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function EvaluatePage() {
  // Mock Data for Resume Analysis
  // State to hold analysis data
  const [analysis, setAnalysis] = React.useState(null);

  React.useEffect(() => {
    // Try to get data from localStorage
    try {
      const savedData = localStorage.getItem('evaluationResults');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        // Ensure structure is correct
        setAnalysis({
          score: parsed.score || 0,
          status: parsed.status || "Analysis Complete",
          personalInfo: {
            name: parsed.personalInfo?.name || "User",
            email: parsed.personalInfo?.email || "Not provided",
            phone: parsed.personalInfo?.phone || "Not provided",
            location: parsed.personalInfo?.location || "Not specified"
          },
          experience: {
            total: parsed.experience?.total || "0 position(s)",
            found: parsed.experience?.found || []
          },
          skills: parsed.skills || [],
          strengths: parsed.strengths || ["Analyzing your background..."],
          recommendations: parsed.recommendations || ["Keep improving your profile!"]
        });
      } else {
        // Fallback or data not yet ready
        setAnalysis({
          score: 0,
          status: "Preparing analysis...",
          personalInfo: { name: "Loading...", email: "N/A", phone: "N/A", location: "N/A" },
          experience: { total: "0", found: [] },
          skills: [],
          strengths: ["Waiting for evaluation results..."],
          recommendations: ["Ensure you've uploaded a resume first."]
        });
      }
    } catch (e) {
      console.error("Failed to parse evaluation data:", e);
      setAnalysis({
        score: 0,
        status: "Error loading results",
        personalInfo: { name: "Error", email: "N/A", phone: "N/A", location: "N/A" },
        experience: { total: "0", found: [] },
        skills: [],
        strengths: ["Could not read analysis data."],
        recommendations: ["Try re-evaluating your resume."]
      });
    }
  }, []);

  if (!analysis) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
      <p className="text-gray-500 font-medium">Crunching your data...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 font-sans">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center justify-center p-3 bg-yellow-100 rounded-full mb-4 shadow-sm">
          <Sparkles className="w-8 h-8 text-yellow-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Resume Analysis Complete!</h1>
        <p className="text-gray-500 text-lg">Here's what we discovered about your professional profile</p>
      </motion.div>

      <div className="max-w-5xl w-full space-y-6">

        {/* Score Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-4 text-indigo-600 font-semibold text-lg">
            <TrendingUp size={24} /> Overall Profile Score
          </div>
          <div className="text-6xl font-bold text-indigo-600 mb-2">{analysis.score}%</div>
          <div className="text-green-500 font-medium">{analysis.status}</div>
        </motion.div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center gap-2 mb-6 text-gray-800 font-semibold text-lg">
              <User className="text-blue-500" /> Personal Information
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-500 font-medium">Name:</span>
                <span className="text-gray-900 font-semibold">{analysis.personalInfo.name}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-500 font-medium">Email:</span>
                <span className="text-red-400 font-medium">{analysis.personalInfo.email}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-500 font-medium">Phone:</span>
                <span className="text-red-400 font-medium">{analysis.personalInfo.phone}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between">
                <span className="text-gray-500 font-medium">Location:</span>
                <span className="text-red-400 font-medium">{analysis.personalInfo.location}</span>
              </div>
            </div>
          </motion.div>

          {/* Experience Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center gap-2 mb-6 text-gray-800 font-semibold text-lg">
              <Briefcase className="text-indigo-500" /> Experience Summary
            </div>
            <div className="space-y-4 text-sm">
              <div>
                <span className="text-gray-500 font-medium block mb-1">Total Experience:</span>
                <span className="text-gray-900 font-semibold">{analysis.experience.total}</span>
              </div>
              <div>
                <span className="text-gray-500 font-medium block mb-2">Positions/Keywords Found:</span>
                <div className="flex flex-wrap gap-2">
                  {analysis.experience.found.map((item, idx) => (
                    <span key={idx} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center gap-2 mb-6 text-gray-800 font-semibold text-lg">
            <Code className="text-purple-500" /> Identified Skills
          </div>
          <div className="flex flex-wrap gap-3">
            {analysis.skills.map((skill, idx) => (
              <span
                key={idx}
                className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-sm font-medium border border-indigo-100"
              >
                {skill}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Strengths & Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strengths */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center gap-2 mb-6 text-gray-800 font-semibold text-lg">
              <CheckCircle className="text-green-500" /> Key Strengths
            </div>
            <ul className="space-y-3">
              {analysis.strengths.map((str, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-gray-600">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0"></span>
                  {str}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Recommendations */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center gap-2 mb-6 text-gray-800 font-semibold text-lg">
              <AlertCircle className="text-amber-500" /> Recommendations
            </div>
            <ul className="space-y-3">
              {analysis.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-gray-600">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0"></span>
                  {rec}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Top 4 Learning Topics Card */}
        {analysis.recommendations.length >= 4 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl shadow-sm border border-indigo-100 p-6"
          >
            <div className="flex items-center gap-2 mb-4 text-indigo-700 font-semibold text-lg">
              <BookOpen className="text-indigo-600" /> Your Personalized Learning Path
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Based on your evaluation, we've identified the top 4 skills you should focus on. Create a personalized learning plan to master these topics!
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {analysis.recommendations.slice(0, 4).map((topic, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl p-3 border border-indigo-100 flex items-center gap-3"
                >
                  <div className="bg-indigo-600 text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {idx + 1}
                  </div>
                  <span className="text-gray-800 font-medium text-sm">{topic}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                const topTopics = analysis.recommendations.slice(0, 4);
                localStorage.setItem('learningTopics', JSON.stringify(topTopics));
                localStorage.setItem('targetRole', localStorage.getItem('targetRole') || 'Software Engineer');
                window.location.href = '/plan';
              }}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl text-base font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <Sparkles size={20} /> Create My Learning Plan
            </button>
          </motion.div>
        )}
        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 mb-20"
        >
          <Link href="/resume">
            <button className="bg-white text-indigo-600 border-2 border-indigo-600 px-10 py-4 rounded-full text-lg font-bold hover:bg-indigo-50 transition-all flex items-center gap-3 shadow-lg">
              Back to Resume
            </button>
          </Link>

          <Link href="/domain-selection">
            <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-4 rounded-full text-lg font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-3">
              Continue to Domain Selection <ArrowRight />
            </button>
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
