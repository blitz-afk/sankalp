import { useEffect, useState } from "react";
import { CheckCircle, XCircle, RefreshCw, ShieldCheck } from "lucide-react";

import api from "../../services/api";
import { auth } from "../../firebase/config";
import { signOut } from "firebase/auth";

export default function GovernmentBodyDashboard() {
    const [pilots, setPilots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [error, setError] = useState("");

    const getConfig = async () => {
        const token = await auth.currentUser.getIdToken();

        return {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
    };

    const fetchPilots = async () => {
        try {
            setLoading(true);
            setError("");

            const config = await getConfig();

            const response = await api.get(
                "/government-bodies/pilots/completed",
                config
            );

            setPilots(response.data?.pilots || []);

        } catch (error) {
            console.error("FETCH COMPLETED PILOTS ERROR:", error);

            setError(
                error.response?.data?.message ||
                "Failed to fetch completed pilots"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPilots();
    }, []);

    const handleVerify = async (pilotId) => {
        try {
            setActionLoading(pilotId);

            const config = await getConfig();

            await api.patch(
                `/government-bodies/pilots/${pilotId}/verify`,
                {},
                config
            );

            await fetchPilots();

        } catch (error) {
            console.error("VERIFY PILOT ERROR:", error);

            alert(
                error.response?.data?.message ||
                "Failed to verify pilot"
            );
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (pilotId) => {
        try {
            setActionLoading(pilotId);

            const config = await getConfig();

            await api.patch(
                `/government-bodies/pilots/${pilotId}/reject`,
                {},
                config
            );

            await fetchPilots();

        } catch (error) {
            console.error("REJECT PILOT ERROR:", error);

            alert(
                error.response?.data?.message ||
                "Failed to reject pilot"
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
                                    Government Body Dashboard
                                </h1>
                            </div>

                        </div>

                        <div className="flex items-center gap-3">

                            <button
                                onClick={fetchPilots}
                                className="flex items-center gap-2 px-4 py-2.5 border border-black/10 rounded-lg bg-white hover:bg-gray-50 transition"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Refresh
                            </button>

                            <button
                                onClick={handleSignOut}
                                className="px-4 py-2.5 border border-black/10 rounded-lg bg-white hover:bg-gray-50 transition"
                            >
                                Sign Out
                            </button>

                        </div>

                    </div>

                </div>
            </header>


            {/* MAIN */}
            <main className="max-w-7xl mx-auto px-6 py-10">

                <div className="mb-10">

                    <p className="text-xs font-mono uppercase tracking-widest text-[#2563eb] mb-2">
                        Verification Queue
                    </p>

                    <h2 className="text-4xl font-bold tracking-tight">
                        Completed Pilots
                    </h2>

                    <p className="mt-3 text-gray-500 max-w-2xl">
                        Review pilot results submitted by government officers
                        and verify whether the solution successfully addressed
                        the civic challenge.
                    </p>

                </div>


                {/* ERROR */}
                {error && (
                    <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
                        {error}
                    </div>
                )}


                {/* LOADING */}
                {loading && (
                    <div className="py-20 text-center text-gray-500">
                        Loading completed pilots...
                    </div>
                )}


                {/* EMPTY */}
                {!loading && pilots.length === 0 && !error && (
                    <div className="border border-black/10 bg-white rounded-xl p-12 text-center">

                        <CheckCircle className="w-10 h-10 mx-auto mb-4 text-gray-400" />

                        <h3 className="text-xl font-semibold">
                            No pilots awaiting verification
                        </h3>

                        <p className="mt-2 text-gray-500">
                            Completed government pilots will appear here.
                        </p>

                    </div>
                )}


                {/* PILOTS */}
                {!loading && pilots.length > 0 && (
                    <div className="grid gap-6">

                        {pilots.map((pilot) => (

                            <div
                                key={pilot._id}
                                className="border border-black/10 bg-white rounded-xl p-6"
                            >

                                <div className="flex flex-col gap-6">

                                    {/* TITLE */}
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">

                                            <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                                                Pilot Completed
                                            </span>

                                        </div>

                                        <h3 className="text-2xl font-bold">
                                            {pilot.title}
                                        </h3>
                                    </div>


                                    {/* DETAILS */}
                                    <div className="grid gap-4 md:grid-cols-3">

                                        <div>
                                            <p className="text-xs uppercase font-mono text-gray-400">
                                                University
                                            </p>

                                            <p className="mt-1 font-semibold">
                                                {pilot.universityId?.name || "—"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs uppercase font-mono text-gray-400">
                                                Industry
                                            </p>

                                            <p className="mt-1 font-semibold">
                                                {pilot.industryId?.name || "—"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs uppercase font-mono text-gray-400">
                                                Location
                                            </p>

                                            <p className="mt-1 font-semibold">
                                                {pilot.location?.city || "—"}
                                            </p>
                                        </div>

                                    </div>


                                    {/* OBJECTIVE */}
                                    <div>
                                        <p className="text-xs uppercase font-mono text-gray-400 mb-2">
                                            Objective
                                        </p>

                                        <p className="text-gray-600 leading-relaxed">
                                            {pilot.objective}
                                        </p>
                                    </div>


                                    {/* RESULTS */}
                                    <div className="rounded-lg bg-[#f8f8f5] border border-black/5 p-5">

                                        <p className="text-xs uppercase font-mono text-gray-400 mb-2">
                                            Officer Results
                                        </p>

                                        <p className="text-gray-700 leading-relaxed">
                                            {pilot.results || "No results submitted."}
                                        </p>

                                    </div>


                                    {/* ACTIONS */}
                                    <div className="flex flex-wrap gap-3 pt-2">

                                        <button
                                            disabled={actionLoading === pilot._id}
                                            onClick={() => handleVerify(pilot._id)}
                                            className="flex items-center gap-2 px-5 py-3 rounded-lg bg-[#171914] text-white hover:bg-black transition disabled:opacity-50"
                                        >
                                            <CheckCircle className="w-4 h-4" />

                                            {actionLoading === pilot._id
                                                ? "Processing..."
                                                : "Verify & Solve"}
                                        </button>


                                        <button
                                            disabled={actionLoading === pilot._id}
                                            onClick={() => handleReject(pilot._id)}
                                            className="flex items-center gap-2 px-5 py-3 rounded-lg border border-red-200 text-red-600 bg-white hover:bg-red-50 transition disabled:opacity-50"
                                        >
                                            <XCircle className="w-4 h-4" />
                                            Reject
                                        </button>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>
                )}

            </main>

        </div>
    );
}