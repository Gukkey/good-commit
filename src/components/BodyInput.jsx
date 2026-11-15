import React, { useState } from 'react';
import { FileText, ChevronDown, ChevronUp, AlignLeft } from 'lucide-react';

export default function BodyInput({ body, onChangeBody }) {
  const [isOpen, setIsOpen] = useState(true);

  const lines = body ? body.split('\n') : [];
  const maxLineLength = lines.reduce((max, line) => Math.max(max, line.length), 0);

  return (
    <div className="space-y-2 border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-white dark:bg-slate-900 transition-all">
      <div 
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <AlignLeft className="w-4 h-4 text-indigo-500" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            4. Message Body (Optional)
          </span>
          {body.trim() && (
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">
            {lines.length > 0 ? `${lines.length} line${lines.length > 1 ? 's' : ''}` : 'Empty'}
          </span>
          <button 
            type="button" 
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="pt-2 space-y-2">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Explain the motivation for the change and contrast this with previous behavior. Wrap lines around 72 characters.
          </p>

          <div className="relative">
            <textarea
              rows={4}
              value={body}
              onChange={(e) => onChangeBody(e.target.value)}
              placeholder="Detailed explanation of what changed and why...&#10;- Fixed race condition on socket connection&#10;- Updated timeout threshold from 5s to 15s"
              className="w-full px-3 py-2 text-sm font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-y"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>
              Longest line: <strong className={maxLineLength > 72 ? 'text-amber-500' : 'text-slate-500'}>{maxLineLength}</strong> / 72 chars
            </span>
            {body && (
              <button
                type="button"
                onClick={() => onChangeBody('')}
                className="hover:text-rose-500 transition-colors"
              >
                Clear body
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
