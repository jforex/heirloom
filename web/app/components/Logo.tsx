"use client";

import Image from "next/image";

export function Logo({ size = 28 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <Image
        src="/logo-tree.png"
        alt="Heirloom"
        width={size}
        height={size}
        className="shrink-0"
        priority
      />
      <span
        className="font-serif tracking-tight text-[var(--foreground)]"
        style={{ fontSize: size * 0.72 + "px" }}
      >
        Heirloom
      </span>
    </div>
  );
}
