"use client";

import React, { useState } from 'react';
import { Search, Code, TrendingUp, BarChart3, Cloud, Layout, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for Job Roles - focusing on IT/Tech as per the screenshot context
  const jobRoles = [
    {
      id: 'software-engineer',
      title: 'Software Engineer',
      demand: 'High Demand',
      demandColor: 'bg-green-100 text-green-700',
      description: 'Design, develop, and maintain software applications and systems',
      experience: '2-5 years',
      salary: '$75,000 - $120,000',
      skills: ['JavaScript', 'Python', 'React', 'Node.js'],
      icon: <Code className="text-blue-500" />
    },
    {
      id: 'data-scientist',
      title: 'Data Scientist',
      demand: 'High Demand',
      demandColor: 'bg-green-100 text-green-700',
      description: 'Analyze complex data to help organizations make informed decisions',
      experience: '3-6 years',
      salary: '$85,000 - $140,000',
      skills: ['Python', 'R', 'Machine Learning', 'SQL'],
      icon: <BarChart3 className="text-purple-500" />
    },
    {
      id: 'devops-engineer',
      title: 'DevOps Engineer',
      demand: 'High Demand',
      demandColor: 'bg-green-100 text-green-700',
      description: 'Manage infrastructure, deployment pipelines, and system reliability',
      experience: '3-7 years',
      salary: '$80,000 - $130,000',
      skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
      icon: <Cloud className="text-orange-500" />
    },
    {
      id: 'product-manager',
      title: 'Product Manager',
      demand: 'Medium Demand',
      demandColor: 'bg-yellow-100 text-yellow-700',
      description: 'Define product strategy and coordinate development teams',
      experience: '4-8 years',
      salary: '$90,000 - $150,000',
      skills: ['Product Strategy', 'Agile', 'Analytics', 'User Research'],
      icon: <Layout className="text-indigo-500" />
    }
  ];

  const filteredRoles = jobRoles.filter(role =>
    role.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-pink-100 rounded-full mb-6">
            <TargetIcon />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Select Your Desired Job Role</h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Choose the specific role you're targeting. We'll analyze your eligibility and create a personalized plan to help you achieve your career goals.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-16 relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search job roles, skills, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-full border border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-gray-700 bg-white"
            />
          </div>
        </div>

        {/* Job Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoles.map((role, index) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/plan?role=${role.id}`} className="block h-full">
                <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-indigo-500 hover:shadow-lg transition-all cursor-pointer h-full flex flex-col">

                  {/* Card Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <span className="p-2 bg-gray-50 rounded-lg">{role.icon}</span>
                      <h3 className="font-bold text-gray-900 text-lg">{role.title}</h3>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${role.demandColor}`}>
                      {role.demand}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-500 text-sm mb-4 flex-grow">
                    {role.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs text-indigo-600 font-medium mb-4">
                    <span className="flex items-center gap-1"><TrendingUp size={14} /> {role.experience}</span>
                    <span>•</span>
                    <span>{role.salary}</span>
                  </div>

                  {/* Skills */}
                  <div>
                    <div className="text-xs font-semibold text-gray-900 mb-2">Key Skills Required:</div>
                    <div className="flex flex-wrap gap-2">
                      {role.skills.map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 rounded-full border border-gray-200 text-xs text-gray-600 bg-gray-50">
                          {skill}
                        </span>
                      ))}
                      <span className="px-3 py-1 text-xs text-gray-400">+2 more</span>
                    </div>
                  </div>

                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}

// Simple Target Icon Component
function TargetIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-pink-500"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}