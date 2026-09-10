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
    FileText,
} from "lucide-react";
import { signOut } from "firebase/auth";

import { useAuth } from "../../hooks/useAuth";
import { auth } from "../../firebase/config";
import api from "../../services/api";
import ApplyPilotModal from "./ApplyPilotModal";

export default function UniversityDashboard() {
    const [activeSection, setActiveSection] = useState(
        "challenges"
    );

    const [challenges, setChallenges] = useState([]);
    const [solutions, setSolutions] = useState([]);
    const [interests, setInterests] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [pilotInterest, setPilotInterest] = useState(null);

    const [submittedChallengeIds, setSubmittedChallengeIds] =
        useState(new Set());

    const [interestActionLoading, setInterestActionLoading] =
        useState("");

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
                interestsResponse,
            ] = await Promise.all([
                api.get("/challenges", config),
                api.get("/solutions/my", config),
                api.get(
                    "/industry-interests/received",
                    config
                ),
            ]);

            const fetchedChallenges =
                challengesResponse.data?.challenges || [];

            const fetchedSolutions =
                solutionsResponse.data?.solutions || [];

            const fetchedInterests =
                interestsResponse.data?.interests || [];

            setChallenges(fetchedChallenges);
            setSolutions(fetchedSolutions);
            setInterests(fetchedInterests);

            const submittedIds = new Set(
                fetchedSolutions.map((solution) =>
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
                "Failed to load university dashboard."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (authLoading) {
            return;
        }

        fetchDashboardData();
    }, [user, authLoading]);

    const handleInterestAction = async (
        interestId,
        action
    ) => {
        try {
            setError("");

            setInterestActionLoading(
                `${interestId}-${action}`
            );

            const currentUser = auth.currentUser;

            if (!currentUser) {
                setError(
                    "You are not authenticated. Please log in again."
                );
                return;
            }

            const token =
                await currentUser.getIdToken();

            await api.patch(
                `/industry-interests/${interestId}/${action}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setInterests((current) =>
                current.map((interest) =>
                    String(interest._id) ===
                    String(interestId)
                        ? {
                              ...interest,
                              status:
                                  action === "accept"
                                      ? "Accepted"
                                      : "Rejected",
                          }
                        : interest
                )
            );
        } catch (error) {
            console.error(
                `Failed to ${action} industry interest:`,
                error
            );

            setError(
                error.response?.data?.message ||
                `Failed to ${action} interest request.`
            );
        } finally {
            setInterestActionLoading("");
        }
    };

    const handlePilotSuccess = async () => {
        setPilotInterest(null);
        setError("");
        setActiveSection("interests");

        await fetchDashboardData();
    };

    const pendingInterests = interests.filter(
        (interest) => interest.status === "Pending"
    );

    const acceptedInterests = interests.filter(
        (interest) => interest.status === "Accepted"
    );

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
                        className="flex items-center gap-2 rounded-full border border-[#13243b]/10 px-4 py-2 text-sm font-medium transition hover:bg-[#13243b]/5"
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
                        University Workspace
                    </p>

                    <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
                        Your Dashboard.
                    </h1>

                    <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#13243b]/60">
                        Discover civic challenges, manage your
                        solutions, and collaborate with industry
                        partners.
                    </p>

                </div>


                {/* SUMMARY CARDS */}

                <div className="mb-8 grid gap-4 sm:grid-cols-3">

                    {/* CHALLENGES */}

                    <button
                        type="button"
                        onClick={() =>
                            setActiveSection("challenges")
                        }
                        className={`rounded-[20px] border bg-white p-5 text-left transition ${
                            activeSection === "challenges"
                                ? "border-[#148aa0] shadow-[0_8px_30px_rgba(20,138,160,0.10)]"
                                : "border-[#13243b]/10 hover:border-[#13243b]/20"
                        }`}
                    >
                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e7f8fa] text-[#148aa0]">
                                <Trophy size={20} />
                            </div>

                            <div>
                                <p className="text-xs uppercase tracking-wider text-[#13243b]/45">
                                    Available Challenges
                                </p>

                                <p className="mt-1 text-2xl font-semibold">
                                    {challenges.length}
                                </p>
                            </div>

                        </div>
                    </button>


                    {/* SOLUTIONS */}

                    <button
                        type="button"
                        onClick={() =>
                            setActiveSection("solutions")
                        }
                        className={`rounded-[20px] border bg-white p-5 text-left transition ${
                            activeSection === "solutions"
                                ? "border-[#5262c9] shadow-[0_8px_30px_rgba(82,98,201,0.10)]"
                                : "border-[#13243b]/10 hover:border-[#13243b]/20"
                        }`}
                    >
                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef0ff] text-[#5262c9]">
                                <FileText size={20} />
                            </div>

                            <div>
                                <p className="text-xs uppercase tracking-wider text-[#13243b]/45">
                                    My Solutions
                                </p>

                                <p className="mt-1 text-2xl font-semibold">
                                    {solutions.length}
                                </p>
                            </div>

                        </div>
                    </button>


                    {/* INTERESTS */}

                    <button
                        type="button"
                        onClick={() =>
                            setActiveSection("interests")
                        }
                        className={`rounded-[20px] border bg-white p-5 text-left transition ${
                            activeSection === "interests"
                                ? "border-[#148aa0] shadow-[0_8px_30px_rgba(20,138,160,0.10)]"
                                : "border-[#13243b]/10 hover:border-[#13243b]/20"
                        }`}
                    >
                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e7f8fa] text-[#148aa0]">
                                <Users size={20} />
                            </div>

                            <div>
                                <p className="text-xs uppercase tracking-wider text-[#13243b]/45">
                                    Industry Interests
                                </p>

                                <p className="mt-1 text-2xl font-semibold">
                                    {pendingInterests.length}
                                </p>
                            </div>

                        </div>
                    </button>

                </div>


                {/* NAVIGATION TABS */}

                <div className="mb-8 flex flex-wrap gap-2 border-b border-[#13243b]/10 pb-3">

                    <SectionTab
                        active={
                            activeSection === "challenges"
                        }
                        onClick={() =>
                            setActiveSection("challenges")
                        }
                        icon={<Trophy size={15} />}
                    >
                        Available Challenges
                    </SectionTab>

                    <SectionTab
                        active={
                            activeSection === "solutions"
                        }
                        onClick={() =>
                            setActiveSection("solutions")
                        }
                        icon={<FileText size={15} />}
                    >
                        My Solutions
                    </SectionTab>

                    <SectionTab
                        active={
                            activeSection === "interests"
                        }
                        onClick={() =>
                            setActiveSection("interests")
                        }
                        icon={<Users size={15} />}
                    >
                        Industry Interests

                        {pendingInterests.length > 0 && (
                            <span className="ml-1 rounded-full bg-[#148aa0] px-2 py-0.5 text-[10px] text-white">
                                {pendingInterests.length}
                            </span>
                        )}
                    </SectionTab>

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


                {/* LOADING */}

                {authLoading ? (

                    <LoadingState text="Restoring your session..." />

                ) : loading ? (

                    <LoadingState text="Loading your workspace..." />

                ) : (

                    <>

                        {/* AVAILABLE CHALLENGES */}

                        {activeSection === "challenges" && (
                            <section>

                                <SectionHeader
                                    eyebrow="Discover"
                                    title="Available Challenges"
                                    description="Explore real civic problems and find opportunities for your university to contribute solutions."
                                />

                                {challenges.length === 0 ? (

                                    <EmptyState
                                        icon={
                                            <Trophy
                                                size={24}
                                            />
                                        }
                                        title="No active challenges"
                                        description="New challenges will appear here when civic problems are identified and converted into opportunities."
                                    />

                                ) : (

                                    <div className="grid gap-5 lg:grid-cols-2">

                                        {challenges.map(
                                            (challenge) => (
                                                <ChallengeCard
                                                    key={
                                                        challenge._id
                                                    }
                                                    challenge={
                                                        challenge
                                                    }
                                                    submitted={
                                                        submittedChallengeIds.has(
                                                            String(
                                                                challenge._id
                                                            )
                                                        )
                                                    }
                                                />
                                            )
                                        )}

                                    </div>

                                )}

                            </section>
                        )}


                        {/* MY SOLUTIONS */}

                        {activeSection === "solutions" && (
                            <section>

                                <SectionHeader
                                    eyebrow="Your Work"
                                    title="My Solutions"
                                    description="Track the solutions your university has submitted to civic challenges."
                                />

                                {solutions.length === 0 ? (

                                    <EmptyState
                                        icon={
                                            <FileText
                                                size={24}
                                            />
                                        }
                                        title="No solutions submitted"
                                        description="Submit a solution to a civic challenge and it will appear here."
                                    />

                                ) : (

                                    <div className="grid gap-5 lg:grid-cols-2">

                                        {solutions.map(
                                            (solution) => (
                                                <SolutionCard
                                                    key={
                                                        solution._id
                                                    }
                                                    solution={
                                                        solution
                                                    }
                                                />
                                            )
                                        )}

                                    </div>

                                )}

                            </section>
                        )}


                        {/* INDUSTRY INTERESTS */}

                        {activeSection === "interests" && (
                            <section>

                                <SectionHeader
                                    eyebrow="Collaboration"
                                    title="Industry Interests"
                                    description="Organizations interested in supporting your university's solutions."
                                />

                                {interests.length === 0 ? (

                                    <EmptyState
                                        icon={
                                            <Users
                                                size={24}
                                            />
                                        }
                                        title="No industry interests yet"
                                        description="When an industry partner is interested in one of your solutions, their collaboration request will appear here."
                                    />

                                ) : (

                                    <div className="grid gap-5 lg:grid-cols-2">

                                        {interests.map(
                                            (interest) => (
                                                <InterestCard
                                                    key={
                                                        interest._id
                                                    }
                                                    interest={
                                                        interest
                                                    }
                                                    actionLoading={
                                                        interestActionLoading
                                                    }
                                                    onAction={
                                                        handleInterestAction
                                                    }
                                                    onApplyPilot={
                                                        setPilotInterest
                                                    }
                                                />
                                            )
                                        )}

                                    </div>

                                )}

                            </section>
                        )}

                    </>
                )}

            </main>


            {/* APPLY FOR PILOT MODAL */}

            {pilotInterest && (
                <ApplyPilotModal
                    interest={pilotInterest}
                    onClose={() =>
                        setPilotInterest(null)
                    }
                    onSuccess={handlePilotSuccess}
                />
            )}

        </div>
    );
}


/* =========================================
   SECTION TAB
========================================= */

function SectionTab({
    active,
    onClick,
    icon,
    children,
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition ${
                active
                    ? "bg-[#13243b] text-white"
                    : "text-[#13243b]/55 hover:bg-[#13243b]/5 hover:text-[#13243b]"
            }`}
        >
            {icon}
            {children}
        </button>
    );
}


