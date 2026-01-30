"use client";

import React from "react";
import {
    Target, Code, DollarSign, Users, Building2, Briefcase,
    ArrowRight
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function DomainSelectionPage() {
    const domains = [
        {
            id: "it",
            title: "Information Technology",
            description: "Software development, cybersecurity, data science, and tech innovation",
            icon: <Code className="text-blue-600" size={24} />,
            bgColor: "bg-blue-50",
            roles: ["Software Engineer", "Data Scientist", "DevOps Engineer", "Product Manager"]
        },
        {
            id: "finance",
            title: "Finance & Banking",
            description: "Financial analysis, investment banking, accounting, and fintech",
            icon: <DollarSign className="text-green-600" size={24} />,
            bgColor: "bg-green-50",
            roles: ["Financial Analyst", "Investment Banker", "Risk Manager", "Accountant"]
        },
        {
            id: "marketing",
            title: "Sales & Marketing",
            description: "Business development, digital marketing, customer relations, and growth",
            icon: <Users className="text-pink-600" size={24} />,
            bgColor: "bg-pink-50",
            roles: ["Sales Manager", "Marketing Specialist", "Business Developer", "Account Executive"]
        },
        {
            id: "public",
            title: "Government & Public Sector",
            description: "Public administration, policy making, civil services, and governance",
            icon: <Building2 className="text-purple-600" size={24} />,
            bgColor: "bg-purple-50",
            roles: ["Civil Servant", "Policy Analyst", "Public Administrator", "Government Consultant"]
        },
        {
            id: "other",
            title: "Other Industries",
            description: "Healthcare, education, manufacturing, consulting, and more",
            icon: <Briefcase className="text-yellow-600" size={24} />,
            bgColor: "bg-yellow-50",
            roles: ["Healthcare Professional", "Teacher", "Consultant", "Operations Manager"]
        }
    ];

    return (
        <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center p-3 bg-red-100 rounded-full mb-6">
                        <Target className="w-8 h-8 text-red-500" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Select Your Domain of Interest</h1>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                        Choose the industry domain that aligns with your career goals. This helps us provide more targeted job matching and skill recommendations.
                    </p>
                </div>

                {/* Domains Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {domains.map((domain, index) => (
                        <motion.div
                            key={domain.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link href={`/jobs?domain=${domain.id}`} className="block h-full">
                                <div className="group h-full bg-white rounded-2xl border-2 border-gray-100 p-6 hover:border-indigo-600 hover:shadow-lg transition-all cursor-pointer flex flex-col">

                                    {/* Icon & Title */}
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${domain.bgColor}`}>
                                            {domain.icon}
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                            {domain.title}
                                        </h3>
                                    </div>

                                    {/* Description */}
                                    <p className="text-gray-500 text-sm mb-6 flex-grow">
                                        {domain.description}
                                    </p>

                                    {/* Roles */}
                                    <div>
                                        <div className="text-xs font-semibold text-gray-900 mb-3">Popular Roles:</div>
                                        <div className="flex flex-wrap gap-2">
                                            {domain.roles.map((role, idx) => (
                                                <span key={idx} className="px-3 py-1 rounded-full border border-gray-200 text-xs font-medium text-gray-600 bg-gray-50 group-hover:bg-white transition-colors">
                                                    {role}
                                                </span>
                                            ))}
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
