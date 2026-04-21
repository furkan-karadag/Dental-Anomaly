import { useState, useEffect, useMemo, useCallback } from 'react';
import { Image } from 'react-native';

export const useAnalysisController = (routeParams) => {
    const { image_url, detections } = routeParams || {};

    const [viewMode, setViewMode] = useState('ai'); // 'ai' or 'original'
    const [imgDimensions, setImgDimensions] = useState({ width: 1, height: 1 });
    const [selectedDetectionIndex, setSelectedDetectionIndex] = useState(null);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [containerLayout, setContainerLayout] = useState({ width: 0, height: 0 });

    // Process detections or use empty array
    const realDetections = detections || [];

    useEffect(() => {
        if (image_url) {
            Image.getSize(image_url, (width, height) => {
                setImgDimensions({ width, height });
            }, (error) => {
                console.error("Failed to get image size", error);
            });
        }
    }, [image_url]);

    // Calculate the actual displayed image area inside the container
    // when using resizeMode="contain"
    const displayedImageLayout = useMemo(() => {
        const cW = containerLayout.width;
        const cH = containerLayout.height;
        const iW = imgDimensions.width;
        const iH = imgDimensions.height;

        if (cW === 0 || cH === 0 || iW === 0 || iH === 0) {
            return { top: 0, left: 0, width: cW, height: cH };
        }

        const containerAspect = cW / cH;
        const imageAspect = iW / iH;

        let displayW, displayH, offsetX, offsetY;

        if (imageAspect > containerAspect) {
            // Image is wider than container → letterbox top/bottom
            displayW = cW;
            displayH = cW / imageAspect;
            offsetX = 0;
            offsetY = (cH - displayH) / 2;
        } else {
            // Image is taller than container → letterbox left/right
            displayH = cH;
            displayW = cH * imageAspect;
            offsetX = (cW - displayW) / 2;
            offsetY = 0;
        }

        return {
            top: offsetY,
            left: offsetX,
            width: displayW,
            height: displayH,
        };
    }, [containerLayout, imgDimensions]);

    const handleContainerLayout = useCallback((event) => {
        const { width, height } = event.nativeEvent.layout;
        setContainerLayout({ width, height });
    }, []);

    const handleFindingPress = (index) => {
        if (selectedDetectionIndex === index) {
            setSelectedDetectionIndex(null); // Deselect
        } else {
            setSelectedDetectionIndex(index);
            setViewMode('ai'); // Force AI view
        }
    };

    return {
        viewMode,
        setViewMode,
        imgDimensions,
        selectedDetectionIndex,
        setSelectedDetectionIndex,
        isFullScreen,
        setIsFullScreen,
        realDetections,
        handleFindingPress,
        displayedImageLayout,
        handleContainerLayout,
    };
};
