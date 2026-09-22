import {  ArrowUpRight } from "lucide-react";

function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#030405] px-6 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">

        <div>
          <p className="text-lg font-semibold text-white">
            Notespace <span className="text-blue-500">AI</span>
          </p>

          <p className="mt-1 text-sm text-slate-600">
            Your knowledge. One intelligent workspace.
          </p>
        </div>

        <div className="flex items-center gap-6 text-sm text-slate-500">
          <a
            href="#features"
            className="transition hover:text-white"
          >
            Features
          </a>

          <a
            href="#architecture"
            className="transition hover:text-white"
          >
            Architecture
          </a>

          <a
            href="https://github.com/SumanX08"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 transition hover:text-white"
          >
            <ArrowUpRight size={16} />
            GitHub
            <ArrowUpRight size={13} />
          </a>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-7xl border-t border-white/[0.05] pt-6 text-center text-xs text-slate-700">
        © 2026 Notespace AI. Built with curiosity.
      </div>
    </footer>
  );
}

export default Footer;