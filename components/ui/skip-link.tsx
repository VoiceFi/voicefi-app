export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-[var(--primary)] focus:text-white focus:rounded-xl focus:font-semibold focus:shadow-lg"
    >
      Skip to main content
    </a>
  );
}
