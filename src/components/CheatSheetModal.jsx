import React from 'react';
import { X, BookOpen, ExternalLink, Zap, CheckCircle2, AlertTriangle } from 'lucide-react';
import { COMMIT_TYPES } from '../constants/commitTypes';

export default function CheatSheetModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-500" />
            <h3 className="font-bold text-slate-900 dark:text-white">
              Conventional Commits v1.0.0 Quick Reference
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-600 dark:text-slate-300">
          {/* Anatomy */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-900 dark:text-white text-base">
              Commit Message Anatomy
            </h4>
            <div className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs leading-relaxed border border-slate-800">
              <span className="text-indigo-400 font-bold">&lt;type&gt;</span>
              <span className="text-cyan-400">[optional scope]</span>
              <span className="text-rose-400 font-bold">[!]</span>
              <span className="text-slate-400">: </span>
              <span className="text-white">&lt;description&gt;</span>
              <br /><br />
              <span className="text-slate-500">[optional body explaining motivation and contrast with previous behavior]</span>
              <br /><br />
              <span className="text-slate-500">[optional footer(s): BREAKING CHANGE: ..., Closes #123, Co-authored-by: ...]</span>
            </div>
          </div>

          {/* Semantic Versioning Mapping */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-900 dark:text-white text-base">
              SemVer Correlation
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  MAJOR (x.0.0)
                </span>
                <p className="text-xs mt-1 text-slate-700 dark:text-slate-300">
                  Any commit with <code className="font-mono text-rose-600 font-bold">!</code> in header or <code className="font-mono font-bold">BREAKING CHANGE:</code> in footer.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  MINOR (0.x.0)
                </span>
                <p className="text-xs mt-1 text-slate-700 dark:text-slate-300">
                  <code className="font-mono text-emerald-600 font-bold">feat</code> commits that add new features or capabilities.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  PATCH (0.0.x)
                </span>
                <p className="text-xs mt-1 text-slate-700 dark:text-slate-300">
                  <code className="font-mono text-blue-600 font-bold">fix</code>, <code className="font-mono">perf</code>, <code className="font-mono">refactor</code> commits that patch code.
                </p>
              </div>
            </div>
          </div>

          {/* Types Table */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-900 dark:text-white text-base">
              Standard Types
            </h4>
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 uppercase font-mono">
                  <tr>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">SemVer</th>
                    <th className="py-2.5 px-3">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
                  {COMMIT_TYPES.map((t) => (
                    <tr key={t.type} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-2 px-3 font-bold text-indigo-600 dark:text-indigo-400">
                        {t.type}
                      </td>
                      <td className="py-2 px-3">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${t.badgeColor}`}>
                          {t.semver}
                        </span>
                      </td>
                      <td className="py-2 px-3 font-sans text-slate-600 dark:text-slate-300">
                        {t.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Gitmoji Guide */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-900 dark:text-white text-base flex items-center gap-1.5">
              <span>Gitmoji Guide (gitmoji.dev)</span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Gitmojis provide an expressive and visual way of identifying the purpose or intention of a commit.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 font-mono">
                <span className="text-base">✨ :sparkles:</span>
                <p className="font-sans text-[11px] text-slate-500 mt-0.5">New features (feat)</p>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 font-mono">
                <span className="text-base">🐛 :bug:</span>
                <p className="font-sans text-[11px] text-slate-500 mt-0.5">Bug fixes (fix)</p>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 font-mono">
                <span className="text-base">💥 :boom:</span>
                <p className="font-sans text-[11px] text-slate-500 mt-0.5">Breaking changes (!)</p>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 font-mono">
                <span className="text-base">📝 :memo:</span>
                <p className="font-sans text-[11px] text-slate-500 mt-0.5">Documentation (docs)</p>
              </div>
            </div>
          </div>

          {/* Rules and Best Practices */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-900 dark:text-white text-base">
              Key Rules from v1.0.0 Specification
            </h4>
            <ul className="space-y-1.5 text-xs list-disc list-inside text-slate-600 dark:text-slate-400">
              <li>Use imperative, present tense in the description (e.g. "change", not "changed" or "changes").</li>
              <li>Don't capitalize the first letter of the description.</li>
              <li>No period (dot) at the end of the subject line.</li>
              <li>Separate the subject from the body with a blank line.</li>
              <li>Limit the subject line to 50 characters (max 72).</li>
              <li>Footers follow git trailer conventions: <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">Token: Value</code> or <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">Token #Value</code>.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between text-xs text-slate-500">
          <span>Conventional Commits Specification v1.0.0</span>
          <a
            href="https://www.conventionalcommits.org/en/v1.0.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <span>official spec</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
