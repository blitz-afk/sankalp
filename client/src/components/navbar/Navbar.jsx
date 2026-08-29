import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Sparkles } from "lucide-react";
import Container from "../ui copy/Container";
import Button from "../ui copy/Button";

const links = [
  { label: "About", href: "#about" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Stakeholders", href: "#stakeholders" },
  { label: "Why Sankalp", href: "#why-sankalp" },
];

function Logo() {
  return (
    <Link to="/" className="group flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm transition-transform group-hover:scale-105">
        <Sparkles size={19} strokeWidth={2.25} />
      </span>

      <span className="font-display text-xl font-bold tracking-tight text-ink-900">
        Sankalp
      </span>
    </Link>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-ink-100 bg-white/90 shadow-sm backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <Container size="wide">
        <nav className="flex h-16 items-center justify-between sm:h-[72px]">
          <Logo />

          <div className="hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-full px-3.5 py-2 text-sm font-medium text-ink-600 transition-colors hover:bg-ink-100 hover:text-ink-900"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>

            <Link to="/register">
              <Button variant="primary" size="sm">
                Register
              </Button>
            </Link>
          </div>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-ink-700 hover:bg-ink-100 md:hidden"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </Container>

      {open && (
        <div className="border-t border-ink-100 bg-white md:hidden">
          <Container size="wide">
            <div className="flex flex-col gap-1 py-4">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-50"
                >
                  {link.label}
                </a>
              ))}

              <div className="mt-3 flex flex-col gap-2 border-t border-ink-100 pt-4">
                <Link to="/login" onClick={() => setOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </Link>

                <Link to="/register" onClick={() => setOpen(false)}>
                  <Button className="w-full">
                    Register
                  </Button>
                </Link>
              </div>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}