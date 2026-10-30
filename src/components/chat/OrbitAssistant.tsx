'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Send,
  Sparkles,
  RotateCcw,
  PhoneCall,
  Mail,
  MapPin,
  ArrowUpRight,
  User,
  ChevronRight,
} from 'lucide-react';
import {
  defaultOrbitProvider,
  ORBIT_ADMIN_KB_STORAGE_KEY,
  ORBIT_WELCOME_MESSAGE,
  ORBIT_DEFAULT_SUGGESTIONS,
  ORBIT_WHATSAPP_URL,
  OrbitChatMessage,
  OrbitChatProvider,
} from '@/lib/orbitAssistantEngine';
import { usePublicCms } from '@/lib/usePublicCms';

const STORAGE_KEY = 'lijemrakel_orbit_assistant_history_v1';

interface OrbitAssistantProps {
  /**
   * Optional custom provider so a real AI model / API adapter
   * can be injected in the future without modifying the UI.
   */
  provider?: OrbitChatProvider;
}

/**
 * Custom Animated Orbit Assistant Emblem Icon (Navy, Gold & Orange)
 */
function OrbitEmblemIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Outer Tilted Orbit Ring */}
      <ellipse
        cx="18"
        cy="18"
        rx="15"
        ry="6.5"
        transform="rotate(-28 18 18)"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="4 2"
        className="opacity-85"
      />
      {/* Secondary Intersecting Orbit Arc */}
      <ellipse
        cx="18"
        cy="18"
        rx="14"
        ry="5.5"
        transform="rotate(32 18 18)"
        stroke="#D4AF37"
        strokeWidth="1.6"
        className="opacity-75"
      />
      {/* Central AI Core Sphere */}
      <circle cx="18" cy="18" r="6.5" fill="currentColor" />
      {/* Inner Sparkle Star Inside Core */}
      <path
        d="M18 13.5L19.1 16.9L22.5 18L19.1 19.1L18 22.5L16.9 19.1L13.5 18L16.9 16.9L18 13.5Z"
        fill="#0B0E29"
      />
      {/* Orbiting Satellite Nodes */}
      <circle cx="30" cy="11.5" r="2.4" fill="#F7941D" />
      <circle cx="6.5" cy="24.5" r="2" fill="#D4AF37" />
    </svg>
  );
}

/**
 * Official WhatsApp Vector Icon
 */
function WhatsAppIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path d="M12.031 2C6.508 2 2.023 6.485 2.023 12.007c0 1.766.461 3.49 1.337 5.01L2 22l5.122-1.343a9.97 9.97 0 0 0 4.909 1.298h.004c5.522 0 10.007-4.485 10.007-10.007C22.042 6.485 17.553 2 12.031 2Zm5.847 14.142c-.246.693-1.434 1.326-1.988 1.41-.509.076-1.153.108-1.86-.117-.429-.136-.98-.318-1.686-.623-2.968-1.281-4.906-4.269-5.054-4.467-.148-.198-1.207-1.606-1.207-3.064 0-1.458.764-2.175 1.035-2.472.271-.297.592-.371.789-.371.197 0 .395.002.567.01.182.009.426-.069.666.508.246.594.838 2.048.912 2.196.074.149.123.322.025.52-.099.198-.148.321-.296.494-.148.173-.311.387-.444.519-.148.148-.303.309-.13.606.173.297.767 1.265 1.646 2.049 1.132 1.009 2.086 1.322 2.382 1.47.296.148.469.123.642-.074.173-.198.74-8.636.937-1.16.197-.297.395-.247.666-.148.271.099 1.726.814 2.022.962.296.149.493.223.567.347.074.123.074.717-.172 1.41Z" />
    </svg>
  );
}

function formatTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

/**
 * Lightweight safe inline formatter for **bold**, *italic*, and `code` spans.
 */
