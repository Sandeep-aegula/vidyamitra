"use client";

import React, { useState, useEffect } from 'react';
import {
  Mic, MessageSquare, Monitor, Users, Briefcase,
  Send, StopCircle, PlayCircle, Loader2, Volume2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InterviewPage() {
  const [gameState, setGameState] = useState('SETUP'); // SETUP, INTERVIEW
  const [config, setConfig] = useState({
    position: '',
    mode: 'TEXT', // TEXT, VOICE
    round: 'TECHNICAL' // TECHNICAL, MANAGERIAL, HR
  });

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Mock Questions
  const questions = {
    TECHNICAL: [
      "Tell me about a technical challenge you faced and how you overcame it.",
      "Explain the difference between REST and GraphQL.",
      "How do you handle state management in large applications?",
      "Describe a time you optimized code for better performance.",
      "What is your approach to testing and code quality?"
    ],
    MANAGERIAL: [
      "Describe a time you had a conflict with a team member.",
      "How do you prioritize multiple deadlines?",
      "Tell me about a time you showed leadership.",
      "How do you handle constructive criticism?",
      "Where do you see yourself in 5 years?"
    ],
    HR: [
      "Tell me about yourself.",
      "Why do you want to work for this company?",
      "What are your greatest strengths and weaknesses?",
      "Why are you leaving your current role?",
      "Do you have any questions for us?"
    ]
  };

  const rounds = [
    { id: 'TECHNICAL', label: 'Technical Round', icon: Monitor, questions: 5, pass: '60%', color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
    { id: 'MANAGERIAL', label: 'Managerial Round', icon: Briefcase, questions: 4, pass: '60%', color: 'bg-orange-50 border-orange-200 text-orange-700' },
    { id: 'HR', label: 'HR Round', icon: Users, questions: 4, pass: '60%', color: 'bg-green-50 border-green-200 text-green-700' }
  ];

  const handleStart = () => {
    if (!config.position) return alert("Please enter a position");
    setGameState('INTERVIEW');
    setMessages([{
      sender: 'ai',
      text: questions[config.round][0]
    }]);
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    // Add user message
    const newMessages = [...messages, { sender: 'user', text: inputText }];
    setMessages(newMessages);
    setInputText('');

    // Simulate AI thinking and responding
    setTimeout(() => {
      const nextIndex = currentQuestionIndex + 1;
      if (nextIndex < questions[config.round].length) {
        setCurrentQuestionIndex(nextIndex);
        setMessages(prev => [...prev, { sender: 'ai', text: questions[config.round][nextIndex] }]);
      } else {
        setMessages(prev => [...prev, { sender: 'ai', text: "Thank you! We have completed this round." }]);
      }
    }, 1000);
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // Simulation: if stopping listening, fill input with dummy text
    if (isListening) {
      setInputText("I have experience with scalable system design utilizing microservices architecture...");
    }
  };

  // --- Renderers ---

  const renderSetup = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto bg-white rounded-3xl shadow-lg p-8 border border-gray-100 mt-10"
    >
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mock Interview</h1>
        <p className="text-gray-500">Practice interviews across 3 rounds</p>
      </div>

      <div className="space-y-8">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">What position are you interviewing for?</label>
          <input
            value={config.position}
            onChange={(e) => setConfig({ ...config, position: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900"
            placeholder="e.g., Software Engineer, Product Manager"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Interview Mode</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setConfig({ ...config, mode: 'TEXT' })}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${config.mode === 'TEXT' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-50 text-gray-600 border border-gray-200'}`}
            >
              <MessageSquare size={18} /> Text Mode
            </button>
            <button
              onClick={() => setConfig({ ...config, mode: 'VOICE' })}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${config.mode === 'VOICE' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-50 text-gray-600 border border-gray-200'}`}
            >
              <Mic size={18} /> Voice Mode
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {rounds.map((r) => (
            <button
              key={r.id}
              onClick={() => setConfig({ ...config, round: r.id })}
              className={`w-full flex items-center p-4 rounded-xl border-2 transition-all text-left ${config.round === r.id ? r.color.replace('bg-', 'bg-opacity-20 ') + ' border-current' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
            >
              <div className={`p-3 rounded-lg mr-4 ${r.color.split(' ')[0]}`}>
                <r.icon className={r.color.split(' ')[2]} size={24} />
              </div>
              <div>
                <div className="font-bold text-gray-900">{r.label}</div>
                <div className="text-xs text-gray-500">{r.questions} questions • {r.pass} to pass</div>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={handleStart}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
        >
          Start {config.mode === 'TEXT' ? 'Text' : 'Voice'} Interview →
        </button>
      </div>
    </motion.div>
  );

  const renderInterview = () => (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto mt-6"
    >
      {/* Top Status Bar */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {rounds.map((r) => (
          <div key={r.id} className={`p-4 rounded-xl border text-center ${config.round === r.id ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-gray-100 opacity-50'}`}>
            <r.icon className={`mx-auto mb-2 ${config.round === r.id ? 'text-indigo-600' : 'text-gray-400'}`} />
            <div className="text-sm font-bold text-gray-900">{r.label}</div>
            {config.round === r.id && <div className="text-xs text-white bg-indigo-600 rounded-full px-2 py-0.5 inline-block mt-1">IN PROGRESS</div>}
          </div>
        ))}
      </div>

      {/* Header Info */}
      <div className="flex justify-between items-center mb-4 px-2">
        <div className="flex items-center gap-2 font-bold text-gray-700">
          {config.round === 'TECHNICAL' ? <Monitor /> : config.round === 'MANAGERIAL' ? <Briefcase /> : <Users />}
          {rounds.find(r => r.id === config.round).label}
          <span className="text-gray-400 text-sm font-normal">({config.mode === 'TEXT' ? 'Text Mode' : 'Voice Mode'})</span>
        </div>
        <div className="text-sm text-indigo-600 font-bold">Question {currentQuestionIndex} of {questions[config.round].length}</div>
      </div>

      {/* Chat Area */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 min-h-[500px] flex flex-col p-6">
        <div className="flex-grow space-y-6 overflow-y-auto mb-6 custom-scrollbar pr-2">
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] p-4 rounded-2xl ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                {msg.sender === 'ai' && <div className="text-xs font-bold mb-1 text-gray-500">Interviewer:</div>}
                {msg.text}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Input Area */}
        <div className="flex gap-4 items-center">
          {config.mode === 'VOICE' && (
            <button
              onClick={toggleListening}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${isListening ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}
            >
              {isListening ? <><StopCircle size={20} /> Stop Listening</> : <><Mic size={20} /> Start Speaking</>}
            </button>
          )}

          <div className="flex-grow relative">
            <input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={isListening ? "Listening..." : "Type your response..."}
              disabled={isListening && config.mode === 'VOICE'}
              className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-800"
            />
          </div>

          <button
            onClick={handleSendMessage}
            className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-lg"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <AnimatePresence mode="wait">
        {gameState === 'SETUP' ? renderSetup() : renderInterview()}
      </AnimatePresence>
    </div>
  );
}