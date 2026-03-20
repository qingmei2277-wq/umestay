"use client";

import { useState } from "react";
import Image from "next/image";

interface PropertyGalleryProps {
  images: { id: string; url: string; is_cover: boolean }[];
  title: string;
}

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  if (images.length === 0) {
    return (
      <div className="w-full h-64 bg-gray-100 rounded-2xl flex items-center justify-center">
        <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }

  const cover = images.find((i) => i.is_cover) ?? images[0]!;
  const rest = images.filter((i) => i.id !== cover.id).slice(0, 4);

  return (
    <>
      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-80 md:h-[440px] rounded-2xl overflow-hidden">
        {/* Cover — spans left half */}
        <button
          onClick={() => setLightbox(0)}
          className="col-span-2 row-span-2 relative w-full h-full"
        >
          <Image src={cover?.url ?? ""} alt={title} fill className="object-cover hover:brightness-95 transition-all" />
        </button>

        {/* Thumbnails — right half, 2×2 */}
        {[0, 1, 2, 3].map((i) => {
          const img = rest[i];
          if (!img) {
            return (
              <div key={i} className="relative w-full h-full bg-gray-100" />
            );
          }
          const isLast = i === 3 && images.length > 5;
          return (
            <button
              key={img.id}
              onClick={() => setLightbox(i + 1)}
              className="relative w-full h-full overflow-hidden"
            >
              <Image src={img.url} alt={title} fill className="object-cover hover:brightness-95 transition-all" />
              {isLast && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">+{images.length - 5}</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-[1000] flex items-center justify-center"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 text-white w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30"
            onClick={() => setLightbox(null)}
          >
            ✕
          </button>
          <button
            className="absolute left-4 text-white w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30"
            onClick={(e) => { e.stopPropagation(); setLightbox(Math.max(0, lightbox - 1)); }}
          >
            ‹
          </button>
          <button
            className="absolute right-16 text-white w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30"
            onClick={(e) => { e.stopPropagation(); setLightbox(Math.min(images.length - 1, lightbox + 1)); }}
          >
            ›
          </button>
          <div className="relative w-full max-w-4xl h-[70vh]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[lightbox]?.url ?? cover?.url ?? ""}
              alt={title}
              fill
              className="object-contain"
            />
          </div>
          <p className="absolute bottom-4 text-white/60 text-sm">{lightbox + 1} / {images.length}</p>
        </div>
      )}
    </>
  );
}
