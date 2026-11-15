import React from 'react';
import { GitBranch, GitCommit, User, Clock } from 'lucide-react';
import { resolveGitmoji } from '../utils/commitFormatter';

export default function GitGraphPreview({
  type,
  scope,
  isBreaking,
  description,
  useGitmoji,
  gitmoji,
  gitmojiFormat,
  gitmojiPosition,
}) {
  const displayDesc = description || 'your commit message will appear here...';
  const emojiStr = useGitmoji && gitmoji ? resolveGitmoji(gitmoji, gitmojiFormat) : '';

  return (
    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200">
      <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
        <div className="flex items-center gap-1.5 font-mono">
          <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
          <span>branch:</span>
          <span className="text-white font-semibold">main</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
          <GitCommit className="w-3 h-3 text-cyan-400" />
          <span>git log preview</span>
        </div>
      </div>

      {/* Simulated Git log entry */}
      <div className="relative pl-6 py-1">
        {/* Vertical git branch line */}
        <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-slate-700" />
        
        {/* Active commit node */}
        <div className={`absolute left-1 top-2.5 w-3.5 h-3.5 rounded-full border-2 bg-slate-950 flex items-center justify-center ${
          isBreaking ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-cyan-400 ring-2 ring-cyan-500/20'
        }`}>
          <div className={`w-1.5 h-1.5 rounded-full ${isBreaking ? 'bg-rose-500' : 'bg-cyan-400'}`} />
        </div>

        {/* Commit content */}
        <div className="text-xs font-mono space-y-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-amber-400 font-bold">f4b910a</span>
            <span className="text-slate-500">-</span>

            {/* Prefix emoji */}
            {useGitmoji && emojiStr && gitmojiPosition === 'before-type' && (
              <span>{emojiStr}</span>
            )}

            <span className="font-semibold text-indigo-400">{type}</span>
            {scope && (
              <span className="text-cyan-400">({scope})</span>
            )}
            {isBreaking && (
              <span className="text-rose-400 font-bold">!</span>
            )}
            <span className="text-slate-400">:</span>

            {/* In-description emoji */}
            {useGitmoji && emojiStr && gitmojiPosition !== 'before-type' && (
              <span>{emojiStr}</span>
            )}

            <span 
              className="text-slate-100 truncate max-w-sm sm:max-w-md cursor-help"
              title={displayDesc}
            >
              {displayDesc}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[10px] text-slate-500">
            <span className="flex items-center gap-1">
              <User className="w-2.5 h-2.5" />
              <span>You &lt;dev@local&gt;</span>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" />
              <span>just now</span>
            </span>
          </div>
        </div>

        {/* Previous mock commit node below */}
        <div className="relative mt-4 pl-0 opacity-40">
          <div className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full border-2 border-slate-600 bg-slate-950" />
          <div className="text-xs font-mono flex items-center gap-1.5 text-slate-400">
            <span className="text-slate-500 font-bold">8e1d2c4</span>
            <span>-</span>
            <span>🎉 chore: setup initial repository structure</span>
          </div>
        </div>
      </div>
    </div>
  );
}
