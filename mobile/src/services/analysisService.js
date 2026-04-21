import api from '../api/axiosConfig';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

export const pickDocument = async () => {
    try {
        const result = await DocumentPicker.getDocumentAsync({
            type: 'image/*', // Sadece resim dosyaları
            copyToCacheDirectory: true,
        });

        if (result.assets && result.assets.length > 0) {
            return result.assets[0].uri;
        } else if (result.type === 'success') { // Older versions
            return result.uri;
        }
        return null;
    } catch (err) {
        console.log("Belge seçimi hatası:", err);
        return null;
    }
};

export const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
        alert('Galeri izni gerekiyor!');
        return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
    });

    if (!result.canceled) {
        return result.assets[0].uri;
    }
    return null;
};

export const uploadXray = async (hastaId, imageUri) => {
    const formData = new FormData();
    // React Native'de dosya gönderimi için uri, name, type gerekli
    const filename = imageUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;

    formData.append('file', { uri: imageUri, name: filename, type });

    // Content-Type multipart/form-data otomatik set edilmeli ama bazen explicit gerekebilir
    // Axios usually handles this if data is FormData
    const response = await api.post(`/analysis/analiz_et/${hastaId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};
