import { useState, useEffect, useRef } from "react";
import { api, createPatient } from "../api";
import { Container, Row, Col, Card, Button, ListGroup, Badge, Alert, Tab, Tabs, Form } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { Trash } from "react-bootstrap-icons";
import DashboardLayout from "../components/DashboardLayout";
import useConfirm from "../hooks/useConfirm";
import toast from "react-hot-toast";

// Backend Adresi
const API_URL = "http://127.0.0.1:8000";

function Patients() {
    const [hastalar, setHastalar] = useState([]);
    const [sortMode, setSortMode] = useState('newest');
    const [searchTerm, setSearchTerm] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [seciliHasta, setSeciliHasta] = useState(null);
    const [analizSonucu, setAnalizSonucu] = useState(null);
    const [gecmis, setGecmis] = useState([]);
    const [activeTab, setActiveTab] = useState("gecmis");
    const [hoveredBox, setHoveredBox] = useState(null);
    const [showBoxes, setShowBoxes] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [yeniHasta, setYeniHasta] = useState({ ad: '', soyad: '', tc_no: '' });
    const [imgDimensions, setImgDimensions] = useState({ width: 0, height: 0 });
    const imgRef = useRef(null);

    const navigate = useNavigate();
    const location = useLocation();
    const { confirm } = useConfirm();

    useEffect(() => {
        hastalariGetir();
    }, []);

    const hastalariGetir = async () => {
        try {
            const res = await api.get(`/patients/hastalar`);
            const patients = res.data.hastalar;
            setHastalar(patients);

            // Check for initial patient/report selection
            const initPatientId = location.state?.patientId;
            const initReportId = location.state?.reportId;

            if (initPatientId) {
                const pat = patients.find(p => p.id.toString() === initPatientId.toString());
                if (pat) {
                    hastaSec(pat, initReportId);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    const hastaGecmisiGetir = async (id) => {
        try {
            const res = await api.get(`/patients/gecmis/${id}`);
            const parsedGecmis = res.data.gecmis.map(item => ({
                ...item,
                detections: item.detections ? JSON.parse(item.detections) : [],
                resim_url: `/static/${item.dosya_yolu}`
            }));
            return parsedGecmis;
        } catch (e) {
            console.error(e);
            return [];
        }
    };

    const hastaSec = async (hasta, reportIdToSelect = null) => {
        setSeciliHasta(hasta);
        setAnalizSonucu(null);
        setActiveTab("gecmis");

        const history = await hastaGecmisiGetir(hasta.id);
        setGecmis(history);

        if (reportIdToSelect) {
            const report = history.find(r => r.id.toString() === reportIdToSelect.toString());
            if (report) {
                gecmisDetayGoster(report);
            }
        }
    }

    const rontgenSil = async (e, id) => {
        e.stopPropagation();
        const isConfirmed = await confirm("Bu röntgen kaydını silmek istediğinize emin misiniz?");
        if (!isConfirmed) return;
        try {
            await api.delete(`/patients/rontgen_sil/${id}`);
            const updatedHistory = await hastaGecmisiGetir(seciliHasta.id);
            setGecmis(updatedHistory);
            if (analizSonucu && analizSonucu.resim_url.includes(id)) {
                setAnalizSonucu(null);
                setActiveTab("gecmis");
            }
            toast.success("Kayıt başarıyla silindi");
        } catch (error) {
            toast.error("Silme hatası");
        }
    };

    const hastaSil = async (e, hasta) => {
        e.stopPropagation();
        const isConfirmed = await confirm(`${hasta.ad} ${hasta.soyad} adlı hastayı silmek istediğinize emin misiniz? Tüm analiz kayıtları da silinecektir.`);
        if (!isConfirmed) return;
        try {
            await api.delete(`/patients/hasta_sil/${hasta.id}`);
            if (seciliHasta?.id === hasta.id) {
                setSeciliHasta(null);
                setGecmis([]);
                setAnalizSonucu(null);
            }
            hastalariGetir();
            toast.success("Hasta başarıyla silindi");
        } catch (error) {
            toast.error("Hasta silme hatası");
        }
    };

    const gecmisDetayGoster = (item) => {
        setAnalizSonucu({
            resim_url: item.resim_url,
            detections: item.detections || [],
            rapor: item.detections && item.detections.length > 0
                ? item.detections.map(d => `${d.class} (%${d.confidence})`)
                : typeof item.rapor === 'string' ? item.rapor.split(', ') : [item.rapor]
        });
        setActiveTab("detay");
    };

    const handleImageLoad = (e) => {
        setImgDimensions({
            width: e.target.naturalWidth,
            height: e.target.naturalHeight
        });
    };

    const handleBackToList = () => {
        setSeciliHasta(null);
    };

    const handleCreatePatient = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("ad", yeniHasta.ad);
            formData.append("soyad", yeniHasta.soyad);
            formData.append("tc_no", yeniHasta.tc_no);

            await createPatient(formData);
            
            setShowAddModal(false);
            setYeniHasta({ ad: '', soyad: '', tc_no: '' });
            hastalariGetir(); // Refresh list
            toast.success("Hasta başarıyla eklendi");
        } catch (error) {
            toast.error("Hasta eklenemedi: " + error.message);
        }
    };

    const renderBoxes = () => {
        if (!analizSonucu || !analizSonucu.detections || !imgRef.current) return null;

        const currentWidth = imgRef.current.clientWidth;
        const currentHeight = imgRef.current.clientHeight;
        const scaleX = currentWidth / imgDimensions.width;
        const scaleY = currentHeight / imgDimensions.height;

        return analizSonucu.detections.map((det, index) => {
            const [x1, y1, x2, y2] = det.box;
            const isHovered = hoveredBox === index;
            const isVisible = showBoxes || isHovered;

            const style = {
                position: "absolute",
                left: x1 * scaleX,
                top: y1 * scaleY,
                width: (x2 - x1) * scaleX,
                height: (y2 - y1) * scaleY,
                border: isVisible ? (isHovered ? "3px solid #ff0000" : "2px solid #00ff00") : "none",
                backgroundColor: isHovered ? "rgba(255, 0, 0, 0.1)" : "transparent",
                cursor: "pointer",
                zIndex: isHovered ? 10 : 1,
            };

            return (
                <div
                    key={index}
                    style={style}
                    onMouseEnter={() => setHoveredBox(index)}
                    onMouseLeave={() => setHoveredBox(null)}
                >
                    {isHovered && (
                        <div style={{
                            position: "absolute",
                            top: "-25px",
                            left: "0",
                            backgroundColor: "rgba(0, 0, 0, 0.8)",
                            color: "white",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            whiteSpace: "nowrap",
                            zIndex: 20
                        }}>
                            {det.class} (%{det.confidence})
                        </div>
                    )}
                </div>
            );
        });
    };

    let displayedPatients = [...hastalar];
    
    if (sortMode === 'newest') {
        displayedPatients.reverse();
    } else if (sortMode === 'oldest') {
        // do nothing
    } else if (sortMode === 'az') {
        displayedPatients.sort((a,b) => a.ad.localeCompare(b.ad));
    } else if (sortMode === 'za') {
        displayedPatients.sort((a,b) => b.ad.localeCompare(a.ad));
    }
    
    if (searchTerm.trim() !== '') {
        const lowerSearch = searchTerm.toLowerCase();
        displayedPatients = displayedPatients.filter(p => {
            const matchesName = p.ad.toLowerCase().includes(lowerSearch) || p.soyad.toLowerCase().includes(lowerSearch);
            const matchesTc = p.tc_no && p.tc_no.includes(searchTerm);
            return matchesName || matchesTc;
        });
    }

    return (
        <DashboardLayout>
            {!seciliHasta ? (
                // LIST VIEW (New Tailwind Mockup)
                <div className="flex-1 px-4 md:px-8 pb-12 w-full max-w-7xl mx-auto mt-6 transition-all">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                        <div>
                            <h1 className="text-[1.875rem] font-bold text-on-surface font-headline tracking-tight leading-tight">Hasta Listesi</h1>
                            <p className="text-on-surface-variant text-sm mt-1 font-body flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">groups</span>
                                Toplam {displayedPatients.length} {hastalar.length !== displayedPatients.length ? `/ ${hastalar.length} ` : ''}hasta
                            </p>
                        </div>
                        <button onClick={() => setShowAddModal(true)} className="bg-primary hover:bg-primary/90 text-on-primary font-medium text-sm px-6 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2 font-body whitespace-nowrap">
                            <span className="material-symbols-outlined text-lg">person_add</span>
                            Yeni Hasta Ekle
                        </button>
                    </div>
                    {/* Filter Bar */}
                    <div className="bg-surface border border-outline/50 rounded-xl p-2 mb-6 flex flex-col sm:flex-row gap-2 justify-between items-center shadow-sm">
                        <div className="flex gap-2 bg-surface-container-low p-1 rounded-lg w-full sm:w-auto items-center px-3 border border-outline/30">
                            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">sort</span>
                            <select 
                                className="bg-transparent border-none text-sm font-medium text-on-surface focus:ring-0 outline-none pr-8 cursor-pointer font-body py-1.5"
                                value={sortMode}
                                onChange={(e) => setSortMode(e.target.value)}
                            >
                                <option value="newest">Yeniden Eskiye (Son Eklenenler)</option>
                                <option value="oldest">Eskiden Yeniye</option>
                                <option value="az">A'dan Z'ye İsim</option>
                                <option value="za">Z'den A'ya İsim</option>
                            </select>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto px-2 sm:px-0">
                            {showSearch && (
                                <input 
                                    type="text" 
                                    placeholder="İsim veya TC No..." 
                                    className="px-3 py-1.5 text-sm rounded-lg border border-outline/50 bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 text-on-surface w-full sm:w-48 transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    autoFocus
                                />
                            )}
                            <button onClick={() => setShowSearch(!showSearch)} className={`p-2 rounded-lg transition-colors ${showSearch ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-container'}`} title="Ara / Filtrele">
                                <span className="material-symbols-outlined">search</span>
                            </button>
                        </div>
                    </div>
                    {/* Patient Table Card */}
                    <div className="bg-surface rounded-2xl shadow-sm border border-outline/50 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-surface-container-low/50 border-b border-outline/50">
                                        <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-headline">Hasta Adı</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-headline">TC / Kimlik No</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-headline">Raporlar</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-headline text-right">İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-outline/30 font-body text-sm">
                                    {displayedPatients.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="text-center py-8 text-on-surface-variant">Arama kriterlerine uygun hasta bulunamadı.</td>
                                        </tr>
                                    ) : (
                                        displayedPatients.map((hasta) => (
                                            <tr key={hasta.id} className="hover:bg-primary/5 transition-colors group cursor-pointer" onClick={() => hastaSec(hasta)}>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm border border-primary/20 uppercase">
                                                            {hasta.ad.charAt(0)}{hasta.soyad.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-on-surface">{hasta.ad} {hasta.soyad}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-on-surface-variant font-mono text-xs">{hasta.tc_no}</td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); hastaSec(hasta); }}
                                                        className="text-primary hover:text-blue-700 bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">folder_open</span>
                                                        Raporlar
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); navigate('/analysis', { state: { patientId: hasta.id } }); }}
                                                            className="text-emerald-700 hover:text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                                                            title="Bu hastaya yeni X-Ray analizi yap"
                                                        >
                                                            Yeni Analiz
                                                        </button>
                                                        <button
                                                            onClick={(e) => hastaSil(e, hasta)}
                                                            className="p-1.5 text-error bg-error/10 hover:bg-error/20 hover:text-red-700 rounded-lg transition-colors"
                                                            title="Hastayı Sil"
                                                        >
                                                            <span className="material-symbols-outlined text-xl">delete</span>
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
            ) : (
                // DEATIL VIEW (Inherited Bootstrap layout expanded to full width nicely)
                <Container className="py-4 fade-in">
                    <div className="d-flex align-items-center mb-4 pb-2 border-bottom">
                        <button onClick={handleBackToList} className="btn btn-light d-flex align-items-center gap-2 fw-bold text-primary shadow-sm border-0 me-3">
                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                            Listeye Dön
                        </button>
                        <div>
                            <h2 className="fw-bold mb-0 text-dark">Hasta Detayları</h2>
                            <small className="text-muted">Geçmiş analiz ve röntgen görüntüleri</small>
                        </div>
                    </div>

                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-white border-bottom-0 pt-4 px-4 pb-0">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <h3 className="fw-bold mb-1">{seciliHasta.ad} {seciliHasta.soyad}</h3>
                                    <div className="d-flex gap-2">
                                        <Badge bg="light" text="dark" className="border">Hasta ID: {seciliHasta.id}</Badge>
                                        <Badge bg="light" text="dark" className="border">TC: {seciliHasta.tc_no}</Badge>
                                    </div>
                                </div>
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={(e) => {
                                        hastaSil(e, seciliHasta);
                                    }}
                                >
                                    <Trash className="me-1" /> Hastayı Sil
                                </Button>
                            </div>
                            <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mt-4">
                                <Tab eventKey="gecmis" title={`📂 Geçmiş X-Ray Kayıtları (${gecmis.length})`} />
                                <Tab eventKey="detay" title="🔎 Analiz Görünümü" disabled={!analizSonucu} />
                            </Tabs>
                        </Card.Header>

                        <Card.Body className="p-4 bg-light">
                            {activeTab === "gecmis" && (
                                <div className="bg-white p-4 rounded shadow-sm">
                                    {gecmis.length > 0 ? (
                                        <Row className="g-3">
                                            {gecmis.map((item) => (
                                                <Col md={4} lg={3} key={item.id}>
                                                    <Card
                                                        className="h-100 border shadow-sm item-card-hover"
                                                        role="button"
                                                        onClick={() => gecmisDetayGoster(item)}
                                                    >
                                                        <div className="position-relative">
                                                            <Card.Img variant="top" src={`${API_URL}${item.resim_url}`} style={{ height: "160px", objectFit: "cover" }} />
                                                            <Button
                                                                variant="danger" size="sm"
                                                                className="position-absolute top-0 end-0 m-2"
                                                                onClick={(e) => rontgenSil(e, item.id)}
                                                            >
                                                                <Trash />
                                                            </Button>
                                                        </div>
                                                        <Card.Body>
                                                            <small className="text-primary fw-bold d-block mb-1">{item.tarih}</small>
                                                            <Card.Text className="small text-truncate text-dark text-opacity-75">
                                                                Yapay Zeka Analizi
                                                            </Card.Text>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            ))}
                                        </Row>
                                    ) : (
                                        <div className="text-center py-5">
                                            <span className="material-symbols-outlined text-muted" style={{fontSize: "3rem"}}>image_not_supported</span>
                                            <p className="text-muted mt-3">Bu hastaya ait analiz geçmişi bulunamadı.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === "detay" && analizSonucu && (
                                <div className="bg-white p-4 rounded shadow-sm">
                                    <Row className="g-4">
                                        <Col md={8}>
                                            <div className="border rounded overflow-hidden bg-dark w-100 d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
                                                <div className="position-relative" style={{ display: "inline-block" }}>
                                                    <img
                                                        ref={imgRef}
                                                        src={`${API_URL}${analizSonucu.resim_url}`}
                                                        className="img-fluid"
                                                        alt="Sonuç"
                                                        onLoad={handleImageLoad}
                                                        style={{ display: "block", maxHeight: "600px", maxWidth: "100%" }}
                                                    />
                                                    {renderBoxes()}
                                                </div>
                                            </div>
                                            <div className="mt-3 bg-light p-3 border rounded d-flex gap-2 align-items-center">
                                                <Form.Check
                                                    type="switch"
                                                    id="show-boxes"
                                                    label="Tüm Çizimleri Sürekli Göster (Hover olmadan)"
                                                    checked={showBoxes}
                                                    onChange={() => setShowBoxes(!showBoxes)}
                                                />
                                            </div>
                                        </Col>
                                        <Col md={4}>
                                            <Card className="h-100 bg-surface-container-low border border-outline">
                                                <Card.Body>
                                                    <h6 className="fw-bold text-dark border-bottom pb-2 mb-3 d-flex align-items-center gap-2">
                                                        <span className="material-symbols-outlined text-primary">analytics</span> 
                                                        Yapay Zeka Bulguları
                                                    </h6>
                                                    {analizSonucu.rapor.length > 0 ? (
                                                        <ListGroup>
                                                            {analizSonucu.rapor.map((r, i) => (
                                                                <ListGroup.Item
                                                                    key={i}
                                                                    variant="light"
                                                                    className={`border mb-2 rounded bg-white shadow-sm ${hoveredBox === i ? "border-primary text-primary" : "border-outline"}`}
                                                                    onMouseEnter={() => setHoveredBox(i)}
                                                                    onMouseLeave={() => setHoveredBox(null)}
                                                                    style={{ cursor: "pointer", transition: "all 0.2s" }}
                                                                >
                                                                    <div className="d-flex align-items-start gap-2">
                                                                        <span className="material-symbols-outlined text-warning" style={{fontSize:"18px"}}>warning</span>
                                                                        <span className="fw-semibold text-sm">{r}</span>
                                                                    </div>
                                                                </ListGroup.Item>
                                                            ))}
                                                        </ListGroup>
                                                    ) : (
                                                        <p className="text-muted text-sm border p-3 rounded bg-white text-center">Bulgu tespit edilmedi veya rapor okunamıyor.</p>
                                                    )}
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Container>
            )}

            {/* Yeni Hasta Ekle Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-6 border-b border-outline/50 flex justify-between items-center bg-surface-container-low">
                            <h3 className="text-xl font-bold font-headline text-on-surface">Yeni Hasta Ekle</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-on-surface-variant hover:text-on-surface transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleCreatePatient} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-on-surface-variant mb-1">Ad</label>
                                <input type="text" required
                                    className="w-full px-4 py-2 border border-outline rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body bg-surface text-on-surface"
                                    value={yeniHasta.ad} onChange={e => setYeniHasta({...yeniHasta, ad: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-on-surface-variant mb-1">Soyad</label>
                                <input type="text" required
                                    className="w-full px-4 py-2 border border-outline rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body bg-surface text-on-surface"
                                    value={yeniHasta.soyad} onChange={e => setYeniHasta({...yeniHasta, soyad: e.target.value})}
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
                                    value={yeniHasta.tc_no} 
                                    onChange={e => setYeniHasta({...yeniHasta, tc_no: e.target.value.replace(/\D/g, '')})}
                                />
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 bg-surface-container hover:bg-surface-container-high text-on-surface font-medium rounded-xl transition-colors">
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

export default Patients;
