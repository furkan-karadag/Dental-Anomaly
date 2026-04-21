import React, { useEffect, useState } from 'react';
import { SafeAreaView, Alert, StyleSheet, StatusBar } from 'react-native';
import { getPatientHistory, deletePatient, deleteAnalysis } from '../services/patientService';
import { pickImage, pickDocument, uploadXray } from '../services/analysisService';
import { COLORS } from '../theme/colors';

// New Components
import PatientHeader from '../components/patient/PatientHeader';
import AnalysisHistoryList from '../components/patient/AnalysisHistoryList';

const PatientDetailScreen = ({ route, navigation }) => {
    const { patientId, item } = route.params;
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [analyzing, setAnalyzing] = useState(false);

    useEffect(() => {
        fetchHistory();
    }, [patientId]);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const data = await getPatientHistory(patientId);
            if (data && data.gecmis) {
                setHistory(data.gecmis);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePatient = () => {
        Alert.alert(
            "Hastayı Sil",
            `${item?.ad} ${item?.soyad} adlı hastayı silmek istediğinize emin misiniz? Tüm analiz kayıtları da silinecektir.`,
            [
                { text: "İptal", style: "cancel" },
                {
                    text: "Sil",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deletePatient(patientId);
                            Alert.alert("Başarılı", "Hasta silindi.");
                            navigation.goBack();
                        } catch (error) {
                            Alert.alert("Hata", "Hasta silinirken bir sorun oluştu.");
                            console.error(error);
                        }
                    }
                }
            ]
        );
    };

    const handleDeleteAnalysis = (rontgenId) => {
        Alert.alert(
            "Analizi Sil",
            "Bu analiz kaydını silmek istediğinize emin misiniz?",
            [
                { text: "İptal", style: "cancel" },
                {
                    text: "Sil",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteAnalysis(rontgenId);
                            Alert.alert("Başarılı", "Analiz silindi.");
                            fetchHistory();
                        } catch (error) {
                            Alert.alert("Hata", "Analiz silinirken bir sorun oluştu.");
                            console.error(error);
                        }
                    }
                }
            ]
        );
    };

    const handleNewAnalysis = () => {
        Alert.alert(
            "Fotoğraf Yükle",
            "Lütfen görselin kaynağını seçin:",
            [
                { text: "İptal", style: "cancel" },
                { text: "📁 Dosyalardan Seç", onPress: async () => await processAnalysis(pickDocument) },
                { text: "📷 Galeriden Seç", onPress: async () => await processAnalysis(pickImage) }
            ]
        );
    };

    const processAnalysis = async (pickerFunction) => {
        try {
            const uri = await pickerFunction();
            if (!uri) return;

            setAnalyzing(true);
            Alert.alert("Analiz Başlıyor", "Fotoğraf yükleniyor ve analiz ediliyor, lütfen bekleyin...");

            const result = await uploadXray(patientId, uri);

            if (result.durum === "Analiz Tamamlandı") {
                Alert.alert("Başarılı", "Analiz tamamlandı!");
                fetchHistory();
            } else {
                Alert.alert("Hata", result.hata || "Analiz sırasında bir hata oluştu.");
            }

        } catch (error) {
            Alert.alert("Hata", "Bir sorun oluştu.");
            console.error(error);
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.backgroundLight} />

            <PatientHeader
                patient={item}
                onBack={() => navigation.goBack()}
                onDelete={handleDeletePatient}
            />

            <AnalysisHistoryList
                history={history}
                loading={loading}
                patientName={`${item?.ad} ${item?.soyad}`}
                navigation={navigation}
                onNewAnalysis={handleNewAnalysis}
                isAnalyzing={analyzing}
                onDeleteAnalysis={handleDeleteAnalysis}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.backgroundLight,
    },
});

export default PatientDetailScreen;
