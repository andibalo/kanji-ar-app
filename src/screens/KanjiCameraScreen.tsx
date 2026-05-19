import React, { useCallback, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  LayoutChangeEvent,
} from 'react-native';
import {
  useCameraDevice,
  useCameraPermission,
  Camera,
  useFrameProcessor,
} from 'react-native-vision-camera';
import { useTextRecognition } from 'react-native-vision-camera-ocr-plus';
import { useRunOnJS } from 'react-native-worklets-core';
import { filterKanjiBlocks, type KanjiBlock } from '../utils/kanjiFilter';
import { TextOverlay } from '../components/TextOverlay';
import { KanjiDetailCard } from '../components/KanjiDetailCard';
import { KanjiScrollList } from '../components/KanjiScrollList';
import { ScanRegionOverlay } from '../components/ScanRegionOverlay';
import { useJishoLookup } from '../hooks/useJishoLookup';
import type { BlockData, ScanRegionPercentage } from '../types/recognition';

// Process ~4 frames per second at 30fps camera
const FRAME_SKIP = 10;

// Default scan region — centred horizontal band
const DEFAULT_REGION: ScanRegionPercentage = {
  left: '5%' as `${number}%`,
  top: '30%' as `${number}%`,
  width: '90%' as `${number}%`,
  height: '40%' as `${number}%`,
};

export function KanjiCameraScreen() {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');

  const [blocks, setBlocks] = useState<KanjiBlock[]>([]);
  const [previewSize, setPreviewSize] = useState({ width: 0, height: 0 });
  const [frameSize, setFrameSize] = useState({ width: 720, height: 1280 });
  const [scanRegion, setScanRegion] =
    useState<ScanRegionPercentage>(DEFAULT_REGION);
  const [isScanning, setIsScanning] = useState(true);

  const frameCountRef = useRef(0);
  const previewSizeRef = useRef({ width: 0, height: 0 });

  const { state: jishoState, lookup, reset } = useJishoLookup();
  const { scanText } = useTextRecognition({ language: 'japanese' });

  // Bridge from the worklet thread back to JS to update React state.
  // NOTE: the library's native scanRegion option only applies when passed at
  // initialisation (useTextRecognition options), NOT per-frame. Since we need a
  // dynamic scan region, we scan the full frame and filter blocks by position here.
  const updateBlocks = useRunOnJS(
    (rawBlocks: BlockData[], region: ScanRegionPercentage, frameW: number, frameH: number, previewW: number, previewH: number) => {
      setFrameSize({ width: frameW, height: frameH });

      // Convert each block's center to screen-space (portrait frame, no rotation),
      // then compare against screen-space region bounds — matches coordinateTransform.ts.
      const scale = Math.max(previewW / frameW, previewH / frameH);
      const offsetX = (scale * frameW - previewW) / 2;
      const offsetY = (scale * frameH - previewH) / 2;

      const leftPx   = parseFloat(region.left) / 100 * previewW;
      const topPx    = parseFloat(region.top)  / 100 * previewH;
      const rightPx  = leftPx + parseFloat(region.width)  / 100 * previewW;
      const bottomPx = topPx  + parseFloat(region.height) / 100 * previewH;

      const inRegion = rawBlocks.filter(b => {
        const sx = b.blockFrame.boundingCenterX * scale - offsetX;
        const sy = b.blockFrame.boundingCenterY * scale - offsetY;
        return sx >= leftPx && sx <= rightPx && sy >= topPx && sy <= bottomPx;
      });

      const filtered = filterKanjiBlocks(inRegion);
      console.log(
        `[KanjiScan] ${rawBlocks.length} raw → ${inRegion.length} in region → ${filtered.length} kanji`,
      );
      if (filtered.length > 0) {
        console.log('[KanjiScan]', filtered.map(b => b.text).join(' | '));
      }
      setBlocks(filtered);
    },
    [],
  );

  // scanRegion and isScanning are captured in the closure and listed in deps
  // so the processor re-creates when either changes.
  const frameProcessor = useFrameProcessor(
    frame => {
      'worklet';
      if (!isScanning) return;
      frameCountRef.current++;
      if (frameCountRef.current % FRAME_SKIP !== 0) return;

      const result = scanText(frame);
      if (result && result.blocks && result.blocks.length > 0) {

        console.log(result, 'scan result');
        updateBlocks(result.blocks, scanRegion, frame.width, frame.height,
          previewSizeRef.current.width, previewSizeRef.current.height);
      }
    },
    [isScanning, scanText, scanRegion, updateBlocks],
  );

  const handleBlockPress = useCallback(
    (block: KanjiBlock) => {
      lookup(block.text);
    },
    [lookup],
  );

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setPreviewSize({ width, height });
    previewSizeRef.current = { width, height };
  }, []);

  const handleRegionChange = useCallback((region: ScanRegionPercentage) => {
    setScanRegion(region);
    setBlocks([]);
  }, []);

  const handleToggleScan = useCallback(() => {
    setIsScanning(prev => {
      if (prev) setBlocks([]);
      return !prev;
    });
  }, []);

  // ---- Permission gate ----
  if (!hasPermission) {
    return (
      <View style={styles.centreContainer}>
        <Text style={styles.infoText}>
          Camera permission is required to scan kanji.
        </Text>
        <TouchableOpacity style={styles.btn} onPress={requestPermission}>
          <Text style={styles.btnText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.centreContainer}>
        <Text style={styles.infoText}>No back camera found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />


      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isScanning}
        frameProcessor={frameProcessor}
        onLayout={handleLayout}
        enableZoomGesture={true}
      />

      {/* Kanji bounding box highlights */}
      <TextOverlay
        blocks={blocks}
        frameWidth={frameSize.width}
        frameHeight={frameSize.height}
        previewWidth={previewSize.width}
        previewHeight={previewSize.height}
      />

      {/* Resizable scan region with draggable corner handles */}
      <ScanRegionOverlay onRegionChange={handleRegionChange} />

      {/* Horizontal list of detected kanji — rendered above dim panels so chips are tappable */}
      <KanjiScrollList blocks={blocks} onPress={handleBlockPress} />

      {/* Definition card (slides up on tap) */}
      <KanjiDetailCard state={jishoState} onDismiss={reset} />

      {/* Start / Stop scanning button — top-right */}
      <TouchableOpacity
        style={[
          styles.scanBtn,
          isScanning ? styles.scanBtnActive : styles.scanBtnStopped,
        ]}
        onPress={handleToggleScan}
      >
        <Text style={styles.scanBtnText}>
          {isScanning ? 'Stop Scanning' : 'Start Scanning'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centreContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A2E',
    padding: 24,
    gap: 16,
  },
  infoText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
  },
  btn: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  btnText: {
    color: '#1A1A2E',
    fontWeight: 'bold',
    fontSize: 16,
  },
  scanBtn: {
    position: 'absolute',
    top: 56,
    right: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 4,
  },
  scanBtnActive: {
    backgroundColor: '#FFD700',
  },
  scanBtnStopped: {
    backgroundColor: '#555',
  },
  scanBtnText: {
    color: '#1A1A2E',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
