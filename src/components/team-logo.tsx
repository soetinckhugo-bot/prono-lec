"use client";

import { getTeamInitials, getTeamLogo } from "@/lib/teams";
import { useState } from "react";

interface TeamLogoProps {
  name: string;
  size?: number;
  className?: string;
}

export function TeamLogo({ name, size = 48, className = "" }: TeamLogoProps) {
  const [failed, setFailed] = useState(false);
  const initials = getTeamInitials(name);

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/10 font-bold text-white shadow-inner ${className}`}
      style={{ width: size, height: size }}
      title={name}
    >
      {!failed ? (
        <img
          src={getTeamLogo(name)}
          alt={name}
          width={size}
          height={size}
          onError={() => setFailed(true)}
          className="h-full w-full object-contain p-1"
        />
      ) : (
        <span className="text-xs font-black tracking-wider">{initials}</span>
      )}
    </div>
  );
}