function renderFormattedLine(line: string): React.ReactNode {
  const parts = line.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={idx} className="font-bold text-brand-navy">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <em key={idx} className="italic text-brand-navy/90">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={idx}
          className="px-1.5 py-0.5 rounded bg-[#0B0E29]/8 text-[#0B0E29] font-mono text-[11px] font-semibold"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

function renderMessageContent(content: string, isUser: boolean): React.ReactNode {
  if (isUser) {
    return <p className="text-xs sm:text-[13px] leading-relaxed">{content}</p>;
  }

  const lines = content.split('\n');
  return (
    <div className="space-y-1.5 text-xs sm:text-[13px] text-brand-body leading-relaxed">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="h-1" />;
        if (trimmed.startsWith('• ')) {
          return (
            <div key={i} className="flex items-start gap-2 pl-1">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange shrink-0 mt-1.5" />
              <span>{renderFormattedLine(trimmed.slice(2))}</span>
            </div>
          );
        }
        return <p key={i}>{renderFormattedLine(trimmed)}</p>;
      })}
    </div>
  );
}

export function OrbitAssistant({
  provider = defaultOrbitProvider,
}: OrbitAssistantProps) {
  const { orbitConfig, orbitFaqs } = usePublicCms();

  const liveAssistantName = orbitConfig?.assistantName || 'Orbit Assistant';
  const liveWelcomeMessage =
    orbitConfig?.welcomeMessage || ORBIT_WELCOME_MESSAGE;
  const liveWhatsappNumber = orbitConfig?.whatsappNumber || '0913514767';
  const liveDefaultSuggestions =
    Array.isArray(orbitConfig?.defaultSuggestions) &&
    orbitConfig.defaultSuggestions.length > 0
      ? orbitConfig.defaultSuggestions
      : ORBIT_DEFAULT_SUGGESTIONS;

  const formattedIntlPhone = liveWhatsappNumber
    .replace(/\s+/g, '')
    .replace(/^0/, '251')
    .replace(/^\+/, '');
  const liveWhatsappUrl = orbitConfig?.whatsappNumber
    ? `https://wa.me/${formattedIntlPhone}?text=${encodeURIComponent(
        orbitConfig.whatsappPrefilledMessage ||
          "Hello, I'm contacting Lijemrakel Trading PLC. I'd like to know more about your products and services."
      )}`
    : ORBIT_WHATSAPP_URL;

  const [isOpen, setIsOpen] = useState(false);
  const [showTeaser, setShowTeaser] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<OrbitChatMessage[]>([]);
  const [activeSuggestions, setActiveSuggestions] = useState<string[]>(
    liveDefaultSuggestions
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync live knowledge base from CMS into localStorage for the matching engine
  useEffect(() => {
    if (Array.isArray(orbitFaqs) && orbitFaqs.length > 0) {
      try {
        localStorage.setItem(
          ORBIT_ADMIN_KB_STORAGE_KEY,
          JSON.stringify(orbitFaqs)
        );
      } catch {
        // Ignore storage errors
      }
    }
  }, [orbitFaqs]);

  // Load persisted conversation history on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as OrbitChatMessage[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          const lastAssistant = [...parsed]
            .reverse()
            .find((m) => m.role === 'assistant');
          if (lastAssistant?.suggestions?.length) {
            setActiveSuggestions(lastAssistant.suggestions);
          }
          return;
        }
      }
    } catch {
      // Ignore storage read errors
    }

    const initialMessage: OrbitChatMessage = {
      id: 'welcome-msg',
      role: 'assistant',
      content: liveWelcomeMessage,
      timestamp: new Date().toISOString(),
      links: [
        { label: 'Contact Us on WhatsApp', href: liveWhatsappUrl },
        { label: 'Explore Products', href: '/products' },
        { label: 'Contact Us', href: '/contact' },
      ],
      suggestions: liveDefaultSuggestions,
      isFallback: false,
    };
    setMessages([initialMessage]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save conversation history when messages change
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-30)));
      } catch {
        // Ignore storage write errors
      }
    }
  }, [messages]);

  // Auto-scroll to latest message
  useEffect(() => {
    if (isOpen) {
      setShowTeaser(false);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [messages, isTyping, isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSendQuery = async (queryText: string) => {
    const trimmed = queryText.trim();
    if (!trimmed || isTyping) return;

    const userMsg: OrbitChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date().toISOString(),
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setInputValue('');
    setIsTyping(true);

    setTimeout(async () => {
      try {
        const reply = await provider.generateReply(trimmed, updatedHistory);
        const assistantMsg: OrbitChatMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: reply.answer,
          timestamp: new Date().toISOString(),
          links: reply.links,
          suggestions: reply.suggestions,
          isFallback: reply.isFallback,
        };

        setMessages((prev) => [...prev, assistantMsg]);
        if (reply.suggestions?.length) {
          setActiveSuggestions(reply.suggestions);
        }
      } finally {
        setIsTyping(false);
      }
    }, 320);
  };

  const handleResetHistory = () => {
    const resetMsg: OrbitChatMessage = {
      id: `welcome-${Date.now()}`,
      role: 'assistant',
      content: liveWelcomeMessage,
      timestamp: new Date().toISOString(),
      links: [
        { label: 'Contact Us on WhatsApp', href: liveWhatsappUrl },
        { label: 'Explore Products', href: '/products' },
        { label: 'Contact Us', href: '/contact' },
      ],
      suggestions: liveDefaultSuggestions,
      isFallback: false,
    };
    setMessages([resetMsg]);
    setActiveSuggestions(liveDefaultSuggestions);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* =====================================================================
          CHAT WINDOW
      ===================================================================== */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            role="dialog"
            aria-label="Orbit Assistant Chat Window"
            className="mb-3.5 w-[calc(100vw-2.5rem)] sm:w-[405px] h-[575px] max-h-[calc(100vh-7.5rem)] rounded-[26px] bg-white shadow-2xl border border-brand-border/90 flex flex-col overflow-hidden"
          >
            {/* 1. Navy, Gold & Orange Branded Header */}
            <div className="bg-[#0B0E29] text-white px-4 py-3.5 flex items-center justify-between border-b border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 6, -6, 0] }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-brand-orange via-[#F7941D] to-[#D4AF37] text-[#0B0E29] flex items-center justify-center shadow-md shrink-0"
                >
                  <OrbitEmblemIcon className="w-6 h-6" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0B0E29]" />
                </motion.div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h2 className="font-heading text-sm font-extrabold tracking-tight text-white">
                      {liveAssistantName}
                    </h2>
                    <span className="px-1.5 py-0.5 rounded-full bg-white/10 border border-[#D4AF37]/40 text-[9px] font-heading font-bold uppercase tracking-wider text-brand-orange">
                      Online
                    </span>
                  </div>
                  <p className="text-[11px] text-white/70">
                    Lijemrakel Trading PLC · Instant Guide
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleResetHistory}
                  title="Reset conversation"
                  aria-label="Reset conversation"
                  className="p-2 rounded-lg text-white/70 hover:text-brand-orange hover:bg-white/10 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title="Close chat"
                  aria-label="Close chat"
                  className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 2. Prominent WhatsApp Direct Action Bar (Navy/Gold/Orange Branded) */}
            <div className="bg-gradient-to-r from-[#0B0E29] via-[#131842] to-[#0B0E29] px-4 py-2.5 border-b border-[#D4AF37]/30 flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-6 h-6 rounded-full bg-[#25D366]/20 border border-[#25D366]/50 text-[#25D366] flex items-center justify-center shrink-0">
                  <WhatsAppIcon className="w-3.5 h-3.5" />
                </span>
                <span className="text-[11px] font-medium text-white/90 truncate">
                  Direct WhatsApp Desk · <strong className="text-brand-orange">{liveWhatsappNumber}</strong>
                </span>
              </div>

              <a
                href={liveWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-orange hover:bg-white text-[#0B0E29] font-heading text-[11px] font-extrabold transition-colors shrink-0 shadow-xs"
              >
                <WhatsAppIcon className="w-3.5 h-3.5 text-[#0B0E29]" />
                <span>Contact Us on WhatsApp</span>
              </a>
            </div>

            {/* 3. Scrollable Conversation History */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-[#FAF9F5]">
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`flex items-start gap-2.5 ${
                      isUser ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        isUser
                          ? 'bg-[#0B0E29] text-white'
                          : 'bg-[#0B0E29] text-brand-orange border border-[#D4AF37]/40'
                      }`}
                    >
                      {isUser ? (
                        <User className="w-3.5 h-3.5" />
                      ) : (
                        <OrbitEmblemIcon className="w-4 h-4" />
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={`max-w-[82%] rounded-2xl px-3.5 py-3 shadow-2xs ${
                        isUser
                          ? 'bg-[#0B0E29] text-white rounded-tr-xs'
                          : 'bg-white text-brand-body border border-brand-border/80 rounded-tl-xs'
                      }`}
                    >
                      {renderMessageContent(msg.content, isUser)}

                      {/* Action Links inside Assistant Message */}
                      {!isUser && msg.links && msg.links.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-brand-border/60 flex flex-wrap gap-1.5">
                          {msg.links.map((link, idx) => {
                            const isWhatsApp = link.href.includes('wa.me/');
                            const isTelOrMail =
                              link.href.startsWith('tel:') ||
                              link.href.startsWith('mailto:');

                            if (isWhatsApp) {
                              return (
                                <a
                                  key={idx}
                                  href={link.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0B0E29] text-white border border-[#D4AF37]/50 font-heading text-[11px] font-bold hover:bg-brand-orange hover:text-[#0B0E29] transition-colors"
                                >
                                  <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />
                                  <span>{link.label}</span>
                                </a>
                              );
                            }

                            if (isTelOrMail) {
                              return (
                                <a
                                  key={idx}
                                  href={link.href}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-orange text-brand-navy font-heading text-[11px] font-bold hover:bg-[#0B0E29] hover:text-white transition-colors"
                                >
                                  <PhoneCall className="w-3 h-3" />
                                  <span>{link.label}</span>
                                </a>
                              );
                            }

                            return (
                              <Link
                                key={idx}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FAF9F5] border border-brand-border text-brand-navy font-heading text-[11px] font-bold hover:border-brand-orange hover:bg-brand-orange/15 transition-colors"
                              >
                                <span>{link.label}</span>
                                <ArrowUpRight className="w-3 h-3 text-brand-orange" />
                              </Link>
                            );
                          })}
                        </div>
                      )}

                      {/* Direct Fallback Contact Box when Answer is Unavailable */}
                      {!isUser && msg.isFallback && (
                        <div className="mt-3 rounded-xl bg-[#0B0E29] text-white p-3 space-y-2 text-[11px]">
                          <div className="font-heading font-bold text-brand-orange uppercase tracking-wider text-[10px]">
                            Direct Lijemrakel Contact Desk
                          </div>
                          <div className="flex items-center gap-2 text-white/90">
                            <PhoneCall className="w-3.5 h-3.5 text-brand-orange shrink-0" />
                            <a
                              href="tel:0913514767"
                              className="font-bold hover:text-brand-orange underline"
                            >
                              0913514767
                            </a>
                          </div>
                          <div className="flex items-center gap-2 text-white/90">
                            <Mail className="w-3.5 h-3.5 text-brand-orange shrink-0" />
                            <span>inquiries@lijemrakel.com</span>
                          </div>
                          <div className="flex items-start gap-2 text-white/80">
                            <MapPin className="w-3.5 h-3.5 text-brand-orange shrink-0 mt-0.5" />
                            <span>
                              Debrewerk Tower | Mexico | ደብረወርቅ ህንጻ | ሜክሲኮ
                            </span>
                          </div>
                          <div className="pt-1">
                            <a
                              href={liveWhatsappUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-orange text-[#0B0E29] font-heading font-extrabold text-[11px] hover:bg-white transition-colors"
                            >
                              <WhatsAppIcon className="w-3.5 h-3.5" />
                              <span>Contact Us on WhatsApp</span>
                            </a>
                          </div>
                        </div>
                      )}

                      {/* Timestamp */}
                      <div
                        className={`mt-1.5 text-[10px] ${
                          isUser ? 'text-white/55 text-right' : 'text-brand-muted'
                        }`}
                      >
                        {formatTime(msg.timestamp)}
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#0B0E29] text-brand-orange flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  </div>
                  <div className="rounded-2xl bg-white border border-brand-border/80 px-3.5 py-2.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-bounce [animation-delay:120ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-bounce [animation-delay:240ms]" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* 4. Quick-Reply Suggestion Chips */}
            <div className="bg-white border-t border-brand-border/70 px-3.5 py-2.5 shrink-0">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
                {activeSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => handleSendQuery(suggestion)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FAF9F5] border border-brand-border text-[11px] font-semibold text-brand-navy hover:bg-brand-orange hover:text-brand-navy hover:border-brand-orange transition-colors whitespace-nowrap shrink-0"
                  >
                    <span>{suggestion}</span>
                    <ChevronRight className="w-3 h-3 text-brand-orange" />
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendQuery(inputValue);
              }}
              className="bg-white border-t border-brand-border/80 p-3 flex items-center gap-2 shrink-0"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about products, poultry, leadership, contact..."
                aria-label="Ask Orbit Assistant a question"
                className="flex-1 text-xs sm:text-[13px] bg-[#FAF9F5] border border-brand-border rounded-full px-4 py-2.5 text-brand-navy placeholder:text-brand-muted focus:outline-none focus:border-brand-orange focus:bg-white transition-colors"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                aria-label="Send message"
                className="w-9 h-9 rounded-full bg-[#0B0E29] text-brand-orange flex items-center justify-center hover:bg-brand-orange hover:text-brand-navy disabled:opacity-40 transition-colors shrink-0 shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================================
          VISITOR GREETING TEASER CALLOUT (Animated Floating Prompt)
      ===================================================================== */}
      <AnimatePresence>
        {!isOpen && showTeaser && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ delay: 0.8, duration: 0.35 }}
            className="hidden sm:flex items-center gap-2.5 mb-3 bg-white text-brand-navy px-4 py-2.5 rounded-2xl shadow-lg border border-brand-orange/40 max-w-[270px]"
          >
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="text-left text-xs leading-snug font-medium text-brand-navy hover:text-brand-orange transition-colors"
            >
              <span className="font-heading font-extrabold block text-[#0B0E29]">
                Need product or trade info?
              </span>
              <span className="text-[11px] text-brand-muted">
                Chat with Orbit Assistant or WhatsApp
              </span>
            </button>
            <button
              type="button"
              onClick={() => setShowTeaser(false)}
              aria-label="Dismiss greeting"
              className="p-1 rounded-full text-brand-muted hover:text-brand-navy hover:bg-[#FAF9F5] transition-colors shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================================
          FLOATING ACTION ROW: WHATSAPP QUICK PILL + ANIMATED ORBIT LAUNCHER
      ===================================================================== */}
      <div className="flex items-center gap-2.5">
        {/* Quick Floating WhatsApp Button */}
        {!isOpen && (
          <motion.a
            href={liveWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.06, y: -2 }}
            whileTap={{ scale: 0.95 }}
            title={`Contact Us on WhatsApp (${liveWhatsappNumber})`}
            aria-label="Contact Us on WhatsApp"
            className="flex items-center gap-2 rounded-full bg-[#0B0E29] text-white px-3.5 py-3 shadow-xl border-2 border-[#D4AF37] hover:bg-brand-orange hover:text-[#0B0E29] hover:border-brand-orange transition-colors"
          >
            <span className="w-6 h-6 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-xs">
              <WhatsAppIcon className="w-3.5 h-3.5" />
            </span>
            <span className="hidden md:inline font-heading text-xs font-extrabold tracking-tight">
              WhatsApp
            </span>
          </motion.a>
        )}

        {/* Animated Orbit Assistant Launcher Button */}
        <motion.button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          animate={isOpen ? { y: 0 } : { y: [0, -4, 0] }}
          transition={
            isOpen
              ? { duration: 0.2 }
              : { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }
          }
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={isOpen ? 'Close Orbit Assistant' : 'Open Orbit Assistant'}
          className="group relative flex items-center gap-2.5 rounded-full bg-[#0B0E29] text-white pl-3.5 pr-4 py-2.5 shadow-2xl border-2 border-brand-orange hover:bg-brand-orange hover:text-[#0B0E29] transition-colors"
        >
          {/* Animated Pulse Halo Ring */}
          {!isOpen && (
            <span className="absolute -inset-1 rounded-full border border-brand-orange/60 animate-ping pointer-events-none opacity-40" />
          )}

          <motion.span
            animate={isOpen ? { rotate: 0 } : { rotate: [0, 10, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-brand-orange to-[#D4AF37] text-[#0B0E29] group-hover:bg-[#0B0E29] group-hover:from-[#0B0E29] group-hover:to-[#0B0E29] group-hover:text-brand-orange transition-colors shadow-xs"
          >
            {isOpen ? (
              <X className="w-4 h-4 stroke-[2.5]" />
            ) : (
              <OrbitEmblemIcon className="w-5 h-5" />
            )}
          </motion.span>

          <span className="font-heading text-xs font-extrabold tracking-tight">
            {isOpen ? 'Close Chat' : liveAssistantName}
          </span>

          {!isOpen && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          )}
        </motion.button>
      </div>
    </div>
  );
}
