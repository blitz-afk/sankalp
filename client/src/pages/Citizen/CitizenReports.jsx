import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowLeft,
    MapPin,
    FileText,
    Loader2,
    AlertCircle,
} from "lucide-react";

import { auth } from "../../firebase/config";
import api from "../../services/api";

export default function CitizenReports() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchReports = async () => {
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
                    "/problems/my",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setReports(
                    response.data?.problems || []
                );
            } catch (err) {
                console.error(
                    "Failed to fetch reports:",
                    err
                );

                setError(
                    err.response?.data?.message ||
                    "Failed to load your reports."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

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

                    <Link
                        to="/citizen"
                        className="flex items-center gap-2 text-sm text-[#13243b]/55 hover:text-[#13243b]"
                    >
                        <ArrowLeft size={16} />
                        Dashboard
                    </Link>

                </div>
            </nav>

            {/* MAIN */}

            <main className="mx-auto max-w-6xl px-5 pb-20 pt-10 md:px-8 md:pt-16">

                {/* HEADER */}

                <div className="mb-10">

                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#148aa0]">
                        Citizen
                    </p>

                    <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
                        My Reports
                    </h1>

                    <p className="mt-3 text-base text-[#13243b]/60">
                        Track the civic problems you have reported.
                    </p>

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
                            Loading your reports...
                        </div>
                    </div>
                ) : reports.length === 0 ? (

                    /* EMPTY STATE */

                    <div className="flex min-h-[360px] flex-col items-center justify-center rounded-[28px] border border-[#13243b]/10 bg-white px-6 text-center shadow-[0_12px_40px_rgba(19,36,59,0.05)]">

                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e7f8fa] text-[#148aa0]">
                            <FileText size={24} />
                        </div>

                        <h2 className="mt-5 text-2xl font-semibold">
                            No reports yet
                        </h2>

                        <p className="mt-2 max-w-md text-sm leading-relaxed text-[#13243b]/55">
                            You haven't submitted any civic
                            problems yet.
                        </p>

                        <Link
                            to="/citizen"
                            className="mt-6 rounded-full bg-[#13243b] px-6 py-3 text-sm font-medium text-white hover:bg-[#1d3554]"
                        >
                            Report a problem
                        </Link>

                    </div>

                ) : (

                    /* REPORT GRID */

                    <div className="grid gap-5 md:grid-cols-2">

                        {reports.map((report) => (
                            <ReportCard
                                key={report._id}
                                report={report}
                            />
                        ))}

                    </div>
                )}

            </main>
        </div>
    );
}


/* =========================================
   REPORT CARD
========================================= */

function ReportCard({ report }) {
    const status = report.status || "Submitted";

    const severity =
        report.aiAnalysis?.severity || "Low";

    return (
        <article className="overflow-hidden rounded-[24px] border border-[#13243b]/10 bg-white shadow-[0_10px_35px_rgba(19,36,59,0.05)]">

            {/* IMAGE */}

            {report.media?.[0] ? (
                <img
                    src={report.media[0]}
                    alt={report.title || "Civic report"}
                    className="h-56 w-full object-cover"
                />
            ) : (
                <div className="flex h-56 items-center justify-center bg-[#f3f3ef] text-[#13243b]/30">
                    <FileText size={32} />
                </div>
            )}

            {/* CONTENT */}

            <div className="space-y-5 p-5 md:p-6">

                <div>

                    <h2 className="text-xl font-semibold leading-snug">
                        {report.title || "Civic Problem"}
                    </h2>

                    <div className="mt-3 flex flex-wrap gap-2">

                        {report.aiAnalysis?.category && (
                            <span className="rounded-full border border-[#13243b]/10 bg-[#fafafa] px-3 py-1.5 text-xs">
                                {report.aiAnalysis.category}
                            </span>
                        )}

                        {report.aiAnalysis?.problemType && (
                            <span className="rounded-full border border-[#13243b]/10 bg-[#fafafa] px-3 py-1.5 text-xs">
                                {report.aiAnalysis.problemType}
                            </span>
                        )}

                        <span className="rounded-full border border-[#f1d5aa] bg-[#fff9ef] px-3 py-1.5 text-xs">
                            {severity}
                        </span>

                    </div>

                </div>

                {/* DESCRIPTION */}

                {report.description && (
                    <p className="line-clamp-3 text-sm leading-relaxed text-[#13243b]/60">
                        {report.description}
                    </p>
                )}

                {/* LOCATION */}

                <div className="flex items-start gap-2.5">

                    <MapPin
                        size={17}
                        className="mt-0.5 shrink-0 text-[#148aa0]"
                    />

                    <div className="min-w-0">

                        <p className="break-words text-sm font-medium">
                            {report.location?.address ||
                                "Address unavailable"}
                        </p>

                        {(report.location?.city ||
                            report.location?.state) && (
                            <p className="mt-1 text-xs text-[#13243b]/45">
                                {report.location?.city || ""}
                                {report.location?.city &&
                                report.location?.state
                                    ? ", "
                                    : ""}
                                {report.location?.state || ""}
                            </p>
                        )}

                    </div>

                </div>

                {/* FOOTER */}

                <div className="flex items-center justify-between border-t border-[#13243b]/10 pt-4">

                    <span className="text-xs text-[#13243b]/45">
                        {report.createdAt
                            ? new Date(
                                  report.createdAt
                              ).toLocaleDateString(
                                  "en-IN",
                                  {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                  }
                              )
                            : ""}
                    </span>

                    <span className="rounded-full border border-[#cdeef3] bg-[#e7f8fa] px-3 py-1.5 text-xs font-medium text-[#148aa0]">
                        {status}
                    </span>

                </div>

            </div>

        </article>
    );
}