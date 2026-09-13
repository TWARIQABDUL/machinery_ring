import { cn } from "../lib/cn";

/** A standalone "no photo yet" placeholder block — optionally with a caption of what it will show. */
export default function PendingPhoto({ caption, className }: { caption?: string; className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 bg-brand-100 text-[#6E8C79]",
        caption ? "flex-col px-4 text-center" : "text-xs",
        className
      )}
    >
      <svg width={caption ? 34 : 24} height={caption ? 34 : 24} viewBox="0 0 24 24" fill="none" stroke="#94B8A0" strokeWidth="1.4">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="8.5" cy="9.5" r="1.5" />
        <path d="M21 15l-5-5L5 20" />
      </svg>
      {caption ? <span className="max-w-[22em] text-[13px]">{caption}</span> : "Photo pending"}
    </div>
  );
}
