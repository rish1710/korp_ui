"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  RotateCw, 
  Brain, 
  Layers, 
  CheckCircle2, 
  X,
  Target,
  Zap,
  TrendingUp,
  Box
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Flashcard {
  id: number;
  front: string;
  back: string;
  category: string;
}

export default function FlashcardsPage() {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCards = async () => {
        const docId = localStorage.getItem("korp_current_doc_id");
        if (!docId) {
            setError("No document selected.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:8000/api/quiz/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ doc_id: docId, num_questions: 10, mode: "flashcard" })
            });

            if (!response.ok) throw new Error("Failed to generate flashcards");
            const data = await response.json();
            
            if (data.status === "success") {
                const mappedCards = (data.questions || []).map((q: any, i: number) => ({
                    id: i + 1,
                    front: q.front || q.question,
                    back: q.back || q.answer || q.explanation,
                    category: q.category || "General"
                }));
                setCards(mappedCards);
            } else {
                setError(data.message || "Tiki couldn't find concepts to recall.");
            }
        } catch (err) {
            console.error("Error fetching flashcards:", err);
            setError("Connection error. Is the backend running?");
        } finally {
            setIsLoading(false);
        }
    };

    fetchCards();
  }, []);

  const handleNext = () => {
    if (cards.length === 0) return;
    setDirection(1);
    setIsFlipped(false);
    setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 200);
  };

  const handlePrev = () => {
    if (cards.length === 0) return;
    setDirection(-1);
    setIsFlipped(false);
    setTimeout(() => {
        setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }, 200);
  };

  if (isLoading) {
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
                <h2 className="text-xl font-bold text-stone-800">Tiki is shuffling your deck...</h2>
                <p className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.4em] animate-pulse">Generating recall cards</p>
            </div>
        </div>
    );
  }

  if (error || cards.length === 0) {
    return (
        <div className="max-w-xl mx-auto py-20 px-6 text-center space-y-8">
            <div className="bg-white p-12 rounded-[40px] border border-stone-200 shadow-xl space-y-6">
                <div className="w-24 h-24 mx-auto mb-4 overflow-hidden">
                    <Image src="/mascot/mascot-sad.jpg" alt="Sad Tiki" width={100} height={100} className="object-contain" />
                </div>
                <h2 className="text-2xl font-bold text-stone-800">{error || "No flashcards found."}</h2>
                <Link href="/upload" className="inline-flex h-14 px-10 bg-indigo-600 text-white rounded-2xl font-bold items-center justify-center shadow-lg">
                    Upload a Document
                </Link>
            </div>
        </div>
    );
  }

  const card = cards[currentIndex];

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-600 uppercase tracking-[0.2em]">
            <Layers className="w-3.5 h-3.5" /> Space Repetition Deck
          </div>
          <h1 className="text-3xl font-black tracking-tight text-stone-900">Active Recall</h1>
        </div>
        <div className="flex items-center gap-4 bg-white p-2.5 pr-8 rounded-2xl border border-stone-200 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center">
                <Box className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Mastery Deck</p>
                <div className="flex items-center gap-2">
                    <p className="text-lg font-black text-stone-900">{currentIndex + 1}</p>
                    <span className="text-xs font-bold text-stone-300">/ {cards.length}</span>
                </div>
            </div>
        </div>
      </header>

      <div className="relative h-[480px] w-full max-w-2xl mx-auto perspective-1000">
        <AnimatePresence mode="wait" custom={direction}>
            <motion.div
                key={currentIndex}
                custom={direction}
                initial={{ x: direction * 100, opacity: 0, scale: 0.9, rotateY: direction * 20 }}
                animate={{ x: 0, opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ x: direction * -100, opacity: 0, scale: 0.9, rotateY: direction * -20 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
                className="w-full h-full relative"
            >
                <div 
                    className={`w-full h-full transition-all duration-700 transform-gpu preserve-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
                    onClick={() => setIsFlipped(!isFlipped)}
                >
                    {/* Front */}
                    <div className="absolute inset-0 backface-hidden bg-white rounded-[48px] border border-stone-200 flex flex-col items-center justify-center p-12 text-center shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] overflow-hidden">
                        <div className="absolute top-0 right-0 p-10">
                             <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-50 border border-stone-100 text-[10px] font-black uppercase tracking-widest text-stone-500">
                                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> {card.category}
                             </div>
                        </div>
                        <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mb-10 border border-indigo-100 rotate-3 group-hover:rotate-6 transition-transform">
                            <Brain className="w-10 h-10 text-indigo-600" />
                        </div>
                        <h2 className="text-3xl font-bold leading-tight tracking-tight text-stone-800 max-w-md">{card.front}</h2>
                        <div className="mt-16 flex items-center gap-4 text-[10px] font-black text-stone-300 uppercase tracking-[0.3em] bg-stone-50/50 px-6 py-3 rounded-2xl border border-stone-100/50">
                            <RotateCw className="w-4 h-4 animate-spin-slow" /> Tap to reveal answer
                        </div>
                    </div>

                    {/* Back */}
                    <div className="absolute inset-0 backface-hidden rotate-y-180 bg-indigo-600 rounded-[48px] border-4 border-white/20 flex flex-col items-center justify-center p-12 text-center shadow-[0_30px_60px_-15px_rgba(79,70,229,0.3)] text-white">
                        <div className="absolute top-0 left-0 p-10 opacity-20">
                            <Image src="/mascot/mascot-hi.jpg" alt="Tiki" width={80} height={80} className="rounded-full grayscale invert" />
                        </div>
                        <Sparkles className="w-16 h-16 text-amber-300 mb-10 opacity-50" />
                        <h2 className="text-3xl font-black leading-tight tracking-tight max-w-md">{card.back}</h2>
                        <div className="mt-16 flex items-center gap-2.5 text-[10px] font-black text-indigo-200 uppercase tracking-widest bg-white/10 px-6 py-3 rounded-2xl border border-white/10 backdrop-blur-sm">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Verified Concept
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center gap-8 py-4">
        <button 
            onClick={handlePrev}
            className="w-20 h-20 bg-white border border-stone-200 rounded-3xl flex items-center justify-center text-stone-400 hover:text-stone-900 transition-all hover:scale-110 active:scale-95 shadow-sm"
        >
            <ArrowLeft className="w-8 h-8" />
        </button>
        <button 
            onClick={handleNext}
            className="h-20 px-16 bg-stone-900 text-white rounded-3xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-stone-200 active:scale-95 flex items-center gap-4 group"
        >
            Deepen Knowledge <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <footer className="flex justify-center gap-12 pt-6">
        <Link href="/quiz" className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-stone-400 hover:text-indigo-600 transition-colors">
            <Zap className="w-5 h-5" /> Mastery Test
        </Link>
        <div className="w-px h-6 bg-stone-200" />
        <Link href="/study-book" className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-stone-400 hover:text-indigo-600 transition-colors">
            <TrendingUp className="w-5 h-5" /> Knowledge Map
        </Link>
      </footer>
    </div>
  );
}
