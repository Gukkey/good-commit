import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TypeSelector from './components/TypeSelector';
import ScopeManager from './components/ScopeManager';
import HeaderInput from './components/HeaderInput';
import BodyInput from './components/BodyInput';
import FootersManager from './components/FootersManager';
import GitmojiPicker from './components/GitmojiPicker';
import PreviewCard from './components/PreviewCard';
import CommitHistoryModal from './components/CommitHistoryModal';
import CheatSheetModal from './components/CheatSheetModal';
import { useLocalStorage } from './hooks/useLocalStorage';
import { COMMON_SCOPES_PRESETS, QUICK_TEMPLATES } from './constants/commitTypes';
import { TYPE_TO_GITMOJI, BREAKING_GITMOJI } from './constants/gitmojis';

export default function App() {
  // Theme state persisted in localStorage
  const [theme, setTheme] = useLocalStorage('goodcommit_theme', 'dark');
  const isDark = theme === 'dark';

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  // Cached scopes in localStorage
  const [cachedScopes, setCachedScopes] = useLocalStorage(
    'goodcommit_cached_scopes',
    COMMON_SCOPES_PRESETS
  );

  // Commit history in localStorage
  const [history, setHistory] = useLocalStorage('goodcommit_history', []);

  // Gitmoji preferences in localStorage
  const [useGitmoji, setUseGitmoji] = useLocalStorage('goodcommit_use_gitmoji', true);
  const [gitmojiFormat, setGitmojiFormat] = useLocalStorage('goodcommit_gitmoji_format', 'emoji');
  const [gitmojiPosition, setGitmojiPosition] = useLocalStorage('goodcommit_gitmoji_position', 'after-type');
  const [autoSyncGitmoji, setAutoSyncGitmoji] = useState(true);

  // Form states
  const [type, setType] = useState('feat');
  const [gitmoji, setGitmoji] = useState(':sparkles:');
  const [scope, setScope] = useState('');
  const [isBreaking, setIsBreaking] = useState(false);
  const [description, setDescription] = useState('');
  const [body, setBody] = useState('');
  const [breakingDescription, setBreakingDescription] = useState('');
  const [issues, setIssues] = useState([]);
  const [coAuthors, setCoAuthors] = useState([]);
  const [customFooters, setCustomFooters] = useState([]);

  // Modals state
  const [isCheatSheetOpen, setIsCheatSheetOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Auto-sync gitmoji when type changes if autoSync is active
  const handleSelectType = (newType) => {
    setType(newType);
    if (autoSyncGitmoji) {
      if (isBreaking) {
        setGitmoji(BREAKING_GITMOJI);
      } else if (TYPE_TO_GITMOJI[newType]) {
        setGitmoji(TYPE_TO_GITMOJI[newType]);
      }
    }
  };

  const handleToggleBreaking = (breaking) => {
    setIsBreaking(breaking);
    if (breaking && autoSyncGitmoji) {
      setGitmoji(BREAKING_GITMOJI);
    } else if (!breaking && autoSyncGitmoji && TYPE_TO_GITMOJI[type]) {
      setGitmoji(TYPE_TO_GITMOJI[type]);
    }
  };

  // Scope caching handlers
  const handleAddScope = (newScope) => {
    const clean = newScope.trim().toLowerCase();
    if (clean && !cachedScopes.includes(clean)) {
      setCachedScopes([clean, ...cachedScopes]);
    }
  };

  const handleRemoveScope = (scopeToRemove) => {
    setCachedScopes(cachedScopes.filter((s) => s !== scopeToRemove));
    if (scope === scopeToRemove) {
      setScope('');
    }
  };

  const handleResetScopes = () => {
    setCachedScopes(COMMON_SCOPES_PRESETS);
  };

  // Issue handlers
  const handleAddIssue = () => {
    setIssues([...issues, { action: 'Closes', reference: '' }]);
  };

  const handleUpdateIssue = (index, field, val) => {
    const updated = [...issues];
    updated[index][field] = val;
    setIssues(updated);
  };

  const handleRemoveIssue = (index) => {
    setIssues(issues.filter((_, i) => i !== index));
  };

  // Co-author handlers
  const handleAddCoAuthor = () => {
    setCoAuthors([...coAuthors, { name: '', email: '' }]);
  };

  const handleUpdateCoAuthor = (index, field, val) => {
    const updated = [...coAuthors];
    updated[index][field] = val;
    setCoAuthors(updated);
  };

  const handleRemoveCoAuthor = (index) => {
    setCoAuthors(coAuthors.filter((_, i) => i !== index));
  };

  // Custom footer handlers
  const handleAddCustomFooter = () => {
    setCustomFooters([...customFooters, { token: '', value: '' }]);
  };

  const handleUpdateCustomFooter = (index, field, val) => {
    const updated = [...customFooters];
    updated[index][field] = val;
    setCustomFooters(updated);
  };

  const handleRemoveCustomFooter = (index) => {
    setCustomFooters(customFooters.filter((_, i) => i !== index));
  };

  // Template loader
  const handleApplyTemplate = (templateId) => {
    const found = QUICK_TEMPLATES.find((t) => t.id === templateId);
    if (!found) return;

    const { data } = found;
    setType(data.type);
    setScope(data.scope);
    setIsBreaking(data.isBreaking);
    setDescription(data.description);
    setBody(data.body);
    setBreakingDescription(data.breakingDescription);
    setIssues(data.issues || []);
    setCoAuthors(data.coAuthors || []);
    setCustomFooters(data.customFooters || []);

    if (data.isBreaking) {
      setGitmoji(BREAKING_GITMOJI);
    } else if (TYPE_TO_GITMOJI[data.type]) {
      setGitmoji(TYPE_TO_GITMOJI[data.type]);
    }

    if (data.scope && !cachedScopes.includes(data.scope)) {
      handleAddScope(data.scope);
    }
  };

  // Reset form
  const handleResetForm = () => {
    setType('feat');
    setGitmoji(TYPE_TO_GITMOJI['feat'] || ':sparkles:');
    setScope('');
    setIsBreaking(false);
    setDescription('');
    setBody('');
    setBreakingDescription('');
    setIssues([]);
    setCoAuthors([]);
    setCustomFooters([]);
  };

  // Save to history
  const handleSaveToHistory = (message) => {
    if (!description.trim()) return;

    const newEntry = {
      id: Date.now().toString(),
      message,
      timestamp: new Date().toISOString(),
      type,
      scope,
    };
    setHistory([newEntry, ...history.slice(0, 49)]);

    if (scope.trim()) {
      handleAddScope(scope.trim());
    }
  };

  const commitData = {
    type,
    scope,
    isBreaking,
    description,
    body,
    breakingDescription,
    issues,
    customFooters,
    coAuthors,
    useGitmoji,
    gitmoji,
    gitmojiFormat,
    gitmojiPosition,
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      <Header
        isDark={isDark}
        toggleTheme={toggleTheme}
        onOpenCheatSheet={() => setIsCheatSheetOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
        onApplyTemplate={handleApplyTemplate}
        onReset={handleResetForm}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Intro Banner */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              Conventional Commit Generator
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Construct clean, semantic commit messages adhering to the Conventional Commits 1.0.0 specification with gitmoji.dev support, automated SemVer tracking, git trailers, and cached scopes.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              SemVer v2.0.0
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
              <span>✨</span>
              <span>Gitmoji Enabled</span>
            </span>
          </div>
        </div>

        {/* 2-Column Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Commit Type */}
            <TypeSelector
              selectedType={type}
              onSelectType={handleSelectType}
            />

            {/* Gitmoji Picker & Configuration */}
            <GitmojiPicker
              useGitmoji={useGitmoji}
              onToggleUseGitmoji={setUseGitmoji}
              gitmoji={gitmoji}
              onSelectGitmoji={setGitmoji}
              gitmojiFormat={gitmojiFormat}
              onChangeFormat={setGitmojiFormat}
              gitmojiPosition={gitmojiPosition}
              onChangePosition={setGitmojiPosition}
              autoSyncType={autoSyncGitmoji}
              onToggleAutoSync={setAutoSyncGitmoji}
              currentType={type}
            />

            {/* 2. Scope & LocalStorage Cache */}
            <ScopeManager
              scope={scope}
              onChangeScope={setScope}
              cachedScopes={cachedScopes}
              onAddScope={handleAddScope}
              onRemoveScope={handleRemoveScope}
              onResetScopes={handleResetScopes}
            />

            {/* 3. Description & Breaking Switch */}
            <HeaderInput
              description={description}
              onChangeDescription={setDescription}
              isBreaking={isBreaking}
              onToggleBreaking={handleToggleBreaking}
              type={type}
              scope={scope}
            />

            {/* 4. Optional Body */}
            <BodyInput
              body={body}
              onChangeBody={setBody}
            />

            {/* 5. Footers (Issues, Breaking, Co-authors, Custom) */}
            <FootersManager
              isBreaking={isBreaking}
              breakingDescription={breakingDescription}
              onChangeBreakingDescription={setBreakingDescription}
              issues={issues}
              onAddIssue={handleAddIssue}
              onUpdateIssue={handleUpdateIssue}
              onRemoveIssue={handleRemoveIssue}
              coAuthors={coAuthors}
              onAddCoAuthor={handleAddCoAuthor}
              onUpdateCoAuthor={handleUpdateCoAuthor}
              onRemoveCoAuthor={handleRemoveCoAuthor}
              customFooters={customFooters}
              onAddCustomFooter={handleAddCustomFooter}
              onUpdateCustomFooter={handleUpdateCustomFooter}
              onRemoveCustomFooter={handleRemoveCustomFooter}
            />
          </div>

          {/* Right Live Preview Column (5 cols, sticky on large screens) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            <PreviewCard
              commitData={commitData}
              onSaveToHistory={handleSaveToHistory}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-500 dark:text-slate-500">
        <p>
          Adheres to <a href="https://www.conventionalcommits.org" target="_blank" rel="noreferrer" className="text-indigo-500 hover:underline">Conventional Commits 1.0.0</a> &middot; Powered by <a href="https://gitmoji.dev" target="_blank" rel="noreferrer" className="text-amber-500 hover:underline">gitmoji.dev</a> &middot; Built with React & Tailwind CSS
        </p>
      </footer>

      {/* Modals */}
      <CheatSheetModal
        isOpen={isCheatSheetOpen}
        onClose={() => setIsCheatSheetOpen(false)}
      />

      <CommitHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onClearHistory={() => setHistory([])}
        onLoadCommit={(entry) => {
          setIsHistoryOpen(false);
        }}
      />
    </div>
  );
}
