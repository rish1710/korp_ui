"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Snowfall } from "@/components/ui/snowfall";
import OrbitingSkills from "@/components/ui/orbiting-skills";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen bg-[#0d1117] flex overflow-hidden relative text-white">
      
      {/* ── Left panel: Orbiting Skills visual ── */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden p-12">
        {/* Background grid */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.08),transparent_70%)]" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, #374151 0%, transparent 50%), radial-gradient(circle at 75% 75%, #4B5563 0%, transparent 50%)' }} />
        
        <div className="relative z-10 text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-violet-500/30">K</div>
            <span className="text-2xl font-bold tracking-tight font-[family-name:var(--font-raleway)]">KORP</span>
          </div>
          <h2 className="text-3xl font-bold text-white leading-tight font-[family-name:var(--font-raleway)] mb-3">
            A multimodal<br />intelligence platform
          </h2>
          <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-xs mx-auto">
            Upload your PDFs, lectures, notes and let KORP build an intelligent knowledge graph from your materials.
          </p>
        </div>

        {/* Tiki Mascot */}
        <img src="/mascot/mascot-determined.jpg" alt="Tiki mascot" className="relative z-10 w-32 h-32 object-contain drop-shadow-2xl mb-4 rounded-2xl" />

        {/* The animated Orbiting Skills */}
        <div className="relative z-10 w-full max-w-[450px]">
          <OrbitingSkills />
        </div>

        <p className="relative z-10 text-xs text-slate-600 font-semibold mt-8 uppercase tracking-widest">
          Powered by LangGraph · ChromaDB · React
        </p>
      </div>

      {/* ── Right panel: Login form ── */}
      <div className="flex-1 flex items-center justify-center px-8 relative bg-stone-50">
        <Snowfall />
        
        {/* Light Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-gradient-to-r from-violet-200 via-cyan-100 to-emerald-100 rounded-full blur-[100px] opacity-60" />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="w-full max-w-md relative z-10">
          
          {/* Mobile logo only */}
          <div className="flex items-center justify-center gap-2.5 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-md">K</div>
            <span className="text-2xl font-bold tracking-tight text-slate-900 font-[family-name:var(--font-raleway)]">KORP</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-center mb-1 text-slate-800 font-[family-name:var(--font-raleway)]">{isLogin ? "Welcome back" : "Create account"}</h2>
            <p className="text-sm text-slate-500 text-center mb-8 font-medium">{isLogin ? "Sign in to your workspace" : "Start building your knowledge"}</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="text-xs text-slate-500 mb-1.5 block font-bold uppercase tracking-wider">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 transition-all shadow-sm font-medium" />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-500 mb-1.5 block font-bold uppercase tracking-wider">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 transition-all shadow-sm font-medium" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button type="submit"
                className="w-full h-12 bg-slate-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg mt-2 active:scale-[0.98]">
                {isLogin ? "Sign In" : "Create Account"} <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <p className="text-sm text-slate-500 text-center mt-8 font-medium">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button onClick={() => setIsLogin(!isLogin)} className="text-violet-600 hover:text-violet-700 font-bold transition-colors">
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>

          <p className="text-xs text-slate-400 text-center mt-6 font-medium">© 2026 KORP AI. Bright new ideas.</p>
        </motion.div>
      </div>
    </div>
  );
}
