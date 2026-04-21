import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const DashboardLayout = ({ children, user }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

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
                                <p className="text-text-sub text-xs font-medium uppercase tracking-wider">Diagnostics</p>
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
                            label="Dashboard"
                            active={location.pathname === '/'}
                            onClick={() => navigate('/')}
                            expanded={sidebarOpen || mobileMenuOpen}
                        />
                        <NavItem
                            icon="group"
                            label="Patient List"
                            active={location.pathname === '/patients'}
                            onClick={() => navigate('/patients')}
                            expanded={sidebarOpen || mobileMenuOpen}
                        />
                        <NavItem
                            icon="medical_services"
                            label="New Analysis"
                            active={location.pathname === '/analysis'}
                            onClick={() => navigate('/analysis')}
                            expanded={sidebarOpen || mobileMenuOpen}
                        />
                        <NavItem
                            icon="description"
                            label="Reports"
                            active={location.pathname === '/reports'}
                            onClick={() => navigate('/reports')}
                            expanded={sidebarOpen || mobileMenuOpen}
                        />
                    </nav>

                    {/* Bottom Actions */}
                    <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2 shrink-0">
                        <NavItem
                            icon="settings"
                            label="Settings"
                            expanded={sidebarOpen || mobileMenuOpen}
                        />
                        <NavItem
                            icon="logout"
                            label="Log out"
                            textClass="text-red-500"
                            iconClass="text-red-500"
                            expanded={sidebarOpen || mobileMenuOpen}
                            onClick={() => {
                                if (window.confirm('Are you sure you want to logout?')) {
                                    localStorage.removeItem('token');
                                    navigate('/login');
                                }
                            }}
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
                                {user ? `Welcome back` : 'Dashboard'}
                            </h2>
                            <p className="text-text-sub text-xs md:text-sm hidden md:block">Here is what's happening with your patients today.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 md:gap-6">
                        {/* Search */}
                        <div className="hidden md:flex relative group w-64">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                <span className="material-symbols-outlined text-[20px]">search</span>
                            </div>
                            <input
                                className="block w-full pl-10 pr-3 py-2.5 border-none rounded-xl bg-slate-100 dark:bg-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-main dark:text-white transition-all"
                                placeholder="Search patients..."
                                type="text"
                            />
                        </div>
                        {/* Actions */}
                        <button className="relative p-2 text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                        </button>
                        <button className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                            <div className="bg-center bg-no-repeat bg-cover rounded-full size-8 md:size-9 shadow-sm bg-gray-300 border border-slate-200"
                                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCBvXr41_L2qPUFczULy-xSEYDF8J7TfLjnDAuhAQS6bRguCd8P-ng8a9su-qtD5POqaHHbh-MoZR6dOb4zIJNndpEA8Jao__PXyFcl3QIHcRtaLZaAmtZGalBk3M-amg0Q9_OuWG-dtbZtE4HCCHnBuUJITbMcKUzOEDneGLynSb-lEt2QRh5Vddxnob5wjGwiSnzoQn7eGbcXmA3iSrJYo2dTGWukYDLjHstnGihQEZSV7clGHZ9LJoLplZD9QIqGtV0IvQZIg0El")' }}>
                            </div>
                            <span className="material-symbols-outlined text-slate-400 text-xl pr-1 hidden md:block">expand_more</span>
                        </button>
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
