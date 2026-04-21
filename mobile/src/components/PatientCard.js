import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const PatientCard = ({ patient, onPress }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-3 flex-row items-center justify-between"
        >
            <View className="flex-row items-center">
                <View className="w-12 h-12 bg-indigo-100 rounded-full items-center justify-center mr-4">
                    <Text className="text-indigo-600 font-bold text-lg">
                        {patient.ad.charAt(0)}{patient.soyad.charAt(0)}
                    </Text>
                </View>
                <View>
                    <Text className="font-bold text-gray-800 text-lg">{patient.ad} {patient.soyad}</Text>
                    <Text className="text-gray-500 text-sm">TC: {patient.tc_no}</Text>
                </View>
            </View>
            <Text className="text-gray-400 text-2xl">›</Text>
        </TouchableOpacity>
    );
};

export default PatientCard;
