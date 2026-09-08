export default function Logo() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Truck simplified icon */}
      <rect x="2" y="14" width="14" height="12" fill="currentColor" />
      <circle cx="7" cy="26" r="2" fill="white" />
      <circle cx="19" cy="26" r="2" fill="white" />
      <path d="M16 14L24 8V14H28V20H16Z" fill="currentColor" />
      <rect x="28" y="8" width="2" height="12" fill="currentColor" />
    </svg>
  );
}
