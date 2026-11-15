import React from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  Type, 
  Flame, 
  HelpCircle,
  Wand2
} from 'lucide-react';

export default function HeaderInput({
  description,
  onChangeDescription,
  isBreaking,
  onToggleBreaking,
  type,
  scope,
}) {
  // Compute full header length: <type>(<scope>)!: <description>
  const prefixLength = type.length + (scope ? scope.length + 2 : 0) + (isBreaking ? 1 : 0) + 2;
  const totalLength = prefixLength + description.length;

  const isUnder50 = totalLength <= 50;
  const isUnder72 = totalLength <= 72;

  // Helpers to fix description
  const handleFixCase = () => {
    if (!description) return;
    const first = description.charAt(0).toLowerCase();
    onChangeDescription(first + description.slice(1));
  };

  const handleRemovePeriod = () => {
    if (!description) return;
    onChangeDescription(description.replace(/\.+$/, ''));
  };

  const hasCapitalStart = description.length > 0 && description[0] !== description[0].toLowerCase() && isNaN(description[0]);
  const hasTrailingPeriod = description.endsWith('.');

  return (
    <div className="space-y-3">
      {/* Label and Breaking Change switch */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Type className="w-3.5 h-3.5 text-indigo-500" />
          <span>3. Description / Subject</span>
          <span className="text-rose-500">*</span>
        </label>

        {/* Breaking Change Toggle */}
        <label className={`flex items-center gap-2 px-2.5 py-1 rounded-lg border cursor-pointer select-none transition-all ${
          isBreaking 
            ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 dark:border-rose-800 text-rose-700 dark:text-rose-300 ring-2 ring-rose-500/20' 
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
        }`}>
          <input
            type="checkbox"
            checked={isBreaking}
            onChange={(e) => onToggleBreaking(e.target.checked)}
            className="w-3.5 h-3.5 text-rose-600 rounded border-slate-300 focus:ring-rose-500"
          />
          <Flame className={`w-3.5 h-3.5 ${isBreaking ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`} />
          <span className="text-xs font-semibold">
            Breaking Change <span className="font-mono text-rose-600 dark:text-rose-400 font-bold">(!)</span>
          </span>
        </label>
      </div>

      {/* Description Input */}
      <div className="relative">
        <input
          type="text"
          value={description}
          onChange={(e) => onChangeDescription(e.target.value)}
          placeholder="e.g. add support for OAuth2 password grant flow"
          className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Progress & Recommendations bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Quick auto-fix tags */}
        <div className="flex items-center gap-2">
          {hasCapitalStart && (
            <button
              type="button"
              onClick={handleFixCase}
              className="inline-flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded hover:bg-amber-100 transition-colors"
            >
              <Wand2 className="w-3 h-3" />
              <span>Lowercase first letter</span>
            </button>
          )}
          {hasTrailingPeriod && (
            <button
              type="button"
              onClick={handleRemovePeriod}
              className="inline-flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded hover:bg-amber-100 transition-colors"
            >
              <Wand2 className="w-3 h-3" />
              <span>Remove trailing period</span>
            </button>
          )}
          {!hasCapitalStart && !hasTrailingPeriod && (
            <span className="text-[11px] text-slate-500 dark:text-slate-400 italic">
              Use imperative mood (e.g. "add", "fix", "refactor")
            </span>
          )}
        </div>

        {/* Character count pill */}
        <div className="flex items-center gap-2 font-mono">
          <div className="w-24 bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                totalLength <= 50
                  ? 'bg-emerald-500'
                  : totalLength <= 72
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
              }`}
              style={{ width: `${Math.min((totalLength / 72) * 100, 100)}%` }}
            />
          </div>
          <span
            className={`font-semibold ${
              isUnder50
                ? 'text-emerald-600 dark:text-emerald-400'
                : isUnder72
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {totalLength} / 72
          </span>
          <span className="text-[10px] text-slate-400">
            {isUnder50 ? '(ideal <= 50)' : isUnder72 ? '(good <= 72)' : '(too long!)'}
          </span>
        </div>
      </div>
    </div>
  );
}
