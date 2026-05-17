import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { ScreenRect } from '../utils/coordinateTransform';

type Props = {
  rect: ScreenRect;
  text: string;
};

export function KanjiBoundingBox({ rect, text }: Props) {
  return (
    <View
      style={[
        styles.box,
        {
          left: rect.x,
          top: rect.y,
          width: rect.width,
          height: rect.height,
        },
      ]}
    >
      <View style={styles.label}>
        <Text style={styles.labelText}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#FFD700',
    borderRadius: 3,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    overflow: 'visible',
  },
  label: {
    position: 'absolute',
    top: -26,
    left: 0,
    backgroundColor: '#FFD700',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  labelText: {
    color: '#1A1A2E',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
