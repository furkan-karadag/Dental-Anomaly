import React, { useState, useEffect } from 'react';
import { getPatients, getDashboardStats } from '../api';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';

const Dashboard = () => {
    const [patients, setPatients] = useState([]);
    const [stats, setStats] = useState({ total_patients: 0, pending_ai: 0, done_today: 0 });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Get user info if available
        const token = localStorage.getItem("token");
        if (!token) {
            navigate('/login');
            return;
        }

        // Mock decoding token or fetch profile - simple fallback for now
        // In a real app we'd decode the JWT or fetch /me

        const fetchData = async () => {
            try {
                const [patientsData, statsData] = await Promise.all([
                    getPatients(),
                    getDashboardStats()
                ]);
                if (patientsData.hastalar) {
                    setPatients(patientsData.hastalar);
                }
                if (statsData) {
                    setStats(statsData);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto flex flex-col gap-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard
                        icon="groups"
                        iconColor="text-primary"
                        iconBg="bg-blue-50 dark:bg-blue-900/30"
                        badge={`+${patients.length}`}
                        badgeColor="text-green-600 bg-green-50 dark:bg-green-900/30"
                        label="Toplam Hasta"
                        value={stats.total_patients}
                        onClick={() => navigate('/patients')}
                    />
                    <StatCard
                        icon="auto_awesome"
                        iconColor="text-amber-600"
                        iconBg="bg-amber-50 dark:bg-amber-900/30"
                        label="Tespit Edilen Sorun"
                        value={<>{stats.pending_ai} <span className="text-sm font-normal text-text-sub">İnceleme bekliyor</span></>}
                        onClick={() => navigate('/patients')}
                    />
                    <StatCard
                        icon="check_circle"
                        iconColor="text-green-600"
                        iconBg="bg-green-50 dark:bg-green-900/30"
                        label="Bugünkü Taramalar"
                        value={<>{stats.done_today} <span className="text-sm font-normal text-text-sub">Tamamlandı</span></>}
                        onClick={() => navigate('/analysis?filter=today')}
                    />
                </div>

                {/* Main Content Section */}
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-text-main dark:text-white text-xl font-bold tracking-tight flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">analytics</span>
                            Son Hastalar
                        </h3>
                        <button
                            onClick={() => navigate('/analysis?action=new')}
                            className="flex items-center gap-2 bg-primary hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-sm shadow-blue-200 dark:shadow-none"
                        >
                            <span className="material-symbols-outlined text-[20px]">add</span>
                            Yeni Analiz
                        </button>
                    </div>

                    {/* Grid of Cards */}
                    {loading ? (
                        <div className="text-center py-10 text-slate-500">Hastalar yükleniyor...</div>
                    ) : patients.length === 0 ? (
                        <div className="text-center py-10 bg-slate-50 dark:bg-slate-800 rounded-xl">
                            <p className="text-slate-500 mb-4">Henüz hasta kaydı bulunamadı.</p>
                            <button onClick={() => navigate('/analysis')} className="text-primary font-medium hover:underline">Yeni analiz başlat</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {patients.map((patient) => (
                                <PatientCard
                                    key={patient.id}
                                    name={`${patient.ad} ${patient.soyad}`}
                                    id={patient.tc_no}
                                    time="Yakın zamanda kayıt oldu"
                                    scanType="Bilinmiyor"
                                    // Fixed placeholder for now
                                    image="https://lh3.googleusercontent.com/aida-public/AB6AXuBm425Ddwiqi83gG-wcfub3nkBfmOdxC6jJZfbzXPHDzo-4QeQUbODYhcImF7DWwlh5kGnFLkr7fXgvKjVo6-uV1z6vo8lL7u70OUC0K8bovpmuwlkbBqqMn_ZqWl0Yky3cedtHMUDExwiuiVkPuM1NAJA-BT9-kxn6YhMiNK3OwtbRulKDNv0J7wgVHNDoxJLF_rJsYVTPL07oMY1waDrf62VSrN88zm2Gqc4JWmqb5dJzOgldl2Z4zX_e6yCiPrZfUyV3VFLSK4Ew"
                                    status="Kayıtlı"
                                    statusColor="bg-blue-50 text-blue-700 border-blue-200"
                                    onClick={() => navigate('/patients', { state: { patientId: patient.id } })}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

// Helper Components
const StatCard = ({ icon, iconColor, iconBg, badge, badgeColor, label, value, onClick }) => (
    <div onClick={onClick} className={`flex flex-col gap-1 p-6 bg-surface-light dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow ${onClick ? 'cursor-pointer' : ''}`}>
        <div className="flex items-center justify-between mb-2">
            <span className={`p-2 ${iconBg} ${iconColor} rounded-lg`}>
                <span className="material-symbols-outlined">{icon}</span>
            </span>
            {badge && (
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${badgeColor}`}>{badge}</span>
            )}
        </div>
        <p className="text-text-sub text-sm font-medium">{label}</p>
        <p className="text-text-main dark:text-white text-3xl font-bold">{value}</p>
    </div>
);

const PatientCard = ({ name, id, time, scanType, image, status, statusColor, statusIcon, onClick }) => (
    <div onClick={onClick} className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all overflow-hidden group cursor-pointer flex flex-col">
        <div className="relative h-48 w-full overflow-hidden bg-black">
            <div className="absolute top-3 right-3 z-10">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border shadow-sm flex items-center gap-1 ${statusColor}`}>
                    {statusIcon ? <span className="material-symbols-outlined text-[14px]">{statusIcon}</span> : <span className="size-1.5 rounded-full bg-amber-500 animate-pulse"></span>}
                    {status}
                </span>
            </div>
            <div className="w-full h-full bg-center bg-no-repeat bg-cover group-hover:scale-105 transition-transform duration-500 opacity-90" style={{ backgroundImage: `url("${image}")` }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
        </div>
        <div className="p-5 flex flex-col gap-3 flex-1">
            <div>
                <div className="flex justify-between items-start mb-1">
                    <h4 className="text-text-main dark:text-white text-base font-bold group-hover:text-primary transition-colors">{name}</h4>
                    <span className="truncate block text-xs text-slate-400 font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">ID: {id}</span>
                </div>
                <p className="text-text-sub text-sm flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-slate-400">schedule</span>
                    {time}
                </p>
            </div>
            <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <span className="text-xs font-medium text-slate-500">Tarama: {scanType}</span>
                <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">arrow_forward</span>
            </div>
        </div>
    </div>
);

export default Dashboard;
