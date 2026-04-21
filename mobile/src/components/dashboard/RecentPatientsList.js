import React from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';

const RecentPatientsList = ({ patients, loading, navigation, getStatusStyle }) => {
    return (
        <View style={styles.listSection}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Patients</Text>
                <TouchableOpacity>
                    <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.listContainer}>
                {loading ? (
                    <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
                ) : (
                    patients.slice(0, 5).map((patient, index) => {
                        // Use real status from backend, fallback to 'routine'
                        const statusStr = patient.status || 'Routine Checkup';
                        const statusConfig = getStatusStyle(statusStr);

                        return (
                            <TouchableOpacity
                                key={patient.id || index}
                                style={[styles.patientCard]}
                                onPress={() => navigation.navigate('PatientDetail', { patientId: patient.id, item: patient })}
                            >
                                <Image
                                    source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBH9U6iCmmu7CJCpVq4P9mndqtPP0bigfRbPfXSu3478Rm6GQXMKzWFeFs4ZFAOEZRpWeKwaEVTZBl0iTW_blr0hW6Ov-4amTP0cjfEq3cyA0dmW6KHdA2DQ9FMKd2ZGXoO50RuXgLXAHcjx3pS7MYxSmAIbTTs-Ook0EM1LWlHsiTFB2NA8WaHfAbB8tAcyAsGCZQtiyyp5WcR7Jw98Q1Gv9NHUryJGw93YD2XxqbtyAwJPj_cZ912ET-aBl7cmzbG0K223svakA" }} // Placeholder
                                    style={styles.patientAvatar}
                                />

                                <View style={styles.patientInfo}>
                                    <View style={styles.patientHeader}>
                                        <Text style={styles.patientName}>{patient.ad} {patient.soyad}</Text>
                                        <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
                                            <MaterialIcons name={statusConfig.icon} size={10} color={statusConfig.text} />
                                            <Text style={[styles.statusText, { color: statusConfig.text }]}>
                                                {statusConfig.label}
                                            </Text>
                                        </View>
                                    </View>
                                    <Text style={styles.lastVisit}>
                                        {patient.son_tarih ? `Last Scan: ${patient.son_tarih}` : 'No records yet'}
                                    </Text>
                                    <Text style={styles.patientId}>
                                        ID: #{patient.id} • {statusConfig.label}
                                    </Text>
                                </View>

                                <MaterialIcons name="chevron-right" size={24} color={COLORS.slate400} />
                            </TouchableOpacity>
                        );
                    })
                )}
                {!loading && patients.length === 0 && (
                    <View style={{ alignItems: 'center', marginTop: 20 }}>
                        <Text style={{ color: COLORS.slate500 }}>No patients found.</Text>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    listSection: {
        flex: 1,
        paddingHorizontal: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.slate900,
    },
    viewAllText: {
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.primary,
    },
    listContainer: {
        gap: 12,
    },
    patientCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.slate100,
        gap: 16,
        position: 'relative',
        overflow: 'hidden',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.02,
        shadowRadius: 2,
        elevation: 1,
    },
    activeCardBorder: {
        // borderColor: 'rgba(19, 109, 236, 0.5)', // visually
    },
    loadingBarContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 4,
        backgroundColor: "rgba(19, 109, 236, 0.2)",
    },
    loadingBar: {
        height: '100%',
        width: '30%',
        backgroundColor: COLORS.primary,
    },
    patientAvatar: {
        width: 56,
        height: 56,
        borderRadius: 12,
        backgroundColor: COLORS.slate100,
    },
    patientInfo: {
        flex: 1,
    },
    patientHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    patientName: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.slate900,
        flexShrink: 1,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 99,
        gap: 4,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '600',
    },
    lastVisit: {
        fontSize: 12,
        color: COLORS.slate500,
        marginBottom: 4,
    },
    patientId: {
        fontSize: 12,
        fontWeight: '500',
        color: COLORS.slate400,
    },
});

export default RecentPatientsList;
