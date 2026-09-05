import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    LogOut,
    Building2,
    Loader2,
    AlertCircle,
    ArrowRight,
    Sparkles,
    X,
    Send,
    CheckCircle2,
} from "lucide-react";
import { signOut } from "firebase/auth";

import { auth } from "../../firebase/config";
import api from "../../services/api";

export default function IndustryDashboard() {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [interestSolution, setInterestSolution] = useState(null);
    const [interestLoading, setInterestLoading] = useState(false);
    const [interestSuccess, setInterestSuccess] = useState("");

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            window.location.href = "/login";
        } catch (error) {
            console.error("Sign out failed:", error);
        }
    };

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                setLoading(true);
                setError("");

                const user = auth.currentUser;

                if (!user) {
                    setError(
                        "You are not authenticated. Please log in again."
                    );
                    return;
                }

                const token = await user.getIdToken();

                const response = await api.get(
                    "/industry/recommendations",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setRecommendations(
                    response.data?.recommendations || []
                );

            } catch (error) {
                console.error(
                    "Failed to fetch industry recommendations:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load recommended solutions."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, []);

    const openInterestModal = (recommendation) => {
        setInterestSuccess("");
        setError("");
        setInterestSolution(recommendation);
    };

    const closeInterestModal = () => {
        if (interestLoading) return;

        setInterestSolution(null);
        setInterestSuccess("");
    };

    const handleInterestSubmitted = () => {
        setInterestSuccess(
            "Interest request sent successfully."
        );
    };

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
                        Industry
                    </p>

                    <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
                        Discover Solutions.
                    </h1>

                    <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#13243b]/60">
                        Explore university solutions matched to
                        your organization's domains and
                        capabilities.
                    </p>

                </div>


                {/* SUMMARY */}

                <div className="mb-10 grid gap-4 sm:grid-cols-2">

                    <div className="rounded-[20px] border border-[#13243b]/10 bg-white p-5">

                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e7f8fa] text-[#148aa0]">
                                <Sparkles size={20} />
                            </div>

                            <div>

                                <p className="text-xs uppercase tracking-wider text-[#13243b]/45">
                                    Recommended Solutions
                                </p>

                                <p className="mt-1 text-2xl font-semibold">
                                    {recommendations.length}
                                </p>

                            </div>

                        </div>

                    </div>


                    <div className="rounded-[20px] border border-[#13243b]/10 bg-white p-5">

                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef0ff] text-[#5262c9]">
                                <Building2 size={20} />
                            </div>

                            <div>

                                <p className="text-xs uppercase tracking-wider text-[#13243b]/45">
                                    Collaboration
                                </p>

                                <p className="mt-1 text-sm font-medium">
                                    Find a solution to support
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


                {/* LOADING */}

                {loading ? (

                    <div className="flex min-h-[300px] items-center justify-center">

                        <div className="flex items-center gap-3 text-sm text-[#13243b]/55">

                            <Loader2
                                size={20}
                                className="animate-spin"
                            />

                            Finding solutions for your organization...

                        </div>

                    </div>

                ) : recommendations.length === 0 ? (

                    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-[28px] border border-[#13243b]/10 bg-white px-6 text-center">

                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e7f8fa] text-[#148aa0]">
                            <Building2 size={24} />
                        </div>

                        <h2 className="mt-5 text-2xl font-semibold">
                            No matching solutions yet
                        </h2>

                        <p className="mt-2 max-w-md text-sm leading-relaxed text-[#13243b]/55">
                            University solutions that match your
                            organization's domains will appear here.
                        </p>

                    </div>

                ) : (

                    <div className="grid gap-5 lg:grid-cols-2">

                        {recommendations.map(
                            (recommendation) => (
                                <SolutionCard
                                    key={recommendation.solutionId}
                                    recommendation={recommendation}
                                    onShowInterest={
                                        openInterestModal
                                    }
                                />
                            )
                        )}

                    </div>

                )}

            </main>


            {/* INTEREST MODAL */}

            {interestSolution && (
                <InterestModal
                    recommendation={interestSolution}
                    onClose={closeInterestModal}
                    onSuccess={handleInterestSubmitted}
                    loading={interestLoading}
                    setLoading={setInterestLoading}
                />
            )}

        </div>
    );
}


/* =========================================
   SOLUTION CARD
========================================= */

