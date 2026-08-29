import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  GraduationCap,
  Building2,
  ArrowRight,
  Check,
  ArrowLeft,
} from "lucide-react";

const roles = [
  {
    id: "citizen",
    title: "Citizen",
    description:
      "Report civic problems from your neighbourhood and follow them as they move toward real solutions.",
    icon: Users,
    features: [
      "Submit civic problems",
      "Track reported issues",
      "Validate community priorities",
    ],
    path: "/register/citizen",
  },
  {
    id: "university",
    title: "University",
    description:
      "Take on validated civic challenges and turn research into practical solutions for communities.",
    icon: GraduationCap,
    features: [
      "Discover civic challenges",
      "Submit research-backed solutions",
      "Collaborate with industry and government",
    ],
    path: "/register/university",
  },
  {
    id: "industry",
    title: "Industry",
    description:
      "Bring engineering, funding and scaling expertise to move promising civic solutions into the real world.",
    icon: Building2,
    features: [
      "Discover high-impact projects",
      "Collaborate with universities",
      "Support pilots and scaling",
    ],
    path: "/register/industry",
  },
];

export default function RegisterPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8f8f5] text-[#171914]">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-[#171914]/10 bg-[#f8f8f5]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link
            to="/"
            className="font-mono text-xl font-bold tracking-tighter"
          >
            SANKALP
          </Link>

          <Link
            to="/"
            className="flex items-center gap-2 rounded-sm px-4 py-2 text-sm font-medium transition-colors hover:bg-[#171914]/5"
          >
            <ArrowLeft size={15} />
            Back to Home
          </Link>
        </div>
      </nav>

      {/* HEADER */}
      <header className="relative overflow-hidden border-b border-[#171914]/10 py-20 md:py-28">
        {/* Blueprint grid */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(rgba(23,25,20,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(23,25,20,.045) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <span className="mb-6 inline-block border border-[#2563eb]/20 bg-[#2563eb]/10 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-[#2563eb]">
            Onboarding
          </span>

          <h1 className="mx-auto max-w-4xl text-5xl font-bold leading-[0.95] tracking-[-0.04em] md:text-7xl">
            Choose your{" "}
            <span className="italic text-[#2563eb]">role</span> in the
            protocol.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#171914]/55 md:text-xl">
            Sankalp brings citizens, universities and industry together to
            turn real civic problems into real-world solutions.
          </p>
        </div>
      </header>

      {/* ROLE CARDS */}
      <main className="border-b border-[#171914]/10 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 md:grid-cols-3">
            {roles.map((role, index) => {
              const Icon = role.icon;

              return (
                <article
                  key={role.id}
                  className="group flex flex-col border border-[#171914]/10 bg-[#efefeb] p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[#2563eb]/60 hover:shadow-xl"
                >
                  {/* Icon + number */}
                  <div className="mb-8 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#171914]/10 bg-[#f8f8f5] transition-colors group-hover:border-[#2563eb] group-hover:text-[#2563eb]">
                      <Icon size={21} strokeWidth={1.6} />
                    </div>

                    <span className="font-mono text-xs text-[#171914]/35">
                      [0{index + 1}]
                    </span>
                  </div>

                  <h2 className="text-3xl font-bold tracking-tight">
                    {role.title}
                  </h2>

                  <p className="mt-3 min-h-[84px] text-sm leading-relaxed text-[#171914]/55 md:text-base">
                    {role.description}
                  </p>

                  {/* Features */}
                  <ul className="mt-8 flex-1 space-y-3 border-t border-[#171914]/10 pt-7">
                    {role.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-sm"
                      >
                        <Check
                          size={16}
                          className="mt-0.5 shrink-0 text-[#2563eb]"
                          strokeWidth={2}
                        />

                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <button
                    onClick={() => navigate(role.path)}
                    className="mt-10 flex w-full items-center justify-center gap-2 bg-[#171914] px-6 py-3.5 text-sm font-medium text-white transition-all hover:bg-[#2563eb]"
                  >
                    Register as {role.title}

                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </button>
                </article>
              );
            })}
          </div>

          {/* Government notice */}
          <div className="mt-12 border-t border-[#171914]/10 pt-8 text-center">
            <p className="font-mono text-[11px] uppercase tracking-wider text-[#171914]/45">
              Government and administrative accounts are issued separately by
              verified authorities.
            </p>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 md:flex-row md:items-center">
          <div>
            <div className="font-mono text-lg font-bold tracking-tighter">
              SANKALP
            </div>

            <p className="mt-2 text-xs text-[#171914]/40">
              A Civic Innovation Protocol © 2026
            </p>
          </div>

          <div className="flex gap-8 font-mono text-xs uppercase tracking-widest text-[#171914]/40">
            <Link to="/" className="hover:text-[#2563eb]">
              Home
            </Link>

            <span className="text-[#2563eb]">Register</span>

            <a href="#privacy" className="hover:text-[#2563eb]">
              Privacy
            </a>
          </div>

          <span className="text-xs text-[#171914]/40">
            Certified Institutional Platform
          </span>
        </div>
      </footer>
    </div>
  );
}