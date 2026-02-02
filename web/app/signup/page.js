"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaUser, FaLock, FaEnvelope, FaIdCard, FaRocket, FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from 'framer-motion';

export default function SignupPage() {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        password: '',
        confirm_password: ''
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
        if (formData.password !== formData.confirm_password) {
            setError("Passwords do not match!");
            return;
        }

        setLoading(true);
        setError('');

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const { confirm_password, ...payload } = formData;
            const response = await fetch(`${apiUrl}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('user_name', data.user_name || formData.first_name);
                router.push('/dashboard');
            } else {
                const detail = data.detail;
                const message = Array.isArray(detail)
                    ? detail.map((d) => (d.msg && d.loc ? `${d.loc.join('.')}: ${d.msg}` : d.msg || JSON.stringify(d))).join('; ')
                    : typeof detail === 'string'
                        ? detail
                        : 'Registration failed. Please try again.';
                setError(message);
            }
        } catch (err) {
            setError(err.message || 'Connection failed. Please ensure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center p-4 py-12 font-sans text-[#4A4E69]">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-xl bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-[#E9E1D6] p-8 md:p-12 relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-[#D7E9E9] to-[#F2DFCE]"></div>

                <div className="flex flex-col items-center mb-8 text-center">
                    <div className="bg-[#E3F2FD] p-4 rounded-full mb-4 shadow-sm relative">
                        <FaRocket className="text-3xl text-[#5D8AA8]" />
                        <div className="absolute -top-1 -right-1 bg-[#F2DFCE] w-4 h-4 rounded-full border-2 border-white"></div>
                    </div>
                    <h1 className="text-3xl font-black text-[#4A4E69]">Join VidyāMitra</h1>
                    <p className="text-[#5D8AA8] font-bold text-[10px] tracking-widest uppercase mt-1">Start Your Career Journey</p>
                    <p className="text-[#9B9B9B] text-sm mt-4 flex items-center gap-2">
                        <span>🚀</span> Create your account to unlock your potential <span>💡</span>
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-500 text-xs p-3 rounded-xl mb-6 border border-red-100 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-[10px] font-bold text-[#4A4E69] mb-2 ml-1 uppercase tracking-widest">First Name</label>
                            <input
                                type="text"
                                name="first_name"
                                required
                                value={formData.first_name}
                                onChange={handleChange}
                                placeholder="John"
                                className="w-full bg-[#FCFBF7] border border-[#E9E1D6] rounded-xl py-3.5 px-4 text-sm outline-none focus:ring-2 focus:ring-[#5D8AA8]/20 focus:border-[#5D8AA8] transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-[#4A4E69] mb-2 ml-1 uppercase tracking-widest">Last Name</label>
                            <input
                                type="text"
                                name="last_name"
                                required
                                value={formData.last_name}
                                onChange={handleChange}
                                placeholder="Doe"
                                className="w-full bg-[#FCFBF7] border border-[#E9E1D6] rounded-xl py-3.5 px-4 text-sm outline-none focus:ring-2 focus:ring-[#5D8AA8]/20 focus:border-[#5D8AA8] transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold text-[#4A4E69] mb-2 ml-1 uppercase tracking-widest">Username</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9B9B9B]">
                                <FaUser size={14} />
                            </span>
                            <input
                                type="text"
                                name="username"
                                required
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="johndoe"
                                className="w-full bg-[#FCFBF7] border border-[#E9E1D6] rounded-xl py-3.5 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#5D8AA8]/20 focus:border-[#5D8AA8] transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold text-[#4A4E69] mb-2 ml-1 uppercase tracking-widest">Email Address</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9B9B9B]">
                                <FaEnvelope size={14} />
                            </span>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="john@example.com"
                                className="w-full bg-[#FCFBF7] border border-[#E9E1D6] rounded-xl py-3.5 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#5D8AA8]/20 focus:border-[#5D8AA8] transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold text-[#4A4E69] mb-2 ml-1 uppercase tracking-widest">Password</label>
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
                                placeholder="At least 8 characters"
                                className="w-full bg-[#FCFBF7] border border-[#E9E1D6] rounded-xl py-3.5 pl-12 pr-12 text-sm outline-none focus:ring-2 focus:ring-[#5D8AA8]/20 focus:border-[#5D8AA8] transition-all"
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

                    <div>
                        <label className="block text-[10px] font-bold text-[#4A4E69] mb-2 ml-1 uppercase tracking-widest">Confirm Password</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9B9B9B]">
                                <FaLock size={14} />
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="confirm_password"
                                required
                                value={formData.confirm_password}
                                onChange={handleChange}
                                placeholder="Confirm your password"
                                className="w-full bg-[#FCFBF7] border border-[#E9E1D6] rounded-xl py-3.5 pl-12 pr-12 text-sm outline-none focus:ring-2 focus:ring-[#5D8AA8]/20 focus:border-[#5D8AA8] transition-all"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-linear-to-r from-[#5D8AA8] to-[#4A4E69] text-white font-black py-4 rounded-2xl shadow-[0_10px_25px_rgba(93,138,168,0.2)] hover:shadow-[0_15px_35px_rgba(93,138,168,0.3)] hover:-translate-y-1 transition-all text-sm mt-4 flex items-center justify-center gap-2"
                    >
                        <span>🚀</span> {loading ? "Creating Account..." : "Create Account"}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-[#9B9B9B]">
                    Already have an account?{" "}
                    <Link href="/login" className="text-[#5D8AA8] font-bold hover:underline flex items-center justify-center gap-2">
                        <span>🔐</span> Sign in here
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
