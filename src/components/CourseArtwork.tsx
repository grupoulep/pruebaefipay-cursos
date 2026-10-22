import React from 'react';
import {
  Landmark,
  Code2,
  TrendingUp,
  Database,
  Layers,
  Globe2,
} from 'lucide-react';
import { CourseVisualTheme } from '../data/courses';

interface CourseArtworkProps {
  theme: CourseVisualTheme;
  className?: string;
}

export const CourseIconBadge: React.FC<{ theme: CourseVisualTheme; className?: string }> = ({
  theme,
  className = 'w-6 h-6',
}) => {
  switch (theme) {
    case 'finance_ledger':
      return <Landmark className={className} />;
    case 'cloud_fullstack':
      return <Code2 className={className} />;
    case 'ecommerce_growth':
      return <TrendingUp className={className} />;
    case 'data_analytics':
      return <Database className={className} />;
    case 'product_design':
      return <Layers className={className} />;
    case 'remote_leadership':
      return <Globe2 className={className} />;
  }
};

export const CourseArtwork: React.FC<CourseArtworkProps> = ({ theme, className = '' }) => {
  switch (theme) {
    case 'finance_ledger':
      return (
        <div
          className={`relative overflow-hidden bg-[#131924] text-stone-100 flex items-center justify-center select-none ${className}`}
          aria-hidden="true"
        >
          <div className="flex flex-col items-center justify-center gap-3 p-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Landmark className="w-8 h-8" />
            </div>
          </div>
        </div>
      );

    case 'cloud_fullstack':
      return (
        <div
          className={`relative overflow-hidden bg-[#0F172A] text-slate-100 flex items-center justify-center select-none ${className}`}
          aria-hidden="true"
        >
          <div className="flex flex-col items-center justify-center gap-3 p-6">
            <div className="w-16 h-16 rounded-2xl bg-sky-500/15 border border-sky-400/30 flex items-center justify-center text-sky-400">
              <Code2 className="w-8 h-8" />
            </div>
          </div>
        </div>
      );

    case 'ecommerce_growth':
      return (
        <div
          className={`relative overflow-hidden bg-[#1C1917] text-stone-100 flex items-center justify-center select-none ${className}`}
          aria-hidden="true"
        >
          <div className="flex flex-col items-center justify-center gap-3 p-6">
            <div className="w-16 h-16 rounded-2xl bg-orange-500/15 border border-orange-400/30 flex items-center justify-center text-orange-400">
              <TrendingUp className="w-8 h-8" />
            </div>
          </div>
        </div>
      );

    case 'data_analytics':
      return (
        <div
          className={`relative overflow-hidden bg-[#111827] text-slate-100 flex items-center justify-center select-none ${className}`}
          aria-hidden="true"
        >
          <div className="flex flex-col items-center justify-center gap-3 p-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <Database className="w-8 h-8" />
            </div>
          </div>
        </div>
      );

    case 'product_design':
      return (
        <div
          className={`relative overflow-hidden bg-[#18181B] text-zinc-100 flex items-center justify-center select-none ${className}`}
          aria-hidden="true"
        >
          <div className="flex flex-col items-center justify-center gap-3 p-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Layers className="w-8 h-8" />
            </div>
          </div>
        </div>
      );

    case 'remote_leadership':
      return (
        <div
          className={`relative overflow-hidden bg-[#172554] text-blue-50 flex items-center justify-center select-none ${className}`}
          aria-hidden="true"
        >
          <div className="flex flex-col items-center justify-center gap-3 p-6">
            <div className="w-16 h-16 rounded-2xl bg-blue-400/15 border border-blue-300/30 flex items-center justify-center text-blue-300">
              <Globe2 className="w-8 h-8" />
            </div>
          </div>
        </div>
      );
  }
};
