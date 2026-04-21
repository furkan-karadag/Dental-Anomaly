import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import { styles } from '../../screens/AnalysisDetailScreen.styles';

const AnalysisStats = ({ detections }) => {
    // Process detections or use empty array
    const realDetections = detections || [];

    const issueCount = realDetections.filter(d => !d.class.toLowerCase().includes('healthy')).length;
    const avgConfidence = realDetections.length > 0
        ? Math.round(realDetections.reduce((acc, curr) => acc + curr.confidence, 0) / realDetections.length)
        : 0;

    return (
        <View style={styles.statsGrid}>
            <View style={styles.statCard}>
                <Text style={styles.statLabel}>OBSERVATIONS</Text>
                <View style={styles.statRow}>
                    <Text style={styles.statLarge}>{issueCount.toString().padStart(2, '0')}</Text>
                    <View style={[styles.statIcon, { backgroundColor: COLORS.orange50 }]}>
                        <MaterialIcons name="priority-high" size={20} color={COLORS.abscessOrange} />
                    </View>
                </View>
            </View>
            <View style={styles.statCard}>
                <Text style={styles.statLabel}>CONFIDENCE</Text>
                <View style={styles.statRow}>
                    <Text style={styles.statLarge}>{avgConfidence}%</Text>
                    <View style={[styles.statIcon, { backgroundColor: COLORS.blue100 }]}>
                        <MaterialIcons name="verified" size={20} color={COLORS.medicalBlue} />
                    </View>
                </View>
            </View>
        </View>
    );
};

export default AnalysisStats;
