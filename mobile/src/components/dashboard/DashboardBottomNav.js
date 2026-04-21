import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';

const DashboardBottomNav = () => {
    return (
        <View style={styles.bottomNav}>
            <TouchableOpacity style={styles.navItem} onPress={() => { }}>
                <MaterialIcons name="dashboard" size={24} color={COLORS.primary} />
                <Text style={[styles.navText, { color: COLORS.primary }]}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={() => { }}>
                <MaterialIcons name="cloud-upload" size={24} color={COLORS.slate400} />
                <Text style={styles.navText}>Upload</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={() => { }}>
                <MaterialIcons name="settings" size={24} color={COLORS.slate400} />
                <Text style={styles.navText}>Settings</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    bottomNav: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 70,
        backgroundColor: COLORS.white,
        borderTopWidth: 1,
        borderTopColor: COLORS.slate100,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: 10, // Safe area hint
        zIndex: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 10,
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        width: 60,
    },
    navText: {
        fontSize: 10,
        fontWeight: '500',
        color: COLORS.slate400,
    },
});

export default DashboardBottomNav;
