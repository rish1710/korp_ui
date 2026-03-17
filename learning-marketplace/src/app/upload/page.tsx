"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload as UploadIcon, 
  FileText, 
  Youtube, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  X, 
  CheckCircle2, 
  ArrowRight,
  CloudUpload,
  Info,
  Brain,
  Zap,
  BookOpen,
  Sparkles,
  ShieldCheck,
  Globe,
  Video
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Step = "upload" | "selection";

export default function UploadPage() {
  const [step, setStep] = useState<Step>("upload");
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const startUpload = async () => {
    if (files.length === 0) return;
    
    setIsUploading(true);
    setUploadProgress(10);
    
    try {
        const formData = new FormData();
        files.forEach(file => formData.append("file", file));
        
        const response = await fetch("http://127.0.0.1:8000/api/ingest", {
            method: "POST",
            body: formData,
        });
        
        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.detail || errData.error || `Ingestion failed with status ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.doc_id) {
            localStorage.setItem("korp_current_doc_id", data.doc_id);
            const displayFilename = Array.isArray(data.filenames) ? data.filenames.join(", ") : (data.filename || "Multiple Files");
            localStorage.setItem("korp_current_filename", displayFilename);
        }

        setUploadProgress(100);
        setIsCompleted(true);
        
        setTimeout(() => {
            setStep("selection");
        }, 1200);
    } catch (error) {
        console.error("Upload error:", error);
        alert("Failed to process document. Make sure the backend is running.");
        setIsUploading(false);
    }
  };

  const selectMode = (mode: "quick" | "comprehensive") => {
    if (mode === "quick") {
        router.push("/quick-learn");
    } else {
        router.push("/study-book");
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-12 relative min-h-[85vh] flex flex-col justify-center">
      <AnimatePresence mode="wait">
        {step === "upload" ? (
          <motion.div 
            key="upload-step"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="space-y-12"
          >
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-stone-100">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">
                    <Globe className="w-3.5 h-3.5" /> Neural Ingestion Gateway
                </div>
                <h1 className="text-4xl font-black tracking-tight text-stone-900">Feed the Intelligence</h1>
                <p className="text-base text-stone-500 font-medium">Upload research, nodes, or study material to ground Tiki's AI.</p>
              </div>
              <div className="flex items-center gap-3 bg-stone-50 px-5 py-2.5 rounded-2xl border border-stone-100">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">End-to-End Encrypted</span>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-10">
                <div 
                  className={`bg-white rounded-[56px] border-4 border-dashed border-stone-100 p-16 text-center transition-all hover:bg-stone-50/50 hover:border-indigo-200 active:scale-[0.99] cursor-pointer relative overflow-hidden group shadow-sm ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
                  onClick={() => !isUploading && document.getElementById('file-upload')?.click()}
                >
                  <input 
                    type="file" 
                    id="file-upload" 
                    className="hidden" 
                    onChange={handleFileChange} 
                    multiple 
                    accept=".pdf,.doc,.docx,.txt,.ppt,.pptx"
                  />
                  
                  <div className="w-24 h-24 bg-indigo-50 rounded-[32px] flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all border border-indigo-100 shadow-inner">
                      <CloudUpload className="w-12 h-12 text-indigo-600" />
                  </div>
                  <h3 className="text-2xl font-black text-stone-800 tracking-tight">Drop your archives here</h3>
                  <p className="text-sm text-stone-500 mt-3 font-medium">Standard research protocols: PDF, Word, slides or raw text</p>
                  
                  <div className="mt-12 flex items-center justify-center gap-6">
                      <div className="flex -space-x-3">
                          {[1, 2, 3].map(i => (
                              <div key={i} className="w-10 h-10 rounded-2xl border-4 border-white bg-stone-100 flex items-center justify-center shadow-sm">
                                  <FileText className="w-5 h-5 text-stone-400" />
                              </div>
                          ))}
                      </div>
                      <span className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] bg-stone-50 px-4 py-2 rounded-xl border border-stone-100">Select Local Files</span>
                  </div>
                </div>

                {files.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-4">
                        <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] flex items-center gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Queue for Ingestion ({files.length})
                        </h4>
                        <button onClick={() => setFiles([])} className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:underline">Flush Queue</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {files.map((file, i) => (
                        <div key={`${file.name}-${i}`} className="bg-white p-5 rounded-3xl flex items-center justify-between border border-stone-200 shadow-sm group">
                            <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-stone-50 rounded-xl flex items-center justify-center border border-stone-100 group-hover:bg-indigo-50 transition-colors">
                                <FileText className="w-6 h-6 text-stone-400 group-hover:text-indigo-600" />
                            </div>
                            <div className="max-w-[140px]">
                                <p className="text-sm font-black text-stone-800 truncate">{file.name}</p>
                                <p className="text-[10px] font-bold text-stone-400 uppercase">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            </div>
                            {!isUploading && (
                            <button onClick={() => removeFile(i)} className="p-2.5 hover:bg-rose-50 rounded-xl transition-colors text-stone-300 hover:text-rose-500">
                                <X className="w-5 h-5" />
                            </button>
                            )}
                        </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-10">
                  <div className="bg-white p-10 rounded-[48px] space-y-10 border border-stone-200 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-[60px] -mr-16 -mt-16 opacity-50" />
                      
                      <div className="space-y-4 relative z-10">
                          <div className="flex items-center gap-3">
                              <Info className="w-5 h-5 text-indigo-600" />
                              <h3 className="text-[11px] font-black uppercase tracking-widest text-stone-400">Streamed Sources</h3>
                          </div>
                          
                          <div className="space-y-4">
                            <button className="w-full h-16 px-6 rounded-2xl border border-stone-100 bg-stone-50 flex items-center justify-between opacity-50 cursor-not-allowed group">
                                <div className="flex items-center gap-4">
                                    <Video className="w-6 h-6 text-rose-500" />
                                    <span className="text-sm font-bold text-stone-500">YouTube Stream</span>
                                </div>
                                <div className="text-[9px] font-black text-stone-400 bg-stone-200/50 px-2 py-1 rounded-lg">BETA</div>
                            </button>
                            <button className="w-full h-16 px-6 rounded-2xl border border-stone-100 bg-stone-50 flex items-center justify-between opacity-50 cursor-not-allowed group">
                                <div className="flex items-center gap-4">
                                    <Globe className="w-6 h-6 text-blue-500" />
                                    <span className="text-sm font-bold text-stone-500">Resource Link</span>
                                </div>
                                <div className="text-[9px] font-black text-stone-400 bg-stone-200/50 px-2 py-1 rounded-lg">BETA</div>
                            </button>
                          </div>
                      </div>

                      <div className="relative z-10 space-y-6">
                        <button 
                            onClick={startUpload}
                            disabled={files.length === 0 || isUploading}
                            className={`w-full h-20 rounded-[32px] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-4 transition-all active:scale-95 shadow-2xl relative overflow-hidden ${isUploading || files.length === 0 ? 'bg-stone-100 text-stone-400 cursor-not-allowed' : 'bg-indigo-600 text-white shadow-indigo-200'}`}
                        >
                            {isUploading ? (
                                <div className="flex flex-col items-center gap-2 w-full px-8">
                                    <div className="flex justify-between w-full mb-1">
                                        <span className="text-[9px]">Ingesting Synapses...</span>
                                        <span className="text-[9px]">{uploadProgress}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                                        <motion.div 
                                            className="h-full bg-white shadow-[0_0_10px_white]" 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${uploadProgress}%` }}
                                        />
                                    </div>
                                </div>
                            ) : isCompleted ? (
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="w-6 h-6" /> Phase Complete
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    Initiate Protocol <ArrowRight className="w-6 h-6" />
                                </div>
                            )}
                        </button>
                        <p className="text-[9px] text-center text-stone-400 font-bold uppercase tracking-[0.3em]">Synapse Sync Ready</p>
                      </div>
                  </div>
                  
                  <div className="bg-indigo-600 p-8 rounded-[40px] shadow-xl text-white relative overflow-hidden">
                      <div className="relative z-10 flex items-start gap-5">
                          <div className="w-16 h-16 flex-shrink-0 relative">
                               <Image src="/mascot/mascot-hi.jpg" alt="Tiki" fill className="object-cover rounded-2xl border-2 border-white/20" />
                          </div>
                          <div className="space-y-2">
                                <h4 className="text-lg font-black tracking-tight">Tiki's Advice</h4>
                                <p className="text-xs text-indigo-100 font-medium leading-relaxed">
                                    "Feeding me high-quality PDFs works best. I'll transform these into your neural landscape!"
                                </p>
                          </div>
                      </div>
                  </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="selection-step"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-4xl mx-auto space-y-16 text-center"
          >
            <div className="space-y-6">
                <div className="w-24 h-24 bg-emerald-50 rounded-[32px] flex items-center justify-center mx-auto mb-8 border-2 border-emerald-100 shadow-sm relative">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                    <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-3 -right-3 w-10 h-10 rounded-full overflow-hidden border-4 border-white shadow-lg"
                    >
                         <Image src="/mascot/mascot-celebrating.jpg" alt="Tiki" fill className="object-cover" />
                    </motion.div>
                </div>
                <h2 className="text-5xl font-black tracking-tight text-stone-900">Neural Sync Complete</h2>
                <p className="text-xl text-stone-500 font-medium max-w-2xl mx-auto">Tiki has ingested your data. Select your interaction protocol to begin.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <button 
                    onClick={() => selectMode("quick")}
                    className="p-12 rounded-[56px] bg-white border border-stone-200 hover:border-amber-400 hover:shadow-[0_40px_80px_-20px_rgba(245,158,11,0.15)] transition-all hover:-translate-y-2 group text-left space-y-8 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                         <Zap className="w-32 h-32 text-amber-500" />
                    </div>
                    <div className="w-20 h-20 bg-amber-50 rounded-[32px] border border-amber-100 flex items-center justify-center group-hover:bg-amber-100 group-hover:scale-110 transition-all shadow-sm">
                        <Zap className="w-10 h-10 text-amber-500" />
                    </div>
                    <div>
                        <h3 className="text-3xl font-black text-stone-900 tracking-tight">Quick Mastery</h3>
                        <p className="text-base text-stone-500 mt-4 leading-relaxed font-medium">
                            Rapid summarization, instant concept cards, and exam forecasting. For high-speed comprehension.
                        </p>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-black text-amber-600 uppercase tracking-[0.2em] pt-6 bg-stone-50 md:bg-transparent -mx-12 -mb-12 p-8 md:p-0">
                        Engage Quick Core <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </div>
                </button>

                <button 
                    onClick={() => selectMode("comprehensive")}
                    className="p-12 rounded-[56px] bg-white border border-stone-200 hover:border-indigo-400 hover:shadow-[0_40px_80px_-20px_rgba(79,70,229,0.15)] transition-all hover:-translate-y-2 group text-left space-y-8 relative overflow-hidden"
                >
                     <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                         <BookOpen className="w-32 h-32 text-indigo-500" />
                    </div>
                    <div className="w-20 h-20 bg-indigo-50 rounded-[32px] border border-indigo-100 flex items-center justify-center group-hover:bg-indigo-100 group-hover:scale-110 transition-all shadow-sm">
                        <BookOpen className="w-10 h-10 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="text-3xl font-black text-stone-900 tracking-tight">The Study Book</h3>
                        <p className="text-base text-stone-500 mt-4 leading-relaxed font-medium">
                            Deep-dive chapters, interactive knowledge graph, and full neural mapping of your documents.
                        </p>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-black text-indigo-600 uppercase tracking-[0.2em] pt-6 bg-stone-50 md:bg-transparent -mx-12 -mb-12 p-8 md:p-0">
                        Engage Full Archive <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </div>
                </button>
            </div>

            <button 
                onClick={() => setStep("upload")}
                className="text-[10px] font-black text-stone-400 uppercase tracking-[0.4em] hover:text-indigo-600 transition-colors bg-stone-50 px-8 py-4 rounded-2xl border border-stone-100 hover:border-indigo-100"
            >
                Wait, I need to upload more archives
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
