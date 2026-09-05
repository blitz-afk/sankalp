import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Send,
    Loader2,
    AlertCircle,
    CheckCircle2,
} from "lucide-react";
import { signOut } from "firebase/auth";

import { auth } from "../../firebase/config";
import api from "../../services/api";

export default function SubmitSolution() {
    const { id: challengeId } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        description: "",
        proposedSolution: "",
        technologies: "",
        expectedImpact: "",
        proposalDocumentUrl: "",
        demoVideoUrl: "",
        githubRepoUrl: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (form.title.trim().length < 5) {
            setError(
                "Solution title must be at least 5 characters."
            );
            return;
        }

        if (form.description.trim().length < 20) {
            setError(
                "Description must be at least 20 characters."
            );
            return;
        }

        if (form.proposedSolution.trim().length < 50) {
            setError(
                "Proposed solution must be at least 50 characters."
            );
            return;
        }

        if (form.expectedImpact.trim().length < 10) {
            setError(
                "Expected impact must be at least 10 characters."
            );
            return;
        }

        if (!form.proposalDocumentUrl.trim()) {
            setError("Proposal document link is required.");
            return;
        }

        try {
            setLoading(true);

            const user = auth.currentUser;

            if (!user) {
                navigate("/login");
                return;
            }

            const token = await user.getIdToken();

            const technologies = form.technologies
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean);

            await api.post(
                "/solutions",
                {
                    challengeId,

                    title: form.title.trim(),

                    description:
                        form.description.trim(),

                    proposedSolution:
                        form.proposedSolution.trim(),

                    technologies,

                    expectedImpact:
                        form.expectedImpact.trim(),

                    proposalDocumentUrl:
                        form.proposalDocumentUrl.trim(),

                    demoVideoUrl:
                        form.demoVideoUrl.trim() || undefined,

                    githubRepoUrl:
                        form.githubRepoUrl.trim() || undefined,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setSuccess(true);
        } catch (error) {
            console.error(
                "Solution submission failed:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to submit solution. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-[#faf9f6] text-[#13243b]">

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

                        <button
                            type="button"
                            onClick={async () => {
                                try {
                                    await signOut(auth);
                                    window.location.href =
                                        "/login";
                                } catch (error) {
                                    console.error(
                                        "Sign out failed:",
                                        error
                                    );
                                }
                            }}
                            className="flex items-center gap-2 rounded-full border border-[#13243b]/10 px-4 py-2 text-sm font-medium hover:bg-[#13243b]/5"
                        >
                            Sign out
                        </button>

                    </div>
                </nav>

                <main className="flex min-h-[calc(100vh-64px)] items-center justify-center px-5">

                    <div className="w-full max-w-lg rounded-[28px] border border-[#13243b]/10 bg-white p-8 text-center shadow-[0_10px_35px_rgba(19,36,59,0.05)]">

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#e7f8fa] text-[#148aa0]">
                            <CheckCircle2 size={28} />
                        </div>

                        <h1 className="mt-5 text-3xl font-semibold">
                            Solution Submitted
                        </h1>

                        <p className="mt-3 text-sm leading-relaxed text-[#13243b]/55">
                            Your university's solution has
                            been successfully submitted for
                            review.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    `/university/challenges/${challengeId}`
                                )
                            }
                            className="mt-7 rounded-full bg-[#13243b] px-6 py-3 text-sm font-medium text-white hover:opacity-90"
                        >
                            Back to Challenge
                        </button>

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
                        Back
                    </Link>

                </div>
            </nav>

            {/* MAIN */}

            <main className="mx-auto max-w-3xl px-5 py-10 md:px-8 md:py-14">

                <div className="mb-8">

                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#148aa0]">
                        University Submission
                    </p>

                    <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
                        Submit your solution.
                    </h1>

                    <p className="mt-3 text-base leading-relaxed text-[#13243b]/55">
                        Present your university's proposed
                        approach to solving this civic
                        challenge.
                    </p>

                </div>

                {/* ERROR */}

                {error && (
                    <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">

                        <AlertCircle
                            size={18}
                            className="mt-0.5 shrink-0"
                        />

                        <span>{error}</span>

                    </div>
                )}

                {/* FORM */}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 rounded-[28px] border border-[#13243b]/10 bg-white p-6 shadow-[0_10px_35px_rgba(19,36,59,0.05)] md:p-8"
                >

                    <Field
                        label="Solution Title"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="e.g. Smart Pothole Detection System"
                        required
                    />

                    <TextArea
                        label="Description"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Give a brief overview of your solution..."
                        minLength={20}
                        required
                    />

                    <TextArea
                        label="Proposed Solution"
                        name="proposedSolution"
                        value={form.proposedSolution}
                        onChange={handleChange}
                        placeholder="Explain how your solution addresses the challenge..."
                        minLength={50}
                        required
                    />

                    <Field
                        label="Technologies"
                        name="technologies"
                        value={form.technologies}
                        onChange={handleChange}
                        placeholder="IoT, Python, Computer Vision, React"
                        hint="Separate technologies with commas."
                    />

                    <TextArea
                        label="Expected Impact"
                        name="expectedImpact"
                        value={form.expectedImpact}
                        onChange={handleChange}
                        placeholder="What impact do you expect this solution to create?"
                        minLength={10}
                        required
                    />

                    {/* SUPPORTING MATERIAL */}

                    <div className="border-t border-[#13243b]/10 pt-6">

                        <p className="mb-5 text-xs font-medium uppercase tracking-[0.18em] text-[#148aa0]">
                            Supporting Material
                        </p>

                        <div className="space-y-6">

                            <Field
                                label="Proposal Document URL"
                                name="proposalDocumentUrl"
                                value={form.proposalDocumentUrl}
                                onChange={handleChange}
                                placeholder="https://drive.google.com/..."
                                type="url"
                                required
                            />

                            <Field
                                label="Demo Video URL"
                                name="demoVideoUrl"
                                value={form.demoVideoUrl}
                                onChange={handleChange}
                                placeholder="https://youtube.com/..."
                                type="url"
                            />

                            <Field
                                label="GitHub Repository"
                                name="githubRepoUrl"
                                value={form.githubRepoUrl}
                                onChange={handleChange}
                                placeholder="https://github.com/..."
                                type="url"
                            />

                        </div>

                    </div>

                    {/* SUBMIT */}

                    <div className="border-t border-[#13243b]/10 pt-6">

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#13243b] px-6 py-3.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <Loader2
                                        size={18}
                                        className="animate-spin"
                                    />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Send size={17} />
                                    Submit Solution
                                </>
                            )}
                        </button>

                    </div>

                </form>

            </main>
        </div>
    );
}


