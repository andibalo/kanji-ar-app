import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BookOpen, Settings, Play, Pause } from 'lucide-react-native';

type Props = {
  isScanning: boolean;
  onToggleScan: () => void;
  onDictionary: () => void;
  onSettings: () => void;
};

export function BottomNavBar({ isScanning, onToggleScan, onDictionary, onSettings }: Props) {
  const { bottom } = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: bottom + 8 }]}>
      <TouchableOpacity style={styles.sideBtn} onPress={onDictionary} activeOpacity={0.7}>
        <BookOpen size={26} color="#FFD700" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.centerBtn} onPress={onToggleScan} activeOpacity={0.85}>
        {isScanning
          ? <Pause size={28} color="#1A1A2E" strokeWidth={2.5} />
          : <Play size={28} color="#1A1A2E" strokeWidth={2.5} fill="#1A1A2E" />
        }
      </TouchableOpacity>

      <TouchableOpacity style={styles.sideBtn} onPress={onSettings} activeOpacity={0.7}>
        <Settings size={26} color="#FFD700" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(26, 26, 46, 0.92)',
    paddingTop: 12,
    paddingHorizontal: 24,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255, 215, 0, 0.2)',
  },
  sideBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  centerBtn: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -22,
    elevation: 6,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },
});
