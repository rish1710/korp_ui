"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Eye, 
  Timer, 
  Settings, 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles,
  Maximize2,
  Wind,
  Coffee,
  X,
  Volume2
} from "lucide-react";
import Image from "next/image";

export default function FocusModePage() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Play sound or notify
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggle = () => setIsActive(!isActive);
  const reset = () => {
    setIsActive(false);
    setTimeLeft(isBreak ? 5 * 60 : 25 * 60);
  };

  const setMode = (mode: "focus" | "break") => {
    setIsActive(false);
    setIsBreak(mode === "break");
    setTimeLeft(mode === "break" ? 5 * 60 : 25 * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-8 space-y-12 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <motion.div 
            animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.4, 0.3]
            }}
            transition={{ duration: 15, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-indigo-100 rounded-full blur-[180px]" 
        />
      </div>

      <header className="fixed top-10 left-10">
        <div className="flex items-center gap-3">
            <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white border border-stone-200 shadow-sm">
                <Eye className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
                <h1 className="text-xl font-black tracking-tight text-stone-900">KORP.focus</h1>
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.3em]">Deep Work Protocol</p>
            </div>
        </div>
      </header>

      <div className="relative flex flex-col items-center">
        {/* Mascot Presence */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-2xl"
        >
            <Image 
                src={isBreak ? "/mascot/mascot-celebrating.jpg" : isActive ? "/mascot/mascot-processing.jpg" : "/mascot/mascot-hi.jpg"} 
                alt="Tiki Focus" 
                fill 
                className="object-contain"
            />
        </motion.div>

        {/* Timer Container */}
        <div className="w-96 h-96 relative flex items-center justify-center bg-white rounded-full shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] border border-stone-100">
            <svg className="absolute inset-0 w-full h-full -rotate-90 scale-95">
                <circle 
                    cx="192" cy="192" r="180" 
                    className="stroke-stone-50 fill-none" 
                    strokeWidth="4"
                    strokeDasharray="1130"
                />
                <motion.circle 
                    cx="192" cy="192" r="180" 
                    className={`${isBreak ? 'stroke-emerald-500' : 'stroke-indigo-600'} fill-none`}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray="1130"
                    initial={{ strokeDashoffset: 1130 }}
                    animate={{ strokeDashoffset: 1130 - (1130 * (timeLeft / (isBreak ? 5 * 60 : 25 * 60))) }}
                    transition={{ duration: 1, ease: "linear" }}
                />
            </svg>
            <div className="text-center space-y-2 relative z-10">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-8xl font-black tracking-tighter tabular-nums text-stone-900"
                >
                    {formatTime(timeLeft)}
                </motion.div>
                <div className={`flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] ${isActive ? (isBreak ? 'text-emerald-500' : 'text-indigo-600') : 'text-stone-300'}`}>
                    {isActive ? <><Sparkles className="w-3.5 h-3.5" /> Flow Active</> : "Ready to focus"}
                </div>
            </div>
        </div>
      </div>

      <div className="flex items-center gap-8">
          <button 
            onClick={reset}
            className="w-16 h-16 bg-white rounded-2xl border border-stone-200 flex items-center justify-center text-stone-400 hover:text-stone-900 transition-all shadow-sm active:scale-95"
          >
              <RotateCcw className="w-6 h-6" />
          </button>
          <button 
            onClick={toggle}
            className={`w-32 h-32 rounded-full flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 shadow-2xl ${isActive ? 'bg-stone-900 text-white shadow-stone-200' : 'bg-indigo-600 text-white shadow-indigo-200'}`}
          >
              {isActive ? <Pause className="w-12 h-12 fill-current" /> : <Play className="w-12 h-12 fill-current ml-2" />}
          </button>
          <button 
            onClick={() => setShowSettings(true)}
            className="w-16 h-16 bg-white rounded-2xl border border-stone-200 flex items-center justify-center text-stone-400 hover:text-stone-900 transition-all shadow-sm active:scale-95"
          >
              <Settings className="w-6 h-6" />
          </button>
      </div>

      <div className="fixed bottom-12 flex items-center gap-2 px-3 py-3 bg-white/80 backdrop-blur-md rounded-3xl border border-stone-200 shadow-xl">
          <button 
            onClick={() => setMode("focus")}
            className={`flex items-center gap-2 px-6 py-4 rounded-2xl transition-all font-bold text-xs uppercase tracking-widest ${!isBreak ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-stone-400 hover:bg-stone-50'}`}
          >
              <Eye className="w-4 h-4" /> Focus
          </button>
          <button 
             onClick={() => setMode("break")}
             className={`flex items-center gap-2 px-6 py-4 rounded-2xl transition-all font-bold text-xs uppercase tracking-widest ${isBreak ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' : 'text-stone-400 hover:bg-stone-50'}`}
          >
              <Coffee className="w-4 h-4" /> Break
          </button>
          <div className="w-px h-10 bg-stone-200 mx-2" />
          <button className="p-4 rounded-2xl text-stone-400 hover:bg-stone-50 transition-all">
              <Volume2 className="w-5 h-5" />
          </button>
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
             <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-stone-900/10 backdrop-blur-sm"
             >
                <div className="w-full max-w-sm bg-white p-8 rounded-[40px] border border-stone-200 shadow-2xl space-y-8 relative">
                    <button onClick={() => setShowSettings(false)} className="absolute top-6 right-6 p-2 hover:bg-stone-50 rounded-xl text-stone-400"><X className="w-4 h-4" /></button>
                    <h2 className="text-xl font-bold text-stone-900">Protocol Config</h2>
                    <div className="space-y-4">
                        {[
                            { name: "Deep Work", time: "25:00", active: !isBreak },
                            { name: "Short Break", time: "05:00", active: isBreak },
                            { name: "Long Break", time: "15:00", active: false }
                        ].map(mode => (
                            <div key={mode.name} className={`flex items-center justify-between p-5 rounded-2xl border transition-all cursor-pointer ${mode.active ? 'bg-indigo-50 border-indigo-200' : 'bg-stone-50 border-stone-100'}`}>
                                <span className={`font-bold ${mode.active ? 'text-indigo-900' : 'text-stone-600'}`}>{mode.name}</span>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${mode.active ? 'text-indigo-600' : 'text-stone-400'}`}>{mode.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
             </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
