export function EphemeralBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-accent-foreground/30 bg-accent/50 px-2.5 py-0.5 text-xs font-medium text-accent-foreground">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      Ephemeral session — no account
    </span>
  );
}
