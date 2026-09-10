import { useEffect, useState } from "react";
import {
    X,
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    Loader2,
    MapPin,
    AlertCircle,
} from "lucide-react";
import { auth } from "../../firebase/config";
import api from "../../services/api";

export default function ApplyPilotModal({
    interest,
    onClose,
    onSuccess,
}) {
    const solution = interest?.solutionId;
    const challengeId = solution?.challengeId;

    const [step, setStep] = useState(1);
    const [problems, setProblems] = useState([]);
    const [selectedProblems, setSelectedProblems] = useState([]);

    const [loadingProblems, setLoadingProblems] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        title: "",
        objective: "",
        city: "",
        state: "",
        country: "India",
        locationDetails: "",
        implementationPlan: "",
        expectedDuration: "",
        successCriteria: [""],
    });

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                setLoadingProblems(true);
                setError("");

                const currentUser = auth.currentUser;

                if (!currentUser) {
                    setError(
                        "You are not authenticated. Please log in again."
                    );
                    return;
                }

                if (!challengeId) {
                    setError(
                        "Unable to determine the challenge for this solution."
                    );
                    return;
                }

                const token =
                    await currentUser.getIdToken();

                const response = await api.get(
                    `/problems/challenge/${challengeId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setProblems(
                    response.data?.problems || []
                );
            } catch (error) {
                console.error(
                    "Failed to fetch challenge problems:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load the problems for this challenge."
                );
            } finally {
                setLoadingProblems(false);
            }
        };

        fetchProblems();
    }, [challengeId]);

    const toggleProblem = (problemId) => {
        setSelectedProblems((current) =>
            current.includes(problemId)
                ? current.filter(
                      (id) => id !== problemId
                  )
                : [...current, problemId]
        );
    };

    const updateField = (field, value) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const updateCriterion = (index, value) => {
        setForm((current) => {
            const criteria = [
                ...current.successCriteria,
            ];

            criteria[index] = value;

            return {
                ...current,
                successCriteria: criteria,
            };
        });
    };

    const addCriterion = () => {
        setForm((current) => ({
            ...current,
            successCriteria: [
                ...current.successCriteria,
                "",
            ],
        }));
    };

    const removeCriterion = (index) => {
        setForm((current) => ({
            ...current,
            successCriteria:
                current.successCriteria.filter(
                    (_, i) => i !== index
                ),
        }));
    };

    const validateStep = () => {
        setError("");

        if (step === 1) {
            if (selectedProblems.length === 0) {
                setError(
                    "Select at least one civic problem for this pilot."
                );
                return false;
            }
        }

        if (step === 2) {
            if (form.title.trim().length < 5) {
                setError(
                    "Pilot title must be at least 5 characters."
                );
                return false;
            }

            if (form.objective.trim().length < 20) {
                setError(
                    "Objective must be at least 20 characters."
                );
                return false;
            }

            if (!form.city.trim()) {
                setError(
                    "Please enter the proposed pilot city."
                );
                return false;
            }
        }

        if (step === 3) {
            if (
                form.implementationPlan.trim().length < 20
            ) {
                setError(
                    "Implementation plan must be at least 20 characters."
                );
                return false;
            }

            if (form.expectedDuration.trim().length < 2) {
                setError(
                    "Please enter the expected duration."
                );
                return false;
            }
        }

        if (step === 4) {
            const criteria =
                form.successCriteria
                    .map((criterion) =>
                        criterion.trim()
                    )
                    .filter(Boolean);

            if (criteria.length === 0) {
                setError(
                    "Add at least one success criterion."
                );
                return false;
            }
        }

        return true;
    };

    const nextStep = () => {
        if (!validateStep()) return;

        setStep((current) =>
            Math.min(current + 1, 4)
        );
    };

    const previousStep = () => {
        setError("");

        setStep((current) =>
            Math.max(current - 1, 1)
        );
    };

    const handleSubmit = async () => {
        if (!validateStep()) return;

        try {
            setSubmitting(true);
            setError("");

            const currentUser = auth.currentUser;

            if (!currentUser) {
                setError(
                    "You are not authenticated. Please log in again."
                );
                return;
            }

            const token =
                await currentUser.getIdToken();

            const successCriteria =
                form.successCriteria
                    .map((criterion) =>
                        criterion.trim()
                    )
                    .filter(Boolean);

            await api.post(
                "/pilot-requests",
                {
                    industryInterestId:
                        interest._id,

                    problemIds: selectedProblems,

                    title: form.title.trim(),

                    objective:
                        form.objective.trim(),

                    proposedLocation: {
                        city: form.city.trim(),
                        state: form.state.trim(),
                        country:
                            form.country.trim(),
                        details:
                            form.locationDetails.trim(),
                    },

                    implementationPlan:
                        form.implementationPlan.trim(),

                    expectedDuration:
                        form.expectedDuration.trim(),

                    successCriteria,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            onSuccess?.();
        } catch (error) {
            console.error(
                "Failed to submit pilot request:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to submit pilot request."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#13243b]/40 p-4 backdrop-blur-sm">
            <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-[28px] border border-[#13243b]/10 bg-[#faf9f6] shadow-2xl">

                {/* HEADER */}

                <div className="flex items-start justify-between border-b border-[#13243b]/10 bg-white px-6 py-5 md:px-8">

                    <div>
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#148aa0]">
                            Pilot Application
                        </p>

                        <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                            Let's turn this solution into a pilot.
                        </h2>

                        <p className="mt-1 text-sm text-[#13243b]/55">
                            Step {step} of 4
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-2 text-[#13243b]/50 transition hover:bg-[#13243b]/5 hover:text-[#13243b]"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* PROGRESS */}

                <div className="h-1 bg-[#13243b]/5">
                    <div
                        className="h-full bg-[#148aa0] transition-all duration-300"
                        style={{
                            width: `${step * 25}%`,
                        }}
                    />
                </div>

                {/* CONTENT */}

                <div className="overflow-y-auto px-6 py-7 md:px-8">

                    {error && (
                        <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            <AlertCircle
                                size={18}
                                className="mt-0.5 shrink-0"
                            />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* STEP 1 */}

                    {step === 1 && (
                        <section>
                            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#148aa0]">
                                Step 01
                            </p>

                            <h3 className="mt-2 text-2xl font-semibold">
                                What problems should this pilot address?
                            </h3>

                            <p className="mt-2 text-sm leading-relaxed text-[#13243b]/55">
                                Select the civic reports that this
                                solution will directly address.
                            </p>

                            {loadingProblems ? (
                                <div className="flex min-h-[220px] items-center justify-center">
                                    <div className="flex items-center gap-3 text-sm text-[#13243b]/55">
                                        <Loader2
                                            size={19}
                                            className="animate-spin"
                                        />
                                        Loading civic problems...
                                    </div>
                                </div>
                            ) : problems.length === 0 ? (
                                <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-700">
                                    No valid problems were found
                                    for this challenge.
                                </div>
                            ) : (
                                <div className="mt-6 space-y-3">
                                    {problems.map(
                                        (problem) => {
                                            const selected =
                                                selectedProblems.includes(
                                                    problem._id
                                                );

                                            return (
                                                <button
                                                    key={
                                                        problem._id
                                                    }
                                                    type="button"
                                                    onClick={() =>
                                                        toggleProblem(
                                                            problem._id
                                                        )
                                                    }
                                                    className={`w-full rounded-2xl border p-4 text-left transition ${
                                                        selected
                                                            ? "border-[#148aa0] bg-[#e7f8fa]"
                                                            : "border-[#13243b]/10 bg-white hover:border-[#13243b]/20"
                                                    }`}
                                                >
                                                    <div className="flex items-start gap-3">

                                                        <div
                                                            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                                                                selected
                                                                    ? "border-[#148aa0] bg-[#148aa0] text-white"
                                                                    : "border-[#13243b]/20"
                                                            }`}
                                                        >
                                                            {selected && (
                                                                <CheckCircle2
                                                                    size={
                                                                        15
                                                                    }
                                                                />
                                                            )}
                                                        </div>

                                                        <div className="min-w-0">
                                                            <p className="font-medium break-words">
                                                                {
                                                                    problem.title
                                                                }
                                                            </p>

                                                            <p className="mt-1 text-sm leading-relaxed text-[#13243b]/55">
                                                                {
                                                                    problem.description
                                                                }
                                                            </p>

                                                            {problem.location?.city && (
                                                                <div className="mt-3 flex items-center gap-1.5 text-xs text-[#13243b]/45">
                                                                    <MapPin
                                                                        size={
                                                                            13
                                                                        }
                                                                    />
                                                                    {
                                                                        problem
                                                                            .location
                                                                            .city
                                                                    }
                                                                    {problem
                                                                        .location
                                                                        .state &&
                                                                        `, ${problem.location.state}`}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        }
                                    )}
                                </div>
                            )}
                        </section>
                    )}

                    {/* STEP 2 */}

                    {step === 2 && (
                        <section>
                            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#148aa0]">
                                Step 02
                            </p>

                            <h3 className="mt-2 text-2xl font-semibold">
                                Define the pilot.
                            </h3>

                            <p className="mt-2 text-sm text-[#13243b]/55">
                                Tell the government team what you're
                                proposing and where it will happen.
                            </p>

                            <div className="mt-6 space-y-5">

                                <Field
                                    label="Pilot title"
                                    value={form.title}
                                    onChange={(value) =>
                                        updateField(
                                            "title",
                                            value
                                        )
                                    }
                                    placeholder="e.g. Smart Waste Monitoring Pilot"
                                />

                                <TextArea
                                    label="Objective"
                                    value={form.objective}
                                    onChange={(value) =>
                                        updateField(
                                            "objective",
                                            value
                                        )
                                    }
                                    placeholder="What should this pilot achieve?"
                                    rows={4}
                                />

                                <div className="grid gap-4 md:grid-cols-2">
                                    <Field
                                        label="City"
                                        value={form.city}
                                        onChange={(value) =>
                                            updateField(
                                                "city",
                                                value
                                            )
                                        }
                                        placeholder="Pune"
                                    />

                                    <Field
                                        label="State"
                                        value={form.state}
                                        onChange={(value) =>
                                            updateField(
                                                "state",
                                                value
                                            )
                                        }
                                        placeholder="Maharashtra"
                                    />
                                </div>

                                <Field
                                    label="Country"
                                    value={form.country}
                                    onChange={(value) =>
                                        updateField(
                                            "country",
                                            value
                                        )
                                    }
                                    placeholder="India"
                                />

                                <TextArea
                                    label="Location details"
                                    value={
                                        form.locationDetails
                                    }
                                    onChange={(value) =>
                                        updateField(
                                            "locationDetails",
                                            value
                                        )
                                    }
                                    placeholder="Specific area, ward, road, campus, etc."
                                    rows={3}
                                />

                            </div>
                        </section>
                    )}

                    {/* STEP 3 */}

                    {step === 3 && (
                        <section>
                            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#148aa0]">
                                Step 03
                            </p>

                            <h3 className="mt-2 text-2xl font-semibold">
                                How will the pilot work?
                            </h3>

                            <p className="mt-2 text-sm text-[#13243b]/55">
                                Give the government team a practical
                                implementation plan.
                            </p>

                            <div className="mt-6 space-y-5">

                                <TextArea
                                    label="Implementation plan"
                                    value={
                                        form.implementationPlan
                                    }
                                    onChange={(value) =>
                                        updateField(
                                            "implementationPlan",
                                            value
                                        )
                                    }
                                    placeholder="Explain the steps, resources, deployment process and responsibilities..."
                                    rows={8}
                                />

                                <Field
                                    label="Expected duration"
                                    value={
                                        form.expectedDuration
                                    }
                                    onChange={(value) =>
                                        updateField(
                                            "expectedDuration",
                                            value
                                        )
                                    }
                                    placeholder="e.g. 3 months"
                                />

                            </div>
                        </section>
                    )}

                    {/* STEP 4 */}

                    {step === 4 && (
                        <section>
                            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#148aa0]">
                                Step 04
                            </p>

                            <h3 className="mt-2 text-2xl font-semibold">
                                How will we know it worked?
                            </h3>

                            <p className="mt-2 text-sm text-[#13243b]/55">
                                Define measurable outcomes for the pilot.
                            </p>

                            <div className="mt-6 space-y-3">

                                {form.successCriteria.map(
                                    (criterion, index) => (
                                        <div
                                            key={index}
                                            className="flex gap-2"
                                        >
                                            <input
                                                type="text"
                                                value={criterion}
                                                onChange={(event) =>
                                                    updateCriterion(
                                                        index,
                                                        event.target
                                                            .value
                                                    )
                                                }
                                                placeholder={`Success criterion ${index + 1}`}
                                                className="min-w-0 flex-1 rounded-xl border border-[#13243b]/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#148aa0]"
                                            />

                                            {form.successCriteria
                                                .length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeCriterion(
                                                            index
                                                        )
                                                    }
                                                    className="rounded-xl border border-red-200 px-3 text-red-500 transition hover:bg-red-50"
                                                >
                                                    <X size={16} />
                                                </button>
                                            )}
                                        </div>
                                    )
                                )}

                                <button
                                    type="button"
                                    onClick={addCriterion}
                                    className="rounded-full border border-[#13243b]/10 px-4 py-2 text-sm font-medium transition hover:bg-white"
                                >
                                    + Add criterion
                                </button>

                            </div>

                            {/* REVIEW */}

                            <div className="mt-8 rounded-2xl border border-[#13243b]/10 bg-white p-5">
                                <p className="text-xs font-medium uppercase tracking-wider text-[#13243b]/40">
                                    Pilot summary
                                </p>

                                <div className="mt-4 space-y-3 text-sm">

                                    <SummaryRow
                                        label="Problems"
                                        value={`${selectedProblems.length} selected`}
                                    />

                                    <SummaryRow
                                        label="Pilot"
                                        value={form.title}
                                    />

                                    <SummaryRow
                                        label="Location"
                                        value={[
                                            form.city,
                                            form.state,
                                        ]
                                            .filter(Boolean)
                                            .join(", ")}
                                    />

                                    <SummaryRow
                                        label="Duration"
                                        value={
                                            form.expectedDuration
                                        }
                                    />

                                </div>
                            </div>
                        </section>
                    )}

                </div>

                {/* FOOTER */}

                <div className="flex items-center justify-between border-t border-[#13243b]/10 bg-white px-6 py-4 md:px-8">

                    <button
                        type="button"
                        onClick={
                            step === 1
                                ? onClose
                                : previousStep
                        }
                        className="flex items-center gap-2 rounded-full border border-[#13243b]/10 px-4 py-2.5 text-sm font-medium transition hover:bg-[#13243b]/5"
                    >
                        {step === 1 ? (
                            "Cancel"
                        ) : (
                            <>
                                <ArrowLeft size={15} />
                                Back
                            </>
                        )}
                    </button>

                    {step < 4 ? (
                        <button
                            type="button"
                            onClick={nextStep}
                            disabled={
                                loadingProblems ||
                                problems.length === 0
                            }
                            className="flex items-center gap-2 rounded-full bg-[#13243b] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Continue
                            <ArrowRight size={15} />
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="flex items-center gap-2 rounded-full bg-[#148aa0] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {submitting ? (
                                <>
                                    <Loader2
                                        size={16}
                                        className="animate-spin"
                                    />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 size={16} />
                                    Submit Pilot Request
                                </>
                            )}
                        </button>
                    )}

                </div>
            </div>
        </div>
    );
}

