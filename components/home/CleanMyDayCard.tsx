'use client';

import React, { useState } from 'react';
import { Sparkles, CheckCircle2, Clock, AlertTriangle, ArrowRight, RefreshCw, Layers } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { GlassSurface } from '../ui/Surfaces';
import { cn } from '../../lib/utils';

export interface CleanMyDayCardProps {
  className?: string;
}

export const CleanMyDayCard: React.FC<CleanMyDayCardProps> = ({ className }) => {
  const [status, setStatus] = useState<'idle' | 'processing' | 'completed'>('idle');

  const handleCleanMyDay = () => {
    setStatus('processing');
    setTimeout(() => {
      setStatus('completed');
    }, 1200);
  };

  const handleReset = () => {
    setStatus('idle');
  };

  return (
    <div
      className={cn(
        'p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white border border-slate-800 shadow-md relative overflow-hidden transition-all duration-300',
        className
      )}
    >
      {/* Decorative ambient background blur */}
      <div className="absolute -right-10 -bottom-10 h-40 w-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      {status === 'idle' && (
        <div className="space-y-4 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
                <Sparkles className="h-4.5 w-4.5 fill-indigo-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">Clean My Day</h3>
                <p className="text-[11px] text-slate-400">Intelligent daily context organizer</p>
              </div>
            </div>
            <Badge variant="indigo" size="sm" className="bg-indigo-950/80 text-indigo-300 border-indigo-800">
              AI Synthesis
            </Badge>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Let Nexorbit find what matters across your connected apps and organize your next steps automatically.
          </p>

          <Button
            variant="primary"
            size="md"
            onClick={handleCleanMyDay}
            leftIcon={<Sparkles className="h-4 w-4 text-indigo-200" />}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md border-indigo-500/50"
          >
            Clean My Day
          </Button>
        </div>
      )}

      {status === 'processing' && (
        <div className="py-6 flex flex-col items-center justify-center space-y-3 text-center relative z-10 animate-fadeIn">
          <RefreshCw className="h-7 w-7 text-indigo-400 animate-spin" />
          <div className="space-y-1">
            <div className="text-xs font-bold text-white">Scanning Personal Context...</div>
            <div className="text-[11px] text-indigo-300">Evaluating Gmail, Calendar &amp; Drive priorities</div>
          </div>
        </div>
      )}

      {status === 'completed' && (
        <div className="space-y-4 relative z-10 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              <div>
                <h3 className="text-sm font-bold text-white">Your day, simplified.</h3>
                <p className="text-[10px] text-slate-400">NEXORBIT AI context synthesis</p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="text-[10px] text-indigo-300 hover:text-white underline font-medium"
            >
              Re-run
            </button>
          </div>

          {/* Result Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <span className="text-[10px] font-semibold text-indigo-300 uppercase block">Focus</span>
              <span className="text-xs font-medium text-slate-100 block truncate mt-0.5">
                Resolve Project Alpha
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <span className="text-[10px] font-semibold text-indigo-300 uppercase block">Waiting</span>
              <span className="text-xs font-medium text-slate-100 block mt-0.5">2 replies pending</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <span className="text-[10px] font-semibold text-sky-300 uppercase block">Upcoming</span>
              <span className="text-xs font-medium text-slate-100 block mt-0.5">3 meetings today</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <span className="text-[10px] font-semibold text-amber-300 uppercase block">Risk</span>
              <span className="text-xs font-medium text-amber-200 block truncate mt-0.5">
                1 deadline conflict
              </span>
            </div>
          </div>

          {/* Next Best Action */}
          <div className="p-3 rounded-xl bg-indigo-950/90 border border-indigo-700/80 flex items-center justify-between gap-3">
            <div className="space-y-0.5 min-w-0">
              <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block">
                Next best action
              </span>
              <span className="text-xs font-semibold text-white block truncate">
                Prepare the Project Alpha response
              </span>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => alert("Action dispatched: Prepare Project Alpha response")}
              rightIcon={<ArrowRight className="h-3 w-3" />}
              className="h-7 text-[11px] bg-indigo-500 hover:bg-indigo-400 text-white shrink-0"
            >
              Start
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
