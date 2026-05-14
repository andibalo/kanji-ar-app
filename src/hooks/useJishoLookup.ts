import { useCallback, useRef, useState } from 'react';
import axios from 'axios';

export type JishoResult = {
  word: string;
  reading: string;
  definition: string;
  jlpt: string | null;
};

type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: JishoResult }
  | { status: 'error'; message: string };

const cache = new Map<string, JishoResult>();

export function useJishoLookup() {
  const [state, setState] = useState<State>({ status: 'idle' });
  const abortRef = useRef<AbortController | null>(null);

  const lookup = useCallback(async (word: string) => {
    if (cache.has(word)) {
      setState({ status: 'success', data: cache.get(word)! });
      return;
    }

    // Cancel any in-flight request
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setState({ status: 'loading' });
    try {
      const res = await axios.get('https://jisho.org/api/v1/search/words', {
        params: { keyword: word },
        signal: abortRef.current.signal,
      });

      const entry = res.data?.data?.[0];
      if (!entry) {
        setState({ status: 'error', message: 'Not found' });
        return;
      }

      const result: JishoResult = {
        word: entry.japanese?.[0]?.word ?? word,
        reading: entry.japanese?.[0]?.reading ?? '',
        definition: entry.senses?.[0]?.english_definitions?.join(', ') ?? '',
        jlpt: entry.jlpt?.[0] ?? null,
      };

      cache.set(word, result);
      setState({ status: 'success', data: result });
    } catch (err: any) {
      if (err?.name !== 'CanceledError' && err?.name !== 'AbortError') {
        setState({ status: 'error', message: 'Network error' });
      }
    }
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setState({ status: 'idle' });
  }, []);

  return { state, lookup, reset };
}
