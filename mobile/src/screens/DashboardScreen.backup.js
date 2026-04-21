import React, { useContext, useCallback, useState } from 'react';
import { View, Text, SafeAreaView, FlatList, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { getPatients } from '../services/patientService';
import PatientCard from '../components/PatientCard';
import Button from '../components/Button';

const DashboardScreen = ({ navigation }) => {
    const { logout, userInfo, userToken } = useContext(AuthContext);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // useFocusEffect to refresh when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            fetchPatients();
        }, [])
    );

    const fetchPatients = async () => {
        try {
            setLoading(true);
            const data = await getPatients();
            // data.hastalar array
            if (data && data.hastalar) {
                setPatients(data.hastalar);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchPatients();
    };

    const renderItem = ({ item }) => (
        <PatientCard
            patient={item}
            onPress={() => navigation.navigate('PatientDetail', { patientId: item.id, item })}
        />
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <View className="px-6 py-4 bg-white shadow-sm flex-row justify-between items-center z-10">
                <View>
                    <Text className="text-sm text-gray-500">Hoş Geldiniz,</Text>
                    <Text className="text-xl font-bold text-gray-800">Doktor Paneli</Text>
                </View>
                <TouchableOpacity onPress={logout} className="p-2">
                    <Text className="text-red-500 font-medium">Çıkış</Text>
                </TouchableOpacity>
            </View>

            <View className="flex-1 px-4 pt-4">
                <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-lg font-bold text-gray-800">Hastalarım</Text>
                    <TouchableOpacity
                        className="bg-indigo-600 px-3 py-2 rounded-lg"
                        onPress={() => navigation.navigate('AddPatient')}
                    >
                        <Text className="text-white font-bold">+ Hasta Ekle</Text>
                    </TouchableOpacity>
                </View>

                {loading && !refreshing ? (
                    <ActivityIndicator size="large" color="#4F46E5" className="mt-10" />
                ) : (
                    <FlatList
                        data={patients}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderItem}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                        ListEmptyComponent={
                            <View className="items-center mt-10">
                                <Text className="text-gray-500">Henüz kayıtlı hasta yok.</Text>
                            </View>
                        }
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

export default DashboardScreen;
