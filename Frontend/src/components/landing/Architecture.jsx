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
      className="bg-[#030405] px-6 py-32"
    >
      <div className="mx-auto max-w-7xl">

        <div className="text-center">
          <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
            Not just chat.
            <br />
            <span className="text-blue-500">
              Retrieval. Context. Answers.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-slate-400">
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
                <div className="flex w-28 flex-col items-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
                    <Icon size={22} className="text-blue-400" />
                  </div>

                  <p className="mt-3 text-xs font-medium text-slate-400">
                    {item.label}
                  </p>

                  <div className="mt-5 h-1 w-1 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.8)]" />
                </div>

                {index !== pipeline.length - 1 && (
                  <div className="mt-7 hidden h-px w-10 bg-blue-500/30 lg:block" />
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
              className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-6 text-center"
            >
              <p className="text-2xl font-bold text-blue-500">
                {value}
              </p>

              <p className="mt-1 text-xs text-slate-500">
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