/* =========================================
   SECTION HEADER
========================================= */

function SectionHeader({
    eyebrow,
    title,
    description,
}) {
    return (
        <div className="mb-7">

            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#148aa0]">
                {eyebrow}
            </p>

            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                {title}
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#13243b]/55">
                {description}
            </p>

        </div>
    );
}


/* =========================================
   LOADING
========================================= */

function LoadingState({ text }) {
    return (
        <div className="flex min-h-[300px] items-center justify-center">

            <div className="flex items-center gap-3 text-sm text-[#13243b]/55">

                <Loader2
                    size={20}
                    className="animate-spin"
                />

                {text}

            </div>

        </div>
    );
}


/* =========================================
   EMPTY STATE
========================================= */

function EmptyState({
    icon,
    title,
    description,
}) {
    return (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[28px] border border-[#13243b]/10 bg-white px-6 text-center">

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e7f8fa] text-[#148aa0]">
                {icon}
            </div>

            <h3 className="mt-5 text-2xl font-semibold">
                {title}
            </h3>

            <p className="mt-2 max-w-md text-sm leading-relaxed text-[#13243b]/55">
                {description}
            </p>

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


            <h3 className="mt-5 break-words text-xl font-semibold leading-snug">
                {challenge.title}
            </h3>


            <p className="mt-2 text-xs font-medium uppercase tracking-wider text-[#148aa0]">
                {challenge.category}
            </p>


            <p className="mt-4 break-words whitespace-pre-wrap text-sm leading-relaxed text-[#13243b]/60">
                {challenge.problemStatement}
            </p>


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
                                    className="break-words rounded-full border border-[#13243b]/10 bg-[#fafafa] px-3 py-1.5 text-xs"
                                >
                                    {domain}
                                </span>
                            )
                        )}

                    </div>

                </div>
            )}


            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#13243b]/10 pt-5">

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


