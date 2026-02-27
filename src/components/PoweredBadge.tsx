const PoweredBadge = () => {
  return (
    <div className="inline-flex items-center gap-2 border border-border px-3 py-1.5 bg-background select-none">
      <div className="w-1.5 h-1.5 bg-primary" />
      <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-medium">
        Powered by
      </span>
      <span className="font-display text-[10px] font-bold tracking-[0.15em] text-foreground uppercase">
        THE BUSINESS SUPPORT STUDIO
      </span>
    </div>
  );
};

export default PoweredBadge;