/* =========================================
   FIELD
========================================= */

function Field({
    label,
    name,
    value,
    onChange,
    placeholder,
    required = false,
    hint,
    type = "text",
}) {
    return (
        <div>

            <label
                htmlFor={name}
                className="mb-2 block text-xs font-medium uppercase tracking-wider text-[#13243b]/55"
            >
                {label}
                {required && (
                    <span className="ml-1 text-[#148aa0]">
                        *
                    </span>
                )}
            </label>

            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="h-12 w-full rounded-xl border border-[#13243b]/10 bg-[#faf9f6] px-4 text-sm outline-none transition focus:border-[#148aa0]"
            />

            {hint && (
                <p className="mt-1.5 text-xs text-[#13243b]/40">
                    {hint}
                </p>
            )}

        </div>
    );
}


/* =========================================
   TEXT AREA
========================================= */

function TextArea({
    label,
    name,
    value,
    onChange,
    placeholder,
    minLength,
    required = false,
}) {
    return (
        <div>

            <label
                htmlFor={name}
                className="mb-2 block text-xs font-medium uppercase tracking-wider text-[#13243b]/55"
            >
                {label}
                {required && (
                    <span className="ml-1 text-[#148aa0]">
                        *
                    </span>
                )}
            </label>

            <textarea
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                minLength={minLength}
                required={required}
                rows={5}
                className="w-full resize-y rounded-xl border border-[#13243b]/10 bg-[#faf9f6] px-4 py-3 text-sm leading-6 outline-none transition focus:border-[#148aa0]"
            />

            {minLength && (
                <p className="mt-1.5 text-xs text-[#13243b]/40">
                    Minimum {minLength} characters.
                </p>
            )}

        </div>
    );
}