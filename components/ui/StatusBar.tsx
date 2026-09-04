/**
 * A drawn "9:41 + Dynamic Island" bar, for the desktop/Figma-style phone
 * mockup where the device itself is a picture on a bigger screen.
 *
 * On a real phone this must NOT render: iOS already draws its own real
 * status bar above the page, so this mock stacked underneath it doubled
 * up the chrome and ate ~50px of real screen height the layout hadn't
 * budgeted for - which is what was pushing the bottom nav off-screen.
 * `.status-bar-mock` is hidden below 480px (the same breakpoint the rest
 * of the phone-shell CSS uses to tell a real phone from the mockup) and
 * only the safe-area padding survives, which is what actually keeps
 * content clear of the notch.
 */
export function StatusBar({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <div className="safe-top relative z-20 shrink-0">
      <div className="status-bar-mock relative flex h-[50px] items-center px-[22px]">
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
