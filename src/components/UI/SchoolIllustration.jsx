/**
 * SchoolIllustration
 * Decorative school building for welcome banners (drawn on navy).
 */

const SchoolIllustration = ({ className = "ssd-illus" }) => (
  <svg
    className={className}
    viewBox="0 0 168 120"
    fill="none"
    aria-hidden="true">
    <rect
      x="18"
      y="104"
      width="132"
      height="4"
      rx="2"
      fill="#ffffff"
      opacity="0.12"
    />
    <path d="M84 14 136 40v64H32V40l52-26Z" fill="#ffffff" opacity="0.06" />
    <path d="M84 14 136 40H32l52-26Z" fill="var(--role)" opacity="0.9" />
    <rect
      x="40"
      y="46"
      width="88"
      height="58"
      rx="3"
      fill="#ffffff"
      opacity="0.1"
    />
    <path d="M74 104V84a10 10 0 0 1 20 0v20Z" fill="#f2a516" />
    <rect x="48" y="54" width="14" height="12" rx="2" fill="#93b4ff" />
    <rect
      x="48"
      y="76"
      width="14"
      height="12"
      rx="2"
      fill="#93b4ff"
      opacity="0.7"
    />
    <rect x="106" y="54" width="14" height="12" rx="2" fill="#93b4ff" />
    <rect
      x="106"
      y="76"
      width="14"
      height="12"
      rx="2"
      fill="#93b4ff"
      opacity="0.7"
    />
    <rect
      x="78"
      y="50"
      width="12"
      height="14"
      rx="6"
      fill="#ffffff"
      opacity="0.85"
    />
    <path d="M84 4v14" stroke="#ffffff" strokeOpacity="0.6" strokeWidth="1.5" />
    <path d="M84 4h12l-3 3 3 3H84" fill="#f2a516" />
    <circle cx="146" cy="24" r="3" fill="#ffffff" opacity="0.25" />
    <circle cx="20" cy="30" r="2" fill="#ffffff" opacity="0.25" />
    <circle cx="154" cy="70" r="2" fill="#ffffff" opacity="0.18" />
  </svg>
);

export default SchoolIllustration;
