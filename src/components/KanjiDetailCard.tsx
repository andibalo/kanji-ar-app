import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  PanResponder,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Volume2 } from 'lucide-react-native';
import type { JishoResult } from '../hooks/useJishoLookup';
import { useTts } from '../hooks/useTts';

type LookupState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: JishoResult }
  | { status: 'error'; message: string };

type Props = {
  state: LookupState;
  onDismiss: () => void;
};

export function KanjiDetailCard({ state, onDismiss }: Props) {
  const { bottom: bottomInset } = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(300)).current;
  const dragOffset = useRef(new Animated.Value(0)).current;
  const { speak, speaking } = useTts();

  const isVisible = state.status !== 'idle';

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: isVisible ? 0 : 300,
      useNativeDriver: true,
      bounciness: 4,
    }).start();
  }, [isVisible, slideAnim]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, { dy }) => dy > 5,
      onPanResponderMove: (_, { dy }) => {
        if (dy > 0) dragOffset.setValue(dy);
      },
      onPanResponderRelease: (_, { dy, vy }) => {
        if (dy > 100 || vy > 0.5) {
          Animated.spring(slideAnim, { toValue: 300, useNativeDriver: true }).start(() => {
            dragOffset.setValue(0);
            onDismiss();
          });
        } else {
          dragOffset.setValue(0);
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 4,
          }).start();
        }
      },
    }),
  ).current;

  if (state.status === 'idle') return null;

  return (
    <Animated.View
      style={[
        styles.card,
        {
          bottom: 56 + bottomInset,
          paddingBottom: 24,
          transform: [{ translateY: Animated.add(slideAnim, dragOffset) }],
        },
      ]}
      {...panResponder.panHandlers}
    >
      <View style={styles.handle} />

      {state.status === 'loading' && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#FFD700" />
        </View>
      )}

      {state.status === 'error' && (
        <View style={styles.center}>
          <Text style={styles.errorText}>{state.message}</Text>
        </View>
      )}

      {state.status === 'success' && (
        <View style={styles.content}>
          <View style={styles.kanjiRow}>
            <Text style={styles.kanji}>{state.data.word}</Text>
            <TouchableOpacity
              style={styles.ttsBtn}
              onPress={() => speak(state.data.reading || state.data.word)}
              activeOpacity={0.7}
            >
              <Volume2 size={24} color={speaking ? '#FFD700' : '#ffffff'} />
            </TouchableOpacity>
          </View>
          {!!state.data.reading && (
            <Text style={styles.reading}>{state.data.reading}</Text>
          )}
          {!!state.data.jlpt && (
            <View style={styles.jlptChip}>
              <Text style={styles.jlptText}>
                {state.data.jlpt.toUpperCase()}
              </Text>
            </View>
          )}
          <Text style={styles.definition}>{state.data.definition}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.closeBtn} onPress={onDismiss}>
        <Text style={styles.closeBtnText}>✕</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#1A1A2E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 12,
    minHeight: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 16,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#555',
    marginBottom: 16,
  },
  center: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  content: {
    gap: 8,
  },
  kanjiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ttsBtn: {
    padding: 6,
    paddingTop: 12

  },
  kanji: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  reading: {
    fontSize: 18,
    color: '#CCCCCC',
  },
  jlptChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFD700',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  jlptText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  definition: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 22,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 20,
    padding: 8,
  },
  closeBtnText: {
    color: '#888',
    fontSize: 18,
  },
});
