import { useEffect } from "react";
import StatusBadge from "./status-badge";
import { cn } from "../lib/cn";

export type LightboxPhoto = { tag: string; caption: string; src?: string };

function PhotoContent({ photo }: { photo: LightboxPhoto }) {
  return (
    <>
      {photo.src ? (
        <img src={photo.src} alt={photo.caption} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full items-center justify-center bg-brand-100">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#94B8A0" strokeWidth="1.4">
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <circle cx="8.5" cy="9.5" r="1.5" />
            <path d="M21 15l-5-5L5 20" />
          </svg>
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-gradient-to-t from-[rgba(0,0,0,0.8)] to-transparent px-4 py-3.5 text-left">
        <StatusBadge tone="overlay" size="sm">
          {photo.tag}
        </StatusBadge>
        <span className="text-xs leading-snug text-white">{photo.caption}</span>
      </div>
    </>
  );
}

/**
 * A click-to-open lightbox: the current photo sits large in the centre, with
 * the previous and next photos peeking out, smaller and dimmed, behind it —
 * click either side (or the arrows, or the left/right keys) to bring it forward.
 */
export default function GalleryLightbox({
  photos,
  index,
  onClose,
  onNavigate,
}: {
  photos: LightboxPhoto[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const count = photos.length;
  const prevIndex = (index - 1 + count) % count;
  const nextIndex = (index + 1) % count;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onNavigate(prevIndex);
      if (event.key === "ArrowRight") onNavigate(nextIndex);
    }
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [prevIndex, nextIndex, onClose, onNavigate]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.85)] p-5"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onNavigate(prevIndex);
        }}
        aria-label="Previous photo"
        className="absolute left-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-5"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 6l-6 6 6 6" />
        </svg>
      </button>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onNavigate(nextIndex);
        }}
        aria-label="Next photo"
        className="absolute right-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-5"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>

      <div
        className="relative flex h-[70vh] max-h-[460px] w-full max-w-3xl items-center justify-center"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => onNavigate(prevIndex)}
          aria-label="Previous photo"
          className={cn(
            "absolute left-0 hidden aspect-[4/3] w-[58%] -translate-x-[15%] scale-[0.82] overflow-hidden rounded-2xl opacity-40 transition hover:opacity-60 sm:block"
          )}
        >
          <PhotoContent photo={photos[prevIndex]} />
        </button>

        <button
          type="button"
          onClick={() => onNavigate(nextIndex)}
          aria-label="Next photo"
          className={cn(
            "absolute right-0 hidden aspect-[4/3] w-[58%] translate-x-[15%] scale-[0.82] overflow-hidden rounded-2xl opacity-40 transition hover:opacity-60 sm:block"
          )}
        >
          <PhotoContent photo={photos[nextIndex]} />
        </button>

        <div
          key={index}
          className="lightbox-pop relative z-10 aspect-[4/3] w-[85%] max-w-xl overflow-hidden rounded-2xl shadow-[0_30px_70px_-20px_rgba(0,0,0,0.6)] sm:w-[70%]"
        >
          <PhotoContent photo={photos[index]} />
        </div>
      </div>

      <span className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs font-medium text-white/70">
        {index + 1} / {count}
      </span>
    </div>
  );
}
