# 360° Product Spin — Photo Guide

This folder powers the "Drag to rotate" section on the homepage. It is off
by default and turns on automatically once all 24 photos below are present.

## What to shoot

Pick one finished garment (on a mannequin, dress form, or a hanger against a
plain wall) and take **24 photos**, rotating the garment (or walking around
it) in even **15° steps** for a full 360° turn.

Tips for a clean result:

- Keep the camera at the same height and distance for every shot — use a
  tripod or rest your phone on something stable if you can.
- Keep the background and lighting identical across all 24 shots (a plain
  wall or backdrop works best — avoid moving shadows).
- Center the garment in the frame the same way each time.
- Turn the garment/mannequin a small, even amount between each photo
  (a rotating turntable makes this effortless; otherwise mark 15° steps on
  the floor).

## File names

Export/crop the photos to the same aspect ratio, then name them in order:

```
frame-01.jpg
frame-02.jpg
frame-03.jpg
...
frame-24.jpg
```

Two-digit numbers, in order around the rotation. Drop all 24 files directly
into this `public/spin/` folder (next to this README) and commit/push as
usual — no code changes needed. The homepage section will appear the next
time the site builds, once it detects all 24 files.

If you shoot a different garment later, just replace these 24 files with
the new photos, keeping the same names.
