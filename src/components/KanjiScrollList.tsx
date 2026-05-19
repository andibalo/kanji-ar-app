import React from 'react';
import { FlatList, Pressable, Text, StyleSheet, View } from 'react-native';

type Props = {
  words: string[];
  onPress: (word: string) => void;
};

export function KanjiScrollList({ words, onPress }: Props) {
  if (words.length === 0) return null;

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={words}
        keyExtractor={(item, index) => `${item}-${index}`}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]}
            onPress={() => onPress(item)}
          >
            <Text style={styles.chipText}>{item}</Text>
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
