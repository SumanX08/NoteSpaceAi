import { ArrowRight } from "lucide-react";

function FinalCTA() {
  return (
    <section
      id="cta"
      className="relative overflow-hidden bg-[#030405] px-6 py-[120px]"
    >
      <div className="relative mx-auto max-w-[800px] text-center">

        {/* Strong blue glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(37,99,235,0.25)_0%,transparent_70%)]" />

        {/* CTA card */}
        <div
          className="
            glass
            relative
            overflow-hidden
            rounded-[20px]
            border
            border-blue-600/20
            px-6
            py-12
            shadow-[0_0_80px_rgba(37,99,235,0.12),0_32px_80px_rgba(0,0,0,0.5)]
            sm:px-10
            sm:py-16
            lg:px-20
            lg:py-20
          "
        >
          {/* Inner subtle glow */}
          <div className="pointer-events-none absolute left-1/2 top-0 h-[180px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/[0.06] blur-[80px]" />

          <div className="relative">

            {/* Heading */}
            <h2 className="mx-auto mb-5 text-[clamp(32px,5vw,56px)] font-black leading-[1.1] tracking-[-2px] text-[#F8FAFC]">
              Turn your knowledge into
              <br />
              <span className="text-gradient-accent">
                something you can talk to.
              </span>
            </h2>

            {/* Subtitle */}
            <p className="mb-10 font-mono text-[17px] tracking-[0.03em] text-[#94A3B8]">
              Upload. Search. Ask. Understand.
            </p>

            {/* CTA */}
            <a
              href="/app"
              className="
                btn-primary
                group
                inline-flex
                items-center
                gap-2
                px-8
                py-3.5
                text-base
              "
            >
              Start Using Notespace AI
              <ArrowRight
                size={18}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FinalCTA;