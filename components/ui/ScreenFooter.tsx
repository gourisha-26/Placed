import type { ReactNode } from "react";

/**
 * Shared footer for the onboarding screens.
 *
 * The secondary row is always reserved, even when empty, so the primary
 * button lands at exactly the same height on every screen — with or
 * without a "Skip for now" beneath it. Positioning each screen's footer
 * separately is what let them drift apart.
 */
export function ScreenFooter({
  children,
  secondary,
}: {
  children: ReactNode;
  secondary?: ReactNode;
}) {
  return (
    <div className="footer-inset shrink-0 px-[20px] pt-[18px]">
      {children}
      <div className="mt-[14px] flex h-[18px] items-center justify-center">
        {secondary}
      </div>
    </div>
  );
}
