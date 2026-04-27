// Acute brand primitives — monogram, lockup, etc.
// Monogram: navy square with white triangle cutout (rotated, off-center, sharp).

function AcuteMark({ size = 24, fg = "#0E1E3A", cut = "#ffffff" }) {
  // square with a triangular notch on the lower-right edge
  const s = size;
  return (
    <svg
      className="acute-mark"
      width={s}
      height={s}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M0 0 H32 V32 H0 Z M32 11 L18 32 L32 32 Z"
        fill={fg}
        fillRule="evenodd"
      />
    </svg>
  );
}

function AcuteLockup({ size = 22, fg = "#0E1E3A", cut = "#ffffff", showWord = true, secondary = "logistics" }) {
  return (
    <span className="acute-lockup">
      <AcuteMark size={size} fg={fg} cut={cut} />
      {showWord && (
        <span
          className="acute-wordmark"
          style={{ color: fg, fontSize: Math.round(size * 0.72), lineHeight: 1, letterSpacing: "0.01em" }}
        >
          acute{secondary && <span style={{ opacity: 0.55, marginLeft: 4 }}>{secondary}</span>}
        </span>
      )}
    </span>
  );
}

// tiny inline icons
function Icon({ name, size = 16, color = "currentColor", strokeWidth = 1.5 }) {
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "plus": return <svg {...p}><path d="M12 5v14M5 12h14"/></svg>;
    case "search": return <svg {...p}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>;
    case "inbox": return <svg {...p}><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11Z"/></svg>;
    case "calendar": return <svg {...p}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>;
    case "star": return <svg {...p}><path d="M12 2 14.6 9 22 9 16 13.5 18 21 12 16.5 6 21 8 13.5 2 9 9.4 9Z"/></svg>;
    case "tag": return <svg {...p}><path d="M20.59 13.41 11 22l-9-9 9-9 9 1z"/><circle cx="7.5" cy="7.5" r="0.5" fill={color}/></svg>;
    case "flag": return <svg {...p}><path d="M4 22V4M4 4h13l-2 4 2 4H4"/></svg>;
    case "chev-down": return <svg {...p}><path d="m6 9 6 6 6-6"/></svg>;
    case "more": return <svg {...p}><circle cx="5" cy="12" r="1" fill={color}/><circle cx="12" cy="12" r="1" fill={color}/><circle cx="19" cy="12" r="1" fill={color}/></svg>;
    case "settings": return <svg {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.36.16.66.42.87.74"/></svg>;
    case "check": return <svg {...p}><path d="m20 6-11 11-5-5"/></svg>;
    case "x": return <svg {...p}><path d="M18 6 6 18M6 6l12 12"/></svg>;
    case "filter": return <svg {...p}><path d="M3 6h18M6 12h12M10 18h4"/></svg>;
    case "logout": return <svg {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>;
    case "user": return <svg {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>;
    case "list": return <svg {...p}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>;
    case "trash": return <svg {...p}><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>;
    default: return null;
  }
}

Object.assign(window, { AcuteMark, AcuteLockup, Icon });
