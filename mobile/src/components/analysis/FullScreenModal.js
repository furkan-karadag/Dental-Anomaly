import React from 'react';
import { View, Text, TouchableOpacity, Image, SafeAreaView, Dimensions, StatusBar } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from '../../screens/AnalysisDetailScreen.styles';
import BoundingBoxLayer from './BoundingBoxLayer';

const FullScreenModal = ({
    isVisible,
    onClose,
    imageUri,
    detections,
    viewMode,
    imgDimensions,
    selectedDetectionIndex,
    onPressFinding
}) => {
    if (!isVisible) return null;

    // Fixed logic: full screen fill, no rotation
    const screen = Dimensions.get('window');

    // We are forcing the container to be the screen size
    // So we can pass that directly to BoundingBoxLayer's calculations if needed,
    // though BoundingBoxLayer typically uses imgDimensions to calc %s.
    // However, when resizeMode="stretch", the "displayed image" is exactly screen.width/height.
    // The BoundingBoxLayer logic uses percentages of the *container*.
    // So if the container is screen size, `top: 50%` means 50% of screen.
    // Since the image is STRETCHED to screen, this is mathematically correct for alignment.

    // IMPORTANT: The BoundingBoxLayer uses `imgDimensions` (original image size) to calculate the percentages.
    // e.g. y1 / originalHeight = %. 
    // This % renders correctly on the screen-sized View only if the View matches the image aspect ratio OR the image is stretched.
    // Since we are stretching, the 50% y-coordinate on the image maps to the 50% y-coordinate on the screen view.
    // So logic holds.

    return (
        <View style={styles.fullScreenModal}>
            <StatusBar hidden />
            <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
                <View style={styles.fsHeader}>
                    <TouchableOpacity onPress={onClose} style={styles.fsCloseBtn}>
                        <MaterialIcons name="close" size={28} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.fsTitle}>Detailed Inspection</Text>
                    <View style={{ width: 40 }} />
                </View>

                <View style={[styles.fsImageContainer, { justifyContent: 'center', alignItems: 'center' }]}>
                    <View style={{ width: screen.width, height: screen.height * 0.7 }}>
                        <Image
                            source={{ uri: imageUri }}
                            style={{ width: '100%', height: '100%' }}
                            resizeMode="stretch"
                        />
                        {viewMode === 'ai' && (
                            <BoundingBoxLayer
                                detections={detections}
                                imgDimensions={imgDimensions} // Passed for % calc
                                selectedDetectionIndex={selectedDetectionIndex}
                                onPressFinding={onPressFinding}
                            />
                        )}
                    </View>
                </View>

                <View style={styles.fsFooter}>
                    <Text style={{ color: 'white', textAlign: 'center', opacity: 0.7 }}>
                        Pinch to zoom feature coming soon
                    </Text>
                </View>
            </SafeAreaView>
        </View>
    );
};

export default FullScreenModal;
