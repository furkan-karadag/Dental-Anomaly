import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';

const SearchBar = ({ style }) => {
    return (
        <View style={[styles.searchContainer, style]}>
            <View style={styles.searchWrapper}>
                <MaterialIcons name="search" size={24} color={COLORS.slate400} style={styles.searchIcon} />
                <TextInput
                    placeholder="Search patients by name or ID..."
                    placeholderTextColor={COLORS.slate400}
                    style={styles.searchInput}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    searchContainer: {
        paddingHorizontal: 24,
        paddingVertical: 8,
    },
    searchWrapper: {
        position: 'relative',
    },
    searchIcon: {
        position: 'absolute',
        left: 16,
        top: 14,
        zIndex: 1,
    },
    searchInput: {
        width: '100%',
        backgroundColor: COLORS.white,
        borderRadius: 12,
        paddingVertical: 14,
        paddingLeft: 48,
        paddingRight: 16,
        fontSize: 14,
        color: COLORS.slate900,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
});

export default SearchBar;
