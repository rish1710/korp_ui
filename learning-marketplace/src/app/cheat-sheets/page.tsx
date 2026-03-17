"use client";

import { motion } from "framer-motion";
import { 
  FileBadge, 
  Download, 
  Printer, 
  Share2, 
  Sparkles, 
  CheckCircle2, 
  Info,
  ChevronRight,
  Maximize2,
  Zap
} from "lucide-react";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import Image from "next/image";

export default function CheatSheetsPage() {
  const [content, setContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCheatSheet = async () => {
        const docId = localStorage.getItem("korp_current_doc_id");
        if (!docId) {
            setError("No document selected.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/quick/cheat-sheet`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ doc_id: docId })
            });
            const data = await response.json();
            if (data.status === "success") {
                setContent(data.content);
            } else {
                setError("Tiki couldn't compress this enough. Try another doc.");
            }
        } catch (err) {
            console.error("Error fetching cheat sheet:", err);
            setError("Connection error. Is the backend running?");
        } finally {
            setIsLoading(false);
        }
    };

    fetchCheatSheet();
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
                <h2 className="text-xl font-bold text-stone-800">Tiki is condensing everything...</h2>
                <p className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.4em] animate-pulse">Distilling high-density summary</p>
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
                    Go Back to Upload
                </Link>
            </div>
        </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-600 uppercase tracking-[0.2em]">
            <FileBadge className="w-3.5 h-3.5" /> High-Density Summary
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">Cheat Sheets</h1>
          <p className="text-sm text-stone-500 font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Synthesized reference grounded in your material.
          </p>
        </div>
        <div className="flex items-center gap-3">
            <button className="h-12 px-6 bg-white border border-stone-200 rounded-2xl flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-600 hover:bg-stone-50 transition-all shadow-sm">
                <Printer className="w-4 h-4" /> Print
            </button>
            <button className="h-12 w-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 hover:scale-105 transition-transform">
                <Download className="w-5 h-5" />
            </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-10">
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-12 md:p-16 rounded-[48px] border border-stone-200 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.06)] relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-64 h-64 bg-stone-50 rounded-bl-full -z-0 pointer-events-none" />
            
            <div className="relative z-10 prose prose-stone max-w-none">
                <ReactMarkdown components={{
                    h1: ({...props}) => <h1 className="text-3xl font-black text-stone-900 mb-8 pb-4 border-b border-stone-100" {...props} />,
                    h2: ({...props}) => <h2 className="text-xl font-bold text-indigo-600 mt-10 mb-4 uppercase tracking-widest" {...props} />,
                    p: ({...props}) => <p className="text-base text-stone-600 leading-relaxed mb-4 font-medium" {...props} />,
                    li: ({...props}) => <li className="text-base text-stone-600 mb-2 font-medium" {...props} />,
                    strong: ({...props}) => <strong className="text-stone-900 font-bold" {...props} />,
                    table: ({...props}) => <div className="my-8 overflow-x-auto"><table className="w-full border-collapse rounded-xl overflow-hidden border border-stone-200" {...props} /></div>,
                    th: ({...props}) => <th className="bg-stone-50 p-4 border border-stone-200 text-xs font-bold uppercase tracking-widest text-stone-800 text-left" {...props} />,
                    td: ({...props}) => <td className="p-4 border border-stone-200 text-sm text-stone-600 font-medium" {...props} />
                }}>
                    {content || ""}
                </ReactMarkdown>
            </div>
        </motion.div>

        {/* Action Suggestion Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="p-10 rounded-[40px] bg-stone-900 text-white flex flex-col justify-between shadow-2xl"
            >
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-amber-400" />
                        <h3 className="text-sm font-bold uppercase tracking-widest text-stone-300">Quick Test</h3>
                    </div>
                    <p className="text-xl font-bold leading-tight">
                        Ready to test your recall on these key points?
                    </p>
                </div>
                <Link href="/quiz" className="w-full mt-8 h-14 bg-white text-stone-900 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-stone-100 transition-all">
                    Start Flash Quiz <ChevronRight className="w-4 h-4" />
                </Link>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="p-10 rounded-[40px] bg-indigo-600 text-white flex flex-col justify-between shadow-2xl"
            >
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-300" />
                        <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-200">Exam Mode</h3>
                    </div>
                    <p className="text-xl font-bold leading-tight">
                        Predict likely board exam questions for these topics.
                    </p>
                </div>
                <Link href="/predicted-questions" className="w-full mt-8 h-14 bg-white text-indigo-600 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-stone-100 transition-all">
                    Forecast Questions <ChevronRight className="w-4 h-4" />
                </Link>
            </motion.div>
        </div>
      </div>

      <div className="flex justify-center gap-10 opacity-40 hover:opacity-100 transition-opacity pb-10">
        <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 hover:text-indigo-600 transition-colors">
            <Maximize2 className="w-4 h-4" /> Fullscreen View
        </button>
        <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 hover:text-indigo-600 transition-colors">
            <Share2 className="w-4 h-4" /> Export Assets
        </button>
      </div>
    </div>
  );
}
