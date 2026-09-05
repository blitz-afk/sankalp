import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    ArrowRight,
    Eye,
    EyeOff,
    Building2,
    Globe,
    MapPin,
    User,
    Phone,
    Briefcase,
    Plus,
    X,
    Lock,
    Mail,
    Check,
} from "lucide-react";

import { registerWithFirebase } from "../../services/authService";
import api from "../../services/api";

export default function IndustryRegister() {
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

        domains: [""],
        capabilities: [""],
        resources: [""],

        organizationType: "",

        contactName: "",
        contactDesignation: "",
        contactEmail: "",
        contactPhone: "",

        city: "",
        state: "",
        country: "India",

        website: "",

        terms: false,
    });


    const updateField = (field, value) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };


    const updateArrayField = (
        field,
        index,
        value
    ) => {
        setForm((prev) => {
            const values = [...prev[field]];

            values[index] = value;

            return {
                ...prev,
                [field]: values,
            };
        });
    };


    const addArrayField = (field) => {
        setForm((prev) => ({
            ...prev,
            [field]: [
                ...prev[field],
                "",
            ],
        }));
    };


    const removeArrayField = (
        field,
        index
    ) => {
        setForm((prev) => {
            const values = prev[field].filter(
                (_, i) => i !== index
            );

            return {
                ...prev,
                [field]:
                    values.length > 0
                        ? values
                        : [""],
            };
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        /* ================================
           BASIC VALIDATION
        ================================= */

        if (!form.name.trim()) {
            setError(
                "Organization name is required."
            );
            return;
        }

        if (
            form.name.trim().length < 2
        ) {
            setError(
                "Organization name must be at least 2 characters."
            );
            return;
        }

        if (
            !form.description.trim() ||
            form.description.trim().length < 10
        ) {
            setError(
                "Organization description must be at least 10 characters."
            );
            return;
        }


        const cleanedDomains =
            form.domains
                .map((value) =>
                    value.trim()
                )
                .filter(Boolean);

        if (
            cleanedDomains.length === 0
        ) {
            setError(
                "Please add at least one domain."
            );
            return;
        }


        if (!form.organizationType) {
            setError(
                "Please select an organization type."
            );
            return;
        }


        if (
            !form.contactName.trim()
        ) {
            setError(
                "Contact person name is required."
            );
            return;
        }


        if (
            form.password !==
            form.confirmPassword
        ) {
            setError(
                "Passwords do not match."
            );
            return;
        }


        if (!form.terms) {
            setError(
                "Please accept the terms and conditions."
            );
            return;
        }


        const cleanedCapabilities =
            form.capabilities
                .map((value) =>
                    value.trim()
                )
                .filter(Boolean);


        const cleanedResources =
            form.resources
                .map((value) =>
                    value.trim()
                )
                .filter(Boolean);


        try {
            setLoading(true);


            /* ================================
               1. CREATE FIREBASE ACCOUNT
            ================================= */

            const firebaseUser =
                await registerWithFirebase(
                    form.email,
                    form.password
                );


            /* ================================
               2. GET FIREBASE TOKEN
            ================================= */

            const token =
                await firebaseUser.getIdToken();


            /* ================================
               3. CREATE INDUSTRY PROFILE
            ================================= */

            await api.post(
                "/industry/register",
                {
                    name:
                        form.name.trim(),

                    description:
                        form.description.trim(),

                    domains:
                        cleanedDomains,

                    capabilities:
                        cleanedCapabilities,

                    resources:
                        cleanedResources,

                    organizationType:
                        form.organizationType,

                    contactPerson: {
                        name:
                            form.contactName.trim(),

                        designation:
                            form.contactDesignation.trim(),

                        email:
                            form.contactEmail.trim() ||
                            form.email.trim(),

                        phone:
                            form.contactPhone.trim(),
                    },

                    location: {
                        city:
                            form.city.trim(),

                        state:
                            form.state.trim(),

                        country:
                            form.country.trim() ||
                            "India",
                    },

                    website:
                        form.website.trim(),
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );


            /* ================================
               4. COMPLETE
            ================================= */

            navigate("/login");

        } catch (error) {

            console.error(
                "Industry registration error:",
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
                error.code ===
                "auth/invalid-email"
            ) {
                setError(
                    "Please enter a valid email address."
                );
            } else if (
                error.code ===
                "auth/weak-password"
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

                {/* GRID */}

                <div
                    className="pointer-events-none absolute inset-0 opacity-40"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(23,25,20,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(23,25,20,.045) 1px, transparent 1px)",
                        backgroundSize:
                            "32px 32px",
                    }}
                />


                <div className="relative mx-auto max-w-6xl px-6">

                    {/* HEADING */}

                    <div className="mx-auto mb-12 max-w-2xl text-center">

                        <span className="mb-5 inline-block border border-[#2563eb]/20 bg-[#2563eb]/10 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-[#2563eb]">
                            Industry Registration
                        </span>

                        <h1 className="text-5xl font-bold leading-[0.95] tracking-[-0.04em] md:text-6xl">

                            Create your{" "}

                            <span className="italic text-[#2563eb]">
                                organization
                            </span>{" "}
                            account.

                        </h1>

                        <p className="mt-5 text-lg leading-relaxed text-[#171914]/55">
                            Partner with universities and help
                            turn civic solutions into real-world
                            impact.
                        </p>

                    </div>


                    {/* FORM */}

                    <div className="mx-auto max-w-xl border border-[#171914]/10 bg-[#efefeb] p-6 shadow-sm sm:p-10">

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-7"
                        >

                            {/* =========================================
                                ORGANIZATION
                            ========================================= */}

                            <div className="border-b border-[#171914]/10 pb-6">

                                <div className="mb-5 flex items-center gap-2">

                                    <Building2
                                        size={18}
                                        className="text-[#2563eb]"
                                    />

                                    <h2 className="font-mono text-xs font-semibold uppercase tracking-wider">
                                        Organization Information
                                    </h2>

                                </div>


                                <label className="mb-2 block font-mono text-xs uppercase tracking-wider text-[#171914]/55">
                                    Organization Name
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
                                    placeholder="Your organization name"
                                    className="h-12 w-full border border-[#171914]/15 bg-[#f8f8f5] px-4 text-sm outline-none transition-colors placeholder:text-[#171914]/30 focus:border-[#2563eb]"
                                />


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
                                        placeholder="Tell us about your organization..."
                                        className="w-full resize-none border border-[#171914]/15 bg-[#f8f8f5] px-4 py-3 text-sm outline-none transition-colors placeholder:text-[#171914]/30 focus:border-[#2563eb]"
                                    />

                                </div>


                                {/* ORGANIZATION TYPE */}

                                <div className="mt-5">

                                    <label className="mb-2 block font-mono text-xs uppercase tracking-wider text-[#171914]/55">
                                        Organization Type
                                    </label>

                                    <select
                                        required
                                        value={
                                            form.organizationType
                                        }
                                        onChange={(e) =>
                                            updateField(
                                                "organizationType",
                                                e.target.value
                                            )
                                        }
                                        className="h-12 w-full border border-[#171914]/15 bg-[#f8f8f5] px-4 text-sm outline-none focus:border-[#2563eb]"
                                    >

                                        <option value="">
                                            Select organization type
                                        </option>

                                        <option value="Industry">
                                            Industry
                                        </option>

                                        <option value="Startup">
                                            Startup
                                        </option>

                                        <option value="MSME">
                                            MSME
                                        </option>

                                        <option value="CSR Organization">
                                            CSR Organization
                                        </option>

                                        <option value="Research Organization">
                                            Research Organization
                                        </option>

                                    </select>

                                </div>

                            </div>


                            {/* =========================================
                                DOMAINS
                            ========================================= */}

                            <ArraySection
                                title="Domains"
                                icon={<Briefcase size={18} />}
                                values={form.domains}
                                field="domains"
                                placeholder="e.g. IoT, AI, Infrastructure"
                                updateArrayField={
                                    updateArrayField
                                }
                                addArrayField={
                                    addArrayField
                                }
                                removeArrayField={
                                    removeArrayField
                                }
                                required
                            />


                            {/* =========================================
                                CAPABILITIES
                            ========================================= */}

                            <ArraySection
                                title="Capabilities"
                                icon={<Briefcase size={18} />}
                                values={form.capabilities}
                                field="capabilities"
                                placeholder="e.g. Engineering, deployment, testing"
                                updateArrayField={
                                    updateArrayField
                                }
                                addArrayField={
                                    addArrayField
                                }
                                removeArrayField={
                                    removeArrayField
                                }
                            />


                            {/* =========================================
                                RESOURCES
                            ========================================= */}

                            <ArraySection
                                title="Resources"
                                icon={<Briefcase size={18} />}
                                values={form.resources}
                                field="resources"
                                placeholder="e.g. Funding, hardware, workspace"
                                updateArrayField={
                                    updateArrayField
                                }
                                addArrayField={
                                    addArrayField
                                }
                                removeArrayField={
                                    removeArrayField
                                }
                            />


                            {/* =========================================
                                CONTACT
                            ========================================= */}

                            <div className="border-b border-[#171914]/10 pb-6">

                                <div className="mb-5 flex items-center gap-2">

                                    <User
                                        size={18}
                                        className="text-[#2563eb]"
                                    />

                                    <h2 className="font-mono text-xs font-semibold uppercase tracking-wider">
                                        Contact Person
                                    </h2>

                                </div>


                                <Input
                                    label="Name"
                                    value={
                                        form.contactName
                                    }
                                    onChange={(e) =>
                                        updateField(
                                            "contactName",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Contact person name"
                                    required
                                />


                                <Input
                                    label="Designation"
                                    value={
                                        form.contactDesignation
                                    }
                                    onChange={(e) =>
                                        updateField(
                                            "contactDesignation",
                                            e.target.value
                                        )
                                    }
                                    placeholder="e.g. CTO"
                                    className="mt-5"
                                />


                                <Input
                                    label="Contact Email"
                                    type="email"
                                    value={
                                        form.contactEmail
                                    }
                                    onChange={(e) =>
                                        updateField(
                                            "contactEmail",
                                            e.target.value
                                        )
                                    }
                                    placeholder="contact@company.com"
                                    className="mt-5"
                                />


                                <Input
                                    label="Phone"
                                    value={
                                        form.contactPhone
                                    }
                                    onChange={(e) =>
                                        updateField(
                                            "contactPhone",
                                            e.target.value
                                        )
                                    }
                                    placeholder="+91..."
                                    className="mt-5"
                                />

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

                                    <Input
                                        label="City"
                                        value={form.city}
                                        onChange={(e) =>
                                            updateField(
                                                "city",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Pune"
                                    />

                                    <Input
                                        label="State"
                                        value={form.state}
                                        onChange={(e) =>
                                            updateField(
                                                "state",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Maharashtra"
                                    />

                                </div>


                                <Input
                                    label="Country"
                                    value={form.country}
                                    onChange={(e) =>
                                        updateField(
                                            "country",
                                            e.target.value
                                        )
                                    }
                                    placeholder="India"
                                    className="mt-5"
                                />

                            </div>


                            {/* =========================================
                                WEBSITE
                            ========================================= */}

                            <div className="border-b border-[#171914]/10 pb-6">

                                <div className="mb-5 flex items-center gap-2">

                                    <Globe
                                        size={18}
                                        className="text-[#2563eb]"
                                    />

                                    <h2 className="font-mono text-xs font-semibold uppercase tracking-wider">
                                        Online Presence
                                    </h2>

                                </div>


                                <Input
                                    label="Website"
                                    type="url"
                                    value={form.website}
                                    onChange={(e) =>
                                        updateField(
                                            "website",
                                            e.target.value
                                        )
                                    }
                                    placeholder="https://yourcompany.com"
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


                                <Input
                                    label="Email Address"
                                    type="email"
                                    value={form.email}
                                    onChange={(e) =>
                                        updateField(
                                            "email",
                                            e.target.value
                                        )
                                    }
                                    placeholder="admin@company.com"
                                    required
                                    icon={
                                        <Mail size={17} />
                                    }
                                />


                                <PasswordInput
                                    label="Password"
                                    value={form.password}
                                    onChange={(e) =>
                                        updateField(
                                            "password",
                                            e.target.value
                                        )
                                    }
                                    show={showPassword}
                                    setShow={setShowPassword}
                                />


                                <PasswordInput
                                    label="Confirm Password"
                                    value={
                                        form.confirmPassword
                                    }
                                    onChange={(e) =>
                                        updateField(
                                            "confirmPassword",
                                            e.target.value
                                        )
                                    }
                                    show={
                                        showConfirmPassword
                                    }
                                    setShow={
                                        setShowConfirmPassword
                                    }
                                />

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
                                    I agree to Sankalp's terms
                                    of use and understand that
                                    organization information may
                                    be used to facilitate civic
                                    collaborations.
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
                                    : "Create Industry Account"}

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


/* =========================================
   ARRAY SECTION
========================================= */

function ArraySection({
    title,
    icon,
    values,
    field,
    placeholder,
    updateArrayField,
    addArrayField,
    removeArrayField,
    required = false,
}) {
    return (
        <div className="border-b border-[#171914]/10 pb-6">

            <div className="mb-5 flex items-center gap-2">

                <span className="text-[#2563eb]">
                    {icon}
                </span>

                <h2 className="font-mono text-xs font-semibold uppercase tracking-wider">
                    {title}
                </h2>

            </div>


            <div className="space-y-2">

                {values.map(
                    (value, index) => (
                        <div
                            key={index}
                            className="flex gap-2"
                        >

                            <input
                                type="text"
                                value={value}
                                required={
                                    required &&
                                    index === 0
                                }
                                onChange={(e) =>
                                    updateArrayField(
                                        field,
                                        index,
                                        e.target.value
                                    )
                                }
                                placeholder={
                                    placeholder
                                }
                                className="h-11 flex-1 border border-[#171914]/15 bg-[#f8f8f5] px-4 text-sm outline-none transition-colors placeholder:text-[#171914]/30 focus:border-[#2563eb]"
                            />

                            {values.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        removeArrayField(
                                            field,
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
                onClick={() =>
                    addArrayField(field)
                }
                className="mt-3 flex items-center gap-2 text-xs font-semibold text-[#2563eb] hover:underline"
            >
                <Plus size={14} />
                Add another
            </button>

        </div>
    );
}


/* =========================================
   INPUT
========================================= */

function Input({
    label,
    type = "text",
    value,
    onChange,
    placeholder,
    required = false,
    className = "",
    icon,
}) {
    return (
        <div className={className}>

            <label className="mb-2 block font-mono text-xs uppercase tracking-wider text-[#171914]/55">
                {label}
            </label>

            <div className="relative">

                {icon && (
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#171914]/35">
                        {icon}
                    </span>
                )}

                <input
                    type={type}
                    required={required}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`h-12 w-full border border-[#171914]/15 bg-[#f8f8f5] px-4 text-sm outline-none transition-colors placeholder:text-[#171914]/30 focus:border-[#2563eb] ${
                        icon ? "pl-11" : ""
                    }`}
                />

            </div>

        </div>
    );
}


/* =========================================
   PASSWORD INPUT
========================================= */

function PasswordInput({
    label,
    value,
    onChange,
    show,
    setShow,
}) {
    return (
        <div className="mt-5">

            <label className="mb-2 block font-mono text-xs uppercase tracking-wider text-[#171914]/55">
                {label}
            </label>

            <div className="relative">

                <Lock
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#171914]/35"
                />

                <input
                    type={
                        show
                            ? "text"
                            : "password"
                    }
                    required
                    minLength={6}
                    value={value}
                    onChange={onChange}
                    placeholder={
                        label === "Password"
                            ? "Create a password"
                            : "Confirm your password"
                    }
                    className="h-12 w-full border border-[#171914]/15 bg-[#f8f8f5] pl-11 pr-12 text-sm outline-none transition-colors placeholder:text-[#171914]/30 focus:border-[#2563eb]"
                />

                <button
                    type="button"
                    onClick={() =>
                        setShow(
                            (value) => !value
                        )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#171914]/35 hover:text-[#171914]"
                >
                    {show ? (
                        <EyeOff size={18} />
                    ) : (
                        <Eye size={18} />
                    )}
                </button>

            </div>

            {label === "Password" && (
                <p className="mt-2 text-xs text-[#171914]/40">
                    Minimum 6 characters.
                </p>
            )}

        </div>
    );
}