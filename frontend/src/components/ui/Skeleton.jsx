function Skeleton({ className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse motion-reduce:animate-none rounded-sm bg-border/70 ${className}`}
    />
  );
}

export default Skeleton;
