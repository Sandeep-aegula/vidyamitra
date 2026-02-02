"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaUser, FaLock, FaGraduationCap, FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from 'framer-motion';

export default function LoginPage() {
    const [formData, setFormData] = useState({
        username_or_email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const response = await fetch(`${apiUrl}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('user_name', data.user_name || 'User');
                router.push('/dashboard');
            } else {
                setError(data.detail || 'Login failed. Please check your credentials.');
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
                className="w-full max-w-md bg-white rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-[#E9E1D6] p-10 relative overflow-hidden"
            >
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-[#F2DFCE] to-[#D7E9E9]"></div>

                <div className="flex flex-col items-center mb-8">
                    <div className="bg-[#F2DFCE] p-4 rounded-2xl mb-4 shadow-sm">
                        <FaGraduationCap className="text-4xl text-[#E67E22]" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tight text-[#4A4E69]">VidyāMitra</h1>
                    <p className="text-[#5D8AA8] font-bold text-xs tracking-widest uppercase mt-1">Intelligent Career Agent</p>
                    <div className="mt-6 text-center">
                        <h2 className="text-xl font-bold">Welcome back! 👋</h2>
                        <p className="text-[#9B9B9B] text-sm mt-1">Ready to advance your career?</p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-500 text-xs p-3 rounded-xl mb-6 border border-red-100 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-[#4A4E69] mb-2 ml-1 uppercase tracking-wider">Username or Email</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9B9B9B]">
                                <FaUser size={14} />
                            </span>
                            <input
                                type="text"
                                name="username_or_email"
                                required
                                value={formData.username_or_email}
                                onChange={handleChange}
                                placeholder="Enter your username or email"
                                className="w-full bg-[#FCFBF7] border border-[#E9E1D6] rounded-xl py-4 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#5D8AA8]/20 focus:border-[#5D8AA8] transition-all placeholder:text-[#9B9B9B]/50"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2 ml-1">
                            <label className="text-xs font-bold text-[#4A4E69] uppercase tracking-wider">Password</label>
                            <Link href="/forgot-password" size="xs" className="text-[#5D8AA8] text-[10px] font-bold hover:underline">
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9B9B9B]">
                                <FaLock size={14} />
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                className="w-full bg-[#FCFBF7] border border-[#E9E1D6] rounded-xl py-4 pl-12 pr-12 text-sm outline-none focus:ring-2 focus:ring-[#5D8AA8]/20 focus:border-[#5D8AA8] transition-all placeholder:text-[#9B9B9B]/50"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9B9B9B] hover:text-[#4A4E69]"
                            >
                                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-linear-to-r from-[#5D8AA8] to-[#4A4E69] text-white font-bold py-4 rounded-xl shadow-[0_10px_20px_rgba(93,138,168,0.2)] hover:shadow-[0_15px_30px_rgba(93,138,168,0.3)] hover:-translate-y-0.5 transition-all text-sm disabled:opacity-50 disabled:translate-y-0"
                    >
                        {loading ? "Signing In..." : "Sign In"}
                    </button>
                </form>



                <p className="mt-10 text-center text-sm text-[#9B9B9B]">
                    Don't have an account?{" "}
                    <Link href="/signup" className="text-[#5D8AA8] font-bold hover:underline">
                        Sign up here
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
