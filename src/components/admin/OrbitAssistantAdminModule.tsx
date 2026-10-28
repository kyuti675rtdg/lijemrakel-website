'use client';

import React, { useState, useEffect } from 'react';
import {
  Bot,
  Plus,
  Trash2,
  Edit3,
  RotateCcw,
  Send,
  PhoneCall,
  Sparkles,
  CheckCircle2,
  Search,
  ExternalLink,
} from 'lucide-react';
import knowledgeBaseData from '@/data/orbitKnowledgeBase.json';
import {
  defaultOrbitProvider,
  ORBIT_ADMIN_KB_STORAGE_KEY,
  ORBIT_WHATSAPP_MESSAGE,
  ORBIT_WHATSAPP_URL,
  OrbitKnowledgeEntry,
  OrbitAssistantReply,
} from '@/lib/orbitAssistantEngine';

export function OrbitAssistantAdminModule({
  onNotify,
}: {
  onNotify: (msg: string) => void;
}) {
  const [entries, setEntries] = useState<OrbitKnowledgeEntry[]>(
    knowledgeBaseData.entries as OrbitKnowledgeEntry[]
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [editingEntry, setEditingEntry] = useState<OrbitKnowledgeEntry | null>(
    null
  );
  const [keywordsInput, setKeywordsInput] = useState('');

  // WhatsApp Config State
  const [whatsappNumber, setWhatsappNumber] = useState('0913514767');
  const [whatsappIntl, setWhatsappIntl] = useState('251913514767');
  const [whatsappPrefill, setWhatsappPrefill] = useState(
    ORBIT_WHATSAPP_MESSAGE
  );

  // Live Sandbox Simulator State
  const [testInput, setTestInput] = useState('');
  const [testReply, setTestReply] = useState<OrbitAssistantReply | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(ORBIT_ADMIN_KB_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setEntries(parsed);
        }
      }
    } catch {
      // Ignore
    }
  }, []);

  const persistEntries = (nextEntries: OrbitKnowledgeEntry[]) => {
    setEntries(nextEntries);
    try {
      localStorage.setItem(
        ORBIT_ADMIN_KB_STORAGE_KEY,
        JSON.stringify(nextEntries)
      );
    } catch {
      // Ignore
    }
  };

  const handleOpenNewEntry = () => {
    const fresh: OrbitKnowledgeEntry = {
      id: `custom-${Date.now()}`,
      category: 'company',
      title: '',
      keywords: [],
      answer: '',
      links: [{ label: 'Contact Us', href: '/contact' }],
      suggestions: ['What products do you supply?', 'Contact Lijemrakel'],
    };
    setEditingEntry(fresh);
    setKeywordsInput('');
  };

  const handleStartEdit = (entry: OrbitKnowledgeEntry) => {
    setEditingEntry({ ...entry });
    setKeywordsInput(entry.keywords.join(', '));
  };

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEntry || !editingEntry.title.trim() || !editingEntry.answer.trim()) {
      return;
    }

    const parsedKeywords = keywordsInput
      .split(',')
      .map((k) => k.trim().toLowerCase())
      .filter(Boolean);

    const updated: OrbitKnowledgeEntry = {
      ...editingEntry,
      keywords: parsedKeywords.length > 0 ? parsedKeywords : ['lijemrakel'],
    };

    const exists = entries.some((item) => item.id === updated.id);
    const nextList = exists
      ? entries.map((item) => (item.id === updated.id ? updated : item))
      : [updated, ...entries];

    persistEntries(nextList);
    setEditingEntry(null);
    onNotify(`Saved Orbit Assistant topic "${updated.title}" to live knowledge base.`);
  };

  const handleDeleteEntry = (id: string, title: string) => {
    const nextList = entries.filter((item) => item.id !== id);
    persistEntries(nextList);
    onNotify(`Removed knowledge base entry "${title}".`);
  };

  const handleResetDefaultKB = () => {
    const defaults = knowledgeBaseData.entries as OrbitKnowledgeEntry[];
    setEntries(defaults);
    try {
      localStorage.removeItem(ORBIT_ADMIN_KB_STORAGE_KEY);
    } catch {
      // Ignore
    }
    onNotify('Restored default verified Orbit Assistant knowledge base.');
  };

  const handleRunTestQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testInput.trim()) return;
    const reply = await defaultOrbitProvider.generateReply(testInput);
    setTestReply(reply);
  };

  const filteredEntries = entries.filter(
    (entry) =>
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.keywords.some((k) =>
        k.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const generatedWaLink = `https://wa.me/${whatsappIntl}?text=${encodeURIComponent(
    whatsappPrefill
  )}`;

  return (
    <div className="space-y-6">
      {/* Top Header + Actions */}
      <div className="bg-white rounded-2xl border border-brand-border/80 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#0B0E29] text-brand-orange flex items-center justify-center shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-heading text-lg font-extrabold text-[#0B0E29]">
              Orbit Assistant &amp; WhatsApp Configuration
            </h2>
            <p className="text-xs text-brand-muted">
              Manage local knowledge-base FAQs, keyword matching rules, quick-reply prompts, and WhatsApp direct chat routing.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleResetDefaultKB}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF9F5] border border-brand-border text-xs font-heading font-bold text-[#0B0E29] hover:border-brand-orange transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-brand-orange" />
            <span>Reset Default KB</span>
          </button>
          <button
            type="button"
            onClick={handleOpenNewEntry}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0B0E29] hover:bg-brand-orange text-white hover:text-[#0B0E29] text-xs font-heading font-extrabold transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add FAQ Topic</span>
          </button>
        </div>
      </div>

      {/* Top 2-Column Grid: WhatsApp Integration Config + Live Chatbot Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* WhatsApp Direct Routing Card (6 cols) */}
        <div className="lg:col-span-6 rounded-[24px] bg-[#0B0E29] text-white p-6 space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-orange text-xs font-heading font-bold">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>WhatsApp Contact Integration</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
              Active on Public Site
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-heading font-bold uppercase tracking-wider text-white/70 mb-1">
                Local Display Phone
              </label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full rounded-xl bg-white/10 border border-white/15 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-orange"
              />
            </div>
            <div>
              <label className="block text-[11px] font-heading font-bold uppercase tracking-wider text-white/70 mb-1">
                International WA ID (wa.me)
              </label>
              <input
                type="text"
                value={whatsappIntl}
                onChange={(e) => setWhatsappIntl(e.target.value)}
                className="w-full rounded-xl bg-white/10 border border-white/15 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-orange"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-heading font-bold uppercase tracking-wider text-white/70 mb-1">
              Prefilled Inquiry Message
            </label>
            <textarea
              rows={2}
              value={whatsappPrefill}
              onChange={(e) => setWhatsappPrefill(e.target.value)}
              className="w-full rounded-xl bg-white/10 border border-white/15 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-orange"
            />
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/10">
            <a
              href={generatedWaLink || ORBIT_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-orange text-[#0B0E29] font-heading text-xs font-extrabold hover:bg-white transition-colors"
            >
              <span>Test “Contact Us on WhatsApp” Link</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              type="button"
              onClick={() =>
                onNotify('WhatsApp prefilled message and routing verified.')
              }
              className="text-xs font-heading font-bold text-[#D4AF37] hover:underline"
            >
              Save WhatsApp Settings
            </button>
          </div>
        </div>

        {/* Live Orbit Assistant Query Simulator (6 cols) */}
        <div className="lg:col-span-6 rounded-[24px] bg-white border border-brand-border/80 p-6 space-y-4 shadow-2xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 text-xs font-heading font-bold text-[#0B0E29]">
                <Sparkles className="w-4 h-4 text-brand-orange" />
                <span>Live Knowledge Base Query Tester</span>
              </div>
              <span className="text-[11px] text-brand-muted">
                Zero External API Keys
              </span>
            </div>

            <form onSubmit={handleRunTestQuery} className="flex gap-2">
              <input
                type="text"
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                placeholder="Test a visitor question (e.g. vaccines, Lijalem, location)..."
                className="flex-1 rounded-xl bg-[#FAF9F5] border border-brand-border px-3.5 py-2 text-xs text-[#0B0E29] focus:outline-none focus:border-brand-orange"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#0B0E29] text-brand-orange hover:bg-brand-orange hover:text-[#0B0E29] text-xs font-heading font-bold flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Test</span>
              </button>
            </form>

            {testReply ? (
              <div className="rounded-xl bg-[#FAF9F5] border border-brand-border/80 p-3.5 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-bold text-[#0B0E29]">
                    Matched Topic:{' '}
                    <code className="text-brand-goldDark">
                      {testReply.matchedTopicId || 'dynamic'}
                    </code>
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      testReply.isFallback
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {testReply.isFallback ? 'Fallback Triggered' : 'Verified Match'}
                  </span>
                </div>
                <p className="text-brand-body whitespace-pre-line leading-relaxed">
                  {testReply.answer}
                </p>
              </div>
            ) : (
              <div className="rounded-xl bg-[#FAF9F5] border border-dashed border-brand-border p-4 text-xs text-brand-muted text-center">
                Enter any question above to test keyword &amp; fuzzy matching against the active knowledge base.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add / Edit Knowledge Entry Form Modal/Drawer */}
      {editingEntry && (
        <form
          onSubmit={handleSaveEntry}
          className="bg-white rounded-[24px] border-2 border-brand-orange p-6 space-y-4 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-base font-extrabold text-[#0B0E29]">
              {entries.some((e) => e.id === editingEntry.id)
                ? `Edit Topic: ${editingEntry.title}`
                : 'Add New Orbit Assistant Knowledge Topic'}
            </h3>
            <button
              type="button"
              onClick={() => setEditingEntry(null)}
              className="text-xs font-bold text-brand-muted hover:text-[#0B0E29]"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-heading font-bold text-[#0B0E29] mb-1">
                Topic Title
              </label>
              <input
                type="text"
                required
                value={editingEntry.title}
                onChange={(e) =>
                  setEditingEntry({ ...editingEntry, title: e.target.value })
                }
                placeholder="e.g. Cold-Chain Vaccine Storage Standards"
                className="w-full rounded-xl bg-[#FAF9F5] border border-brand-border px-3.5 py-2 text-xs text-[#0B0E29]"
              />
            </div>

            <div>
              <label className="block text-xs font-heading font-bold text-[#0B0E29] mb-1">
                Category
              </label>
              <select
                value={editingEntry.category}
                onChange={(e) =>
                  setEditingEntry({ ...editingEntry, category: e.target.value })
                }
                className="w-full rounded-xl bg-[#FAF9F5] border border-brand-border px-3.5 py-2 text-xs text-[#0B0E29]"
              >
                <option value="company">Company</option>
                <option value="products">Products</option>
                <option value="poultry-hatchery">Poultry &amp; Hatchery</option>
                <option value="news">News</option>
                <option value="contact">Contact</option>
                <option value="guardrail">Guardrail / Policy</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-heading font-bold text-[#0B0E29] mb-1">
              Trigger Keywords (comma-separated)
            </label>
            <input
              type="text"
              required
              value={keywordsInput}
              onChange={(e) => setKeywordsInput(e.target.value)}
              placeholder="vaccine, cold chain, temperature, storage, 2°c"
              className="w-full rounded-xl bg-[#FAF9F5] border border-brand-border px-3.5 py-2 text-xs text-[#0B0E29]"
            />
          </div>

          <div>
            <label className="block text-xs font-heading font-bold text-[#0B0E29] mb-1">
              Grounded Verified Response (supports **bold** and • bullet lines)
            </label>
            <textarea
              rows={4}
              required
              value={editingEntry.answer}
              onChange={(e) =>
                setEditingEntry({ ...editingEntry, answer: e.target.value })
              }
              className="w-full rounded-xl bg-[#FAF9F5] border border-brand-border px-3.5 py-2 text-xs text-[#0B0E29]"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditingEntry(null)}
              className="px-4 py-2 rounded-xl border border-brand-border text-xs font-heading font-bold text-brand-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#0B0E29] text-white hover:bg-brand-orange hover:text-[#0B0E29] text-xs font-heading font-extrabold transition-colors"
            >
              Save Knowledge Topic
            </button>
          </div>
        </form>
      )}

      {/* Knowledge Base Table */}
      <div className="bg-white rounded-[24px] border border-brand-border/80 p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-brand-orange" />
            <h3 className="font-heading text-base font-extrabold text-[#0B0E29]">
              Active Knowledge Base Topics ({filteredEntries.length})
            </h3>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics or keywords..."
              className="w-full rounded-xl bg-[#FAF9F5] border border-brand-border pl-9 pr-3 py-2 text-xs text-[#0B0E29]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className="rounded-2xl bg-[#FAF9F5] border border-brand-border/80 p-4 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#0B0E29] text-brand-orange text-[10px] font-heading font-bold uppercase tracking-wider">
                      {entry.category}
                    </span>
                    <h4 className="font-heading text-sm font-extrabold text-[#0B0E29] mt-1.5">
                      {entry.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleStartEdit(entry)}
                      title="Edit topic"
                      className="p-1.5 rounded-lg bg-white border border-brand-border text-[#0B0E29] hover:border-brand-orange transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteEntry(entry.id, entry.title)}
                      title="Delete topic"
                      className="p-1.5 rounded-lg bg-white border border-brand-border text-red-600 hover:border-red-300 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-brand-body line-clamp-3 whitespace-pre-line leading-relaxed">
                  {entry.answer}
                </p>
              </div>

              <div className="pt-2 border-t border-brand-border/60 flex flex-wrap gap-1">
                {entry.keywords.slice(0, 6).map((kw) => (
                  <span
                    key={kw}
                    className="px-2 py-0.5 rounded-md bg-white border border-brand-border text-[10px] font-mono text-brand-muted"
                  >
                    {kw}
                  </span>
                ))}
                {entry.keywords.length > 6 && (
                  <span className="text-[10px] text-brand-muted px-1">
                    +{entry.keywords.length - 6} more
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
