"use client";
import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

export type LightboxImage = { url: string; alt?: string };

// Fullscreen zoomed viewer with next/prev navigation. Can be used on its own
// (controlled open/close from a parent, e.g. a "click main image to zoom"
// button) or via the <ImageLightbox> grid below.
export function ImageZoomModal({
  images,
  initialIndex = 0,
  onClose,
}: {
  images: LightboxImage[];
  initialIndex?: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(initialIndex);
  if (images.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 px-4 py-10"
      onClick={onClose}
    >
      <button onClick={onClose} aria-label="Close" className="absolute right-5 top-5 text-white/80 transition hover:text-white">
        <X className="h-7 w-7" />
      </button>

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIndex((i) => (i - 1 + images.length) % images.length);
            }}
            aria-label="Previous image"
            className="absolute left-4 text-white/80 transition hover:text-white md:left-8"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIndex((i) => (i + 1) % images.length);
            }}
            aria-label="Next image"
            className="absolute right-4 text-white/80 transition hover:text-white md:right-8"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
        </>
      )}

      <div className="relative h-full max-h-[85vh] w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
        <Image src={images[index].url} alt={images[index].alt ?? ""} fill className="object-contain" sizes="100vw" />
      </div>
    </div>
  );
}

// A grid of clickable image thumbnails that open into the fullscreen zoomed
// viewer above. Used anywhere a customer should be able to see a fabric or
// garment photo in more detail than a small thumbnail allows.
export default function ImageLightbox({
  images,
  className,
  itemClassName,
}: {
  images: LightboxImage[];
  className?: string;
  itemClassName?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (images.length === 0) return null;

  return (
    <>
      <div className={className}>
        {images.map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setOpenIndex(i)}
            className={cn("group relative overflow-hidden", itemClassName)}
            aria-label="View larger image"
          >
            <Image src={img.url} alt={img.alt ?? ""} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
            <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/20 group-hover:opacity-100">
              <ZoomIn className="h-6 w-6 text-white drop-shadow" />
            </span>
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <ImageZoomModal images={images} initialIndex={openIndex} onClose={() => setOpenIndex(null)} />
      )}
    </>
  );
}
