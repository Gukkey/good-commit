import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Terminal, 
  Bookmark, 
  AlertTriangle, 
  Info, 
  AlertCircle,
  FileCode,
  Share2
} from 'lucide-react';
import { formatCommit, generateGitCommand, validateCommit } from '../utils/commitFormatter';
import GitGraphPreview from './GitGraphPreview';

export default function PreviewCard({
  commitData,
  onSaveToHistory,
}) {
  const [copySuccess, setCopySuccess] = useState('');
  const [commandStyle, setCommandStyle] = useState('raw'); // 'raw' | 'multiple-m' | 'single' | 'heredoc'

  const { header, body, footers, fullMessage } = formatCommit(commitData);
  const gitCommand = generateGitCommand(commitData, commandStyle === 'raw' ? 'multiple-m' : commandStyle);
  const validationIssues = validateCommit(commitData);

  const textToCopy = commandStyle === 'raw' ? fullMessage : gitCommand;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopySuccess('copied');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleCopyCommand = async (style) => {
    try {
      const cmd = generateGitCommand(commitData, style);
      await navigator.clipboard.writeText(cmd);
      setCopySuccess(style);
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="space-y-4">
      {/* Terminal Preview Card */}
      <div className="rounded-2xl border border-slate-700/60 bg-slate-950 text-slate-100 shadow-xl overflow-hidden">
        {/* Terminal Title Bar */}
        <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
          {/* macOS window dots */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <div className="h-4 w-[1px] bg-slate-700 mx-1" />
            <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              <span>commit-preview.txt</span>
            </div>
          </div>

          {/* View Mode Selector */}
          <div className="flex items-center gap-1 bg-slate-950/80 p-0.5 rounded-lg border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setCommandStyle('raw')}
              className={`px-2.5 py-1 rounded font-mono text-[11px] transition-all ${
                commandStyle === 'raw'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Raw Message
            </button>
            <button
              type="button"
              onClick={() => setCommandStyle('multiple-m')}
              className={`px-2.5 py-1 rounded font-mono text-[11px] transition-all ${
                commandStyle === 'multiple-m'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              git -m
            </button>
            <button
              type="button"
              onClick={() => setCommandStyle('heredoc')}
              className={`px-2.5 py-1 rounded font-mono text-[11px] transition-all ${
                commandStyle === 'heredoc'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              heredoc
            </button>
          </div>
        </div>

        {/* Terminal Content Area with Syntax Highlighting */}
        <div className="p-4 sm:p-5 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto min-h-[140px] select-text">
          {commandStyle === 'raw' ? (
            <div className="space-y-4">
              {/* Header Line */}
              <div>
                <span className="font-bold text-indigo-400">{commitData.type}</span>
                {commitData.scope && (
                  <span className="text-cyan-400">({commitData.scope})</span>
                )}
                {commitData.isBreaking && (
                  <span className="font-extrabold text-rose-500">!</span>
                )}
                <span className="text-slate-400 font-bold">: </span>
                <span className="text-white font-medium">
                  {commitData.description || (
                    <span className="text-slate-600 italic">your commit description...</span>
                  )}
                </span>
              </div>

              {/* Body */}
              {body && (
                <div className="text-slate-300 whitespace-pre-wrap border-l-2 border-slate-800 pl-3 py-0.5">
                  {body}
                </div>
              )}

              {/* Footers */}
              {footers.length > 0 && (
                <div className="space-y-1 pt-1 border-t border-slate-800/80">
                  {footers.map((footer, i) => {
                    const isBreakingFooter = footer.startsWith('BREAKING CHANGE');
                    const isIssueFooter = /^(Closes|Fixes|Resolves|Refs|See also)/.test(footer);
                    const isCoAuthor = footer.startsWith('Co-authored-by:');

                    return (
                      <div key={i} className="text-xs">
                        {isBreakingFooter ? (
                          <span className="text-rose-400 font-bold bg-rose-950/40 px-1 py-0.5 rounded border border-rose-900/40">
                            {footer}
                          </span>
                        ) : isIssueFooter ? (
                          <span className="text-emerald-400 font-medium">{footer}</span>
                        ) : isCoAuthor ? (
                          <span className="text-violet-400">{footer}</span>
                        ) : (
                          <span className="text-cyan-300">{footer}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <pre className="text-emerald-400 whitespace-pre-wrap break-all">
              {commandStyle === 'heredoc'
                ? generateGitCommand(commitData, 'heredoc')
                : generateGitCommand(commitData, commandStyle)}
            </pre>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-4 py-3 bg-slate-900/90 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-mono">
              Chars: <strong className="text-slate-200">{fullMessage.length}</strong> | Lines: <strong className="text-slate-200">{fullMessage.split('\n').length}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Save to History Button */}
            <button
              type="button"
              onClick={() => onSaveToHistory(fullMessage)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 transition-colors"
              title="Save to local history"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>

            {/* Copy Button */}
            <button
              type="button"
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold shadow-md transition-all ${
                copySuccess === 'copied'
                  ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20 active:scale-95'
              }`}
            >
              {copySuccess === 'copied' ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>{commandStyle === 'raw' ? 'Copy Message' : 'Copy Command'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Git Graph Visualizer */}
      <GitGraphPreview
        type={commitData.type}
        scope={commitData.scope}
        isBreaking={commitData.isBreaking}
        description={commitData.description}
      />

      {/* Linter & Best Practice Feedback */}
      {validationIssues.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
            <span>Conventional Commits Linter</span>
          </h4>
          <div className="space-y-1.5">
            {validationIssues.map((issue, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-lg text-xs flex items-start gap-2 border ${
                  issue.level === 'error'
                    ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50 text-rose-800 dark:text-rose-300'
                    : issue.level === 'warning'
                    ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-300'
                    : 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/50 text-blue-800 dark:text-blue-300'
                }`}
              >
                {issue.level === 'error' ? (
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                ) : issue.level === 'warning' ? (
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
                ) : (
                  <Info className="w-4 h-4 shrink-0 text-blue-500 mt-0.5" />
                )}
                <span>{issue.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
