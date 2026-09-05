import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    LogOut,
    Trophy,
    Loader2,
    AlertCircle,
    Users,
    ArrowRight,
    CheckCircle2,
} from "lucide-react";
import { signOut } from "firebase/auth";

import { useAuth } from "../../hooks/useAuth";
import { auth } from "../../firebase/config";
import api from "../../services/api";

export default function UniversityDashboard() {
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [submittedChallengeIds, setSubmittedChallengeIds] =
        useState(new Set());

    const {
        user,
        loading: authLoading,
    } = useAuth();

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            window.location.href = "/login";
        } catch (error) {
            console.error("Sign out failed:", error);
        }
    };

    useEffect(() => {
        if (authLoading) {
            return;
        }

        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError("");

                if (!user) {
                    setError(
                        "You are not authenticated. Please log in again."
                    );
                    setLoading(false);
                    return;
                }

                const token = await user.getIdToken();

                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };

                const [
                    challengesResponse,
                    solutionsResponse,
                ] = await Promise.all([
                    api.get("/challenges", config),
                    api.get("/solutions/my", config),
                ]);

                const fetchedChallenges =
                    challengesResponse.data?.challenges || [];

                const fetchedSolutions =
                    solutionsResponse.data?.solutions || [];

                setChallenges(fetchedChallenges);

                const submittedIds = new Set(
                    fetchedSolutions.map(
                        (solution) =>
                            String(solution.challengeId)
                    )
                );

                setSubmittedChallengeIds(submittedIds);

            } catch (error) {
                console.error(
                    "Failed to fetch dashboard data:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load civic challenges."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();

    }, [user, authLoading]);

    return (
        <div className="min-h-screen bg-[#faf9f6] text-[#13243b]">

            {/* NAVBAR */}

            <nav className="border-b border-[#13243b]/10 bg-[#faf9f6]">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">

                    <Link
                        to="/"
                        className="flex items-center gap-3"
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#13243b] text-sm font-bold text-white">
                            S
                        </div>

                        <span className="text-lg font-semibold">
                            Sankalp
                        </span>
                    </Link>

                    <button
                        type="button"
                        onClick={handleSignOut}
                        className="flex items-center gap-2 rounded-full border border-[#13243b]/10 px-4 py-2 text-sm font-medium hover:bg-[#13243b]/5"
                    >
                        <LogOut size={16} />
                        Sign out
                    </button>

                </div>
            </nav>

            {/* MAIN */}

            <main className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">

                {/* HEADER */}

                <div className="mb-10">

                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#148aa0]">
                        University
                    </p>

                    <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
                        Civic Challenges
                    </h1>

                    <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#13243b]/60">
                        Explore real-world civic problems and
                        discover opportunities for students to
                        contribute meaningful solutions.
                    </p>

                </div>

                {/* STATS */}

                <div className="mb-10 grid gap-4 sm:grid-cols-2">

                    <div className="rounded-[20px] border border-[#13243b]/10 bg-white p-5">

                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e7f8fa] text-[#148aa0]">
                                <Trophy size={20} />
                            </div>

                            <div>

                                <p className="text-xs uppercase tracking-wider text-[#13243b]/45">
                                    Active Challenges
                                </p>

                                <p className="mt-1 text-2xl font-semibold">
                                    {challenges.length}
                                </p>

                            </div>

                        </div>

                    </div>

                    <div className="rounded-[20px] border border-[#13243b]/10 bg-white p-5">

                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef0ff] text-[#5262c9]">
                                <Users size={20} />
                            </div>

                            <div>

                                <p className="text-xs uppercase tracking-wider text-[#13243b]/45">
                                    Opportunities
                                </p>

                                <p className="mt-1 text-2xl font-semibold">
                                    {challenges.length}
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

                {/* ERROR */}

                {error && (
                    <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">

                        <AlertCircle
                            size={18}
                            className="mt-0.5 shrink-0"
                        />

                        <span>{error}</span>

                    </div>
                )}

                {/* AUTH LOADING */}

                {authLoading ? (

                    <div className="flex min-h-[300px] items-center justify-center">

                        <div className="flex items-center gap-3 text-sm text-[#13243b]/55">

                            <Loader2
                                size={20}
                                className="animate-spin"
                            />

                            Restoring your session...

                        </div>

                    </div>

                ) : loading ? (

                    <div className="flex min-h-[300px] items-center justify-center">

                        <div className="flex items-center gap-3 text-sm text-[#13243b]/55">

                            <Loader2
                                size={20}
                                className="animate-spin"
                            />

                            Loading challenges...

                        </div>

                    </div>

                ) : challenges.length === 0 ? (

                    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-[28px] border border-[#13243b]/10 bg-white px-6 text-center">

                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e7f8fa] text-[#148aa0]">
                            <Trophy size={24} />
                        </div>

                        <h2 className="mt-5 text-2xl font-semibold">
                            No active challenges
                        </h2>

                        <p className="mt-2 max-w-md text-sm leading-relaxed text-[#13243b]/55">
                            New challenges will appear here when
                            civic problems are identified and
                            converted into opportunities for
                            collaboration.
                        </p>

                    </div>

                ) : (

                    <div className="grid gap-5 lg:grid-cols-2">

                        {challenges.map((challenge) => (
                            <ChallengeCard
                                key={challenge._id}
                                challenge={challenge}
                                submitted={
                                    submittedChallengeIds.has(
                                        String(challenge._id)
                                    )
                                }
                            />
                        ))}

                    </div>

                )}

            </main>

        </div>
    );
}


