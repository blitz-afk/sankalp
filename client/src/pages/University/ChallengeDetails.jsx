import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    ArrowRight,
    Loader2,
    AlertCircle,
    Trophy,
    Users,
} from "lucide-react";
import { auth } from "../../firebase/config";
import api from "../../services/api";

export default function ChallengeDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [challenge, setChallenge] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchChallenge = async () => {
            try {
                setLoading(true);
                setError("");

                const user = auth.currentUser;

                if (!user) {
                    navigate("/login");
                    return;
                }

                const token = await user.getIdToken();

                const response = await api.get(
                    `/challenges/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setChallenge(response.data.challenge);
            } catch (error) {
                console.error(
                    "Failed to fetch challenge:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load challenge."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchChallenge();
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#faf9f6] text-[#13243b]">
                <div className="flex items-center gap-3 text-sm text-[#13243b]/55">
                    <Loader2
                        size={20}
                        className="animate-spin"
                    />
                    Loading challenge...
                </div>
            </div>
        );
    }

    if (error || !challenge) {
        return (
            <div className="min-h-screen bg-[#faf9f6] px-5 py-16 text-[#13243b]">
                <div className="mx-auto max-w-3xl">

                    <Link
                        to="/university"
                        className="mb-8 inline-flex items-center gap-2 text-sm text-[#13243b]/60 hover:text-[#13243b]"
                    >
                        <ArrowLeft size={16} />
                        Back to challenges
                    </Link>

                    <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-600">
                        <AlertCircle
                            size={20}
                            className="mt-0.5 shrink-0"
                        />

                        <p>
                            {error ||
                                "Challenge not found."}
                        </p>
                    </div>

                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#faf9f6] text-[#13243b]">

            {/* NAVBAR */}

            <nav className="border-b border-[#13243b]/10 bg-[#faf9f6]">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">

                    <Link
                        to="/university"
                        className="flex items-center gap-3"
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#13243b] text-sm font-bold text-white">
                            S
                        </div>

                        <span className="text-lg font-semibold">
                            Sankalp
                        </span>
                    </Link>

                    <Link
                        to="/university"
                        className="flex items-center gap-2 rounded-full border border-[#13243b]/10 px-4 py-2 text-sm font-medium hover:bg-[#13243b]/5"
                    >
                        <ArrowLeft size={16} />
                        Back
                    </Link>

                </div>
            </nav>

            {/* CONTENT */}

            <main className="mx-auto max-w-5xl px-5 py-10 md:px-8 md:py-14">

                {/* CATEGORY + STATUS */}

                <div className="flex flex-wrap items-center gap-3">

                    <span className="rounded-full bg-[#e7f8fa] px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-[#148aa0]">
                        {challenge.category}
                    </span>

                    <span className="rounded-full border border-[#13243b]/10 bg-white px-3 py-1.5 text-xs font-medium">
                        {challenge.status}
                    </span>

                </div>

                {/* TITLE */}

                <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
                    {challenge.title}
                </h1>

                {/* META */}

                <div className="mt-5 flex flex-wrap items-center gap-5 text-sm text-[#13243b]/50">

                    <div className="flex items-center gap-2">
                        <Users size={16} />
                        Based on{" "}
                        {challenge.reportCount} citizen{" "}
                        {challenge.reportCount === 1
                            ? "report"
                            : "reports"}
                    </div>

                </div>

                {/* PROBLEM */}

                <section className="mt-10 rounded-[24px] border border-[#13243b]/10 bg-white p-6 md:p-8">

                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#148aa0]">
                        The Problem
                    </p>

                    <p className="mt-4 text-base leading-8 text-[#13243b]/70">
                        {challenge.problemStatement}
                    </p>

                </section>

                {/* OBJECTIVE + OUTCOME */}

                <div className="mt-5 grid gap-5 md:grid-cols-2">

                    <section className="rounded-[24px] border border-[#13243b]/10 bg-white p-6 md:p-8">

                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#148aa0]">
                            Objective
                        </p>

                        <p className="mt-4 text-sm leading-7 text-[#13243b]/65">
                            {challenge.objective}
                        </p>

                    </section>

                    <section className="rounded-[24px] border border-[#13243b]/10 bg-white p-6 md:p-8">

                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#148aa0]">
                            Expected Outcome
                        </p>

                        <p className="mt-4 text-sm leading-7 text-[#13243b]/65">
                            {challenge.expectedOutcome}
                        </p>

                    </section>

                </div>

                {/* REQUIRED DOMAINS */}

                <section className="mt-5 rounded-[24px] border border-[#13243b]/10 bg-white p-6 md:p-8">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e7f8fa] text-[#148aa0]">
                            <Trophy size={19} />
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#148aa0]">
                                Required Domains
                            </p>

                            <p className="mt-1 text-sm text-[#13243b]/50">
                                Areas of expertise relevant to this challenge
                            </p>
                        </div>

                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">

                        {challenge.requiredDomains?.length > 0 ? (
                            challenge.requiredDomains.map(
                                (domain) => (
                                    <span
                                        key={domain}
                                        className="rounded-full border border-[#13243b]/10 bg-[#faf9f6] px-4 py-2 text-sm"
                                    >
                                        {domain}
                                    </span>
                                )
                            )
                        ) : (
                            <p className="text-sm text-[#13243b]/45">
                                No specific domains listed.
                            </p>
                        )}

                    </div>

                </section>

                {/* ACTION */}

                <div className="mt-8 flex flex-col gap-3 rounded-[24px] border border-[#13243b]/10 bg-[#13243b] p-6 text-white sm:flex-row sm:items-center sm:justify-between md:p-8">

                    <div>
                        <h2 className="text-xl font-semibold">
                            Have a solution?
                        </h2>

                        <p className="mt-1 text-sm text-white/60">
                            Submit your university's proposal
                            for this civic challenge.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                `/university/challenges/${challenge._id}/submit`
                            )
                        }
                        disabled={
                            challenge.status !== "Open"
                        }
                        className="flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#13243b] transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Submit Solution
                        <ArrowRight size={16} />
                    </button>

                </div>

            </main>
        </div>
    );
}