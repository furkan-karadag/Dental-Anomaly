import api from '../api/axiosConfig';

// Service for handling Patient operations

export const getPatients = async () => {
    const response = await api.get('/patients/hastalar');
    return response.data; // { hastalar: [] }
};

export const addPatient = async (ad, soyad, tc_no) => {
    const formData = new FormData();
    formData.append('ad', ad);
    formData.append('soyad', soyad);
    formData.append('tc_no', tc_no);

    const response = await api.post('/patients/hasta_ekle', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const getPatientHistory = async (hastaId) => {
    const response = await api.get(`/patients/gecmis/${hastaId}`);
    return response.data; // { hasta_id, gecmis: [] }
};

export const getDashboardStats = async () => {
    try {
        const response = await api.get('/stats/dashboard');
        return response.data;
    } catch (error) {
        console.error("Error getting stats:", error);
        throw error;
    }
};

export const deletePatient = async (hastaId) => {
    const response = await api.delete(`/patients/hasta_sil/${hastaId}`);
    return response.data;
};

export const deleteAnalysis = async (rontgenId) => {
    const response = await api.delete(`/patients/rontgen_sil/${rontgenId}`);
    return response.data;
};
