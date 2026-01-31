"use client";

import React, { useState } from 'react';
import {
  BookOpen, Zap, HelpCircle, CheckCircle, XCircle,
  ChevronLeft, ChevronRight, RotateCcw, Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuizPage() {
  const [gameState, setGameState] = useState('SETUP'); // SETUP, PLAYING, RESULTS
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userId] = useState("550e8400-e29b-41d4-a716-446655440000"); // Mock valid UUID
  const [config, setConfig] = useState({ topic: '', difficulty: 'Medium', count: 5 });
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});

  const handleStartQuiz = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/quiz/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      const data = await response.json();
      if (data.questions) {
        setQuestions(data.questions);
        setGameState('PLAYING');
        setCurrentQuestion(0);
        setAnswers({});
      }
    } catch (error) {
      console.error("Failed to generate quiz:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answer) => {
    setAnswers({ ...answers, [currentQuestion]: answer });
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correct) correct++;
    });
    return Math.round((correct / questions.length) * 100);
  };

  const getCorrectCount = () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correct) correct++;
    });
    return correct;
  };

  const handleSubmitQuiz = async () => {
    const score = calculateScore();
    try {
      const submission = {
        user_id: userId,
        domain: config.topic,
        difficulty: config.difficulty,
        score: score,
        total_questions: questions.length
      };

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      await fetch(`${apiUrl}/quiz/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission)
      });
    } catch (error) {
      console.error("Failed to submit quiz results:", error);
    }
    setGameState('RESULTS');
  };

  // --- Render Functions ---

  const renderSetup = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="max-w-xl mx-auto bg-white rounded-3xl shadow-lg p-8 border border-gray-100 mt-10"
    >
      <div className="text-center mb-8">
        <div className="bg-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <BookOpen className="text-indigo-600 w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Test Your Knowledge</h1>
        <p className="text-gray-500">Challenge yourself with our interactive quiz to assess your skills</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
            <BookOpen size={16} className="text-indigo-500" /> Select Topic/Domain
          </label>
          <input
            value={config.topic}
            onChange={(e) => setConfig({ ...config, topic: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900"
            placeholder="e.g. JavaScript"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
            <Zap size={16} className="text-orange-500" /> Difficulty Level
          </label>
          <div className="grid grid-cols-3 gap-4">
            {['Easy', 'Medium', 'Hard'].map((level) => (
              <button
                key={level}
                onClick={() => setConfig({ ...config, difficulty: level })}
                className={`py-3 rounded-xl font-medium transition-all ${config.difficulty === level ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
            <HelpCircle size={16} className="text-blue-500" /> Number of Questions
          </label>
          <select
            value={config.count}
            onChange={(e) => setConfig({ ...config, count: Number(e.target.value) })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-gray-900"
          >
            <option value={5}>5 Questions</option>
            <option value={10}>10 Questions</option>
            <option value={15}>15 Questions</option>
          </select>
        </div>

        <button
          onClick={handleStartQuiz}
          disabled={loading}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> Generating...</>
          ) : "Start Quiz"}
        </button>
      </div>
    </motion.div>
  );

  const renderPlaying = () => {
    const question = questions[currentQuestion];
    if (!question) return null;
    return (
      <motion.div
        key={currentQuestion}
        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
        className="max-w-2xl mx-auto mt-10"
      >
        <div className="flex justify-between items-center mb-6">
          <span className="text-xl font-bold text-gray-900">Question {currentQuestion + 1} of {questions.length}</span>
          <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-semibold">
            {config.topic} • {config.difficulty}
          </span>
        </div>

        <div className="h-2 bg-gray-100 rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-indigo-600 transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100 min-h-[400px] flex flex-col">
          <h2 className="text-xl font-bold text-gray-900 mb-8">{question.question}</h2>

          <div className="space-y-4 flex-grow">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswerSelect(option)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium ${answers[currentQuestion] === option ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md' : 'border-gray-100 hover:border-indigo-200 text-gray-600'}`}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="flex justify-between mt-8 pt-6 border-t border-gray-50">
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="px-6 py-2 rounded-lg border border-gray-200 text-gray-500 font-medium hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={handleSubmitQuiz}
                disabled={!answers[currentQuestion]}
                className="px-8 py-2 rounded-lg bg-indigo-600 text-white font-bold shadow-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
                className="px-8 py-2 rounded-lg bg-indigo-600 text-white font-bold shadow-lg hover:bg-indigo-700"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  const renderResults = () => {
    const score = calculateScore();
    const correctCount = getCorrectCount();

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="max-w-3xl mx-auto mt-10 pb-20"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete</h1>
          <p className="text-gray-500">Great effort! Review the topics and try again to improve.</p>
        </div>

        {/* Score Card */}
        <div className="bg-indigo-50 rounded-2xl border border-indigo-100 p-8 text-center mb-10">
          <div className="text-6xl font-bold text-indigo-600 mb-2">{score}%</div>
          <div className="text-xl font-semibold text-gray-800 mb-1">{correctCount} out of {questions.length} Correct</div>
          <div className="text-sm text-indigo-400">{config.topic} • {config.difficulty} Level</div>
        </div>

        {/* Review List */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Award className="text-indigo-500" /> Review Your Answers
          </h2>
          <div className="space-y-6">
            {questions.map((q, idx) => {
              const isCorrect = answers[idx] === q.correct;
              const userAnswer = answers[idx];

              return (
                <div key={q.id} className={`p-6 rounded-xl border-l-4 ${isCorrect ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
                  <div className="flex items-start gap-3 mb-3">
                    {isCorrect ? <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} /> : <XCircle className="text-red-600 flex-shrink-0 mt-1" size={20} />}
                    <h3 className="font-bold text-gray-900 text-lg">Q{idx + 1}. {q.question}</h3>
                  </div>

                  <div className="space-y-2 ml-8">
                    {!isCorrect && (
                      <div className="text-sm">
                        <span className="font-bold text-red-700">Your answer: </span>
                        <span className="text-red-600">{userAnswer || 'Skipped'}</span>
                      </div>
                    )}
                    <div className="text-sm">
                      <span className={`font-bold ${isCorrect ? 'text-green-700' : 'text-green-700'}`}>Correct answer: </span>
                      <span className="text-green-600">{q.correct}</span>
                    </div>
                    <div className={`text-sm italic mt-2 p-2 rounded ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {q.explanation}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-center mt-10">
          <button
            onClick={() => setGameState('SETUP')}
            className="flex items-center gap-2 px-8 py-3 rounded-full bg-gray-900 text-white font-bold shadow-lg hover:bg-gray-800 transition-all"
          >
            <RotateCcw size={18} /> Take New Quiz
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <AnimatePresence mode="wait">
        {gameState === 'SETUP' && renderSetup()}
        {gameState === 'PLAYING' && renderPlaying()}
        {gameState === 'RESULTS' && renderResults()}
      </AnimatePresence>
    </div>
  );
}