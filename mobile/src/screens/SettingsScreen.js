import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { COLORS } from '../theme/colors';

const SettingsScreen = ({ navigation }) => {
    const { userInfo, updateUserInfo, logout } = useContext(AuthContext);

    const [ad, setAd] = useState(userInfo?.ad || '');
    const [soyad, setSoyad] = useState(userInfo?.soyad || '');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!ad.trim() || !soyad.trim()) {
            Alert.alert("Hata", "Ad ve Soyad boş bırakılamaz.");
            return;
        }

        setLoading(true);
        try {
            await updateUserInfo({ ad: ad.trim(), soyad: soyad.trim() });
            Alert.alert("Başarılı", "Profil bilgileriniz güncellendi.");
            navigation.goBack();
        } catch (error) {
            Alert.alert("Hata", "Profil güncellenirken bir sorun oluştu.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        Alert.alert(
            "Çıkış Yap",
            "Hesabınızdan çıkış yapmak istediğinize emin misiniz?",
            [
                { text: "İptal", style: "cancel" },
                { text: "Çıkış Yap", style: "destructive", onPress: logout }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back-ios" size={20} color={COLORS.slate900} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Ayarlar</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Profil Bilgileri</Text>
                    
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Ad</Text>
                        <TextInput
                            style={styles.input}
                            value={ad}
                            onChangeText={setAd}
                            placeholder="Adınız"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Soyad</Text>
                        <TextInput
                            style={styles.input}
                            value={soyad}
                            onChangeText={setSoyad}
                            placeholder="Soyadınız"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>TC Kimlik Numarası (Değiştirilemez)</Text>
                        <TextInput
                            style={[styles.input, styles.disabledInput]}
                            value={userInfo?.tc_no?.toString() || ''}
                            editable={false}
                        />
                    </View>

                    <TouchableOpacity 
                        style={styles.saveButton} 
                        onPress={handleSave}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color={COLORS.white} />
                        ) : (
                            <Text style={styles.saveButtonText}>Değişiklikleri Kaydet</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <MaterialIcons name="logout" size={20} color={COLORS.red700} />
                        <Text style={styles.logoutText}>Çıkış Yap</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.backgroundLight,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.slate100,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.slate900,
    },
    content: {
        padding: 20,
    },
    section: {
        backgroundColor: COLORS.white,
        padding: 20,
        borderRadius: 16,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.slate900,
        marginBottom: 20,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.slate500,
        marginBottom: 8,
    },
    input: {
        backgroundColor: COLORS.slate50,
        borderWidth: 1,
        borderColor: COLORS.slate200,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: COLORS.slate900,
    },
    disabledInput: {
        backgroundColor: COLORS.slate100,
        color: COLORS.slate500,
    },
    saveButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 8,
    },
    saveButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        backgroundColor: COLORS.red50,
        borderRadius: 12,
        gap: 8,
    },
    logoutText: {
        color: COLORS.red700,
        fontSize: 16,
        fontWeight: '600',
    },
});

export default SettingsScreen;
