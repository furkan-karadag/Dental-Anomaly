import React from 'react';
import { View, Text, SafeAreaView, ScrollView, Image, TouchableOpacity, StatusBar } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

// Hooks & Styles
import { useAnalysisController } from '../hooks/useAnalysisController';
import { styles } from './AnalysisDetailScreen.styles';

// Components
import AnalysisStats from '../components/analysis/AnalysisStats';
import BoundingBoxLayer from '../components/analysis/BoundingBoxLayer';
import FindingsList from '../components/analysis/FindingsList';
import FullScreenModal from '../components/analysis/FullScreenModal';

const AnalysisDetailScreen = ({ route, navigation }) => {
    // Destructure params
    const { image_url, patient_name, date, report_text } = route.params;

    // Use Custom Hook for Logic
    const {
        viewMode,
        setViewMode,
        imgDimensions,
        selectedDetectionIndex,
        setSelectedDetectionIndex, // exposed if needed direct set
        isFullScreen,
        setIsFullScreen,
        realDetections,
        handleFindingPress,
        displayedImageLayout,
        handleContainerLayout,
    } = useAnalysisController(route.params);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back-ios" size={20} color={COLORS.slate500} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>AI Diagnosis Report</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                {/* Main Analysis Section */}
                <View style={styles.imageSection}>
                    <TouchableOpacity
                        style={styles.imageContainer}
                        activeOpacity={0.9}
                        onPress={() => setIsFullScreen(true)}
                        onLayout={handleContainerLayout}
                    >
                        <Image
                            source={{ uri: image_url }}
                            style={styles.mainImage}
                            resizeMode="contain"
                        />

                        {viewMode === 'ai' && displayedImageLayout.width > 0 && (
                            <View style={{
                                position: 'absolute',
                                top: displayedImageLayout.top,
                                left: displayedImageLayout.left,
                                width: displayedImageLayout.width,
                                height: displayedImageLayout.height,
                            }}>
                                <BoundingBoxLayer
                                    detections={realDetections}
                                    imgDimensions={imgDimensions}
                                    selectedDetectionIndex={selectedDetectionIndex}
                                    onPressFinding={handleFindingPress}
                                />
                            </View>
                        )}

                        <View style={styles.zoomHint}>
                            <MaterialIcons name="zoom-in" size={20} color={COLORS.slate900} />
                        </View>
                    </TouchableOpacity>

                    {/* Toggle Switch */}
                    <View style={styles.toggleContainer}>
                        <TouchableOpacity
                            style={[styles.toggleButton, viewMode === 'ai' && styles.toggleButtonActive]}
                            onPress={() => { setViewMode('ai'); setSelectedDetectionIndex(null); }}
                        >
                            <Text style={[styles.toggleText, viewMode === 'ai' && styles.toggleTextActive]}>AI Analysis</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.toggleButton, viewMode === 'original' && styles.toggleButtonActive]}
                            onPress={() => { setViewMode('original'); setSelectedDetectionIndex(null); }}
                        >
                            <Text style={[styles.toggleText, viewMode === 'original' && styles.toggleTextActive]}>Original</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Stats Grid */}
                <AnalysisStats detections={realDetections} />

                {/* Detailed Findings List */}
                <FindingsList
                    detections={realDetections}
                    selectedDetectionIndex={selectedDetectionIndex}
                    onPressFinding={handleFindingPress}
                    date={date}
                    reportText={report_text}
                />

                <View style={{ height: 120 }} />

            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.downloadButton}>
                    <MaterialIcons name="picture-as-pdf" size={24} color="white" />
                    <Text style={styles.downloadButtonText}>Download PDF Report</Text>
                </TouchableOpacity>
                <Text style={styles.versionText}>Medical Grade AI Analysis • v2.4.0</Text>
            </View>

            {/* Full Screen Modal */}
            <FullScreenModal
                isVisible={isFullScreen}
                onClose={() => setIsFullScreen(false)}
                imageUri={image_url}
                detections={realDetections}
                viewMode={viewMode}
                imgDimensions={imgDimensions}
                selectedDetectionIndex={selectedDetectionIndex}
                onPressFinding={handleFindingPress}
            />

        </SafeAreaView>
    );
};

export default AnalysisDetailScreen;
