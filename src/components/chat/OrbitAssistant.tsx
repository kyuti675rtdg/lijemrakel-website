'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Send,
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
 * Solaria Sunset Chatbot Talk Animated Vector Icon
 * Sourced from solaria-sunset-chatbot-talk.svg with dynamic state support
 */
function OrbitEmblemIcon({
  className = 'w-8 h-8',
  mode = 'talk',
}: {
  className?: string;
  mode?: 'idle' | 'wave' | 'think' | 'talk';
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      width="100%"
      height="100%"
      className={`solaria-bot-svg overflow-visible ${className}`}
      data-mode={mode}
      aria-hidden="true"
    >
      <defs>
        {/* Outer Speech Bubble / Sunset Silhouette Gradient */}
        <linearGradient id="bubbleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF3366" />
          <stop offset="42%" stopColor="#FF5E62" />
          <stop offset="78%" stopColor="#FF8C38" />
          <stop offset="100%" stopColor="#FFC837" />
        </linearGradient>

        {/* Specular Sheen for Speech Bubble */}
        <linearGradient id="bubbleGloss" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
          <stop offset="40%" stopColor="#FFAE34" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>

        {/* Helmet Outer Ceramic Shell (Sunset bounced pearl white) */}
        <linearGradient id="helmetShellGrad" x1="25%" y1="0%" x2="75%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="65%" stopColor="#FFF3EC" />
          <stop offset="100%" stopColor="#F9D4C2" />
        </linearGradient>

        {/* Visor Cavity Rim Shadow */}
        <linearGradient id="visorBezelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E5CFBE" />
          <stop offset="100%" stopColor="#A58475" />
        </linearGradient>

        {/* Visor High-Tech Dark Glass Surface */}
        <linearGradient id="visorGlassGrad" x1="10%" y1="0%" x2="90%" y2="100%">
          <stop offset="0%" stopColor="#2D193E" />
          <stop offset="50%" stopColor="#1B0F28" />
          <stop offset="100%" stopColor="#11091A" />
        </linearGradient>

        {/* Radiant Sunset Neon for Visor Expressions (Eyes & Mouth) */}
        <linearGradient id="neonSunsetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFEF8A" />
          <stop offset="35%" stopColor="#FFB338" />
          <stop offset="75%" stopColor="#FF5E62" />
          <stop offset="100%" stopColor="#FF2E83" />
        </linearGradient>

        {/* Headphone Ear-Cushions Gradient */}
        <linearGradient
          id="headphoneCushionGrad"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#E2D0C5" />
          <stop offset="100%" stopColor="#9C8277" />
        </linearGradient>

        {/* Headset Outer Dark Pivot Rings */}
        <linearGradient
          id="headphoneCapGrad"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#3C1A52" />
          <stop offset="100%" stopColor="#160924" />
        </linearGradient>

        {/* Visor Curved Specular Glass Flare */}
        <linearGradient
          id="visorReflectionGrad"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.36" />
          <stop offset="35%" stopColor="#FFFFFF" stopOpacity="0.12" />
          <stop offset="85%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>

        {/* Filters */}
        <filter
          id="neonVisorGlow"
          x="-30%"
          y="-30%"
          width="160%"
          height="160%"
        >
          <feGaussianBlur stdDeviation="2.8" result="blur1" />
          <feGaussianBlur stdDeviation="6.5" result="blur2" />
          <feMerge>
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter
          id="botDropShadow"
          x="-20%"
          y="-20%"
          width="140%"
          height="150%"
        >
          <feDropShadow
            dx="0"
            dy="14"
            stdDeviation="15.4"
            floodColor="#3A0825"
            floodOpacity="0.32"
          />
        </filter>

        <style>{`
          .solaria-bot-svg {
            --bot-speed: 3.2s;
          }
          .solaria-bot-svg .bot-levitate {
            transform-origin: 100px 96px;
            animation: solariaFloat var(--bot-speed) ease-in-out infinite;
          }
          .solaria-bot-svg .eyes-container {
            transform-origin: 100px 92px;
            animation: solariaBlink var(--bot-speed) ease-in-out infinite;
          }
          .solaria-bot-svg .sonic-wave {
            transform-origin: 100px 96px;
            animation: solariaSonic 2.2s ease-out infinite;
          }
          .solaria-bot-svg .sonic-wave-2 {
            animation: solariaSonic 2.2s ease-out 0.4s infinite;
          }
          .solaria-bot-svg[data-mode="idle"] .bot-levitate {
            animation: solariaFloat var(--bot-speed) ease-in-out infinite;
          }
          .solaria-bot-svg[data-mode="wave"] .bot-levitate {
            animation: solariaWaveBounce 1.2s cubic-bezier(0.36, 0.07, 0.19, 0.97) infinite;
          }
          .solaria-bot-svg[data-mode="wave"] .eyes-container {
            animation: solariaHappySquint 1.2s ease-in-out infinite;
          }
          .solaria-bot-svg[data-mode="wave"] .mouth-path {
            animation: solariaBigGrin 1.2s ease-in-out infinite;
          }
          .solaria-bot-svg[data-mode="think"] .bot-levitate {
            animation: solariaThinkTilt 2.4s ease-in-out infinite;
          }
          .solaria-bot-svg[data-mode="think"] .radar-ring {
            display: block !important;
            transform-origin: 100px 92px;
            animation: solariaRadarScan 1.8s linear infinite;
          }
          .solaria-bot-svg[data-mode="think"] .eyes-container {
            animation: solariaThinkEyes 1.8s ease-in-out infinite;
          }
          .solaria-bot-svg[data-mode="talk"] .bot-levitate {
            animation: solariaTalkJiggle 0.6s ease-in-out infinite alternate;
          }
          .solaria-bot-svg[data-mode="talk"] .mouth-path {
            animation: solariaTalkMouth 0.45s ease-in-out infinite alternate;
            transform-origin: 100px 112px;
          }
          @keyframes solariaFloat {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            40% { transform: translateY(-4.5px) rotate(1deg); }
            75% { transform: translateY(2.5px) rotate(-0.8deg); }
          }
          @keyframes solariaBlink {
            0%, 46%, 50%, 94%, 98%, 100% { transform: scaleY(1); }
            48%, 96% { transform: scaleY(0.08); }
          }
          @keyframes solariaSonic {
            0% { opacity: 0.8; stroke-dashoffset: 0; }
            50% { opacity: 0.2; }
            100% { opacity: 0; stroke-dashoffset: 20; }
          }
          @keyframes solariaWaveBounce {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            25% { transform: translateY(-7px) rotate(2.5deg); }
            50% { transform: translateY(0px) rotate(-1deg); }
            75% { transform: translateY(-4px) rotate(1.8deg); }
          }
          @keyframes solariaHappySquint {
            0%, 100% { transform: scaleY(0.4) scaleX(1.15) translateY(2px); }
            50% { transform: scaleY(0.65) scaleX(1.05) translateY(0); }
          }
          @keyframes solariaBigGrin {
            0%, 100% { transform: scale(1.12); }
            50% { transform: scale(1.22) translateY(-0.5px); }
          }
          @keyframes solariaThinkTilt {
            0%, 100% { transform: rotate(-3deg) translateY(0); }
            50% { transform: rotate(2.5deg) translateY(-3px); }
          }
          @keyframes solariaThinkEyes {
            0%, 100% { transform: translate(-3px, -1px); }
            50% { transform: translate(3px, 1px); }
          }
          @keyframes solariaRadarScan {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes solariaTalkJiggle {
            0% { transform: translateY(-1.5px) rotate(-0.5deg); }
            100% { transform: translateY(1.5px) rotate(0.8deg); }
          }
          @keyframes solariaTalkMouth {
            0% { transform: scale(1, 0.7); }
            50% { transform: scale(1.15, 1.35) translateY(-1px); }
            100% { transform: scale(0.92, 1.1); }
          }
        `}</style>
      </defs>

      {/* 1. Exterior Silhouette: Speech Bubble Outline with Soft Shadow */}
      <g className="speech-silhouette">
        <path
          d="M 100, 14 C 148, 14 186, 52 186, 100 C 186, 124 176, 145 160, 161 C 155, 166 150, 175 153, 182 C 156, 188 161, 192 167, 195 C 146, 194 129, 183 115, 178 C 110, 177 105, 176 100, 176 C 52, 176 14, 138 14, 90 C 14, 42 52, 14 100, 14 Z"
          fill="url(#bubbleGrad)"
        />
        <path
          d="M 100, 17 C 145, 17 182, 53 182, 98 C 182, 115 176, 132 166, 147 C 153, 104 115, 64 64, 44 C 75, 27 87, 17 100, 17 Z"
          fill="url(#bubbleGloss)"
        />
        <circle cx="156" cy="171" r="1.5" fill="#FFFFFF" opacity="0.75" />
        <circle cx="172" cy="182" r="1.2" fill="#FFC837" opacity="0.9" />
      </g>

      {/* 2. Floating Animated Robot Head Assembly */}
      <g className="bot-levitate" filter="url(#botDropShadow)">
        {/* Sonic Wave Pulses around Antennae */}
        <path
          className="sonic-wave"
          d="M 29 78 A 14 14 0 0 0 29 102"
          fill="none"
          stroke="url(#neonSunsetGrad)"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          className="sonic-wave-2"
          d="M 24 74 A 20 20 0 0 0 24 106"
          fill="none"
          stroke="#FFC837"
          strokeWidth="1.1"
          strokeLinecap="round"
          opacity="0.6"
        />
        <path
          className="sonic-wave"
          d="M 171 78 A 14 14 0 0 1 171 102"
          fill="none"
          stroke="url(#neonSunsetGrad)"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          className="sonic-wave-2"
          d="M 176 74 A 20 20 0 0 1 176 106"
          fill="none"
          stroke="#FFC837"
          strokeWidth="1.1"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* Left Ear Speaker Assembly */}
        <g className="ear-left">
          <line
            x1="35"
            y1="84"
            x2="35"
            y2="67"
            stroke="#251236"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <circle
            cx="35"
            cy="65.5"
            r="2.2"
            fill="#FFC837"
            filter="url(#neonVisorGlow)"
          />
          <rect
            x="37.5"
            y="70"
            width="14"
            height="40"
            rx="7"
            fill="url(#headphoneCushionGrad)"
          />
          <circle cx="35" cy="90" r="6.8" fill="url(#headphoneCapGrad)" />
          <circle cx="35" cy="90" r="2.4" fill="#FFC837" />
        </g>

        {/* Right Ear Speaker Assembly */}
        <g className="ear-right">
          <line
            x1="165"
            y1="84"
            x2="165"
            y2="67"
            stroke="#251236"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <circle
            cx="165"
            cy="65.5"
            r="2.2"
            fill="#FF3366"
            filter="url(#neonVisorGlow)"
          />
          <rect
            x="148.5"
            y="70"
            width="14"
            height="40"
            rx="7"
            fill="url(#headphoneCushionGrad)"
          />
          <circle cx="165" cy="90" r="6.8" fill="url(#headphoneCapGrad)" />
          <circle cx="165" cy="90" r="2.4" fill="#FF5E62" />
        </g>

        {/* Outer Helmet Bezel (Shadow Recess) */}
        <path
          d="M 100, 37 C 138, 37 162, 60 162, 95 C 162, 123 139, 142 100, 142 C 61, 142 38, 123 38, 95 C 38, 60 62, 37 100, 37 Z"
          fill="url(#visorBezelGrad)"
        />

        {/* Helmet Front Shell (Pearl Shell) */}
        <path
          d="M 100, 38 C 136, 38 159.5, 60 159.5, 93.5 C 159.5, 120.5 137.5, 139 100, 139 C 62.5, 139 40.5, 120.5 40.5, 93.5 C 40.5, 60 64, 38 100, 38 Z"
          fill="url(#helmetShellGrad)"
        />

        {/* Dark Visor Well (Inner Bezel Shadow) */}
        <path
          d="M 100, 50 C 131, 50 147, 67 147, 94 C 147, 116 129, 130 100, 130 C 71, 130 53, 116 53, 94 C 53, 67 69, 50 100, 50 Z"
          fill="#12081d"
          opacity="0.8"
        />

        {/* Visor Screen Face (Deep Twilight Obsidian) */}
        <path
          d="M 100, 51 C 129, 51 144.5, 67 144.5, 93.5 C 144.5, 114.5 127.5, 128 100, 128 C 72.5, 128 55.5, 114.5 55.5, 93.5 C 55.5, 67 71, 51 100, 51 Z"
          fill="url(#visorGlassGrad)"
        />

        {/* Curved Specular Glass Flare on Visor */}
        <path
          d="M 61, 81 C 67, 62 84, 53 100, 53 C 116, 53 133, 62 139, 81 C 124, 68 111, 64 100, 64 C 89, 64 76, 68 61, 81 Z"
          fill="url(#visorReflectionGrad)"
        />

        {/* Visor Horizon Warmth Underglow */}
        <ellipse
          cx="100"
          cy="123"
          rx="32"
          ry="5"
          fill="url(#bubbleGrad)"
          opacity="0.28"
          filter="url(#neonVisorGlow)"
        />

        {/* Thinking Radar Scan Arc */}
        <circle
          className="radar-ring"
          cx="100"
          cy="92"
          r="30"
          fill="none"
          stroke="url(#neonSunsetGrad)"
          strokeWidth="1.5"
          strokeDasharray="14 36"
          opacity="0.7"
          style={{ display: 'none' }}
        />

        {/* 3. Expressive Glowing Eyes & Mouth Components */}
        <g className="eyes-container" filter="url(#neonVisorGlow)">
          <g className="eye-left" transform="translate(75, 89)">
            <circle cx="0" cy="0" r="6.8" fill="url(#neonSunsetGrad)" />
            <circle cx="-2" cy="-2.2" r="2.2" fill="#FFFFFF" opacity="0.95" />
          </g>
          <g className="eye-right" transform="translate(125, 89)">
            <circle cx="0" cy="0" r="6.8" fill="url(#neonSunsetGrad)" />
            <circle cx="-2" cy="-2.2" r="2.2" fill="#FFFFFF" opacity="0.95" />
          </g>
        </g>

        {/* Glowing Cheerful Mouth Path */}
        <path
          className="mouth-path"
          d="M 90.5, 105.5 C 93.5, 113 106.5, 113 109.5, 105.5 C 107, 109 93, 109 90.5, 105.5 Z"
          fill="url(#neonSunsetGrad)"
          filter="url(#neonVisorGlow)"
        />

        {/* Cheeks Blush Warmth */}
        <ellipse
          cx="64"
          cy="100"
          rx="4.8"
          ry="2.8"
          fill="#FF5E62"
          opacity="0.32"
          filter="url(#neonVisorGlow)"
        />
        <ellipse
          cx="136"
          cy="100"
          rx="4.8"
          ry="2.8"
          fill="#FF5E62"
          opacity="0.32"
          filter="url(#neonVisorGlow)"
        />
      </g>
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
                <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
                  <OrbitEmblemIcon
                    className="w-11 h-11 drop-shadow-md"
                    mode={isTyping ? 'think' : 'talk'}
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0B0E29]" />
                </div>
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
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        isUser
                          ? 'bg-[#0B0E29] text-white'
                          : 'bg-transparent'
                      }`}
                    >
                      {isUser ? (
                        <User className="w-3.5 h-3.5" />
                      ) : (
                        <OrbitEmblemIcon className="w-8 h-8" mode="idle" />
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
                  <div className="w-8 h-8 flex items-center justify-center shrink-0">
                    <OrbitEmblemIcon className="w-8 h-8" mode="think" />
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
          STANDALONE FLOATING BOT ICON LAUNCHER (NO RECTANGLE BOX OR WHATSAPP PILL)
      ===================================================================== */}
      <motion.button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        aria-label={isOpen ? 'Close Orbit Assistant' : 'Open Orbit Assistant'}
        title={isOpen ? 'Close Orbit Assistant' : `Chat with ${liveAssistantName}`}
        className="group relative flex items-center justify-center bg-transparent border-0 p-0 shadow-none focus:outline-none cursor-pointer"
      >
        <OrbitEmblemIcon
          className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-[0_10px_24px_rgba(11,14,41,0.28)] transition-transform duration-300"
          mode={isOpen ? 'idle' : 'talk'}
        />
      </motion.button>
    </div>
  );
}
