"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  X, 
  MessageSquare, 
  Brain, 
  Paperclip,
  Maximize2,
  Globe,
  ShieldCheck,
  Zap,
  MoreVertical,
  History
} from "lucide-react";
import Image from "next/image";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AskAIPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "I've ingested your latest archives. My neural network is ready to answer any questions about the material. What's on your mind?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [filename, setFilename] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedFilename = localStorage.getItem("korp_current_filename");
    if (storedFilename) setFilename(storedFilename);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const docId = localStorage.getItem("korp_current_doc_id");
    const userMsg = { role: "user" as const, content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
        const response = await fetch("http://127.0.0.1:8000/api/rag/query", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: input, doc_id: docId })
        });
        
        if (!response.ok) throw new Error("RAG query failed");
        const data = await response.json();
        
        const assistantMsg = { 
            role: "assistant" as const, 
            content: data.answer || data.response || "I could not find a definitive answer in the ingested documents."
        };
        setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
        console.error("RAG error:", error);
        setMessages(prev => [...prev, { role: "assistant", content: "Connection to the knowledge base was interrupted. Please check your ingestion status." }]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] max-w-6xl mx-auto p-4 md:p-8 space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">
            <Globe className="w-3.5 h-3.5" /> Neural Link Active
          </div>
          <h1 className="text-3xl font-black tracking-tight text-stone-900">Consult Tiki</h1>
        </div>
        <div className="flex items-center gap-3">
            <div className="px-5 py-2.5 rounded-2xl bg-white border border-stone-200 flex items-center gap-3 shadow-sm transition-all hover:border-indigo-200">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                   <Paperclip className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Grounded In</span>
                    <span className="text-xs font-bold text-stone-700 truncate max-w-[150px]">{filename || "Global Core"}</span>
                </div>
            </div>
            <button className="p-3 rounded-2xl bg-white border border-stone-200 text-stone-400 hover:text-stone-900 hover:border-stone-400 transition-all shadow-sm">
                <History className="w-5 h-5" />
            </button>
        </div>
      </header>

      <div className="flex-1 bg-white rounded-[56px] border border-stone-200 flex flex-col overflow-hidden relative shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-[100px] -mr-32 -mt-32 opacity-40 pointer-events-none" />
        
        {/* Messages */}
        <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-8 md:p-12 space-y-8 no-scrollbar scroll-smooth"
        >
            {messages.map((m, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-start gap-4 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                    <div className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-sm border-2 ${m.role === 'assistant' ? 'bg-indigo-600 border-indigo-200' : 'bg-white border-stone-200'}`}>
                        {m.role === 'assistant' ? (
                             <div className="relative w-full h-full p-2">
                                <Image src="/mascot/mascot-hi.jpg" alt="Tiki" fill className="object-cover rounded-xl" />
                             </div>
                        ) : (
                            <User className="w-6 h-6 text-stone-400" />
                        )}
                    </div>
                    
                    <div className={`max-w-[80%] space-y-2 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                        <div className={`inline-block px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] ${m.role === 'user' ? 'bg-stone-100 text-stone-500' : 'bg-indigo-50 text-indigo-600'}`}>
                            {m.role === 'assistant' ? 'Tiki Intelligent Node' : 'User Identity'}
                        </div>
                        <div className={`p-7 rounded-[32px] text-base leading-relaxed font-medium shadow-sm border ${m.role === 'user' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-stone-50 text-stone-800 border-stone-200'}`}>
                            {m.content}
                        </div>
                    </div>
                </motion.div>
            ))}
            
            {isLoading && (
                <div className="flex flex-row items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 border-2 border-indigo-200 flex-shrink-0 flex items-center justify-center shadow-sm relative overflow-hidden">
                        <Image src="/mascot/mascot-processing.jpg" alt="Tiki" fill className="object-cover p-2" />
                    </div>
                    <div className="space-y-2">
                        <div className="inline-block px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] bg-indigo-50 text-indigo-600">
                             Neural Search in Progress
                        </div>
                        <div className="p-7 rounded-[32px] bg-stone-50 border border-stone-200 flex items-center gap-4">
                            <div className="flex gap-1.5">
                                <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 bg-indigo-600 rounded-full" />
                                <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2 h-2 bg-indigo-600 rounded-full" />
                                <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2 h-2 bg-indigo-600 rounded-full" />
                            </div>
                            <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Consulting Knowledge Lattice...</span>
                        </div>
                    </div>
                </div>
            )}
        </div>

        {/* Input area */}
        <div className="p-8 md:p-10 bg-white border-t border-stone-100 relative">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-6 py-2 bg-white rounded-2xl border border-stone-100 shadow-xl flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Direct Synaptic Privacy Enabled</span>
            </div>
            
            <div className="flex items-center gap-4 bg-stone-50 p-3 pl-8 rounded-[36px] border-2 border-stone-100 focus-within:border-indigo-300 focus-within:bg-white transition-all shadow-inner group">
                <input 
                    type="text" 
                    placeholder="Inquire about your archives..."
                    className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-lg font-bold py-3 text-stone-800 placeholder:text-stone-300"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <div className="flex items-center gap-2">
                    <button className="w-12 h-12 rounded-2xl text-stone-400 hover:text-stone-900 transition-colors flex items-center justify-center">
                         <Paperclip className="w-6 h-6" />
                    </button>
                    <button 
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className={`h-16 w-16 rounded-[24px] flex items-center justify-center transition-all shadow-2xl active:scale-95 disabled:opacity-50 ${!input.trim() || isLoading ? 'bg-stone-200 text-stone-400' : 'bg-indigo-600 text-white shadow-indigo-200 hover:scale-105'}`}
                    >
                        <Send className="w-7 h-7" />
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
