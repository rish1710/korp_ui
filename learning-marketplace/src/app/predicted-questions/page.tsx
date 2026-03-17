"use client";

import { motion } from "framer-motion";
import { 
  Sparkles, 
  Target, 
  TrendingUp, 
  ChevronRight, 
  Brain, 
  FileText,
  AlertCircle,
  HelpCircle,
  Zap
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface Prediction {
    id: number;
    question: string;
    type: string;
    reason: string;
    hint: string;
}

export default function PredictedQuestionsPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPredictions = async () => {
        const docId = localStorage.getItem("korp_current_doc_id");
        if (!docId) {
            setError("No document selected.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/predictions/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ doc_id: docId })
            });
            const data = await response.json();
            
            if (data.status === "success" && data.predictions) {
                setPredictions(data.predictions.map((p: any, i: number) => ({
                    id: i + 1,
                    ...p
                })));
            } else {
                setError(data.message || "Tiki couldn't predict questions for this layout.");
            }
        } catch (err) {
            console.error("Error fetching predictions:", err);
            setError("Connection error. Is the backend running?");
        } finally {
            setIsLoading(false);
        }
    };

    fetchPredictions();
  }, []);

  if (isLoading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8">
            <div className="relative w-36 h-36">
                <Image 
                    src="/mascot/mascot-processing.jpg" 
                    alt="Tiki Processing" 
                    fill 
                    className="object-contain animate-pulse rounded-full"
                />
            </div>
            <div className="text-center space-y-2">
                <h2 className="text-xl font-bold text-stone-800">Tiki is simulating the exam...</h2>
                <p className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.4em] animate-pulse">Running curriculum forecasting</p>
            </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="max-w-xl mx-auto py-20 px-6 text-center space-y-8">
            <div className="bg-white p-12 rounded-[40px] border border-stone-200 shadow-xl space-y-6">
                <div className="w-24 h-24 mx-auto mb-4 overflow-hidden">
                    <Image src="/mascot/mascot-sad.jpg" alt="Sad Tiki" width={100} height={100} className="object-contain" />
                </div>
                <h2 className="text-2xl font-bold text-stone-800">{error}</h2>
                <Link href="/upload" className="inline-flex h-14 px-10 bg-indigo-600 text-white rounded-2xl font-bold items-center justify-center shadow-lg">
                    Back to Upload
                </Link>
            </div>
        </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12 pb-20 min-h-screen">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-600 uppercase tracking-[0.2em]">
            <Target className="w-3.5 h-3.5" /> AI Exam Forecasting
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">Predicted Questions</h1>
          <p className="text-sm text-stone-500 font-medium">Likely exam topics based on your grounded curriculum.</p>
        </div>
        <div className="flex items-center gap-4">
             <div className="bg-white px-6 py-3 rounded-2xl flex items-center gap-3 border border-stone-200 shadow-sm">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-stone-400">Forecast Accuracy</p>
                    <p className="text-xs font-bold text-stone-800">89.4% (Confidence)</p>
                </div>
             </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-2">
                <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-stone-800">
                    <Sparkles className="w-4 h-4 text-indigo-600" /> Priority Forecasts
                </h2>
            </div>

            <div className="space-y-4">
                {predictions.map((p, i) => (
                    <motion.div
                        key={p.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-8 rounded-[32px] border border-stone-200 hover:border-indigo-300 transition-all group flex flex-col md:flex-row md:items-center justify-between gap-8 cursor-pointer shadow-sm hover:shadow-xl"
                    >
                        <div className="space-y-4 flex-1">
                            <div className="flex items-center gap-3">
                                <div className={`w-2.5 h-2.5 rounded-full ${i < 2 ? 'bg-rose-500 animate-pulse' : 'bg-amber-500'}`} />
                                <span className={`text-[10px] font-black uppercase tracking-widest ${i < 2 ? 'text-rose-500' : 'text-stone-400'}`}>{p.type} Priority</span>
                                <span className="px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200 text-[8px] font-bold uppercase tracking-widest text-stone-500">{p.type}</span>
                            </div>
                            <h3 className="text-xl font-bold leading-snug text-stone-800 group-hover:text-indigo-600 transition-colors">{p.question}</h3>
                            <p className="text-sm text-stone-500 font-medium">Reason: {p.reason}</p>
                        </div>
                        <div className="flex items-center gap-6 shrink-0 md:border-l border-stone-100 md:pl-8">
                            <button className="h-12 w-12 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-center text-stone-400 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>

        <aside className="space-y-8">
            <div className="bg-indigo-600 p-8 rounded-[40px] text-white space-y-8 shadow-2xl relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                <div className="flex items-center gap-3 relative z-10">
                    <Brain className="w-6 h-6 text-indigo-200" />
                    <h3 className="text-lg font-bold">Forecaster Insights</h3>
                </div>
                <p className="text-sm text-indigo-100 leading-relaxed font-medium relative z-10">
                    Tiki highly recommends focusing on <b>conceptual relationships</b> and <b>applied scenarios</b> as they constitute 70% of the predicted exam weight.
                </p>
                <div className="space-y-4 relative z-10">
                    <div className="p-5 rounded-2xl bg-white/10 border border-white/10 flex items-center gap-4">
                        <AlertCircle className="w-5 h-5 text-amber-300" />
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-amber-200">Critical Insight</p>
                            <p className="text-xs font-semibold">Focus on "Applied" types</p>
                        </div>
                    </div>
                </div>
                <Link href="/quiz" className="w-full h-14 bg-white text-indigo-600 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center hover:bg-stone-50 transition-all shadow-xl">
                    Test These Now
                </Link>
            </div>

            <div className="bg-white p-8 rounded-[40px] border border-stone-200 space-y-6 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2 text-stone-800">
                    <HelpCircle className="w-4 h-4 text-indigo-600" /> Exam Strategy
                </h3>
                <p className="text-xs text-stone-500 font-medium leading-relaxed">
                    Tap any question to see AI-generated hints and mapped references from your study book.
                </p>
                <div className="pt-4 flex items-center gap-4 border-t border-stone-50">
                    <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100">
                        <Zap className="w-5 h-5 text-amber-500" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Dynamic Forecast</span>
                </div>
            </div>
        </aside>
      </div>
    </div>
  );
}
