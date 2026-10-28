import knowledgeBaseData from '@/data/orbitKnowledgeBase.json';
import { CATALOGUE_PRODUCTS } from '@/data/catalogueProducts';
import { MANAGEMENT_TEAM } from '@/data/leadershipData';
import { NEWS_ARTICLES } from '@/data/newsData';

export const ORBIT_WHATSAPP_MESSAGE =
  'Hello, I’m contacting Lijemrakel Trading PLC. I’d like to know more about your products and services.';

export const ORBIT_WHATSAPP_URL = `https://wa.me/251913514767?text=${encodeURIComponent(
  ORBIT_WHATSAPP_MESSAGE
)}`;

export interface OrbitChatLink {
  label: string;
  href: string;
}

export interface OrbitChatMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: string;
  links?: OrbitChatLink[];
  suggestions?: string[];
  isFallback?: boolean;
}

export interface OrbitAssistantReply {
  answer: string;
  links: OrbitChatLink[];
  suggestions: string[];
  isFallback: boolean;
  matchedTopicId?: string;
}

/**
 * Future-ready interface: allows swapping or chaining the client-side engine
 * with a real AI model / API endpoint later without changing UI components.
 */
export interface OrbitChatProvider {
  name: string;
  generateReply(
    userQuery: string,
    history?: OrbitChatMessage[]
  ): Promise<OrbitAssistantReply>;
}

const STOP_WORDS = new Set([
  'a',
  'an',
  'the',
  'is',
  'are',
  'was',
  'were',
  'be',
  'been',
  'to',
  'of',
  'in',
  'for',
  'on',
  'with',
  'at',
  'by',
  'from',
  'as',
  'into',
  'can',
  'could',
  'would',
  'should',
  'do',
  'does',
  'did',
  'please',
  'tell',
  'me',
  'give',
  'show',
  'i',
  'we',
  'you',
  'your',
  'our',
  'have',
  'has',
  'it',
  'this',
  'that',
]);

function normalizeText(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^\w\s\u1200-\u137F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(input: string): string[] {
  return normalizeText(input)
    .split(' ')
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
}

/**
 * Compute Levenshtein edit distance between two strings for fuzzy matching.
 */
function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = Array.from({ length: a.length + 1 }, () =>
    new Array(b.length + 1).fill(0)
  );

  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[a.length][b.length];
}

/**
 * Fuzzy similarity score between 0 and 1 for two single words.
 */
function wordSimilarity(wordA: string, wordB: string): number {
  if (wordA === wordB) return 1;
  if (wordA.length >= 4 && wordB.includes(wordA)) return 0.9;
  if (wordB.length >= 4 && wordA.includes(wordB)) return 0.9;

  const maxLen = Math.max(wordA.length, wordB.length);
  if (maxLen < 4) return 0;
  const dist = levenshteinDistance(wordA, wordB);
  const ratio = 1 - dist / maxLen;
  return ratio >= 0.72 ? ratio : 0;
}

/**
 * Score a phrase/keyword against the normalized user query and tokens.
 */
function scoreKeywordMatch(
  normalizedQuery: string,
  queryTokens: string[],
  keyword: string
): number {
  const normKeyword = normalizeText(keyword);
  if (!normKeyword) return 0;

  // Exact full phrase inclusion
  if (normalizedQuery === normKeyword) return 12;
  if (normalizedQuery.includes(normKeyword)) {
    return normKeyword.includes(' ') ? 9 : 6;
  }

  // Token-level exact or fuzzy match
  const keywordTokens = normKeyword.split(' ').filter(Boolean);
  let matchedScore = 0;

  for (const kwToken of keywordTokens) {
    let bestTokenSim = 0;
    for (const qToken of queryTokens) {
      const sim = wordSimilarity(qToken, kwToken);
      if (sim > bestTokenSim) bestTokenSim = sim;
    }
    if (bestTokenSim === 1) {
      matchedScore += 4.5;
    } else if (bestTokenSim >= 0.75) {
      matchedScore += 3.2 * bestTokenSim;
    }
  }

  return matchedScore;
}

/**
 * 1. Check if the user is asking about a specific individual leader by name.
 */
