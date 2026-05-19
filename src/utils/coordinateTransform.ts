export type ScreenRect = { x: number; y: number; width: number; height: number };

export function toScreenRect(
  block: { x: number; y: number; width: number; height: number },
  frameWidth: number,
  frameHeight: number,
  previewWidth: number,
  previewHeight: number,
): ScreenRect {
  const { x: bx, y: by, width: bw, height: bh } = block;

  const scale = Math.max(previewWidth / frameWidth, previewHeight / frameHeight);
  const offsetX = (scale * frameWidth - previewWidth) / 2;
  const offsetY = (scale * frameHeight - previewHeight) / 2;

  return {
    x: bx * scale - offsetX,
    y: by * scale - offsetY,
    width: bw * scale,
    height: bh * scale,
  };
}
