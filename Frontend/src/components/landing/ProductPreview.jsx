import {
  Search,
  FileText,
  Globe,
  Mic,
  Bot,
} from "lucide-react";

function ProductPreview() {
  return (
    <section className="relative overflow-hidden bg-[#030405] px-6 pb-32">
      <div className="mx-auto max-w-6xl">

        {/* Glow */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-blue-600/[0.06] blur-[120px]" />

        <div className="relative overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0a0c0f] shadow-2xl">

          {/* Window bar */}
          <div className="flex h-10 items-center gap-2 border-b border-white/[0.06] bg-[#07090b] px-4">
            <span className="h-3 w-3 rounded-full bg-red-500" />
            <span className="h-3 w-3 rounded-full bg-yellow-500" />
            <span className="h-3 w-3 rounded-full bg-green-500" />
          </div>

          <div className="grid min-h-[500px] grid-cols-[200px_1fr_190px]">

            {/* Sidebar */}
            <aside className="border-r border-white/[0.06] bg-[#07090b] p-4">

              <div className="mb-10 flex items-center gap-2">
                <div className="h-7 w-7 rounded-md bg-blue-500" />
                <span className="text-sm font-semibold text-white">
                  Notespace AI
                </span>
              </div>

              <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
                My Notebooks
              </p>

              <div className="space-y-1 text-sm">
                {["RAG Research", "AI Agents", "LLM Notes", "Projects"].map(
                  (item, index) => (
                    <div
                      key={item}
                      className={`rounded-md px-3 py-2 ${
                        index === 0
                          ? "bg-blue-600/15 font-medium text-blue-400"
                          : "text-slate-500"
                      }`}
                    >
                      <span className="mr-2 text-[10px]">▸</span>
                      {item}
                    </div>
                  )
                )}
              </div>
            </aside>

            {/* Main */}
            <main className="p-6">

              <h3 className="text-lg font-semibold text-white">
                RAG Research
              </h3>

              {/* Search */}
              <div className="mt-4 flex items-center gap-3 rounded-lg border border-white/[0.08] bg-white/[0.025] px-4 py-3">
                <Search size={17} className="text-slate-600" />

                <span className="text-sm text-slate-600">
                  Search your knowledge base...
                </span>
              </div>

              {/* Question */}
              <div className="mt-9 flex justify-end">
                <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-4 py-3 text-sm text-slate-300">
                  How does hybrid search improve RAG?
                </div>
              </div>

              {/* Answer */}
              <div className="mt-5 flex gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-500 text-xs font-bold text-white">
                  AI
                </div>

                <div>
                  <p className="text-sm leading-6 text-slate-400">
                    Hybrid search combines{" "}
                    <span className="text-blue-400">
                      dense vector retrieval
                    </span>{" "}
                    with sparse keyword matching (BM25), capturing both
                    semantic similarity and exact term matches.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {["RAG Survey.pdf", "Hybrid Search Paper", "LLM Notes"].map(
                      (item) => (
                        <span
                          key={item}
                          className="rounded-md border border-blue-500/20 bg-blue-500/[0.06] px-2 py-1 text-xs text-blue-400"
                        >
                          ↗ {item}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            </main>

            {/* Sources */}
            <aside className="border-l border-white/[0.06] bg-[#07090b] p-4">
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
                Sources
              </p>

              {[
                ["PDF", "RAG Survey.pdf", "94%"],
                ["Web", "arxiv.org/rag", "87%"],
                ["TXT", "Interview Transcript", "72%"],
              ].map(([type, title, score]) => (
                <div
                  key={title}
                  className="mb-2 rounded-lg border border-white/[0.07] bg-white/[0.02] p-3"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-blue-400">{type}</span>
                    <span className="truncate text-slate-500">
                      {title}
                    </span>
                  </div>

                  <div className="mt-3 h-1 rounded-full bg-blue-500/20">
                    <div
                      className="h-full rounded-full bg-blue-500"
                      style={{ width: score }}
                    />
                  </div>

                  <p className="mt-2 text-right text-[10px] text-slate-600">
                    {score} match
                  </p>
                </div>
              ))}
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductPreview;