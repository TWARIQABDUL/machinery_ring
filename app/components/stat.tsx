/** A big value + small label, used in the dark stats bands (Home, Our Work). */
export default function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-display text-3xl font-extrabold text-white md:text-[34px]">{value}</span>
      <span className="text-sm text-[#A9CFB6]">{label}</span>
    </div>
  );
}
