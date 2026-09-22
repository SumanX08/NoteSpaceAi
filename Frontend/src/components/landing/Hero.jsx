import { ArrowUpRight, Sparkles } from "lucide-react";
import { SignUpButton } from "@clerk/react";

function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#030405] px-6 pt-24">
      {/* Grid */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:52px_52px]" />

      {/* Blue glow */}
      <div className="pointer-events-none absolute left-1/2 top-[45%] h-[420px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/[0.08] blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-5xl text-center">

        {/* Badge */}
        <div className="mx-auto mb-10 inline-flex items-center gap-2 rounded-full border border-blue-500/40 bg-blue-500/[0.06] px-4 py-2 text-sm font-medium text-blue-400">
          <Sparkles size={14} />
          AI-Powered Knowledge Workspace
        </div>

        {/* Heading */}
        <h1 className="text-5xl font-bold leading-[0.95] tracking-[-0.045em] text-white sm:text-6xl md:text-7xl lg:text-[86px]">
          Your knowledge.
          <br />

          Now{" "}
          <span className="text-blue-500">
            searchable by
          </span>

          <br />

          <span className="text-blue-500">AI.</span>
        </h1>

        {/* Description */}
        <p className="mx-auto mt-10 max-w-2xl text-lg leading-8 text-slate-400 md:text-xl">
          Turn your documents, websites, transcripts, and notes into an
          intelligent knowledge base you can actually talk to.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <SignUpButton mode="modal">
  <button
    className="
      group flex items-center gap-2
      rounded-lg
      bg-blue-600
      px-6 py-3.5
      font-semibold
      text-white
      shadow-[0_0_30px_rgba(37,99,235,0.25)]
      transition
      hover:bg-blue-500
    "
  >
    Start Building

    <ArrowUpRight
      size={18}
      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
    />
  </button>
</SignUpButton>

          <a
            href="https://github.com/SumanX08"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-6 py-3.5 font-medium text-slate-400 transition hover:border-white/20 hover:text-white"
          >
            View GitHub
            <ArrowUpRight size={17} />
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;