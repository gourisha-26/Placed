/**
 * iOS status bar with the Dynamic Island.
 * `tone` follows the screen behind it - dark ink on light screens,
 * white on the blue splash.
 */
export function StatusBar({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <div className="safe-top relative z-20 h-[50px] shrink-0">
      <div className="relative flex h-[50px] items-center px-[22px]">
        <span
          className={`text-[15px] font-semibold ${
            tone === "light" ? "text-white" : "text-navy"
          }`}
        >
          9:41
        </span>
        <div className="absolute left-1/2 top-[10px] h-[31px] w-[110px] -translate-x-1/2 rounded-full bg-navy" />
      </div>
    </div>
  );
}
