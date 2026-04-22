import { useState, useEffect } from "react";
import api from "../api";
import DashboardLayout from "../components/DashboardLayout";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Profile() {
    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ ad: '', soyad: '' });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        getUserInfo();
    }, []);

    const getUserInfo = async () => {
        try {
            const res = await api.get("/users/me");
            setUser(res.data);
            setFormData({ ad: res.data.ad, soyad: res.data.soyad });
        } catch (error) {
            toast.error("Kullanıcı bilgisi alınamadı");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            const res = await api.put("/users/me", formData);
            const updatedUser = res.data;
            // Hemen local state'i güncelle
            setUser(updatedUser);
            setFormData({ ad: updatedUser.ad, soyad: updatedUser.soyad });
            setEditMode(false);
            toast.success("Bilgiler başarıyla güncellendi");
            // DashboardLayout header'ını da güncellemek için kısa bir bekleme sonrası hard reload
            setTimeout(() => window.location.reload(), 1000);
        } catch (error) {
            toast.error("Güncelleme başarısız: " + (error?.response?.data?.detail || error.message));
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-2xl mx-auto py-4">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Profil & Ayarlar</h1>
                    <p className="text-slate-500 text-sm mt-1">Hesap bilgilerinizi görüntüleyin ve düzenleyin</p>
                </div>

                {loading ? (
                    <div className="text-center py-16 text-slate-400">Yükleniyor...</div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {/* Avatar Card */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 flex items-center gap-5">
                            <div className="flex items-center justify-center rounded-full size-20 bg-primary/10 border-2 border-primary/20 text-primary font-bold text-2xl uppercase shrink-0">
                                {user ? `${user.ad.charAt(0)}${user.soyad.charAt(0)}` : 'DR'}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                                    {user ? `Dr. ${user.ad} ${user.soyad}` : '—'}
                                </h2>
                                <p className="text-slate-500 text-sm mt-0.5">Diş Hekimi</p>
                                <span className="inline-block mt-2 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-700 border border-green-200">
                                    Aktif Hesap
                                </span>
                            </div>
                        </div>

                        {/* Account Info Card */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
                                <h3 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary text-[20px]">person</span>
                                    Hesap Bilgileri
                                </h3>
                                {!editMode ? (
                                    <button
                                        onClick={() => setEditMode(true)}
                                        className="flex items-center gap-1.5 text-sm font-medium text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">edit</span>
                                        Düzenle
                                    </button>
                                ) : (
                                    <span className="text-xs font-semibold px-2 py-1 bg-amber-100 text-amber-700 border border-amber-200 rounded-full">
                                        Düzenleniyor
                                    </span>
                                )}
                            </div>

                            <div className="divide-y divide-slate-100 dark:divide-slate-700">
                                {/* Ad */}
                                <div className="flex items-center justify-between px-6 py-4">
                                    <span className="text-sm text-slate-500 dark:text-slate-400 w-32">Ad</span>
                                    {editMode ? (
                                        <input
                                            className="flex-1 px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                            value={formData.ad}
                                            onChange={e => setFormData({ ...formData, ad: e.target.value })}
                                        />
                                    ) : (
                                        <span className="text-sm font-semibold text-slate-800 dark:text-white">{user?.ad}</span>
                                    )}
                                </div>

                                {/* Soyad */}
                                <div className="flex items-center justify-between px-6 py-4">
                                    <span className="text-sm text-slate-500 dark:text-slate-400 w-32">Soyad</span>
                                    {editMode ? (
                                        <input
                                            className="flex-1 px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                            value={formData.soyad}
                                            onChange={e => setFormData({ ...formData, soyad: e.target.value })}
                                        />
                                    ) : (
                                        <span className="text-sm font-semibold text-slate-800 dark:text-white">{user?.soyad}</span>
                                    )}
                                </div>

                                {/* TC Kimlik */}
                                <div className="flex items-center justify-between px-6 py-4">
                                    <span className="text-sm text-slate-500 dark:text-slate-400 w-32">TC Kimlik No</span>
                                    <span className="text-sm font-mono font-semibold text-slate-800 dark:text-white">{user?.tc_no}</span>
                                </div>

                                {/* Ünvan */}
                                <div className="flex items-center justify-between px-6 py-4">
                                    <span className="text-sm text-slate-500 dark:text-slate-400 w-32">Ünvan</span>
                                    <span className="text-sm font-semibold text-slate-800 dark:text-white">Diş Hekimi</span>
                                </div>
                            </div>

                            {editMode && (
                                <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700 flex gap-3 justify-end">
                                    <button
                                        onClick={() => { setEditMode(false); setFormData({ ad: user.ad, soyad: user.soyad }); }}
                                        className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
                                    >
                                        İptal
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
                                    >
                                        Kaydet
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

export default Profile;
