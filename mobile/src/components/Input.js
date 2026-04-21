import React from 'react';
import { View, Text, TextInput } from 'react-native';

const Input = ({ label, value, onChangeText, placeholder, secureTextEntry }) => {
    return (
        <View className="mb-4">
            <Text className="text-gray-700 font-semibold mb-2 ml-1">{label}</Text>
            <TextInput
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-800 focus:border-indigo-500 focus:bg-white transition-all shadow-sm"
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                secureTextEntry={secureTextEntry}
                placeholderTextColor="#9CA3AF"
            />
        </View>
    );
};

export default Input;
