import { useState, useRef, useCallback } from "react";
import axios from "axios";
import DisclaimerBanner from "../components/DisclaimerBanner";

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */
const CLASS_COLORS = {
  glioma: { bar: "bg-danger", text: "text-danger", ring: "ring-danger/30" },
  meningioma: { bar: "bg-warning", text: "text-warning", ring: "ring-warning/30" },
  notumor: { bar: "bg-success", text: "text-success", ring: "ring-success/30" },
  pituitary: { bar: "bg-accent", text: "text-accent", ring: "ring-accent/30" },
};

const RISK_STYLES = {
  high: "risk-high",
  medium: "risk-medium",
  none: "risk-none",
  uncertain: "risk-uncertain",
};

const ANALYZE_STEPS = [
  "Loading image...",
  "Preprocessing scan...",
  "Running inference...",
  "Analyzing results...",
];

/* ------------------------------------------------------------------ */
/* Brain scan animation                                                */
/* ------------------------------------------------------------------ */
function ScanAnimation({ stepText }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
      <div className="scan-container mb-8">
        <div className="scan-ring" />
        <div className="scan-ring" />
        <div className="scan-ring" />
        {/* Centre brain icon */}
        <svg
          className="w-16 h-16 text-accent relative z-10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 2C9 2 7 4 7 6.5c0 .5-.5 1-1 1C4.5 7.5 3 9 3 11c0 1.5 1 3 2.5 3.5.5.2.5.5.5 1 0 2 1.5 3.5 3.5 3.5.5 0 1 .5 1 1 0 1 1 2 1.5 2"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 2c3 0 5 2 5 4.5c0 .5.5 1 1 1C19.5 7.5 21 9 21 11c0 1.5-1 3-2.5 3.5-.5.2-.5.5-.5 1 0 2-1.5 3.5-3.5 3.5-.5 0-1 .5-1 1 0 1-1 2-1.5 2"
          />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v20" />
        </svg>
      </div>

      <p className="text-accent font-semibold text-lg mb-2">Analyzing MRI Scan</p>
      <p className="text-gray-400 text-sm animate-pulse">{stepText}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Probability bar                                                     */
/* ------------------------------------------------------------------ */
function ProbBar({ name, value, maxValue }) {
  const colors = CLASS_COLORS[name] || CLASS_COLORS.pituitary;
  const pct = Math.max(value, 0.5); // min visual width

  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1">
        <span className={`text-sm font-medium capitalize ${colors.text}`}>{name === "notumor" ? "No Tumor" : name}</span>
        <span className="text-sm text-gray-400">{value.toFixed(1)}%</span>
      </div>
      <div className="h-2.5 bg-navy-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${colors.bar} transition-all duration-1000 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/* ================================================================== */
/* ScanPage                                                            */
/* ================================================================== */
export default function ScanPage() {
  // State: "upload" | "analyzing" | "results" | "error"
  const [phase, setPhase] = useState("upload");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [analyzeStep, setAnalyzeStep] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  /* ---- File selection ---- */
  const handleFile = useCallback((f) => {
    if (!f) return;
    const ext = f.name.split(".").pop().toLowerCase();
    if (!["jpg", "jpeg", "png"].includes(ext)) {
      setError("Invalid file type. Please upload JPG or PNG.");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError("File too large. Maximum 10 MB.");
      return;
    }
    setError(null);
    setFile(f);

    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(f);
  }, []);

  /* ---- Drag & drop handlers ---- */
  const onDragOver = (e) => { e.preventDefault(); setDragActive(true); };
  const onDragLeave = () => setDragActive(false);
  const onDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  /* ---- Analyze ---- */
  const analyze = async () => {
    if (!file) return;
    setPhase("analyzing");
    setAnalyzeStep(0);

    // Animate through steps
    for (let i = 0; i < ANALYZE_STEPS.length; i++) {
      setAnalyzeStep(i);
      await new Promise((r) => setTimeout(r, 800));
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post("/api/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
      setPhase("results");
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.message ||
        "Failed to analyze scan. Is the backend running?";
      setError(msg);
      setPhase("error");
    }
  };

  /* ---- Reset ---- */
  const reset = () => {
    setPhase("upload");
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    setAnalyzeStep(0);
  };

  return (
    <main className="pt-24 pb-20 px-4 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Page header */}
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            MRI <span className="gradient-text">Scan Analysis</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Upload a brain MRI image and let our AI model classify it in seconds.
          </p>
        </div>

        {/* ──── UPLOAD PHASE ──── */}
        {phase === "upload" && (
          <div className="glass-card p-8 max-w-2xl mx-auto animate-fade-in-up">
            {/* Drop zone */}
            <div
              className={`drop-zone ${dragActive ? "active" : ""}`}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
            >
              <input
                ref={inputRef}
                type="file"
                className="hidden"
                accept=".jpg,.jpeg,.png"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />

              {preview ? (
                <div className="flex flex-col items-center gap-4">
                  <img
                    src={preview}
                    alt="MRI Preview"
                    className="w-48 h-48 object-cover rounded-xl border border-white/10"
                  />
                  <div>
                    <p className="text-white font-medium">{file.name}</p>
                    <p className="text-gray-500 text-sm">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <svg
                    className="w-16 h-16 text-gray-500 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                    />
                  </svg>
                  <p className="text-gray-300 font-medium mb-1">
                    Drop MRI image here or click to browse
                  </p>
                  <p className="text-gray-500 text-sm">JPG, JPEG, or PNG — Max 10 MB</p>
                </>
              )}
            </div>

            {error && (
              <div className="mt-4 p-3 rounded-lg bg-danger/10 border border-danger/30 text-danger text-sm">
                {error}
              </div>
            )}

            <button
              onClick={analyze}
              disabled={!file}
              className={`mt-6 w-full py-3.5 rounded-xl font-semibold text-lg transition-all duration-300 ${
                file
                  ? "btn-glow"
                  : "bg-navy-700 text-gray-500 cursor-not-allowed"
              }`}
            >
              🔬 Analyze Scan
            </button>
          </div>
        )}

        {/* ──── ANALYZING PHASE ──── */}
        {phase === "analyzing" && (
          <div className="glass-card p-8 max-w-2xl mx-auto">
            <ScanAnimation stepText={ANALYZE_STEPS[analyzeStep]} />
          </div>
        )}

        {/* ──── ERROR PHASE ──── */}
        {phase === "error" && (
          <div className="glass-card p-8 max-w-2xl mx-auto text-center animate-fade-in">
            <div className="text-5xl mb-4">❌</div>
            <h2 className="text-xl font-bold text-danger mb-2">Analysis Failed</h2>
            <p className="text-gray-400 mb-6">{error}</p>
            <button onClick={reset} className="btn-glow">
              Try Again
            </button>
          </div>
        )}

        {/* ──── RESULTS PHASE ──── */}
        {phase === "results" && result && (
          <div className="animate-fade-in-up">
            {/* Demo mode notice */}
            {result.demo_mode && (
              <div className="mb-6 p-4 glass-card border-yellow-600/30 bg-yellow-900/10 text-yellow-200 text-sm flex items-start gap-3">
                <span className="text-lg">⚠️</span>
                <span>
                  <strong>Demo Mode:</strong> The AI model is not loaded. These
                  are randomly generated results for demonstration purposes only.
                </span>
              </div>
            )}

            <div className="grid lg:grid-cols-2 gap-8">
              {/* ── Left: Image ── */}
              <div className="glass-card p-6 animate-slide-in-left">
                <h3 className="text-lg font-semibold mb-4 text-gray-300">
                  Uploaded Scan
                </h3>
                <img
                  src={preview}
                  alt="MRI Scan"
                  className="w-full max-w-xs mx-auto rounded-xl border border-white/10"
                />
                <div className="mt-4 text-sm text-gray-500 text-center">
                  <p>{file.name}</p>
                  <p>{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>

              {/* ── Right: Results ── */}
              <div className="glass-card p-6 animate-slide-in-right">
                {/* Prediction + confidence */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Prediction</p>
                    <h2
                      className={`text-3xl font-extrabold capitalize ${
                        CLASS_COLORS[result.prediction]?.text || "text-white"
                      }`}
                    >
                      {result.prediction === "notumor"
                        ? "No Tumor"
                        : result.prediction}
                    </h2>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 mb-1">Confidence</p>
                    <p
                      className={`text-3xl font-extrabold ${
                        CLASS_COLORS[result.prediction]?.text || "text-white"
                      }`}
                    >
                      {result.confidence.toFixed(1)}%
                    </p>
                  </div>
                </div>

                {/* Risk badge */}
                <div className="mb-6">
                  <span
                    className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide ${
                      RISK_STYLES[result.risk_level] || RISK_STYLES.uncertain
                    }`}
                  >
                    {result.risk_level} risk
                  </span>
                </div>

                {/* Probability bars */}
                <div className="mb-6">
                  <h4 className="text-sm text-gray-400 font-medium mb-3">
                    Class Probabilities
                  </h4>
                  {Object.entries(result.probabilities)
                    .sort(([, a], [, b]) => b - a)
                    .map(([name, val]) => (
                      <ProbBar key={name} name={name} value={val} />
                    ))}
                </div>

                {/* Description */}
                <div className="mb-4 p-4 bg-navy-700/50 rounded-xl">
                  <h4 className="text-sm text-gray-400 font-medium mb-1">
                    Clinical Description
                  </h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {result.description}
                  </p>
                </div>

                {/* Recommendation */}
                <div className="mb-4 p-4 bg-navy-700/50 rounded-xl">
                  <h4 className="text-sm text-gray-400 font-medium mb-1">
                    Recommendation
                  </h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {result.recommendation}
                  </p>
                </div>

                {/* Processing time */}
                <p className="text-xs text-gray-500 text-right">
                  Processed in {result.processing_time_ms} ms
                </p>
              </div>
            </div>

            {/* Disclaimer + reset */}
            <div className="mt-8 glass-card border-yellow-600/30 bg-yellow-900/10 p-5 flex items-start gap-3">
              <span className="text-lg text-yellow-400">⚠️</span>
              <p className="text-yellow-200/70 text-sm leading-relaxed">
                <strong className="text-yellow-200">Disclaimer:</strong> This
                analysis is for research and educational purposes only. It is not
                a substitute for professional medical diagnosis. Always consult a
                qualified healthcare provider.
              </p>
            </div>

            <div className="mt-6 text-center">
              <button onClick={reset} className="btn-glow text-lg">
                🔄 Scan Another
              </button>
            </div>
          </div>
        )}
      </div>

      <DisclaimerBanner />
    </main>
  );
}
