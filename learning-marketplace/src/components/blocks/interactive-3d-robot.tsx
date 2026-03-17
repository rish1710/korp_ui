"use client";

import Spline from '@splinetool/react-spline';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

export function InteractiveRobotSpline({ scene, className }: { scene: string, className?: string }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`relative w-full h-full flex items-center justify-center overflow-visible ${className || ''}`}>
      {isLoading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-transparent text-white">
          <Loader2 className="h-10 w-10 animate-spin text-zinc-500" />
          <p className="text-sm font-medium tracking-widest uppercase text-zinc-400 animate-pulse">
            Loading Murph...
          </p>
        </div>
      )}
      <div 
        style={{ 
           maskImage: "linear-gradient(to bottom, black 55%, transparent 80%)",
           WebkitMaskImage: "linear-gradient(to bottom, black 55%, transparent 80%)"
        }}
        className="w-full h-full flex items-center justify-center overflow-visible"
      >
        <Spline
          scene={scene}
          onLoad={() => setIsLoading(false)}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