function SolutionCard({
    recommendation,
    onShowInterest,
}) {
    const score = recommendation.matchScore || 0;

    return (
        <article className="rounded-[24px] border border-[#13243b]/10 bg-white p-6 shadow-[0_10px_35px_rgba(19,36,59,0.05)]">

            {/* TOP */}

            <div className="flex items-start justify-between gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e7f8fa] text-[#148aa0]">
                    <Sparkles size={21} />
                </div>

                <div
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                        score >= 75
                            ? "bg-[#dff5f7] text-[#148aa0]"
                            : score >= 50
                            ? "bg-[#fff4d8] text-[#a56a00]"
                            : "bg-[#f1f1f1] text-[#13243b]/60"
                    }`}
                >
                    {score}% Match
                </div>

            </div>


            {/* TITLE */}

            <h2 className="mt-5 text-xl font-semibold leading-snug">
                {recommendation.title}
            </h2>


            {/* UNIVERSITY */}

            <div className="mt-3 flex items-center gap-2 text-sm text-[#13243b]/55">
                <Building2 size={15} />
                University solution
            </div>


            {/* DESCRIPTION */}

            <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-[#13243b]/60">
                {recommendation.description}
            </p>


            {/* TECHNOLOGIES */}

            {recommendation.technologies?.length > 0 && (
                <div className="mt-5">

                    <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[#13243b]/40">
                        Technologies
                    </p>

                    <div className="flex flex-wrap gap-2">

                        {recommendation.technologies.map(
                            (technology) => (
                                <span
                                    key={technology}
                                    className="rounded-full border border-[#13243b]/10 bg-[#faf9f6] px-3 py-1.5 text-xs"
                                >
                                    {technology}
                                </span>
                            )
                        )}

                    </div>

                </div>
            )}


            {/* MATCHED DOMAINS */}

            {recommendation.matchedRequiredDomains?.length >
                0 && (
                <div className="mt-5">

                    <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[#13243b]/40">
                        Matching Domains
                    </p>

                    <div className="flex flex-wrap gap-2">

                        {recommendation.matchedRequiredDomains.map(
                            (domain) => (
                                <span
                                    key={domain}
                                    className="rounded-full bg-[#eef0ff] px-3 py-1.5 text-xs font-medium text-[#5262c9]"
                                >
                                    ✓ {domain}
                                </span>
                            )
                        )}

                    </div>

                </div>
            )}


            {/* FOOTER */}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#13243b]/10 pt-5">

                <div className="text-xs text-[#13243b]/45">
                    University solution
                </div>

                <div className="flex items-center gap-2">

                    <Link
                        to={`/industry/solutions/${recommendation.solutionId}`}
                        className="flex items-center gap-2 rounded-full border border-[#13243b]/10 px-4 py-2 text-xs font-medium transition hover:bg-[#13243b]/5"
                    >
                        View Solution
                        <ArrowRight size={14} />
                    </Link>

                    <button
                        type="button"
                        onClick={() =>
                            onShowInterest(recommendation)
                        }
                        className="flex items-center gap-2 rounded-full bg-[#13243b] px-4 py-2 text-xs font-medium text-white transition hover:opacity-90"
                    >
                        Show Interest
                        <ArrowRight size={14} />
                    </button>

                </div>

            </div>

        </article>
    );
}


/* =========================================
   INTEREST MODAL
========================================= */

function InterestModal({
    recommendation,
    onClose,
    onSuccess,
    loading,
    setLoading,
}) {
    const [message, setMessage] = useState("");
    const [proposedRole, setProposedRole] = useState("");
    const [capabilities, setCapabilities] = useState("");
    const [resourcesOffered, setResourcesOffered] = useState("");
    const [pilotProposal, setPilotProposal] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");

        if (message.trim().length < 20) {
            setError(
                "Interest message must be at least 20 characters."
            );
            return;
        }

        if (proposedRole.trim().length < 5) {
            setError(
                "Proposed role must be at least 5 characters."
            );
            return;
        }

        try {
            setLoading(true);

            const user = auth.currentUser;

            if (!user) {
                setError(
                    "You are not authenticated. Please log in again."
                );
                return;
            }

            const token = await user.getIdToken();

            const splitValues = (value) =>
                value
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean);

            await api.post(
                "/industry-interests",
                {
                    solutionId:
                        recommendation.solutionId,

                    message: message.trim(),

                    proposedRole:
                        proposedRole.trim(),

                    capabilities:
                        splitValues(capabilities),

                    resourcesOffered:
                        splitValues(resourcesOffered),

                    pilotProposal:
                        pilotProposal.trim() || undefined,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setSuccess(true);
            onSuccess();

        } catch (error) {
            console.error(
                "Failed to submit industry interest:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to send interest request."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#13243b]/40 px-5 py-6 backdrop-blur-sm">

            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[28px] bg-white shadow-2xl">

                {/* HEADER */}

                <div className="flex items-start justify-between border-b border-[#13243b]/10 p-6">

                    <div>

                        <p className="text-xs font-medium uppercase tracking-wider text-[#148aa0]">
                            Collaboration
                        </p>

                        <h2 className="mt-2 text-2xl font-semibold">
                            Show Interest
                        </h2>

                        <p className="mt-1 text-sm text-[#13243b]/55">
                            Send a collaboration request to the
                            university behind this solution.
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-full p-2 transition hover:bg-[#13243b]/5"
                    >
                        <X size={20} />
                    </button>

                </div>


                {/* SOLUTION */}

                <div className="mx-6 mt-6 rounded-2xl bg-[#faf9f6] p-4">

                    <p className="text-xs uppercase tracking-wider text-[#13243b]/40">
                        Solution
                    </p>

                    <p className="mt-1 font-semibold">
                        {recommendation.title}
                    </p>

                </div>


                {success ? (

                    /* SUCCESS */

                    <div className="p-8 text-center">

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#dff5f7] text-[#148aa0]">
                            <CheckCircle2 size={27} />
                        </div>

                        <h3 className="mt-5 text-xl font-semibold">
                            Interest sent
                        </h3>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#13243b]/55">
                            Your collaboration request has been
                            sent to the university. They can now
                            review and accept or reject your proposal.
                        </p>

                        <button
                            type="button"
                            onClick={onClose}
                            className="mt-6 rounded-full bg-[#13243b] px-6 py-2.5 text-sm font-medium text-white"
                        >
                            Done
                        </button>

                    </div>

                ) : (

                    /* FORM */

                    <form
                        onSubmit={handleSubmit}
                        className="p-6"
                    >

                        {error && (
                            <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">

                                <AlertCircle
                                    size={17}
                                    className="mt-0.5 shrink-0"
                                />

                                <span>{error}</span>

                            </div>
                        )}


                        {/* MESSAGE */}

                        <Field
                            label="Message"
                            required
                        >
                            <textarea
                                value={message}
                                onChange={(e) =>
                                    setMessage(e.target.value)
                                }
                                placeholder="Explain why your organization is interested in this solution..."
                                rows={4}
                                className="input resize-none"
                                required
                            />
                        </Field>


                        {/* ROLE */}

                        <Field
                            label="Proposed Role"
                            required
                        >
                            <input
                                type="text"
                                value={proposedRole}
                                onChange={(e) =>
                                    setProposedRole(e.target.value)
                                }
                                placeholder="Technical sponsor, implementation partner, mentor..."
                                className="input"
                                required
                            />
                        </Field>


                        {/* CAPABILITIES */}

                        <Field
                            label="Capabilities"
                            hint="Separate multiple items with commas"
                        >
                            <input
                                type="text"
                                value={capabilities}
                                onChange={(e) =>
                                    setCapabilities(e.target.value)
                                }
                                placeholder="IoT deployment, engineering team, testing"
                                className="input"
                            />
                        </Field>


                        {/* RESOURCES */}

                        <Field
                            label="Resources Offered"
                            hint="Separate multiple items with commas"
                        >
                            <input
                                type="text"
                                value={resourcesOffered}
                                onChange={(e) =>
                                    setResourcesOffered(e.target.value)
                                }
                                placeholder="Hardware, funding, workspace, technical staff"
                                className="input"
                            />
                        </Field>


                        {/* PILOT */}

                        <Field
                            label="Pilot Proposal"
                            hint="Optional"
                        >
                            <textarea
                                value={pilotProposal}
                                onChange={(e) =>
                                    setPilotProposal(e.target.value)
                                }
                                placeholder="Describe how you could support a future pilot..."
                                rows={4}
                                className="input resize-none"
                            />
                        </Field>


                        {/* ACTIONS */}

                        <div className="mt-7 flex justify-end gap-3">

                            <button
                                type="button"
                                onClick={onClose}
                                disabled={loading}
                                className="rounded-full border border-[#13243b]/10 px-5 py-2.5 text-sm font-medium transition hover:bg-[#13243b]/5"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-2 rounded-full bg-[#13243b] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                            >

                                {loading ? (
                                    <>
                                        <Loader2
                                            size={16}
                                            className="animate-spin"
                                        />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send size={16} />
                                        Send Request
                                    </>
                                )}

                            </button>

                        </div>

                    </form>

                )}

            </div>

        </div>
    );
}


/* =========================================
   FORM FIELD
========================================= */

function Field({
    label,
    required,
    hint,
    children,
}) {
    return (
        <div className="mt-5">

            <div className="mb-2 flex items-baseline justify-between">

                <label className="text-sm font-medium">
                    {label}
                    {required && (
                        <span className="ml-1 text-[#148aa0]">
                            *
                        </span>
                    )}
                </label>

                {hint && (
                    <span className="text-xs text-[#13243b]/40">
                        {hint}
                    </span>
                )}

            </div>

            {children}

        </div>
    );
}