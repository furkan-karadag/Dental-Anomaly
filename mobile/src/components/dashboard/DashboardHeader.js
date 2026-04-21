import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';

const DashboardHeader = ({ user, onLogout }) => {
    return (
        <View style={styles.header}>
            <View style={styles.userInfo}>
                <View style={styles.avatarContainer}>
                    <Image
                        source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuArbPMxVrqM7k4f9tMMLmeOcvr93iiuLD7jsZcgP9wFRcZ8gUoQYpBQHLOA5kq1toIljImgAzViVqxCD3KFRSxfXj5ET9ky29QHzEKWa7FhqcJzPHdfBpucf4HW-1mGKCCAF0HspGKw7FpMBITnzdtso_aThz1fkR-oOW-ovCWqAz3Zmkhk6QZc0ZLjlsLON6l7OFnX52wLVh0zCy7n_fUNAe6ks3ELqIG4dDfflH1mey6PxGMiEgo72hLudzAsBbkPgdAG-Gm1gw" }}
                        style={styles.avatar}
                    />
                    <View style={styles.onlineBadge} />
                </View>
                <View>
                    <Text style={styles.greetingText}>Good Morning,</Text>
                    <Text style={styles.userNameText}>
                        {user && user.ad ? `Dr. ${user.ad.toUpperCase()} ${user.soyad.toUpperCase()}` : 'Dr. Anderson'}
                    </Text>
                </View>
            </View>
            <TouchableOpacity style={styles.notificationBtn} onPress={onLogout}>
                <MaterialIcons name="logout" size={24} color={COLORS.slate500} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 16,
        backgroundColor: COLORS.backgroundLight,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 2,
        borderColor: "rgba(19, 109, 236, 0.2)",
    },
    onlineBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: COLORS.green500,
        borderWidth: 2,
        borderColor: COLORS.backgroundLight,
    },
    greetingText: {
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.slate500,
    },
    userNameText: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.slate900,
    },
    notificationBtn: {
        padding: 8,
        position: 'relative',
    },
});

export default DashboardHeader;
