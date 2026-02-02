"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  Mic, MessageSquare, Monitor, Users, Briefcase,
  Send, StopCircle, PlayCircle, Loader2, Volume2,
  Trophy, AlertCircle, ArrowRight, RefreshCw, CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InterviewPage() {
  const [gameState, setGameState] = useState('SETUP'); // SETUP, INTERVIEW, RESULTS
  const [config, setConfig] = useState({
    position: 'Software Engineer',
    mode: 'TEXT', // TEXT, VOICE
    round: 'TECHNICAL' // TECHNICAL, MANAGERIAL, HR
  });

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [results, setResults] = useState(null);

  const recognitionRef = useRef(null);
  const chatEndRef = useRef(null);

  // Mock Questions (In a real app, these could come from the backend AI)
  const questions = {
    TECHNICAL: [
      "Tell me about a technical challenge you faced and how you overcame it.",
      "Explain the difference between REST and GraphQL.",
      "How do you handle state management in large applications?",
      "Describe a time you optimized code for better performance.",
      "What is your approach to testing and code quality?"
    ],
    MANAGERIAL: [
      "Describe a time you had a conflict with a team member and how you resolved it.",
      "How do you prioritize multiple deadlines when resources are limited?",
      "Tell me about a time you showed leadership even without a formal title.",
      "How do you handle constructive criticism from a superior?",
      "Where do you see yourself in 5 years in terms of professional growth?"
    ],
    HR: [
      "Tell me about yourself and your professional background.",
      "Why do you want to work for this specific company?",
      "What are your greatest strengths and how do they apply to this role?",
      "Why are you looking for a new opportunity at this stage?",
      "What are your salary expectations and availability for this role?"
    ]
  };

  const rounds = [
    { id: 'TECHNICAL', label: 'Technical Round', icon: Monitor, questions: 5, pass: '60%', color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
    { id: 'MANAGERIAL', label: 'Managerial Round', icon: Briefcase, questions: 5, pass: '60%', color: 'bg-orange-50 border-orange-200 text-orange-700' },
    { id: 'HR', label: 'HR Round', icon: Users, questions: 5, pass: '60%', color: 'bg-green-50 border-green-200 text-green-700' }
  ];

  useEffect(() => {
    // Scroll to bottom of chat
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Initialize Speech Recognition
    if (typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            setInputText(prev => prev + event.results[i][0].transcript);
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const handleStart = () => {
    if (!config.position) return alert("Please enter a position");
    setGameState('INTERVIEW');
    setMessages([{
      sender: 'ai',
      text: `Welcome to the ${config.round} round for the ${config.position} role. Let's begin. ${questions[config.round][0]}`
    }]);
    setCurrentQuestionIndex(0);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    const newMessages = [...messages, { sender: 'user', text: userText }];
    setMessages(newMessages);
    setInputText('');

    // Stop listening if active
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    const nextIndex = currentQuestionIndex + 1;

    if (nextIndex < 5) { // Limit to 5 questions
      setTimeout(() => {
        setCurrentQuestionIndex(nextIndex);
        setMessages(prev => [...prev, { sender: 'ai', text: questions[config.round][nextIndex] }]);
      }, 1000);
    } else {
      // Completed 5 questions - Show evaluation
      setTimeout(async () => {
        setMessages(prev => [...prev, { sender: 'ai', text: "Thank you for your responses. I am now evaluating your performance..." }]);
        await handleEvaluate(newMessages);
      }, 1000);
    }
  };

  const handleEvaluate = async (transcript) => {
    setIsEvaluating(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/interview/evaluate?user_id=mock_user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: config.position,
          round: config.round,
          transcript: transcript
        })
      });

      if (!response.ok) throw new Error("Evaluation failed");

      const data = await response.json();
      setResults(data);
      setGameState('RESULTS');
    } catch (error) {
      console.error("Evaluation error:", error);
      // Fallback fallback report if AI fails
      setResults({
        score: 65,
        feedback: "Great effort! You demonstrated good knowledge, but there's room for more technical depth.",
        suggestions: ["Explain concepts with more real-world examples", "Keep your answers concise and structured"],
        detailed_analysis: "Your interview went well. You covered the basics but could improve on structuring your responses using the STAR method."
      });
      setGameState('RESULTS');
    } finally {
      setIsEvaluating(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      if (!recognitionRef.current) {
        alert("Speech recognition is not supported in this browser.");
        return;
      }
      recognitionRef.current.start();
    }
    setIsListening(!isListening);
  };

  // --- Renderers ---

  const renderSetup = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto bg-white rounded-3xl shadow-lg p-8 border border-gray-100 mt-10"
    >
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Build Your Future</h1>
        <p className="text-gray-500 text-lg">Master the art of interviews with AI-powered feedback</p>
      </div>

      <div className="space-y-8">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Target Role</label>
          <input
            value={config.position}
            onChange={(e) => setConfig({ ...config, position: e.target.value })}
            className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-indigo-500 focus:ring-0 outline-none text-gray-900 transition-all font-medium"
            placeholder="e.g., Full Stack Developer"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Interview Format</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setConfig({ ...config, mode: 'TEXT' })}
              className={`flex items-center justify-center gap-3 py-4 rounded-2xl font-bold transition-all border-2 ${config.mode === 'TEXT' ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200'}`}
            >
              <MessageSquare size={20} /> Chat Response
            </button>
            <button
              onClick={() => setConfig({ ...config, mode: 'VOICE' })}
              className={`flex items-center justify-center gap-3 py-4 rounded-2xl font-bold transition-all border-2 ${config.mode === 'VOICE' ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200'}`}
            >
              <Mic size={20} /> Voice Recording
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Select Round</label>
          {rounds.map((r) => (
            <button
              key={r.id}
              onClick={() => setConfig({ ...config, round: r.id })}
              className={`w-full flex items-center p-4 rounded-2xl border-2 transition-all text-left ${config.round === r.id ? 'border-indigo-600 bg-indigo-50/50' : 'border-gray-100 bg-white hover:border-gray-200'}`}
            >
              <div className={`p-3 rounded-xl mr-4 ${r.color.split(' ')[0]}`}>
                <r.icon className={r.color.split(' ')[2]} size={24} />
              </div>
              <div className="flex-grow">
                <div className="font-bold text-gray-900">{r.label}</div>
                <div className="text-xs text-gray-500">5 curated questions • AI Feedback included</div>
              </div>
              {config.round === r.id && <CheckCircle className="text-indigo-600" size={20} />}
            </button>
          ))}
        </div>

        <button
          onClick={handleStart}
          className="w-full py-5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
        >
          Begin Interview Journey <ArrowRight size={24} />
        </button>
      </div>
    </motion.div>
  );

  const renderInterview = () => (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto"
    >
      {/* Header Info */}
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 font-bold text-gray-700">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            {config.round === 'TECHNICAL' ? <Monitor size={20} /> : config.round === 'MANAGERIAL' ? <Briefcase size={20} /> : <Users size={20} />}
          </div>
          <div>
            <div className="text-sm font-bold uppercase tracking-wide text-gray-400">Current Round</div>
            <div className="text-gray-900 leading-tight">{rounds.find(r => r.id === config.round).label}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold uppercase tracking-wide text-gray-400">Progress</div>
          <div className="text-indigo-600 font-bold leading-tight">{currentQuestionIndex + 1} / 5 Questions</div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 min-h-[550px] flex flex-col p-6 overflow-hidden">
        <div className="flex-grow space-y-6 overflow-y-auto mb-6 custom-scrollbar pr-2 pb-4">
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] p-5 rounded-3xl text-sm leading-relaxed ${msg.sender === 'user'
                  ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-br-none shadow-md'
                  : 'bg-gray-50 text-gray-800 rounded-bl-none border border-gray-100 shadow-sm'
                  }`}>
                  {msg.sender === 'ai' && (
                    <div className="flex items-center gap-2 mb-2 text-indigo-600 font-black uppercase text-[10px] tracking-widest">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></div>
                      AI Interviewer
                    </div>
                  )}
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={chatEndRef} />
        </div>

        {/* Evaluation Loading */}
        {isEvaluating && (
          <div className="flex items-center justify-center py-4 text-indigo-600 gap-3 font-bold animate-pulse">
            <Loader2 className="animate-spin" /> Preparing your performance report...
          </div>
        )}

        {/* Input Area */}
        {!isEvaluating && currentQuestionIndex < 5 && (
          <div className="flex gap-4 items-center bg-gray-50 p-2 rounded-2xl border border-gray-100">
            {config.mode === 'VOICE' && (
              <button
                onClick={toggleListening}
                className={`flex items-center justify-center p-4 rounded-xl transition-all shadow-sm ${isListening
                  ? 'bg-red-500 text-white animate-pulse shadow-red-200'
                  : 'bg-white text-indigo-600 hover:bg-indigo-50 border border-gray-100'
                  }`}
                title={isListening ? "Stop Recording" : "Start Voice Recording"}
              >
                {isListening ? <StopCircle size={24} /> : <Mic size={24} />}
              </button>
            )}

            <div className="flex-grow relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                rows={1}
                placeholder={isListening ? "Listening to your voice..." : "Enter your response here..."}
                className="w-full px-4 py-4 pr-12 rounded-xl bg-transparent focus:ring-0 outline-none text-gray-800 resize-none font-medium"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg disabled:opacity-50 disabled:scale-95"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );

  const renderResults = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto py-8"
    >
      <div className="bg-white rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 p-12 text-center text-white relative">
          <div className="absolute top-10 left-10 opacity-20"><Trophy size={100} /></div>
          <div className="absolute bottom-10 right-10 opacity-20 rotate-12"><CheckCircle size={80} /></div>

          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 10 }}
            className="w-32 h-32 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white/30"
          >
            <div className="text-5xl font-black">{results?.score}%</div>
          </motion.div>
          <h2 className="text-4xl font-black mb-2">Round Analysis Complete</h2>
          <p className="text-white/80 font-medium">Performance report for {config.position} - {config.round}</p>
        </div>

        <div className="p-12 space-y-10">
          {/* Feedback Summary */}
          <div className="bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100 flex gap-6 items-start">
            <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-lg"><Trophy size={28} /></div>
            <div>
              <h3 className="text-xl font-black text-gray-900 mb-2">Expert Feedback</h3>
              <p className="text-gray-700 leading-relaxed text-lg italic">"{results?.feedback}"</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Key Suggestions */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                <AlertCircle className="text-orange-500" /> Improvement Areas
              </h3>
              <ul className="space-y-4">
                {results?.suggestions?.map((rec, i) => (
                  <li key={i} className="flex items-start gap-4 group">
                    <div className="mt-1 w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <span className="text-[10px] font-bold text-orange-600">{i + 1}</span>
                    </div>
                    <span className="text-gray-600 font-medium text-sm leading-relaxed">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Detailed Analysis */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                <Volume2 className="text-indigo-600" /> Deep Analysis
              </h3>
              <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line font-medium">
                {results?.detailed_analysis}
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={() => setGameState('SETUP')}
              className="flex-grow py-5 rounded-2xl bg-gray-50 text-gray-600 font-bold hover:bg-gray-100 border border-gray-200 transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw size={20} /> Attempt New Round
            </button>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="flex-grow py-5 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-xl transition-all flex items-center justify-center gap-2"
            >
              Continue to Dashboard <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <AnimatePresence mode="wait">
        {gameState === 'SETUP' && renderSetup()}
        {gameState === 'INTERVIEW' && renderInterview()}
        {gameState === 'RESULTS' && renderResults()}
      </AnimatePresence>
    </div>
  );
}