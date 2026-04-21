import React, { useContext, useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../theme/colors';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const { width } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
    const [tcNo, setTcNo] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoading } = useContext(AuthContext);

    const handleLogin = async () => {
        if (!tcNo || !password) {
            Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
            return;
        }
        try {
            await login(tcNo, password);
        } catch (e) {
            Alert.alert('Giriş Başarısız', 'TC Kimlik No veya şifre hatalı.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />

            {/* Background Effects */}
            <LinearGradient
                colors={['rgba(19, 109, 236, 0.1)', 'transparent']}
                style={styles.gradientBackground}
            />
            <View style={styles.blob1} />
            <View style={styles.blob2} />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header */}
                <View style={styles.headerContainer}>
                    <View style={styles.logoWrapper}>
                        <View style={styles.logoBlur} />
                        <LinearGradient
                            colors={[COLORS.primary, '#2563eb']}
                            style={styles.logoContainer}
                        >
                            <MaterialIcons name="medical-services" size={48} color={COLORS.white} />
                        </LinearGradient>
                    </View>
                    <View style={styles.titleContainer}>
                        <Text style={styles.appTitle}>DentalAI Lens</Text>
                        <Text style={styles.welcomeText}>Hoşgeldiniz, Doktor.</Text>
                    </View>
                </View>

                {/* Form */}
                <View style={styles.formContainer}>
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
                        placeholder="Şifrenizi girin"
                        secureTextEntry
                        icon="lock"
                    />

                    <TouchableOpacity style={styles.forgotPasswordContainer}>
                        <Text style={styles.forgotPasswordText}>Şifremi Unuttum?</Text>
                    </TouchableOpacity>

                    <View style={styles.buttonWrapper}>
                        <Button
                            title="Güvenli Giriş"
                            onPress={handleLogin}
                            isLoading={isLoading}
                            icon="login"
                        />
                    </View>

                    <View style={styles.biometricContainer}>
                        <TouchableOpacity style={styles.biometricButton}>
                            <MaterialIcons name="face" size={32} color={COLORS.slate500} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Hesabınız yok mu? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                        <Text style={styles.registerLink}>Kayıt Ol</Text>
                    </TouchableOpacity>
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
    gradientBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 300,
    },
    blob1: {
        position: 'absolute',
        top: -100,
        right: -100,
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: 'rgba(19, 109, 236, 0.05)',
    },
    blob2: {
        position: 'absolute',
        top: 100,
        left: -150,
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: 'rgba(19, 109, 236, 0.05)',
    },
    keyboardView: {
        flex: 1,
        zIndex: 10,
    },
    scrollContent: {
        flexGrow: 1,
        // justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 32,
        paddingTop: 80,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 48,
    },
    logoWrapper: {
        position: 'relative',
        marginBottom: 24,
    },
    logoBlur: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: COLORS.primary,
        opacity: 0.3,
        borderRadius: 30,
        transform: [{ scale: 1.2 }],
        zIndex: -1,
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    titleContainer: {
        alignItems: 'center',
    },
    appTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: COLORS.slate900,
        letterSpacing: -0.5,
        marginBottom: 8,
    },
    welcomeText: {
        fontSize: 16,
        color: COLORS.slate500,
        fontWeight: '500',
    },
    formContainer: {
        marginBottom: 32,
    },
    forgotPasswordContainer: {
        alignSelf: 'flex-end',
        marginBottom: 24,
        marginTop: -8,
    },
    forgotPasswordText: {
        color: COLORS.primary,
        fontWeight: '600',
        fontSize: 14,
    },
    buttonWrapper: {
        marginBottom: 24,
    },
    biometricContainer: {
        alignItems: 'center',
    },
    biometricButton: {
        padding: 12,
        borderRadius: 16,
        backgroundColor: COLORS.backgroundLight,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        color: COLORS.slate500,
        fontSize: 14,
    },
    registerLink: {
        color: COLORS.primary,
        fontWeight: '700',
        fontSize: 14,
    }
});

export default LoginScreen;
