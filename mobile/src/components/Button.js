import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

const Button = ({ onPress, title, variant = 'primary', isLoading }) => {
    const baseClasses = "w-full p-4 rounded-xl items-center justify-center shadow-md active:opacity-90";
    const variants = {
        primary: "bg-indigo-600 shadow-indigo-200",
        secondary: "bg-white border border-gray-200 shadow-sm",
        danger: "bg-red-500 shadow-red-200",
    };

    const textClasses = {
        primary: "text-white font-bold text-lg",
        secondary: "text-gray-700 font-bold text-lg",
        danger: "text-white font-bold text-lg",
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            className={`${baseClasses} ${variants[variant]} ${isLoading ? 'opacity-70' : ''}`}
            disabled={isLoading}
        >
            {isLoading ? (
                <ActivityIndicator color={variant === 'secondary' ? '#4F46E5' : 'white'} />
            ) : (
                <Text className={textClasses[variant]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

export default Button;
