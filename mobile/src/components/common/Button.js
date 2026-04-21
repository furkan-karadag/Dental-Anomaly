import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';

const Button = ({
    onPress,
    title,
    variant = 'primary',
    isLoading,
    icon,
    disabled
}) => {
    const isPrimary = variant === 'primary';
    const isSecondary = variant === 'secondary';
    const isDanger = variant === 'danger';
    const isOutline = variant === 'outline';

    const getButtonStyle = () => {
        if (isPrimary) return styles.primaryButton;
        if (isSecondary) return styles.secondaryButton;
        if (isDanger) return styles.dangerButton;
        if (isOutline) return styles.outlineButton;
        return styles.primaryButton;
    };

    const getTextStyle = () => {
        if (isPrimary || isDanger) return styles.textWhite;
        if (isSecondary) return styles.textDark;
        if (isOutline) return styles.textPrimary;
        return styles.textWhite;
    };

    const isDisabled = disabled || isLoading;

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.baseButton, getButtonStyle(), isDisabled && styles.disabledButton]}
            disabled={isDisabled}
            activeOpacity={0.8}
        >
            {isLoading ? (
                <ActivityIndicator size="small" color={isPrimary || isDanger ? 'white' : COLORS.primary} />
            ) : (
                <>
                    {icon && <MaterialIcons name={icon} size={20} color={isPrimary ? 'white' : COLORS.primary} style={styles.icon} />}
                    <Text style={[styles.textBase, getTextStyle()]}>{title}</Text>
                </>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    baseButton: {
        width: '100%',
        height: 56,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    primaryButton: {
        backgroundColor: COLORS.primary,
        shadowColor: COLORS.primary,
    },
    secondaryButton: {
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.slate100,
    },
    dangerButton: {
        backgroundColor: COLORS.red500,
        shadowColor: COLORS.red500,
    },
    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: COLORS.primary,
        elevation: 0,
        shadowOpacity: 0,
    },
    disabledButton: {
        opacity: 0.6,
    },
    textBase: {
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    textWhite: {
        color: COLORS.white,
    },
    textDark: {
        color: COLORS.slate900,
    },
    textPrimary: {
        color: COLORS.primary,
    },
    icon: {
        marginRight: 8,
    }
});

export default Button;
