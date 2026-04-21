import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';

const PatientHeader = ({ patient, onBack, onDelete }) => {
    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
                <MaterialIcons name="arrow-back" size={24} color={COLORS.slate900} />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
                <Text style={styles.patientName}>{patient?.ad} {patient?.soyad}</Text>
                <Text style={styles.patientId}>TC: {patient?.tc_no}</Text>
            </View>
            {onDelete && (
                <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
                    <MaterialIcons name="delete-outline" size={24} color={COLORS.red700} />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 24,
        paddingTop: Platform.OS === 'android' ? 40 : 20,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.slate100,
    },
    backButton: {
        padding: 8,
        marginRight: 16,
        marginLeft: -8,
    },
    titleContainer: {
        flex: 1,
    },
    patientName: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.slate900,
    },
    patientId: {
        fontSize: 14,
        color: COLORS.slate500,
        marginTop: 2,
    },
    deleteButton: {
        padding: 8,
        marginLeft: 8,
    },
});

export default PatientHeader;
