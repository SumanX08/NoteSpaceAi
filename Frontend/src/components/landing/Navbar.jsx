import { ArrowRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { SignUpButton } from "@clerk/react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "How it Works", href: "#how-it-works" },
    { name: "Architecture", href: "#architecture" },
    { name: "GitHub", href: "https://github.com/SumanX08" },
  ];

  return (
    <header
      className={`
        site-nav
        fixed left-0 right-0 top-0 z-50
        transition-all duration-300
        ${scrolled
          ? "border-b border-white/[0.06] bg-[#030405]/85"
          : "border-b border-transparent bg-[#030405]/50"
        }
      `}
      style={{
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
      }}
    >
      <nav className="flex h-[60px] items-center justify-between px-6">

        {/* Logo */}
        <a
          href="/"
          className="flex items-center gap-2"
        >
          <img
            src="/logo.png"
            alt="Notespace AI"
            className="h-7 w-7 rounded-[6px] object-contain"
          />

          <span className="text-lg font-bold tracking-[-0.3px] text-[#F8FAFC]">
            Notespace AI
          </span>
        </a>


        {/* Desktop navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="
                text-[14px]
                font-medium
                text-[#94A3B8]
                transition-colors
                duration-200
                hover:text-[#F8FAFC]
              "
            >
              {link.name}
            </a>
          ))}
        </div>


        {/* Desktop CTA */}
        <SignUpButton mode="modal">
          <button className="btn-primary px-[18px] py-2 text-[14px]">
            Get Started →
          </button>
        </SignUpButton>


        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen((open) => !open)}
          className="
            rounded-lg
            border border-white/10
            p-2
            text-[#94A3B8]
            transition-colors
            hover:text-[#F8FAFC]
            md:hidden
          "
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <X size={20} />
          ) : (
            <Menu size={20} />
          )}
        </button>
      </nav>


      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="
            border-t border-white/[0.06]
            bg-[#030405]/95
            px-6
            py-5
            backdrop-blur-2xl
            md:hidden
          "
        >
          <div className="flex flex-col gap-5">

            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="
                  text-[14px]
                  font-medium
                  text-[#94A3B8]
                  transition-colors
                  hover:text-[#F8FAFC]
                "
              >
                {link.name}
              </a>
            ))}

            <SignUpButton mode="modal">
              <button
                onClick={() => setMenuOpen(false)}
                className="btn-primary w-full py-3 text-[14px]"
              >
                Get Started →
              </button>
            </SignUpButton>

          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;