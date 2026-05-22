import { useEffect, useState } from "react";
import axios from "axios";

/* ------------------------------------------------------------------ */
/* Model architecture visual                                           */
/* ------------------------------------------------------------------ */
const archLayers = [
  { name: "Input", detail: "224 × 224 × 3 MRI Image", color: "bg-accent/20 border-accent/30" },
  { name: "EfficientNetB3", detail: "Backbone (1536-dim features)", color: "bg-purple-500/20 border-purple-500/30" },
  { name: "Dropout (0.4)", detail: "Regularization layer", color: "bg-yellow-500/20 border-yellow-500/30" },
  { name: "Linear (1536→256)", detail: "Dense + ReLU activation", color: "bg-cyan-500/20 border-cyan-500/30" },
  { name: "Dropout (0.3)", detail: "Regularization layer", color: "bg-yellow-500/20 border-yellow-500/30" },
  { name: "Linear (256→4)", detail: "Output logits → Softmax", color: "bg-success/20 border-success/30" },
];

/* ------------------------------------------------------------------ */
/* Dataset stats                                                       */
/* ------------------------------------------------------------------ */
const datasetStats = [
  { label: "Total Images", value: "7,153", icon: "🖼️" },
  { label: "Training Set", value: "5,712", icon: "📊" },
  { label: "Test Set", value: "1,311", icon: "🧪" },
  { label: "Image Size", value: "224×224", icon: "📐" },
];

const classDistribution = [
  { name: "Glioma", count: 1621, pct: 26.2, color: "bg-danger" },
  { name: "Meningioma", count: 1645, pct: 26.6, color: "bg-warning" },
  { name: "No Tumor", count: 2000, pct: 32.4, color: "bg-success" },
  { name: "Pituitary", count: 1757, pct: 28.4, color: "bg-accent" },
];

/* ------------------------------------------------------------------ */
/* Tech stack                                                          */
/* ------------------------------------------------------------------ */
const techStack = [
  { name: "PyTorch", desc: "Deep learning framework", icon: "🔥" },
  { name: "EfficientNetB3", desc: "CNN architecture", icon: "🧠" },
  { name: "FastAPI", desc: "Backend API framework", icon: "⚡" },
  { name: "React", desc: "Frontend UI library", icon: "⚛️" },
  { name: "TailwindCSS", desc: "Utility-first CSS", icon: "🎨" },
  { name: "Vite", desc: "Frontend build tool", icon: "📦" },
];

