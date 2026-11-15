import React, { useState, useEffect } from 'react';
import { 
  Copy, 
  Check, 
  Terminal, 
  Bookmark, 
  AlertTriangle, 
  Info, 
  AlertCircle,
  RotateCcw,
  TerminalSquare
} from 'lucide-react';
import { formatCommit, validateCommit } from '../utils/commitFormatter';
import GitGraphPreview from './GitGraphPreview';

export default function PreviewCard({
  commitData,
  onSaveToHistory,
}) {
  const [copySuccess, setCopySuccess] = useState('');
  const [message, setMessage] = useState('');
  const [isManuallyEdited, setIsManuallyEdited] = useState(false);

  const { fullMessage } = formatCommit(commitData);
  const validationIssues = validateCommit(commitData);

  // Sync textarea whenever generator options change, unless user manually tweaked it
  useEffect(() => {
    if (!isManuallyEdited) {
      setMessage(fullMessage);
    }
  }, [fullMessage, isManuallyEdited]);

  // When user edits the message directly in the textarea
  const handleTextareaChange = (e) => {
    setMessage(e.target.value);
    setIsManuallyEdited(true);
  };

  // Re-sync to the form values
  const handleReset = () => {
    setMessage(fullMessage);
    setIsManuallyEdited(false);
  };

  // Copy raw message text
  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopySuccess('message');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  // In Git, multiple -m flags automatically concatenate as separate paragraphs (multiline)
  const generateMultiLineGitCommand = (text) => {
    const paragraphs = text.split(/\n\n+/).filter(Boolean);
    if (paragraphs.length === 0) {
      return `git commit -m "${text.replace(/"/g, '\\"')}"`;
    }
    const flags = paragraphs.map((p) => `-m "${p.replace(/"/g, '\\"')}"`);
    return `git commit ${flags.join(' ')}`;
  };

  // Copy git command with multiple -m flags for multiline commit
  const handleCopyCommand = async () => {
    try {
      const cmd = generateMultiLineGitCommand(message);
      await navigator.clipboard.writeText(cmd);
      setCopySuccess('command');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="space-y-4">
      {/* Simple, Direct Textarea Box */}
      <div className="rounded-2xl border border-slate-700/60 bg-slate-950 text-slate-100 shadow-xl overflow-hidden">
        {/* Title Bar */}
        <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <div className="h-4 w-[1px] bg-slate-700 mx-1" />
            <div className="flex items-center gap-1.5 text-xs font-mono text-slate-300 font-semibold">
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              <span>Commit Message</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            {isManuallyEdited ? (
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  edited
                </span>
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-indigo-400 transition-colors"
                  title="Re-sync with generator form"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Re-sync</span>
                </button>
              </div>
            ) : (
              <span className="text-[11px] text-slate-500">live sync active</span>
            )}
          </div>
        </div>

        {/* The Direct Textarea: Editable right here, anytime */}
        <div className="p-3 bg-slate-950">
          <textarea
            rows={10}
            value={message}
            onChange={handleTextareaChange}
            placeholder="Your commit message will appear here. You can directly edit or polish it anytime..."
            className="w-full p-3 font-mono text-xs sm:text-sm leading-relaxed bg-slate-900/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-y"
          />
        </div>

        {/* Footer info & actions */}
        <div className="px-4 py-3 bg-slate-900/90 border-t border-slate-800 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-[11px] text-slate-400 font-mono">
              Chars: <strong className="text-slate-200">{message.length}</strong> | Lines: <strong className="text-slate-200">{message.split('\n').length}</strong>
            </div>

            <div className="flex items-center gap-2">
              {/* Save Button */}
              <button
                type="button"
                onClick={() => onSaveToHistory(message)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 transition-colors"
                title="Save to local history"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>

              {/* Copy Git Command (using multiple -m for multiline paragraphs) */}
              <button
                type="button"
                onClick={handleCopyCommand}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  copySuccess === 'command'
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
                title="Copies git commit command with multiple -m flags for multiline paragraphs"
              >
                {copySuccess === 'command' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Copied git cmd!</span>
                  </>
                ) : (
                  <>
                    <TerminalSquare className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Copy git -m</span>
                  </>
                )}
              </button>

              {/* Copy Raw Message */}
              <button
                type="button"
                onClick={handleCopyMessage}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold shadow-md transition-all ${
                  copySuccess === 'message'
                    ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20 active:scale-95'
                }`}
              >
                {copySuccess === 'message' ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Message</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Explanation note for multiple -m flags */}
          <div className="text-[11px] text-slate-500 flex items-center justify-between">
            <span>
              💡 In Git, multiple <code className="text-slate-400 font-mono font-semibold">-m</code> flags create separate paragraphs (header, body, footers).
            </span>
          </div>
        </div>
      </div>

      {/* Visual Git Log Graph */}
      <GitGraphPreview
        type={commitData.type}
        scope={commitData.scope}
        isBreaking={commitData.isBreaking}
        description={isManuallyEdited ? message.split('\n')[0] : commitData.description}
        useGitmoji={commitData.useGitmoji}
        gitmoji={commitData.gitmoji}
        gitmojiFormat={commitData.gitmojiFormat}
        gitmojiPosition={commitData.gitmojiPosition}
      />

      {/* Linter Feedback */}
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
