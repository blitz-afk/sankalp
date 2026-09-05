import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    ExternalLink,
    Github,
    Loader2,
    AlertCircle,
    CheckCircle2,
    FileText,
    PlayCircle,
} from "lucide-react";

import { auth } from "../../firebase/config";
import api from "../../services/api";

export default function UniversitySubmission() {
    const { id: challengeId } = useParams();
    const navigate = useNavigate();

    const [solution, setSolution] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchSubmission = async () => {
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
                    "/solutions/my",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const solutions =
                    response.data?.solutions || [];

                const submittedSolution = solutions.find(
                    (item) =>
                        String(item.challengeId) ===
                        String(challengeId)
                );

                if (!submittedSolution) {
                    setError(
                        "No submission found for this challenge."
                    );
                    return;
                }

                setSolution(submittedSolution);

            } catch (error) {
                console.error(
                    "Failed to fetch submission:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load your submission."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchSubmission();
    }, [challengeId, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#faf9f6] text-[#13243b]">
                <div className="flex min-h-screen items-center justify-center">

                    <div className="flex items-center gap-3 text-sm text-[#13243b]/55">

                        <Loader2
                            size={20}
                            className="animate-spin"
                        />

                        Loading submission...

                    </div>

                </div>
            </div>
        );
    }

    if (error || !solution) {
        return (
            <div className="min-h-screen bg-[#faf9f6] text-[#13243b]">

                <nav className="border-b border-[#13243b]/10">
                    <div className="mx-auto flex h-16 max-w-7xl items-center px-5 md:px-8">

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

                    </div>
                </nav>

                <main className="mx-auto flex min-h-[calc(100vh-64px)] max-w-3xl items-center justify-center px-5">

                    <div className="w-full rounded-[28px] border border-red-200 bg-white p-8 text-center">

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
                            <AlertCircle size={26} />
                        </div>

                        <h1 className="mt-5 text-2xl font-semibold">
                            Submission Not Found
                        </h1>

                        <p className="mt-2 text-sm text-[#13243b]/55">
                            {error}
                        </p>

                        <Link
                            to={`/university/challenges/${challengeId}`}
                            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#13243b] px-5 py-2.5 text-sm font-medium text-white"
                        >
                            <ArrowLeft size={16} />
                            Back to Challenge
                        </Link>

                    </div>

                </main>
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
                        to={`/university/challenges/${challengeId}`}
                        className="flex items-center gap-2 rounded-full border border-[#13243b]/10 px-4 py-2 text-sm font-medium hover:bg-[#13243b]/5"
                    >
                        <ArrowLeft size={16} />
                        Back to Challenge
                    </Link>

                </div>
            </nav>

            {/* MAIN */}

            <main className="mx-auto max-w-4xl px-5 py-10 md:px-8 md:py-14">

                {/* HEADER */}

                <div className="mb-8">

                    <div className="flex flex-wrap items-center gap-3">

                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#148aa0]">
                            Your Submission
                        </p>

                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#dff5f7] px-3 py-1.5 text-xs font-medium text-[#148aa0]">
                            <CheckCircle2 size={14} />
                            {solution.status}
                        </span>

                    </div>

                    <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
                        {solution.title}
                    </h1>

                    <p className="mt-3 text-sm text-[#13243b]/50">
                        Submitted{" "}
                        {solution.createdAt
                            ? new Date(
                                  solution.createdAt
                              ).toLocaleDateString(
                                  "en-IN",
                                  {
                                      day: "numeric",
                                      month: "long",
                                      year: "numeric",
                                  }
                              )
                            : ""}
                    </p>

                </div>

                {/* DESCRIPTION */}

                <section className="rounded-[28px] border border-[#13243b]/10 bg-white p-6 shadow-[0_10px_35px_rgba(19,36,59,0.05)] md:p-8">

                    <Section
                        title="Description"
                        icon={<FileText size={18} />}
                    >
                        <p className="whitespace-pre-line text-sm leading-7 text-[#13243b]/65">
                            {solution.description}
                        </p>
                    </Section>

                    <Section
                        title="Proposed Solution"
                        icon={<CheckCircle2 size={18} />}
                    >
                        <p className="whitespace-pre-line text-sm leading-7 text-[#13243b]/65">
                            {solution.proposedSolution}
                        </p>
                    </Section>

                    <Section title="Technologies">

                        {solution.technologies?.length > 0 ? (
                            <div className="flex flex-wrap gap-2">

                                {solution.technologies.map(
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
                        ) : (
                            <p className="text-sm text-[#13243b]/45">
                                No technologies specified.
                            </p>
                        )}

                    </Section>

                    <Section title="Expected Impact">

                        <p className="whitespace-pre-line text-sm leading-7 text-[#13243b]/65">
                            {solution.expectedImpact}
                        </p>

                    </Section>

                </section>

                {/* SUPPORTING MATERIAL */}

                <section className="mt-6 rounded-[28px] border border-[#13243b]/10 bg-white p-6 shadow-[0_10px_35px_rgba(19,36,59,0.05)] md:p-8">

                    <p className="mb-6 text-xs font-medium uppercase tracking-[0.18em] text-[#148aa0]">
                        Supporting Material
                    </p>

                    <div className="grid gap-3 sm:grid-cols-3">

                        {solution.proposalDocumentUrl && (
                            <a
                                href={
                                    solution.proposalDocumentUrl
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-between rounded-2xl border border-[#13243b]/10 p-4 transition hover:bg-[#faf9f6]"
                            >
                                <div className="flex items-center gap-3">

                                    <FileText
                                        size={18}
                                        className="text-[#148aa0]"
                                    />

                                    <span className="text-sm font-medium">
                                        Proposal
                                    </span>

                                </div>

                                <ExternalLink size={15} />

                            </a>
                        )}

                        {solution.demoVideoUrl && (
                            <a
                                href={
                                    solution.demoVideoUrl
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-between rounded-2xl border border-[#13243b]/10 p-4 transition hover:bg-[#faf9f6]"
                            >
                                <div className="flex items-center gap-3">

                                    <PlayCircle
                                        size={18}
                                        className="text-[#148aa0]"
                                    />

                                    <span className="text-sm font-medium">
                                        Demo Video
                                    </span>

                                </div>

                                <ExternalLink size={15} />

                            </a>
                        )}

                        {solution.githubRepoUrl && (
                            <a
                                href={
                                    solution.githubRepoUrl
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-between rounded-2xl border border-[#13243b]/10 p-4 transition hover:bg-[#faf9f6]"
                            >
                                <div className="flex items-center gap-3">

                                    <Github
                                        size={18}
                                        className="text-[#148aa0]"
                                    />

                                    <span className="text-sm font-medium">
                                        GitHub
                                    </span>

                                </div>

                                <ExternalLink size={15} />

                            </a>
                        )}

                    </div>

                </section>

                {/* STATUS */}

                <div className="mt-6 rounded-[24px] border border-[#9bd9df] bg-[#f3fbfc] p-5">

                    <div className="flex items-start gap-3">

                        <CheckCircle2
                            size={20}
                            className="mt-0.5 shrink-0 text-[#148aa0]"
                        />

                        <div>

                            <p className="text-sm font-semibold">
                                Your solution has been submitted
                            </p>

                            <p className="mt-1 text-sm leading-relaxed text-[#13243b]/55">
                                Your submission is currently{" "}
                                <span className="font-medium">
                                    {solution.status}
                                </span>
                                . Industry partners can review
                                submitted solutions and may choose
                                to sponsor promising proposals.
                            </p>

                        </div>

                    </div>

                </div>

            </main>

        </div>
    );
}


/* =========================================
   SECTION
========================================= */

function Section({
    title,
    icon,
    children,
}) {
    return (
        <div className="border-b border-[#13243b]/10 py-6 first:pt-0 last:border-b-0 last:pb-0">

            <div className="mb-3 flex items-center gap-2">

                {icon && (
                    <span className="text-[#148aa0]">
                        {icon}
                    </span>
                )}

                <h2 className="text-sm font-semibold">
                    {title}
                </h2>

            </div>

            {children}

        </div>
    );
}