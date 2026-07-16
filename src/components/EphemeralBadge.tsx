export function EphemeralBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-primary-foreground/30 bg-primary-foreground/10 px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
      Ephemeral session — no account
    </span>
  );
}
