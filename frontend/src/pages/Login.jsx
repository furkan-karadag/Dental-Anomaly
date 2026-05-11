import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import toast from "react-hot-toast";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new URLSearchParams();
        formData.append("username", username);
        formData.append("password", password);

        try {
            const res = await api.post("/auth/token", formData, {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            });
            localStorage.setItem("token", res.data.access_token);
            toast.success("Giriş başarılı!");
            navigate("/");
        } catch (err) {
            toast.error(err.response?.data?.detail || "Giriş başarısız! TC No veya şifre hatalı.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark flex font-display relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/10 dark:bg-blue-900/20 blur-[120px] pointer-events-none"></div>

            <div className="flex-1 flex flex-col justify-center items-center p-6 z-10">
                <div className="w-full max-w-md bg-surface-light dark:bg-surface-dark rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 p-8 md:p-10">
                    
                    {/* Logo & Header */}
                    <div className="flex flex-col items-center mb-10 gap-3">
                        <div className="flex items-center justify-center bg-primary/10 rounded-2xl size-16 text-primary shadow-inner">
                            <span className="material-symbols-outlined text-4xl">dentistry</span>
                        </div>
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-text-main dark:text-white tracking-tight">Dental AI'a Hoş Geldiniz</h2>
                            <p className="text-text-sub text-sm mt-1">Devam etmek için giriş yapın</p>
                        </div>
                    </div>

                    <form onSubmit={handleLogin} className="flex flex-col gap-5">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-text-main dark:text-slate-300 ml-1">TC Kimlik No</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                    <span className="material-symbols-outlined text-[20px]">badge</span>
                                </div>
                                <input
                                    type="text"
                                    placeholder="11 haneli TC No"
                                    value={username}
                                    onChange={(e) => {
                                        const rawVal = e.target.value;
                                        const val = rawVal.replace(/\D/g, '');
                                        if (rawVal !== val) {
                                            toast.error("TC Kimlik No sadece rakamlardan oluşabilir.", { id: 'tc-digit-error' });
                                        }
                                        setUsername(val);
                                    }}
                                    required
                                    maxLength="11"
                                    className="block w-full pl-11 pr-4 py-3.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-text-main dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-text-main dark:text-slate-300 ml-1">Şifre</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                    <span className="material-symbols-outlined text-[20px]">lock</span>
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Şifreniz"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="block w-full pl-11 pr-12 py-3.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-text-main dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-primary transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[20px]">
                                        {showPassword ? "visibility_off" : "visibility"}
                                    </span>
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full mt-2 bg-primary hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                            ) : (
                                <>
                                    Giriş Yap
                                    <span className="material-symbols-outlined text-[20px]">login</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t border-slate-100 dark:border-slate-800 pt-6">
                        <p className="text-sm text-text-sub">
                            Hesabınız yok mu?{' '}
                            <Link to="/register" className="text-primary font-bold hover:underline">
                                Kayıt Ol
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-xs text-slate-400 font-medium tracking-wide">
                    &copy; {new Date().getFullYear()} DENTAL AI TANISI SİSTEMİ
                </div>
            </div>
        </div>
    );
}

export default Login;
