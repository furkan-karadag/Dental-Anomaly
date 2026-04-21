import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { useNavigate } from 'react-router-dom';

const Reports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch all patients and aggregate their history (MVP approach since we lack a get_all_reports endpoint)
        // Ideally we should add /reports endpoint to backend.
        const fetchReports = async () => {
            try {
                const patRes = await api.get('/patients/hastalar');
                const patients = patRes.data.hastalar || [];

                let allReports = [];

                // Fetch history for each patient (Parallel)
                const reportPromises = patients.map(async (p) => {
                    try {
                        const histRes = await api.get(`/patients/gecmis/${p.id}`);
                        const history = histRes.data.gecmis || [];
                        return history.map(r => ({
                            ...r,
                            patientName: `${p.ad} ${p.soyad}`,
                            patientId: p.id
                        }));
                    } catch (e) {
                        return [];
                    }
                });

                const results = await Promise.all(reportPromises);
                allReports = results.flat().sort((a, b) => new Date(b.tarih) - new Date(a.tarih));

                setReports(allReports);
            } catch (error) {
                console.error("Failed to load reports", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen text-slate-900 dark:text-white font-display">
            <header className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-dark flex items-center gap-4">
                <div className="size-8 text-primary flex items-center justify-center bg-primary/10 rounded-lg">
                    <span className="material-symbols-outlined text-2xl">description</span>
                </div>
                <h1 className="text-xl font-bold">All Reports</h1>
                <div className="ml-auto">
                    <button onClick={() => navigate('/')} className="text-slate-500 hover:text-primary transition">Dashboard</button>
                </div>
            </header>

            <main className="p-6 max-w-7xl mx-auto">
                <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                                    <th className="p-4 text-xs font-semibold uppercase text-slate-500">Date/Time</th>
                                    <th className="p-4 text-xs font-semibold uppercase text-slate-500">Patient</th>
                                    <th className="p-4 text-xs font-semibold uppercase text-slate-500">Findings</th>
                                    <th className="p-4 text-xs font-semibold uppercase text-slate-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" className="p-8 text-center text-slate-500">Loading reports...</td>
                                    </tr>
                                ) : reports.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="p-8 text-center text-slate-500">No reports found.</td>
                                    </tr>
                                ) : (
                                    reports.map((report) => (
                                        <tr key={report.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                                            <td className="p-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                                                {report.tarih}
                                            </td>
                                            <td className="p-4 text-sm font-bold text-slate-800 dark:text-white">
                                                {report.patientName}
                                            </td>
                                            <td className="p-4 text-sm text-slate-600 dark:text-slate-300">
                                                {report.rapor}
                                            </td>
                                            <td className="p-4 text-right">
                                                <button
                                                    onClick={() => navigate('/patients', { state: { patientId: report.patientId, reportId: report.id } })}
                                                    className="inline-flex items-center gap-1 text-primary hover:text-blue-700 text-sm font-medium"
                                                >
                                                    View Details <span className="material-symbols-outlined text-base">arrow_forward</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Reports;
