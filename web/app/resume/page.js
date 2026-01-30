"use client";

import React, { useState } from 'react';
import { 
  FileText, Upload, Plus, ChevronRight, ChevronLeft, 
  User, GraduationCap, Briefcase, Code, CheckCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';



export default function ResumePage() {
  const [flow, setFlow] = useState('SELECTION');
  const [step, setStep] = useState(1);

  // --- Renderers ---

  const renderSelection = () => (
    <div className="max-w-4xl mx-auto text-center py-12">
      <div className="bg-indigo-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <FileText className="text-indigo-600 w-8 h-8" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Let's Start Your Career Journey!</h1>
      <p className="text-gray-500 mb-12">To provide you with the best career guidance, we need to understand your current profile.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
        <button 
          onClick={() => setFlow('UPLOAD')}
          className="bg-white p-8 rounded-2xl border-2 border-transparent hover:border-indigo-500 shadow-sm transition-all group"
        >
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <CheckCircle className="text-green-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Yes, I have one</h3>
          <p className="text-sm text-gray-500 mt-2">Upload your existing resume for analysis</p>
        </button>
        <button 
          onClick={() => { setFlow('MANUAL'); setStep(1); }}
          className="bg-white p-8 rounded-2xl border-2 border-transparent hover:border-indigo-500 shadow-sm transition-all group"
        >
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <Plus className="text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">No, I need help</h3>
          <p className="text-sm text-gray-500 mt-2">Let our AI help you build a professional resume</p>
        </button>
      </div>
      <div className="mt-10">
        <div className="bg-gray-50 rounded-xl py-3 px-6 inline-flex items-center gap-2 mx-auto text-gray-600 text-sm">
          <span className="text-yellow-500">⚡</span> What happens next?
        </div>
        <div className="text-xs text-gray-400 mt-2">Choose an option above to see what happens next in your career journey.</div>
      </div>
    </div>
  );

  const renderUpload = () => (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="text-center mb-8">
        <Upload className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Upload Your Resume</h2>
        <p className="text-gray-500 mt-2">Upload your existing resume and let our AI analyze your skills, experience, and qualifications</p>
      </div>
      <div className="border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center bg-white hover:border-indigo-400 transition-colors cursor-pointer">
        <div className="bg-gray-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
          <Upload className="text-gray-400" />
        </div>
        <p className="font-semibold text-gray-700">Drag & drop your resume here</p>
        <p className="text-sm text-gray-400 mt-1">or click to browse files</p>
        <p className="text-xs text-gray-300 mt-4 uppercase">Supported formats: PDF, DOC, DOCX (Max 5MB)</p>
      </div>
      <div className="flex justify-between mt-8">
        <button onClick={() => setFlow('SELECTION')} className="px-8 py-2 rounded-lg border border-gray-200 font-medium text-gray-600 hover:bg-gray-50 transition-colors">Back</button>
        <button className="px-8 py-2 rounded-lg bg-indigo-600 text-white font-medium shadow-lg hover:bg-indigo-700 transition-all">Analyze Resume</button>
      </div>
      <div className="mt-8 bg-yellow-50 border border-yellow-100 rounded-xl p-4 flex items-center gap-3 text-sm text-gray-700">
        <span className="text-yellow-500">🔒</span>
        <div>
          <span className="font-semibold">Your Privacy Matters</span><br />
          Your resume is processed securely and used only for analysis. We extract skills, experience, and qualifications to provide personalized career guidance. Your data is never shared with third parties.
        </div>
      </div>
    </div>
  );

  const renderManualBuilder = () => (
    <div className="max-w-5xl mx-auto py-12 px-4">
      {/* Stepper Header */}
      <div className="flex justify-between items-center mb-12 relative">
        {[
          { id: 1, icon: User, label: 'Personal Info' },
          { id: 2, icon: GraduationCap, label: 'Education' },
          { id: 3, icon: Briefcase, label: 'Experience' },
          { id: 4, icon: Code, label: 'Projects' },
          { id: 5, icon: CheckCircle, label: 'Skills' },
          { id: 6, icon: FileText, label: 'Generate' }
        ].map((s) => (
          <div key={s.id} className="flex flex-col items-center z-10">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${step >= s.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
              <s.icon size={18} />
            </div>
            <span className={`text-xs mt-2 font-medium ${step >= s.id ? 'text-indigo-600' : 'text-gray-400'}`}>{s.label}</span>
          </div>
        ))}
        {/* Progress Line */}
        <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-100 -z-0">
          <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${((step - 1) / 5) * 100}%` }}></div>
        </div>
      </div>
      {/* Form Card */}
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-50">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <User className="text-indigo-500" /> Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" placeholder="John" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" placeholder="Doe" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                  <input type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" placeholder="john.doe@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Phone</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" placeholder="+1 (555) 123-4567" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Professional Summary</label>
                  <textarea rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" placeholder="Brief description of your professional background..." />
                </div>
              </div>
            </motion.div>
          )}
          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <GraduationCap className="text-indigo-500" /> Education
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">School / University</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" placeholder="e.g. MIT" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Degree</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" placeholder="e.g. B.Tech, M.Sc" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Field of Study</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" placeholder="e.g. Computer Science" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Year of Graduation</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" placeholder="e.g. 2025" />
                </div>
              </div>
            </motion.div>
          )}
          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Briefcase className="text-indigo-500" /> Experience
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Company</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" placeholder="e.g. Google" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Role / Position</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" placeholder="e.g. Software Engineer" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Start Year</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" placeholder="e.g. 2022" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">End Year</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" placeholder="e.g. 2024 or Present" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                  <textarea rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" placeholder="Describe your responsibilities and achievements..." />
                </div>
              </div>
            </motion.div>
          )}
          {step === 4 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Code className="text-indigo-500" /> Projects
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Project Title</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" placeholder="e.g. Portfolio Website" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Tech Stack</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" placeholder="e.g. React, Node.js" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                  <textarea rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" placeholder="Describe your project, your role, and outcomes..." />
                </div>
              </div>
            </motion.div>
          )}
          {step === 5 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <CheckCircle className="text-indigo-500" /> Skills
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">List Your Skills</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" placeholder="e.g. JavaScript, Python, Communication..." />
                  <div className="text-xs text-gray-400 mt-2">Separate skills with commas</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex justify-between mt-12 pt-8 border-t border-gray-100">
          <button 
            onClick={() => step === 1 ? setFlow('SELECTION') : setStep(step - 1)}
            className="flex items-center gap-2 px-8 py-3 rounded-xl border border-gray-200 font-bold text-gray-500 hover:bg-gray-50 transition-all"
          >
            <ChevronLeft size={18} /> Previous
          </button>
          <button 
            onClick={() => step < 6 ? setStep(step + 1) : null}
            className="flex items-center gap-2 px-10 py-3 rounded-xl bg-indigo-600 text-white font-bold shadow-lg hover:bg-indigo-700 transition-all"
          >
            {step === 6 ? 'Generate Resume' : 'Next'} <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <AnimatePresence mode="wait">
        <motion.div 
          key={flow}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {flow === 'SELECTION' && renderSelection()}
          {flow === 'UPLOAD' && renderUpload()}
          {flow === 'MANUAL' && renderManualBuilder()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}