import React, { useContext, useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { COLORS } from '../theme/colors';

const RegisterScreen = ({ navigation }) => {
    const [ad, setAd] = useState('');
    const [soyad, setSoyad] = useState('');
    const [tcNo, setTcNo] = useState('');
    const [password, setPassword] = useState('');
    const { register, isLoading } = useContext(AuthContext);

    const validatePassword = (pass) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
        return regex.test(pass);
    };

    const handleRegister = async () => {
        if (!ad || !soyad || !tcNo || !password) {
            Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
            return;
        }

        if (!validatePassword(password)) {
            Alert.alert('Hata', 'Şifre en az 6 karakter olmalı, en az 1 büyük harf, 1 küçük harf ve 1 rakam içermelidir.');
            return;
        }

        try {
            await register(ad, soyad, tcNo, password);
            Alert.alert('Başarılı', 'Kayıt oluşturuldu. Giriş yapabilirsiniz.', [
                { text: 'Tamam', onPress: () => navigation.navigate('Login') }
            ]);
        } catch (e) {
            Alert.alert('Kayıt Başarısız', 'Bir hata oluştu. TC No zaten kayıtlı olabilir.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                <View style={styles.header}>
                    <Text style={styles.title}>Hesap Oluştur</Text>
                    <Text style={styles.subtitle}>Sistemi kullanmak için kayıt olun</Text>
                </View>

                <View style={styles.form}>
                    <Input
                        label="Ad"
                        value={ad}
                        onChangeText={setAd}
                        placeholder="Adınız"
                        icon="person"
                    />
                    <Input
                        label="Soyad"
                        value={soyad}
                        onChangeText={setSoyad}
                        placeholder="Soyadınız"
                        icon="person-outline"
                    />
                    <Input
                        label="TC Kimlik No"
                        value={tcNo}
                        onChangeText={setTcNo}
                        placeholder="12345678901"
                        keyboardType="numeric"
                        maxLength={11}
                        icon="badge"
                    />
                    <Input
                        label="Şifre"
                        value={password}
                        onChangeText={setPassword}
                        placeholder="********"
                        secureTextEntry
                        icon="lock"
                    />

                    <View style={styles.buttonContainer}>
                        <Button
                            title="Kayıt Ol"
                            onPress={handleRegister}
                            isLoading={isLoading}
                            variant="primary"
                        />
                    </View>

                    <View style={styles.loginLinkContainer}>
                        <Text style={styles.loginText}>Zaten hesabınız var mı? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.loginLink}>Giriş Yap</Text>
                        </TouchableOpacity>
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
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        // justifyContent: 'center', // Removed to prevent jumping
        paddingHorizontal: 24,
        paddingVertical: 32,
        paddingTop: 60, // Added explicit top padding instead
    },
    header: {
        marginBottom: 32,
    },
    title: {
        fontSize: 32,
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
        marginBottom: 16,
    },
    loginLinkContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
    },
    loginText: {
        color: COLORS.slate500,
        fontSize: 14,
    },
    loginLink: {
        color: COLORS.primary,
        fontWeight: '700',
        fontSize: 14,
    }
});

export default RegisterScreen;
