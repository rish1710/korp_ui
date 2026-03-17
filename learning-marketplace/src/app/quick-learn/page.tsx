"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  CheckCircle2, 
  SkipForward, 
  ArrowRight, 
  BookOpen, 
  Brain,
  Sparkles,
  Trophy,
  RotateCcw,
  Loader2
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";

export default function QuickLearnPage() {
  const [concepts, setConcepts] = useState<any[]>([]);
  const [summary, setSummary] = useState<string | null>(null);
  const [step, setStep] = useState<"loading" | "summary" | "concepts" | "finished">("loading");
  const [current, setCurrent] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
        const docId = localStorage.getItem("korp_current_doc_id");
        if (!docId) {
            setError("No document selected. Please upload a document first.");
            setIsLoading(false);
            return;
        }

        try {
            // 1. Fetch Summary
            const sumRes = await fetch("http://127.0.0.1:8000/api/quick/summary", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ doc_id: docId })
            });
            const sumData = await sumRes.json();
            if (sumData.status === "success") {
                setSummary(sumData.content);
            }

            // 2. Fetch Concepts
            const response = await fetch("http://127.0.0.1:8000/api/concepts/extract", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ doc_id: docId })
            });
            const data = await response.json();
            if (data.status === "success" && data.concepts.length > 0) {
                setConcepts(data.concepts);
                setStep("summary");
            } else {
                setError("Could not extract concepts from this document.");
            }
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Connection error. Is the backend running?");
        } finally {
            setIsLoading(false);
        }
    };

    fetchData();
  }, []);

  const progress = concepts.length > 0 ? Math.round(((current + (step === 'concepts' ? 1 : 0)) / (concepts.length + 1)) * 100) : 0;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="relative w-32 h-32">
            <Image 
                src="/mascot/mascot-processing.jpg" 
                alt="Tiki Processing" 
                fill 
                className="object-contain animate-pulse rounded-full"
            />
        </div>
        <div className="text-center space-y-2">
            <h2 className="text-xl font-bold text-stone-800">Tiki is synthesizing your archives...</h2>
            <p className="text-sm text-stone-500 font-medium animate-pulse uppercase tracking-widest">Neural extraction in progress</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
        <div className="max-w-xl mx-auto py-20 px-6 text-center space-y-8">
            <div className="premium-glass-light p-12 rounded-[40px] border border-stone-200/50 shadow-xl space-y-6 bg-white">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
                    <Image src="/mascot/mascot-sad.jpg" alt="Sad Tiki" width={60} height={60} className="object-contain" />
                </div>
                <h2 className="text-2xl font-bold text-stone-800">Oops! {error}</h2>
                <Link href="/upload" className="inline-flex h-14 px-8 bg-indigo-600 text-white rounded-2xl font-bold items-center justify-center gap-2 hover:scale-105 transition-all shadow-lg">
                    Go to Upload
                </Link>
            </div>
        </div>
    );
  }

  if (step === "finished") {
    return (
      <div className="max-w-xl mx-auto py-20 px-6 text-center space-y-8">
        <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="premium-glass-light p-12 rounded-[40px] border border-stone-200/50 shadow-2xl space-y-6 bg-white"
        >
            <div className="w-28 h-28 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 p-2 overflow-hidden border-2 border-emerald-100">
                <Image src="/mascot/mascot-celebrating.jpg" alt="Celebrate Tiki" width={100} height={100} className="object-contain translate-y-2" />
            </div>
            <h2 className="text-3xl font-bold text-stone-800">Session Complete!</h2>
            <p className="text-stone-600 leading-relaxed font-medium">
                You've rapid-mastered the <b>Executive Summary</b> and <b>{concepts.length} core concepts</b>.
            </p>
            <div className="flex flex-col gap-3 pt-4">
                <Link href="/dashboard" className="h-14 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-xl shadow-indigo-200 active:scale-95">
                    Return to Dashboard <ArrowRight className="w-5 h-5" />
                </Link>
                <button onClick={() => { setStep("summary"); setCurrent(0); }} className="h-14 bg-stone-100 text-stone-600 border border-stone-200 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-stone-200 transition-all">
                    <RotateCcw className="w-5 h-5" /> Start Again
                </button>
            </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-6 space-y-10 min-h-screen">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-bold text-amber-600 uppercase tracking-[0.2em]">
            <Zap className="w-3.5 h-3.5" /> High-Intensity Learning
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-800">Quick Learn</h1>
        </div>
        <div className="flex items-center gap-4 bg-white p-2 pr-6 rounded-2xl border border-stone-200 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Brain className="w-5 h-5 text-amber-600" />
            </div>
            <div>
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Total Mastery</p>
                <p className="text-sm font-bold text-stone-800">{progress}%</p>
            </div>
        </div>
      </header>

      {/* Progress Track */}
      <div className="h-2 w-full bg-stone-200 rounded-full overflow-hidden shadow-inner">
        <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full" 
        />
      </div>

      <main className="relative min-h-[500px]">
        <AnimatePresence mode="wait">
          {step === "summary" ? (
            <motion.div
              key="summary"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white p-8 md:p-16 rounded-[48px] border border-stone-200 shadow-xl space-y-8 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-12 opacity-5">
                  <Sparkles className="w-32 h-32 text-indigo-600" />
              </div>
              <div className="space-y-4">
                  <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100">
                          <BookOpen className="w-6 h-6 text-indigo-600" />
                      </div>
                      <h2 className="text-3xl font-black text-stone-900 tracking-tight">Executive Summary</h2>
                  </div>
                  <div className="prose prose-stone max-w-none text-stone-600 font-medium leading-relaxed">
                      <ReactMarkdown components={{
                          h1: ({...props}) => <h1 className="text-2xl font-bold text-stone-900 mt-6 mb-4" {...props} />,
                          h2: ({...props}) => <h2 className="text-xl font-bold text-stone-800 mt-5 mb-3" {...props} />,
                          p: ({...props}) => <p className="mb-4" {...props} />,
                          li: ({...props}) => <li className="mb-2" {...props} />,
                      }}>
                          {summary || "Summing up the core synapses..."}
                      </ReactMarkdown>
                  </div>
              </div>
              <button 
                onClick={() => setStep("concepts")}
                className="w-full h-16 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-xl shadow-indigo-100 active:scale-95 mt-8"
              >
                  Proceed to Key Concepts <ArrowRight className="w-6 h-6" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white p-8 md:p-12 rounded-[40px] border border-stone-200 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] flex flex-col min-h-[400px] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-stone-50 rounded-bl-full -z-0 opacity-50" />
              <div className="flex-1 space-y-8 relative z-10">
                  <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center font-bold shadow-lg">
                          {current + 1}
                      </span>
                      <h2 className="text-3xl font-extrabold text-stone-800 tracking-tight">{concepts[current].name}</h2>
                  </div>
                  <div className="space-y-6">
                      <div className="inline-flex px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold uppercase tracking-wider border border-amber-100">
                          {concepts[current].importance > 0.8 ? "Crucial Topic" : "Key Insight"}
                      </div>
                      <p className="text-xl text-stone-600 leading-relaxed font-medium">
                          {concepts[current].description}
                      </p>
                  </div>
              </div>
              <div className="mt-12 flex flex-col sm:flex-row gap-4 relative z-10">
                  <button 
                    onClick={() => {
                        if (current < concepts.length - 1) {
                            setCurrent(current + 1);
                        } else {
                            setStep("finished");
                        }
                    }}
                    className="h-16 flex-1 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-all active:scale-95 shadow-xl shadow-indigo-100"
                  >
                      <CheckCircle2 className="w-5 h-5" /> Got it, continue
                  </button>
                  <button 
                    onClick={() => {
                        if (current < concepts.length - 1) {
                            setCurrent(current + 1);
                        } else {
                            setStep("finished");
                        }
                    }}
                    className="h-16 px-8 rounded-2xl bg-stone-50 border border-stone-200 hover:bg-stone-100 text-stone-600 font-bold flex items-center transition-all gap-2"
                  >
                      <SkipForward className="w-5 h-5" /> Skip
                  </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-10 flex items-center justify-center gap-12 text-stone-400">
            <Link href="/study-book" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest hover:text-indigo-600 transition-colors group">
                <BookOpen className="w-4 h-4 group-hover:scale-110 transition-transform" /> Full Material
            </Link>
            <div className="w-px h-4 bg-stone-200" />
            <Link href="/quiz" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest hover:text-indigo-600 transition-colors group">
                <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" /> Final Quiz
            </Link>
        </div>
      </main>
    </div>
  );
}
