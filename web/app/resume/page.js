"use client";

import React, { useState } from 'react';
import {
  FileText, Upload, Plus, ChevronRight, ChevronLeft,
  User, GraduationCap, Briefcase, Code, CheckCircle, Trash2
} from 'lucide-react';
import { FaChartBar } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function ResumePage() {
  const [flow, setFlow] = useState('SELECTION');
  const [step, setStep] = useState(1);
  const [template, setTemplate] = useState(null);

  // --- State Management ---
  const [resumeData, setResumeData] = useState({
    personal: { firstName: '', lastName: '', email: '', phone: '', summary: '' },
    education: [{ school: '', degree: '', field: '', year: '' }],
    experience: [{ company: '', role: '', start: '', end: '', description: '' }],
    projects: [{ title: '', techStack: '', description: '' }],
    skills: [''] // Array of strings for skills
  });

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setResumeData(prev => ({ ...prev, personal: { ...prev.personal, [name]: value } }));
  };

  const handleArrayChange = (section, index, field, value) => {
    setResumeData(prev => {
      const newArray = [...prev[section]];
      newArray[index] = { ...newArray[index], [field]: value };
      return { ...prev, [section]: newArray };
    });
  };

  const handleSkillChange = (index, value) => {
    setResumeData(prev => {
      const newSkills = [...prev.skills];
      newSkills[index] = value;
      return { ...prev, skills: newSkills };
    });
  };

  const addItem = (section, initialItem) => {
    setResumeData(prev => ({
      ...prev,
      [section]: [...prev[section], initialItem]
    }));
  };

  const removeItem = (section, index) => {
    setResumeData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };


  // --- Evaluation State ---
  const [evaluation, setEvaluation] = useState(null);
  const [targetRole, setTargetRole] = useState("Software Engineer");
  const [isEvaluating, setIsEvaluating] = useState(false);

  const handleEvaluate = async () => {
    if (!targetRole.trim()) {
      alert("Please enter a target job role for evaluation.");
      return;
    }
    setIsEvaluating(true);
    try {
      // Prepare payload
      const payload = {
        resume_skills: resumeData.skills.filter(s => s.trim() !== ''),
        job_description: `Target Job Role: ${targetRole}. Looking for a candidate with strong background in ${targetRole} and related technical skills.`,
        job_role: targetRole,
        personal_info: resumeData.personal
      };

      const response = await fetch(`http://127.0.0.1:8000/evaluate?user_id=mock_user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Evaluation failed");

      const data = await response.json();
      const p = data.personal_info || resumeData.personal;

      // Save to localStorage for the evaluate page to pick up
      localStorage.setItem('evaluationResults', JSON.stringify({
        score: data.match_score || data.score,
        status: (data.match_score || data.score) >= 80 ? "Excellent profile!" : ((data.match_score || data.score) >= 60 ? "Good profile" : "Needs Improvement"),
        personalInfo: {
          name: `${p.firstName || p.first_name || ''} ${p.lastName || p.last_name || ''}`.trim() || "User",
          email: p.email || "Not provided",
          phone: p.phone || "Not provided",
          location: p.location || "Not specified"
        },
        experience: {
          total: `${resumeData.experience.length} position(s)`,
          found: resumeData.skills.length > 0 ? resumeData.skills.slice(0, 5) : ["No skills detected"]
        },
        skills: data.matched_skills && data.matched_skills.length > 0 ? data.matched_skills : (resumeData.skills || []),
        strengths: data.matched_skills && data.matched_skills.length > 0 ? data.matched_skills : ["Analyzing background..."],
        recommendations: data.missing_skills && data.missing_skills.length > 0 ? data.missing_skills : ["Keep up the good work!"],
        rawResume: resumeData
      }));

      // Redirect to evaluate page
      window.location.href = '/evaluate';

    } catch (error) {
      console.error("Evaluation error:", error);
      alert("Failed to evaluate resume.");
    } finally {
      setIsEvaluating(false);
    }
  };

  // --- Template Selection UI ---
  const renderTemplateSelection = () => (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Resume Template</h2>
      <p className="text-gray-500 mb-8">Select a professional template that matches your industry and personal style. Each template is ATS-friendly and optimized for modern hiring practices.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Modern Professional */}
        <div className={`border-2 rounded-2xl p-6 bg-white shadow-md flex flex-col items-center ${template === 'modern' ? 'border-indigo-500' : 'border-gray-200'}`} onClick={() => setTemplate('modern')} style={{ cursor: 'pointer' }}>
          <div className="w-full h-40 bg-gradient-to-r from-blue-50 to-white rounded-xl mb-4 flex flex-col justify-center items-start p-4">
            <div className="font-bold text-blue-700 text-lg">John Doe</div>
            <div className="text-xs text-blue-500 mb-2">Software Engineer • (555) 123-4567</div>
            <div className="text-xs font-semibold text-gray-700">EXPERIENCE</div>
            <div className="text-xs text-gray-500">Senior Developer • Tech Corp</div>
            <div className="text-xs font-semibold text-gray-700 mt-2">SKILLS</div>
            <div className="flex gap-1 flex-wrap text-xs mt-1"><span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">React</span><span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Node.js</span><span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Python</span></div>
          </div>
          <div className="mt-2 text-base font-semibold">Modern Professional</div>
          <div className="text-xs text-gray-500 text-center mt-1">Clean, modern design with subtle colors and excellent readability</div>
          <div className="flex items-center gap-2 mt-2"><span className="text-xs bg-gray-100 px-2 py-0.5 rounded">Minimalist with accent colors</span></div>
          <div className="mt-4"><input type="radio" checked={template === 'modern'} readOnly /> <span className="text-xs ml-1">Select</span></div>
          <button className="mt-4 px-4 py-1 rounded bg-indigo-600 text-white text-xs font-semibold shadow">Preview</button>
        </div>
        {/* Classic Traditional */}
        <div className={`border-2 rounded-2xl p-6 bg-white shadow-md flex flex-col items-center ${template === 'classic' ? 'border-indigo-500' : 'border-gray-200'}`} onClick={() => setTemplate('classic')} style={{ cursor: 'pointer' }}>
          <div className="w-full h-40 bg-white border border-gray-200 rounded-xl mb-4 flex flex-col justify-center items-start p-4">
            <div className="font-bold text-black text-lg">JOHN DOE</div>
            <div className="text-xs text-black mb-2">Software Engineer • (555) 123-4567</div>
            <div className="text-xs font-bold text-black">PROFESSIONAL EXPERIENCE</div>
            <div className="text-xs text-black">Senior Developer</div>
            <div className="text-xs font-bold text-black mt-2">TECHNICAL SKILLS</div>
            <div className="flex gap-1 flex-wrap text-xs mt-1"><span className="bg-gray-200 text-black px-2 py-0.5 rounded">React</span><span className="bg-gray-200 text-black px-2 py-0.5 rounded">Node.js</span><span className="bg-gray-200 text-black px-2 py-0.5 rounded">Python</span></div>
          </div>
          <div className="mt-2 text-base font-semibold">Classic Traditional</div>
          <div className="text-xs text-gray-500 text-center mt-1">Traditional format preferred by conservative industries</div>
          <div className="flex items-center gap-2 mt-2"><span className="text-xs bg-gray-100 px-2 py-0.5 rounded">Black & white, formal layout</span></div>
          <div className="mt-4"><input type="radio" checked={template === 'classic'} readOnly /> <span className="text-xs ml-1">Select</span></div>
          <button className="mt-4 px-4 py-1 rounded bg-indigo-600 text-white text-xs font-semibold shadow">Preview</button>
        </div>
        {/* Creative Designer */}
        <div className={`border-2 rounded-2xl p-6 bg-white shadow-md flex flex-col items-center ${template === 'creative' ? 'border-indigo-500' : 'border-gray-200'}`} onClick={() => setTemplate('creative')} style={{ cursor: 'pointer' }}>
          <div className="w-full h-40 bg-gradient-to-r from-pink-100 to-white rounded-xl mb-4 flex flex-col justify-center items-start p-4">
            <div className="font-bold text-pink-700 text-lg">John Doe</div>
            <div className="text-xs text-pink-500 mb-2">Creative Software Engineer</div>
            <div className="flex gap-2 text-xs mb-1"><span className="font-bold text-pink-700">CONTACT</span> <span className="text-pink-500">EXPERIENCE</span></div>
            <div className="text-xs text-pink-500">Senior Developer • Award</div>
            <div className="text-xs font-bold text-pink-700 mt-2">SKILLS</div>
            <div className="flex gap-1 flex-wrap text-xs mt-1"><span className="bg-pink-100 text-pink-700 px-2 py-0.5 rounded">React</span><span className="bg-pink-100 text-pink-700 px-2 py-0.5 rounded">Node.js</span><span className="bg-pink-100 text-pink-700 px-2 py-0.5 rounded">Python • Design</span></div>
          </div>
          <div className="mt-2 text-base font-semibold">Creative Designer</div>
          <div className="text-xs text-gray-500 text-center mt-1">Eye-catching design for creative professionals</div>
          <div className="flex items-center gap-2 mt-2"><span className="text-xs bg-pink-100 px-2 py-0.5 rounded">Colorful with creative elements</span></div>
          <div className="mt-4"><input type="radio" checked={template === 'creative'} readOnly /> <span className="text-xs ml-1">Select</span></div>
          <button className="mt-4 px-4 py-1 rounded bg-indigo-600 text-white text-xs font-semibold shadow">Preview</button>
        </div>
      </div>
      <div className="flex justify-end mt-8">
        <button
          onClick={() => {
            setFlow('MANUAL');
            setStep(6);
          }}
          className="px-6 py-2 rounded-lg bg-purple-600 text-white font-medium shadow-lg hover:bg-purple-700 transition-all mr-4"
        >
          Check Score
        </button>

        <button
          disabled={!template}
          onClick={() => setFlow('PREVIEW')}
          className={`px-8 py-2 rounded-lg bg-indigo-600 text-white font-medium shadow-lg hover:bg-indigo-700 transition-all ${!template ? 'opacity-50 cursor-not-allowed' : ''}`}>
          Continue to Preview
        </button>
      </div>
    </div>
  );

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
    </div>
  );

  // --- File Upload ---
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = React.useRef(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert("Please upload a PDF file.");
      return;
    }

    setIsAnalyzing(true);
    const formData = new FormData();
    formData.append('file', file);
    // Add user_id if we have one, for now we might skip or use a temp one
    // const userId = "temp-user-id"; 

    try {
      const response = await fetch('http://127.0.0.1:8000/resume/parse', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to parse resume");

      const data = await response.json();
      console.log("Parsed Data:", data);

      // Update state with parsed data
      // Ensure we map the fields correctly if the LLM returns slightly different structure
      setResumeData(prev => ({
        ...prev,
        personal: {
          ...prev.personal,
          ...data.personal
        },
        education: data.education || [],
        experience: data.experience || [],
        projects: data.projects || [],
        skills: data.skills || []
      }));

      // Set target role if available or default
      if (data.personal && data.personal.summary) {
        // simple heuristic, or just leave it for user to fill
      }

      // If we are in UPLOAD flow, show success view with only Evaluate button
      if (flow === 'UPLOAD') {
        setFlow('UPLOAD_SUCCESS');
      } else {
        // Move to manual builder directly to Step 6 (Review & Generate)
        setFlow('MANUAL');
        setStep(6);
      }

    } catch (error) {
      console.error("Error parsing resume:", error);
      alert("Failed to analyze resume. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderUpload = () => (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="text-center mb-8">
        <Upload className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Upload Your Resume</h2>
        <p className="text-gray-500 mt-2">Upload your existing resume and let our AI analyze your skills, experience, and qualifications</p>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        accept=".pdf"
      />

      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center bg-white hover:border-indigo-400 transition-colors cursor-pointer"
      >
        <div className="bg-gray-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
          {isAnalyzing ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
          ) : (
            <Upload className="text-gray-400" />
          )}
        </div>
        <p className="font-semibold text-gray-700">{isAnalyzing ? "Analyzing Resume..." : "Drag & drop your resume here"}</p>
        <p className="text-sm text-gray-400 mt-1">or click to browse files</p>
        <p className="text-xs text-gray-300 mt-4 uppercase">Supported formats: PDF (Max 5MB)</p>
      </div>
      <div className="flex justify-between mt-8">
        <button onClick={() => setFlow('SELECTION')} className="px-8 py-2 rounded-lg border border-gray-200 font-medium text-gray-600 hover:bg-gray-50 transition-colors">Back</button>
        {/* We connect the button to the click as well */}
        <button onClick={() => fileInputRef.current?.click()} disabled={isAnalyzing} className="px-8 py-2 rounded-lg bg-indigo-600 text-white font-medium shadow-lg hover:bg-indigo-700 transition-all disabled:opacity-50">
          {isAnalyzing ? "Analyzing..." : "Analyze Resume"}
        </button>
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
          { id: 6, icon: FileText, label: 'Review' }
        ].map((s) => (
          <div key={s.id} className="flex flex-col items-center z-10 w-20">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${step >= s.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
              <s.icon size={18} />
            </div>
            <span className={`text-xs mt-2 font-medium text-center ${step >= s.id ? 'text-indigo-600' : 'text-gray-400'}`}>{s.label}</span>
          </div>
        ))}
        {/* Progress Line */}
        <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-100 -z-0">
          <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${((step - 1) / 5) * 100}%` }}></div>
        </div>
      </div>
      {/* Form Card */}
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-50 min-h-[500px]">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <User className="text-indigo-500" /> Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                  <input name="firstName" value={resumeData.personal.firstName} onChange={handlePersonalChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-gray-900" placeholder="John" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                  <input name="lastName" value={resumeData.personal.lastName} onChange={handlePersonalChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-gray-900" placeholder="Doe" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                  <input name="email" value={resumeData.personal.email} onChange={handlePersonalChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-gray-900" placeholder="john.doe@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Phone</label>
                  <input name="phone" value={resumeData.personal.phone} onChange={handlePersonalChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-gray-900" placeholder="+1 (555) 123-4567" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Professional Summary</label>
                  <textarea name="summary" value={resumeData.personal.summary} onChange={handlePersonalChange} rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-gray-900" placeholder="Brief description of your professional background..." />
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <GraduationCap className="text-indigo-500" /> Education
                </h2>
                <button onClick={() => addItem('education', { school: '', degree: '', field: '', year: '' })} className="flex items-center gap-1 text-sm font-bold text-indigo-600 hover:text-indigo-800">
                  <Plus size={16} /> Add More
                </button>
              </div>
              <div className="space-y-8">
                {resumeData.education.map((edu, index) => (
                  <div key={index} className="relative p-6 bg-gray-50 rounded-xl border border-gray-100">
                    {resumeData.education.length > 1 && (
                      <button onClick={() => removeItem('education', index)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500">
                        <Trash2 size={18} />
                      </button>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">School / University</label>
                        <input value={edu.school} onChange={(e) => handleArrayChange('education', index, 'school', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-gray-900" placeholder="e.g. MIT" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Degree</label>
                        <input value={edu.degree} onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-gray-900" placeholder="e.g. B.Tech" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Field of Study</label>
                        <input value={edu.field} onChange={(e) => handleArrayChange('education', index, 'field', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-gray-900" placeholder="e.g. Computer Science" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Year of Graduation</label>
                        <input value={edu.year} onChange={(e) => handleArrayChange('education', index, 'year', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-gray-900" placeholder="e.g. 2025" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Briefcase className="text-indigo-500" /> Experience
                </h2>
                <button onClick={() => addItem('experience', { company: '', role: '', start: '', end: '', description: '' })} className="flex items-center gap-1 text-sm font-bold text-indigo-600 hover:text-indigo-800">
                  <Plus size={16} /> Add More
                </button>
              </div>
              <div className="space-y-8">
                {resumeData.experience.map((exp, index) => (
                  <div key={index} className="relative p-6 bg-gray-50 rounded-xl border border-gray-100">
                    {resumeData.experience.length > 1 && (
                      <button onClick={() => removeItem('experience', index)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500">
                        <Trash2 size={18} />
                      </button>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Company</label>
                        <input value={exp.company} onChange={(e) => handleArrayChange('experience', index, 'company', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-gray-900" placeholder="e.g. Google" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Role / Position</label>
                        <input value={exp.role} onChange={(e) => handleArrayChange('experience', index, 'role', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-gray-900" placeholder="e.g. Software Engineer" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Start Year</label>
                        <input value={exp.start} onChange={(e) => handleArrayChange('experience', index, 'start', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-gray-900" placeholder="e.g. 2022" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">End Year</label>
                        <input value={exp.end} onChange={(e) => handleArrayChange('experience', index, 'end', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-gray-900" placeholder="e.g. Present" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                        <textarea value={exp.description} onChange={(e) => handleArrayChange('experience', index, 'description', e.target.value)} rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-gray-900" placeholder="Describe your responsibilities..." />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Code className="text-indigo-500" /> Projects
                </h2>
                <button onClick={() => addItem('projects', { title: '', techStack: '', description: '' })} className="flex items-center gap-1 text-sm font-bold text-indigo-600 hover:text-indigo-800">
                  <Plus size={16} /> Add More
                </button>
              </div>
              <div className="space-y-8">
                {resumeData.projects.map((proj, index) => (
                  <div key={index} className="relative p-6 bg-gray-50 rounded-xl border border-gray-100">
                    {resumeData.projects.length > 1 && (
                      <button onClick={() => removeItem('projects', index)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500">
                        <Trash2 size={18} />
                      </button>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Project Title</label>
                        <input value={proj.title} onChange={(e) => handleArrayChange('projects', index, 'title', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-gray-900" placeholder="e.g. Portfolio" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Tech Stack</label>
                        <input value={proj.techStack} onChange={(e) => handleArrayChange('projects', index, 'techStack', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-gray-900" placeholder="e.g. React, Node.js" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                        <textarea value={proj.description} onChange={(e) => handleArrayChange('projects', index, 'description', e.target.value)} rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-gray-900" placeholder="Describe the project..." />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <CheckCircle className="text-indigo-500" /> Skills
                </h2>
                <button onClick={() => addItem('skills', '')} className="flex items-center gap-1 text-sm font-bold text-indigo-600 hover:text-indigo-800">
                  <Plus size={16} /> Add More
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resumeData.skills.map((skill, index) => (
                  <div key={index} className="flex gap-2">
                    <input value={skill} onChange={(e) => handleSkillChange(index, e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-gray-900" placeholder="e.g. JavaScript" />
                    {resumeData.skills.length > 1 && (
                      <button onClick={() => removeItem('skills', index)} className="text-gray-400 hover:text-red-500 px-2">
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 6 && (
            <motion.div key="step6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <FaChartBar className="text-indigo-500" /> Review & Evaluate
                </h2>
                <div className="flex gap-4">
                  <button
                    onClick={async () => {
                      try {
                        const response = await fetch('http://127.0.0.1:8000/resume/generate', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(resumeData)
                        });
                        if (!response.ok) throw new Error("Failed to generate PDF");
                        const blob = await response.blob();
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'resume.pdf';
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                      } catch (error) {
                        console.error("Download error:", error);
                        alert("Failed to download resume.");
                      }
                    }}
                    className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <FileText size={16} /> Download Resume
                  </button>
                </div>
              </div>

              <div className="bg-indigo-50 rounded-2xl p-6 mb-8 border border-indigo-100">
                <h3 className="font-bold text-indigo-900 mb-2">Almost Done!</h3>
                <p className="text-sm text-indigo-700">You've filled in all your details. Now you can evaluate your resume against a job role or proceed to generate the final file.</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">Target Job Role (for Evaluation)</label>
                <input
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-gray-900"
                  placeholder="e.g. Full Stack Developer"
                />
              </div>

              <div className="flex justify-center mb-8">
                <button
                  onClick={handleEvaluate}
                  disabled={isEvaluating}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 disabled:opacity-50"
                >
                  {isEvaluating ? "Analyzing..." : "Evaluate Resume"}
                </button>
              </div>

              {evaluation && (
                <div className="bg-white rounded-2xl border border-indigo-100 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">Match Score</h3>
                      <p className="text-sm text-gray-500">Based on skills analysis</p>
                    </div>
                    <div className="text-4xl font-bold text-indigo-600">{evaluation.score}%</div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold text-green-600 mb-2 flex items-center gap-2"><CheckCircle size={16} /> Strengths</h4>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        {evaluation.matched_skills.map((s, i) => <li key={i}>{s}</li>)}
                        {evaluation.matched_skills.length === 0 && <li>No specific matches found</li>}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-red-500 mb-2 flex items-center gap-2"><Trash2 size={16} /> Gaps / Missing</h4>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        {evaluation.missing_skills.map((s, i) => <li key={i}>{s}</li>)}
                        {evaluation.missing_skills.length === 0 && <li>All skills matched!</li>}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
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
            onClick={() => {
              if (step < 6) setStep(step + 1);
              else if (step === 6) setFlow('TEMPLATE_SELECT');
            }}
            className="flex items-center gap-2 px-10 py-3 rounded-xl bg-indigo-600 text-white font-bold shadow-lg hover:bg-indigo-700 transition-all"
          >
            {step === 6 ? 'Generate Resume' : 'Next'} <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderPreview = () => (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your Resume is Ready!</h2>
          <p className="text-gray-500">Preview your {template} style resume below.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setFlow('TEMPLATE_SELECT')} className="px-6 py-2 rounded-lg border border-gray-200 font-medium text-gray-600 hover:bg-gray-50 transition-colors">Change Template</button>
          <button
            onClick={async () => {
              try {
                const response = await fetch('http://127.0.0.1:8000/resume/generate', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(resumeData)
                });
                if (!response.ok) throw new Error("Failed to generate PDF");
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'resume.pdf';
                document.body.appendChild(a);
                a.click();
                a.remove();
              } catch (error) {
                console.error("Download error:", error);
                alert("Failed to download PDF.");
              }
            }}
            className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-medium shadow-lg hover:bg-indigo-700 transition-all flex items-center gap-2"
          >
            Download PDF
          </button>
        </div>
      </div>

      <div className={`bg-white shadow-2xl rounded-sm p-12 min-h-[1056px] border border-gray-100 ${template === 'modern' ? 'border-t-8 border-t-indigo-600' : (template === 'creative' ? 'border-l-8 border-l-pink-500' : '')}`}>
        <div className={`mb-8 ${template === 'modern' ? 'text-center' : ''}`}>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight uppercase">
            {resumeData.personal.firstName} {resumeData.personal.lastName}
          </h1>
          <div className={`flex flex-wrap gap-4 mt-2 text-gray-600 font-medium ${template === 'modern' ? 'justify-center' : ''}`}>
            <span>{resumeData.personal.email}</span>
            <span>•</span>
            <span>{resumeData.personal.phone}</span>
          </div>
        </div>

        <div className="mb-8">
          <h3 className={`text-lg font-bold mb-2 border-b-2 pb-1 ${template === 'modern' ? 'border-indigo-100 text-indigo-700' : 'border-gray-200 text-gray-800'}`}>PROFESSIONAL SUMMARY</h3>
          <p className="text-gray-700 leading-relaxed italic">{resumeData.personal.summary}</p>
        </div>

        <div className="mb-8">
          <h3 className={`text-lg font-bold mb-4 border-b-2 pb-1 ${template === 'modern' ? 'border-indigo-100 text-indigo-700' : 'border-gray-200 text-gray-800'}`}>EXPERIENCE</h3>
          <div className="space-y-6">
            {resumeData.experience.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-gray-900">{exp.role}</h4>
                  <span className="text-gray-500 text-sm font-medium">{exp.start} — {exp.end}</span>
                </div>
                <div className="text-indigo-600 font-semibold text-sm mb-2">{exp.company}</div>
                <p className="text-gray-600 text-sm leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className={`text-lg font-bold mb-4 border-b-2 pb-1 ${template === 'modern' ? 'border-indigo-100 text-indigo-700' : 'border-gray-200 text-gray-800'}`}>EDUCATION</h3>
            <div className="space-y-4">
              {resumeData.education.map((edu, i) => (
                <div key={i}>
                  <h4 className="font-bold text-gray-900 text-sm">{edu.degree} in {edu.field}</h4>
                  <div className="text-gray-600 text-xs">{edu.school}</div>
                  <div className="text-gray-400 text-xs">{edu.year}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className={`text-lg font-bold mb-4 border-b-2 pb-1 ${template === 'modern' ? 'border-indigo-100 text-indigo-700' : 'border-gray-200 text-gray-800'}`}>SKILLS</h3>
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.map((skill, i) => (
                <span key={i} className={`px-3 py-1 rounded-full text-xs font-bold ${template === 'modern' ? 'bg-indigo-50 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
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
          {flow === 'UPLOAD_SUCCESS' && (
            <div className="max-w-2xl mx-auto py-24 px-4 text-center">
              <div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle className="text-green-500 w-10 h-10" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Resume Analyzed!</h2>
              <p className="text-gray-500 mb-8">We've extracted your profile data. Enter your target role below to see your match score.</p>

              <div className="max-w-md mx-auto mb-8 text-left">
                <label className="block text-sm font-bold text-gray-700 mb-2">Target Job Role</label>
                <input
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-gray-900"
                  placeholder="e.g. Software Engineer"
                />
              </div>

              <div className="flex flex-col gap-4 max-w-sm mx-auto">
                <button
                  onClick={handleEvaluate}
                  disabled={isEvaluating}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 text-lg flex items-center justify-center gap-2"
                >
                  {isEvaluating ? (
                    <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> Evaluating...</>
                  ) : "Evaluate Resume"}
                </button>
                <button
                  onClick={() => setFlow('SELECTION')}
                  className="text-gray-400 hover:text-gray-600 font-medium"
                >
                  Back to Selection
                </button>
              </div>
            </div>
          )}
          {flow === 'SELECTION' && renderSelection()}
          {flow === 'UPLOAD' && renderUpload()}
          {flow === 'MANUAL' && renderManualBuilder()}
          {flow === 'TEMPLATE_SELECT' && renderTemplateSelection()}
          {flow === 'PREVIEW' && renderPreview()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}