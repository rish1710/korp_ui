"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookText, 
  ChevronLeft, 
  ChevronRight, 
  Bookmark, 
  Printer, 
  Share2, 
  Sparkles,
  List,
  Clock,
  CheckCircle2,
  Highlighter,
  MessageSquare,
  Type,
  MousePointer2,
  Search,
  Download,
  AlertCircle,
  Zap
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import Image from "next/image";

interface Chapter {
    title: string;
    content: string;
    word_count: number;
}

interface StudyBook {
    book_id: string;
    title: string;
    chapters: Chapter[];
    total_chapters: number;
}

export default function StudyBookPage() {
  const [book, setBook] = useState<StudyBook | null>(null);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTool, setActiveTool] = useState<"select" | "highlight" | "note">("select");
  const [highlights, setHighlights] = useState<{ id: number; text: string; color: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudyBook = async () => {
        const docId = localStorage.getItem("korp_current_doc_id");
        if (!docId) {
            setError("No document selected. Please upload a document first.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/books/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ doc_id: docId })
            });
            if (!response.ok) throw new Error("Failed to generate study book");
            const data = await response.json();
            if (data.status === "success") {
                setBook(data.book);
            } else {
                setError(data.message || "Could not generate study book.");
            }
        } catch (err) {
            console.error("Error fetching study book:", err);
            setError("Connection error. Is the backend running?");
        } finally {
            setIsLoading(false);
        }
    };

    fetchStudyBook();
  }, []);

  const [notes, setNotes] = useState<{ id: number; text: string; chapter: number }[]>([]);

  const downloadPDF = () => {
      window.print();
  };

  const addHighlight = () => {
    const selection = window.getSelection();
    const text = selection?.toString();
    if (text && text.trim()) {
        setHighlights(prev => [...prev, { id: Date.now(), text, color: "bg-yellow-200/50" }]);
        // Selection is maintained visually in the list below, 
        // and we can use CSS to make general selections look persistent if we really wanted to, 
        // but for now, the "Insights" list is the primary storage.
    }
  };

  const addNote = () => {
      const text = prompt("Enter your note/insight:");
      if (text) {
          setNotes(prev => [...prev, { id: Date.now(), text, chapter: currentChapter }]);
      }
  };

  if (isLoading) {
    // ... (keep isLoading block)
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8">
        <div className="relative w-40 h-40">
            <Image 
                src="/mascot/mascot-processing.jpg" 
                alt="Tiki Processing" 
                fill 
                className="object-contain animate-pulse rounded-full"
            />
        </div>
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" />
          </div>
          <p className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.4em]">Tiki is writing your personal textbook...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
        <div className="max-w-xl mx-auto py-20 px-6 text-center space-y-8">
            <div className="bg-white p-12 rounded-[40px] border border-stone-200 shadow-xl space-y-6">
                <div className="w-24 h-24 mx-auto overflow-hidden">
                    <Image src="/mascot/mascot-sad.jpg" alt="Sad Tiki" width={100} height={100} className="object-contain" />
                </div>
                <h2 className="text-2xl font-bold text-stone-800">Note: {error}</h2>
                <Link href="/upload" className="inline-flex h-14 px-10 bg-indigo-600 text-white rounded-2xl font-bold items-center justify-center gap-2 hover:scale-105 transition-all shadow-lg shadow-indigo-100">
                    Upload Material
                </Link>
            </div>
        </div>
    );
  }

  if (!book) return null;
  const chapter = book.chapters[currentChapter];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col lg:flex-row gap-10 min-h-screen">
      {/* Floating Toolbar */}
      <div className="fixed left-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2 p-2 bg-white/80 backdrop-blur-md rounded-2xl border border-stone-200 shadow-2xl hidden xl:flex print:hidden">
          <button 
            onClick={() => setActiveTool("select")}
            className={`p-3 rounded-xl transition-all ${activeTool === "select" ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-stone-100 text-stone-400'}`}
          >
              <MousePointer2 className="w-5 h-5" />
          </button>
          <div className="h-px bg-stone-100 mx-2" />
          <button 
            onClick={() => { setActiveTool("highlight"); addHighlight(); }}
            className={`p-3 rounded-xl transition-all ${activeTool === "highlight" ? 'bg-amber-400 text-amber-950 shadow-md' : 'hover:bg-stone-100 text-stone-400'}`}
          >
              <Highlighter className="w-5 h-5" />
          </button>
          <button 
            onClick={() => { setActiveTool("note"); addNote(); }}
            className={`p-3 rounded-xl transition-all ${activeTool === "note" ? 'bg-blue-500 text-white' : 'hover:bg-stone-100 text-stone-400'}`}
          >
              <MessageSquare className="w-5 h-5" />
          </button>
          <div className="h-px bg-stone-100 mx-2" />
          <button className="p-3 rounded-xl hover:bg-stone-100 text-stone-400 focus:text-indigo-600 transition-colors">
              <Type className="w-5 h-5" />
          </button>
      </div>

      {/* Table of Contents - Desktop */}
      <aside className="hidden lg:block w-72 shrink-0 space-y-8">
        <div className="bg-white p-6 rounded-[32px] sticky top-10 border border-stone-200 shadow-sm overflow-hidden">
            <h3 className="text-[10px] font-bold uppercase tracking-widest mb-6 flex items-center gap-2 text-indigo-600">
                <List className="w-3.5 h-3.5" /> Table of Contents
            </h3>
            <div className="space-y-1 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {book.chapters.map((ch, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentChapter(idx)}
                        className={`w-full text-left p-4 rounded-xl text-xs font-bold transition-all flex items-center gap-3 ${currentChapter === idx ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600' : 'hover:bg-stone-50 text-stone-500 hover:text-stone-800'}`}
                    >
                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center border ${currentChapter === idx ? 'border-indigo-200 bg-white' : 'border-stone-100'}`}>
                            {idx + 1}
                        </span>
                        <span className="truncate">{ch.title}</span>
                    </button>
                ))}
            </div>
            <div className="mt-8 pt-6 border-t border-stone-100 print:hidden">
                <button 
                  onClick={downloadPDF}
                  className="w-full h-12 bg-stone-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-stone-800 transition-all shadow-lg shadow-stone-200"
                >
                   <Download className="w-4 h-4" /> Download Notes (PDF)
                </button>
            </div>
        </div>
      </aside>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          main, main * { visibility: visible; }
          main { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 20px; }
          .print\\:hidden { display: none !important; }
          aside { display: none !important; }
        }
      `}</style>

      {/* Main Content Area */}
      <main className="flex-1 space-y-12 pb-20">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-600 uppercase tracking-[0.3em]">
                    <Sparkles className="w-3.5 h-3.5" /> AI-Generated Study Book
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight leading-tight text-stone-900">{chapter.title}</h1>
                <div className="flex items-center gap-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest pt-1">
                    <span className="flex items-center gap-1.5 bg-stone-100 px-3 py-1.5 rounded-full"><Clock className="w-3.5 h-3.5 text-stone-500" /> {Math.ceil(chapter.word_count / 200)} min read</span>
                    <span className="flex items-center gap-1.5 bg-stone-100 px-3 py-1.5 rounded-full"><BookText className="w-3.5 h-3.5 text-stone-500" /> {chapter.word_count} words</span>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <button className="p-4 rounded-2xl bg-white border border-stone-200 hover:bg-stone-50 transition-colors text-stone-500 shadow-sm"><Bookmark className="w-5 h-5" /></button>
                <button className="p-4 rounded-2xl bg-white border border-stone-200 hover:bg-stone-50 transition-colors text-stone-500 shadow-sm"><Share2 className="w-5 h-5" /></button>
            </div>
        </header>

        {/* Content Viewport */}
        <section className="bg-white p-10 md:p-16 rounded-[48px] border border-stone-200 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.08)] prose prose-stone max-w-none leading-relaxed relative min-h-[600px]">
            {/* Design Element */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-stone-50 rounded-bl-[200px] pointer-events-none -z-0" />
            
            <div className="relative z-10">
                <ReactMarkdown components={{
                    h1: ({...props}) => <h1 className="text-4xl font-black text-stone-900 mt-12 mb-8 tracking-tighter" {...props} />,
                    h2: ({...props}) => <h2 className="text-2xl font-bold text-stone-800 mt-10 mb-5 border-l-4 border-indigo-600 pl-4" {...props} />,
                    p: ({...props}) => <p className="text-lg text-stone-600 leading-relaxed mb-6 font-medium selection:bg-amber-100" {...props} />,
                    li: ({...props}) => <li className="text-lg text-stone-600 mb-2 font-medium" {...props} />,
                    strong: ({...props}) => <strong className="text-stone-900 font-bold" {...props} />
                }}>
                    {chapter.content}
                </ReactMarkdown>

                {/* Highlights display */}
                {highlights.length > 0 && (
                    <div className="mt-24 pt-10 border-t border-stone-100 space-y-6 print:mt-10">
                        <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2 text-stone-800">
                            <Highlighter className="w-4 h-4 text-amber-500" /> Key Insights Saved
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {highlights.map(h => (
                                <div key={h.id} className="p-5 rounded-2xl bg-amber-50 border border-amber-100 text-stone-700 text-sm font-medium leading-relaxed shadow-sm italic">
                                    "{h.text}"
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Notes display */}
                {notes.filter(n => n.chapter === currentChapter).length > 0 && (
                    <div className="mt-12 pt-10 border-t border-stone-100 space-y-6 print:mt-5">
                        <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2 text-stone-800">
                            <MessageSquare className="w-4 h-4 text-blue-500" /> My Personal Notes
                        </h3>
                        <div className="space-y-4">
                            {notes.filter(n => n.chapter === currentChapter).map(n => (
                                <div key={n.id} className="p-6 rounded-2xl bg-blue-50 border border-blue-100 text-stone-700 text-sm font-bold leading-relaxed shadow-sm flex items-start gap-4">
                                    <div className="w-8 h-8 shrink-0 bg-white rounded-lg flex items-center justify-center border border-blue-200 shadow-sm">
                                        <Zap className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <p>{n.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation Footer */}
            <div className="mt-24 pt-10 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-100 shadow-inner">
                        <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Cognitive Mastery</p>
                        <p className="text-sm font-bold text-stone-800">Review complete for this module</p>
                    </div>
                </div>
                <div className="flex gap-4">
                     <button 
                        disabled={currentChapter === 0}
                        onClick={() => { setCurrentChapter(prev => prev - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="h-16 px-10 rounded-2xl border border-stone-200 bg-white hover:bg-stone-50 disabled:opacity-30 transition-all font-bold text-stone-600 flex items-center gap-2 shadow-sm"
                    >
                        <ChevronLeft className="w-5 h-5" /> Back
                    </button>
                    <button 
                        disabled={currentChapter === book.chapters.length - 1}
                        onClick={() => { setCurrentChapter(prev => prev + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="h-16 px-10 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-30 transition-all font-bold flex items-center gap-2 shadow-xl shadow-indigo-100"
                    >
                        Next Chapter <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </section>

        {/* Bottom Context Info */}
        <div className="flex items-center justify-center gap-10 opacity-60 hover:opacity-100 transition-opacity">
            <Link href="/quiz" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-stone-500 hover:text-indigo-600 transition-all">
                <Sparkles className="w-4 h-4" /> Adaptive Quiz
            </Link>
            <div className="w-1 h-1 bg-stone-300 rounded-full" />
            <Link href="/quick-learn" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-stone-500 hover:text-indigo-600 transition-all">
                <Zap className="w-4 h-4" /> Rapid Revision
            </Link>
        </div>
      </main>
    </div>
  );
}
