import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

/* ------------------------------------------------------------------ */
/* Animated counter hook                                               */
/* ------------------------------------------------------------------ */
function useCounter(target, duration = 2000, suffix = "") {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { ref, display: `${value.toLocaleString()}${suffix}` };
}

/* ------------------------------------------------------------------ */
/* Hero particles (decorative background dots)                         */
/* ------------------------------------------------------------------ */
function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-accent/20 rounded-full animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Stats data                                                          */
/* ------------------------------------------------------------------ */
const stats = [
  { value: 95, suffix: "%+", label: "Accuracy", icon: "🎯" },
  { value: 4, suffix: "", label: "Tumor Classes", icon: "🧬" },
  { value: 1, suffix: "s", prefix: "<", label: "Analysis Time", icon: "⚡" },
  { value: 7000, suffix: "+", label: "Training Scans", icon: "🧠" },
];

/* ------------------------------------------------------------------ */
/* How-it-works steps                                                  */
/* ------------------------------------------------------------------ */
const steps = [
  {
    num: "01",
    title: "Upload Scan",
    desc: "Upload a brain MRI image in JPG or PNG format through our secure interface.",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "AI Analysis",
    desc: "Our EfficientNetB3 deep learning model processes the image in under a second.",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Get Results",
    desc: "Receive detailed classification with confidence scores and clinical descriptions.",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25" />
      </svg>
    ),
  },
];

/* ------------------------------------------------------------------ */
/* Tumor classes info                                                  */
/* ------------------------------------------------------------------ */
const tumorClasses = [
  {
    name: "Glioma",
    color: "text-danger",
    border: "border-danger/30",
    bg: "bg-danger/10",
    risk: "High Risk",
    riskColor: "risk-high",
    desc: "Malignant tumors from glial cells. ~30% of all brain tumors.",
  },
  {
    name: "Meningioma",
    color: "text-warning",
    border: "border-warning/30",
    bg: "bg-warning/10",
    risk: "Medium Risk",
    riskColor: "risk-medium",
    desc: "Tumors from meninges. ~85% are benign, often slow-growing.",
  },
  {
    name: "No Tumor",
    color: "text-success",
    border: "border-success/30",
    bg: "bg-success/10",
    risk: "No Risk",
    riskColor: "risk-none",
    desc: "Brain tissue appears within normal parameters.",
  },
  {
    name: "Pituitary",
    color: "text-accent",
    border: "border-accent/30",
    bg: "bg-accent/10",
    risk: "Variable Risk",
    riskColor: "risk-medium",
    desc: "Pituitary gland tumors. Mostly benign adenomas.",
  },
];

/* ================================================================== */
/* HomePage                                                            */
/* ================================================================== */
export default function HomePage() {
  return (
    <main className="relative">
      {/* ── Hero Section ── */}
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        <Particles />

        {/* Radial gradient backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(59,130,246,0.08)_0%,_transparent_70%)]" />

        <div className="relative z-10 max-w-4xl mx-auto text-center animate-fade-in-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Powered by EfficientNetB3
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
            <span className="gradient-text">AI-Powered</span>
            <br />
            Brain Tumor Detection
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload a brain MRI scan and get instant classification across four
            tumor categories using state-of-the-art deep learning.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/scan" className="btn-glow text-lg">
              Start Scanning →
            </Link>
            <Link to="/about" className="btn-outline text-lg">
              How It Works
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* ── Stats Section ── */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => {
            const counter = useCounter(s.value, 2000, s.suffix);
            return (
              <div
                key={i}
                ref={counter.ref}
                className="stat-card animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="text-3xl mb-3">{s.icon}</div>
                <div className="text-3xl sm:text-4xl font-extrabold gradient-text mb-1">
                  {s.prefix || ""}
                  {counter.display}
                </div>
                <div className="text-sm text-gray-400">{s.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-gray-400 text-center max-w-xl mx-auto mb-14">
            Three simple steps to get your MRI scan analyzed by our AI model.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div
                key={i}
                className="glass-card p-8 relative group hover:border-accent/20 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                {/* Step number */}
                <div className="absolute -top-4 -left-2 text-6xl font-black text-accent/10 select-none">
                  {step.num}
                </div>

                <div className="relative z-10">
                  <div className="text-accent mb-5 group-hover:scale-110 transition-transform duration-300">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                </div>

                {/* Connector arrow (except last) */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-6 text-accent/30">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M5 12h14m-7-7l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tumor Classes ── */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            Detected <span className="gradient-text">Tumor Classes</span>
          </h2>
          <p className="text-gray-400 text-center max-w-xl mx-auto mb-14">
            Our model classifies brain MRI scans into four distinct categories.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tumorClasses.map((tc, i) => (
              <div
                key={i}
                className={`glass-card p-6 border ${tc.border} hover:scale-105 transition-all duration-300 animate-fade-in-up`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`w-3 h-3 rounded-full ${tc.bg} ${tc.color} mb-4 ring-4 ring-current/20`} />
                <h3 className={`text-lg font-bold ${tc.color} mb-2`}>{tc.name}</h3>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">{tc.desc}</p>
                <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${tc.riskColor}`}>
                  {tc.risk}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Disclaimer ── */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card border-yellow-600/30 bg-yellow-900/10 p-6 flex gap-4 items-start rounded-xl">
            <div className="text-yellow-400 text-2xl flex-shrink-0 mt-0.5">⚠️</div>
            <div>
              <h3 className="text-yellow-300 font-bold mb-1">Important Medical Disclaimer</h3>
              <p className="text-yellow-200/70 text-sm leading-relaxed">
                BrainScan AI is a research and educational tool only. It is{" "}
                <strong className="text-yellow-200">not</strong> a substitute for
                professional medical diagnosis, advice, or treatment. Always
                consult a qualified healthcare provider for medical decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-10 px-4 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} BrainScan AI — Built for research &amp; education.</p>
      </footer>
    </main>
  );
}
