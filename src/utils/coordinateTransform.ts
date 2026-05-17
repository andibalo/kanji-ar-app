export type ScreenRect = { x: number; y: number; width: number; height: number };

export function toScreenRect(
  block: { x: number; y: number; width: number; height: number },
  frameWidth: number,
  frameHeight: number,
  previewWidth: number,
  previewHeight: number,
): ScreenRect {
  let { x: bx, y: by, width: bw, height: bh } = block;
  let fW = frameWidth;
  let fH = frameHeight;

  // Android camera sensors deliver landscape buffers even in portrait mode.
  // Rotate 90° CCW to match the portrait display (standard SENSOR_ORIENTATION=90°).
  if (frameWidth > frameHeight) {
    const newX = by;
    const newY = frameWidth - bx - bw;
    bx = newX;
    by = newY;
    [bw, bh] = [bh, bw];
    fW = frameHeight;   // effective portrait width
    fH = frameWidth;    // effective portrait height
  }

  const scaleX = previewWidth / fW;
  const scaleY = previewHeight / fH;
  const scale = Math.max(scaleX, scaleY);
  const offsetX = (scale * fW - previewWidth) / 2;
  const offsetY = (scale * fH - previewHeight) / 2;

  return {
    x: bx * scale - offsetX,
    y: by * scale - offsetY,
    width: bw * scale,
    height: bh * scale,
  };
}