function matchSpecificLeader(
  normalizedQuery: string,
  queryTokens: string[]
): OrbitAssistantReply | null {
  for (const leader of MANAGEMENT_TEAM) {
    const nameTokens = tokenize(leader.name);
    let score = 0;

    for (const nToken of nameTokens) {
      for (const qToken of queryTokens) {
        if (wordSimilarity(qToken, nToken) >= 0.8) {
          score += 6;
        }
      }
    }

    if (score >= 6 || normalizedQuery.includes(normalizeText(leader.name))) {
      const responsibilitiesList = leader.responsibilities
        .map((r) => `• ${r}`)
        .join('\n');

      return {
        answer: `**${leader.displayName}** — *${leader.roleTitle}*\n(${leader.department})\n\n${leader.summary}\n\n**Key Responsibilities:**\n${responsibilitiesList}`,
        links: [
          { label: 'View Leadership Page', href: '/about/leadership' },
          { label: 'Contact Management', href: '/contact' },
        ],
        suggestions: [
          'Who are the Founding Members?',
          'What is your 5-year strategy?',
          'How can I contact Lijemrakel?',
        ],
        isFallback: false,
        matchedTopicId: `leader-${leader.id}`,
      };
    }
  }

  return null;
}

/**
 * 2. Check if the user is asking about a specific product in CATALOGUE_PRODUCTS.
 */
function matchSpecificProduct(
  normalizedQuery: string,
  queryTokens: string[]
): OrbitAssistantReply | null {
  let bestProduct = null;
  let bestScore = 0;

  for (const product of CATALOGUE_PRODUCTS) {
    const prodNameNorm = normalizeText(product.name);
    // Primary active ingredient / key product identifier (first 1-2 words)
    const primaryKeywords = tokenize(product.name).slice(0, 2);

    let score = 0;
    if (normalizedQuery.includes(prodNameNorm)) {
      score += 15;
    }

    for (const pk of primaryKeywords) {
      if (
        pk.length >= 4 &&
        ![
          'veterinary',
          'oral',
          'injectable',
          'injection',
          'suspension',
          'solution',
          'powder',
          'bolus',
          'vaccine',
          'premix',
          'poultry',
          'livestock',
        ].includes(pk)
      ) {
        for (const qToken of queryTokens) {
          const sim = wordSimilarity(qToken, pk);
          if (sim >= 0.8) {
            score += 8 * sim;
          }
        }
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestProduct = product;
    }
  }

  if (bestProduct && bestScore >= 6.5) {
    return {
      answer: `**${bestProduct.name}** (*${bestProduct.categoryName} — ${bestProduct.subcategory}*)\n\n• **Composition:** ${bestProduct.activeIngredientOrComposition}\n• **Dosage Form & Pack:** ${bestProduct.dosageForm} (${bestProduct.packSize})\n• **Target Species:** ${bestProduct.intendedSpecies.join(', ')}\n• **Overview:** ${bestProduct.approvedIndicationsSummary}\n• **Storage:** ${bestProduct.storageConditions}`,
      links: [
        {
          label: `View ${bestProduct.name}`,
          href: `/products/${bestProduct.slug}`,
        },
        {
          label: 'Inquire About This Product',
          href: '/contact?type=product-inquiry',
        },
      ],
      suggestions: [
        'What other products do you supply?',
        'Tell me about Veterinary Vaccines',
        'How can I request a quote?',
      ],
      isFallback: false,
      matchedTopicId: `product-${bestProduct.id}`,
    };
  }

  return null;
}

/**
 * 3. Client-Side Knowledge Base Provider implementing OrbitChatProvider.
 */
export const ORBIT_ADMIN_KB_STORAGE_KEY = 'lijemrakel_orbit_kb_custom_v1';

export interface OrbitKnowledgeEntry {
  id: string;
  category: string;
  title: string;
  keywords: string[];
  answer: string;
  links: OrbitChatLink[];
  suggestions: string[];
}

function getActiveKnowledgeEntries(): OrbitKnowledgeEntry[] {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(ORBIT_ADMIN_KB_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Ignore storage read errors
    }
  }
  return knowledgeBaseData.entries as OrbitKnowledgeEntry[];
}

