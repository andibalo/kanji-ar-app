import React, { useCallback, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import type { ScanRegionPercentage } from '../types/recognition';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

const MIN_SIZE = 80;
const HANDLE_SIZE = 28;
const HANDLE_HALF = HANDLE_SIZE / 2;

const DEFAULT_X1 = SCREEN_W * 0.05;
const DEFAULT_Y1 = SCREEN_H * 0.30;
const DEFAULT_X2 = SCREEN_W * 0.95;
const DEFAULT_Y2 = SCREEN_H * 0.70;

type Region = { x1: number; y1: number; x2: number; y2: number };

type Props = {
  onRegionChange: (region: ScanRegionPercentage) => void;
};

function toPercentage(region: Region): ScanRegionPercentage {
  const pct = (n: number) => `${n.toFixed(1)}%` as `${number}%`;
  return {
    left:   pct((region.x1 / SCREEN_W) * 100),
    top:    pct((region.y1 / SCREEN_H) * 100),
    width:  pct(((region.x2 - region.x1) / SCREEN_W) * 100),
    height: pct(((region.y2 - region.y1) / SCREEN_H) * 100),
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function ScanRegionOverlay({ onRegionChange }: Props) {
  const [region, setRegion] = useState<Region>({
    x1: DEFAULT_X1,
    y1: DEFAULT_Y1,
    x2: DEFAULT_X2,
    y2: DEFAULT_Y2,
  });

  // Stable ref so gesture closures always see the latest region
  const regionRef = React.useRef(region);
  regionRef.current = region;

  const updateRegion = useCallback(
    (next: Region) => {
      setRegion(next);
      onRegionChange(toPercentage(next));
    },
    [onRegionChange],
  );

  // .runOnJS(true) forces callbacks to run on the JS thread,
  // so we can call setState directly without any worklet bridge.

  const tlGesture = Gesture.Pan()
    .runOnJS(true)
    .minDistance(0)
    .onUpdate(e => {
      const r = regionRef.current;
      updateRegion({
        ...r,
        x1: clamp(e.absoluteX, 0, r.x2 - MIN_SIZE),
        y1: clamp(e.absoluteY, 0, r.y2 - MIN_SIZE),
      });
    });

  const trGesture = Gesture.Pan()
    .runOnJS(true)
    .minDistance(0)
    .onUpdate(e => {
      const r = regionRef.current;
      updateRegion({
        ...r,
        x2: clamp(e.absoluteX, r.x1 + MIN_SIZE, SCREEN_W),
        y1: clamp(e.absoluteY, 0, r.y2 - MIN_SIZE),
      });
    });

  const blGesture = Gesture.Pan()
    .runOnJS(true)
    .minDistance(0)
    .onUpdate(e => {
      const r = regionRef.current;
      updateRegion({
        ...r,
        x1: clamp(e.absoluteX, 0, r.x2 - MIN_SIZE),
        y2: clamp(e.absoluteY, r.y1 + MIN_SIZE, SCREEN_H),
      });
    });

  const brGesture = Gesture.Pan()
    .runOnJS(true)
    .minDistance(0)
    .onUpdate(e => {
      const r = regionRef.current;
      updateRegion({
        ...r,
        x2: clamp(e.absoluteX, r.x1 + MIN_SIZE, SCREEN_W),
        y2: clamp(e.absoluteY, r.y1 + MIN_SIZE, SCREEN_H),
      });
    });

  const { x1, y1, x2, y2 } = region;
  const boxW = x2 - x1;
  const boxH = y2 - y1;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {/* Dimmed panels outside the scan region */}
      <View style={[styles.dim, { top: 0, left: 0, right: 0, height: y1 }]} />
      <View style={[styles.dim, { top: y2, left: 0, right: 0, bottom: 0 }]} />
      <View style={[styles.dim, { top: y1, left: 0, width: x1, height: boxH }]} />
      <View style={[styles.dim, { top: y1, left: x2, right: 0, height: boxH }]} />

      {/* Scan region border */}
      <View style={[styles.border, { top: y1, left: x1, width: boxW, height: boxH }]} />

      {/* Corner handles */}
      <GestureDetector gesture={tlGesture}>
        <View style={[styles.handle, { top: y1 - HANDLE_HALF, left: x1 - HANDLE_HALF }]} />
      </GestureDetector>
      <GestureDetector gesture={trGesture}>
        <View style={[styles.handle, { top: y1 - HANDLE_HALF, left: x2 - HANDLE_HALF }]} />
      </GestureDetector>
      <GestureDetector gesture={blGesture}>
        <View style={[styles.handle, { top: y2 - HANDLE_HALF, left: x1 - HANDLE_HALF }]} />
      </GestureDetector>
      <GestureDetector gesture={brGesture}>
        <View style={[styles.handle, { top: y2 - HANDLE_HALF, left: x2 - HANDLE_HALF }]} />
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  dim: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  border: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#FFD700',
    borderRadius: 2,
  },
  handle: {
    position: 'absolute',
    width: HANDLE_SIZE,
    height: HANDLE_SIZE,
    borderRadius: HANDLE_SIZE / 2,
    backgroundColor: '#FFD700',
    borderWidth: 2,
    borderColor: '#fff',
  },
});
