import React, { useState } from 'react';
import { 
  GitPullRequest, 
  Plus, 
  Trash2, 
  Flame, 
  Users, 
  Hash, 
  Key, 
  ChevronDown, 
  ChevronUp,
  AlertCircle
} from 'lucide-react';
import { ISSUE_ACTION_TYPES } from '../constants/commitTypes';

export default function FootersManager({
  isBreaking,
  breakingDescription,
  onChangeBreakingDescription,
  issues,
  onAddIssue,
  onUpdateIssue,
  onRemoveIssue,
  coAuthors,
  onAddCoAuthor,
  onUpdateCoAuthor,
  onRemoveCoAuthor,
  customFooters,
  onAddCustomFooter,
  onUpdateCustomFooter,
  onRemoveCustomFooter,
}) {
  const [activeTab, setActiveTab] = useState('issues'); // 'issues' | 'breaking' | 'coauthors' | 'custom'

  return (
    <div className="space-y-3 border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-white dark:bg-slate-900 transition-all">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <GitPullRequest className="w-4 h-4 text-indigo-500" />
          <span>5. Footers & Git Trailers</span>
        </label>

        {/* Tab selection */}
        <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800/80 rounded-lg text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('issues')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              activeTab === 'issues'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Issues / Fixes ({issues.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('breaking')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all ${
              activeTab === 'breaking'
                ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-rose-600'
            }`}
          >
            <Flame className="w-3 h-3 text-rose-500" />
            Breaking ({isBreaking && breakingDescription.trim() ? '1' : isBreaking ? '!' : '0'})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('coauthors')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              activeTab === 'coauthors'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Co-Authors ({coAuthors.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('custom')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              activeTab === 'custom'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Trailers ({customFooters.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Issues (Closes, Fixes, Resolves) */}
      {activeTab === 'issues' && (
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Link issues or tickets (e.g. GitHub, GitLab, Jira)</span>
            <button
              type="button"
              onClick={onAddIssue}
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Issue Link</span>
            </button>
          </div>

          {issues.length === 0 ? (
            <div className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                No issues linked yet. You can automatically close or reference PRs and issues.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {ISSUE_ACTION_TYPES.map((action) => (
                  <button
                    key={action.value}
                    type="button"
                    onClick={() => onAddIssue(action.value, '')}
                    className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    + {action.label} #...
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {issues.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                >
                  {/* Action selector */}
                  <select
                    value={item.action}
                    onChange={(e) => onUpdateIssue(index, 'action', e.target.value)}
                    className="text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-md px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {ISSUE_ACTION_TYPES.map((act) => (
                      <option key={act.value} value={act.value}>
                        {act.label}
                      </option>
                    ))}
                  </select>

                  {/* Reference input */}
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={item.reference}
                      onChange={(e) => onUpdateIssue(index, 'reference', e.target.value)}
                      placeholder="#123 or PROJ-456 or org/repo#78"
                      className="w-full text-xs font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-md px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => onRemoveIssue(index)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded-md hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
                    title="Remove issue"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Breaking Change Details */}
      {activeTab === 'breaking' && (
        <div className="space-y-3 pt-1">
          <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2">
            <Flame className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
            <div>
              <p className="font-semibold mb-0.5">Conventional Commits Specification: BREAKING CHANGE</p>
              <p className="text-rose-700 dark:text-rose-400">
                A breaking change footer MUST consist of the uppercase text <code className="bg-rose-100 dark:bg-rose-900/50 px-1 py-0.5 rounded font-mono font-bold">BREAKING CHANGE:</code> followed by a space and description explaining what broke and how to migrate.
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700 dark:text-slate-300">
                Breaking Change Description & Migration Guide:
              </span>
              <span className="text-[11px] text-slate-400">
                Will generate: <code className="font-mono text-rose-500">BREAKING CHANGE: ...</code>
              </span>
            </div>
            <textarea
              rows={3}
              value={breakingDescription}
              onChange={(e) => onChangeBreakingDescription(e.target.value)}
              placeholder="e.g. The legacy endpoint /v1/auth is removed. Use /v2/token with Bearer header instead."
              className="w-full px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
        </div>
      )}

      {/* Tab 3: Co-authors */}
      {activeTab === 'coauthors' && (
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Pair programming attribution (Co-authored-by git trailers)</span>
            <button
              type="button"
              onClick={onAddCoAuthor}
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Co-Author</span>
            </button>
          </div>

          {coAuthors.length === 0 ? (
            <div className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                No co-authors added. Give credit to teammates who worked on this commit with you!
              </p>
              <button
                type="button"
                onClick={onAddCoAuthor}
                className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-medium hover:bg-indigo-100 transition-colors"
              >
                + Add pair programmer
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {coAuthors.map((author, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                >
                  <input
                    type="text"
                    value={author.name}
                    onChange={(e) => onUpdateCoAuthor(index, 'name', e.target.value)}
                    placeholder="Full Name (e.g. Ada Lovelace)"
                    className="flex-1 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-md px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <input
                    type="email"
                    value={author.email}
                    onChange={(e) => onUpdateCoAuthor(index, 'email', e.target.value)}
                    placeholder="ada@example.com"
                    className="flex-1 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-md px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveCoAuthor(index)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded-md hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Custom Git Trailers */}
      {activeTab === 'custom' && (
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Standard key: value git trailers (hyphenated tokens)</span>
            <button
              type="button"
              onClick={onAddCustomFooter}
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Trailer</span>
            </button>
          </div>

          {customFooters.length === 0 ? (
            <div className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                No custom trailers. Add items like Signed-off-by, Reviewed-by, Security-Advisory, etc.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={() => onAddCustomFooter('Signed-off-by', '')}
                  className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  + Signed-off-by
                </button>
                <button
                  type="button"
                  onClick={() => onAddCustomFooter('Reviewed-by', '')}
                  className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  + Reviewed-by
                </button>
                <button
                  type="button"
                  onClick={() => onAddCustomFooter('Migration-Guide', '')}
                  className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  + Migration-Guide
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {customFooters.map((footer, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                >
                  <input
                    type="text"
                    value={footer.token}
                    onChange={(e) => onUpdateCustomFooter(index, 'token', e.target.value)}
                    placeholder="Token (e.g. Signed-off-by)"
                    className="w-1/3 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-md px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    value={footer.value}
                    onChange={(e) => onUpdateCustomFooter(index, 'value', e.target.value)}
                    placeholder="Value (e.g. Jane Doe <jane@example.com>)"
                    className="flex-1 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-md px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveCustomFooter(index)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded-md hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
