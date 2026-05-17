import React from 'react';
import { StyleSheet, View } from 'react-native';
import { KanjiBoundingBox } from './KanjiBoundingBox';
import type { KanjiBlock } from '../utils/kanjiFilter';
import { toScreenRect } from '../utils/coordinateTransform';

type Props = {
  blocks: KanjiBlock[];
  frameWidth: number;
  frameHeight: number;
  previewWidth: number;
  previewHeight: number;
};

export function TextOverlay({
  blocks,
  frameWidth,
  frameHeight,
  previewWidth,
  previewHeight,
}: Props) {
  if (frameWidth === 0 || frameHeight === 0) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {blocks.map((block, index) => {
        const rect = toScreenRect(
          block,
          frameWidth,
          frameHeight,
          previewWidth,
          previewHeight,
        );
        return (
          <KanjiBoundingBox
            key={`${block.text}-${index}`}
            rect={rect}
            text={block.text}
          />
        );
      })}
    </View>
  );
}
