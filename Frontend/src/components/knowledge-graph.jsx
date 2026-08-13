import { useState } from 'react';
import { motion } from 'framer-motion';
import { graphNodes, graphEdges, sources } from '@/lib/data';
import { sourceIcon, sourceTypeLabel } from '@/lib/source-meta'
import { cn } from '@/lib/utils';
const groupColor = {
  core: 'hsl(239 84% 67%)',
  state: 'hsl(280 70% 65%)',
  perf: 'hsl(160 70% 50%)',
};
export function KnowledgeGraph() {
  const [selected, setSelected] = useState(graphNodes.find((n) => n.id === 'g7') ?? null);
  const relatedSources = selected
    ? sources.filter((s) => selected.relatedSources.includes(s.id))
    : [];
  return (
    <div className={'flex h-full flex-col'}>
      <div className={'relative flex-1 overflow-hidden'}>
        <svg
          viewBox={'0 0 100 100'}
          className={'h-full w-full'}
          preserveAspectRatio={'xMidYMid meet'}
        >
          {graphEdges.map((edge, i) => {
            const from = graphNodes.find((n) => n.id === edge.from);
            const to = graphNodes.find((n) => n.id === edge.to);
            const isActive = selected?.id === edge.from || selected?.id === edge.to;
            const midX = (from.x + to.x) / 2;
            // curved path
            const d = `M ${from.x} ${from.y} Q ${midX} ${(from.y + to.y) / 2 - 4} ${to.x} ${to.y}`;
            return (
              <path
                d={d}
                fill={'none'}
                stroke={isActive ? 'hsl(239 84% 67%)' : 'hsl(240 6% 22%)'}
                strokeWidth={isActive ? 0.5 : 0.3}
                strokeOpacity={isActive ? 0.9 : 0.6}
                className={'transition-all duration-300'}
              />
            );
          })}
        </svg>
        {graphNodes.map((node) => {
          const isSelected = selected?.id === node.id;
          const isConnected = selected
            ? graphEdges.some(
                (e) =>
                  (e.from === selected.id && e.to === node.id) ||
                  (e.to === selected.id && e.from === node.id),
              )
            : false;
          const dimmed = selected && !isSelected && !isConnected;
          return (
            <button
              onClick={() => setSelected(node)}
              className={'absolute -translate-x-1/2 -translate-y-1/2'}
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
              }}
            >
              <motion.div
                whileHover={{
                  scale: 1.08,
                }}
                animate={{
                  opacity: dimmed ? 0.35 : 1,
                  scale: isSelected ? 1.1 : 1,
                }}
                transition={{
                  duration: 0.25,
                }}
                className={cn(
                  'flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[0.75rem] font-medium transition-colors',
                  isSelected
                    ? 'border-primary/50 bg-primary/15 text-foreground shadow-glow'
                    : 'border-border bg-card/80 text-muted-foreground hover:border-border-strong hover:text-foreground',
                )}
                style={
                  isSelected
                    ? {
                        boxShadow: `0 0 0 1px ${groupColor[node.group]}40`,
                      }
                    : undefined
                }
              >
                <span
                  className={'h-1.5 w-1.5 rounded-full'}
                  style={{
                    backgroundColor: groupColor[node.group],
                  }}
                />
                {node.label}
              </motion.div>
            </button>
          );
        })}
        <div
          className={
            'absolute bottom-3 left-3 flex flex-col gap-1 rounded-lg border border-border bg-popover/80 px-2.5 py-2 backdrop-blur-sm'
          }
        >
          {Object.entries(groupColor).map(([group, color]) => (
            <div className={'flex items-center gap-1.5 text-[0.625rem] text-muted-foreground'}>
              <span
                className={'h-1.5 w-1.5 rounded-full'}
                style={{
                  backgroundColor: color,
                }}
              />
              <span className={'capitalize'}>{group}</span>
            </div>
          ))}
        </div>
      </div>
      {selected && (
        <motion.div
          initial={{
            height: 0,
            opacity: 0,
          }}
          animate={{
            height: 'auto',
            opacity: 1,
          }}
          className={'shrink-0 border-t border-border bg-card/40'}
        >
          <div className={'px-4 py-3'}>
            <p
              className={
                'text-[0.6875rem] font-medium uppercase tracking-wider text-muted-foreground-dim'
              }
            >
              Sources linked to {selected.label}
            </p>
            <div className={'mt-2 space-y-1.5'}>
              {relatedSources.length === 0 ? (
                <p className={'text-[0.75rem] text-muted-foreground'}>No linked sources yet.</p>
              ) : (
                relatedSources.map((s) => {
                  const Icon = sourceIcon[s.type];
                  return (
                    <div
                      className={
                        'flex items-center gap-2.5 rounded-lg border border-border bg-muted/20 px-2.5 py-2'
                      }
                    >
                      <Icon className={'h-3.5 w-3.5 text-muted-foreground'} />
                      <span className={'flex-1 truncate text-[0.75rem]'}>{s.title}</span>
                      <span className={'text-[0.625rem] text-muted-foreground-dim'}>
                        {sourceTypeLabel[s.type]}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
