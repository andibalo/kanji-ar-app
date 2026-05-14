/**
 * Maps a bounding box from ML Kit image-space to React Native screen-space.
 *
 * ML Kit returns coordinates relative to the raw camera frame (landscape
 * native orientation on most Android sensors). VisionCamera's frame processor
 * normalises frames to portrait when the device is held upright, so:
 *   - frameWidth  = short side of the sensor (e.g. 720)
 *   - frameHeight = long  side of the sensor (e.g. 1280)
 *
 * The camera preview is rendered with resizeMode="cover", meaning the frame is
 * scaled uniformly until it fills the view, with any overflow cropped equally
 * on both sides.
 */
export type ScreenRect = { x: number; y: number; width: number; height: number };

export function toScreenRect(
  block: { x: number; y: number; width: number; height: number },
  frameWidth: number,
  frameHeight: number,
  previewWidth: number,
  previewHeight: number,
): ScreenRect {
  const scaleX = previewWidth / frameWidth;
  const scaleY = previewHeight / frameHeight;
  // "cover" uses the larger scale so the frame fills the view
  const scale = Math.max(scaleX, scaleY);

  // How much of the scaled frame sticks out beyond the preview on each axis
  const offsetX = (scale * frameWidth - previewWidth) / 2;
  const offsetY = (scale * frameHeight - previewHeight) / 2;

  return {
    x: block.x * scale - offsetX,
    y: block.y * scale - offsetY,
    width: block.width * scale,
    height: block.height * scale,
  };
}
