"use client";
import { useCallback, useRef, useState } from "react";
import Image from "next/image";

const SENSITIVITY = 10; // px of drag per frame step

export default function Spin360({ frames, alt }: { frames: string[]; alt: string }) {
  const [index, setIndex] = useState(0);
  const drag = useRef({ dragging: false, lastX: 0, accum: 0 });

  const step = useCallback(
    (deltaX: number) => {
      drag.current.accum += deltaX;
      while (drag.current.accum > SENSITIVITY) {
        drag.current.accum -= SENSITIVITY;
        setIndex((i) => (i + 1) % frames.length);
      }
      while (drag.current.accum < -SENSITIVITY) {
        drag.current.accum += SENSITIVITY;
        setIndex((i) => (i - 1 + frames.length) % frames.length);
      }
    },
    [frames.length]
  );

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    drag.current.dragging = true;
    drag.current.lastX = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!drag.current.dragging) return;
    const dx = e.clientX - drag.current.lastX;
    drag.current.lastX = e.clientX;
    step(dx);
  }
  function onPointerUp() {
    drag.current.dragging = false;
  }

  if (frames.length === 0) return null;

  return (
    <div
      className="relative h-[420px] w-full touch-none select-none rounded-2xl bg-cream/10 cursor-grab active:cursor-grabbing md:h-[560px]"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      <Image
        src={frames[index]}
        alt={alt}
        fill
        priority
        draggable={false}
        className="pointer-events-none object-contain"
      />
      <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.3em] text-white/40">
        Drag to rotate
      </p>
    </div>
  );
}
