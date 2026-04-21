import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f7f8', // background-light
    },
    gradientBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '50%',
    },
    blob1: {
        position: 'absolute',
        top: -160,
        right: -160,
        width: 384, // 96 * 4
        height: 384,
        backgroundColor: 'rgba(19, 109, 236, 0.2)', // primary/20
        borderRadius: 999,
    },
    blob2: {
        position: 'absolute',
        top: '50%',
        left: -80,
        width: 256,
        height: 256,
        backgroundColor: 'rgba(59, 130, 246, 0.1)', // blue-500/10
        borderRadius: 999,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 40,
        gap: 24,
    },
    logoWrapper: {
        position: 'relative',
    },
    logoBlur: {
        position: 'absolute',
        inset: 0,
        backgroundColor: '#136dec',
        opacity: 0.4,
        borderRadius: 999,
        transform: [{ scale: 1.1 }],
    },
    logoContainer: {
        width: 96, // 24 * 4
        height: 96,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#136dec',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    titleContainer: {
        alignItems: 'center',
    },
    appTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#0f172a', // slate-900
        letterSpacing: -0.5,
    },
    welcomeText: {
        fontSize: 18,
        color: '#64748b', // slate-500
        fontWeight: '500',
        marginTop: 8,
    },
    formContainer: {
        width: '100%',
        maxWidth: 400,
        gap: 20,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#334155', // slate-700
        marginLeft: 4,
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#e2e8f0', // slate-200
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#0f172a',
    },
    forgotPassword: {
        fontSize: 14,
        fontWeight: '500',
        color: '#136dec', // primary
    },
    buttonContainer: {
        marginTop: 16,
        gap: 16,
    },
    loginButton: {
        backgroundColor: '#136dec',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        shadowColor: '#136dec',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
    },
    loginButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
    biometricButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
    },
    footer: {
        marginTop: 40,
        alignItems: 'center',
        gap: 24,
        paddingBottom: 20,
    },
    footerText: {
        fontSize: 14,
        color: '#64748b',
    },
    registerLink: {
        color: '#136dec',
        fontWeight: 'bold',
        fontSize: 14,
    },
    poweredBy: {
        flexDirection: 'row',
        alignItems: 'center',
        opacity: 0.5,
    },
    poweredByText: {
        fontSize: 10,
        color: '#64748b',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
});

export default styles;
