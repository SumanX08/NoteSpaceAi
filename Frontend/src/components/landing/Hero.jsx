import { ArrowUpRight, Sparkles } from "lucide-react";
import { SignUpButton } from "@clerk/react";

function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden px-6 pb-20 pt-20">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-[20%] h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(37,99,235,0.12)_0%,transparent_70%)]" />

      {/* Grid */}
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" />

      {/* Hero content */}
      <div className="relative z-10 mx-auto max-w-[900px] px-6 pt-20 text-center">
        {/* Badge */}
        <div className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-blue-600/25 bg-blue-600/10 px-4 py-1.5 text-[13px] font-medium text-blue-400">
          <Sparkles size={12} />
          <span>AI-Powered Knowledge Workspace</span>
        </div>

        {/* Heading */}
        <h1 className="mb-7 text-[clamp(48px,8vw,88px)] font-black leading-none tracking-[-3px] text-[#F8FAFC]">
          Your knowledge.
          <br />
          Now{" "}
          <span className="text-gradient-accent">
            searchable by AI.
          </span>
        </h1>

        {/* Description */}
        <p className="mx-auto mb-10 max-w-[620px] text-[clamp(17px,2.2vw,20px)] font-normal leading-[1.65] text-[#94A3B8]">
          Turn your documents, websites, transcripts, and notes into an
          intelligent knowledge base you can actually talk to.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-3">
          <SignUpButton mode="modal">
            <button className="btn-primary group flex items-center gap-2">
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
            className="btn-secondary flex items-center gap-2"
          >
            View GitHub
            <ArrowUpRight size={17} />
          </a>
        </div>
      </div>

      {/* Product preview */}
      
    </section>
  );
}

export default Hero;