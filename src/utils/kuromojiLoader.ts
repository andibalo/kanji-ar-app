import RNFS from 'react-native-fs';
import kuromoji from 'kuromoji';
import type { Tokenizer, IpadicFeatures } from 'kuromoji';

const DICT_FILES = [
  'base.dat.gz',
  'check.dat.gz',
  'tid.dat.gz',
  'tid_pos.dat.gz',
  'tid_map.dat.gz',
  'cc.dat.gz',
  'unk.dat.gz',
  'unk_pos.dat.gz',
  'unk_map.dat.gz',
  'unk_char.dat.gz',
  'unk_compat.dat.gz',
  'unk_invoke.dat.gz',
];

// Filesystem path used for RNFS copy operations
const DEST_DIR = `${RNFS.DocumentDirectoryPath}/kuromoji/`;
// file:// URL used as kuromoji dicPath so XMLHttpRequest can load the files
const DICT_URL = `file://${RNFS.DocumentDirectoryPath}/kuromoji/`;

let tokenizer: Tokenizer<IpadicFeatures> | null = null;
let initPromise: Promise<void> | null = null;

export function initTokenizer(): Promise<void> {
  if (tokenizer) return Promise.resolve();
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const dirExists = await RNFS.exists(DEST_DIR);
    if (!dirExists) {
      await RNFS.mkdir(DEST_DIR);
      for (const f of DICT_FILES) {
        await RNFS.copyFileAssets(`kuromoji/${f}`, `${DEST_DIR}${f}`);
      }
      console.log('[Kuromoji] dict copied to document directory');
    }
    await new Promise<void>((resolve, reject) => {
      kuromoji.builder({ dicPath: DICT_URL }).build((err, t) => {
        if (err) { reject(err); }
        else { tokenizer = t; resolve(); }
      });
    });
    console.log('[Kuromoji] tokenizer ready');
  })();

  return initPromise;
}

export function tokenize(text: string): IpadicFeatures[] {
  return tokenizer ? tokenizer.tokenize(text) : [];
}
