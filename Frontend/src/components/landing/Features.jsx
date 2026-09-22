import {
  Boxes,
  BrainCircuit,
  Search,
  Crosshair,
  Files,
  MessageSquare,
} from "lucide-react";

const features = [
  {
    icon: Boxes,
    title: "AI-Powered Notebooks",
    description:
      "Organize your knowledge into focused notebooks and interact with it naturally.",
  },
  {
    icon: BrainCircuit,
    title: "Advanced RAG",
    description:
      "Retrieve relevant information from your own knowledge base before generating an answer.",
  },
  {
    icon: Search,
    title: "Semantic Search",
    description:
      "Find information based on meaning instead of relying only on keywords.",
  },
  {
    icon: Crosshair,
    title: "Source Citations",
    description:
      "See exactly where an answer came from — down to the document and passage.",
  },
  {
    icon: Files,
    title: "Multiple Sources",
    description:
      "Work with documents, websites, transcripts, and other learning material.",
  },
  {
    icon: MessageSquare,
    title: "Context-Aware Chat",
    description:
      "Ask follow-up questions while maintaining full conversational context.",
  },
];

function Features() {
  return (
    <section
      id="features"
      className="bg-[#030405] px-6 py-32"
    >
      <div className="mx-auto max-w-6xl">

        <div className="mb-20 text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-blue-500">
            Features
          </span>

          <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-bold tracking-tight text-white md:text-5xl">
            Everything you need to work with knowledge.
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group rounded-2xl border border-white/[0.08] bg-white/[0.025] p-7 transition duration-300 hover:border-blue-500/30 hover:bg-blue-500/[0.025]"
              >
                <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/[0.06]">
                  <Icon size={19} className="text-blue-400" />
                </div>

                <h3 className="text-lg font-semibold text-white">
                  {feature.title}
                </h3>

                <p className="mt-4 text-sm leading-6 text-slate-400">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Features;