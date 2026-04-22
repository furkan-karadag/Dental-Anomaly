import axios from "axios";

const api = axios.create({
    baseURL: `http://${window.location.hostname}:8000`,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const getPatients = async () => {
    const response = await api.get("/patients/hastalar");
    return response.data;
};

export const getPatientHistory = async (id) => {
    const response = await api.get(`/patients/gecmis/${id}`);
    return response.data;
};

export const getTumAnalizler = async () => {
    const response = await api.get("/analysis/tum_analizler");
    return response.data;
};

export const analyzeImage = async (hastaId, formData) => {
    const response = await api.post(`/analysis/analiz_et/${hastaId}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const createPatient = async (formData) => {
    const response = await api.post("/patients/hasta_ekle", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const getDashboardStats = async () => {
    const response = await api.get("/stats/dashboard");
    return response.data;
};

export const getMe = async () => {
    const response = await api.get("/users/me");
    return response.data;
};

export { api };
export default api;
