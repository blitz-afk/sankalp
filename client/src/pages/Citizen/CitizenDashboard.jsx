import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowUp,
    Camera,
    MapPin,
    X,
    Check,
    MessageCircle,
    Menu,
    FileText,
    Loader2,
    AlertCircle,
    ArrowLeft,
} from "lucide-react";

import { auth } from "../../firebase/config";
import api from "../../services/api";

export default function CitizenDashboard() {
    const [stage, setStage] = useState("compose");

    // AI preview returned by /api/problems/analyze
    const [preview, setPreview] = useState(null);

    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);

    const [location, setLocation] = useState(null);
    const [locationLoading, setLocationLoading] = useState(false);

    const [cameraOpen, setCameraOpen] = useState(false);
    const [cameraError, setCameraError] = useState("");

    const [analyzing, setAnalyzing] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState("");

    const [createdProblem, setCreatedProblem] = useState(null);

    const [menuOpen, setMenuOpen] = useState(false);

    const videoRef = useRef(null);
    const streamRef = useRef(null);

    const suggestions = [
        "Deep potholes on the main road",
        "Street light not working",
        "Garbage not collected for a week",
    ];

    // =========================================
    // CAMERA
    // =========================================

    const openCamera = async () => {
        try {
            setCameraError("");

            if (!navigator.mediaDevices?.getUserMedia) {
                setCameraError(
                    "Camera access is not supported by this browser."
                );
                return;
            }

            const stream =
                await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: {
                            ideal: "environment",
                        },
                    },
                    audio: false,
                });

            streamRef.current = stream;
            setCameraOpen(true);

            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            }, 0);
        } catch (err) {
            console.error("Camera error:", err);

            setCameraError(
                "Camera access was denied or is unavailable."
            );
        }
    };

    const capturePhoto = () => {
        const video = videoRef.current;

        if (!video) return;

        if (!video.videoWidth || !video.videoHeight) {
            setCameraError(
                "Camera is not ready yet. Please try again."
            );
            return;
        }

        const canvas = document.createElement("canvas");

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const context = canvas.getContext("2d");

        if (!context) {
            setCameraError("Unable to capture the photo.");
            return;
        }

        context.drawImage(
            video,
            0,
            0,
            canvas.width,
            canvas.height
        );

        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    setCameraError(
                        "Unable to capture the photo."
                    );
                    return;
                }

                const file = new File(
                    [blob],
                    `sankalp-${Date.now()}.jpg`,
                    {
                        type: "image/jpeg",
                    }
                );

                const previewUrl =
                    URL.createObjectURL(blob);

                setImage({
                    file,
                    preview: previewUrl,
                });

                closeCamera();
            },
            "image/jpeg",
            0.9
        );
    };

    const closeCamera = () => {
        if (streamRef.current) {
            streamRef.current
                .getTracks()
                .forEach((track) => track.stop());

            streamRef.current = null;
        }

        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }

        setCameraOpen(false);
        setCameraError("");
    };

    const removeImage = () => {
        if (image?.preview) {
            URL.revokeObjectURL(image.preview);
        }

        setImage(null);
    };

    // =========================================
    // LOCATION
    // =========================================

    const useLocation = () => {
        if (!navigator.geolocation) {
            setLocation({
                error:
                    "Geolocation is not supported by your browser.",
            });

            return;
        }

        setLocationLoading(true);
        setLocation(null);
        setError("");

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const {
                    latitude,
                    longitude,
                    accuracy,
                } = position.coords;

                setLocation({
                    latitude,
                    longitude,
                    accuracy,
                });

                setLocationLoading(false);
            },

            (err) => {
                console.error(
                    "Location error:",
                    err
                );

                setLocationLoading(false);

                setLocation({
                    error:
                        err.code === 1
                            ? "Location permission was denied."
                            : "Unable to determine your location.",
                });
            },

            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    };

    // =========================================
    // ANALYZE REPORT
    // =========================================

    const analyzeReport = async () => {
        setError("");

        if (!description.trim()) {
            setError("Please describe the problem.");
            return;
        }

        if (description.trim().length < 10) {
            setError(
                "Please describe the problem in at least 10 characters."
            );
            return;
        }

        if (!image?.file) {
            setError(
                "Please capture a live photo of the problem."
            );
            return;
        }

        if (
            !location ||
            typeof location.latitude !== "number" ||
            typeof location.longitude !== "number"
        ) {
            setError(
                "Please capture your current location."
            );
            return;
        }

        try {
            setAnalyzing(true);

            const user = auth.currentUser;

            if (!user) {
                setError(
                    "You are not authenticated. Please log in again."
                );
                return;
            }

            const token = await user.getIdToken();

            const formData = new FormData();

            formData.append(
                "description",
                description.trim()
            );

            formData.append(
                "location",
                JSON.stringify({
                    latitude: location.latitude,
                    longitude: location.longitude,
                })
            );

            formData.append(
                "media",
                image.file
            );

            const response = await api.post(
                "/problems/analyze",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.data?.preview) {
                throw new Error(
                    "Invalid preview response from server."
                );
            }

            setPreview(
                response.data.preview
            );

            setStage("confirm");
        } catch (err) {
            console.error(
                "Problem analysis failed:",
                err
            );

            const backendMessage =
                err.response?.data?.message;

            setError(
                backendMessage ||
                "We couldn't analyze your report. Please try again."
            );
        } finally {
            setAnalyzing(false);
        }
    };

    // =========================================
    // CONFIRM REPORT
    // =========================================

    const confirmReport = async () => {
    setError("");

    if (!image?.file) {
        setError(
            "Captured image is missing. Please take the photo again."
        );
        return;
    }

    if (!preview) {
        setError(
            "Report analysis is missing. Please analyze the report again."
        );
        return;
    }

    if (!preview.location) {
        setError(
            "Report location is missing. Please capture your location again."
        );
        return;
    }

    try {
        setSubmitting(true);

        const user = auth.currentUser;

        if (!user) {
            setError(
                "You are not authenticated. Please log in again."
            );
            return;
        }

        const token = await user.getIdToken();

        const formData = new FormData();

        formData.append(
            "description",
            description.trim()
        );

        formData.append(
            "location",
            JSON.stringify({
                latitude:
                    preview.location.latitude,

                longitude:
                    preview.location.longitude,

                address:
                    preview.location.address || "",

                city:
                    preview.location.city || "",

                state:
                    preview.location.state || "",

                country:
                    preview.location.country || ""
            })
        );

        // Send the exact AI analysis that the citizen
        // saw on the confirmation screen.
        formData.append(
            "analysis",
            JSON.stringify({
                isValid:
                    preview.isValid ?? true,

                imageMatchesReport:
                    preview.imageMatchesReport ?? true,

                confidence:
                    preview.confidence ?? 0,

                title:
                    preview.title || "",

                category:
                    preview.category || "Other",

                problemType:
                    preview.problemType || "",

                severity:
                    preview.severity || "Low",

                summary:
                    preview.summary || "",

                suggestedDepartment:
                    preview.suggestedDepartment || "",

                possibleAiGeneratedImage:
                    preview.possibleAiGeneratedImage ?? false
            })
        );

        formData.append(
            "media",
            image.file
        );

        const response = await api.post(
            "/problems",
            formData,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );

        setCreatedProblem(
            response.data.problem
        );

        setStage("submitted");

    } catch (err) {
        console.error(
            "Problem submission failed:",
            err
        );

        setError(
            err.response?.data?.message ||
            "Failed to submit the report. Please try again."
        );
    } finally {
        setSubmitting(false);
    }
};

    // =========================================
    // BACK TO EDIT
    // =========================================

    const editReport = () => {
        setPreview(null);
        setError("");
        setStage("compose");
    };

    // =========================================
    // RESET
    // =========================================

    const resetReport = () => {
        if (image?.preview) {
            URL.revokeObjectURL(image.preview);
        }

        setDescription("");
        setImage(null);
        setLocation(null);
        setPreview(null);
        setCreatedProblem(null);
        setError("");
        setStage("compose");
    };

    // =========================================
    // CLEAN CAMERA
    // =========================================

    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current
                    .getTracks()
                    .forEach((track) =>
                        track.stop()
                    );
            }

            if (image?.preview) {
                URL.revokeObjectURL(
                    image.preview
                );
            }
        };
    }, []);

    // =========================================
    // CONFIRM SCREEN
    // =========================================

    if (
        stage === "confirm" &&
        preview
    ) {
        return (
            <div className="min-h-screen bg-[#faf9f6] text-[#13243b]">

                {/* NAVBAR */}

                <nav className="sticky top-0 z-50 border-b border-[#13243b]/10 bg-[#faf9f6]/95 backdrop-blur-md">

                    <div className="mx-auto flex h-14 max-w-6xl items-center px-5 md:h-16 md:px-6">

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

                    </div>

                </nav>

                {/* MAIN */}

                <main className="mx-auto max-w-3xl px-5 pb-20 pt-10 md:px-8 md:pt-16">

                    <div className="mb-8">

                        <button
                            type="button"
                            onClick={editReport}
                            className="mb-6 flex items-center gap-2 text-sm text-[#13243b]/55 hover:text-[#13243b]"
                        >
                            <ArrowLeft size={16} />
                            Edit report
                        </button>

                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#148aa0]">
                            AI verification complete
                        </p>

                        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
                            Review your report
                        </h1>

                        <p className="mt-3 text-[#13243b]/60">
                            Check the details before submitting your civic report.
                        </p>

                    </div>

                    {error && (
                        <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">

                            <AlertCircle
                                size={18}
                                className="mt-0.5 shrink-0"
                            />

                            <span>
                                {error}
                            </span>

                        </div>
                    )}

                    <div className="overflow-hidden rounded-[28px] border border-[#13243b]/10 bg-white shadow-[0_12px_40px_rgba(19,36,59,0.07)]">

                        {/* IMAGE */}

                        {image?.preview && (
                            <img
                                src={image.preview}
                                alt="Captured civic problem"
                                className="h-64 w-full object-cover md:h-80"
                            />
                        )}

                        <div className="space-y-7 p-6 md:p-8">

                            {/* AI GENERATED TITLE */}

                            <section>

                                <p className="text-xs uppercase tracking-[0.18em] text-[#148aa0]">
                                    Problem
                                </p>

                                <h2 className="mt-2 text-2xl font-semibold md:text-3xl">
                                    {preview.title ||
                                        "Civic Problem"}
                                </h2>

                                <p className="mt-3 text-base leading-relaxed text-[#13243b]/65">
                                    {preview.description ||
                                        description}
                                </p>

                            </section>

                            <div className="border-t border-[#13243b]/10" />

                            {/* AI DETAILS */}

                            <section>

                                <p className="text-xs uppercase tracking-[0.18em] text-[#148aa0]">
                                    Sankalp AI
                                </p>

                                <div className="mt-4 flex flex-wrap gap-2">

                                    {preview.category && (
                                        <span className="rounded-full border border-[#13243b]/10 bg-[#fafafa] px-3 py-2 text-sm">
                                            {preview.category}
                                        </span>
                                    )}

                                    {preview.problemType && (
                                        <span className="rounded-full border border-[#13243b]/10 bg-[#fafafa] px-3 py-2 text-sm">
                                            {preview.problemType}
                                        </span>
                                    )}

                                    {preview.severity && (
                                        <span className="rounded-full border border-[#f1d5aa] bg-[#fff9ef] px-3 py-2 text-sm">
                                            {preview.severity}
                                        </span>
                                    )}

                                </div>

                                {preview.summary && (
                                    <p className="mt-4 text-sm leading-relaxed text-[#13243b]/60">
                                        {preview.summary}
                                    </p>
                                )}

                                {preview.suggestedDepartment && (
                                    <p className="mt-3 text-sm text-[#13243b]/60">
                                        <span className="font-medium text-[#13243b]">
                                            Responsible department:
                                        </span>{" "}
                                        {preview.suggestedDepartment}
                                    </p>
                                )}

                            </section>

                            <div className="border-t border-[#13243b]/10" />

                            {/* LOCATION */}

                            <section>

                                <div className="flex items-start gap-3">

                                    <MapPin
                                        size={20}
                                        className="mt-0.5 shrink-0 text-[#148aa0]"
                                    />

                                    <div className="min-w-0">

                                        <p className="text-xs uppercase tracking-[0.18em] text-[#148aa0]">
                                            Captured location
                                        </p>

                                        <p className="mt-2 break-words text-base font-medium">
                                            {preview.location?.address ||
                                                "Address unavailable"}
                                        </p>

                                        {(preview.location?.city ||
                                            preview.location?.state) && (
                                                <p className="mt-1 text-sm text-[#13243b]/50">
                                                    {preview.location?.city ||
                                                        ""}
                                                    {preview.location?.city &&
                                                        preview.location?.state
                                                        ? ", "
                                                        : ""}
                                                    {preview.location?.state ||
                                                        ""}
                                                </p>
                                            )}

                                        {preview.location?.latitude !=
                                            null &&
                                            preview.location?.longitude !=
                                            null && (
                                                <p className="mt-2 break-all text-xs text-[#13243b]/40">
                                                    Lat:{" "}
                                                    {
                                                        preview.location
                                                            .latitude
                                                    }
                                                    {" • "}
                                                    Lng:{" "}
                                                    {
                                                        preview.location
                                                            .longitude
                                                    }
                                                </p>
                                            )}

                                    </div>

                                </div>

                            </section>

                        </div>

                        {/* ACTIONS */}

                        <div className="flex flex-col-reverse gap-3 border-t border-[#13243b]/10 p-5 sm:flex-row sm:justify-end md:p-6">

                            <button
                                type="button"
                                onClick={editReport}
                                disabled={submitting}
                                className="flex items-center justify-center gap-2 rounded-full border border-[#13243b]/15 px-6 py-3 text-sm font-medium hover:bg-[#13243b]/5 disabled:opacity-50"
                            >
                                <ArrowLeft size={16} />
                                Edit report
                            </button>

                            <button
                                type="button"
                                onClick={confirmReport}
                                disabled={submitting}
                                className="flex items-center justify-center gap-2 rounded-full bg-[#13243b] px-6 py-3 text-sm font-medium text-white hover:bg-[#1d3554] disabled:opacity-60"
                            >

                                {submitting ? (
                                    <>
                                        <Loader2
                                            size={17}
                                            className="animate-spin"
                                        />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Check size={17} />
                                        Confirm report
                                    </>
                                )}

                            </button>

                        </div>

                    </div>

                </main>

            </div>
        );
    }

    // =========================================
    // COMPOSE SCREEN
    // =========================================

    if (stage === "compose") {
        return (
            <div className="min-h-screen bg-[#faf9f6] text-[#13243b]">

                {/* NAVBAR */}

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

                        <div className="hidden items-center gap-8 text-sm md:flex">

                            <Link
                                to="/citizen/reports"
                                className="text-[#13243b]/55 hover:text-[#13243b]"
                            >
                                My reports
                            </Link>

                            <span className="text-[#13243b]/60">
                                Citizen
                            </span>

                        </div>

                        <div className="relative md:hidden">

                            <button
                                type="button"
                                onClick={() =>
                                    setMenuOpen(
                                        (value) =>
                                            !value
                                    )
                                }
                                className="rounded-lg p-2 hover:bg-[#13243b]/5"
                                aria-label="Open menu"
                            >
                                <Menu size={20} />
                            </button>

                            {menuOpen && (
                                <div className="absolute right-0 top-11 w-48 rounded-xl border border-[#13243b]/10 bg-white p-2 shadow-lg">

                                    <Link
                                        to="/citizen/reports"
                                        className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm hover:bg-[#13243b]/5"
                                    >
                                        <FileText size={16} />
                                        My reports
                                    </Link>

                                </div>
                            )}

                        </div>

                    </div>

                </nav>

                {/* MAIN */}

                <main className="mx-auto flex min-h-[calc(100vh-56px)] max-w-5xl flex-col px-5 pb-20 pt-20 md:min-h-[calc(100vh-64px)] md:px-8 md:pt-36">

                    <div className="mx-auto w-full max-w-4xl">

                        <div className="mb-8">

                            <h1 className="text-4xl font-semibold tracking-[-0.035em] md:text-5xl lg:text-6xl">
                                Post your problem
                            </h1>

                            <p className="mt-4 text-base text-[#13243b]/60 md:text-lg">
                                Tell us what's happening and
                                capture the problem live.
                            </p>

                        </div>

                        {/* ERROR */}

                        {error && (
                            <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">

                                <AlertCircle
                                    size={18}
                                    className="mt-0.5 shrink-0"
                                />

                                <span>
                                    {error}
                                </span>

                            </div>
                        )}

                        {/* COMPOSER */}

                        <div className="overflow-hidden rounded-[28px] border border-[#13243b]/10 bg-white shadow-[0_12px_40px_rgba(19,36,59,0.07)]">

                            {/* IMAGE PREVIEW */}

                            {image && (
                                <div className="px-5 pt-5">

                                    <div className="relative inline-block">

                                        <img
                                            src={image.preview}
                                            alt="Captured civic problem"
                                            className="h-28 w-28 rounded-2xl object-cover"
                                        />

                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            disabled={analyzing}
                                            className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border border-[#13243b]/10 bg-white shadow-sm disabled:opacity-50"
                                            aria-label="Remove captured photo"
                                        >
                                            <X size={14} />
                                        </button>

                                    </div>

                                </div>
                            )}

                            {/* DESCRIPTION */}

                            <textarea
                                value={description}
                                onChange={(e) =>
                                    setDescription(
                                        e.target.value
                                    )
                                }
                                placeholder="What's the problem?"
                                rows={5}
                                disabled={analyzing}
                                className="w-full resize-none border-none bg-transparent px-6 py-6 text-base outline-none placeholder:text-[#13243b]/40 disabled:opacity-50 md:px-7 md:py-7 md:text-lg"
                            />

                            {/* ACTION BAR */}

                            <div className="flex items-center justify-between gap-3 px-5 pb-5 md:px-6 md:pb-6">

                                <div className="flex items-center gap-2">

                                    {/* CAMERA */}

                                    <button
                                        type="button"
                                        onClick={openCamera}
                                        disabled={analyzing}
                                        className="flex h-10 w-10 items-center justify-center rounded-full border border-[#13243b]/10 bg-white text-[#13243b]/65 hover:border-[#13243b]/25 hover:text-[#13243b] disabled:opacity-50"
                                        title="Take live photo"
                                        aria-label="Take live photo"
                                    >
                                        <Camera size={18} />
                                    </button>

                                    {/* LOCATION */}

                                    <button
                                        type="button"
                                        onClick={useLocation}
                                        disabled={
                                            locationLoading ||
                                            analyzing
                                        }
                                        className={`flex h-10 items-center gap-2 rounded-full border px-4 text-sm ${location &&
                                                typeof location.latitude ===
                                                "number"
                                                ? "border-[#cdeef3] bg-[#e7f8fa] text-[#148aa0]"
                                                : location?.error
                                                    ? "border-red-200 bg-red-50 text-red-600"
                                                    : "border-[#13243b]/10 bg-white text-[#13243b]/65 hover:border-[#13243b]/25"
                                            }`}
                                    >

                                        <MapPin size={17} />

                                        <span className="hidden sm:inline">
                                            {locationLoading
                                                ? "Detecting location..."
                                                : location &&
                                                    typeof location.latitude ===
                                                    "number"
                                                    ? "Location captured"
                                                    : location?.error
                                                        ? "Try again"
                                                        : "Use my current location"}
                                        </span>

                                        <span className="sm:hidden">
                                            {locationLoading
                                                ? "Detecting..."
                                                : location &&
                                                    typeof location.latitude ===
                                                    "number"
                                                    ? "Captured"
                                                    : location?.error
                                                        ? "Try again"
                                                        : "Location"}
                                        </span>

                                    </button>

                                </div>

                                {/* ANALYZE */}

                                <button
                                    type="button"
                                    disabled={
                                        analyzing ||
                                        !description.trim() ||
                                        !image?.file ||
                                        !location ||
                                        typeof location.latitude !==
                                        "number"
                                    }
                                    onClick={analyzeReport}
                                    className={`flex h-11 shrink-0 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium ${analyzing ||
                                            !description.trim() ||
                                            !image?.file ||
                                            !location ||
                                            typeof location.latitude !==
                                            "number"
                                            ? "bg-[#d0d4d9] text-white"
                                            : "bg-[#13243b] text-white hover:bg-[#1d3554]"
                                        }`}
                                    aria-label="Analyze problem"
                                >

                                    {analyzing ? (
                                        <>
                                            <Loader2
                                                size={18}
                                                className="animate-spin"
                                            />
                                            <span className="hidden sm:inline">
                                                Analyzing...
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="hidden sm:inline">
                                                Analyze
                                            </span>
                                            <ArrowUp size={19} />
                                        </>
                                    )}

                                </button>

                            </div>

                        </div>

                        <p className="mt-5 text-sm text-[#13243b]/60 md:text-base">
                            Sankalp will verify your photo and description before you submit the report.
                        </p>

                        {/* SUGGESTIONS */}

                        <div className="mt-8 flex flex-wrap gap-2.5">

                            {suggestions.map(
                                (suggestion) => (
                                    <button
                                        key={suggestion}
                                        type="button"
                                        onClick={() =>
                                            setDescription(
                                                suggestion
                                            )
                                        }
                                        disabled={analyzing}
                                        className="rounded-full border border-[#13243b]/10 bg-white px-4 py-2.5 text-sm text-[#13243b]/65 hover:border-[#13243b]/25 hover:text-[#13243b] disabled:opacity-50"
                                    >
                                        {suggestion}
                                    </button>
                                )
                            )}

                        </div>

                    </div>

                </main>

                {/* CAMERA */}

                {cameraOpen && (
                    <CameraModal
                        videoRef={videoRef}
                        cameraError={cameraError}
                        onCapture={capturePhoto}
                        onClose={closeCamera}
                    />
                )}

                {/* CHATBOT */}

                <button
                    type="button"
                    className="fixed bottom-5 right-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#13243b] text-white shadow-lg hover:scale-105 hover:bg-[#1d3554]"
                    aria-label="Open Sankalp assistant"
                >
                    <MessageCircle size={19} />
                </button>

            </div>
        );
    }

    // =========================================
    // SUBMITTED RESULT
    // =========================================

    return (
        <div className="min-h-screen bg-[#faf9f6] text-[#13243b]">

            {/* NAVBAR */}

            <nav className="border-b border-[#13243b]/10 bg-[#faf9f6]">

                <div className="mx-auto flex h-16 max-w-6xl items-center px-5 md:px-6">

                    <Link
                        to="/citizen"
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

            {/* MAIN */}

            <main className="mx-auto max-w-4xl px-5 py-12 md:px-8 md:py-20">

                <div className="mb-10 text-center">

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#dff7fa] text-[#148aa0]">
                        <Check size={28} />
                    </div>

                    <h1 className="mt-7 text-4xl font-semibold tracking-tight md:text-5xl">
                        Report submitted
                    </h1>

                    <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-[#13243b]/60">
                        Sankalp has received your civic problem.
                    </p>

                </div>

                {createdProblem && (
                    <div className="overflow-hidden rounded-[28px] border border-[#13243b]/10 bg-white shadow-[0_12px_40px_rgba(19,36,59,0.06)]">

                        {/* IMAGE */}

                        {createdProblem.media?.[0] && (
                            <img
                                src={
                                    createdProblem.media[0]
                                }
                                alt="Submitted civic problem"
                                className="h-64 w-full object-cover md:h-[360px]"
                            />
                        )}

                        <div className="space-y-7 p-6 md:p-8">

                            {/* GENERATED TITLE */}

                            <div>

                                <p className="text-xs uppercase tracking-[0.18em] text-[#148aa0]">
                                    Problem
                                </p>

                                <h2 className="mt-2 text-2xl font-semibold">
                                    {createdProblem.title ||
                                        "Civic Problem"}
                                </h2>

                                <p className="mt-3 text-base leading-relaxed text-[#13243b]/65">
                                    {
                                        createdProblem.description
                                    }
                                </p>

                            </div>

                            <div className="border-t border-[#13243b]/10" />

                            {/* AI ANALYSIS */}

                            {createdProblem.aiAnalysis && (
                                <div>

                                    <p className="text-xs uppercase tracking-[0.18em] text-[#148aa0]">
                                        Sankalp AI
                                    </p>

                                    <div className="mt-4 flex flex-wrap gap-2">

                                        {createdProblem
                                            .aiAnalysis
                                            .category && (
                                                <span className="rounded-full border border-[#13243b]/10 bg-[#fafafa] px-3.5 py-2 text-sm">
                                                    Category:{" "}
                                                    {
                                                        createdProblem
                                                            .aiAnalysis
                                                            .category
                                                    }
                                                </span>
                                            )}

                                        {createdProblem
                                            .aiAnalysis
                                            .problemType && (
                                                <span className="rounded-full border border-[#13243b]/10 bg-[#fafafa] px-3.5 py-2 text-sm">
                                                    Type:{" "}
                                                    {
                                                        createdProblem
                                                            .aiAnalysis
                                                            .problemType
                                                    }
                                                </span>
                                            )}

                                        {createdProblem
                                            .aiAnalysis
                                            .severity && (
                                                <span className="rounded-full border border-[#f1d5aa] bg-[#fff9ef] px-3.5 py-2 text-sm">
                                                    Severity:{" "}
                                                    {
                                                        createdProblem
                                                            .aiAnalysis
                                                            .severity
                                                    }
                                                </span>
                                            )}

                                    </div>

                                    {createdProblem
                                        .aiAnalysis
                                        .summary && (
                                            <p className="mt-4 text-sm leading-relaxed text-[#13243b]/60">
                                                {
                                                    createdProblem
                                                        .aiAnalysis
                                                        .summary
                                                }
                                            </p>
                                        )}

                                </div>
                            )}

                            <div className="border-t border-[#13243b]/10" />

                            {/* LOCATION */}

                            <div>

                                <div className="flex items-start gap-3">

                                    <MapPin
                                        size={19}
                                        className="mt-0.5 shrink-0 text-[#148aa0]"
                                    />

                                    <div className="min-w-0">

                                        <p className="text-xs uppercase tracking-[0.18em] text-[#148aa0]">
                                            Location
                                        </p>

                                        <p className="mt-2 break-words text-base font-medium">
                                            {
                                                createdProblem
                                                    .location
                                                    ?.address ||
                                                "Address unavailable"
                                            }
                                        </p>

                                        {(createdProblem
                                            .location
                                            ?.city ||
                                            createdProblem
                                                .location
                                                ?.state) && (
                                                <p className="mt-1 text-sm text-[#13243b]/50">

                                                    {
                                                        createdProblem
                                                            .location
                                                            ?.city
                                                    }

                                                    {createdProblem
                                                        .location
                                                        ?.city &&
                                                        createdProblem
                                                            .location
                                                            ?.state
                                                        ? ", "
                                                        : ""}

                                                    {
                                                        createdProblem
                                                            .location
                                                            ?.state
                                                    }

                                                </p>
                                            )}

                                        {createdProblem
                                            .location
                                            ?.latitude !=
                                            null &&
                                            createdProblem
                                                .location
                                                ?.longitude !=
                                            null && (
                                                <p className="mt-2 break-all text-xs text-[#13243b]/40">
                                                    Lat:{" "}
                                                    {
                                                        createdProblem
                                                            .location
                                                            .latitude
                                                    }
                                                    {" • "}
                                                    Lng:{" "}
                                                    {
                                                        createdProblem
                                                            .location
                                                            .longitude
                                                    }
                                                </p>
                                            )}

                                    </div>

                                </div>

                            </div>

                            <div className="border-t border-[#13243b]/10" />

                            {/* STATUS */}

                            <div className="flex items-center justify-between gap-4">

                                <span className="text-sm text-[#13243b]/50">
                                    Status
                                </span>

                                <span className="rounded-full border border-[#cdeef3] bg-[#e7f8fa] px-3.5 py-2 text-xs font-medium text-[#148aa0]">
                                    {
                                        createdProblem.status ||
                                        "Submitted"
                                    }
                                </span>

                            </div>

                        </div>

                    </div>
                )}

                <div className="mt-8 flex flex-col items-center gap-3">

                    <button
                        type="button"
                        onClick={resetReport}
                        className="flex items-center gap-2 rounded-full bg-[#13243b] px-6 py-3 text-sm font-medium text-white hover:bg-[#1d3554]"
                    >
                        Report another problem
                    </button>

                    <Link
                        to="/citizen/reports"
                        className="px-5 py-3 text-sm font-medium text-[#148aa0] hover:underline"
                    >
                        View my reports
                    </Link>

                </div>

            </main>

        </div>
    );
}

// =========================================
// CAMERA MODAL
// =========================================

function CameraModal({
    videoRef,
    cameraError,
    onCapture,
    onClose,
}) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">

            <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-[#faf9f6]">

                {/* HEADER */}

                <div className="flex items-center justify-between border-b border-[#13243b]/10 px-5 py-4">

                    <div>

                        <p className="font-semibold">
                            Capture photo
                        </p>

                        <p className="mt-1 text-xs text-[#13243b]/50">
                            Take a live photo of the civic problem
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-2 hover:bg-[#13243b]/5"
                        aria-label="Close camera"
                    >
                        <X size={19} />
                    </button>

                </div>

                {/* CAMERA VIEW */}

                <div className="relative bg-black">

                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="aspect-[4/3] w-full object-cover"
                    />

                    {cameraError && (
                        <div className="absolute inset-x-4 bottom-4 rounded-xl bg-red-500/90 px-4 py-3 text-center text-sm text-white">
                            {cameraError}
                        </div>
                    )}

                </div>

                {/* SHUTTER */}

                <div className="flex justify-center px-5 py-5">

                    <button
                        type="button"
                        onClick={onCapture}
                        className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-[#13243b] text-white shadow-lg transition-transform hover:scale-105"
                        aria-label="Capture photo"
                    >
                        <Camera size={24} />
                    </button>

                </div>

            </div>

        </div>
    );
}