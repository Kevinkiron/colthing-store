import fs from "fs";
import path from "path";

// A 360° product spin is made of a fixed sequence of real photos, shot
// rotating a garment in even steps (see public/spin/README.md for the
// shooting guide). We require the full set before turning the homepage
// section on, so it never shows a half-broken rotation.
export const SPIN_FRAME_COUNT = 24;
const SPIN_DIR = "spin";

export function getSpinFrames(): string[] {
  const dir = path.join(process.cwd(), "public", SPIN_DIR);
  const frames: string[] = [];

  for (let i = 1; i <= SPIN_FRAME_COUNT; i++) {
    const filename = `frame-${String(i).padStart(2, "0")}.jpg`;
    if (fs.existsSync(path.join(dir, filename))) {
      frames.push(`/${SPIN_DIR}/${filename}`);
    }
  }

  return frames.length === SPIN_FRAME_COUNT ? frames : [];
}
