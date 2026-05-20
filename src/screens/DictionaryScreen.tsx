import React, { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import axios from 'axios';
import type { JishoResult } from '../hooks/useJishoLookup';

type SearchState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'results'; data: JishoResult[] }
  | { status: 'empty' }
  | { status: 'error'; message: string };

function useJishoSearch() {
  const [state, setState] = useState<SearchState>({ status: 'idle' });
  const abortRef = useRef<AbortController | null>(null);

  const search = useCallback(async (query: string) => {
    const q = query.trim();
    if (!q) return;

    abortRef.current?.abort();
    abortRef.current = new AbortController();
    setState({ status: 'loading' });

    try {
      const res = await axios.get('https://jisho.org/api/v1/search/words', {
        params: { keyword: q },
        signal: abortRef.current.signal,
      });

      const entries = res.data?.data ?? [];
      if (entries.length === 0) {
        setState({ status: 'empty' });
        return;
      }

      const results: JishoResult[] = entries.slice(0, 20).map((entry: any) => ({
        word: entry.japanese?.[0]?.word ?? entry.slug ?? q,
        reading: entry.japanese?.[0]?.reading ?? '',
        definition: entry.senses?.[0]?.english_definitions?.join(', ') ?? '',
        jlpt: entry.jlpt?.[0] ?? null,
      }));

      setState({ status: 'results', data: results });
    } catch (err: any) {
      if (err?.name !== 'CanceledError' && err?.name !== 'AbortError') {
        setState({ status: 'error', message: 'Network error. Check your connection.' });
      }
    }
  }, []);

  return { state, search };
}

function ResultRow({ item }: { item: JishoResult }) {
  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <Text style={styles.word}>{item.word}</Text>
        {!!item.reading && <Text style={styles.reading}>{item.reading}</Text>}
      </View>
      <View style={styles.rowRight}>
        <Text style={styles.definition} numberOfLines={2}>{item.definition}</Text>
        {!!item.jlpt && (
          <View style={styles.jlptChip}>
            <Text style={styles.jlptText}>{item.jlpt.replace('jlpt-', '').toUpperCase()}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

export function DictionaryScreen() {
  const [query, setQuery] = useState('');
  const { state, search } = useJishoSearch();

  const handleSubmit = useCallback(() => {
    search(query);
    Keyboard.dismiss();
  }, [query, search]);

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          placeholder="Search in kanji, kana, or English…"
          placeholderTextColor="#666"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSubmit}
          returnKeyType="search"
          autoFocus
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity style={styles.searchBtn} onPress={handleSubmit} activeOpacity={0.8}>
          <Text style={styles.searchBtnText}>Search</Text>
        </TouchableOpacity>
      </View>

      {state.status === 'loading' && (
        <View style={styles.centre}>
          <ActivityIndicator size="large" color="#FFD700" />
        </View>
      )}

      {state.status === 'error' && (
        <View style={styles.centre}>
          <Text style={styles.errorText}>{state.message}</Text>
        </View>
      )}

      {state.status === 'empty' && (
        <View style={styles.centre}>
          <Text style={styles.emptyText}>No results for "{query}"</Text>
        </View>
      )}

      {state.status === 'results' && (
        <FlatList
          data={state.data}
          keyExtractor={(item, i) => `${item.word}-${i}`}
          renderItem={({ item }) => <ResultRow item={item} />}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
        />
      )}

      {state.status === 'idle' && (
        <View style={styles.centre}>
          <Text style={styles.hintText}>Search for a word in Japanese or English</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
  },
  searchRow: {
    flexDirection: 'row',
    margin: 16,
    gap: 8,
  },
  input: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#2A2A40',
    color: '#FFF',
    paddingHorizontal: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#3A3A5A',
  },
  searchBtn: {
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBtnText: {
    color: '#1A1A2E',
    fontWeight: 'bold',
    fontSize: 15,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 12,
    gap: 12,
  },
  rowLeft: {
    width: 90,
    gap: 4,
  },
  word: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  reading: {
    fontSize: 13,
    color: '#AAA',
  },
  rowRight: {
    flex: 1,
    gap: 6,
    justifyContent: 'center',
  },
  definition: {
    fontSize: 15,
    color: '#EEE',
    lineHeight: 20,
  },
  jlptChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFD700',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  jlptText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#2A2A40',
  },
  centre: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  hintText: {
    color: '#666',
    fontSize: 15,
    textAlign: 'center',
  },
  emptyText: {
    color: '#888',
    fontSize: 15,
    textAlign: 'center',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 15,
    textAlign: 'center',
  },
});
