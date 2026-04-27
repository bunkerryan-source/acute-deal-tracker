import Image from "next/image";

interface AcuteMarkProps {
  size?: number;
  className?: string;
}

export function AcuteMark({ size = 24, className = "" }: AcuteMarkProps) {
  return (
    <Image
      src="/brand/acute-mark.svg"
      alt=""
      width={size}
      height={size}
      className={className}
      priority
    />
  );
}

type LockupVariant = "navy" | "white" | "black";

interface AcuteLockupProps {
  size?: number;
  variant?: LockupVariant;
  secondary?: string;
}

export function AcuteLockup({
  size = 22,
  variant = "navy",
  secondary = "logistics",
}: AcuteLockupProps) {
  const fg =
    variant === "white" ? "#fff" : variant === "black" ? "#0B0B0B" : "#0E1E3A";
  const filter = variant === "white" ? "brightness(0) invert(1)" : undefined;

  return (
    <span className="inline-flex items-center gap-2">
      <Image
        src="/brand/acute-mark.svg"
        alt="Acute Logistics"
        width={size}
        height={size}
        style={filter ? { filter } : undefined}
        priority
      />
      <span
        style={{ color: fg, fontSize: Math.round(size * 0.72) }}
        className="font-medium tracking-tight lowercase leading-none"
      >
        acute
        {secondary && <span className="ml-1 opacity-55">{secondary}</span>}
      </span>
    </span>
  );
}
