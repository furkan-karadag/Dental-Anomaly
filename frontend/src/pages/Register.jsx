import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import toast from "react-hot-toast";

function Register() {
    const [ad, setAd] = useState("");
    const [soyad, setSoyad] = useState("");
    const [tcNo, setTcNo] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const validatePassword = (pass) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
        return regex.test(pass);
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!validatePassword(password)) {
            toast.error("Şifre en az 6 karakter olmalı, en az 1 büyük harf, 1 küçük harf ve 1 rakam içermelidir.");
            return;
        }

        setIsLoading(true);
        const formData = new FormData();
        formData.append("ad", ad);
        formData.append("soyad", soyad);
        formData.append("tc_no", tcNo);
        formData.append("password", password);

        try {
            await api.post("/auth/kayit", formData);
            toast.success("Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            console.error("Kayıt Hatası:", err);
            if (err.response) {
                toast.error(`Hata: ${err.response.data.detail || "Kayıt işlemi gerçekleştirilemedi."}`);
            } else if (err.request) {
                toast.error("Sunucuya ulaşılamıyor. Lütfen backend'in çalıştığından emin olun.");
            } else {
                toast.error("Bir hata oluştu: " + err.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark flex font-display relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-400/10 dark:bg-emerald-900/20 blur-[120px] pointer-events-none"></div>

            <div className="flex-1 flex flex-col justify-center items-center p-6 z-10">
                <div className="w-full max-w-md bg-surface-light dark:bg-surface-dark rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 p-8 md:p-10">
                    
                    {/* Logo & Header */}
                    <div className="flex flex-col items-center mb-8 gap-3">
                        <div className="flex items-center justify-center bg-primary/10 rounded-2xl size-16 text-primary shadow-inner">
                            <span className="material-symbols-outlined text-4xl">person_add</span>
                        </div>
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-text-main dark:text-white tracking-tight">Doktor Kaydı</h2>
                            <p className="text-text-sub text-sm mt-1">Sistemi kullanmak için hesap oluşturun</p>
                        </div>
                    </div>

                    <form onSubmit={handleRegister} className="flex flex-col gap-4">
                        <div className="flex gap-4">
                            <div className="flex flex-col gap-1.5 flex-1">
                                <label className="text-sm font-semibold text-text-main dark:text-slate-300 ml-1">Ad</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                        <span className="material-symbols-outlined text-[20px]">person</span>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Adınız"
                                        value={ad}
                                        onChange={(e) => setAd(e.target.value)}
                                        required
                                        className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-text-main dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-sm"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5 flex-1">
                                <label className="text-sm font-semibold text-text-main dark:text-slate-300 ml-1">Soyad</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Soyadınız"
                                        value={soyad}
                                        onChange={(e) => setSoyad(e.target.value)}
                                        required
                                        className="block w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-text-main dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-text-main dark:text-slate-300 ml-1">TC Kimlik No</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <span className="material-symbols-outlined text-[20px]">badge</span>
                                </div>
                                <input
                                    type="text"
                                    placeholder="11 haneli TC No"
                                    value={tcNo}
                                    onChange={(e) => {
                                        const rawVal = e.target.value;
                                        const val = rawVal.replace(/\D/g, '');
                                        if (rawVal !== val) {
                                            toast.error("TC Kimlik No sadece rakamlardan oluşabilir.", { id: 'tc-digit-error' });
                                        }
                                        setTcNo(val);
                                    }}
                                    required
                                    maxLength="11"
                                    className="block w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-text-main dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-sm"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-text-main dark:text-slate-300 ml-1">Şifre</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <span className="material-symbols-outlined text-[20px]">lock</span>
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Şifreniz"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="block w-full pl-10 pr-12 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-text-main dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-primary transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[20px]">
                                        {showPassword ? "visibility_off" : "visibility"}
                                    </span>
                                </button>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5 ml-1 leading-tight">
                                En az 6 karakter, 1 büyük, 1 küçük harf ve 1 rakam.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                            ) : (
                                <>
                                    Hesap Oluştur
                                    <span className="material-symbols-outlined text-[20px]">person_add</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t border-slate-100 dark:border-slate-800 pt-6">
                        <p className="text-sm text-text-sub">
                            Zaten hesabınız var mı?{' '}
                            <Link to="/login" className="text-primary font-bold hover:underline">
                                Giriş Yap
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-center text-xs text-slate-400 font-medium tracking-wide">
                    &copy; {new Date().getFullYear()} DENTAL AI TANISI SİSTEMİ
                </div>
            </div>
        </div>
    );
}

export default Register;