export class LocalKnowledgeBaseProvider implements OrbitChatProvider {
  public name = 'OrbitLocalKnowledgeEngine';

  public async generateReply(userQuery: string): Promise<OrbitAssistantReply> {
    const normalizedQuery = normalizeText(userQuery);
    const queryTokens = tokenize(userQuery);
    const activeEntries = getActiveKnowledgeEntries();

    if (!normalizedQuery) {
      return {
        answer:
          'Please type a question or choose one of the quick-reply topics below so I can help you.',
        links: [{ label: 'Explore Products', href: '/products' }],
        suggestions: knowledgeBaseData.assistantMeta.defaultSuggestions,
        isFallback: false,
      };
    }

    // Step A: Check specific executive leader match
    const leaderMatch = matchSpecificLeader(normalizedQuery, queryTokens);
    if (leaderMatch) return leaderMatch;

    // Step B: Check specific catalogue product match
    const productMatch = matchSpecificProduct(normalizedQuery, queryTokens);
    if (productMatch) return productMatch;

    // Step C: Score all entries in orbitKnowledgeBase.json (or admin-updated KB)
    let bestEntry = null;
    let bestScore = 0;

    for (const entry of activeEntries) {
      let entryScore = 0;

      for (const kw of entry.keywords) {
        const kwScore = scoreKeywordMatch(normalizedQuery, queryTokens, kw);
        if (kwScore > 0) {
          entryScore += kwScore;
        }
      }

      // Title similarity bonus
      const titleScore = scoreKeywordMatch(
        normalizedQuery,
        queryTokens,
        entry.title
      );
      entryScore += titleScore * 0.5;

      if (entryScore > bestScore) {
        bestScore = entryScore;
        bestEntry = entry;
      }
    }

    if (bestEntry && bestScore >= 3.0) {
      return {
        answer: bestEntry.answer,
        links: bestEntry.links || [],
        suggestions:
          bestEntry.suggestions ||
          knowledgeBaseData.assistantMeta.defaultSuggestions.slice(0, 3),
        isFallback: bestEntry.category === 'guardrail',
        matchedTopicId: bestEntry.id,
      };
    }

    // Step D: Check News Articles if query mentions a news topic
    for (const article of NEWS_ARTICLES) {
      const score = scoreKeywordMatch(
        normalizedQuery,
        queryTokens,
        article.title
      );
      if (score >= 5) {
        return {
          answer: `**${article.title}** (*${article.categoryLabel} — ${article.date}*)\n\n${article.excerpt}`,
          links: [
            { label: 'Read Full Article', href: `/news/${article.slug}` },
            { label: 'All News & Updates', href: '/news' },
          ],
          suggestions: [
            'What products do you supply?',
            'What is your 5-year strategy?',
            'Contact Lijemrakel',
          ],
          isFallback: false,
          matchedTopicId: article.id,
        };
      }
    }

    // Step E: Strict Grounded Fallback (Never invent facts)
    return {
      answer:
        "I don't have verified information on that specific topic in **Lijemrakel Trading PLC**'s public website profile. I only provide facts grounded in our official company, product, poultry & hatchery, leadership, and contact records.\n\nPlease contact our team directly on WhatsApp or phone so the appropriate department can assist you:",
      links: [
        { label: 'Contact Us on WhatsApp', href: ORBIT_WHATSAPP_URL },
        { label: 'Call 0913514767', href: 'tel:0913514767' },
        { label: 'Contact Us Online', href: '/contact' },
      ],
      suggestions: [
        'What products do you supply?',
        'Who is Lijemrakel Trading PLC?',
        'Poultry & Hatchery plans',
        'Where is your office located?',
      ],
      isFallback: true,
      matchedTopicId: 'fallback-unverified',
    };
  }
}

export const defaultOrbitProvider: OrbitChatProvider =
  new LocalKnowledgeBaseProvider();

export const ORBIT_WELCOME_MESSAGE =
  knowledgeBaseData.assistantMeta.welcomeMessage;

export const ORBIT_DEFAULT_SUGGESTIONS =
  knowledgeBaseData.assistantMeta.defaultSuggestions;
