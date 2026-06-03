export function AuthBackground() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <div className="absolute inset-0 opacity-[0.055] bg-[radial-gradient(circle,rgba(255,255,255,0.75)_1px,transparent_1px)] bg-size-[36px_36px]" />
      <div className="bg-sidebar-primary absolute -top-32 -right-24 w-105 h-105 rounded-full opacity-20" />
      <div className="bg-sidebar-primary absolute -bottom-20 -left-16 w-70 h-70 rounded-full opacity-10" />
    </div>
  );
}
