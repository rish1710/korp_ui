"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, LogIn, Sparkles, Brain, Zap, ShieldCheck, Check, Star } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-transparent text-foreground font-sans relative overflow-hidden">
      {/* Background gradients managed by RootLayout + local additions */}
      <div className="pointer-events-none fixed inset-0 opacity-20">
        <div className="absolute inset-y-10 right-[-10%] w-[60%] rounded-[999px] bg-[radial-gradient(circle_at_20%_0%,var(--glow-color-1),transparent_65%),radial-gradient(circle_at_100%_40%,var(--glow-color-2),transparent_65%)] blur-[48px]" />
      </div>

      {/* Outer premium card */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8 sm:px-8">
        <div className="mx-auto w-full max-w-6xl rounded-[40px] premium-glass shadow-2xl flex flex-col overflow-hidden">
          
          {/* Top nav inside the glass card */}
          <header className="flex items-center justify-between px-8 py-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/40">
                <Brain className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight">KORP.ai</span>
                <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground font-bold">
                  Learning Studio
                </span>
              </div>
            </div>

            <nav className="hidden items-center gap-12 text-[10px] font-black text-muted-foreground md:flex uppercase tracking-[0.2em]">
              <Link href="#method" className="hover:text-primary transition-colors">Method</Link>
              <Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link>
              <Link href="#about" className="hover:text-primary transition-colors">About</Link>
            </nav>

            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="hidden items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary md:flex transition-colors"
              >
                <LogIn className="h-4 w-4" /> Log in
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs font-bold text-primary-foreground shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
              >
                Get Started
              </Link>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto no-scrollbar pt-12 pb-20 px-8">
            <div className="max-w-4xl mx-auto space-y-32">
              {/* Hero Section */}
              <section id="about" className="text-center space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Next-Gen Learning Interface
                </motion.div>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.1]"
                >
                  Master anything with <br />
                  <span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">AI-Grounded Precision.</span>
                </motion.h1>

                <motion.p 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.2 }}
                  className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
                >
                  KORP transformed your scattered PDFs into a unified intelligence workspace. 
                  Explorable graphs, instant quizzes, and predictive exam insights.
                </motion.p>

                <motion.div 
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ delay: 0.3 }}
                  className="flex flex-wrap items-center justify-center gap-4 pt-4"
                >
                    <Link href="/upload" className="h-14 px-8 rounded-2xl bg-foreground text-background font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-2xl active:scale-95">
                        Start Uploading <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link href="/dashboard" className="h-14 px-8 rounded-2xl bg-white/5 border border-white/10 font-bold flex items-center gap-2 hover:bg-white/10 transition-all active:scale-95">
                        View Workspace
                    </Link>
                </motion.div>
              </section>

              {/* Feature Highlights */}
              <section id="method" className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: "Unified Ingestion", desc: "PDFs, PPTX, and Notes in one workspace. No synthetic data.", icon: ShieldCheck, color: "text-blue-500" },
                  { title: "Visual Synthesis", desc: "Real knowledge mapping from your own documents.", icon: Brain, color: "text-emerald-500" },
                  { title: "Exam Mastery", desc: "AI-predicted questions based on your specific curriculum.", icon: Zap, color: "text-amber-500" }
                ].map((feature, i) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="p-8 rounded-[32px] bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
                  >
                    <feature.icon className={`w-8 h-8 ${feature.color} mb-6`} />
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                  </motion.div>
                ))}
              </section>

              {/* Pricing Table Section */}
              <section id="pricing" className="space-y-12">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl font-bold tracking-tight">Flexible Learning Plans</h2>
                    <p className="text-muted-foreground">Choose the scale of your intelligence workspace.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Free Plan */}
                    <motion.div 
                        whileHover={{ y: -5 }}
                        className="p-10 rounded-[40px] premium-glass border border-white/5 flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h3 className="text-xl font-bold">Standard</h3>
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">For casual learners</p>
                                </div>
                                <span className="text-3xl font-black">$0</span>
                            </div>
                            <ul className="space-y-4">
                                {[
                                    "Up to 5 PDFs / month",
                                    "Basic Knowledge Graphs",
                                    "Standard AI Summaries",
                                    "7-day history retention"
                                ].map(benefit => (
                                    <li key={benefit} className="flex items-center gap-3 text-sm font-medium">
                                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                            <Check className="w-3 h-3" />
                                        </div>
                                        {benefit}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <button className="w-full mt-10 h-14 rounded-2xl bg-white/5 border border-white/10 font-bold hover:bg-white/10 transition-all active:scale-95">
                            Get Started
                        </button>
                    </motion.div>

                    {/* Pro Plan */}
                    <motion.div 
                        whileHover={{ y: -5 }}
                        className="p-10 rounded-[40px] bg-primary text-primary-foreground relative overflow-hidden flex flex-col justify-between"
                    >
                        <div className="absolute top-0 right-0 p-6">
                            <Star className="w-6 h-6 text-primary-foreground/20 fill-current" />
                        </div>
                        <div>
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h3 className="text-xl font-bold">Researcher</h3>
                                    <p className="text-xs font-bold text-primary-foreground/60 uppercase tracking-widest mt-1">For serious mastery</p>
                                </div>
                                <span className="text-3xl font-black">$19<span className="text-sm opacity-60">/mo</span></span>
                            </div>
                            <ul className="space-y-4">
                                {[
                                    "Unlimited PDF & PPTX Ingestion",
                                    "Advanced Knowledge Mapping",
                                    "Exam Prediction Engine",
                                    "Interactive 3D Study Boards",
                                    "PDF Annotation Sync"
                                ].map(benefit => (
                                    <li key={benefit} className="flex items-center gap-3 text-sm font-semibold">
                                        <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                                            <Check className="w-3 h-3" />
                                        </div>
                                        {benefit}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <button className="w-full mt-10 h-14 rounded-2xl bg-white text-primary font-bold hover:bg-white/90 transition-all active:scale-95 shadow-xl shadow-black/20 text-black">
                            Go Pro Now
                        </button>
                    </motion.div>
                </div>
              </section>
            </div>
          </main>

          <footer className="px-8 py-6 border-t border-white/5 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <span>© 2026 KORP AI • Advanced Agentic Coding</span>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-primary">Privacy</Link>
              <Link href="#" className="hover:text-primary">Terms</Link>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
