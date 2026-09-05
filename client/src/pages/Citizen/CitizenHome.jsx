import { useState } from "react";
import { Link } from "react-router-dom";
import {
    FileText,
    Plus,
    MessageCircle,
    LogOut,
    Menu,
    X,
    ArrowRight
} from "lucide-react";

import { auth } from "../../firebase/config";
import { signOut } from "firebase/auth";

export default function CitizenHome() {
    const [menuOpen, setMenuOpen] = useState(false);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            window.location.href = "/login";
        } catch (error) {
            console.error("Sign out failed:", error);
        }
    };

    return (
        <div className="min-h-screen bg-[#faf9f6] text-[#13243b]">

            {/* ================================
                NAVBAR
            ================================= */}

            <nav className="sticky top-0 z-50 border-b border-[#13243b]/10 bg-[#faf9f6]/95 backdrop-blur-md">
                <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 md:h-16 md:px-6">

                    <Link
                        to="/citizen"
                        className="flex items-center gap-3"
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#13243b] text-sm font-bold text-white">
                            S
                        </div>

                        <span className="text-lg font-semibold tracking-tight">
                            Sankalp
                        </span>
                    </Link>

                    {/* DESKTOP */}

                    <div className="hidden items-center gap-8 text-sm md:flex">

                        <Link
                            to="/citizen"
                            className="font-medium text-[#13243b]"
                        >
                            Home
                        </Link>

                        <Link
                            to="/citizen/reports"
                            className="text-[#13243b]/55 hover:text-[#13243b]"
                        >
                            My reports
                        </Link>

                        <span className="text-[#13243b]/60">
                            Citizen
                        </span>

                        <button
                            type="button"
                            onClick={handleSignOut}
                            className="text-[#13243b]/55 hover:text-[#13243b]"
                        >
                            Sign out
                        </button>

                    </div>

                    {/* MOBILE */}

                    <div className="relative md:hidden">

                        <button
                            type="button"
                            onClick={() =>
                                setMenuOpen((value) => !value)
                            }
                            className="rounded-lg p-2 hover:bg-[#13243b]/5"
                            aria-label="Open menu"
                        >
                            {menuOpen ? (
                                <X size={20} />
                            ) : (
                                <Menu size={20} />
                            )}
                        </button>

                        {menuOpen && (
                            <div className="absolute right-0 top-11 w-48 rounded-xl border border-[#13243b]/10 bg-white p-2 shadow-lg">

                                <Link
                                    to="/citizen"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm hover:bg-[#13243b]/5"
                                >
                                    Home
                                </Link>

                                <Link
                                    to="/citizen/reports"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm hover:bg-[#13243b]/5"
                                >
                                    <FileText size={16} />
                                    My reports
                                </Link>

                                <button
                                    type="button"
                                    onClick={handleSignOut}
                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm hover:bg-[#13243b]/5"
                                >
                                    <LogOut size={16} />
                                    Sign out
                                </button>

                            </div>
                        )}

                    </div>

                </div>
            </nav>


            {/* ================================
                MAIN
            ================================= */}

            <main className="mx-auto max-w-6xl px-5 pb-20 pt-16 md:px-8 md:pt-24">

                {/* HERO */}

                <section className="max-w-3xl">

                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#148aa0]">
                        Citizen portal
                    </p>

                    <h1 className="mt-4 text-4xl font-semibold tracking-[-0.035em] md:text-6xl">
                        Make your city better.
                    </h1>

                    <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#13243b]/60 md:text-lg">
                        Report civic problems, track your submissions,
                        and help bring real issues to the people who
                        can solve them.
                    </p>

                </section>


                {/* ACTION CARDS */}

                <section className="mt-12 grid gap-5 md:grid-cols-2">

                    {/* REPORT */}

                    <Link
                        to="/citizen/report"
                        className="group rounded-[28px] border border-[#13243b]/10 bg-white p-7 shadow-[0_12px_40px_rgba(19,36,59,0.05)] transition hover:-translate-y-1 hover:shadow-[0_16px_50px_rgba(19,36,59,0.09)] md:p-9"
                    >

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#13243b] text-white">
                            <Plus size={22} />
                        </div>

                        <div className="mt-8 flex items-end justify-between gap-5">

                            <div>

                                <h2 className="text-2xl font-semibold">
                                    Report a problem
                                </h2>

                                <p className="mt-3 max-w-md text-sm leading-relaxed text-[#13243b]/55">
                                    Capture a civic issue with a photo,
                                    location, and description. Sankalp
                                    will verify and process your report.
                                </p>

                            </div>

                            <ArrowRight
                                size={22}
                                className="mb-1 shrink-0 transition-transform group-hover:translate-x-1"
                            />

                        </div>

                    </Link>


                    {/* REPORTS */}

                    <Link
                        to="/citizen/reports"
                        className="group rounded-[28px] border border-[#13243b]/10 bg-white p-7 shadow-[0_12px_40px_rgba(19,36,59,0.05)] transition hover:-translate-y-1 hover:shadow-[0_16px_50px_rgba(19,36,59,0.09)] md:p-9"
                    >

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e7f8fa] text-[#148aa0]">
                            <FileText size={22} />
                        </div>

                        <div className="mt-8 flex items-end justify-between gap-5">

                            <div>

                                <h2 className="text-2xl font-semibold">
                                    My reports
                                </h2>

                                <p className="mt-3 max-w-md text-sm leading-relaxed text-[#13243b]/55">
                                    View the civic problems you've
                                    submitted and follow their progress.
                                </p>

                            </div>

                            <ArrowRight
                                size={22}
                                className="mb-1 shrink-0 transition-transform group-hover:translate-x-1"
                            />

                        </div>

                    </Link>

                </section>


                {/* INFO */}

                <section className="mt-8 rounded-[28px] border border-[#13243b]/10 bg-white p-7 md:p-9">

                    <div className="flex items-start gap-4">

                        <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#faf9f6]">
                            <MessageCircle
                                size={19}
                                className="text-[#148aa0]"
                            />
                        </div>

                        <div>

                            <h3 className="font-semibold">
                                How Sankalp works
                            </h3>

                            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#13243b]/55">
                                Your report is verified using Sankalp AI,
                                converted into a structured civic problem,
                                and routed through the platform so the
                                appropriate organizations can work toward
                                solving it.
                            </p>

                        </div>

                    </div>

                </section>

            </main>


            {/* CHATBOT */}

            <button
                type="button"
                className="fixed bottom-5 right-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#13243b] text-white shadow-lg transition hover:scale-105 hover:bg-[#1d3554]"
                aria-label="Open Sankalp assistant"
            >
                <MessageCircle size={19} />
            </button>

        </div>
    );
}