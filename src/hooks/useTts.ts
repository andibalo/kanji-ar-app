import { useCallback, useEffect, useRef, useState } from 'react';
import Speech from '@mhpdev/react-native-speech';

Speech.configure({ language: 'ja-JP' });

const resetRegistry = new Set<() => void>();

export function useTts() {
  const [speaking, setSpeaking] = useState(false);
  const utteranceId = useRef<string | null>(null);

  useEffect(() => {
    const reset = () => {
      utteranceId.current = null;
      setSpeaking(false);
    };
    resetRegistry.add(reset);

    const onFinish = ({ id }: { id: string }) => {
      if (id === utteranceId.current) setSpeaking(false);
    };
    const onError = ({ id }: { id: string }) => {
      if (id === utteranceId.current) setSpeaking(false);
    };

    Speech.onFinish(onFinish);
    Speech.onError(onError);

    return () => {
      resetRegistry.delete(reset);
      Speech.stop();
    };
  }, []);

  const speak = useCallback(async (text: string) => {
    resetRegistry.forEach(reset => reset());
    await Speech.stop();
    const id = await Speech.speak(text, { language: 'ja-JP' });
    utteranceId.current = id;
    setSpeaking(true);
  }, []);

  return { speak, speaking };
}
