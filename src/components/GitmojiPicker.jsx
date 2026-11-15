import React, { useState, useMemo } from 'react';
import { 
  Smile, 
  Search, 
  X, 
  Check, 
  ExternalLink 
} from 'lucide-react';
import { GITMOJIS } from '../constants/gitmojis';
import { resolveGitmoji } from '../utils/commitFormatter';

export default function GitmojiPicker({
  useGitmoji,
  onToggleUseGitmoji,
  gitmoji,
  onSelectGitmoji,
  gitmojiFormat,
  onChangeFormat,
  gitmojiPosition,
  onChangePosition,
  autoSyncType,
  onToggleAutoSync,
  currentType,
}) {
  const [search, setSearch] = useState('');
  const [selectedSemver, setSelectedSemver] = useState('all'); // 'all' | 'major' | 'minor' | 'patch'

  // Current active gitmoji object
  const currentGitmojiObj = useMemo(() => {
    return GITMOJIS.find((g) => g.code === gitmoji || g.emoji === gitmoji) || GITMOJIS[0];
  }, [gitmoji]);

  // Filtered gitmojis list
  const filteredGitmojis = useMemo(() => {
    const query = search.trim().toLowerCase();
    return GITMOJIS.filter((g) => {
      const matchesSearch =
        !query ||
        g.name.toLowerCase().includes(query) ||
        g.code.toLowerCase().includes(query) ||
        g.description.toLowerCase().includes(query);

      const matchesSemver =
        selectedSemver === 'all' ||
        (selectedSemver === 'major' && g.semver === 'major') ||
        (selectedSemver === 'minor' && g.semver === 'minor') ||
        (selectedSemver === 'patch' && g.semver === 'patch');

      return matchesSearch && matchesSemver;
    });
  }, [search, selectedSemver]);

  return (
    <div className="space-y-3 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 bg-white dark:bg-slate-900 transition-all">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <Smile className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Gitmoji Catalog
          </span>
          <a
            href="https://gitmoji.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-slate-400 hover:text-indigo-500 inline-flex items-center gap-0.5 ml-1 lowercase font-mono"
          >
            gitmoji.dev <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>

        <div className="flex items-center gap-2">
          {/* Auto-match with type toggle */}
          <button
            type="button"
            onClick={() => onToggleAutoSync(!autoSyncType)}
            className={`text-[11px] px-2.5 py-1 rounded-md border font-medium transition-colors ${
              autoSyncType
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800'
                : 'text-slate-500 border-slate-200 dark:border-slate-700 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
            title="Automatically match gitmoji with selected Conventional Commit type"
          >
            Auto-sync: <strong className="font-bold">{autoSyncType ? 'ON' : 'OFF'}</strong>
          </button>

          {/* Currently selected gitmoji badge */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 rounded-md text-amber-700 dark:text-amber-300 text-xs">
            <span className="text-base">{currentGitmojiObj.emoji}</span>
            <span className="font-mono text-[11px] font-bold">{currentGitmojiObj.code}</span>
          </div>
        </div>
      </div>

      {/* Format and Position Configuration */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs bg-slate-50 dark:bg-slate-950 p-2 rounded-lg border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 dark:text-slate-400 font-medium">Format:</span>
          <div className="inline-flex rounded-md p-0.5 bg-slate-200 dark:bg-slate-800">
            <button
              type="button"
              onClick={() => onChangeFormat('emoji')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                gitmojiFormat === 'emoji'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Emoji (✨)
            </button>
            <button
              type="button"
              onClick={() => onChangeFormat('code')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium font-mono transition-all ${
                gitmojiFormat === 'code'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Code (:sparkles:)
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 dark:text-slate-400 font-medium">Placement:</span>
          <div className="inline-flex rounded-md p-0.5 bg-slate-200 dark:bg-slate-800">
            <button
              type="button"
              onClick={() => onChangePosition('after-type')}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition-all ${
                gitmojiPosition === 'after-type'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
              title="feat(scope): :emoji: description"
            >
              type: :emoji: desc
            </button>
            <button
              type="button"
              onClick={() => onChangePosition('before-type')}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition-all ${
                gitmojiPosition === 'before-type'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
              title=":emoji: type(scope): description"
            >
              :emoji: type: desc
            </button>
          </div>
        </div>
      </div>

      {/* Permanently Open Search, Filter, and Grid */}
      <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
        {/* Search and SemVer filter bar */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search gitmojis (e.g. bug, auth, test, ui, docker, security)..."
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* SemVer Filters */}
          <div className="flex items-center gap-1 self-start sm:self-auto">
            {['all', 'major', 'minor', 'patch'].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSelectedSemver(s)}
                className={`px-2.5 py-1 rounded text-[10px] uppercase font-bold tracking-wider transition-colors ${
                  selectedSemver === s
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Gitmoji Grid (Always Open) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-1">
          {filteredGitmojis.length === 0 ? (
            <div className="col-span-full py-8 text-center text-xs text-slate-400">
              No gitmojis matched your search "{search}".
            </div>
          ) : (
            filteredGitmojis.map((item) => {
              const isSelected = gitmoji === item.code;
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => {
                    onSelectGitmoji(item.code);
                    if (autoSyncType) onToggleAutoSync(false);
                  }}
                  className={`flex items-start gap-2.5 p-2 rounded-lg text-left border transition-all ${
                    isSelected
                      ? 'bg-amber-50/90 dark:bg-amber-950/50 border-amber-500 ring-2 ring-amber-500/40 shadow-xs'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-slate-50/50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <span className="text-xl shrink-0 mt-0.5">{item.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-xs font-mono font-bold truncate ${isSelected ? 'text-amber-800 dark:text-amber-300' : 'text-slate-900 dark:text-white'}`}>
                        {item.code}
                      </span>
                      {item.semver && (
                        <span className="text-[9px] font-bold uppercase px-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                          {item.semver}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                      {item.description}
                    </p>
                  </div>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 self-center" />
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-800/60 font-mono">
          <span>Showing {filteredGitmojis.length} of {GITMOJIS.length} gitmojis</span>
          <span>Selected: <strong className="text-slate-700 dark:text-slate-200">{currentGitmojiObj.emoji} {currentGitmojiObj.name}</strong></span>
        </div>
      </div>
    </div>
  );
}
