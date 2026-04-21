import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';

const StatsSection = ({ stats }) => {
    const { total_patients = 0, pending_ai = 0, done_today = 0 } = stats || {};

    return (
        <View style={styles.statsContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsScroll}>
                {/* Total Patients */}
                <View style={styles.statCard}>
                    <View style={[styles.iconBox, { backgroundColor: COLORS.blue100 }]}>
                        <MaterialIcons name="groups" size={20} color={COLORS.blue700} />
                    </View>
                    <Text style={styles.statLabel}>Total Patients</Text>
                    <Text style={styles.statValue}>{total_patients}</Text>
                    <View style={styles.trendBox}>
                        <MaterialIcons name="trending-up" size={16} color={COLORS.green500} />
                        <Text style={styles.trendText}>Active</Text>
                    </View>
                </View>

                {/* Pending AI */}
                <View style={[styles.statCard, styles.statCardPrimary]}>
                    <View style={styles.glowEffect} />
                    <View style={[styles.iconBox, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
                        <MaterialIcons name="auto-awesome" size={20} color={COLORS.white} />
                    </View>
                    <Text style={[styles.statLabel, { color: "rgba(255,255,255,0.8)" }]}>Issues Found</Text>
                    <Text style={[styles.statValue, { color: COLORS.white }]}>{pending_ai}</Text>
                    <Text style={[styles.trendText, { color: "rgba(255,255,255,0.8)", marginTop: 4 }]}>Requires review</Text>
                </View>

                {/* Done Today */}
                <View style={styles.statCard}>
                    <View style={[styles.iconBox, { backgroundColor: COLORS.green100 }]}>
                        <MaterialIcons name="check-circle" size={20} color={COLORS.green700} />
                    </View>
                    <Text style={styles.statLabel}>Today's Scans</Text>
                    <Text style={styles.statValue}>{done_today}</Text>
                    <Text style={[styles.trendText, { color: COLORS.slate400 }]}>Processed</Text>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    statsContainer: {
        paddingVertical: 24,
    },
    statsScroll: {
        paddingHorizontal: 24,
        gap: 16,
    },
    statCard: {
        minWidth: 140,
        backgroundColor: COLORS.white,
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.slate100,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.02,
        shadowRadius: 2,
        elevation: 1,
        flexDirection: 'column',
        gap: 12,
    },
    statCardPrimary: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
        overflow: 'hidden',
        position: 'relative',
    },
    glowEffect: {
        position: 'absolute',
        right: -16,
        top: -16,
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: "rgba(255,255,255,0.1)",
    },
    iconBox: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.slate500,
    },
    statValue: {
        fontSize: 30,
        fontWeight: '700',
        color: COLORS.slate900,
        includeFontPadding: false,
    },
    trendBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    trendText: {
        fontSize: 12,
        color: COLORS.green500,
        marginLeft: 2,
    },
});

export default StatsSection;
