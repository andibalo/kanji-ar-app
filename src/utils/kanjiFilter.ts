import type { BlockData } from '../types/recognition';

// CJK Unified Ideographs + CJK Extension A
const KANJI_REGEX = /[\u4E00-\u9FFF\u3400-\u4DBF]/g;
const PURE_KANJI_REGEX = /^[\u4E00-\u9FFF\u3400-\u4DBF\s]+$/;

export type KanjiBlock = {
  text: string;      // extracted kanji chars — used as the bounding-box label
  blockText: string; // full OCR sentence — used by kuromoji for tokenization
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
      result.push({ text, blockText: text, x, y, width, height });
      continue;
    }

    // Strategy 2: Mixed block — label shows extracted kanji; blockText keeps full sentence for kuromoji
    const matches = text.match(KANJI_REGEX);
    if (matches && matches.length >= 1) {
      result.push({ text: matches.join(''), blockText: text, x, y, width, height });
    }
  }

  return result;
}