/* =========================================
   FIELD
========================================= */

function Field({
    label,
    value,
    onChange,
    placeholder,
}) {
    return (
        <label className="block">
            <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-[#13243b]/45">
                {label}
            </span>

            <input
                type="text"
                value={value}
                onChange={(event) =>
                    onChange(event.target.value)
                }
                placeholder={placeholder}
                className="w-full rounded-xl border border-[#13243b]/10 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-[#13243b]/30 focus:border-[#148aa0]"
            />
        </label>
    );
}

/* =========================================
   TEXT AREA
========================================= */

function TextArea({
    label,
    value,
    onChange,
    placeholder,
    rows = 4,
}) {
    return (
        <label className="block">
            <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-[#13243b]/45">
                {label}
            </span>

            <textarea
                value={value}
                onChange={(event) =>
                    onChange(event.target.value)
                }
                placeholder={placeholder}
                rows={rows}
                className="w-full resize-none rounded-xl border border-[#13243b]/10 bg-white px-4 py-3 text-sm leading-relaxed outline-none transition placeholder:text-[#13243b]/30 focus:border-[#148aa0]"
            />
        </label>
    );
}

/* =========================================
   SUMMARY ROW
========================================= */

function SummaryRow({ label, value }) {
    return (
        <div className="flex gap-4 border-b border-[#13243b]/5 pb-3 last:border-0 last:pb-0">
            <span className="w-24 shrink-0 text-[#13243b]/40">
                {label}
            </span>

            <span className="break-words font-medium">
                {value || "—"}
            </span>
        </div>
    );
}