"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Network, 
  Sparkles, 
  Map as MapIcon, 
  Compass, 
  Maximize2, 
  Layers,
  Info,
  ArrowRight,
  Zap,
  TrendingUp
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

interface Concept {
    name: string;
    description: string;
    importance: string;
    type: string;
    x?: number;
    y?: number;
}

interface Relationship {
    source: string;
    target: string;
    type: string;
}

export default function ConceptsPage() {
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchGraph = async () => {
        const docId = localStorage.getItem("korp_current_doc_id");
        if (!docId) {
            setError("No document selected.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:8000/api/concepts/extract", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ doc_id: docId })
            });

            if (!response.ok) throw new Error("Failed to extract concepts");
            const data = await response.json();
            
            if (data.status === "success") {
                const nodes = data.concepts.map((c: any) => ({
                    ...c,
                    x: 50 + Math.random() * 700,
                    y: 50 + Math.random() * 400
                }));
                setConcepts(nodes);
                setRelationships(data.relationships || []);
            } else {
                setError(data.message || "Tiki couldn't map the concepts.");
            }
        } catch (err) {
            console.error("Error fetching graph:", err);
            setError("Connection error. Is the backend running?");
        } finally {
            setIsLoading(false);
        }
    };

    fetchGraph();
  }, []);

  const selectedConcept = concepts.find(c => c.name === selected);

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
                <h2 className="text-xl font-bold text-stone-800">Tiki is mapping your knowledge...</h2>
                <p className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.4em] animate-pulse">Building interactive graph</p>
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
    <div className="p-8 max-w-7xl mx-auto space-y-10 relative h-[calc(100vh-100px)] flex flex-col min-h-[800px]">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-600 uppercase tracking-[0.2em] mb-1">
            <Network className="w-3.5 h-3.5" /> Concept Mapping
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">Knowledge Graph</h1>
        </div>
        <div className="flex items-center gap-3">
            <div className="px-5 py-2.5 rounded-2xl border border-stone-200 bg-white text-[10px] font-bold uppercase tracking-widest text-stone-500 shadow-sm flex items-center gap-2">
                <Compass className="w-4 h-4 text-indigo-600" /> Multi-Layered Analysis
            </div>
            <button className="h-12 px-5 bg-white rounded-2xl text-xs font-bold flex items-center gap-2 border border-stone-200 text-stone-500 hover:bg-stone-50 transition-all shadow-sm">
                <Maximize2 className="w-4 h-4" />
            </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row gap-8 min-h-0">
        {/* Graph Canvas */}
        <div ref={containerRef} className="flex-1 bg-white rounded-[48px] relative overflow-hidden border border-stone-200 group shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)]">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]" />
            
            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                {relationships.map((rel, idx) => {
                    const sourceNode = concepts.find(n => n.name === rel.source);
                    const targetNode = concepts.find(n => n.name === rel.target);
                    if (!sourceNode || !targetNode || sourceNode.x === undefined || sourceNode.y === undefined || targetNode.x === undefined || targetNode.y === undefined) return null;

                    return (
                        <motion.line
                            key={`rel-${idx}`}
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 0.2 }}
                            transition={{ duration: 1.5, delay: 0.5 }}
                            x1={sourceNode.x + 40}
                            y1={sourceNode.y + 40}
                            x2={targetNode.x + 40}
                            y2={targetNode.y + 40}
                            stroke="#4f46e5"
                            strokeWidth="1.5"
                            strokeDasharray="4 4"
                        />
                    );
                })}
            </svg>

            <AnimatePresence>
                {concepts.map((concept, i) => (
                    <motion.button
                        key={concept.name}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: i * 0.05, type: "spring", stiffness: 100 }}
                        whileHover={{ scale: 1.1, zIndex: 10 }}
                        onClick={() => setSelected(concept.name)}
                        className={`absolute w-20 h-20 rounded-2xl cursor-pointer transition-all shadow-lg flex items-center justify-center border-2 ${selected === concept.name ? 'bg-indigo-600 text-white border-white scale-110' : 'bg-white text-stone-600 border-stone-100 hover:border-indigo-200 group-hover:opacity-80'}`}
                        style={{ left: concept.x, top: concept.y }}
                    >
                        <div className="flex flex-col items-center">
                            <Sparkles className={`w-5 h-5 mb-1 ${selected === concept.name ? 'text-amber-300' : 'text-indigo-400'}`} />
                            <span className="text-[8px] font-bold uppercase truncate w-16 px-1">{concept.name}</span>
                        </div>
                    </motion.button>
                ))}
            </AnimatePresence>

            <div className="absolute bottom-8 left-8 flex items-center gap-6 text-[9px] font-bold uppercase tracking-widest text-stone-400 bg-white/80 backdrop-blur-sm px-5 py-3 rounded-2xl border border-stone-100">
                <div className="flex items-center gap-2 font-black"><div className="w-2.5 h-2.5 rounded-full bg-indigo-600" /> Concept</div>
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Core</div>
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Relative</div>
            </div>
        </div>

        {/* Info Panel */}
        <div className="w-full lg:w-96 shrink-0 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
            <AnimatePresence mode="wait">
                {selectedConcept ? (
                    <motion.div
                        key={selectedConcept.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="bg-white p-8 rounded-[40px] flex-1 space-y-8 border border-stone-200 shadow-xl"
                    >
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100">
                                    <Sparkles className="w-6 h-6 text-indigo-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-stone-800 leading-tight">{selectedConcept.name}</h2>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1.5 rounded-xl bg-stone-100 border border-stone-200 text-[10px] font-bold uppercase tracking-widest text-stone-600">{selectedConcept.type}</span>
                                <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                                    <TrendingUp className="w-3.5 h-3.5" /> {selectedConcept.importance} Priority
                                </span>
                            </div>
                            <p className="text-base text-stone-600 leading-relaxed font-medium">
                                {selectedConcept.description}
                            </p>
                        </div>

                        <div className="space-y-4 pt-8 border-t border-stone-100">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-stone-400 flex items-center gap-2">
                                <Layers className="w-3.5 h-3.5" /> Related Connections
                            </h3>
                            <div className="space-y-3">
                                {relationships.filter(r => r.source === selectedConcept.name || r.target === selectedConcept.name).map((rel, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-stone-50 border border-stone-100 group/rel hover:bg-indigo-50 hover:border-indigo-100 transition-all">
                                        <div className="flex flex-col">
                                            <span className="text-[8px] font-bold uppercase text-stone-400 group-hover/rel:text-indigo-400">{rel.type}</span>
                                            <span className="text-sm font-bold text-stone-700 group-hover/rel:text-indigo-900">{rel.source === selectedConcept.name ? rel.target : rel.source}</span>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-stone-300 group-hover/rel:text-indigo-600" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Link 
                           href="/study-book"
                           className="w-full h-16 bg-indigo-600 text-white rounded-3xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-indigo-100 hover:scale-105 active:scale-95 transition-all"
                        >
                            Read Full Chapter <ArrowRight className="w-5 h-5" />
                        </Link>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white p-10 rounded-[40px] flex-1 flex flex-col items-center justify-center text-center space-y-8 border border-stone-200 shadow-sm"
                    >
                        <div className="w-24 h-24 bg-stone-50 rounded-full flex items-center justify-center border border-stone-100">
                            <MapIcon className="w-12 h-12 text-stone-300" />
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-xl font-bold text-stone-800">Select a concept node</h3>
                            <p className="text-sm text-stone-500 font-medium px-4 leading-relaxed">
                                Interact with the knowledge nodes to visualize relationships and reveal deep insights.
                            </p>
                        </div>
                        <div className="pt-8 w-full border-t border-stone-50">
                             <div className="flex items-center justify-center gap-4">
                                <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100">
                                    <Zap className="w-5 h-5 text-amber-500" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">AI-Powered Relational Mapping</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
