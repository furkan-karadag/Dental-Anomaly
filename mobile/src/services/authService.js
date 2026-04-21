import api from '../api/axiosConfig';

export const login = async (tc_no, password) => {
    const formData = new FormData();
    formData.append('username', tc_no);
    formData.append('password', password);

    try {
        console.log(`Sending login request to ${api.defaults.baseURL}/auth/token`);
        const response = await api.post('/auth/token', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log("Login success", response.data);
        return response.data;
    } catch (error) {
        console.error("Login Error:", error.message);
        if (error.response) {
            console.error("Server Data:", error.response.data);
            console.error("Server Status:", error.response.status);
        }
        throw error;
    }
};

export const register = async (ad, soyad, tc_no, password) => {
    const formData = new FormData();
    formData.append('ad', ad);
    formData.append('soyad', soyad);
    formData.append('tc_no', tc_no);
    formData.append('password', password);

    const response = await api.post('/auth/kayit', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const getMe = async () => {
    const response = await api.get('/users/me');
    return response.data;
};
