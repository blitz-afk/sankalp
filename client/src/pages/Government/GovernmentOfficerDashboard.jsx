import { useEffect, useState } from "react";
import { auth } from "../../firebase/config";
import { signOut } from "firebase/auth";
import api from "../../services/api";

import {
    ShieldCheck,
    Building2,
    GraduationCap,
    Factory,
    MapPin,
    CalendarDays,
    CheckCircle2,
    XCircle,
    Rocket,
    RefreshCw,
    ClipboardList,
    AlertCircle,
} from "lucide-react";

export default function GovernmentOfficerDashboard() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [error, setError] = useState("");
    const [selectedRequest, setSelectedRequest] = useState(null);

    const getToken = async () => {
        const user = auth.currentUser;

        if (!user) {
            throw new Error("You are not logged in.");
        }

        return await user.getIdToken();
    };

    const fetchRequests = async () => {
        try {
            setLoading(true);
            setError("");

            const token = await getToken();

            const response = await api.get("/pilot-requests/my", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setRequests(
                response.data.pilotRequests ||
                response.data.requests ||
                []
            );
        } catch (err) {
            console.error("FETCH PILOT REQUESTS ERROR:", err);

            setError(
                err.response?.data?.message ||
                err.message ||
                "Failed to load pilot requests."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleAction = async (requestId, action) => {
        try {
            setActionLoading(`${requestId}-${action}`);
            setError("");

            const token = await getToken();

            await api.patch(
                `/pilot-requests/${requestId}/${action}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setSelectedRequest(null);
            await fetchRequests();
        } catch (err) {
            console.error(`PILOT REQUEST ${action.toUpperCase()} ERROR:`, err);

            setError(
                err.response?.data?.message ||
                `Failed to ${action} pilot request.`
            );
        } finally {
            setActionLoading(null);
        }
    };

    const handleConvert = async (requestId) => {
        try {
            setActionLoading(`${requestId}-convert`);
            setError("");

            const token = await getToken();

            await api.patch(
                `/pilot-requests/${requestId}/convert`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setSelectedRequest(null);
            await fetchRequests();
        } catch (err) {
            console.error("CONVERT PILOT REQUEST ERROR:", err);

            setError(
                err.response?.data?.message ||
                "Failed to convert pilot request."
            );
        } finally {
            setActionLoading(null);
        }
    };
    const handleSignOut = async () => {
        try {
            await signOut(auth);
            window.location.href = "/login";
        } catch (error) {
            console.error("SIGN OUT ERROR:", error);
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "Pending":
                return "bg-amber-50 text-amber-700 border-amber-200";

            case "Accepted":
                return "bg-blue-50 text-blue-700 border-blue-200";

            case "Converted":
                return "bg-emerald-50 text-emerald-700 border-emerald-200";

            case "Rejected":
                return "bg-red-50 text-red-700 border-red-200";

            default:
                return "bg-gray-50 text-gray-600 border-gray-200";
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8f8f5] flex items-center justify-center">
                <div className="flex items-center gap-3 text-gray-600">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Loading pilot requests...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f8f5] text-[#171914]">

            {/* HEADER */}
            <header className="border-b border-black/10 bg-[#f8f8f5]">
                <div className="max-w-7xl mx-auto px-6 py-6">

                    <div className="flex items-center justify-between gap-6">

                        <div className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-xl bg-[#171914] text-white flex items-center justify-center">
                                <ShieldCheck className="w-6 h-6" />
                            </div>

                            <div>
                                <p className="text-xs font-mono uppercase tracking-widest text-gray-500">
                                    Sankalp / Government
                                </p>

                                <h1 className="text-2xl font-bold tracking-tight">
                                    Officer Dashboard
                                </h1>
                            </div>
                        </div>

                        <button
                            onClick={fetchRequests}
                            className="flex items-center gap-2 px-4 py-2.5 border border-black/10 rounded-lg bg-white hover:bg-gray-50 transition"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Refresh
                        </button>

                    </div>

                </div>
                <button
                    onClick={fetchRequests}
                    className="flex items-center gap-2 px-4 py-2.5 border border-black/10 rounded-lg bg-white hover:bg-gray-50 transition"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                </button>
            </header>

            {/* MAIN */}
            <main className="max-w-7xl mx-auto px-6 py-8">

                {/* ERROR */}
                {error && (
                    <div className="mb-6 flex items-start gap-3 p-4 rounded-xl border border-red-200 bg-red-50 text-red-700">
                        <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />

                        <div>
                            <p className="font-semibold">
                                Something went wrong
                            </p>

                            <p className="text-sm mt-1">
                                {error}
                            </p>
                        </div>
                    </div>
                )}

                {/* SUMMARY */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

                    <div className="bg-white border border-black/10 rounded-2xl p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">
                                    Incoming Requests
                                </p>

                                <p className="text-3xl font-bold mt-1">
                                    {
                                        requests.filter(
                                            (r) => r.status === "Pending"
                                        ).length
                                    }
                                </p>
                            </div>

                            <ClipboardList className="w-7 h-7 text-gray-400" />
                        </div>
                    </div>

                    <div className="bg-white border border-black/10 rounded-2xl p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">
                                    Accepted
                                </p>

                                <p className="text-3xl font-bold mt-1">
                                    {
                                        requests.filter(
                                            (r) => r.status === "Accepted"
                                        ).length
                                    }
                                </p>
                            </div>

                            <CheckCircle2 className="w-7 h-7 text-gray-400" />
                        </div>
                    </div>

                    <div className="bg-white border border-black/10 rounded-2xl p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">
                                    Converted to Pilots
                                </p>

                                <p className="text-3xl font-bold mt-1">
                                    {
                                        requests.filter(
                                            (r) => r.status === "Converted"
                                        ).length
                                    }
                                </p>
                            </div>

                            <Rocket className="w-7 h-7 text-gray-400" />
                        </div>
                    </div>

                </div>

                {/* PAGE TITLE */}
                <div className="mb-6">
                    <p className="text-xs font-mono uppercase tracking-widest text-blue-600 mb-2">
                        Pilot Coordination
                    </p>

                    <h2 className="text-3xl font-bold tracking-tight">
                        Pilot Requests
                    </h2>

                    <p className="text-gray-600 mt-2">
                        Review university proposals and coordinate approved
                        civic pilots.
                    </p>
                </div>

                {/* EMPTY */}
                {requests.length === 0 ? (
                    <div className="bg-white border border-black/10 rounded-2xl p-12 text-center">

                        <ClipboardList className="w-10 h-10 mx-auto text-gray-300 mb-4" />

                        <h3 className="text-lg font-semibold">
                            No pilot requests yet
                        </h3>

                        <p className="text-gray-500 text-sm mt-2">
                            New pilot applications assigned to your department
                            will appear here.
                        </p>

                    </div>
                ) : (

                    <div className="space-y-5">

                        {requests.map((request) => {

                            const solution = request.solutionId;
                            const university = request.universityId;
                            const industry = request.industryId;
                            const governmentBody = request.governmentBodyId;

                            return (
                                <div
                                    key={request._id}
                                    className="bg-white border border-black/10 rounded-2xl overflow-hidden"
                                >

                                    {/* CARD HEADER */}
                                    <div className="p-6 border-b border-black/10">

                                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">

                                            <div className="min-w-0">

                                                <div className="flex items-center gap-3 mb-3">

                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusClass(
                                                            request.status
                                                        )}`}
                                                    >
                                                        {request.status}
                                                    </span>

                                                    <span className="text-xs text-gray-400 font-mono">
                                                        {request._id}
                                                    </span>

                                                </div>

                                                <h3 className="text-xl font-bold break-words">
                                                    {request.title}
                                                </h3>

                                                <p className="text-gray-600 mt-2 max-w-3xl break-words">
                                                    {request.objective}
                                                </p>

                                            </div>

                                            <div className="flex gap-2 shrink-0">

                                                <button
                                                    onClick={() =>
                                                        setSelectedRequest(
                                                            request
                                                        )
                                                    }
                                                    className="px-4 py-2.5 rounded-lg border border-black/10 hover:bg-gray-50 transition font-medium"
                                                >
                                                    View Details
                                                </button>

                                            </div>

                                        </div>

                                    </div>

                                    {/* ORGANIZATIONS */}
                                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">

                                        <div className="border border-black/10 rounded-xl p-4">
                                            <div className="flex items-center gap-2 text-gray-500 text-xs uppercase tracking-wide font-mono">
                                                <GraduationCap className="w-4 h-4" />
                                                University
                                            </div>

                                            <p className="font-semibold mt-2 break-words">
                                                {university?.name ||
                                                    university?.universityName ||
                                                    "University"}
                                            </p>
                                        </div>

                                        <div className="border border-black/10 rounded-xl p-4">
                                            <div className="flex items-center gap-2 text-gray-500 text-xs uppercase tracking-wide font-mono">
                                                <Factory className="w-4 h-4" />
                                                Industry
                                            </div>

                                            <p className="font-semibold mt-2 break-words">
                                                {industry?.name ||
                                                    industry?.companyName ||
                                                    "Industry Organization"}
                                            </p>
                                        </div>

                                        <div className="border border-black/10 rounded-xl p-4">
                                            <div className="flex items-center gap-2 text-gray-500 text-xs uppercase tracking-wide font-mono">
                                                <Building2 className="w-4 h-4" />
                                                Government
                                            </div>

                                            <p className="font-semibold mt-2 break-words">
                                                {governmentBody?.name ||
                                                    "Government Department"}
                                            </p>
                                        </div>

                                    </div>

                                    {/* LOCATION + DURATION */}
                                    <div className="px-6 pb-6 flex flex-wrap gap-4 text-sm text-gray-600">

                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4" />

                                            {request.proposedLocation?.city ||
                                                "Location not specified"}

                                            {request.proposedLocation?.state &&
                                                `, ${request.proposedLocation.state}`}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <CalendarDays className="w-4 h-4" />

                                            {request.expectedDuration ||
                                                "Duration not specified"}
                                        </div>

                                    </div>

                                    {/* ACTIONS */}
                                    {request.status === "Pending" && (
                                        <div className="px-6 py-4 border-t border-black/10 bg-gray-50 flex flex-wrap justify-end gap-3">

                                            <button
                                                disabled={
                                                    actionLoading !== null
                                                }
                                                onClick={() =>
                                                    handleAction(
                                                        request._id,
                                                        "reject"
                                                    )
                                                }
                                                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition disabled:opacity-50"
                                            >
                                                <XCircle className="w-4 h-4" />

                                                {actionLoading ===
                                                    `${request._id}-reject`
                                                    ? "Rejecting..."
                                                    : "Reject"}
                                            </button>

                                            <button
                                                disabled={
                                                    actionLoading !== null
                                                }
                                                onClick={() =>
                                                    handleAction(
                                                        request._id,
                                                        "accept"
                                                    )
                                                }
                                                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#171914] text-white hover:opacity-90 transition disabled:opacity-50"
                                            >
                                                <CheckCircle2 className="w-4 h-4" />

                                                {actionLoading ===
                                                    `${request._id}-accept`
                                                    ? "Accepting..."
                                                    : "Accept Request"}
                                            </button>

                                        </div>
                                    )}

                                    {/* CONVERT */}
                                    {request.status === "Accepted" && (
                                        <div className="px-6 py-4 border-t border-black/10 bg-blue-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                                            <div>
                                                <p className="font-semibold text-blue-900">
                                                    Request approved
                                                </p>

                                                <p className="text-sm text-blue-700 mt-1">
                                                    Convert this approved
                                                    request into an active
                                                    pilot.
                                                </p>
                                            </div>

                                            <button
                                                disabled={
                                                    actionLoading !== null
                                                }
                                                onClick={() =>
                                                    handleConvert(
                                                        request._id
                                                    )
                                                }
                                                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
                                            >
                                                <Rocket className="w-4 h-4" />

                                                {actionLoading ===
                                                    `${request._id}-convert`
                                                    ? "Creating Pilot..."
                                                    : "Convert to Pilot"}
                                            </button>

                                        </div>
                                    )}

                                </div>
                            );
                        })}

                    </div>
                )}

            </main>

            {/* DETAILS MODAL */}
            {selectedRequest && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">

                    <div className="bg-[#f8f8f5] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">

                        {/* MODAL HEADER */}
                        <div className="sticky top-0 z-10 bg-[#f8f8f5] border-b border-black/10 px-6 py-5 flex items-start justify-between gap-4">

                            <div className="min-w-0">
                                <p className="text-xs font-mono uppercase tracking-widest text-blue-600">
                                    Pilot Request
                                </p>

                                <h2 className="text-2xl font-bold mt-1 break-words">
                                    {selectedRequest.title}
                                </h2>
                            </div>

                            <button
                                onClick={() => setSelectedRequest(null)}
                                className="w-9 h-9 rounded-lg border border-black/10 hover:bg-white flex items-center justify-center shrink-0"
                            >
                                <XCircle className="w-5 h-5" />
                            </button>

                        </div>

                        <div className="p-6 space-y-6">

                            {/* OBJECTIVE */}
                            <section>
                                <p className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">
                                    Objective
                                </p>

                                <div className="bg-white border border-black/10 rounded-xl p-4 whitespace-pre-wrap break-words">
                                    {selectedRequest.objective}
                                </div>
                            </section>

                            {/* LOCATION */}
                            <section>
                                <p className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">
                                    Proposed Location
                                </p>

                                <div className="bg-white border border-black/10 rounded-xl p-4">

                                    <div className="flex items-start gap-3">

                                        <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />

                                        <div>
                                            <p className="font-semibold">
                                                {
                                                    selectedRequest
                                                        .proposedLocation?.city
                                                }
                                                {selectedRequest
                                                    .proposedLocation?.state &&
                                                    `, ${selectedRequest.proposedLocation.state}`}
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                {
                                                    selectedRequest
                                                        .proposedLocation
                                                        ?.country
                                                }
                                            </p>

                                            {selectedRequest
                                                .proposedLocation?.details && (
                                                    <p className="text-sm text-gray-600 mt-2 whitespace-pre-wrap">
                                                        {
                                                            selectedRequest
                                                                .proposedLocation
                                                                .details
                                                        }
                                                    </p>
                                                )}

                                        </div>

                                    </div>

                                </div>
                            </section>

                            {/* IMPLEMENTATION */}
                            <section>
                                <p className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">
                                    Implementation Plan
                                </p>

                                <div className="bg-white border border-black/10 rounded-xl p-4 whitespace-pre-wrap break-words">
                                    {selectedRequest.implementationPlan}
                                </div>
                            </section>

                            {/* SUCCESS CRITERIA */}
                            <section>
                                <p className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">
                                    Success Criteria
                                </p>

                                <div className="bg-white border border-black/10 rounded-xl p-4">

                                    <ul className="space-y-2">
                                        {(
                                            selectedRequest.successCriteria ||
                                            []
                                        ).map((criterion, index) => (
                                            <li
                                                key={index}
                                                className="flex gap-3 text-sm"
                                            >
                                                <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />

                                                <span className="break-words">
                                                    {criterion}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>

                                </div>
                            </section>

                            {/* PARTICIPANTS */}
                            <section>

                                <p className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">
                                    Participants
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

                                    <div className="bg-white border border-black/10 rounded-xl p-4">
                                        <GraduationCap className="w-5 h-5 text-gray-500" />

                                        <p className="text-xs text-gray-500 mt-3">
                                            University
                                        </p>

                                        <p className="font-semibold mt-1">
                                            {selectedRequest.universityId
                                                ?.name ||
                                                selectedRequest.universityId
                                                    ?.universityName ||
                                                "University"}
                                        </p>
                                    </div>

                                    <div className="bg-white border border-black/10 rounded-xl p-4">
                                        <Factory className="w-5 h-5 text-gray-500" />

                                        <p className="text-xs text-gray-500 mt-3">
                                            Industry
                                        </p>

                                        <p className="font-semibold mt-1">
                                            {selectedRequest.industryId
                                                ?.name ||
                                                selectedRequest.industryId
                                                    ?.companyName ||
                                                "Industry Organization"}
                                        </p>
                                    </div>

                                    <div className="bg-white border border-black/10 rounded-xl p-4">
                                        <Building2 className="w-5 h-5 text-gray-500" />

                                        <p className="text-xs text-gray-500 mt-3">
                                            Government Body
                                        </p>

                                        <p className="font-semibold mt-1">
                                            {selectedRequest.governmentBodyId
                                                ?.name ||
                                                "Government Department"}
                                        </p>
                                    </div>

                                </div>

                            </section>

                            {/* REQUESTED PROBLEMS */}
                            <section>

                                <p className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">
                                    Selected Civic Problems
                                </p>

                                <div className="space-y-3">

                                    {(
                                        selectedRequest.problems ||
                                        selectedRequest.problemIds ||
                                        []
                                    ).map((problem, index) => {

                                        const problemData =
                                            typeof problem === "object"
                                                ? problem
                                                : null;

                                        return (
                                            <div
                                                key={
                                                    problemData?._id ||
                                                    problem ||
                                                    index
                                                }
                                                className="bg-white border border-black/10 rounded-xl p-4"
                                            >

                                                <p className="font-semibold break-words">
                                                    {problemData?.title ||
                                                        `Problem ${index + 1}`}
                                                </p>

                                                {problemData?.description && (
                                                    <p className="text-sm text-gray-600 mt-2 whitespace-pre-wrap break-words">
                                                        {
                                                            problemData.description
                                                        }
                                                    </p>
                                                )}

                                            </div>
                                        );
                                    })}

                                </div>

                            </section>

                            {/* MODAL ACTIONS */}
                            {selectedRequest.status === "Pending" && (
                                <div className="border-t border-black/10 pt-5 flex flex-wrap justify-end gap-3">

                                    <button
                                        disabled={actionLoading !== null}
                                        onClick={() =>
                                            handleAction(
                                                selectedRequest._id,
                                                "reject"
                                            )
                                        }
                                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50"
                                    >
                                        <XCircle className="w-4 h-4" />
                                        Reject
                                    </button>

                                    <button
                                        disabled={actionLoading !== null}
                                        onClick={() =>
                                            handleAction(
                                                selectedRequest._id,
                                                "accept"
                                            )
                                        }
                                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#171914] text-white hover:opacity-90 disabled:opacity-50"
                                    >
                                        <CheckCircle2 className="w-4 h-4" />
                                        Accept Request
                                    </button>

                                </div>
                            )}

                            {selectedRequest.status === "Accepted" && (
                                <div className="border-t border-black/10 pt-5 flex justify-end">

                                    <button
                                        disabled={actionLoading !== null}
                                        onClick={() =>
                                            handleConvert(
                                                selectedRequest._id
                                            )
                                        }
                                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        <Rocket className="w-4 h-4" />

                                        {actionLoading ===
                                            `${selectedRequest._id}-convert`
                                            ? "Creating Pilot..."
                                            : "Convert to Pilot"}
                                    </button>

                                </div>
                            )}

                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}