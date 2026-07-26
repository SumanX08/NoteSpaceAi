export const sources = [
  {
    id: 's1',
    title: 'React Documentation — Hooks API Reference',
    type: 'website',
    status: 'ready',
    progress: 100,
    url: 'react.dev/reference/react/hooks',
    addedAt: '2h ago',
    preview: {
      kind: 'website',
      content:
        'Hooks are functions that let you "hook into" React state and lifecycle features from function components. The most common hook is useState, which returns a stateful value and an updater function...',
    },
  },
  {
    id: 's2',
    title: 'Deep Dive into React Rendering Behavior.pdf',
    type: 'pdf',
    status: 'ready',
    progress: 100,
    pages: 48,
    size: '3.2 MB',
    addedAt: '5h ago',
    preview: {
      kind: 'pdf',
      content:
        'React components re-render when their state or props change. However, the rendering model is more nuanced than it first appears. This paper examines reconciliation, memoization, and the cost of unnecessary renders...',
    },
  },
  {
    id: 's3',
    title: 'useEffect Complete Guide — YouTube',
    type: 'youtube',
    status: 'indexing',
    progress: 64,
    duration: '24:18',
    url: 'youtube.com/watch?v=dQw4w9WgXcQ',
    addedAt: 'just now',
    preview: {
      kind: 'youtube',
      content:
        '[0:00] Welcome back. Today we cover useEffect in depth.\n[2:15] The dependency array and when effects run.\n[8:40] Cleanup functions and avoiding memory leaks.\n[15:30] Common pitfalls with stale closures...',
    },
  },
  {
    id: 's4',
    title: 'JSX vs HTML — Reference Notes',
    type: 'text',
    status: 'ready',
    progress: 100,
    size: '12 KB',
    addedAt: '1d ago',
    preview: {
      kind: 'text',
      content:
        'JSX is a syntax extension for JavaScript that looks similar to HTML but compiles down to React.createElement calls. Key differences: className vs class, htmlFor vs for, self-closing tags are required...',
    },
  },
  {
    id: 's5',
    title: 'Frontend Architecture Interview — Transcript',
    type: 'transcript',
    status: 'ready',
    progress: 100,
    duration: '42:05',
    addedAt: '2d ago',
    preview: {
      kind: 'transcript',
      content:
        'Interviewer: Can you explain how React decides what to re-render?\nCandidate: Sure. React walks the component tree and compares the new virtual DOM with the previous one...',
    },
  },
  {
    id: 's6',
    title: 'State Management Patterns.pdf',
    type: 'pdf',
    status: 'failed',
    progress: 0,
    pages: 72,
    size: '8.1 MB',
    addedAt: '3d ago',
    preview: {
      kind: 'pdf',
      content: 'Failed to index — file appears to be corrupted.',
    },
  },
];
export const notebooks = [
  {
    id: 'n1',
    title: 'React Fundamentals',
    emoji: '⚛️',
    description: 'Core concepts, hooks, and rendering model',
    updated: '2m ago',
    sources,
    messages: [
      {
        id: 'm1',
        role: 'user',
        content: 'Explain how React Hooks simplify state management compared to class components.',
        createdAt: '10:42 AM',
      },
      {
        id: 'm2',
        role: 'assistant',
        streaming: false,
        createdAt: '10:42 AM',
        citations: [
          {
            id: 'c1',
            label: 'PDF p.21',
            sourceId: 's2',
            detail: 'Page 21 — Rendering cost',
          },
          {
            id: 'c2',
            label: 'Video 12:43',
            sourceId: 's3',
            detail: 'useEffect cleanup demo',
          },
          {
            id: 'c3',
            label: 'Docs',
            sourceId: 's1',
            detail: 'Hooks API reference',
          },
        ],
        content: `React Hooks **simplify state management** by letting you use state and lifecycle features inside function components, removing the boilerplate of class components [Docs].

### The core problem Hooks solve

In class components, state logic was split across \`constructor\`, \`componentDidMount\`, \`componentDidUpdate\`, and \`componentWillUnmount\`. Hooks consolidate these into a single cohesive model [PDF p.21].

### Three key Hooks

| Hook | Purpose |
| --- | --- |
| \`useState\` | Add local state to a function component |
| \`useEffect\` | Handle side effects and subscriptions |
| \`useMemo\` | Memoize expensive computations |

### Why this matters

With Hooks, related logic stays together instead of being scattered by lifecycle phase. A subscription and its cleanup now live in the same \`useEffect\` call, making bugs far easier to trace [Video 12:43].

> "Hooks let you reuse stateful logic without changing your component hierarchy."

This composability is the real win — you can extract custom Hooks like \`useFetch\` and share them across components without prop drilling or render-prop patterns.`,
      },
    ],
  },
  {
    id: 'n2',
    title: 'Distributed Systems',
    emoji: '🌐',
    description: 'Consensus, replication, and fault tolerance',
    updated: '1h ago',
    sources: sources.slice(0, 3),
    messages: [],
  },
  {
    id: 'n3',
    title: 'Machine Learning Papers',
    emoji: '🧠',
    description: 'Transformer architectures and training',
    updated: '3h ago',
    sources: sources.slice(2, 5),
    messages: [],
  },
  {
    id: 'n4',
    title: 'TypeScript Deep Dive',
    emoji: '📘',
    description: 'Generics, inference, and advanced types',
    updated: '1d ago',
    sources: sources.slice(1, 4),
    messages: [],
  },
  {
    id: 'n5',
    title: 'New Research',
    emoji: '🌱',
    description: 'A fresh workspace — add sources to begin',
    updated: 'just now',
    sources: [],
    messages: [],
  },
];
export const roadmap = [
  {
    id: 'r1',
    title: 'JavaScript',
    status: 'done',
    topics: [
      {
        id: 'r1t1',
        title: 'Variables & Scope',
        status: 'done',
        time: '20 min',
        difficulty: 'Beginner',
        sources: ['s4'],
        description: 'let, const, var and lexical scoping rules.',
      },
      {
        id: 'r1t2',
        title: 'Functions & Closures',
        status: 'done',
        time: '35 min',
        difficulty: 'Beginner',
        sources: ['s4', 's5'],
        description: 'Arrow functions, higher-order functions, and closures.',
      },
      {
        id: 'r1t3',
        title: 'Async & Promises',
        status: 'done',
        time: '45 min',
        difficulty: 'Intermediate',
        sources: ['s4'],
        description: 'Promises, async/await, and the event loop.',
      },
    ],
  },
  {
    id: 'r2',
    title: 'React Fundamentals',
    status: 'in-progress',
    topics: [
      {
        id: 'r2t1',
        title: 'Components & JSX',
        status: 'done',
        time: '30 min',
        difficulty: 'Beginner',
        sources: ['s4', 's1'],
        description: 'Function components, JSX syntax, and rendering.',
      },
      {
        id: 'r2t2',
        title: 'Props & State',
        status: 'done',
        time: '25 min',
        difficulty: 'Beginner',
        sources: ['s1', 's2'],
        description: 'Passing data with props and managing local state.',
      },
      {
        id: 'r2t3',
        title: 'useState & useReducer',
        status: 'in-progress',
        time: '40 min',
        difficulty: 'Intermediate',
        sources: ['s1', 's2'],
        description: 'State hooks and predictable state transitions.',
      },
      {
        id: 'r2t4',
        title: 'useEffect & Side Effects',
        status: 'todo',
        time: '50 min',
        difficulty: 'Intermediate',
        sources: ['s3', 's1'],
        description: 'The effect hook, dependency arrays, and cleanup.',
      },
      {
        id: 'r2t5',
        title: 'Context & Custom Hooks',
        status: 'todo',
        time: '45 min',
        difficulty: 'Advanced',
        sources: ['s1', 's5'],
        description: 'Context API and extracting reusable logic.',
      },
    ],
  },
  {
    id: 'r3',
    title: 'Advanced Patterns',
    status: 'todo',
    topics: [
      {
        id: 'r3t1',
        title: 'Performance & Memoization',
        status: 'todo',
        time: '55 min',
        difficulty: 'Advanced',
        sources: ['s2'],
        description: 'useMemo, useCallback, and React.memo.',
      },
      {
        id: 'r3t2',
        title: 'Suspense & Concurrent',
        status: 'todo',
        time: '60 min',
        difficulty: 'Advanced',
        sources: ['s1', 's2'],
        description: 'Suspense boundaries and concurrent rendering.',
      },
    ],
  },
];
export const podcasts = [
  {
    id: 'p1',
    title: 'React Hooks Deep Dive',
    style: 'teacher',
    voice: 'female',
    duration: '10 min',
    createdAt: '2h ago',
    progress: 100,
  },
  {
    id: 'p2',
    title: 'Components vs Hooks — A Debate',
    style: 'conversation',
    voice: 'mixed',
    duration: '20 min',
    createdAt: '1d ago',
    progress: 35,
  },
  {
    id: 'p3',
    title: 'State Management Quick Revision',
    style: 'revision',
    voice: 'male',
    duration: '5 min',
    createdAt: '3d ago',
    progress: 0,
  },
];
export const graphNodes = [
  {
    id: 'g1',
    label: 'React',
    group: 'core',
    x: 50,
    y: 12,
    level: 0,
    relatedSources: ['s1', 's2'],
  },
  {
    id: 'g2',
    label: 'Components',
    group: 'core',
    x: 50,
    y: 32,
    level: 1,
    relatedSources: ['s4', 's1'],
  },
  {
    id: 'g3',
    label: 'Props',
    group: 'core',
    x: 28,
    y: 48,
    level: 2,
    relatedSources: ['s1', 's2'],
  },
  {
    id: 'g4',
    label: 'State',
    group: 'state',
    x: 72,
    y: 48,
    level: 2,
    relatedSources: ['s2', 's1'],
  },
  {
    id: 'g5',
    label: 'Hooks',
    group: 'state',
    x: 50,
    y: 64,
    level: 3,
    relatedSources: ['s3', 's1'],
  },
  {
    id: 'g6',
    label: 'useState',
    group: 'state',
    x: 32,
    y: 80,
    level: 4,
    relatedSources: ['s1'],
  },
  {
    id: 'g7',
    label: 'useEffect',
    group: 'state',
    x: 50,
    y: 90,
    level: 4,
    relatedSources: ['s3'],
  },
  {
    id: 'g8',
    label: 'useMemo',
    group: 'perf',
    x: 68,
    y: 80,
    level: 4,
    relatedSources: ['s2'],
  },
];
export const graphEdges = [
  {
    from: 'g1',
    to: 'g2',
  },
  {
    from: 'g2',
    to: 'g3',
  },
  {
    from: 'g2',
    to: 'g4',
  },
  {
    from: 'g4',
    to: 'g5',
  },
  {
    from: 'g3',
    to: 'g5',
  },
  {
    from: 'g5',
    to: 'g6',
  },
  {
    from: 'g5',
    to: 'g7',
  },
  {
    from: 'g5',
    to: 'g8',
  },
];
export const recentNotebookTitles = notebooks.map((n) => ({
  id: n.id,
  title: n.title,
  emoji: n.emoji,
  updated: n.updated,
}));
