import React, { useContext, useState, useCallback } from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    StatusBar,
    Dimensions,
    View,
    RefreshControl,
    TouchableOpacity
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from "../context/AuthContext";
import { getPatients, getDashboardStats } from '../services/patientService';
import { COLORS } from '../theme/colors';

// Components
import DashboardHeader from '../components/dashboard/DashboardHeader';
import SearchBar from '../components/dashboard/SearchBar';
import StatsSection from '../components/dashboard/StatsSection';
import RecentPatientsList from '../components/dashboard/RecentPatientsList';
import DashboardBottomNav from '../components/dashboard/DashboardBottomNav';

const DashboardScreen = ({ navigation }) => {
    const { userInfo, logout } = useContext(AuthContext);
    const [patients, setPatients] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Initial fetch and focus effect
    const loadData = async () => {
        try {
            setLoading(true);
            const [patientsData, statsData] = await Promise.all([
                getPatients(),
                getDashboardStats()
            ]);

            if (patientsData && patientsData.hastalar) {
                setPatients(patientsData.hastalar);
            }
            if (statsData) {
                setStats(statsData);
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        loadData();
    };

    // Helper to get status styling
    const getStatusStyle = (status) => {
        const s = status ? status.toLowerCase() : 'healthy';

        if (s.includes('processing')) {
            return {
                bg: COLORS.blue100,
                text: COLORS.blue700,
                icon: "sync",
                label: "Processing",
            };
        } else if (s.includes('cavity') || s.includes('issue') || s.includes('alert')) {
            return {
                bg: COLORS.red100,
                text: COLORS.red700,
                icon: "warning",
                label: "Action Needed",
            };
        } else if (s.includes('review') || s.includes('ready')) {
            return {
                bg: COLORS.purple100,
                text: COLORS.purple700,
                icon: "auto-awesome",
                label: "Analysis Ready",
            };
        } else if (s.includes('routine')) {
            return {
                bg: COLORS.slate100,
                text: COLORS.slate500,
                icon: "calendar-today",
                label: "Routine Checkup",
            };
        }
        return {
            bg: COLORS.green100,
            text: COLORS.green700,
            icon: "check-circle",
            label: "Healthy",
        };
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.backgroundLight} />

            <View style={styles.mainContainer}>
                {/* Header */}
                <DashboardHeader user={userInfo} onLogout={logout} />

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                >
                    {/* Search Bar */}
                    <SearchBar />

                    {/* Stats Section */}
                    <StatsSection stats={stats} />

                    {/* Recent Patients List */}
                    <RecentPatientsList
                        patients={patients}
                        loading={loading}
                        navigation={navigation}
                        getStatusStyle={getStatusStyle}
                    />

                    {/* Bottom Padding for scroll */}
                    <View style={{ height: 100 }} />
                </ScrollView>

                {/* Floating Action Button */}
                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => navigation.navigate('AddPatient')}
                >
                    <MaterialIcons name="add" size={32} color={COLORS.white} />
                </TouchableOpacity>

                {/* Custom Bottom Navigation */}
                <DashboardBottomNav />

            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.backgroundLight,
    },
    mainContainer: {
        flex: 1,
        position: 'relative',
        maxWidth: 480, // Max width constraint from design
        alignSelf: 'center', // Center on larger screens
        width: '100%',
        backgroundColor: COLORS.backgroundLight,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    // Floating Action Button
    fab: {
        position: 'absolute',
        bottom: 90, // Above nav
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
        zIndex: 20,
    },
});

export default DashboardScreen;
