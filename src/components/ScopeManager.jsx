import React, { useState } from 'react';
import { 
  Layers, 
  Plus, 
  X, 
  Trash2, 
  RotateCcw, 
  Check, 
  Sparkles,
  Bookmark
} from 'lucide-react';
import { COMMON_SCOPES_PRESETS } from '../constants/commitTypes';

export default function ScopeManager({
  scope,
  onChangeScope,
  cachedScopes,
  onAddScope,
  onRemoveScope,
  onResetScopes,
}) {
  const [newScopeInput, setNewScopeInput] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddNewScope = (e) => {
    e?.preventDefault();
    const clean = newScopeInput.trim().toLowerCase().replace(/\s+/g, '-');
    if (!clean) return;

    onAddScope(clean);
    onChangeScope(clean);
    setNewScopeInput('');
    setIsAdding(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddNewScope(e);
    } else if (e.key === 'Escape') {
      setIsAdding(false);
      setNewScopeInput('');
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-indigo-500" />
          <span>2. Scope (Optional)</span>
        </label>
        <div className="flex items-center gap-2">
          {scope && (
            <button
              type="button"
              onClick={() => onChangeScope('')}
              className="text-[11px] text-slate-500 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
            >
              Clear selection
            </button>
          )}
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {cachedScopes.length} cached
          </span>
        </div>
      </div>

      {/* Scope Input & Quick Add */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">(</span>
          </div>
          <input
            type="text"
            value={scope}
            onChange={(e) => onChangeScope(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
            placeholder="e.g. auth, api, ui, parser (or pick from cache below)"
            className="w-full pl-6 pr-8 py-2 text-sm font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
            <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">)</span>
          </div>
        </div>

        {scope && !cachedScopes.includes(scope) && (
          <button
            type="button"
            onClick={() => onAddScope(scope)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors whitespace-nowrap"
            title="Save this scope to localStorage"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Cache</span>
          </button>
        )}
      </div>

      {/* Cached Scopes Chips */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <Bookmark className="w-3 h-3 text-indigo-500" />
            Cached Scopes (click to select):
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onResetScopes}
              className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
              title="Reset to default scope presets"
            >
              Reset defaults
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 items-center p-2 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80 max-h-36 overflow-y-auto">
          {cachedScopes.map((item) => {
            const isSelected = scope.toLowerCase() === item.toLowerCase();
            return (
              <span
                key={item}
                className={`inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 rounded-md text-xs font-mono transition-all group ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30'
                }`}
              >
                <button
                  type="button"
                  onClick={() => onChangeScope(isSelected ? '' : item)}
                  className="outline-none"
                >
                  {item}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveScope(item);
                  }}
                  title={`Remove "${item}" from cached scopes`}
                  className={`p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 opacity-60 group-hover:opacity-100 transition-opacity ${
                    isSelected ? 'text-white' : 'text-slate-400 hover:text-rose-500'
                  }`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            );
          })}

          {/* Add custom scope inline */}
          {isAdding ? (
            <div className="inline-flex items-center gap-1 bg-white dark:bg-slate-800 border border-indigo-500 rounded-md px-2 py-0.5">
              <input
                type="text"
                autoFocus
                value={newScopeInput}
                onChange={(e) => setNewScopeInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="scope name..."
                className="w-24 text-xs font-mono bg-transparent outline-none text-slate-800 dark:text-slate-200"
              />
              <button
                type="button"
                onClick={handleAddNewScope}
                className="p-0.5 text-emerald-500 hover:text-emerald-600"
              >
                <Check className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setNewScopeInput('');
                }}
                className="p-0.5 text-slate-400 hover:text-rose-500"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition-colors border border-dashed border-indigo-300 dark:border-indigo-800"
            >
              <Plus className="w-3 h-3" />
              <span>Add scope</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
