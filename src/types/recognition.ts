// Types mirroring react-native-vision-camera-ocr-plus internals
// (the library exports these via its own types, but we define them locally
//  to avoid deep import paths and keep control over the shape)

export type FrameType = {
  x: number;
  y: number;
  width: number;
  height: number;
  boundingCenterX: number;
  boundingCenterY: number;
};

export type ElementData = {
  elementText: string;
  elementFrame: FrameType;
  elementCornerPoints?: { x: number; y: number }[];
};

export type LineData = {
  lineText: string;
  lineFrame: FrameType;
  lineCornerPoints?: { x: number; y: number }[];
  lineLanguages?: string[];
  elements: ElementData[];
};

export type BlockData = {
  blockText: string;
  blockFrame: FrameType;
  blockCornerPoints?: { x: number; y: number }[];
  blockLanguages?: string[];
  lines: LineData[];
};

export type RecognizedText = {
  blocks: BlockData[];
  resultText: string;
};

export type ScanRegionPercentage = {
  left: `${number}%`;
  top: `${number}%`;
  width: `${number}%`;
  height: `${number}%`;
};