/* =========================================
   SOLUTION CARD
========================================= */

function SolutionCard({ solution }) {
    return (
        <article className="rounded-[24px] border border-[#13243b]/10 bg-white p-6 shadow-[0_10px_35px_rgba(19,36,59,0.05)]">

            <div className="flex items-start justify-between gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eef0ff] text-[#5262c9]">
                    <FileText size={21} />
                </div>

                <span
                    className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                        solution.status === "Accepted"
                            ? "bg-[#dff5f7] text-[#148aa0]"
                            : solution.status === "Rejected"
                                ? "bg-red-50 text-red-600"
                                : "bg-[#fff4d8] text-[#a56a00]"
                    }`}
                >
                    {solution.status}
                </span>

            </div>


            <h3 className="mt-5 break-words text-xl font-semibold leading-snug">
                {solution.title}
            </h3>


            {solution.description && (
                <p className="mt-3 break-words whitespace-pre-wrap text-sm leading-relaxed text-[#13243b]/60">
                    {solution.description}
                </p>
            )}


            {solution.technologies?.length > 0 && (
                <div className="mt-5">

                    <p className="mb-2 text-xs uppercase tracking-wider text-[#13243b]/40">
                        Technologies
                    </p>

                    <div className="flex flex-wrap gap-2">

                        {solution.technologies.map(
                            (technology) => (
                                <span
                                    key={technology}
                                    className="max-w-full break-words rounded-full border border-[#13243b]/10 bg-[#faf9f6] px-3 py-1.5 text-xs"
                                >
                                    {technology}
                                </span>
                            )
                        )}

                    </div>

                </div>
            )}


            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#13243b]/10 pt-5">

                <div className="text-xs text-[#13243b]/45">
                    Submitted solution
                </div>

                <Link
                    to={`/university/challenges/${solution.challengeId}/submission`}
                    className="flex items-center gap-2 rounded-full border border-[#13243b]/10 px-4 py-2 text-xs font-medium transition hover:bg-[#13243b]/5"
                >
                    View Submission
                    <ArrowRight size={14} />
                </Link>

            </div>

        </article>
    );
}


/* =========================================
   INDUSTRY INTEREST CARD
========================================= */

function InterestCard({
    interest,
    actionLoading,
    onAction,
    onApplyPilot,
}) {
    const industry = interest.industryId;
    const solution = interest.solutionId;

    return (
        <article className="min-w-0 rounded-[24px] border border-[#13243b]/10 bg-white p-6 shadow-[0_10px_35px_rgba(19,36,59,0.05)]">

            {/* TOP */}

            <div className="flex min-w-0 items-start justify-between gap-4">

                <div className="min-w-0">

                    <p className="text-xs font-medium uppercase tracking-wider text-[#148aa0]">
                        Industry Interest
                    </p>

                    <h3 className="mt-2 break-words text-xl font-semibold">
                        {industry?.name ||
                            industry?.companyName ||
                            "Industry Organization"}
                    </h3>

                </div>


                <span
                    className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${
                        interest.status === "Accepted"
                            ? "bg-[#dff5f7] text-[#148aa0]"
                            : interest.status === "Rejected"
                                ? "bg-red-50 text-red-600"
                                : "bg-[#fff4d8] text-[#a56a00]"
                    }`}
                >
                    {interest.status}
                </span>

            </div>


            {/* SOLUTION */}

            <div className="mt-5 min-w-0 rounded-2xl bg-[#faf9f6] p-4">

                <p className="text-xs uppercase tracking-wider text-[#13243b]/40">
                    Your Solution
                </p>

                <p className="mt-1 break-words font-semibold">
                    {solution?.title || "Solution"}
                </p>

            </div>


            {/* MESSAGE */}

            <div className="mt-5 min-w-0">

                <p className="text-xs uppercase tracking-wider text-[#13243b]/40">
                    Message
                </p>

                <p className="mt-2 break-words whitespace-pre-wrap text-sm leading-relaxed text-[#13243b]/65">
                    {interest.message}
                </p>

            </div>


            {/* ROLE */}

            {interest.proposedRole && (
                <div className="mt-5 min-w-0">

                    <p className="text-xs uppercase tracking-wider text-[#13243b]/40">
                        Proposed Role
                    </p>

                    <p className="mt-1 break-words text-sm font-medium">
                        {interest.proposedRole}
                    </p>

                </div>
            )}


            {/* CAPABILITIES */}

            {interest.capabilities?.length > 0 && (
                <div className="mt-5">

                    <p className="mb-2 text-xs uppercase tracking-wider text-[#13243b]/40">
                        Capabilities
                    </p>

                    <div className="flex flex-wrap gap-2">

                        {interest.capabilities.map(
                            (capability) => (
                                <span
                                    key={capability}
                                    className="max-w-full break-words rounded-full border border-[#13243b]/10 bg-[#faf9f6] px-3 py-1.5 text-xs"
                                >
                                    {capability}
                                </span>
                            )
                        )}

                    </div>

                </div>
            )}


            {/* RESOURCES */}

            {interest.resourcesOffered?.length > 0 && (
                <div className="mt-5">

                    <p className="mb-2 text-xs uppercase tracking-wider text-[#13243b]/40">
                        Resources Offered
                    </p>

                    <div className="flex flex-wrap gap-2">

                        {interest.resourcesOffered.map(
                            (resource) => (
                                <span
                                    key={resource}
                                    className="max-w-full break-words rounded-full border border-[#13243b]/10 bg-[#faf9f6] px-3 py-1.5 text-xs"
                                >
                                    {resource}
                                </span>
                            )
                        )}

                    </div>

                </div>
            )}


            {/* PILOT PROPOSAL */}

            {interest.pilotProposal && (
                <div className="mt-5 min-w-0">

                    <p className="text-xs uppercase tracking-wider text-[#13243b]/40">
                        Pilot Proposal
                    </p>

                    <p className="mt-2 break-words whitespace-pre-wrap text-sm leading-relaxed text-[#13243b]/65">
                        {interest.pilotProposal}
                    </p>

                </div>
            )}


            {/* ACTIONS */}

            {interest.status === "Pending" && (
                <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-[#13243b]/10 pt-5">

                    <button
                        type="button"
                        onClick={() =>
                            onAction(
                                interest._id,
                                "reject"
                            )
                        }
                        disabled={actionLoading !== ""}
                        className="rounded-full border border-red-200 px-5 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {actionLoading ===
                        `${interest._id}-reject`
                            ? "Rejecting..."
                            : "Reject"}
                    </button>


                    <button
                        type="button"
                        onClick={() =>
                            onAction(
                                interest._id,
                                "accept"
                            )
                        }
                        disabled={actionLoading !== ""}
                        className="flex items-center gap-2 rounded-full bg-[#13243b] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >

                        {actionLoading ===
                        `${interest._id}-accept` ? (
                            <>
                                <Loader2
                                    size={16}
                                    className="animate-spin"
                                />
                                Accepting...
                            </>
                        ) : (
                            <>
                                <CheckCircle2 size={16} />
                                Accept Interest
                            </>
                        )}

                    </button>

                </div>
            )}


            {/* ACCEPTED */}

            {interest.status === "Accepted" && (
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[#13243b]/10 pt-5">

                    <div className="flex items-center gap-2 text-sm font-medium text-[#148aa0]">
                        <CheckCircle2 size={17} />
                        Collaboration accepted
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            onApplyPilot(interest)
                        }
                        className="flex items-center gap-2 rounded-full bg-[#13243b] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
                    >
                        Apply for Pilot
                        <ArrowRight size={14} />
                    </button>

                </div>
            )}


            {/* REJECTED */}

            {interest.status === "Rejected" && (
                <div className="mt-6 border-t border-[#13243b]/10 pt-5">

                    <div className="flex items-center gap-2 text-sm font-medium text-red-600">
                        <AlertCircle size={17} />
                        Collaboration declined
                    </div>

                </div>
            )}

        </article>
    );
}