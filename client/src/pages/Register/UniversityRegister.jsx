import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    ArrowRight,
    Eye,
    EyeOff,
    Mail,
    Lock,
    Check,
    Building2,
    Globe,
    MapPin,
    Plus,
    X,
} from "lucide-react";

import { registerWithFirebase } from "../../services/authService";
import api from "../../services/api";

export default function UniversityRegister() {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        email: "",
        password: "",
        confirmPassword: "",

        name: "",
        description: "",
        website: "",

        city: "",
        state: "",
        country: "India",

        domains: [""],

        terms: false,
    });

    const updateField = (field, value) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const updateDomain = (index, value) => {
        setForm((prev) => {
            const domains = [...prev.domains];
            domains[index] = value;

            return {
                ...prev,
                domains,
            };
        });
    };

    const addDomain = () => {
        setForm((prev) => ({
            ...prev,
            domains: [...prev.domains, ""],
        }));
    };

    const removeDomain = (index) => {
        setForm((prev) => {
            const domains = prev.domains.filter(
                (_, i) => i !== index
            );

            return {
                ...prev,
                domains: domains.length > 0 ? domains : [""],
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (!form.name.trim()) {
            setError("University name is required.");
            return;
        }

        if (form.name.trim().length < 2) {
            setError(
                "University name must be at least 2 characters."
            );
            return;
        }

        if (!form.description.trim()) {
            setError("University description is required.");
            return;
        }

        if (form.description.trim().length < 10) {
            setError(
                "University description must be at least 10 characters."
            );
            return;
        }

        const cleanedDomains = form.domains
            .map((domain) => domain.trim())
            .filter(Boolean);

        if (cleanedDomains.length === 0) {
            setError(
                "Please add at least one university domain."
            );
            return;
        }

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (!form.terms) {
            setError(
                "Please accept the terms and conditions."
            );
            return;
        }

        try {
            setLoading(true);

            // ============================================
            // 1. CREATE FIREBASE ACCOUNT
            // ============================================

            const firebaseUser = await registerWithFirebase(
                form.email,
                form.password
            );

            // ============================================
            // 2. GET FIREBASE ID TOKEN
            // ============================================

            const token = await firebaseUser.getIdToken();

            // ============================================
            // 3. CREATE UNIVERSITY PROFILE
            // ============================================

            await api.post(
                "/university/register",
                {
                    name: form.name.trim(),

                    description: form.description.trim(),

                    domains: cleanedDomains,

                    location: {
                        city: form.city.trim(),
                        state: form.state.trim(),
                        country:
                            form.country.trim() || "India",
                    },

                    website: form.website.trim(),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // ============================================
            // 4. REGISTRATION COMPLETE
            // ============================================

            navigate("/login");

        } catch (error) {
            console.error(
                "University registration error:",
                error
            );

            if (
                error.code ===
                "auth/email-already-in-use"
            ) {
                setError(
                    "An account with this email already exists."
                );
            } else if (
                error.code === "auth/invalid-email"
            ) {
                setError(
                    "Please enter a valid email address."
                );
            } else if (
                error.code === "auth/weak-password"
            ) {
                setError(
                    "Password must be at least 6 characters."
                );
            } else {
                setError(
                    error.response?.data?.message ||
                    "Registration failed. Please try again."
                );
            }
        } finally {
            setLoading(false);
        }
    };

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
                        to="/register"
                        className="flex items-center gap-2 rounded-sm px-4 py-2 text-sm font-medium transition-colors hover:bg-[#171914]/5"
                    >
                        <ArrowLeft size={15} />
                        Change role
                    </Link>

                </div>

            </nav>

            {/* MAIN */}

            <main className="relative overflow-hidden py-16 md:py-24">

                {/* BLUEPRINT GRID */}

                <div
                    className="pointer-events-none absolute inset-0 opacity-40"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(23,25,20,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(23,25,20,.045) 1px, transparent 1px)",
                        backgroundSize: "32px 32px",
                    }}
                />

                <div className="relative mx-auto max-w-6xl px-6">

                    {/* HEADING */}

                    <div className="mx-auto mb-12 max-w-2xl text-center">

                        <span className="mb-5 inline-block border border-[#2563eb]/20 bg-[#2563eb]/10 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-[#2563eb]">
                            University Registration
                        </span>

                        <h1 className="text-5xl font-bold leading-[0.95] tracking-[-0.04em] md:text-6xl">
                            Create your{" "}
                            <span className="italic text-[#2563eb]">
                                university
                            </span>{" "}
                            account.
                        </h1>

                        <p className="mt-5 text-lg leading-relaxed text-[#171914]/55">
                            Join Sankalp and help turn civic
                            problems into real-world solutions.
                        </p>

                    </div>

                    {/* FORM */}

                    <div className="mx-auto max-w-xl border border-[#171914]/10 bg-[#efefeb] p-6 shadow-sm sm:p-10">

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-7"
                        >

                            {/* =========================================
                                UNIVERSITY INFORMATION
                            ========================================= */}

                            <div className="border-b border-[#171914]/10 pb-6">

                                <div className="mb-5 flex items-center gap-2">

                                    <Building2
                                        size={18}
                                        className="text-[#2563eb]"
                                    />

                                    <h2 className="font-mono text-xs font-semibold uppercase tracking-wider">
                                        University Information
                                    </h2>

                                </div>

                                {/* NAME */}

                                <div>

                                    <label className="mb-2 block font-mono text-xs uppercase tracking-wider text-[#171914]/55">
                                        University Name
                                    </label>

                                    <input
                                        type="text"
                                        required
                                        value={form.name}
                                        onChange={(e) =>
                                            updateField(
                                                "name",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Your University Name"
                                        className="h-12 w-full border border-[#171914]/15 bg-[#f8f8f5] px-4 text-sm outline-none transition-colors placeholder:text-[#171914]/30 focus:border-[#2563eb]"
                                    />

                                </div>

                                {/* DESCRIPTION */}

                                <div className="mt-5">

                                    <label className="mb-2 block font-mono text-xs uppercase tracking-wider text-[#171914]/55">
                                        Description
                                    </label>

                                    <textarea
                                        required
                                        rows={4}
                                        value={form.description}
                                        onChange={(e) =>
                                            updateField(
                                                "description",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Tell us about your university..."
                                        className="w-full resize-none border border-[#171914]/15 bg-[#f8f8f5] px-4 py-3 text-sm outline-none transition-colors placeholder:text-[#171914]/30 focus:border-[#2563eb]"
                                    />

                                </div>

                                {/* DOMAINS */}

                                <div className="mt-5">

                                    <label className="mb-2 block font-mono text-xs uppercase tracking-wider text-[#171914]/55">
                                        Domains
                                    </label>

                                    <div className="space-y-2">

                                        {form.domains.map(
                                            (domain, index) => (
                                                <div
                                                    key={index}
                                                    className="flex gap-2"
                                                >

                                                    <input
                                                        type="text"
                                                        value={domain}
                                                        onChange={(e) =>
                                                            updateDomain(
                                                                index,
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="e.g. Computer Science"
                                                        className="h-11 flex-1 border border-[#171914]/15 bg-[#f8f8f5] px-4 text-sm outline-none transition-colors placeholder:text-[#171914]/30 focus:border-[#2563eb]"
                                                    />

                                                    {form.domains.length >
                                                        1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeDomain(
                                                                    index
                                                                )
                                                            }
                                                            className="flex h-11 w-11 items-center justify-center border border-[#171914]/10 text-[#171914]/45 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    )}

                                                </div>
                                            )
                                        )}

                                    </div>

                                    <button
                                        type="button"
                                        onClick={addDomain}
                                        className="mt-3 flex items-center gap-2 text-xs font-semibold text-[#2563eb] hover:underline"
                                    >
                                        <Plus size={14} />
                                        Add another domain
                                    </button>

                                </div>

                            </div>

                            {/* =========================================
                                LOCATION
                            ========================================= */}

                            <div className="border-b border-[#171914]/10 pb-6">

                                <div className="mb-5 flex items-center gap-2">

                                    <MapPin
                                        size={18}
                                        className="text-[#2563eb]"
                                    />

                                    <h2 className="font-mono text-xs font-semibold uppercase tracking-wider">
                                        Location
                                    </h2>

                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">

                                    <div>

                                        <label className="mb-2 block font-mono text-xs uppercase tracking-wider text-[#171914]/55">
                                            City
                                        </label>

                                        <input
                                            type="text"
                                            value={form.city}
                                            onChange={(e) =>
                                                updateField(
                                                    "city",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Pune"
                                            className="h-12 w-full border border-[#171914]/15 bg-[#f8f8f5] px-4 text-sm outline-none transition-colors placeholder:text-[#171914]/30 focus:border-[#2563eb]"
                                        />

                                    </div>

                                    <div>

                                        <label className="mb-2 block font-mono text-xs uppercase tracking-wider text-[#171914]/55">
                                            State
                                        </label>

                                        <input
                                            type="text"
                                            value={form.state}
                                            onChange={(e) =>
                                                updateField(
                                                    "state",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Maharashtra"
                                            className="h-12 w-full border border-[#171914]/15 bg-[#f8f8f5] px-4 text-sm outline-none transition-colors placeholder:text-[#171914]/30 focus:border-[#2563eb]"
                                        />

                                    </div>

                                </div>

                                <div className="mt-4">

                                    <label className="mb-2 block font-mono text-xs uppercase tracking-wider text-[#171914]/55">
                                        Country
                                    </label>

                                    <input
                                        type="text"
                                        value={form.country}
                                        onChange={(e) =>
                                            updateField(
                                                "country",
                                                e.target.value
                                            )
                                        }
                                        placeholder="India"
                                        className="h-12 w-full border border-[#171914]/15 bg-[#f8f8f5] px-4 text-sm outline-none transition-colors placeholder:text-[#171914]/30 focus:border-[#2563eb]"
                                    />

                                </div>

                            </div>

                            {/* =========================================
                                WEBSITE
                            ========================================= */}

                            <div>

                                <div className="mb-5 flex items-center gap-2">

                                    <Globe
                                        size={18}
                                        className="text-[#2563eb]"
                                    />

                                    <h2 className="font-mono text-xs font-semibold uppercase tracking-wider">
                                        Online Presence
                                    </h2>

                                </div>

                                <label className="mb-2 block font-mono text-xs uppercase tracking-wider text-[#171914]/55">
                                    Website
                                </label>

                                <input
                                    type="url"
                                    value={form.website}
                                    onChange={(e) =>
                                        updateField(
                                            "website",
                                            e.target.value
                                        )
                                    }
                                    placeholder="https://youruniversity.edu"
                                    className="h-12 w-full border border-[#171914]/15 bg-[#f8f8f5] px-4 text-sm outline-none transition-colors placeholder:text-[#171914]/30 focus:border-[#2563eb]"
                                />

                            </div>

                            {/* =========================================
                                ACCOUNT
                            ========================================= */}

                            <div className="border-t border-[#171914]/10 pt-6">

                                <div className="mb-5 flex items-center gap-2">

                                    <Lock
                                        size={18}
                                        className="text-[#2563eb]"
                                    />

                                    <h2 className="font-mono text-xs font-semibold uppercase tracking-wider">
                                        Account Security
                                    </h2>

                                </div>

                                {/* EMAIL */}

                                <div>

                                    <label className="mb-2 block font-mono text-xs uppercase tracking-wider text-[#171914]/55">
                                        Email Address
                                    </label>

                                    <div className="relative">

                                        <Mail
                                            size={18}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#171914]/35"
                                        />

                                        <input
                                            type="email"
                                            required
                                            autoComplete="email"
                                            value={form.email}
                                            onChange={(e) =>
                                                updateField(
                                                    "email",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="admin@university.edu"
                                            className="h-12 w-full border border-[#171914]/15 bg-[#f8f8f5] pl-11 pr-4 text-sm outline-none transition-colors placeholder:text-[#171914]/30 focus:border-[#2563eb]"
                                        />

                                    </div>

                                </div>

                                {/* PASSWORD */}

                                <div className="mt-5">

                                    <label className="mb-2 block font-mono text-xs uppercase tracking-wider text-[#171914]/55">
                                        Password
                                    </label>

                                    <div className="relative">

                                        <Lock
                                            size={18}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#171914]/35"
                                        />

                                        <input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            required
                                            minLength={6}
                                            autoComplete="new-password"
                                            value={form.password}
                                            onChange={(e) =>
                                                updateField(
                                                    "password",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Create a password"
                                            className="h-12 w-full border border-[#171914]/15 bg-[#f8f8f5] pl-11 pr-12 text-sm outline-none transition-colors placeholder:text-[#171914]/30 focus:border-[#2563eb]"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(
                                                    (value) =>
                                                        !value
                                                )
                                            }
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#171914]/35 hover:text-[#171914]"
                                        >
                                            {showPassword ? (
                                                <EyeOff size={18} />
                                            ) : (
                                                <Eye size={18} />
                                            )}
                                        </button>

                                    </div>

                                    <p className="mt-2 text-xs text-[#171914]/40">
                                        Minimum 6 characters.
                                    </p>

                                </div>

                                {/* CONFIRM PASSWORD */}

                                <div className="mt-5">

                                    <label className="mb-2 block font-mono text-xs uppercase tracking-wider text-[#171914]/55">
                                        Confirm Password
                                    </label>

                                    <div className="relative">

                                        <Lock
                                            size={18}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#171914]/35"
                                        />

                                        <input
                                            type={
                                                showConfirmPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            required
                                            autoComplete="new-password"
                                            value={
                                                form.confirmPassword
                                            }
                                            onChange={(e) =>
                                                updateField(
                                                    "confirmPassword",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Confirm your password"
                                            className="h-12 w-full border border-[#171914]/15 bg-[#f8f8f5] pl-11 pr-12 text-sm outline-none transition-colors placeholder:text-[#171914]/30 focus:border-[#2563eb]"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    (value) =>
                                                        !value
                                                )
                                            }
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#171914]/35 hover:text-[#171914]"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff size={18} />
                                            ) : (
                                                <Eye size={18} />
                                            )}
                                        </button>

                                    </div>

                                </div>

                            </div>

                            {/* TERMS */}

                            <label className="flex cursor-pointer items-start gap-3 border-t border-[#171914]/10 pt-6">

                                <input
                                    type="checkbox"
                                    checked={form.terms}
                                    onChange={(e) =>
                                        updateField(
                                            "terms",
                                            e.target.checked
                                        )
                                    }
                                    className="mt-0.5 h-4 w-4 accent-[#2563eb]"
                                />

                                <span className="text-sm leading-relaxed text-[#171914]/55">
                                    I agree to Sankalp's terms of
                                    use and understand that submitted
                                    civic reports may be reviewed
                                    for improving public services.
                                </span>

                            </label>

                            {/* ERROR */}

                            {error && (
                                <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                                    {error}
                                </div>
                            )}

                            {/* SUBMIT */}

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full items-center justify-center gap-2 bg-[#171914] px-6 py-4 text-sm font-semibold text-white transition-all hover:bg-[#2563eb] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {loading
                                    ? "Creating account..."
                                    : "Create University Account"}

                                {!loading && (
                                    <ArrowRight size={17} />
                                )}
                            </button>

                            {/* LOGIN */}

                            <p className="text-center text-sm text-[#171914]/45">

                                Already have an account?{" "}

                                <Link
                                    to="/login"
                                    className="font-semibold text-[#2563eb] hover:underline"
                                >
                                    Login
                                </Link>

                            </p>

                        </form>

                    </div>

                    {/* SECURITY */}

                    <div className="mx-auto mt-8 flex max-w-xl items-center justify-center gap-2 text-center font-mono text-[10px] uppercase tracking-wider text-[#171914]/35">

                        <Check
                            size={13}
                            className="text-[#2563eb]"
                        />

                        Secure authentication powered by Firebase

                    </div>

                </div>

            </main>

        </div>
    );
}