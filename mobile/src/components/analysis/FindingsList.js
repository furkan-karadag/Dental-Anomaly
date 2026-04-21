import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import { styles } from '../../screens/AnalysisDetailScreen.styles';

const FindingsList = ({
    detections,
    selectedDetectionIndex,
    onPressFinding,
    date,
    reportText
}) => {
    // Process detections or use empty array
    const realDetections = detections || [];

    return (
        <View style={styles.findingsSection}>
            <View style={styles.sectionHeader}>
                <View>
                    <Text style={styles.sectionTitle}>Detailed Findings</Text>
                    <Text style={styles.sectionSubtitle}>Radiological Scan Results</Text>
                </View>
                <Text style={styles.dateText}>{date}</Text>
            </View>

            <View style={styles.findingsList}>
                {realDetections.map((item, index) => {
                    const isHealthy = item.class.toLowerCase().includes('healthy');
                    const isAbscess = item.class.toLowerCase().includes('abscess');
                    const isCarries = item.class.toLowerCase().includes('carries');

                    // Determine styles based on type
                    let color = COLORS.medicalBlue;
                    let bgColor = COLORS.medicalSoft;
                    let icon = "healing";

                    if (isAbscess || isCarries) {
                        color = COLORS.abscessOrange;
                        bgColor = COLORS.orange50;
                        icon = "medical-services";
                    } else if (isHealthy) {
                        color = COLORS.emerald600;
                        bgColor = COLORS.emerald50;
                        icon = "check-circle";
                    }

                    const isSelected = selectedDetectionIndex === index;
                    const anySelected = selectedDetectionIndex !== null;

                    return (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.findingCard,
                                isHealthy && styles.healthyCard,
                                isSelected && { borderColor: color, transform: [{ scale: 1.02 }] },
                                (anySelected && !isSelected) && { opacity: 0.5 }
                            ]}
                            activeOpacity={0.9}
                            onPress={() => onPressFinding(index)}
                        >
                            <View style={styles.findingLeft}>
                                <View style={[styles.findingIconBox, { backgroundColor: bgColor }]}>
                                    <MaterialIcons name={icon} size={24} color={color} />
                                </View>
                                <View>
                                    <Text style={styles.findingTitle}>{item.class}</Text>
                                    <Text style={styles.findingDesc}>
                                        {isHealthy ? "Healthy Structure" : "Detected Issue"}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.findingRight}>
                                <View style={{ alignItems: 'flex-end' }}>
                                    <Text style={[styles.percentText, { color }]}>{item.confidence}%</Text>
                                    <Text style={styles.probLabel}>PROB.</Text>
                                </View>
                                <MaterialIcons name="chevron-right" size={24} color={COLORS.slate300} />
                            </View>
                        </TouchableOpacity>
                    );
                })}

                {realDetections.length === 0 && (
                    <View style={styles.emptyBox}>
                        <Text style={styles.emptyText}>{reportText || "No detailed findings available."}</Text>
                    </View>
                )}
            </View>
        </View>
    );
};

export default FindingsList;
