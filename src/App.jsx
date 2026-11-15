import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TypeSelector from './components/TypeSelector';
import ScopeManager from './components/ScopeManager';
import HeaderInput from './components/HeaderInput';
import BodyInput from './components/BodyInput';
import FootersManager from './components/FootersManager';
import PreviewCard from './components/PreviewCard';
import CommitHistoryModal from './components/CommitHistoryModal';
import CheatSheetModal from './components/CheatSheetModal';
import { useLocalStorage } from './hooks/useLocalStorage';
import { COMMON_SCOPES_PRESETS, QUICK_TEMPLATES } from './constants/commitTypes';

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

  // Form states
  const [type, setType] = useState('feat');
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

    // Cache the template's scope if not present
    if (data.scope && !cachedScopes.includes(data.scope)) {
      handleAddScope(data.scope);
    }
  };

  // Reset form
  const handleResetForm = () => {
    setType('feat');
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
    setHistory([newEntry, ...history.slice(0, 49)]); // keep latest 50

    // Also cache the scope if provided
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
              Generate Standard Conventional Commits
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Construct clean, semantic commit messages adhering strictly to the Conventional Commits 1.0.0 specification with automated SemVer tracking, git trailers, and cached scopes.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Semantic Versioning Ready
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
              onSelectType={(newType) => setType(newType)}
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
              onToggleBreaking={setIsBreaking}
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
          Adheres to <a href="https://www.conventionalcommits.org" target="_blank" rel="noreferrer" className="text-indigo-500 hover:underline">Conventional Commits 1.0.0</a> &middot; Built with React and Tailwind CSS &middot; All scopes cached locally in your browser
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