/* =========================================
   CHALLENGE CARD
========================================= */

function ChallengeCard({
    challenge,
    submitted,
}) {
    return (
        <article
            className={`rounded-[24px] border p-6 shadow-[0_10px_35px_rgba(19,36,59,0.05)] ${
                submitted
                    ? "border-[#9bd9df] bg-[#f3fbfc]"
                    : "border-[#13243b]/10 bg-white"
            }`}
        >

            {/* TOP */}

            <div className="flex items-start justify-between gap-4">

                <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                        submitted
                            ? "bg-[#dff5f7] text-[#148aa0]"
                            : "bg-[#e7f8fa] text-[#148aa0]"
                    }`}
                >
                    {submitted ? (
                        <CheckCircle2 size={21} />
                    ) : (
                        <Trophy size={21} />
                    )}
                </div>

                {submitted ? (
                    <span className="rounded-full bg-[#dff5f7] px-3 py-1.5 text-xs font-medium text-[#148aa0]">
                        Solution Submitted
                    </span>
                ) : (
                    <span className="rounded-full border border-[#cdeef3] bg-[#e7f8fa] px-3 py-1.5 text-xs font-medium text-[#148aa0]">
                        {challenge.status}
                    </span>
                )}

            </div>

            {/* TITLE */}

            <h2 className="mt-5 text-xl font-semibold leading-snug">
                {challenge.title}
            </h2>

            {/* CATEGORY */}

            <p className="mt-2 text-xs font-medium uppercase tracking-wider text-[#148aa0]">
                {challenge.category}
            </p>

            {/* PROBLEM */}

            <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-[#13243b]/60">
                {challenge.problemStatement}
            </p>

            {/* DOMAINS */}

            {challenge.requiredDomains?.length > 0 && (
                <div className="mt-5">

                    <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[#13243b]/40">
                        Required Domains
                    </p>

                    <div className="flex flex-wrap gap-2">

                        {challenge.requiredDomains.map(
                            (domain) => (
                                <span
                                    key={domain}
                                    className="rounded-full border border-[#13243b]/10 bg-[#fafafa] px-3 py-1.5 text-xs"
                                >
                                    {domain}
                                </span>
                            )
                        )}

                    </div>

                </div>
            )}

            {/* FOOTER */}

            <div className="mt-6 flex items-center justify-between border-t border-[#13243b]/10 pt-5">

                <div className="text-xs text-[#13243b]/45">

                    Based on{" "}

                    <span className="font-medium text-[#13243b]/70">
                        {challenge.reportCount}
                    </span>{" "}

                    citizen report
                    {challenge.reportCount === 1
                        ? ""
                        : "s"}

                </div>

                {submitted ? (

                    <Link
                        to={`/university/challenges/${challenge._id}/submission`}
                        className="flex items-center gap-2 rounded-full border border-[#9bd9df] bg-white px-4 py-2 text-xs font-medium text-[#148aa0] transition hover:bg-[#e7f8fa]"
                    >
                        View Submission
                        <ArrowRight size={14} />
                    </Link>

                ) : (

                    <Link
                        to={`/university/challenges/${challenge._id}`}
                        className="flex items-center gap-2 rounded-full bg-[#13243b] px-4 py-2 text-xs font-medium text-white transition hover:opacity-90"
                    >
                        View Challenge
                        <ArrowRight size={14} />
                    </Link>

                )}

            </div>

        </article>
    );
}