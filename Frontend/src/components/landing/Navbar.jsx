import { ArrowRight, BrainCircuit, Menu, X } from "lucide-react";
import { useState } from "react";
import { SignUpButton } from "@clerk/react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "How it Works", href: "#how-it-works" },
    { name: "Architecture", href: "#architecture" },
    { name: "GitHub", href: "https://github.com/SumanX08" },
  ];

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-white/[0.06] bg-[#050607]/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-6 lg:px-8">

        {/* Logo */}
        <a href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-500/40 bg-blue-500/10 shadow-[0_0_25px_rgba(37,99,235,0.18)]">
            <BrainCircuit
              size={24}
              strokeWidth={1.8}
              className="text-blue-400"
            />
          </div>

          <span className="text-[19px] font-semibold tracking-tight text-white">
            Notespace <span className="text-blue-500">AI</span>
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-10 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-[17px] font-medium text-slate-400 transition-colors hover:text-white"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <SignUpButton mode="modal">
  <button
    className="
      flex items-center gap-2
      rounded-xl
      border border-blue-500/50
      px-5 py-2.5
      font-semibold
      text-white
      transition
      hover:border-blue-400
      hover:bg-blue-500/10
    "
  >
    Get Started
    <ArrowRight size={18} />
  </button>
</SignUpButton>

        {/* Mobile button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg border border-white/10 p-2 text-slate-300 md:hidden"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-white/[0.06] bg-[#050607] px-6 py-5 md:hidden">
          <div className="flex flex-col gap-5">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-base font-medium text-slate-400 hover:text-white"
              >
                {link.name}
              </a>
            ))}

            <a
              href="/app"
              className="flex items-center justify-center gap-2 rounded-xl border border-blue-500/50 py-3 font-semibold text-white"
            >
              Get Started
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;