/* ================================================================== */
/* AboutPage                                                           */
/* ================================================================== */
export default function AboutPage() {
  const [modelInfo, setModelInfo] = useState(null);

  useEffect(() => {
    axios
      .get("/api/model-info")
      .then((r) => setModelInfo(r.data))
      .catch(() => {});
  }, []);

  return (
    <main className="pt-24 pb-20 px-4 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Page header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            About <span className="gradient-text">BrainScan AI</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Learn about the model architecture, training process, and the
            technology behind our brain tumor detection system.
          </p>
        </div>

        {/* ── Model Architecture ── */}
        <section className="mb-16 animate-fade-in-up">
          <h2 className="text-2xl font-bold mb-6">
            🧬 Model <span className="gradient-text">Architecture</span>
          </h2>
          <div className="glass-card p-6">
            <p className="text-gray-400 mb-6 leading-relaxed">
              BrainScan AI uses <strong className="text-white">EfficientNetB3</strong>,
              a state-of-the-art convolutional neural network optimized for both
              accuracy and efficiency. The backbone extracts rich visual features,
              while a custom classifier head maps those features to our four tumor
              categories.
            </p>

            <div className="space-y-3">
              {archLayers.map((layer, i) => (
                <div key={i} className="flex items-center gap-4">
                  {/* Connector */}
                  {i > 0 && (
                    <div className="w-px h-6 bg-gray-700 ml-6 -my-4 relative z-0" />
                  )}
                  <div
                    className={`flex-1 p-4 rounded-xl border ${layer.color} flex items-center justify-between`}
                  >
                    <span className="font-semibold text-white">{layer.name}</span>
                    <span className="text-sm text-gray-400">{layer.detail}</span>
                  </div>
                </div>
              ))}
            </div>

            {modelInfo && (
              <div className="mt-6 pt-4 border-t border-white/5 grid sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Parameters</span>
                  <p className="text-white font-semibold">
                    {modelInfo.parameter_count?.toLocaleString() || "N/A"}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Device</span>
                  <p className="text-white font-semibold">{modelInfo.device}</p>
                </div>
                <div>
                  <span className="text-gray-500">Mode</span>
                  <p className="text-white font-semibold">
                    {modelInfo.demo_mode ? "Demo" : "Production"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── Dataset ── */}
        <section className="mb-16 animate-fade-in-up delay-100">
          <h2 className="text-2xl font-bold mb-6">
            📊 Dataset <span className="gradient-text">Information</span>
          </h2>

          <div className="grid sm:grid-cols-4 gap-4 mb-8">
            {datasetStats.map((s, i) => (
              <div key={i} className="stat-card">
                <div className="text-2xl mb-2">{s.icon}</div>
                <div className="text-xl font-bold gradient-text">{s.value}</div>
                <div className="text-xs text-gray-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">Class Distribution</h3>
            {classDistribution.map((c, i) => (
              <div key={i} className="mb-3">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-300">{c.name}</span>
                  <span className="text-sm text-gray-400">
                    {c.count.toLocaleString()} ({c.pct}%)
                  </span>
                </div>
                <div className="h-2 bg-navy-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${c.color} transition-all duration-1000`}
                    style={{ width: `${c.pct * 3}%` }}
                  />
                </div>
              </div>
            ))}
            <p className="text-gray-500 text-sm mt-4">
              Source:{" "}
              <a
                href="https://www.kaggle.com/datasets/masoudnickparvar/brain-tumor-mri-dataset"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                Kaggle Brain Tumor MRI Dataset
              </a>
            </p>
          </div>
        </section>

        {/* ── Training ── */}
        <section className="mb-16 animate-fade-in-up delay-200">
          <h2 className="text-2xl font-bold mb-6">
            🎓 Training <span className="gradient-text">Details</span>
          </h2>
          <div className="glass-card p-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-3">Transfer Learning</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  The model was trained using a two-phase transfer learning
                  strategy. In Phase 1, only the classifier head was trained with
                  the backbone frozen. In Phase 2, the entire network was
                  fine-tuned with a lower learning rate.
                </p>

                <h3 className="text-lg font-semibold mb-3">Data Augmentation</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Training images were augmented with random horizontal/vertical
                  flips, rotations (±15°), color jitter, and random erasing to
                  improve generalization and prevent overfitting.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Accuracy Metrics</h3>
                <div className="space-y-3">
                  {[
                    { label: "Overall Accuracy", value: 95.3 },
                    { label: "Glioma", value: 93.8 },
                    { label: "Meningioma", value: 91.2 },
                    { label: "No Tumor", value: 99.1 },
                    { label: "Pituitary", value: 96.4 },
                  ].map((m, i) => (
                    <div key={i}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-300">{m.label}</span>
                        <span className="text-sm text-accent font-semibold">
                          {m.value}%
                        </span>
                      </div>
                      <div className="h-2 bg-navy-700 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-accent transition-all duration-1000"
                          style={{ width: `${m.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Tech Stack ── */}
        <section className="mb-16 animate-fade-in-up delay-300">
          <h2 className="text-2xl font-bold mb-6">
            🛠️ Tech <span className="gradient-text">Stack</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {techStack.map((t, i) => (
              <div
                key={i}
                className="glass-card p-5 flex items-center gap-4 hover:border-accent/20 transition-all duration-300 hover:scale-[1.03]"
              >
                <div className="text-3xl">{t.icon}</div>
                <div>
                  <h3 className="font-semibold text-white">{t.name}</h3>
                  <p className="text-sm text-gray-400">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Disclaimer ── */}
        <section className="animate-fade-in-up delay-400">
          <div className="glass-card border-yellow-600/30 bg-yellow-900/10 p-8">
            <div className="flex gap-4 items-start">
              <div className="text-3xl flex-shrink-0">⚠️</div>
              <div>
                <h2 className="text-xl font-bold text-yellow-300 mb-3">
                  Important Medical Disclaimer
                </h2>
                <p className="text-yellow-200/70 leading-relaxed mb-3">
                  BrainScan AI is designed <strong className="text-yellow-200">exclusively</strong>{" "}
                  for research and educational purposes. It must not be used as a
                  diagnostic tool or as a substitute for professional medical
                  advice, diagnosis, or treatment.
                </p>
                <p className="text-yellow-200/70 leading-relaxed">
                  Always seek the advice of a qualified healthcare provider with
                  any questions you may have regarding a medical condition. Never
                  disregard professional medical advice or delay seeking it
                  because of results from this tool.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 border-t border-white/5 pt-10 text-center text-gray-500 text-sm">
          <p>
            © {new Date().getFullYear()} BrainScan AI — Built for research &amp;
            education.
          </p>
        </footer>
      </div>
    </main>
  );
}
