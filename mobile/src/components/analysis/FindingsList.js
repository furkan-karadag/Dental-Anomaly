import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, getClassColorHex, translateClass } from '../../theme/colors';
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
                    <Text style={styles.sectionTitle}>Detaylı Bulgular</Text>
                    <Text style={styles.sectionSubtitle}>Radyolojik Tarama Sonuçları</Text>
                </View>
                <Text style={styles.dateText}>{date}</Text>
            </View>

            <View style={styles.findingsList}>
                {realDetections.map((item, index) => {
                    const isHealthy = item.class.toLowerCase().includes('healthy');
                    const isCarries = item.class.toLowerCase().includes('carries') || item.class.toLowerCase().includes('caries');

                    // Determine styles based on type
                    let color = getClassColorHex(item.class);
                    let bgColor = `${color}15`;
                    let icon = "healing";

                    if (isCarries) {
                        icon = "medical-services";
                    } else if (isHealthy) {
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
                                { borderLeftWidth: 4, borderLeftColor: color },
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
                                    <Text style={styles.findingTitle}>{translateClass(item.class)}</Text>
                                    <Text style={styles.findingDesc}>
                                        {isHealthy ? "Sağlıklı Yapı" : "Anomali Tespit Edildi"}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.findingRight}>
                                <View style={{ alignItems: 'flex-end' }}>
                                    <Text style={[styles.percentText, { color }]}>{item.confidence}%</Text>
                                    <Text style={styles.probLabel}>ORAN</Text>
                                </View>
                                <MaterialIcons name="chevron-right" size={24} color={COLORS.slate300} />
                            </View>
                        </TouchableOpacity>
                    );
                })}

                {realDetections.length === 0 && (
                    <View style={styles.emptyBox}>
                        <Text style={styles.emptyText}>{reportText || "Detaylı bulgu bulunmuyor."}</Text>
                    </View>
                )}
            </View>
        </View>
    );
};

export default FindingsList;
