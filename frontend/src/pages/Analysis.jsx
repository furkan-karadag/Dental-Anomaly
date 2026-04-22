import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { analyzeImage, getPatients, getTumAnalizler, createPatient, api } from '../api';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/DashboardLayout';

const Analysis = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    // Support pre-selecting patient via URL or navigation state
    const initialPatientId = queryParams.get('patientId') || location.state?.patientId;
    const initialFilter = queryParams.get('filter') || 'all';

    const [selectedPatient, setSelectedPatient] = useState(null);
    const [patients, setPatients] = useState([]);
    const [analyses, setAnalyses] = useState([]);
    const [filterMode, setFilterMode] = useState(initialFilter);
    const [selectedDisease, setSelectedDisease] = useState('');
    const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);
    const [filterPatientName, setFilterPatientName] = useState('');
    const [filterStartDate, setFilterStartDate] = useState('');
    const [filterEndDate, setFilterEndDate] = useState('');
    const [showPatientSelect, setShowPatientSelect] = useState(!initialPatientId);

    // New Patient Form State
    const [showNewPatientForm, setShowNewPatientForm] = useState(false);
    const [showSelectPatientModal, setShowSelectPatientModal] = useState(queryParams.get('action') === 'new');
    const [newPatientv, setNewPatientv] = useState({ ad: '', soyad: '', tc_no: '' });

    const [imageSrc, setImageSrc] = useState(null);
    const [findings, setFindings] = useState([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [loadingPatients, setLoadingPatients] = useState(false);
    const [loadingAnalyses, setLoadingAnalyses] = useState(false);

    useEffect(() => {
        const loadPatients = async () => {
            setLoadingPatients(true);
            try {
                const data = await getPatients();
                if (data.hastalar) {
                    setPatients(data.hastalar);

                    // If initial ID provided, find and select it
                    if (initialPatientId) {
                        const pat = data.hastalar.find(p => p.id.toString() === initialPatientId.toString());
                        if (pat) {
                            setSelectedPatient(pat);
                            setShowPatientSelect(false);
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to load patients", error);
            } finally {
                setLoadingPatients(false);
            }
        };

        const loadAnalyses = async () => {
            setLoadingAnalyses(true);
            try {
                const data = await getTumAnalizler();
                if (data.analizler) {
                    setAnalyses(data.analizler);
                }
            } catch (error) {
                console.error("Failed to load analyses", error);
            } finally {
                setLoadingAnalyses(false);
            }
        };

        loadPatients();
        loadAnalyses();
    }, [initialPatientId]);

    const handlePatientSelect = (patient) => {
        setSelectedPatient(patient);
        setShowPatientSelect(false);
    };

    const handleCreatePatient = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("ad", newPatientv.ad);
            formData.append("soyad", newPatientv.soyad);
            formData.append("tc_no", newPatientv.tc_no);

            const result = await createPatient(formData);
            const newPatientId = result.hasta_id;

            // Reload list and select the new patient by ID
            const data = await getPatients();
            if (data.hastalar) {
                setPatients(data.hastalar);
                const added = data.hastalar.find(p => p.id === newPatientId);
                if (added) handlePatientSelect(added);
            }
            setShowNewPatientForm(false);
            setNewPatientv({ ad: '', soyad: '', tc_no: '' });
            toast.success("Patient created successfully");
        } catch (error) {
            toast.error("Failed to create patient: " + error.message);
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file || !selectedPatient) return;

        // Preview
        const reader = new FileReader();
        reader.onload = (e) => setImageSrc(e.target.result);
        reader.readAsDataURL(file);

        // Upload & Analyze
        setIsAnalyzing(true);
        setFindings([]);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const data = await analyzeImage(selectedPatient.id, formData);
            if (data.detections) {
                setFindings(data.detections);
            }
            // Navigate to patient history after success? Or stay? Stay for now.
            toast.success("Analysis complete");
        } catch (error) {
            console.error("Analysis failed", error);
            toast.error("Analysis failed. See console.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleChangePatient = () => {
        setImageSrc(null);
        setFindings([]);
        setShowPatientSelect(true);
    };

    const clearFilters = () => {
        setFilterPatientName('');
        setSelectedDisease('');
        setFilterStartDate('');
        setFilterEndDate('');
        setFilterMode('all');
    };

    const uniqueDiseases = [...new Set(analyses.flatMap(a => a.rapor ? a.rapor.split(', ').map(s => s.split(' (')[0].trim()) : []))].filter(Boolean).sort();

    const parseBackendDate = (dateStr) => {
        if (!dateStr) return null;
        const [datePart] = dateStr.split(' ');
        if (!datePart) return null;
        const [d, m, y] = datePart.split('-');
        if (!d || !m || !y) return null;
        return new Date(`${y}-${m}-${d}`);
    };

    const filteredAnalyses = analyses.filter(a => {
        if (filterMode === 'today') {
            const today = new Date();
            const dd = String(today.getDate()).padStart(2, '0');
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const yyyy = today.getFullYear();
            const todayFormatted = `${dd}-${mm}-${yyyy}`;
            if (!a.tarih || !a.tarih.startsWith(todayFormatted)) return false;
        }

        if (selectedDisease !== '') {
            if (!a.rapor || !a.rapor.includes(selectedDisease)) return false;
        }

        if (filterPatientName.trim() !== '') {
            const lowerSearch = filterPatientName.toLowerCase();
            const adSoyad = `${a.ad || ''} ${a.soyad || ''}`.toLowerCase();
            const matchesName = adSoyad.includes(lowerSearch);
            const matchesTc = typeof a.tc_no === 'string' ? a.tc_no.includes(filterPatientName) : (a.tc_no ? String(a.tc_no).includes(filterPatientName) : false);
            if (!matchesName && !matchesTc) return false;
        }

        if (filterStartDate) {
            const startD = new Date(filterStartDate);
            startD.setHours(0, 0, 0, 0);
            const aDate = parseBackendDate(a.tarih);
            if (aDate && aDate < startD) return false;
        }

        if (filterEndDate) {
            const endD = new Date(filterEndDate);
            endD.setHours(23, 59, 59, 999);
            const aDate = parseBackendDate(a.tarih);
            if (aDate && aDate > endD) return false;
        }

        return true;
    });

    if (showPatientSelect) {
        return (
            <DashboardLayout>
                <div className="flex-1 px-4 md:px-8 pb-12 w-full max-w-7xl mx-auto mt-6 transition-all">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                        <div>
                            <h1 className="text-[1.875rem] font-bold text-on-surface font-headline tracking-tight leading-tight">Analiz Listesi</h1>
                            <p className="text-on-surface-variant text-sm mt-1 font-body flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">medical_services</span>
                                Toplam {filteredAnalyses.length} analiz raporu
                            </p>
                        </div>
                        <button onClick={() => setShowSelectPatientModal(true)} className="bg-primary hover:bg-primary/90 text-on-primary font-medium text-sm px-6 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2 font-body whitespace-nowrap">
                            <span className="material-symbols-outlined text-lg">add_circle</span>
                            Yeni Analiz
                        </button>
                    </div>
                    {/* Filter Bar Row */}
                    <div className="bg-surface border border-outline/50 rounded-xl p-2 mb-2 flex flex-col sm:flex-row gap-2 justify-between items-center shadow-sm">
                        <div className="flex gap-1 bg-surface-container-low p-1 rounded-lg w-full sm:w-auto">
                            <button onClick={() => setFilterMode('all')} className={`px-4 py-1.5 text-sm font-medium rounded-md font-body flex-1 sm:flex-none transition-colors ${filterMode === 'all' ? 'bg-surface text-on-surface shadow-sm' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface/50'}`}>Tüm Analizler</button>
                            <button onClick={() => setFilterMode('today')} className={`px-4 py-1.5 text-sm font-medium rounded-md font-body flex-1 sm:flex-none transition-colors ${filterMode === 'today' ? 'bg-surface text-on-surface shadow-sm' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface/50'}`}>Bugün</button>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto px-2 sm:px-0 items-center justify-end">
                            <button onClick={() => setIsAdvancedFilterOpen(!isAdvancedFilterOpen)} className={`px-4 py-1.5 flex items-center gap-2 rounded-lg transition-colors text-sm font-medium font-body ${isAdvancedFilterOpen ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-container'}`} title="Detaylı Filtreleme">
                                <span className="material-symbols-outlined text-[18px]">tune</span>
                                Gelişmiş Filtre
                            </button>
                        </div>
                    </div>
                    {/* Advanced Filter Area */}
                    {isAdvancedFilterOpen && (
                        <div className="bg-surface border border-outline/50 rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-4 shadow-sm animate-in slide-in-from-top-2 fade-in duration-200">
                            <div className="flex flex-col gap-1.5 w-full flex-1">
                                <label className="text-[0.65rem] font-bold text-on-surface-variant uppercase tracking-wider font-headline ml-1">Kişi Ara</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
                                    <input
                                        type="text"
                                        placeholder="İsim, Soyisim, TC..."
                                        value={filterPatientName}
                                        onChange={(e) => setFilterPatientName(e.target.value)}
                                        className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-outline/50 bg-surface focus:outline-none focus:border-primary/50 text-on-surface transition-colors font-body placeholder:text-on-surface-variant/50"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5 w-full flex-1">
                                <label className="text-[0.65rem] font-bold text-on-surface-variant uppercase tracking-wider font-headline ml-1">Hastalık / Bulgu</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">medical_services</span>
                                    <select
                                        value={selectedDisease}
                                        onChange={(e) => setSelectedDisease(e.target.value)}
                                        className="w-full pl-9 pr-8 py-2 text-sm rounded-lg border border-outline/50 bg-surface focus:outline-none focus:border-primary/50 text-on-surface transition-colors font-body appearance-none cursor-pointer truncate"
                                    >
                                        <option value="">Tüm Bulgular</option>
                                        {uniqueDiseases.map((d, i) => <option key={i} value={d}>{d}</option>)}
                                    </select>
                                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px] pointer-events-none">expand_more</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5 w-full flex-1">
                                <label className="text-[0.65rem] font-bold text-on-surface-variant uppercase tracking-wider font-headline ml-1">Başlangıç Tarihi</label>
                                <input
                                    type="date"
                                    max={filterEndDate || undefined}
                                    value={filterStartDate}
                                    onChange={(e) => setFilterStartDate(e.target.value)}
                                    className="w-full px-3 py-2 text-sm rounded-lg border border-outline/50 bg-surface focus:outline-none focus:border-primary/50 text-on-surface transition-colors font-body"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5 w-full flex-1">
                                <label className="text-[0.65rem] font-bold text-on-surface-variant uppercase tracking-wider font-headline ml-1">Bitiş Tarihi</label>
                                <input
                                    type="date"
                                    min={filterStartDate || undefined}
                                    value={filterEndDate}
                                    onChange={(e) => setFilterEndDate(e.target.value)}
                                    className="w-full px-3 py-2 text-sm rounded-lg border border-outline/50 bg-surface focus:outline-none focus:border-primary/50 text-on-surface transition-colors font-body"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5 w-full md:w-auto self-end pb-0">
                                <button onClick={clearFilters} className="px-4 py-2 text-sm font-medium rounded-lg bg-surface hover:bg-surface-container/80 border border-outline/50 transition-colors text-on-surface-variant hover:text-on-surface flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">clear_all</span>
                                    <span>Temizle</span>
                                </button>
                            </div>
                        </div>
                    )}
                    {/* Analyses Table Card */}
                    <div className="bg-surface rounded-2xl shadow-sm border border-outline/50 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-surface-container-low/50 border-b border-outline/50">
                                        <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-headline">Tarih</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-headline">Hasta Adı</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-headline">Rapor Özeti</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-headline text-right">İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-outline/30 font-body text-sm">
                                    {loadingAnalyses ? (
                                        <tr>
                                            <td colSpan="4" className="text-center py-8 text-on-surface-variant">Analizler yükleniyor...</td>
                                        </tr>
                                    ) : filteredAnalyses.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="text-center py-8 text-on-surface-variant">Aradığınız kriterlere uygun analiz raporu bulunamadı.</td>
                                        </tr>
                                    ) : (
                                        filteredAnalyses.map((analiz) => (
                                            <tr key={analiz.id} className="hover:bg-primary/5 transition-colors group cursor-pointer" onClick={() => navigate('/patients', { state: { patientId: analiz.hasta_id, reportId: analiz.id } })}>
                                                <td className="px-6 py-4 text-on-surface-variant font-medium text-xs whitespace-nowrap">{analiz.tarih}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs border border-primary/20 uppercase shrink-0">
                                                            {analiz.ad.charAt(0)}{analiz.soyad.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-on-surface whitespace-nowrap">{analiz.ad} {analiz.soyad}</div>
                                                            <div className="text-xs text-on-surface-variant font-mono">{analiz.tc_no}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-on-surface-variant max-w-[300px] truncate" title={analiz.rapor}>
                                                    {analiz.rapor || "Sonuç Bekleniyor"}
                                                </td>
                                                <td className="px-6 py-4 text-right align-middle">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); navigate('/patients', { state: { patientId: analiz.hasta_id, reportId: analiz.id } }); }}
                                                            className="text-emerald-700 hover:text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5"
                                                        >
                                                            <span className="material-symbols-outlined text-[18px]">visibility</span>
                                                            <span className="hidden sm:inline">Görüntüle</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Hasta Seçim Modali (Yeni Analiz için) */}
                {showSelectPatientModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh]">
                            <div className="p-6 border-b border-outline/50 flex justify-between items-center bg-surface-container-low shrink-0">
                                <div>
                                    <h3 className="text-xl font-bold font-headline text-on-surface">Analiz İçin Hasta Seç</h3>
                                    <p className="text-sm text-on-surface-variant mt-1">Lütfen mevcut bir hasta seçin veya yeni ekleyin</p>
                                </div>
                                <button onClick={() => setShowSelectPatientModal(false)} className="text-on-surface-variant hover:text-on-surface transition-colors">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            <div className="p-4 overflow-y-auto flex-1 bg-surface">
                                {loadingPatients ? (
                                    <p className="text-center text-on-surface-variant py-4">Hastalar yükleniyor...</p>
                                ) : patients.length === 0 ? (
                                    <p className="text-center text-on-surface-variant py-4">Sistemde henüz hasta kaydı bulunmuyor.</p>
                                ) : (
                                    <div className="grid gap-2">
                                        {patients.map(p => (
                                            <button
                                                key={p.id}
                                                onClick={() => { setShowSelectPatientModal(false); handlePatientSelect(p); }}
                                                className="flex items-center justify-between p-3 rounded-xl border border-outline hover:border-primary hover:bg-primary/5 transition group text-left"
                                            >
                                                <div>
                                                    <h3 className="font-bold text-on-surface group-hover:text-primary transition-colors">{p.ad} {p.soyad}</h3>
                                                    <span className="text-xs font-mono text-on-surface-variant bg-surface-container-low px-1.5 py-0.5 rounded mt-1 inline-block">TC: {p.tc_no}</span>
                                                </div>
                                                <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">arrow_forward_ios</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="p-4 border-t border-outline/50 bg-surface-container-low flex justify-between gap-3 shrink-0">
                                <button onClick={() => { setShowSelectPatientModal(false); setShowNewPatientForm(true); }} className="flex-1 py-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 font-medium transition flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined text-[20px]">person_add</span>
                                    Yeni Hasta Ekle
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Yeni Hasta Ekle Modal */}
                {showNewPatientForm && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                            <div className="p-6 border-b border-outline/50 flex justify-between items-center bg-surface-container-low">
                                <h3 className="text-xl font-bold font-headline text-on-surface">Yeni Hasta Ekle</h3>
                                <button onClick={() => setShowNewPatientForm(false)} className="text-on-surface-variant hover:text-on-surface transition-colors">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            <form onSubmit={(e) => {
                                handleCreatePatient(e).then(() => {
                                    /* HandleCreatePatient reloads getPatients, modal closes there */
                                });
                            }} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-on-surface-variant mb-1">Ad</label>
                                    <input type="text" required
                                        className="w-full px-4 py-2 border border-outline rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body bg-surface text-on-surface"
                                        value={newPatientv.ad} onChange={e => setNewPatientv({ ...newPatientv, ad: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-on-surface-variant mb-1">Soyad</label>
                                    <input type="text" required
                                        className="w-full px-4 py-2 border border-outline rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body bg-surface text-on-surface"
                                        value={newPatientv.soyad} onChange={e => setNewPatientv({ ...newPatientv, soyad: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-on-surface-variant mb-1">TC Kimlik No</label>
                                    <input type="text" required
                                        maxLength={11}
                                        minLength={11}
                                        pattern="\d{11}"
                                        title="TC Kimlik numarası 11 rakamdan oluşmalıdır."
                                        className="w-full px-4 py-2 border border-outline rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body bg-surface text-on-surface"
                                        value={newPatientv.tc_no}
                                        onChange={e => setNewPatientv({ ...newPatientv, tc_no: e.target.value.replace(/\D/g, '') })}
                                    />
                                </div>
                                <div className="pt-4 flex gap-3">
                                    <button type="button" onClick={() => setShowNewPatientForm(false)} className="flex-1 py-2.5 bg-surface-container hover:bg-surface-container-high text-on-surface font-medium rounded-xl transition-colors">
                                        İptal
                                    </button>
                                    <button type="submit" className="flex-1 py-2.5 bg-primary hover:bg-primary/90 text-on-primary font-medium rounded-xl transition-colors shadow-sm focus:ring-4 focus:ring-primary/20">
                                        Kaydet
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </DashboardLayout>
        );
    }

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display flex flex-col h-screen overflow-hidden">
            {/* Top Navigation */}
            <header className="shrink-0 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-dark px-6 py-3 z-20">
                {/* Sol: Logo + Hasta Bilgisi */}
                <div className="flex items-center gap-3">
                    <div className="size-9 text-primary flex items-center justify-center bg-primary/10 rounded-lg shrink-0">
                        <span className="material-symbols-outlined text-2xl">dentistry</span>
                    </div>
                    {selectedPatient ? (
                        <div className="flex flex-col">
                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider leading-none mb-0.5">Röntgen Analizi</p>
                            <div className="flex items-center gap-2">
                                <span className="text-base font-bold text-slate-900 dark:text-white">{selectedPatient.ad} {selectedPatient.soyad}</span>
                                <span className="text-xs font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded hidden sm:inline">TC: {selectedPatient.tc_no}</span>
                            </div>
                        </div>
                    ) : (
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Dental AI — Röntgen Analiz</h1>
                    )}
                </div>

                {/* Sağ: Butonlar */}
                <div className="flex items-center gap-2">
                    {selectedPatient && (
                        <button
                            onClick={handleChangePatient}
                            className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-2 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
                        >
                            <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
                            <span className="hidden sm:inline">Hastayı Değiştir</span>
                        </button>
                    )}
                    <label className="cursor-pointer bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95">
                        <span className="material-symbols-outlined text-[20px]">upload_file</span>
                        <span className="hidden sm:inline">{findings.length > 0 ? "Başka Röntgen Yükle" : "Röntgen Görüntüsü Yükle"}</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                    </label>
                </div>
            </header>

            {/* Main Workspace */}
            <main className="flex-1 flex overflow-hidden">
                {/* X-Ray Viewer (Left/Center) */}
                <div className="flex-1 bg-black relative flex flex-col items-center justify-center overflow-hidden group">
                    {/* Canvas Area */}
                    <div className="relative w-full h-full flex items-center justify-center p-8 bg-zinc-900">
                        {imageSrc ? (
                            <div className="relative w-full h-full max-w-[1000px] max-h-full aspect-auto rounded-lg overflow-hidden shadow-2xl border border-slate-700 flex items-center justify-center">
                                <img
                                    alt="X-Ray Analysis"
                                    className="max-w-full max-h-full object-contain grayscale contrast-125 brightness-90 relative z-0"
                                    src={imageSrc}
                                    id="xray-image"
                                    onLoad={() => window.dispatchEvent(new Event('xray-image-loaded'))}
                                />

                                {findings.map((finding, index) => (
                                    <BoundingBox
                                        key={index}
                                        box={finding.box}
                                        color={finding.class.toLowerCase().includes('caries') ? 'rose' : 'amber'}
                                        label={`${finding.class} (${finding.confidence}%)`}
                                    />
                                ))}

                                {isAnalyzing && (
                                    <div className="absolute inset-0 bg-black/50 z-20 flex items-center justify-center backdrop-blur-sm">
                                        <div className="bg-black/80 p-6 rounded-2xl flex flex-col items-center gap-4 border border-slate-800 shadow-2xl">
                                            <span className="material-symbols-outlined text-5xl text-primary animate-spin">progress_activity</span>
                                            <div className="text-center">
                                                <p className="text-white font-bold text-lg">Röntgen Analiz Ediliyor...</p>
                                                <p className="text-slate-400 text-sm">Anomaliler tespit ediliyor</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center text-slate-500 flex flex-col items-center gap-4">
                                <div className="size-24 rounded-3xl bg-slate-800/50 flex items-center justify-center mb-2">
                                    <span className="material-symbols-outlined text-6xl opacity-20">add_a_photo</span>
                                </div>
                                <div>
                                    <p className="text-lg font-medium text-slate-400">Analiz İçin Hazır</p>
                                    <p className="text-sm opacity-60 max-w-xs mx-auto mt-1">
                                        Diş çürükleri, kistler ve diğer anomalileri otomatik olarak tespit etmek için bir dental röntgen görüntüsü yükleyin.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar (AI Findings) */}
                <aside className="w-[360px] flex flex-col bg-white dark:bg-surface-dark border-l border-slate-200 dark:border-slate-800 shadow-xl z-20">
                    <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">smart_toy</span>
                                YZ Bulguları
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">{findings.length} anomali tespit edildi</p>
                        </div>
                        {findings.length > 0 && <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-bold border border-green-200">Tamamlandı</span>}
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {findings.length === 0 && !isAnalyzing ? (
                            <div className="flex flex-col items-center justify-center h-48 text-center px-4">
                                <span className="material-symbols-outlined text-4xl text-slate-200 mb-2">content_paste_off</span>
                                <p className="text-sm text-slate-400">Henüz bulgu görüntülenecek bir şey yok.</p>
                                <p className="text-xs text-slate-500 mt-1">Sonuçları görmek için bir görüntü yükleyin.</p>
                            </div>
                        ) : (
                            findings.map((finding, index) => (
                                <FindingCard
                                    key={index}
                                    color={finding.class.toLowerCase().includes('caries') ? 'rose' : 'amber'}
                                    type={finding.class}
                                    tooth="Tespit Edildi"
                                    description={`Güven: ${finding.confidence}%`}
                                    confidence={`${finding.confidence}%`}
                                />
                            ))
                        )}
                    </div>
                    {findings.length > 0 && (
                        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                            <button onClick={() => navigate('/patients', { state: { patientId: selectedPatient?.id } })} className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-sm font-bold text-slate-600 dark:text-slate-300 transition-colors">
                                <span className="material-symbols-outlined">save</span>
                                Kaydet ve Geçmişte Görüntüle
                            </button>
                        </div>
                    )}
                </aside>
            </main>
        </div>
    );
};

// Helper Components - Updated BoundingBox to use relative coordinates if possible, or simplified absolute
// Note: YOLO returns absolute [x1, y1, x2, y2] based on original image size.
// To map this to the displayed image, we normally need a rescaling factor.
// For this MVP, we will assume visual representation handles basic scaling or we need to capture image dimensions.
// Since implementing full responsive mapping is complex in one go, I'll try to use percentage if possible or just absolute overlay on a fixed container.
// BETTER APPROACH for MVP:
// Since mapping pixel coords to Responsive CSS image is tricky without knowing rendered size vs natural size,
// I will implement a scaling wrapper. However, to keep it simple and functional for the user seeing "some" boxes,
// I will attempt to render them on top of the image assuming the image container allows standard positioning.

// Update: To do this correctly, we need the natural width/height of the image.
// I will add a simple onLoad handler to the img tag to get natural dimensions and current rendered dimensions.

const BoundingBox = ({ box, color, label }) => {
    // box is [x1, y1, x2, y2]
    // We need context of the image size to position correctly. 
    // This component needs to be smart or parent needs to pass scaling.
    // Let's rely on a smart parent wrapper in real prod.
    // For now, I will create a smart wrapper in the main component reference logic, 
    // OR just use a conceptual approach where I define style logic inside the component 
    // assuming we can get the image Element ID.

    const [style, setStyle] = useState({});

    useEffect(() => {
        const updatePosition = () => {
            const img = document.getElementById('xray-image');
            if (img && box) {
                const naturalWidth = img.naturalWidth;
                const naturalHeight = img.naturalHeight;
                const clientWidth = img.clientWidth;
                const clientHeight = img.clientHeight;
                const offsetLeft = img.offsetLeft;
                const offsetTop = img.offsetTop;

                // Protect against division by zero
                if (naturalWidth === 0 || naturalHeight === 0) return;

                const scaleX = clientWidth / naturalWidth;
                const scaleY = clientHeight / naturalHeight;

                const [x1, y1, x2, y2] = box;

                setStyle({
                    left: x1 * scaleX + offsetLeft,
                    top: y1 * scaleY + offsetTop,
                    width: (x2 - x1) * scaleX,
                    height: (y2 - y1) * scaleY,
                    position: 'absolute'
                });
            }
        };

        // Initial update
        window.addEventListener('resize', updatePosition);
        // Custom event for image load update
        window.addEventListener('xray-image-loaded', updatePosition);

        // Slight delay to ensure render
        const timer = setTimeout(updatePosition, 100);

        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('xray-image-loaded', updatePosition);
            clearTimeout(timer);
        };
    }, [box]);

    const colorMap = {
        rose: "border-rose-500 bg-rose-500/10 hover:bg-rose-500/30",
        amber: "border-amber-500 bg-amber-500/10 hover:bg-amber-500/30",
        emerald: "border-emerald-500/50 bg-emerald-500/5 hover:bg-emerald-500/20"
    };
    const labelColorMap = {
        rose: "bg-rose-600",
        amber: "bg-amber-600",
        emerald: "bg-emerald-600"
    };

    if (!style.left) return null; // Don't render if not calculated

    return (
        <div className={`border-2 ${colorMap[color] || colorMap.amber} rounded-sm transition-colors cursor-pointer group/box`} style={style}>
            <div className={`absolute -top-6 left-0 ${labelColorMap[color] || labelColorMap.amber} text-white text-[10px] px-1 py-0.5 rounded opacity-0 group-hover/box:opacity-100 transition-opacity whitespace-nowrap z-10 font-bold shadow-sm`}>
                {label}
            </div>
        </div>
    );
};

const FindingCard = ({ color, type, tooth, description, confidence }) => {
    const colorMap = {
        rose: "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800",
        amber: "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
    };
    const barColor = color === 'rose' ? 'bg-rose-500' : 'bg-amber-500';

    return (
        <div className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 hover:border-primary hover:shadow-md transition-all cursor-pointer relative overflow-hidden">
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${barColor} rounded-l-lg`}></div>
            <div className="flex justify-between items-start mb-2 pl-2">
                <div>
                    <div className="flex items-center gap-2">
                        <span className={`${colorMap[color]} text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide border`}>{type}</span>
                        <span className="text-slate-900 dark:text-white font-semibold text-sm">{tooth}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{description}</p>
                </div>
                <span className="text-xs font-mono font-medium px-1.5 py-0.5 rounded text-slate-500 border border-slate-200">{confidence}</span>
            </div>
        </div>
    );
};

export default Analysis;
