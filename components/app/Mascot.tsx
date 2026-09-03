/**
 * The placED companion. Same construction as the Figma component set
 * (Companion / State=*), redrawn with the v2 palette: the lilac body
 * from v1 became the blue tints, and the near-black ink became navy.
 *
 * The face is the only thing that changes between states, so the body,
 * ears and paws are shared and each state supplies eyes, mouth and an
 * optional prop.
 */

const BODY = "#DCE9FF";
const SHADE = "#A9C4F5";
const PAW = "#EEF4FF";
const BLUSH = "#FFDCBA";
const INK = "#11182B";

export type MascotState = "idle" | "happy" | "waiting" | "cheer" | "sad" | "working";

const EYES = {
  open: (
    <>
      <circle cx="48" cy="64" r="4.6" fill={INK} />
      <circle cx="72" cy="64" r="4.6" fill={INK} />
      <circle cx="49.6" cy="62.4" r="1.5" fill="#fff" />
      <circle cx="73.6" cy="62.4" r="1.5" fill="#fff" />
    </>
  ),
  happy: (
    <path
      d="M42 66c2.6-5 8.4-5 11 0M67 66c2.6-5 8.4-5 11 0"
      stroke={INK}
      strokeWidth="3.4"
      strokeLinecap="round"
      fill="none"
    />
  ),
  closed: (
    <path
      d="M42 64h11M67 64h11"
      stroke={INK}
      strokeWidth="3.4"
      strokeLinecap="round"
    />
  ),
  wide: (
    <>
      <circle cx="48" cy="64" r="6.4" fill={INK} />
      <circle cx="72" cy="64" r="6.4" fill={INK} />
      <circle cx="50.2" cy="61.6" r="2.1" fill="#fff" />
      <circle cx="74.2" cy="61.6" r="2.1" fill="#fff" />
    </>
  ),
  sad: (
    <path
      d="M42.5 62.5c2.6 4.4 8.4 4.4 11 0M66.5 62.5c2.6 4.4 8.4 4.4 11 0"
      stroke={INK}
      strokeWidth="3.2"
      strokeLinecap="round"
      fill="none"
    />
  ),
};

const MOUTH = {
  smile: (
    <path
      d="M55.5 74c2.4 3.2 6.6 3.2 9 0"
      stroke={INK}
      strokeWidth="2.6"
      strokeLinecap="round"
      fill="none"
    />
  ),
  open: <path d="M54 74c0 5 12 5 12 0z" fill={INK} />,
  wide: (
    <path
      d="M52 73c3 7 13 7 16 0"
      stroke={INK}
      strokeWidth="2.8"
      strokeLinecap="round"
      fill="none"
    />
  ),
  flat: (
    <path
      d="M55 76h10"
      stroke={INK}
      strokeWidth="2.6"
      strokeLinecap="round"
    />
  ),
};

const STATES: Record<
  MascotState,
  { eyes: keyof typeof EYES; mouth: keyof typeof MOUTH; ears?: "down"; prop?: React.ReactNode }
> = {
  idle: { eyes: "open", mouth: "smile" },
  happy: { eyes: "happy", mouth: "open" },
  waiting: {
    eyes: "closed",
    mouth: "smile",
    prop: (
      <>
        <path
          d="M92 30h11l-11 12h11"
          stroke={SHADE}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M84 16h7l-7 8h7"
          stroke={SHADE}
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </>
    ),
  },
  cheer: {
    eyes: "wide",
    mouth: "wide",
    prop: (
      <path
        d="M60 8v9M38 14l3.6 7M82 14l-3.6 7M22 32l7 3M98 32l-7 3"
        stroke={SHADE}
        strokeWidth="3"
        strokeLinecap="round"
      />
    ),
  },
  sad: { eyes: "sad", mouth: "flat", ears: "down" },
  // reading a posting - the magnifier is the whole point of the state
  working: {
    eyes: "happy",
    mouth: "smile",
    prop: (
      <>
        <circle
          cx="96"
          cy="26"
          r="11"
          stroke="#1B4FD8"
          strokeWidth="4"
          fill="none"
        />
        <path
          d="M104 34l9 9"
          stroke="#1B4FD8"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
      </>
    ),
  },
};

export function Mascot({
  state = "idle",
  size = 96,
  className = "",
  style,
}: {
  state?: MascotState;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const s = STATES[state];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      className={className}
      style={style}
      aria-hidden
    >
      {/* tail */}
      <path
        d="M93 90c13-3 14-18 5-25"
        stroke={SHADE}
        strokeWidth="7.5"
        strokeLinecap="round"
        fill="none"
      />

      {s.ears === "down" ? (
        <>
          <path d="M30 50 L20 36 L44 40 Z" fill={BODY} />
          <path d="M90 50 L100 36 L76 40 Z" fill={BODY} />
          <path d="M31 47 L25 40 L40 42 Z" fill={BLUSH} />
          <path d="M89 47 L95 40 L80 42 Z" fill={BLUSH} />
        </>
      ) : (
        <>
          <path d="M34 46 L29 24 L49 35 Z" fill={BODY} />
          <path d="M86 46 L91 24 L71 35 Z" fill={BODY} />
          <path d="M35.5 43 L33 31 L44.5 36.5 Z" fill={BLUSH} />
          <path d="M84.5 43 L87 31 L75.5 36.5 Z" fill={BLUSH} />
        </>
      )}

      <ellipse cx="60" cy="69" rx="36" ry="31" fill={BODY} />
      <ellipse cx="37.5" cy="75" rx="5.4" ry="3.5" fill={BLUSH} />
      <ellipse cx="82.5" cy="75" rx="5.4" ry="3.5" fill={BLUSH} />

      {EYES[s.eyes]}
      {MOUTH[s.mouth]}

      <ellipse cx="46" cy="96" rx="9.5" ry="5.2" fill={PAW} />
      <ellipse cx="74" cy="96" rx="9.5" ry="5.2" fill={PAW} />

      {s.prop}
    </svg>
  );
}
