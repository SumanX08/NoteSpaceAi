import {
  FileText,
  Globe,
  File,
  Mic,
  Files,
  ArrowDown,
} from "lucide-react";

const sources = [
  { name: "PDFs", icon: FileText },
  { name: "Websites", icon: Globe },
  { name: "Notes", icon: File },
  { name: "Transcripts", icon: Mic },
  { name: "Documents", icon: Files },
];

function KnowledgeSources() {
  return (
    <section className="relative overflow-hidden bg-[#030405] px-6 py-32">

      <div className="mx-auto max-w-7xl">

        <h2 className="text-center text-4xl font-bold tracking-tight text-white md:text-6xl">
          Your knowledge shouldn't be scattered.
        </h2>

        {/* Sources */}
        <div className="mt-20 grid grid-cols-2 gap-5 md:grid-cols-5">
          {sources.map((source, index) => {
            const Icon = source.icon;

            return (
              <div
                key={source.name}
                className={`rounded-2xl border p-8 text-center transition ${
                  index === 2
                    ? "border-blue-500/50 bg-blue-500/[0.04]"
                    : "border-white/[0.08] bg-white/[0.025]"
                }`}
              >
                <div
                  className={`mx-auto flex h-14 w-14 items-center justify-center rounded-xl border ${
                    index === 2
                      ? "border-blue-500/30 bg-blue-500/10"
                      : "border-white/[0.06] bg-white/[0.03]"
                  }`}
                >
                  <Icon
                    size={24}
                    className={
                      index === 2 ? "text-blue-400" : "text-slate-400"
                    }
                  />
                </div>

                <p className="mt-5 font-medium text-slate-400">
                  {source.name}
                </p>
              </div>
            );
          })}
        </div>

        {/* Arrow */}
        <div className="my-10 flex justify-center">
          <ArrowDown className="text-blue-500" />
        </div>

        {/* NoteSpace */}
        <div className="mx-auto max-w-md rounded-2xl border border-blue-500/20 bg-blue-500/[0.05] px-10 py-7 text-center shadow-[0_0_60px_rgba(37,99,235,0.08)]">
          <h3 className="text-3xl font-bold text-white">
            Notespace <span className="text-blue-500">AI</span>
          </h3>
        </div>

        <h3 className="mt-10 text-center text-3xl font-semibold text-white">
          One intelligent workspace.
        </h3>

        <p className="mx-auto mt-5 max-w-3xl text-center text-lg leading-8 text-slate-400">
          Stop jumping between documents, browser tabs, bookmarks, and notes.
          Bring your knowledge together and interact with it using natural
          language.
        </p>
      </div>
    </section>
  );
}

export default KnowledgeSources;