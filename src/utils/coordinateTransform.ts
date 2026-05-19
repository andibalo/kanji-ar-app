export type ScreenRect = { x: number; y: number; width: number; height: number };

export function toScreenRect(
  block: { x: number; y: number; width: number; height: number },
  frameWidth: number,
  frameHeight: number,
  previewWidth: number,
  previewHeight: number,
): ScreenRect {
  const { x: bx, y: by, width: bw, height: bh } = block;

  // The OCR plugin returns portrait-space coordinates regardless of sensor orientation.
  // Use the shorter frame dimension as portrait width, longer as portrait height.
  const fW = Math.min(frameWidth, frameHeight);
  const fH = Math.max(frameWidth, frameHeight);
  const scale = Math.max(previewWidth / fW, previewHeight / fH);
  const offsetX = (scale * fW - previewWidth) / 2;
  const offsetY = (scale * fH - previewHeight) / 2;
  return {
    x: bx * scale - offsetX,
    y: by * scale - offsetY,
    width: bw * scale,
    height: bh * scale,
  };
}
