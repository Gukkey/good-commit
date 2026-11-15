import React from 'react';
import { 
  Sparkles, 
  Bug, 
  BookOpen, 
  Palette, 
  Cpu, 
  Zap, 
  CheckCircle2, 
  Hammer, 
  Workflow, 
  Wrench, 
  RotateCcw,
  Tag
} from 'lucide-react';
import { COMMIT_TYPES } from '../constants/commitTypes';

const ICON_MAP = {
  Sparkles,
  Bug,
  BookOpen,
  Palette,
  Cpu,
  Zap,
  CheckCircle2,
  Hammer,
  Workflow,
  Wrench,
  RotateCcw,
};

export default function TypeSelector({ selectedType, onSelectType }) {
  const current = COMMIT_TYPES.find((t) => t.type === selectedType) || COMMIT_TYPES[0];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-indigo-500" />
          <span>1. Commit Type</span>
          <span className="text-rose-500">*</span>
        </label>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          SemVer: <strong className="font-semibold text-indigo-600 dark:text-indigo-400">{current.semver}</strong>
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {COMMIT_TYPES.map((item) => {
          const Icon = ICON_MAP[item.icon] || Tag;
          const isSelected = selectedType === item.type;

          return (
            <button
              key={item.type}
              type="button"
              onClick={() => onSelectType(item.type)}
              title={item.description}
              className={`group relative flex flex-col p-2.5 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/30 dark:ring-indigo-500/20 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:text-indigo-500'}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${item.badgeColor}`}>
                  {item.semver}
                </span>
              </div>
              <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                {item.type}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate w-full">
                {item.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Description caption for selected type */}
      <div className="p-2.5 rounded-lg bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-xs flex items-center justify-between gap-2">
        <p className="text-slate-600 dark:text-slate-300">
          <strong className="font-semibold text-slate-800 dark:text-white font-mono">{current.type}:</strong> {current.description}
        </p>
        <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline font-mono truncate max-w-xs">
          e.g. {current.example}
        </span>
      </div>
    </div>
  );
}
