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
      // <div className="w-full h-64 bg-gray-100 rounded-2xl flex items-center justify-center">
      <div className="w-full h-88 md:h-[480px] bg-gray-100 rounded-2xl flex items-center justify-center">
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
      <div className="relative grid grid-cols-2 gap-2 h-88 md:h-[480px] rounded-2xl overflow-hidden">
        {/* 左边大图 */}
        <button
          onClick={() => setLightbox(0)}
          className="relative w-full h-full"
        >
          <Image src={cover?.url ?? ""} alt={title} fill className="object-cover hover:brightness-95 transition-all" />
        </button>

        {/* 右边 2x2 */}
        <div className="grid grid-cols-2 grid-rows-2 gap-2">
          {[0, 1, 2, 3].map((i) => {
            const img = rest[i];
            if (!img) {
              return <div key={i} className="relative w-full h-full bg-gray-100" />;
            }
            return (
              <button
                key={img.id}
                onClick={() => setLightbox(i + 1)}
                className="relative w-full h-full overflow-hidden"
              >
                <Image src={img.url} alt={title} fill className="object-cover hover:brightness-95 transition-all" />
              </button>
            );
          })}
        </div>

        {/* 右下角「显示所有照片」按钮 */}
        <button
          onClick={() => setLightbox(0)}
          className="absolute bottom-4 right-4 flex items-center gap-2 bg-white text-gray-900 text-sm font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-gray-100 transition-colors border border-gray-200"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
          </svg>
          显示所有照片
        </button>
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
