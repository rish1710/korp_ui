"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  RotateCcw, 
  ArrowRight, 
  Brain, 
  Timer, 
  Zap,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Trophy,
  Target
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export default function QuizPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
        const docId = localStorage.getItem("korp_current_doc_id");
        if (!docId) {
            setError("No document selected for assessment.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:8000/api/quiz/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ doc_id: docId, num_questions: 5, mode: "quiz" })
            });

            if (!response.ok) throw new Error("Failed to generate quiz");
            const data = await response.json();
            if (data.status === "success" && data.questions) {
                setQuestions(data.questions);
            } else {
                setError(data.message || "Tiki couldn't compile questions.");
            }
        } catch (err) {
            console.error("Error fetching quiz:", err);
            setError("Connection error. Is the backend running?");
        } finally {
            setLoading(false);
        }
    };

    fetchQuiz();
  }, []);

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === questions[current].correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (current < questions.length - 1) {
        setCurrent(current + 1);
        setSelected(null);
      } else {
        setShowResult(true);
      }
    }, 2000);
  };

  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8 text-center">
            <div className="relative w-40 h-40">
                <Image 
                    src="/mascot/mascot-processing.jpg" 
                    alt="Tiki Processing" 
                    fill 
                    className="object-contain animate-pulse rounded-full"
                />
            </div>
            <div className="space-y-2">
                <h2 className="text-xl font-bold text-stone-800">Tiki is reviewing your material...</h2>
                <p className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.4em] animate-pulse">Generating your custom assessment</p>
            </div>
        </div>
    );
  }

  if (error || questions.length === 0) {
    return (
        <div className="max-w-xl mx-auto py-20 px-6 text-center space-y-8">
            <div className="bg-white p-12 rounded-[40px] border border-stone-200 shadow-xl space-y-6">
                <div className="w-24 h-24 mx-auto mb-4 overflow-hidden">
                    <Image src="/mascot/mascot-sad.jpg" alt="Sad Tiki" width={100} height={100} className="object-contain" />
                </div>
                <h2 className="text-2xl font-bold text-stone-800">{error || "No questions found."}</h2>
                <Link href="/upload" className="inline-flex h-14 px-10 bg-indigo-600 text-white rounded-2xl font-bold items-center justify-center shadow-lg">
                    Back to Upload
                </Link>
            </div>
        </div>
    );
  }

  if (showResult) {
    const masteryPercentage = Math.round((score / questions.length) * 100);
    return (
      <div className="max-w-2xl mx-auto py-16 px-6 text-center space-y-10">
        <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-14 rounded-[56px] border border-stone-200 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] space-y-10 relative overflow-hidden"
        >
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-indigo-500 via-emerald-500 to-indigo-500" />
            
            <div className="relative">
                <div className="w-28 h-28 mx-auto mb-6 relative">
                     <Image 
                        src={masteryPercentage > 70 ? "/mascot/mascot-celebrating.jpg" : "/mascot/mascot-hi.jpg"} 
                        alt="Tiki Result" 
                        fill 
                        className="object-contain rounded-full border-4 border-indigo-50 shadow-xl"
                    />
                </div>
                <h2 className="text-3xl font-black text-stone-900 tracking-tight">Assessment Complete</h2>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="p-8 rounded-[32px] bg-stone-50 border border-stone-100 flex flex-col items-center">
                    <p className="text-5xl font-black text-indigo-600 tabular-nums">{masteryPercentage}%</p>
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mt-2 px-4">Mastery Rank</p>
                </div>
                <div className="p-8 rounded-[32px] bg-indigo-50 border border-indigo-100 flex flex-col items-center">
                    <div className="flex items-baseline gap-1">
                        <p className="text-5xl font-black text-indigo-900 tabular-nums">{score}</p>
                        <span className="text-xl font-bold text-indigo-400">/ {questions.length}</span>
                    </div>
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-2 px-4">Correct Responses</p>
                </div>
            </div>

            <p className="text-base text-stone-600 leading-relaxed font-medium px-4">
                {masteryPercentage >= 100 ? "Pure brilliance! Your synapse mapping is complete." : 
                 masteryPercentage >= 70 ? "Excellent retention! Tiki is impressed with your recall." :
                 "Solid attempt! Review the Study Book to reinforce these neural pathways."}
            </p>

            <div className="flex flex-col gap-4 pt-4">
                <Link href="/dashboard" className="h-16 bg-stone-900 text-white rounded-3xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-xl shadow-stone-200">
                    Finalize Session <ArrowRight className="w-5 h-5" />
                </Link>
                <button 
                  onClick={() => window.location.reload()} 
                  className="h-16 bg-white border border-stone-200 text-stone-600 rounded-3xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-stone-50 transition-all shadow-sm"
                >
                    <RotateCcw className="w-5 h-5" /> Retake Protocol
                </button>
            </div>
        </motion.div>
      </div>
    );
  }

  const q = questions[current];

  return (
    <div className="max-w-5xl mx-auto py-10 px-6 space-y-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">
            <Zap className="w-4 h-4" /> Cognitive Stress Test
          </div>
          <h1 className="text-3xl font-black tracking-tight text-stone-900">Active Assessment</h1>
        </div>
        <div className="flex items-center gap-4 bg-white p-2.5 pr-8 rounded-2xl border border-stone-200 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-stone-50 flex items-center justify-center border border-stone-100">
                <Timer className="w-6 h-6 text-stone-400" />
            </div>
            <div>
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Question</p>
                <div className="flex items-center gap-2">
                    <p className="text-lg font-black text-stone-900">{current + 1}</p>
                    <span className="text-xs font-bold text-stone-300">/ {questions.length}</span>
                </div>
            </div>
        </div>
      </header>

      <div className="space-y-10">
        <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden border border-stone-200">
            <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${((current + 1) / questions.length) * 100}%` }}
                className="h-full bg-indigo-600 shadow-[0_0_15px_-3px_rgba(79,70,229,0.5)]"
            />
        </div>

        <motion.div
            key={current}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-10 md:p-16 rounded-[56px] space-y-12 border border-stone-200 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-10 opacity-5 grayscale pointer-events-none">
                 <Image src="/mascot/mascot-hi.jpg" alt="Tiki" width={120} height={120} />
            </div>

            <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                        <HelpCircle className="w-5 h-5 text-indigo-600" />
                    </div>
                    <span className="text-[10px] font-black text-stone-400 tracking-[0.2em] uppercase">Synaptic Inquiry</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black leading-tight tracking-tight text-stone-900 max-w-3xl">
                    {q.question}
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
                {q.options.map((opt, i) => (
                    <button
                        key={i}
                        onClick={() => handleAnswer(i)}
                        className={`group p-8 rounded-[32px] text-left transition-all border-2 flex items-center justify-between ${
                            selected === null 
                                ? 'bg-stone-50 border-stone-100 hover:border-indigo-300 hover:bg-white hover:shadow-xl hover:-translate-y-1' 
                                : i === q.correct 
                                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900' 
                                    : selected === i 
                                        ? 'bg-rose-50 border-rose-500 text-rose-900' 
                                        : 'opacity-40 grayscale border-stone-100 overflow-hidden'
                        }`}
                    >
                        <span className="text-lg font-bold">{opt}</span>
                        {selected !== null && i === q.correct && <CheckCircle2 className="w-7 h-7 text-emerald-500" />}
                        {selected === i && i !== q.correct && <XCircle className="w-7 h-7 text-rose-500" />}
                    </button>
                ))}
            </div>

            <AnimatePresence>
                {selected !== null && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="bg-indigo-50/50 p-8 rounded-[32px] border border-indigo-100 relative z-10"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <Sparkles className="w-5 h-5 text-indigo-600" />
                            <span className="text-[11px] font-black text-indigo-400 uppercase tracking-widest">Tiki's Analysis</span>
                        </div>
                        <p className="text-base text-stone-700 leading-relaxed font-medium">
                            {q.explanation}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
