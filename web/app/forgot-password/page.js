"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { FaEnvelope, FaArrowLeft, FaPaperPlane, FaGraduationCap } from "react-icons/fa";
import { motion } from 'framer-motion';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const response = await fetch(`${apiUrl}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message || 'Reset link sent! Please check your email.');
            } else {
                setError(data.detail || 'Failed to process request. Please try again.');
            }
        } catch (err) {
            setError('Connection failed. Please ensure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center p-4 font-sans text-[#4A4E69]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-[#E9E1D6] p-10 flex flex-col items-center"
            >
                <div className="bg-[#FFF9C4] p-4 rounded-2xl mb-6 shadow-sm">
                    <FaGraduationCap className="text-4xl text-[#B38B00]" />
                </div>

                <h1 className="text-2xl font-black text-[#4A4E69] mb-2">Forgot Password?</h1>
                <p className="text-[#9B9B9B] text-center text-sm mb-8 leading-relaxed px-4">
                    No worries! Just enter your registered email and we'll send you a link to reset your password.
                </p>

                {message && (
                    <div className="bg-green-50 text-green-600 text-xs p-4 rounded-xl mb-6 border border-green-100 flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                            <FaPaperPlane size={12} />
                        </div>
                        {message}
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 text-red-500 text-xs p-4 rounded-xl mb-6 border border-red-100 text-center w-full">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="w-full space-y-6">
                    <div>
                        <label className="block text-[10px] font-bold text-[#4A4E69] mb-2 ml-1 uppercase tracking-widest">Email Address</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9B9B9B]">
                                <FaEnvelope size={14} />
                            </span>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full bg-[#FCFBF7] border border-[#E9E1D6] rounded-xl py-4 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#5D8AA8]/20 focus:border-[#5D8AA8] transition-all"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || message}
                        className="w-full bg-[#5D8AA8] text-white font-bold py-4 rounded-xl shadow-[0_10px_20px_rgba(93,138,168,0.2)] hover:shadow-[0_15px_30px_rgba(93,138,168,0.3)] hover:-translate-y-0.5 transition-all text-sm disabled:opacity-50 disabled:translate-y-0 disabled:bg-gray-400"
                    >
                        {loading ? "Sending link..." : "Send Reset Link"}
                    </button>
                </form>

                <Link href="/login" className="mt-8 text-[#9B9B9B] hover:text-[#4A4E69] flex items-center gap-2 text-xs font-bold transition-colors">
                    <FaArrowLeft /> Back to login
                </Link>
            </motion.div>
        </div>
    );
}
