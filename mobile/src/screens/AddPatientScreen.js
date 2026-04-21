import React, { useState } from 'react';
import { View, Text, SafeAreaView, Alert, ScrollView, StyleSheet, StatusBar } from 'react-native';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { addPatient } from '../services/patientService';
import { COLORS } from '../theme/colors';

const AddPatientScreen = ({ navigation }) => {
    const [ad, setAd] = useState('');
    const [soyad, setSoyad] = useState('');
    const [tcNo, setTcNo] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!ad || !soyad || !tcNo) {
            Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
            return;
        }

        try {
            setLoading(true);
            const result = await addPatient(ad, soyad, tcNo);
            Alert.alert('Başarılı', 'Hasta başarıyla eklendi.', [
                {
                    text: 'Tamam',
                    onPress: () => {
                        // Navigate directly to the new patient's detail page with correct ID
                        navigation.replace('PatientDetail', {
                            patientId: result.hasta_id,
                            item: { id: result.hasta_id, ad, soyad, tc_no: tcNo }
                        });
                    }
                }
            ]);
        } catch (error) {
            Alert.alert('Hata', 'Hasta eklenirken bir sorun oluştu.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>Yeni Hasta Ekle</Text>
                    <Text style={styles.subtitle}>Hasta bilgilerini giriniz</Text>
                </View>

                <View style={styles.form}>
                    <Input
                        label="Ad"
                        value={ad}
                        onChangeText={setAd}
                        placeholder="Hasta Adı"
                        icon="person"
                    />
                    <Input
                        label="Soyad"
                        value={soyad}
                        onChangeText={setSoyad}
                        placeholder="Hasta Soyadı"
                        icon="person-outline"
                    />
                    <Input
                        label="TC Kimlik No"
                        value={tcNo}
                        onChangeText={setTcNo}
                        placeholder="11 Haneli TC No"
                        keyboardType="numeric"
                        maxLength={11}
                        icon="badge"
                    />

                    <View style={styles.buttonContainer}>
                        <Button
                            title="Kaydet"
                            onPress={handleSave}
                            isLoading={loading}
                            variant="primary"
                            icon="save"
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    content: {
        padding: 24,
    },
    header: {
        marginBottom: 32,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.slate900,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.slate500,
    },
    form: {
        gap: 8,
    },
    buttonContainer: {
        marginTop: 24,
    }
});

export default AddPatientScreen;
