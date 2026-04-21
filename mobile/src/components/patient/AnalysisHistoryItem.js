import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import { API_URL } from '../../utils/constants';

const AnalysisHistoryItem = ({ item, patientName, navigation, onDelete }) => {
    const imageUrl = `${API_URL}/static/${item.dosya_yolu}`;

    // Parse detections safely
    const detections = typeof item.detections === 'string'
        ? JSON.parse(item.detections || '[]')
        : (item.detections || []);

    const handlePress = () => {
        navigation.navigate('AnalysisDetail', {
            analysis_id: item.id,
            image_url: imageUrl,
            patient_name: patientName,
            date: item.tarih,
            report_text: item.rapor,
            detections: detections
        });
    };

    return (
        <View style={styles.historyItem}>
            <View style={styles.historyHeader}>
                <View style={styles.dateRow}>
                    <MaterialIcons name="event" size={14} color={COLORS.slate400} />
                    <Text style={styles.dateText}>{item.tarih}</Text>
                </View>
                {onDelete && (
                    <TouchableOpacity
                        onPress={() => onDelete(item.id)}
                        style={styles.deleteBtn}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                        <MaterialIcons name="delete-outline" size={18} color={COLORS.red700} />
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.historyContent}>
                <Image
                    source={{ uri: imageUrl }}
                    style={styles.historyImage}
                    resizeMode="cover"
                />
                <View style={styles.historyInfo}>
                    <Text style={styles.resultLabel}>Analiz Sonucu:</Text>
                    <Text style={styles.resultText} numberOfLines={2}>{item.rapor}</Text>

                    <TouchableOpacity
                        style={styles.viewDetailBtn}
                        onPress={handlePress}
                    >
                        <Text style={styles.viewDetailText}>Detayları Gör</Text>
                        <MaterialIcons name="arrow-forward" size={14} color={COLORS.primary} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    historyItem: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: COLORS.slate200,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: COLORS.slate100,
    },
    historyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.slate50,
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateText: {
        fontSize: 12,
        color: COLORS.slate400,
        marginLeft: 6,
        fontWeight: '500',
    },
    deleteBtn: {
        padding: 4,
    },
    historyContent: {
        flexDirection: 'row',
    },
    historyImage: {
        width: 80,
        height: 80,
        borderRadius: 12,
        backgroundColor: COLORS.slate100,
    },
    historyInfo: {
        flex: 1,
        marginLeft: 16,
        justifyContent: 'center',
    },
    resultLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.slate900,
        marginBottom: 4,
    },
    resultText: {
        fontSize: 14,
        color: COLORS.slate600,
        lineHeight: 20,
        marginBottom: 8,
    },
    viewDetailBtn: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    viewDetailText: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.primary,
        marginRight: 4,
    },
});

export default AnalysisHistoryItem;
