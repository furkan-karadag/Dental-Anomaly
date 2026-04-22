import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useConfirm from '../hooks/useConfirm';
import { getMe, getPatients } from '../api';

const DashboardLayout = ({ children, user: externalUser }) => {
    const [user, setUser] = useState(externalUser || null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [allPatients, setAllPatients] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { confirm } = useConfirm();
    const notifRef = useRef(null);
    const profileRef = useRef(null);
    const searchRef = useRef(null);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        // Her route değişiminde güncel kullanıcı bilgisini çek
        getMe().then(data => setUser(data)).catch(console.error);
    }, [location.pathname]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setShowNotifications(false);
            }
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setShowProfileMenu(false);
            }
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowSearchDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Load all patients once for search
    useEffect(() => {
        getPatients().then(data => {
            if (data.hastalar) setAllPatients(data.hastalar);
        }).catch(console.error);
    }, []);

    const handleSearchChange = (e) => {
        const val = e.target.value;
        setSearchQuery(val);
        if (val.trim().length >= 1) {
            const lower = val.toLowerCase();
            const filtered = allPatients.filter(p =>
                p.ad.toLowerCase().includes(lower) ||
                p.soyad.toLowerCase().includes(lower) ||
                `${p.ad} ${p.soyad}`.toLowerCase().includes(lower) ||
                (p.tc_no && p.tc_no.includes(val))
            ).slice(0, 8);
            setSearchResults(filtered);
            setShowSearchDropdown(true);
        } else {
            setSearchResults([]);
            setShowSearchDropdown(false);
        }
    };

    const handlePatientSelect = (patient) => {
        setSearchQuery('');
        setShowSearchDropdown(false);
        navigate('/patients', { state: { patientId: patient.id } });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/patients?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
        } else {
            navigate('/patients');
        }
    };

    const handleLogout = async () => {
        setShowProfileMenu(false);
        const isConfirmed = await confirm({
            title: 'Çıkış Yap',
            message: 'Çıkış yapmak istediğinize emin misiniz?',
            confirmText: 'Çıkış Yap',
            cancelText: 'İptal'
        });
        if (isConfirmed) {
            localStorage.removeItem('token');
            navigate('/login');
        }
    };

    return (
        <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark text-text-main font-display antialiased">
            {/* Mobile Backdrop */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 md:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Side Navigation */}
            <aside className={`
                fixed md:static inset-y-0 left-0 z-50
                flex flex-col justify-between border-r border-slate-200 dark:border-slate-800 bg-surface-light dark:bg-surface-dark transition-all duration-300
                ${sidebarOpen ? 'w-72' : 'w-20 hidden md:flex'}
                ${mobileMenuOpen ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="flex flex-col h-full bg-white dark:bg-slate-900">
                    {/* Logo Area */}
                    <div className="flex items-center gap-3 px-6 py-8 shrink-0">
                        <div className="flex items-center justify-center bg-primary/10 rounded-lg size-10 text-primary shrink-0">
                            <span className="material-symbols-outlined text-3xl">dentistry</span>
                        </div>
                        {(sidebarOpen || mobileMenuOpen) && (
                            <div className="flex flex-col animate-fadeIn">
                                <h1 className="text-text-main dark:text-white text-lg font-bold leading-tight">Dental AI</h1>
                                <p className="text-text-sub text-xs font-medium uppercase tracking-wider">Tanı Sistemi</p>
                            </div>
                        )}
                        {/* Mobile Close Button */}
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="md:hidden ml-auto p-2 text-slate-400 hover:text-slate-600"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex flex-col gap-2 px-4 flex-1 overflow-y-auto">
                        <NavItem
                            icon="dashboard"
                            label="Ana Sayfa"
                            active={location.pathname === '/'}
                            onClick={() => navigate('/')}
                            expanded={sidebarOpen || mobileMenuOpen}
                        />
                        <NavItem
                            icon="group"
                            label="Hasta Listesi"
                            active={location.pathname === '/patients'}
                            onClick={() => navigate('/patients')}
                            expanded={sidebarOpen || mobileMenuOpen}
                        />
                        <NavItem
                            icon="medical_services"
                            label="Analiz Listesi"
                            active={location.pathname === '/analysis'}
                            onClick={() => navigate('/analysis')}
                            expanded={sidebarOpen || mobileMenuOpen}
                        />
                    </nav>

                    {/* Bottom Actions */}
                    <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2 shrink-0">
                        <NavItem
                            icon="settings"
                            label="Ayarlar"
                            active={location.pathname === '/profile'}
                            onClick={() => navigate('/profile')}
                            expanded={sidebarOpen || mobileMenuOpen}
                        />
                        <NavItem
                            icon="logout"
                            label="Çıkış Yap"
                            textClass="text-red-500"
                            iconClass="text-red-500"
                            expanded={sidebarOpen || mobileMenuOpen}
                            onClick={handleLogout}
                        />
                    </div>
                </div>
            </aside>

            {/* Main Content Wrapper */}
            <main className="flex flex-col flex-1 h-full overflow-hidden bg-background-light dark:bg-background-dark relative w-full">
                {/* Top Header */}
                <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-surface-light dark:bg-surface-dark px-4 md:px-8 py-4 z-10 shrink-0">
                    <div className="flex items-center gap-4">
                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg"
                        >
                            <span className="material-symbols-outlined">menu</span>
                        </button>

                        <div className="flex flex-col">
                            <h2 className="text-text-main dark:text-white text-lg md:text-xl font-bold truncate">
                                {user ? `Dr. ${user.ad} ${user.soyad}` : 'Dashboard'}
                            </h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 md:gap-4">
                        {/* Search */}
                        <div ref={searchRef} className="hidden md:flex relative w-64">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 transition-colors">
                                <span className="material-symbols-outlined text-[20px]">search</span>
                            </div>
                            <input
                                className="block w-full pl-10 pr-3 py-2.5 border-none rounded-xl bg-slate-100 dark:bg-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-main dark:text-white transition-all"
                                placeholder="Hasta ara..."
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onFocus={() => searchQuery.trim() && setShowSearchDropdown(true)}
                                autoComplete="off"
                            />
                            {showSearchDropdown && searchResults.length > 0 && (
                                <div className="absolute top-full mt-1 left-0 w-full bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden">
                                    {searchResults.map(patient => (
                                        <button
                                            key={patient.id}
                                            onMouseDown={() => handlePatientSelect(patient)}
                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-primary/5 text-left transition-colors border-b border-slate-100 dark:border-slate-700 last:border-0"
                                        >
                                            <div className="flex items-center justify-center rounded-full size-8 bg-primary/10 text-primary font-bold text-xs uppercase shrink-0">
                                                {patient.ad.charAt(0)}{patient.soyad.charAt(0)}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-sm font-medium text-slate-800 dark:text-white truncate">{patient.ad} {patient.soyad}</span>
                                                <span className="text-xs text-slate-400 font-mono">{patient.tc_no}</span>
                                            </div>
                                            <span className="material-symbols-outlined text-slate-300 text-[18px] ml-auto shrink-0">arrow_forward_ios</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                            {showSearchDropdown && searchQuery.trim() && searchResults.length === 0 && (
                                <div className="absolute top-full mt-1 left-0 w-full bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden">
                                    <div className="flex flex-col items-center justify-center py-6 text-center">
                                        <span className="material-symbols-outlined text-3xl text-slate-300 mb-1">person_search</span>
                                        <p className="text-slate-400 text-sm">Hasta bulunamadı</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Notification Button */}
                        <div className="relative" ref={notifRef}>
                            <button
                                onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
                                className="relative p-2 text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                            >
                                <span className="material-symbols-outlined">notifications</span>
                                <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                            </button>

                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden">
                                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                                        <h3 className="font-semibold text-slate-800 dark:text-white text-sm">Bildirimler</h3>
                                        <span className="text-xs text-slate-400">Tümü</span>
                                    </div>
                                    <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                                        <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">notifications_off</span>
                                        <p className="text-slate-400 text-sm">Henüz bildirim yok</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Profile Button */}
                        <div className="relative" ref={profileRef}>
                            <button
                                onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
                                className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                            >
                                <div className="flex items-center justify-center rounded-full size-8 md:size-9 shadow-sm bg-primary/10 border border-primary/20 text-primary font-bold text-sm uppercase">
                                    {user ? `${user.ad.charAt(0)}${user.soyad.charAt(0)}` : 'DR'}
                                </div>
                                <div className="hidden md:flex flex-col items-start">
                                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-tight">
                                        {user ? `${user.ad} ${user.soyad}` : '...'}
                                    </span>
                                    <span className="text-[10px] text-slate-400">Doktor</span>
                                </div>
                                <span className="material-symbols-outlined text-slate-400 text-xl pr-1 hidden md:block">expand_more</span>
                            </button>

                            {showProfileMenu && (
                                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden">
                                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                                        <p className="font-semibold text-slate-800 dark:text-white text-sm truncate">
                                            {user ? `Dr. ${user.ad} ${user.soyad}` : '...'}
                                        </p>
                                        <p className="text-xs text-slate-400 truncate">{user?.tc_no}</p>
                                    </div>
                                    <div className="p-2">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">logout</span>
                                            Çıkış Yap
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 scroll-smooth">
                    {children}
                </div>
            </main>
        </div>
    );
};

const NavItem = ({ icon, label, active, textClass = "text-text-sub", iconClass, onClick, expanded = true }) => (
    <button
        onClick={onClick}
        title={!expanded ? label : ''}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group ${active ? 'bg-primary/10 text-primary' : `hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary ${textClass}`}`}
    >
        <span className={`material-symbols-outlined ${active ? "font-variation-settings: 'FILL' 1" : "group-hover:scale-110 transition-transform"} ${iconClass}`}>{icon}</span>
        {expanded && <span className="text-sm font-medium whitespace-nowrap">{label}</span>}
    </button>
);

export default DashboardLayout;
