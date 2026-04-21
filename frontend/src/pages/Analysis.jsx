import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { analyzeImage, getPatients, createPatient, api } from '../api';
import toast from 'react-hot-toast';

const Analysis = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    // Support pre-selecting patient via URL or navigation state
    const initialPatientId = queryParams.get('patientId') || location.state?.patientId;

    const [selectedPatient, setSelectedPatient] = useState(null);
    const [patients, setPatients] = useState([]);
    const [showPatientSelect, setShowPatientSelect] = useState(!initialPatientId);

    // New Patient Form State
    const [showNewPatientForm, setShowNewPatientForm] = useState(false);
    const [newPatientv, setNewPatientv] = useState({ ad: '', soyad: '', tc_no: '' });

    const [imageSrc, setImageSrc] = useState(null);
    const [findings, setFindings] = useState([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [loadingPatients, setLoadingPatients] = useState(false);

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
        loadPatients();
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

    if (showPatientSelect) {
        return (
            <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center justify-center p-4 font-display">
                <div className="w-full max-w-2xl bg-white dark:bg-surface-dark rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Select Patient</h2>
                            <p className="text-sm text-slate-500">Choose a patient to start a new analysis</p>
                        </div>
                        <button
                            onClick={() => setShowNewPatientForm(!showNewPatientForm)}
                            className="text-sm font-semibold text-primary hover:text-blue-700 transition"
                        >
                            {showNewPatientForm ? "Cancel" : "+ New Patient"}
                        </button>
                    </div>

                    <div className="p-6 max-h-[60vh] overflow-y-auto">
                        {showNewPatientForm ? (
                            <form onSubmit={handleCreatePatient} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">First Name</label>
                                    <input
                                        type="text" required
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                                        value={newPatientv.ad}
                                        onChange={e => setNewPatientv({ ...newPatientv, ad: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Last Name</label>
                                    <input
                                        type="text" required
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                                        value={newPatientv.soyad}
                                        onChange={e => setNewPatientv({ ...newPatientv, soyad: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">TC ID Number</label>
                                    <input
                                        type="text" required
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                                        value={newPatientv.tc_no}
                                        onChange={e => setNewPatientv({ ...newPatientv, tc_no: e.target.value })}
                                    />
                                </div>
                                <button className="w-full bg-primary text-white py-2.5 rounded-lg font-bold hover:bg-blue-600 transition shadow-lg shadow-blue-500/30">
                                    Create Patient
                                </button>
                            </form>
                        ) : (
                            <div className="grid grid-cols-1 gap-3">
                                {loadingPatients ? (
                                    <p className="text-center text-slate-500 py-4">Loading patients...</p>
                                ) : patients.length === 0 ? (
                                    <p className="text-center text-slate-500 py-4">No patients found. Create one to continue.</p>
                                ) : (
                                    patients.map(p => (
                                        <button
                                            key={p.id}
                                            onClick={() => handlePatientSelect(p)}
                                            className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary hover:bg-primary/5 transition group text-left"
                                        >
                                            <div>
                                                <h3 className="font-bold text-slate-800 dark:text-white group-hover:text-primary">{p.ad} {p.soyad}</h3>
                                                <span className="text-xs font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">ID: {p.tc_no}</span>
                                            </div>
                                            <span className="material-symbols-outlined text-slate-300 group-hover:text-primary">arrow_forward_ios</span>
                                        </button>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-center">
                        <button onClick={() => navigate('/')} className="text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">Cancel & Return to Dashboard</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display flex flex-col h-screen overflow-hidden">
            {/* Top Navigation */}
            <header className="shrink-0 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-dark px-6 py-3 z-20">
                <div className="flex items-center gap-4">
                    <div className="size-8 text-primary flex items-center justify-center bg-primary/10 rounded-lg">
                        <span className="material-symbols-outlined text-2xl">dentistry</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">DentalAI Pro</h1>
                        {selectedPatient && (
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <span className="font-medium text-slate-700 dark:text-slate-300">Patient: {selectedPatient.ad} {selectedPatient.soyad}</span>
                                <button onClick={handleChangePatient} className="text-primary hover:underline">(Change)</button>
                            </div>
                        )}
                    </div>
                </div>
                <nav className="hidden md:flex items-center gap-8">
                    <a className="text-slate-500 hover:text-primary text-sm font-medium transition-colors" href="/">Dashboard</a>
                    <a className="text-slate-500 hover:text-primary text-sm font-medium transition-colors" href="/patients">Patients</a>
                    <a className="text-slate-500 hover:text-primary text-sm font-medium transition-colors" href="/reports">Reports</a>
                </nav>
                <div className="flex items-center gap-4">
                    <label className="cursor-pointer bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95">
                        <span className="material-symbols-outlined text-[20px]">upload_file</span>
                        {findings.length > 0 ? "Upload Another X-Ray" : "Upload X-Ray"}
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
                                                <p className="text-white font-bold text-lg">Analyzing X-Ray...</p>
                                                <p className="text-slate-400 text-sm">Detecting anomalies</p>
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
                                    <p className="text-lg font-medium text-slate-400">Ready for Analysis</p>
                                    <p className="text-sm opacity-60 max-w-xs mx-auto mt-1">
                                        Upload a dental X-Ray image to detect caries, cysts, and other anomalies automatically.
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
                                AI Findings
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">{findings.length} anomalies detected</p>
                        </div>
                        {findings.length > 0 && <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-bold border border-green-200">Done</span>}
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {findings.length === 0 && !isAnalyzing ? (
                            <div className="flex flex-col items-center justify-center h-48 text-center px-4">
                                <span className="material-symbols-outlined text-4xl text-slate-200 mb-2">content_paste_off</span>
                                <p className="text-sm text-slate-400">No findings to display yet.</p>
                                <p className="text-xs text-slate-500 mt-1">Upload an image to see results.</p>
                            </div>
                        ) : (
                            findings.map((finding, index) => (
                                <FindingCard
                                    key={index}
                                    color={finding.class.toLowerCase().includes('caries') ? 'rose' : 'amber'}
                                    type={finding.class}
                                    tooth="Unknown"
                                    description={`Confidence: ${finding.confidence}%`}
                                    confidence={`${finding.confidence}%`}
                                />
                            ))
                        )}
                    </div>
                    {findings.length > 0 && (
                        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                            <button onClick={() => navigate('/patients')} className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-sm font-bold text-slate-600 dark:text-slate-300 transition-colors">
                                <span className="material-symbols-outlined">save</span>
                                Save & View in History
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
