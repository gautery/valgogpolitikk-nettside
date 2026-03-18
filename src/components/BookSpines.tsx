export default function BookSpines({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Stylized book spines in a row */}
      <rect x="8" y="8" width="14" height="64" rx="1" fill="#2d6a4f" opacity="0.85" />
      <rect x="24" y="12" width="10" height="60" rx="1" fill="#4a4a5a" opacity="0.6" />
      <rect x="36" y="6" width="16" height="66" rx="1" fill="#e67700" opacity="0.8" />
      <rect x="54" y="10" width="12" height="62" rx="1" fill="#1864ab" opacity="0.75" />
      <rect x="68" y="4" width="18" height="68" rx="1" fill="#d6336c" opacity="0.85" />
      <rect x="88" y="14" width="10" height="58" rx="1" fill="#4a4a5a" opacity="0.5" />
      <rect x="100" y="8" width="15" height="64" rx="1" fill="#7048e8" opacity="0.75" />
      <rect x="117" y="10" width="11" height="62" rx="1" fill="#2d6a4f" opacity="0.6" />
      <rect x="130" y="6" width="16" height="66" rx="1" fill="#e67700" opacity="0.7" />
      <rect x="148" y="12" width="12" height="60" rx="1" fill="#1864ab" opacity="0.65" />
      <rect x="162" y="8" width="14" height="64" rx="1" fill="#d6336c" opacity="0.7" />
      <rect x="178" y="14" width="10" height="58" rx="1" fill="#4a4a5a" opacity="0.45" />
    </svg>
  );
}
