import React, { useState, useMemo } from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';

const PatientSelectModal = ({ visible, onClose, patients, loading, onSelect }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredPatients = useMemo(() => {
        if (!patients) return [];
        if (!searchQuery) return patients;
        
        const q = searchQuery.toLowerCase().trim();
        return patients.filter(p => {
            const ad = p.ad ? p.ad.toLowerCase() : "";
            const soyad = p.soyad ? p.soyad.toLowerCase() : "";
            const tc = p.tc_no ? String(p.tc_no) : "";
            return ad.includes(q) || soyad.includes(q) || tc.includes(q) || `${ad} ${soyad}`.includes(q);
        });
    }, [patients, searchQuery]);

    const renderPatient = ({ item }) => (
        <TouchableOpacity 
            style={styles.patientItem} 
            onPress={() => {
                setSearchQuery('');
                onSelect(item);
            }}
        >
            <View style={styles.avatar}>
                <MaterialIcons name="person" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.patientInfo}>
                <Text style={styles.patientName}>{item.ad} {item.soyad}</Text>
                <Text style={styles.patientTc}>TC: {item.tc_no}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={COLORS.slate400} />
        </TouchableOpacity>
    );

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Hasta Seçin</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <MaterialIcons name="close" size={24} color={COLORS.slate900} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.searchContainer}>
                        <MaterialIcons name="search" size={20} color={COLORS.slate400} style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="İsim veya TC No ile ara..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>

                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={COLORS.primary} />
                        </View>
                    ) : (
                        <FlatList
                            data={filteredPatients}
                            keyExtractor={item => item.id.toString()}
                            renderItem={renderPatient}
                            contentContainerStyle={styles.listContent}
                            ListEmptyComponent={
                                <View style={styles.emptyContainer}>
                                    <Text style={styles.emptyText}>Hasta bulunamadı.</Text>
                                </View>
                            }
                        />
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        height: '80%',
        paddingTop: 8,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.slate100,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.slate900,
    },
    closeButton: {
        padding: 4,
    },
    searchContainer: {
        margin: 20,
        position: 'relative',
    },
    searchIcon: {
        position: 'absolute',
        left: 16,
        top: 14,
        zIndex: 1,
    },
    searchInput: {
        backgroundColor: COLORS.slate50,
        borderRadius: 12,
        paddingVertical: 12,
        paddingLeft: 44,
        paddingRight: 16,
        fontSize: 15,
        borderWidth: 1,
        borderColor: COLORS.slate200,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    patientItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: COLORS.white,
        borderRadius: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: COLORS.slate100,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.blue50,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    patientInfo: {
        flex: 1,
    },
    patientName: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.slate900,
        marginBottom: 2,
    },
    patientTc: {
        fontSize: 13,
        color: COLORS.slate500,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        color: COLORS.slate500,
        fontSize: 15,
    }
});

export default PatientSelectModal;
