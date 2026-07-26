import { BookOpen, Brain, Target, Mic, ClipboardList, Share2 } from 'lucide-react';

// Placeholder-driven templates. Tokens like {notebookName}, {topConcept},
// {conceptA}, {conceptB} are resolved by buildSuggestions(). Today they fall
// back to sensible static defaults; a future indexing pass can supply real
// extracted values (top concept, concept pairs, etc.) without touching the UI.
const TEMPLATES = [
  {
    id: 'summarize',
    icon: BookOpen,
    titleTemplate: 'Summarize {notebookName}',
    promptTemplate: 'Summarize the key ideas across all sources in {notebookName}.',
    description: 'Get a concise overview of everything',
    accent: 'blue',
  },
  {
    id: 'explain',
    icon: Brain,
    titleTemplate: 'Explain {topConcept}',
    promptTemplate: 'Explain {topConcept} in detail using the sources in this notebook.',
    description: 'Break down the core ideas',
    accent: 'violet',
  },
  {
    id: 'roadmap',
    icon: Target,
    titleTemplate: 'Create a personalized learning roadmap',
    promptTemplate: 'Create a personalized learning roadmap based on the sources in this notebook.',
    description: 'A step-by-step study plan',
    accent: 'emerald',
  },
  {
    id: 'podcast',
    icon: Mic,
    titleTemplate: 'Generate a podcast from these sources',
    promptTemplate: 'Generate a podcast from the sources in this notebook.',
    description: 'Listen to your notebook',
    accent: 'rose',
  },
  {
    id: 'quiz',
    icon: ClipboardList,
    titleTemplate: 'Quiz me on {notebookName}',
    promptTemplate: 'Quiz me on the material in {notebookName}.',
    description: 'Test what you know',
    accent: 'amber',
  },
  {
    id: 'graph',
    icon: Share2,
    titleTemplate: 'Explore the knowledge graph',
    promptTemplate: 'Explore the knowledge graph for this notebook.',
    description: 'See how ideas connect',
    accent: 'cyan',
  },
];
function resolve(template, vars) {
  return template.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? `{${key}}`);
}
export function buildSuggestions(input) {
  const vars = {
    notebookName: input?.notebookName ?? 'this notebook',
    topConcept: input?.topConcept ?? 'the key concepts',
    conceptA: input?.conceptA ?? 'props',
    conceptB: input?.conceptB ?? 'state',
  };
  return TEMPLATES.map((t) => ({
    id: t.id,
    icon: t.icon,
    title: resolve(t.titleTemplate, vars),
    prompt: resolve(t.promptTemplate, vars),
    description: t.description,
    accent: t.accent,
  }));
}
