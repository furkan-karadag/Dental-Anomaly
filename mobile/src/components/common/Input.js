import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';

const Input = ({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry,
    icon,
    keyboardType,
    maxLength,
    error
}) => {
    // Focused state removed to prevent re-render loop issues on some Android devices
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const isSecure = secureTextEntry && !isPasswordVisible;

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={[
                styles.inputWrapper,
                error && styles.errorInput
            ]}>
                {icon && <MaterialIcons name={icon} size={20} color={COLORS.slate400} style={styles.icon} />}

                <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={COLORS.slate400}
                    secureTextEntry={isSecure}
                    keyboardType={keyboardType}
                    maxLength={maxLength}
                    autoCapitalize="none"
                />

                {secureTextEntry && (
                    <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={styles.eyeIcon}>
                        <MaterialIcons
                            name={isPasswordVisible ? "visibility" : "visibility-off"}
                            size={20}
                            color={COLORS.slate400}
                        />
                    </TouchableOpacity>
                )}
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.slate900,
        marginBottom: 8,
        marginLeft: 4,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.backgroundLight,
        borderWidth: 1,
        borderColor: COLORS.slate100,
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 52,
    },
    focusedInput: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.white,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    errorInput: {
        borderColor: COLORS.red500,
    },
    icon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: COLORS.slate900,
        height: '100%',
    },
    eyeIcon: {
        padding: 4,
    },
    errorText: {
        color: COLORS.red500,
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    }
});

export default Input;
