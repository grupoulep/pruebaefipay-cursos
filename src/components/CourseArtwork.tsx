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
  className = 'w-5 h-5',
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
          className={`relative overflow-hidden bg-gradient-to-br from-[#1E1138] via-[#2D1654] to-[#140929] text-white flex items-center justify-center select-none ${className}`}
          aria-hidden="true"
        >
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-purple-500/20 blur-2xl pointer-events-none" />
          <div className="flex flex-col items-center justify-center gap-2 p-6 z-10">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-purple-300/30 flex items-center justify-center text-purple-200 shadow-lg shadow-purple-900/30 transition-transform duration-300 group-hover:scale-110">
              <Landmark className="w-8 h-8" />
            </div>
          </div>
        </div>
      );

    case 'cloud_fullstack':
      return (
        <div
          className={`relative overflow-hidden bg-gradient-to-br from-[#1A0B2E] via-[#2A174E] to-[#120721] text-white flex items-center justify-center select-none ${className}`}
          aria-hidden="true"
        >
          <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-violet-500/20 blur-2xl pointer-events-none" />
          <div className="flex flex-col items-center justify-center gap-2 p-6 z-10">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-violet-300/30 flex items-center justify-center text-violet-200 shadow-lg shadow-purple-900/30 transition-transform duration-300 group-hover:scale-110">
              <Code2 className="w-8 h-8" />
            </div>
          </div>
        </div>
      );

    case 'ecommerce_growth':
      return (
        <div
          className={`relative overflow-hidden bg-gradient-to-br from-[#240F3E] via-[#35195C] to-[#170928] text-white flex items-center justify-center select-none ${className}`}
          aria-hidden="true"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full bg-purple-600/15 blur-2xl pointer-events-none" />
          <div className="flex flex-col items-center justify-center gap-2 p-6 z-10">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-purple-300/30 flex items-center justify-center text-purple-200 shadow-lg shadow-purple-900/30 transition-transform duration-300 group-hover:scale-110">
              <TrendingUp className="w-8 h-8" />
            </div>
          </div>
        </div>
      );

    case 'data_analytics':
      return (
        <div
          className={`relative overflow-hidden bg-gradient-to-br from-[#1C0D33] via-[#2C1550] to-[#130724] text-white flex items-center justify-center select-none ${className}`}
          aria-hidden="true"
        >
          <div className="absolute -top-6 -left-6 w-32 h-32 rounded-full bg-fuchsia-600/15 blur-2xl pointer-events-none" />
          <div className="flex flex-col items-center justify-center gap-2 p-6 z-10">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-fuchsia-300/30 flex items-center justify-center text-fuchsia-200 shadow-lg shadow-purple-900/30 transition-transform duration-300 group-hover:scale-110">
              <Database className="w-8 h-8" />
            </div>
          </div>
        </div>
      );

    case 'product_design':
      return (
        <div
          className={`relative overflow-hidden bg-gradient-to-br from-[#220B3B] via-[#381660] to-[#18062A] text-white flex items-center justify-center select-none ${className}`}
          aria-hidden="true"
        >
          <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-purple-500/20 blur-2xl pointer-events-none" />
          <div className="flex flex-col items-center justify-center gap-2 p-6 z-10">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-purple-300/30 flex items-center justify-center text-purple-200 shadow-lg shadow-purple-900/30 transition-transform duration-300 group-hover:scale-110">
              <Layers className="w-8 h-8" />
            </div>
          </div>
        </div>
      );

    case 'remote_leadership':
      return (
        <div
          className={`relative overflow-hidden bg-gradient-to-br from-[#1B0C35] via-[#2F1559] to-[#15082B] text-white flex items-center justify-center select-none ${className}`}
          aria-hidden="true"
        >
          <div className="absolute top-0 right-1/4 w-32 h-32 rounded-full bg-violet-600/15 blur-2xl pointer-events-none" />
          <div className="flex flex-col items-center justify-center gap-2 p-6 z-10">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-violet-300/30 flex items-center justify-center text-violet-200 shadow-lg shadow-purple-900/30 transition-transform duration-300 group-hover:scale-110">
              <Globe2 className="w-8 h-8" />
            </div>
          </div>
        </div>
      );
  }
};
