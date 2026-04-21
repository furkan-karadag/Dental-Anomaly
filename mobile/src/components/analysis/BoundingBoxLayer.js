import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '../../theme/colors';
import { styles } from '../../screens/AnalysisDetailScreen.styles';

const BoundingBoxLayer = ({
    detections,
    imgDimensions,
    selectedDetectionIndex,
    onPressFinding,
    containerWidth, // Optional override usually not needed if using % based on parent
    containerHeight // Optional override
}) => {
    const realDetections = detections || [];

    const renderBoundingBox = (det, index) => {
        const [x1, y1, x2, y2] = det.box;

        const refW = imgDimensions.width;
        const refH = imgDimensions.height;

        // Protection against 0 dimensions
        if (refW === 0 || refH === 0) return null;

        const top = (y1 / refH) * 100;
        const left = (x1 / refW) * 100;
        const widthPct = ((x2 - x1) / refW) * 100;
        const heightPct = ((y2 - y1) / refH) * 100;

        const isSelected = selectedDetectionIndex === index;
        const anySelected = selectedDetectionIndex !== null;
        const isHealthy = det.class.toLowerCase().includes('healthy');

        let boxColor = isHealthy ? COLORS.emerald600 : COLORS.medicalBlue;
        if (det.class.toLowerCase().includes('abscess') || det.class.toLowerCase().includes('carries')) {
            boxColor = COLORS.abscessOrange;
        }
        if (isSelected) boxColor = '#facc15';

        const opacity = (anySelected && !isSelected) ? 0.3 : 1;

        return (
            <TouchableOpacity
                key={index}
                activeOpacity={0.8}
                onPress={() => onPressFinding(index)}
                style={[styles.boundingBox, {
                    top: `${top}%`,
                    left: `${left}%`,
                    width: `${widthPct}%`,
                    height: `${heightPct}%`,
                    borderColor: boxColor,
                    backgroundColor: isSelected ? 'rgba(250, 204, 21, 0.2)' : `${boxColor}15`,
                    zIndex: isSelected ? 10 : 1,
                    borderWidth: isSelected ? 3 : 2,
                    opacity: opacity
                }]}
            >
                {/* Badge Label */}
                {(!anySelected || isSelected) && (
                    <View style={[styles.boxLabel, { backgroundColor: boxColor }]}>
                        <Text
                            style={[styles.boxLabelText, isSelected && { color: 'black' }]}
                            numberOfLines={1}
                        >
                            {det.class} {det.confidence}%
                        </Text>
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <>
            {realDetections.map((det, index) => renderBoundingBox(det, index))}
        </>
    );
};

export default BoundingBoxLayer;
