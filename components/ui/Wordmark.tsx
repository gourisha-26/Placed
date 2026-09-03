/**
 * The wordmark lockup: "plac" in Medium, "ED" in Bold, then the dot.
 * Kept as a component so the two-weight split is never retyped by hand.
 */
export function Wordmark({
  className = "",
  tone = "light",
  dot = true,
}: {
  className?: string;
  tone?: "light" | "dark";
  /** the logo dot reads as a full stop when the mark sits inside a sentence */
  dot?: boolean;
}) {
  const ink = tone === "light" ? "text-white" : "text-navy";
  return (
    <span className={`${ink} ${className}`}>
      <span className="font-medium">plac</span>
      <span className="font-extrabold text-orange">ED</span>
      {dot && <span className="font-extrabold text-orange">.</span>}
    </span>
  );
}
