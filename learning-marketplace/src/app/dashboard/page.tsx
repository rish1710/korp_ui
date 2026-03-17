"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  BookOpen, 
  Brain, 
  Zap, 
  Clock, 
  Plus, 
  ArrowRight, 
  Sparkles, 
  TrendingUp,
  Files,
  Network,
  Target,
  FileBadge,
  Layers,
  Eye,
  Settings,
  MessageSquare,
  Compass
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const stats = [
  { label: "Active Notebooks", value: "12", icon: BookOpen, color: "text-blue-500", bg: "bg-blue-50" },
  { label: "Mastery Level", value: "84%", icon: Brain, color: "text-emerald-500", bg: "bg-emerald-50" },
  { label: "Quick Sessions", value: "48", icon: Zap, color: "text-amber-500", bg: "bg-amber-50" },
  { label: "Study Time", value: "24h", icon: Clock, color: "text-indigo-500", bg: "bg-indigo-50" },
];

const mainApps = [
    { name: "Study Book", href: "/study-book", icon: BookOpen, color: "text-blue-500", desc: "Full curriculum" },
    { name: "Quick Learn", href: "/quick-learn", icon: Zap, color: "text-amber-500", desc: "Rapid mastery" },
    { name: "Knowledge Graph", href: "/concepts", icon: Network, color: "text-emerald-500", desc: "Visual paths" },
    { name: "Quiz Master", href: "/quiz", icon: Target, color: "text-rose-500", desc: "Test yourself" },
    { name: "Ask AI", href: "/ask-ai", icon: MessageSquare, color: "text-indigo-500", desc: "Interactive chat" },
    { name: "Predicted", href: "/predicted-questions", icon: Sparkles, color: "text-indigo-500", desc: "Exam forecasts" },
    { name: "Flashcards", href: "/flashcards", icon: Layers, color: "text-purple-500", desc: "Active recall" },
    { name: "Cheat Sheets", href: "/cheat-sheets", icon: FileBadge, color: "text-sky-500", desc: "One-pagers" },
    { name: "Focus Mode", href: "/focus-mode", icon: Eye, color: "text-slate-500", desc: "Deep work" },
];

const recentNotebooks = [
  { id: 1, name: "Molecular Biology", lastEdited: "2 hours ago", progress: 75, color: "bg-indigo-500" },
  { id: 2, name: "Macroeconomics 101", lastEdited: "Yesterday", progress: 45, color: "bg-blue-500" },
  { id: 3, name: "Ancient History", lastEdited: "3 days ago", progress: 90, color: "bg-emerald-500" },
];

