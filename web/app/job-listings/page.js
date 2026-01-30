"use client";

import React, { useState } from 'react';
import {
    Search, MapPin, Briefcase, Star, ExternalLink,
    Linkedin, Globe
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function JobListingsPage() {
    const [filters, setFilters] = useState({
        skills: 'android, api, css, data, python',
        location: 'Nationwide',
        type: 'All Types'
    });

    const locations = [
        "Nationwide", "Remote", "Bangalore", "Mumbai", "Delhi NCR",
        "Hyderabad", "Pune", "Chennai", "Kolkata", "Ahmedabad",
        "Gurugram", "Noida"
    ];

    const jobTypes = ["All Types", "Full-time", "Part-time", "Contract", "Internship"];

    // Mock Job Data
    const jobs = [
        {
            id: 1,
            title: "Python Tutor",
            company: "CodeAcademy",
            logo: "bg-blue-100",
            location: "Remote",
            type: "Part-time",
            salary: "₹600/hr",
            match: 54,
            source: "LinkedIn",
            sourceIcon: <Linkedin size={14} />,
            description: "Teach Python programming online to beginners and intermediate students.",
            tags: ["Remote", "Part-time"]
        },
        {
            id: 2,
            title: "Full Stack Engineer",
            company: "TechCorp",
            logo: "bg-green-100",
            location: "Remote",
            type: "Full-time",
            salary: "₹15-25 LPA",
            match: 40,
            source: "Naukri",
            sourceIcon: <Globe size={14} />, // Placeholder for Naukri
            description: "Build scalable web applications using modern tech stack (MERN).",
            tags: ["Remote", "Full-time"]
        },
        {
            id: 3,
            title: "Senior Backend Engineer",
            company: "CloudSystems",
            logo: "bg-purple-100",
            location: "Remote",
            type: "Full-time",
            salary: "₹20-35 LPA",
            match: 40,
            source: "LinkedIn",
            sourceIcon: <Linkedin size={14} />,
            description: "Design distributed systems and microservices for high-scale applications.",
            tags: ["Remote", "Full-time"]
        },
        {
            id: 4,
            title: "Frontend Developer",
            company: "WebInnovate",
            logo: "bg-pink-100",
            location: "Remote",
            type: "Full-time",
            salary: "₹12-20 LPA",
            match: 40,
            source: "Naukri",
            sourceIcon: <Globe size={14} />,
            description: "Create responsive user interfaces with React and Tailwind CSS.",
            tags: ["Remote", "Full-time"]
        },
        {
            id: 5,
            title: "Frontend Consultant",
            company: "Freelance Corp",
            logo: "bg-yellow-100",
            location: "Remote",
            type: "Part-time",
            salary: "₹800/hr",
            match: 40,
            source: "Naukri",
            sourceIcon: <Globe size={14} />,
            description: "Part-time frontend development consulting for startups.",
            tags: ["Remote", "Part-time"]
        },
        {
            id: 6,
            title: "Data Science Contractor",
            company: "Analytics Co",
            logo: "bg-orange-100",
            location: "Remote",
            type: "Part-time",
            salary: "₹1000/hr",
            match: 40,
            source: "Naukri",
            sourceIcon: <Globe size={14} />,
            description: "Part-time data analysis projects using Python and Pandas.",
            tags: ["Remote", "Part-time"]
        },
        {
            id: 7,
            title: "Contract Python Developer",
            company: "TempWork",
            logo: "bg-red-100",
            location: "Remote",
            type: "Contract",
            salary: "₹1000-1300/hr",
            match: 40,
            source: "LinkedIn",
            sourceIcon: <Linkedin size={14} />,
            description: "Backend development contract role for 6 months.",
            tags: ["Remote", "Contract"]
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Job Opportunities</h1>
                    <p className="text-gray-500">Find jobs matching your skills and experience from Naukri and LinkedIn</p>
                </div>

                {/* Filter Section */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Your Skills *</label>
                            <input
                                type="text"
                                value={filters.skills}
                                onChange={(e) => setFilters({ ...filters, skills: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-gray-900"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
                            <div className="relative">
                                <select
                                    value={filters.location}
                                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none bg-white text-gray-900"
                                >
                                    {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <MapPin size={16} className="text-gray-400" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Job Type</label>
                            <div className="relative">
                                <select
                                    value={filters.type}
                                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none bg-white text-gray-900"
                                >
                                    {jobTypes.map(type => <option key={type} value={type}>{type}</option>)}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <Briefcase size={16} className="text-gray-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <button className="w-full mt-6 bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                        <Search size={20} /> Search Jobs
                    </button>
                </div>

                {/* Results Header */}
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Found {jobs.length} Jobs</h2>
                    <p className="text-sm text-gray-500">Matching skills: <span className="text-indigo-600">{filters.skills}</span></p>
                </div>

                {/* Job Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map((job, index) => (
                        <motion.div
                            key={job.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col hover:border-indigo-500 hover:shadow-md transition-all"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex gap-3">
                                    <div className={`w-10 h-10 rounded-lg ${job.logo} flex items-center justify-center flex-shrink-0`}>
                                        <Briefcase size={20} className="text-gray-600 opacity-50" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{job.title}</h3>
                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                            <Briefcase size={12} /> {job.company}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 text-xs font-medium text-orange-500 bg-orange-50 px-2 py-1 rounded-md">
                                    <Star size={12} fill="currentColor" /> {job.match}%
                                </div>
                            </div>

                            <div className="flex justify-between items-center text-xs text-gray-500 mb-4 border-b border-gray-50 pb-3">
                                <div className="flex items-center gap-1">
                                    {job.location === "Remote" ? <Globe size={12} /> : <MapPin size={12} />}
                                    {job.location}
                                </div>
                                <div className="flex items-center gap-1 text-blue-600">
                                    {job.sourceIcon} {job.source}
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="text-xs font-bold text-red-500 mb-1 uppercase tracking-wider">Developing</div>
                                <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>
                            </div>

                            <div className="mt-auto">
                                <div className="flex justify-between items-center mb-4 text-xs font-semibold">
                                    <div className="flex gap-2">
                                        {job.tags.map(tag => (
                                            <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded">{tag}</span>
                                        ))}
                                    </div>
                                    <span className="text-green-600">{job.salary}</span>
                                </div>

                                <button className="w-full py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors">
                                    Apply Now <ExternalLink size={14} />
                                </button>
                            </div>

                        </motion.div>
                    ))}
                </div>

            </div>
        </div>
    );
}
