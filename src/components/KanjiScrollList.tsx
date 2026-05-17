import React from 'react';
import { FlatList, Pressable, Text, StyleSheet, View } from 'react-native';
import type { KanjiBlock } from '../utils/kanjiFilter';

type Props = {
  blocks: KanjiBlock[];
  onPress: (block: KanjiBlock) => void;
};

export function KanjiScrollList({ blocks, onPress }: Props) {
  if (blocks.length === 0) return null;

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={blocks}
        keyExtractor={(item, index) => `${item.text}-${index}`}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]}
            onPress={() => onPress(item)}
          >
            <Text style={styles.chipText}>{item.text}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 104,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    paddingVertical: 8,
  },
  listContent: {
    paddingHorizontal: 12,
    gap: 8,
  },
  chip: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    borderWidth: 1.5,
    borderColor: '#FFD700',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipPressed: {
    backgroundColor: 'rgba(255, 215, 0, 0.4)',
  },
  chipText: {
    color: '#FFD700',
    fontSize: 22,
    fontWeight: 'bold',
  },
});