export default function DashboardPage() {
  const [currentFile, setCurrentFile] = useState<string | null>(null);

  useEffect(() => {
    const filename = localStorage.getItem("korp_current_filename");
    if (filename) setCurrentFile(filename);
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-stone-900">Dashboard</h1>
          <div className="text-sm text-stone-500 font-medium h-6">
            {currentFile ? (
                <span className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Active Case: <span className="text-indigo-600 font-black">{currentFile}</span>
                </span>
            ) : (
                "Welcome back, researcher. Your learning ecosystem is ready."
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
            <button className="h-12 w-12 rounded-2xl bg-white border border-stone-200 shadow-sm flex items-center justify-center text-stone-400 hover:bg-stone-50 transition-all">
                <Settings className="w-5 h-5" />
            </button>
            <Link href="/upload" className="bg-indigo-600 text-white h-14 px-8 rounded-3xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-indigo-100 active:scale-95">
                <Plus className="w-5 h-5" /> New Material
            </Link>
        </div>
      </header>

      {/* Main Apps Grid */}
      <section className="space-y-8">
        <div className="flex items-center gap-3 px-2">
            <div className="h-8 w-8 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center">
                <LayoutDashboard className="w-4 h-4 text-indigo-600" />
            </div>
            <h2 className="text-xl font-black text-stone-900 tracking-tight">Main Intelligence Modules</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {mainApps.map((app, i) => (
                <Link key={app.name} href={app.href} className="group">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-white p-7 rounded-[40px] border border-stone-200 transition-all group-hover:border-indigo-200 group-hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] active:scale-95 flex flex-col items-center text-center gap-5 relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-stone-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className={`w-16 h-16 rounded-3xl flex items-center justify-center bg-stone-50 group-hover:bg-indigo-50 transition-colors border border-stone-100 group-hover:border-indigo-100`}>
                            <app.icon className={`w-8 h-8 ${app.color} transition-transform group-hover:scale-110`} />
                        </div>
                        <div>
                            <h3 className="font-black text-sm text-stone-800 tracking-tight">{app.name}</h3>
                            <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mt-1 group-hover:text-indigo-600 transition-colors">{app.desc}</p>
                        </div>
                    </motion.div>
                </Link>
            ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Recent Notebooks & Stats */}
        <div className="lg:col-span-2 space-y-12">
             {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        className="bg-white p-6 rounded-[32px] flex flex-col gap-4 border border-stone-200 shadow-sm"
                    >
                        <div className="flex items-center justify-between">
                            <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">+12%</span>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-stone-400 uppercase tracking-[0.2em]">{stat.label}</p>
                            <h3 className="text-2xl font-black text-stone-900 mt-1">{stat.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="space-y-8">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-xl font-black text-stone-900 tracking-tight flex items-center gap-3">
                        <Files className="w-6 h-6 text-indigo-600" /> Grounded Research
                    </h2>
                    <Link href="#" className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline flex items-center gap-2">
                        View All Archives <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {recentNotebooks.map((notebook, i) => (
                    <motion.div
                        key={notebook.id}
                        className="bg-white p-8 rounded-[40px] group cursor-pointer border border-stone-200 hover:border-indigo-200 transition-all shadow-sm hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)]"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div className={`w-12 h-12 rounded-2xl bg-stone-50 flex items-center justify-center border border-stone-100 group-hover:bg-indigo-50 transition-colors`}>
                                <BookOpen className="w-6 h-6 text-stone-400 group-hover:text-indigo-600" />
                            </div>
                            <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest bg-stone-50 px-3 py-1.5 rounded-xl">{notebook.lastEdited}</span>
                        </div>
                        <h3 className="text-xl font-black text-stone-800 group-hover:text-indigo-600 transition-colors leading-tight">{notebook.name}</h3>
                        <div className="mt-10 space-y-3">
                            <div className="flex justify-between text-[10px] font-black text-stone-400 uppercase tracking-widest">
                                <span>Synaptic Mastery</span>
                                <span className="text-stone-900">{notebook.progress}%</span>
                            </div>
                            <div className="h-2 w-full bg-stone-50 rounded-full overflow-hidden border border-stone-100">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${notebook.progress}%` }}
                                    className={`h-full bg-indigo-600 rounded-full shadow-[0_0_15px_-3px_rgba(79,70,229,0.5)]`} 
                                />
                            </div>
                        </div>
                    </motion.div>
                    ))}
                </div>
            </div>
        </div>

        {/* Sidebar Insights */}
        <div className="space-y-10">
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 p-10 rounded-[48px] shadow-[0_30px_60px_-15px_rgba(79,70,229,0.3)] flex flex-col min-h-[420px] relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-[80px]" />
                <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-indigo-500/20 rounded-full blur-[100px]" />
                
                <div className="relative z-10 flex-1 space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl group-hover:scale-110 transition-transform">
                            <Image src="/mascot/mascot-hi.jpg" alt="Tiki" width={64} height={64} className="object-cover" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white tracking-tight">Tiki's Protocol</h2>
                            <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">AI Strategist</p>
                        </div>
                    </div>
                    <p className="text-sm leading-relaxed text-indigo-50 font-medium">
                        "Your performance in <span className="text-white font-black underline decoration-amber-400 underline-offset-4">Cellular Biology</span> is exceptional. I suggest a 20-minute focus session on Macroeconomics today to maintain your streak!"
                    </p>
                </div>
                
                <Link href="/focus-mode" className="relative z-10 w-full mt-10 h-16 bg-white text-indigo-600 rounded-3xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 hover:scale-105 active:scale-95 shadow-2xl">
                    Initiate Deep Work <Compass className="w-5 h-5" />
                </Link>
            </div>

            <div className="space-y-6">
                <h2 className="text-xl font-black text-stone-900 tracking-tight px-2 flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-emerald-500" /> High Yield Topics
                </h2>
                <div className="space-y-3">
                    {["Cellular Respiration", "Keynesian Cycles", "Medieval Trade Paths"].map((topic) => (
                        <div key={topic} className="flex items-center justify-between p-5 bg-white rounded-2xl hover:bg-stone-50 transition-all cursor-pointer border border-stone-200 group shadow-sm">
                            <span className="text-sm font-bold text-stone-700 group-hover:text-indigo-600 transition-colors">{topic}</span>
                            <div className="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                                <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-indigo-600 transition-all" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
