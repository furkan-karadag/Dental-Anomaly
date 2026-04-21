import React from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import AnalysisHistoryItem from './AnalysisHistoryItem';
import Button from '../common/Button';

const AnalysisHistoryList = ({ history, loading, patientName, navigation, onNewAnalysis, isAnalyzing, onDeleteAnalysis }) => {

    const renderHeader = () => (
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Geçmiş Analizler</Text>
            <View style={{ width: 140 }}>
                <Button
                    title="+ Yeni Analiz"
                    onPress={onNewAnalysis}
                    isLoading={isAnalyzing}
                    variant="primary"
                />
            </View>
        </View>
    );

    const renderEmpty = () => (
        <View style={styles.emptyState}>
            <MaterialIcons name="image-search" size={48} color={COLORS.slate300} />
            <Text style={styles.emptyStateText}>Henüz analiz kaydı yok.</Text>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.container}>
                {renderHeader()}
                <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {renderHeader()}
            <FlatList
                data={history}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <AnalysisHistoryItem
                        item={item}
                        patientName={patientName}
                        navigation={navigation}
                        onDelete={onDeleteAnalysis}
                    />
                )}
                ListEmptyComponent={renderEmpty}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.slate900,
    },
    listContent: {
        paddingBottom: 24,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 64,
    },
    emptyStateText: {
        marginTop: 16,
        fontSize: 16,
        color: COLORS.slate400,
    }
});

export default AnalysisHistoryList;
