"use client";

import React, { useState, useEffect } from 'react';
import {
    Search, MapPin, Briefcase, Star, ExternalLink,
    Linkedin, Globe, AlertCircle, Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function JobListingsPage() {
    const [filters, setFilters] = useState({
        skills: 'Python Developer',
        location: 'India',
        type: 'All Types'
    });

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);

    const locations = [
        "India", "Remote", "Bangalore", "Mumbai", "Delhi NCR",
        "Hyderabad", "Pune", "Chennai", "Kolkata", "Ahmedabad",
        "Gurugram", "Noida", "USA", "UK", "Canada"
    ];

    const jobTypes = ["All Types", "Full-time", "Part-time", "Contract", "Internship"];

    const searchJobs = async () => {
        setLoading(true);
        setError(null);
        setHasSearched(true);

        try {
            // Map frontend job type to API employment type
            const typeMap = {
                "Full-time": "FULLTIME",
                "Part-time": "PARTTIME",
                "Contract": "CONTRACTOR",
                "Internship": "INTERN"
            };

            const params = new URLSearchParams({
                query: filters.skills,
                location: filters.location,
                date_posted: 'month'
            });

            if (filters.type !== 'All Types') {
                params.append('employment_type', typeMap[filters.type]);
            }

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const response = await fetch(`${apiUrl}/jobs/search?${params}`);
            const data = await response.json();

            if (data.success) {
                setJobs(data.jobs);
                setError(data.jobs.length === 0 ? 'No jobs found. Try different search criteria.' : null);
            } else {
                setJobs(data.jobs || []);
                setError(data.message || 'Failed to fetch jobs. Please try again.');
            }
        } catch (err) {
            console.error('Job search error:', err);
            setError('Failed to connect to job service. Please check if the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    // Auto-search on mount
    useEffect(() => {
        searchJobs();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Real-Time Job Opportunities</h1>
                    <p className="text-gray-500">Find jobs from LinkedIn, Indeed, Glassdoor, and more</p>
                </div>

                {/* Filter Section */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Job Title / Keywords *</label>
                            <input
                                type="text"
                                value={filters.skills}
                                onChange={(e) => setFilters({ ...filters, skills: e.target.value })}
                                placeholder="e.g., Python Developer, Full Stack Engineer"
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

                    <button
                        onClick={searchJobs}
                        disabled={loading}
                        className="w-full mt-6 bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={20} className="animate-spin" /> Searching...
                            </>
                        ) : (
                            <>
                                <Search size={20} /> Search Jobs
                            </>
                        )}
                    </button>
                </div>

                {/* API / 403 notice – show when error mentions 403 or JSearch */}
                {error && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                        <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
                        <div className="flex-1">
                            <h3 className="font-bold text-amber-900">
                                {error.includes('403') || error.includes('JSearch') ? 'Job API not configured' : 'Notice'}
                            </h3>
                            <p className="text-sm text-amber-800 mt-1">{error}</p>
                            {(error.includes('403') || error.includes('JSearch') || error.includes('API key')) && (
                                <p className="text-xs text-amber-700 mt-2">
                                    Subscribe (free tier available) and get your key:{" "}
                                    <a href="https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch" target="_blank" rel="noopener noreferrer" className="underline font-medium">
                                        RapidAPI JSearch
                                    </a>
                                    {" "}→ then add <code className="bg-amber-100 px-1 rounded">JSEARCH_API_KEY</code> to <code className="bg-amber-100 px-1 rounded">backend/.env</code>
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Results Header */}
                {hasSearched && !loading && (
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            {jobs.length > 0 ? `Found ${jobs.length} Jobs` : 'No Jobs Found'}
                        </h2>
                        <p className="text-sm text-gray-500">
                            Searching for: <span className="text-indigo-600 font-medium">{filters.skills}</span> in <span className="text-indigo-600 font-medium">{filters.location}</span>
                        </p>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 size={48} className="animate-spin text-indigo-600 mb-4" />
                        <p className="text-gray-600 font-medium">Searching for jobs...</p>
                        <p className="text-sm text-gray-400">This may take a few seconds</p>
                    </div>
                )}

                {/* Job Cards Grid */}
                {!loading && jobs.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {jobs.map((job, index) => (
                            <motion.div
                                key={job.id || index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col hover:border-indigo-500 hover:shadow-md transition-all"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex gap-3">
                                        {job.logo ? (
                                            <img src={job.logo} alt={job.company} className="w-10 h-10 rounded-lg object-cover" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                                                <Briefcase size={20} className="text-indigo-600" />
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="font-bold text-gray-900 line-clamp-1">{job.title}</h3>
                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                <Briefcase size={12} /> {job.company}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center text-xs text-gray-500 mb-4 border-b border-gray-50 pb-3">
                                    <div className="flex items-center gap-1">
                                        {job.is_remote || job.location === "Remote" ? <Globe size={12} /> : <MapPin size={12} />}
                                        {job.location}
                                    </div>
                                    <div className="flex items-center gap-1 text-blue-600">
                                        {job.source.toLowerCase().includes('linkedin') ? <Linkedin size={12} /> : <Globe size={12} />}
                                        <span className="text-xs">{job.source}</span>
                                    </div>
                                </div>

                                <div className="mb-4 flex-grow">
                                    <p className="text-sm text-gray-600 line-clamp-3">{job.description}</p>
                                </div>

                                <div className="mt-auto">
                                    <div className="flex justify-between items-center mb-4 text-xs font-semibold">
                                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded">{job.type}</span>
                                        <span className="text-green-600">{job.salary}</span>
                                    </div>

                                    <a
                                        href={job.apply_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors"
                                    >
                                        Apply Now <ExternalLink size={14} />
                                    </a>
                                </div>

                            </motion.div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}
