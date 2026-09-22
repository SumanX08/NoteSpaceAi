import { ArrowRight } from "lucide-react";

function FinalCTA() {
  return (
    <section className="bg-[#030405] px-6 py-32">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-[#0d1118] px-6 py-20 text-center">

        {/* Glow */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/20 blur-[100px]" />

        <div className="relative">
          <h2 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-white md:text-5xl">
            Turn your knowledge into
            <br />
            something you can talk to.
          </h2>

          <p className="mt-5 text-lg text-slate-400">
            Upload. Search. Ask. Understand.
          </p>

          <a
            href="/app"
            className="group mt-9 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-7 py-3.5 font-semibold text-white shadow-[0_0_30px_rgba(37,99,235,0.3)] transition hover:bg-blue-500"
          >
            Start Building
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </a>
        </div>
      </div>
    </section>
  );
}

export default FinalCTA;