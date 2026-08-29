import { Link } from "react-router-dom";
import blueprintHero from "../../assets/blueprint-hero.jpg";
import officialSeal from "../../assets/official-seal.jpg";

const steps = [
  {
    n: "01",
    title: "Report",
    copy: "Citizens log hyper-local infrastructure gaps from the field.",
  },
  {
    n: "02",
    title: "AI Analysis",
    copy: "Reports are validated, classified and grouped by pattern.",
  },
  {
    n: "03",
    title: "Challenge",
    copy: "Verified issues become public, well-scoped design briefs.",
  },
  {
    n: "04",
    title: "Solution",
    copy: "University labs develop and document technical prototypes.",
  },
  {
    n: "05",
    title: "Collaboration",
    copy: "Industry partners add engineering capacity and scale.",
  },
  {
    n: "06",
    title: "Pilot",
    copy: "Officers run monitored testing in live environments.",
  },
  {
    n: "07",
    title: "Impact",
    copy: "Government bodies verify outcomes and record them.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f8f8f5] text-[#171914]">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 w-full border-b border-[#171914]/10 bg-[#f8f8f5]/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="font-mono text-xl font-bold tracking-tighter"
            >
              SANKALP
            </Link>

            <div className="hidden gap-6 text-sm font-medium text-[#171914]/55 md:flex">
              <a href="#about" className="hover:text-[#171914]">
                About
              </a>

              <a href="#process" className="hover:text-[#171914]">
                The Process
              </a>

              <a href="#stakeholders" className="hover:text-[#171914]">
                Stakeholders
              </a>

              <a href="#why" className="hover:text-[#171914]">
                Why Sankalp
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-sm px-4 py-2 text-sm font-medium transition-colors hover:bg-[#171914]/5"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-sm bg-[#171914] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#171914]/90"
            >
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className="relative overflow-hidden border-b border-[#171914]/10 py-24">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(rgba(23,25,20,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(23,25,20,.045) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="mb-6 inline-block border border-[#3b82f6]/25 bg-[#3b82f6]/10 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-[#2563eb]">
              Institutional Grade Civic Tech
            </div>

            <h1 className="mb-8 max-w-4xl text-6xl font-bold leading-[0.9] tracking-[-0.045em] md:text-8xl">
              Real civic problems.
              <br />
              <span className="italic text-[#2563eb]">Real-world</span>{" "}
              solutions.
            </h1>

            <p className="mb-10 max-w-[45ch] text-xl leading-relaxed text-[#171914]/55">
              The infrastructure for democratic innovation. Connecting citizen
              reports to government pilots through a rigorous, AI-assisted
              development pipeline.
            </p>

            <div className="flex flex-wrap gap-6">
              <div className="flex flex-col gap-1 border-r border-[#171914]/15 pr-6">
                <span className="font-mono text-xs uppercase text-[#171914]/45">
                  Citizenship
                </span>
                <span className="font-semibold">Active reporting</span>
              </div>

              <div className="flex flex-col gap-1 border-r border-[#171914]/15 pr-6">
                <span className="font-mono text-xs uppercase text-[#171914]/45">
                  Engineering
                </span>
                <span className="font-semibold">Collaborative solving</span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="font-mono text-xs uppercase text-[#171914]/45">
                  Governance
                </span>
                <span className="font-semibold">Verified outcomes</span>
              </div>
            </div>
          </div>

          <div className="relative md:col-span-5">
            <img
              src={blueprintHero}
              alt="Architectural blueprint of a city square"
              className="w-full rounded-sm object-cover shadow-2xl"
            />
          </div>
        </div>
      </header>

      {/* ABOUT */}
      <section
        id="about"
        className="border-b border-[#171914]/10 py-24"
      >
        <div className="mx-auto grid max-w-7xl gap-16 px-6 md:grid-cols-12">
          <div className="md:col-span-4">
            <h2 className="mb-4 font-mono text-sm uppercase tracking-[0.2em] text-[#2563eb]">
              About Sankalp
            </h2>

            <h3 className="text-4xl font-bold leading-tight tracking-tight">
              One record, from the street to the signature.
            </h3>
          </div>

          <div className="space-y-6 text-lg leading-relaxed text-[#171914]/55 md:col-span-8 md:max-w-[58ch]">
            <p>
              Sankalp is a civic innovation platform where a single reported
              problem keeps its identity all the way through to a verified
              outcome. Citizens describe what they see. Analysis turns
              scattered reports into a clear brief. Universities design
              against that brief, industry makes it buildable, government
              pilots it in the field, and a government body confirms whether
              it actually worked.
            </p>

            <p>
              Every participant works on the same document rather than a
              private queue, so nothing is lost between desks and no stage
              depends on goodwill alone.
            </p>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section
        id="process"
        className="border-b border-[#171914]/10 bg-[#efefeb] py-24"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 flex items-end justify-between">
            <div>
              <h2 className="mb-4 font-mono text-sm uppercase tracking-[0.2em] text-[#2563eb]">
                Protocol
              </h2>

              <h3 className="text-4xl font-bold tracking-tight">
                The 7-Step Pipeline
              </h3>
            </div>

            <span className="hidden font-mono text-xs uppercase tracking-widest text-[#171914]/45 md:block">
              Seven stages · One traceable record
            </span>
          </div>

          <div className="relative">
            <div className="absolute left-0 top-6 hidden h-px w-full bg-[#171914]/15 md:block" />

            <div className="grid gap-8 md:grid-cols-7">
              {steps.map((step, index) => (
                <div
                  key={step.n}
                  className="group relative pt-12"
                >
                  <div
                    className={`absolute left-0 top-4 h-4 w-4 rounded-full border-4 border-[#efefeb] ring-1 ring-[#171914]/20 transition-transform group-hover:scale-125 ${
                      index === 0
                        ? "bg-[#171914]"
                        : index === steps.length - 1
                          ? "bg-[#2563eb]"
                          : "bg-[#c8c9c4] group-hover:bg-[#171914]"
                    }`}
                  />

                  <span
                    className={`mb-2 block font-mono text-[10px] ${
                      index === 0 || index === steps.length - 1
                        ? "text-[#2563eb]"
                        : "text-[#171914]/45"
                    }`}
                  >
                    STEP {step.n}
                  </span>

                  <h4 className="mb-1 text-lg font-bold">
                    {step.title}
                  </h4>

                  <p className="text-sm leading-relaxed text-[#171914]/50">
                    {step.copy}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STAKEHOLDERS */}
      <section id="stakeholders" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-12 font-mono text-sm uppercase tracking-[0.2em] text-[#171914]/50">
            Ecosystem Stakeholders
          </h2>

          <div className="grid gap-6 md:grid-cols-12 md:grid-rows-2">
            {/* CITIZEN */}
            <div className="group flex min-h-[280px] flex-col justify-between border border-[#171914]/10 bg-[#efefeb] p-8 transition-colors hover:border-[#2563eb] md:col-span-4">
              <div>
                <span className="font-mono text-xs text-[#2563eb]">
                  [01]
                </span>

                <h4 className="mt-2 text-2xl font-bold">
                  Citizen
                </h4>

                <p className="mt-2 text-sm leading-relaxed text-[#171914]/50">
                  The sensor network of the city. Reporting lived experience
                  to drive policy change.
                </p>
              </div>

              <div className="mt-8 flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-full border border-[#171914]/10 transition-colors group-hover:bg-[#2563eb] group-hover:text-white">
                  →
                </span>

                <span className="font-mono text-[10px] uppercase text-[#171914]/45">
                  Active engagement
                </span>
              </div>
            </div>

            {/* GOVERNMENT OFFICER */}
            <div className="flex min-h-[280px] flex-col justify-between border border-[#171914] bg-[#171914] p-8 text-white md:col-span-8">
              <div className="flex justify-between">
                <div className="max-w-md">
                  <span className="font-mono text-xs text-[#60a5fa]">
                    [04]
                  </span>

                  <h4 className="mt-2 text-3xl font-bold">
                    Government Officer
                  </h4>

                  <p className="mt-2 text-base leading-relaxed text-white/55">
                    Executive supervisors who oversee pilot execution and
                    maintain the integrity of solution benchmarks.
                  </p>
                </div>

                <div className="hidden w-32 opacity-20 md:block">
                  <div className="grid grid-cols-4 gap-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                      <div
                        key={item}
                        className={`h-8 ${
                          [1, 4, 6, 7].includes(item)
                            ? "bg-[#60a5fa]"
                            : "bg-white/20"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="font-mono text-xs tracking-widest">
                ADMINISTRATIVE ACCESS REQUIRED
              </div>
            </div>

            {/* UNIVERSITY */}
            <div className="min-h-[280px] border border-[#171914]/10 bg-[#efefeb] p-8 transition-colors hover:border-[#2563eb] md:col-span-4">
              <span className="font-mono text-xs text-[#2563eb]">
                [02]
              </span>

              <h4 className="mt-2 text-2xl font-bold">
                University
              </h4>

              <p className="mt-2 text-sm leading-relaxed text-[#171914]/50">
                R&amp;D hubs turning field data into technical prototypes
                through academic rigor.
              </p>
            </div>

            {/* INDUSTRY */}
            <div className="min-h-[280px] border border-[#171914]/10 bg-[#efefeb] p-8 transition-colors hover:border-[#2563eb] md:col-span-4">
              <span className="font-mono text-xs text-[#2563eb]">
                [03]
              </span>

              <h4 className="mt-2 text-2xl font-bold">
                Industry
              </h4>

              <p className="mt-2 text-sm leading-relaxed text-[#171914]/50">
                Corporate partners providing funding, engineering capacity,
                and industrial scaling.
              </p>
            </div>

            {/* GOVERNMENT BODY */}
            <div className="min-h-[280px] border border-dashed border-[#2563eb]/40 bg-[#2563eb]/5 p-8 md:col-span-4">
              <span className="font-mono text-xs text-[#2563eb]">
                [05]
              </span>

              <h4 className="mt-2 text-2xl font-bold">
                Government Body
              </h4>

              <p className="mt-2 text-sm leading-relaxed text-[#171914]/50">
                Legislative and oversight agencies validating systemic impact
                for state-wide adoption.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY SANKALP */}
      <section
        id="why"
        className="border-t border-[#171914]/10 bg-[#efefeb] py-24"
      >
        <div className="mx-auto grid max-w-7xl gap-24 px-6 md:grid-cols-2">
          <div>
            <h2 className="mb-8 text-4xl font-bold tracking-tight">
              Why the platform matters.
            </h2>

            <p className="mb-12 text-lg text-[#171914]/50">
              We aren't just another dashboard. We are a protocol for civic
              trust, ensuring every voice contributes to a verifiable result.
            </p>

            <img
              src={officialSeal}
              alt="Official seal"
              className="w-full rounded-sm object-cover"
            />
          </div>

          <div className="space-y-12">
            <div className="border-l-2 border-[#2563eb] py-2 pl-8">
              <h4 className="mb-3 text-xl font-bold">
                Traceable Accountability
              </h4>

              <p className="text-[#171914]/50">
                Every solution is tied directly to a citizen-reported need,
                with a clear chain of custody from idea to impact.
              </p>
            </div>

            <div className="border-l-2 border-[#171914]/15 py-2 pl-8 transition-colors hover:border-[#2563eb]">
              <h4 className="mb-3 text-xl font-bold">
                Collaborative Scalability
              </h4>

              <p className="text-[#171914]/50">
                By bridge-building between labs and industry, we ensure civic
                projects don't die as prototypes.
              </p>
            </div>

            <div className="border-l-2 border-[#171914]/15 py-2 pl-8 transition-colors hover:border-[#2563eb]">
              <h4 className="mb-3 text-xl font-bold">
                Data-Driven Governance
              </h4>

              <p className="text-[#171914]/50">
                Evidence-based policy-making fueled by real pilot results
                rather than anecdotal feedback.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#171914] py-24 text-center text-white">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="mb-8 text-5xl font-bold tracking-tight">
            Ready to participate?
          </h2>

          <p className="mb-12 text-xl text-white/60">
            Bring a civic problem to the table, or take one up as an
            institution.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/register"
              className="bg-[#2563eb] px-10 py-4 font-bold transition-colors hover:bg-[#1d4ed8]"
            >
              Register
            </Link>

            <Link
              to="/login"
              className="bg-[#f8f8f5] px-10 py-4 font-bold text-[#171914] transition-colors hover:bg-white"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#171914]/10 bg-[#f8f8f5] py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-6 md:flex-row md:items-center">
          <div>
            <div className="font-mono text-lg font-bold tracking-tighter">
              SANKALP
            </div>

            <p className="mt-2 text-xs text-[#171914]/45">
              A Civic Innovation Protocol © 2026
            </p>
          </div>

          <div className="flex gap-8 font-mono text-xs uppercase tracking-widest text-[#171914]/45">
            <a href="#about" className="hover:text-[#2563eb]">
              Privacy
            </a>

            <a href="#process" className="hover:text-[#2563eb]">
              Governance
            </a>

            <a href="#why" className="hover:text-[#2563eb]">
              Documentation
            </a>
          </div>

          <div className="text-xs text-[#171914]/45">
            Certified Institutional Platform
          </div>
        </div>
      </footer>
    </div>
  );
}