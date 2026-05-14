import type { BlockData } from '../types/recognition';

// CJK Unified Ideographs + CJK Extension A
const KANJI_REGEX = /[\u4E00-\u9FFF\u3400-\u4DBF]/g;
const PURE_KANJI_REGEX = /^[\u4E00-\u9FFF\u3400-\u4DBF\s]+$/;

export type KanjiBlock = {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export function filterKanjiBlocks(blocks: BlockData[]): KanjiBlock[] {
  const result: KanjiBlock[] = [];

  for (const block of blocks) {
    const text = block.blockText;
    const { boundingCenterX, boundingCenterY, width, height } = block.blockFrame;
    // x/y in FrameType are center coordinates; convert to top-left for rendering
    const x = boundingCenterX - width / 2;
    const y = boundingCenterY - height / 2;

    // Strategy 1: Block contains only kanji (and whitespace)
    if (PURE_KANJI_REGEX.test(text)) {
      result.push({ text, x, y, width, height });
      continue;
    }

    // Strategy 2: Mixed block — extract any kanji present
    const matches = text.match(KANJI_REGEX);
    if (matches && matches.length >= 1) {
      result.push({ text: matches.join(''), x, y, width, height });
    }
  }

  return result;
}
