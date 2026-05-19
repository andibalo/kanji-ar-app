import { tokenize } from './kuromojiLoader';

const KANJI_RE = /[一-鿿㐀-䶿]/;
// Fallback when tokenizer not yet ready: kanji chars + optional trailing kana
const FALLBACK_RE = /[一-鿿㐀-䶿]+[぀-ゟ゠-ヿ]*/g;

export function extractKanjiWords(text: string): string[] {
  const tokens = tokenize(text);
  if (tokens.length > 0) {
    return tokens
      .filter(t => KANJI_RE.test(t.surface_form))
      .map(t => t.surface_form);
  }
  return text.match(FALLBACK_RE) ?? [];
}
