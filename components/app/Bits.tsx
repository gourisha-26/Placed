/** Small pieces shared by Home and Journey. */

export function SectionHeading({
  title,
  count,
  size = "lg",
}: {
  title: string;
  count?: number;
  size?: "lg" | "sm";
}) {
  return (
    <div className="flex items-center gap-[8px]">
      <h2
        className={`flex-1 font-extrabold tracking-[-0.01em] text-navy ${
          size === "lg" ? "text-[20px]" : "text-[16px]"
        }`}
      >
        {title}
      </h2>
      {count !== undefined && (
        <span className="text-[12.5px] font-semibold text-grey">{count}</span>
      )}
    </div>
  );
}

/**
 * Explains the avatar and dot tint. Sits once per screen, above the
 * first card - repeating a key is how a legend starts feeling like
 * clutter.
 */
export function PriorityLegend() {
  const items = [
    { label: "High priority", cls: "bg-orange" },
    { label: "Medium priority", cls: "bg-brand" },
    { label: "Low priority", cls: "bg-strong" },
  ];
  return (
    <div className="flex items-center gap-[16px]">
      {items.map((i) => (
        <span key={i.label} className="flex items-center gap-[6px]">
          <span className={`h-[12px] w-[3px] rounded-full ${i.cls}`} />
          <span className="text-[11.5px] text-grey">{i.label}</span>
        </span>
      ))}
    </div>
  );
}
