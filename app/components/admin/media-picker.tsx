import { useEffect, useState } from "react";
import { cn } from "../../lib/cn";

type Preview = { url: string; type: "image" | "video"; name: string };

/**
 * A multi-file picker for photos + an optional video: shows local previews of
 * whatever's currently selected (before anything uploads), and lets the admin
 * click one image to mark it as the main display photo. The browser submits
 * the real files straight from the file input as usual — this only adds the
 * preview strip and a hidden "primary_index" field recording which preview
 * (by selection order) was clicked, or nothing if none was.
 */
export default function MediaPicker({ name = "media", hint }: { name?: string; hint?: string }) {
  const [previews, setPreviews] = useState<Preview[]>([]);
  const [primaryIndex, setPrimaryIndex] = useState<number | null>(null);

  // Revoke object URLs when they're replaced or the component unmounts, so
  // selecting a new batch of files doesn't leak the previous one's previews.
  useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [previews]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    previews.forEach((p) => URL.revokeObjectURL(p.url));
    const files = Array.from(event.target.files ?? []);
    setPreviews(
      files.map((file) => ({
        url: URL.createObjectURL(file),
        type: file.type.startsWith("video/") ? "video" : "image",
        name: file.name,
      }))
    );
    setPrimaryIndex(null);
  }

  return (
    <div className="flex flex-col gap-3">
      <label className="flex flex-col gap-1.5 text-[13px] font-semibold text-ink">
        Photos & video
        <input
          type="file"
          name={name}
          multiple
          accept="image/*,video/*"
          onChange={handleChange}
          className="rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink file:mr-3 file:rounded-md file:border-0 file:bg-brand-50 file:px-3 file:py-1.5 file:text-[13px] file:font-semibold file:text-brand-700"
        />
        {hint && <span className="text-[12px] font-normal text-muted-2">{hint}</span>}
      </label>

      <input type="hidden" name="primary_index" value={primaryIndex ?? ""} />

      {previews.length > 0 && (
        <div className="flex flex-wrap gap-2.5">
          {previews.map((preview, i) => (
            <button
              key={i}
              type="button"
              disabled={preview.type !== "image"}
              onClick={() => setPrimaryIndex(i)}
              title={preview.type === "image" ? "Set as main photo" : preview.name}
              className={cn(
                "relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 bg-brand-50",
                preview.type === "image" && (i === primaryIndex ? "border-brand-600" : "border-line hover:border-brand-200")
              )}
            >
              {preview.type === "image" ? (
                <img src={preview.url} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-1 text-brand-700">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7Z" />
                  </svg>
                  <span className="text-[9px] font-semibold uppercase">Video</span>
                </div>
              )}
              {i === primaryIndex && (
                <span className="absolute right-1 top-1 rounded-full bg-brand-600 px-1.5 py-0.5 text-[9px] font-bold text-white">
                  MAIN
                </span>
              )}
            </button>
          ))}
        </div>
      )}
      {previews.some((p) => p.type === "image") && (
        <p className="text-[12px] text-muted-2">
          Click a photo above to set it as the main image shown on the listing and as the default photo. Leave none
          selected to use the first photo automatically.
        </p>
      )}
    </div>
  );
}
