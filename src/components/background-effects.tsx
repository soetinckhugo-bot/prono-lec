"use client";

export function BackgroundEffects() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Animated gradient blobs */}
      <div className="absolute -left-[20%] -top-[20%] h-[60vw] w-[60vw] rounded-full bg-primary/20 blur-[120px] animate-blob" />
      <div className="absolute -right-[20%] top-[10%] h-[50vw] w-[50vw] rounded-full bg-secondary/15 blur-[120px] animate-blob animation-delay-2000" />
      <div className="absolute bottom-[0%] left-[20%] h-[50vw] w-[50vw] rounded-full bg-accent/10 blur-[120px] animate-blob animation-delay-4000" />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Noise overlay */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
