/**
 * DisclaimerBanner — Persistent amber warning at the bottom of ScanPage.
 */
export default function DisclaimerBanner() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-yellow-900/90 backdrop-blur-md border-t border-yellow-700/50">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-center gap-2 text-sm text-yellow-200">
        <svg
          className="w-4 h-4 flex-shrink-0 text-yellow-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        </svg>
        <span>
          <strong>Disclaimer:</strong> This tool is for educational and research
          purposes only. Not a substitute for professional medical diagnosis.
        </span>
      </div>
    </div>
  );
}
