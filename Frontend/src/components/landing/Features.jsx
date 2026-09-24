import {
  Files,
  Layers,
  Scissors,
  Boxes,
  Database,
  Search,
  BrainCircuit,
  Sparkles,
} from "lucide-react";

const pipeline = [
  { label: "Sources", icon: Files },
  { label: "Extraction", icon: Layers },
  { label: "Chunking", icon: Scissors },
  { label: "Embeddings", icon: Boxes },
  { label: "Vector Database", icon: Database },
  { label: "Retrieval", icon: Search },
  { label: "LLM", icon: BrainCircuit },
  { label: "Grounded Response", icon: Sparkles },
];

function Architecture() {
  return (
    <section
      id="architecture"
      className="relative overflow-hidden bg-[hsl(var(--background))] px-6 py-[120px]"
    >
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[450px] w-[800px] -translate-x-1/2 rounded-full bg-[rgba(37,99,235,0.06)] blur-[120px]" />

      <div className="relative mx-auto max-w-[1100px]">

        {/* Heading */}
        <div className="text-center">
          <p className="mb-3.5 text-[13px] font-semibold uppercase tracking-[0.1em] text-[hsl(var(--primary-hover))]">
            Architecture
          </p>

          <h2 className="text-[clamp(32px,5vw,52px)] font-extrabold leading-[1.1] tracking-[-1.5px] text-[hsl(var(--foreground))]">
            Not just chat.
            <br />
            <span className="text-gradient-accent">
              Retrieval. Context. Answers.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-[15px] leading-[1.7] text-[hsl(var(--muted-foreground))]">
            Notespace AI combines document processing, embeddings, vector
            search, retrieval, and LLM generation to build a knowledge system
            grounded in your own content.
          </p>
        </div>

        {/* Pipeline */}
        <div className="mt-20 flex flex-wrap items-start justify-center gap-y-10 lg:flex-nowrap">

          {pipeline.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="flex items-start"
              >
                {/* Pipeline item */}
                <div className="flex w-28 flex-col items-center text-center">

                  {/* Icon */}
                  <div
                    className="
                      flex
                      h-14
                      w-14
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-[hsl(var(--border))]
                      bg-[hsl(var(--card))]
                      shadow-soft
                      transition-all
                      duration-300
                      hover:border-[hsl(var(--border-strong))]
                      hover:bg-[hsl(var(--accent))]
                      hover:shadow-glow
                    "
                  >
                    <Icon
                      size={22}
                      strokeWidth={1.5}
                      className="text-[hsl(var(--primary-hover))]"
                    />
                  </div>

                  {/* Label */}
                  <p className="mt-3 text-xs font-medium leading-5 text-[hsl(var(--muted-foreground))]">
                    {item.label}
                  </p>

                  {/* Pipeline node */}
                  <div
                    className="
                      mt-5
                      h-1
                      w-1
                      rounded-full
                      bg-[hsl(var(--primary))]
                      shadow-[0_0_10px_hsla(221,83%,53%,0.8)]
                    "
                  />
                </div>

                {/* Connector */}
                {index !== pipeline.length - 1 && (
                  <div
                    className="
                      mt-7
                      hidden
                      h-px
                      w-10
                      bg-[rgba(37,99,235,0.3)]
                      lg:block
                    "
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Stats */}
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["1,284", "indexed chunks"],
            ["384-dim", "embedding vectors"],
            ["top-k", "retrieval window"],
            ["100%", "grounded answers"],
          ].map(([value, label]) => (
            <div
              key={label}
              className="
                group
                rounded-[14px]
                border
                border-[hsl(var(--border))]
                bg-[hsl(var(--card))]
                p-6
                text-center
                backdrop-blur-[24px]
                transition-all
                duration-300
                hover:border-[rgba(37,99,235,0.3)]
                hover:bg-[rgba(255,255,255,0.05)]
                hover:shadow-[0_8px_35px_rgba(37,99,235,0.08)]
              "
            >
              <p className="text-2xl font-bold text-[hsl(var(--primary-hover))]">
                {value}
              </p>

              <p className="mt-1 text-xs text-[hsl(var(--muted-foreground-dim))]">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Architecture;