# 🧠 Brain Tumor Detection Web App — Complete Build Prompt
# Use this prompt with: Google Gemini 2.5 Pro, Claude Sonnet, GPT-4o, or any capable AI coding assistant
# ──────────────────────────────────────────────────────────────────────

## PASTE THIS ENTIRE PROMPT INTO YOUR AI CODING ASSISTANT ↓

---

You are an expert full-stack ML engineer. Build me a complete, production-ready
**Brain Tumor MRI Detection Web Application** with the following exact specifications.

---

## PROJECT OVERVIEW

Name: BrainScan AI — Brain Tumor MRI Classifier
Stack: Python (FastAPI) backend + React (Vite + TailwindCSS) frontend
Model: EfficientNetB3 PyTorch model (pre-trained weights will be loaded from file)
Classes: glioma | meningioma | notumor | pituitary

---

## BACKEND — FastAPI (Python)

### File: `backend/main.py`

Build a FastAPI application with:

1. **POST /predict** endpoint that:
   - Accepts a multipart file upload (MRI image: JPG/PNG/JPEG)
   - Validates file type and size (max 10MB)
   - Preprocesses image: resize to 224×224, normalize with ImageNet mean/std
   - Runs inference through EfficientNetB3 model
   - Returns JSON response with:
     ```json
     {
       "prediction": "glioma",
       "confidence": 96.5,
       "probabilities": {
         "glioma": 96.5,
         "meningioma": 1.2,
         "notumor": 0.8,
         "pituitary": 1.5
       },
       "risk_level": "high",
       "description": "...",
       "recommendation": "...",
       "processing_time_ms": 145
     }
     ```

2. **GET /health** endpoint returning model status and device info

3. **GET /model-info** endpoint returning model architecture summary, class names,
   input size, and parameter count

4. **CORS middleware** configured to allow frontend (localhost:5173 in dev, configurable via ENV)

5. **Model loader** class:
   - Loads `best_model.pth` at startup using lifespan context manager
   - Falls back to demo mode (random predictions with disclaimer) if model file missing
   - Uses `torch.cuda.is_available()` to auto-select device
   - EfficientNetB3 architecture must exactly match:
     ```
     backbone: efficientnet_b3(pretrained=False)
     classifier: Sequential(
       Dropout(0.4),
       Linear(1536 → 256),
       ReLU(),
       Dropout(0.3),
       Linear(256 → 4)
     )
     ```

6. **Risk level logic**:
   - confidence ≥ 90% AND class != "notumor" → "high"
   - confidence 70–89% AND class != "notumor" → "medium"
   - class == "notumor" → "none"
   - confidence < 70% → "uncertain"

7. **Clinical descriptions** for each class:
   - glioma: "Malignant tumor originating from glial cells. Gliomas account for ~30% of all brain tumors and ~80% of malignant tumors. Graded I–IV by WHO."
   - meningioma: "Tumor arising from the meninges (brain/spinal cord membranes). ~85% are benign (WHO Grade I). Often slow-growing and asymptomatic."
   - notumor: "No tumor detected in this MRI scan. The brain tissue appears within normal parameters for the regions visible."
   - pituitary: "Tumor of the pituitary gland. The vast majority are benign adenomas. May affect hormone regulation causing systemic symptoms."

8. **Requirements** (`backend/requirements.txt`):
   ```
   fastapi>=0.110.0
   uvicorn[standard]>=0.27.0
   python-multipart>=0.0.9
   torch>=2.0.0
   torchvision>=0.15.0
   Pillow>=10.0.0
   numpy>=1.24.0
   python-dotenv>=1.0.0
   ```

---

## FRONTEND — React + Vite + TailwindCSS

### Design: Dark medical theme
- Background: #0a0f1e (very dark navy)
- Card surfaces: #111827
- Accent: #3b82f6 (blue)
- Success: #22c55e, Warning: #f97316, Danger: #ef4444
- Font: 'Inter' from Google Fonts

### Pages / Components to build:

#### 1. `App.jsx` — Root with React Router
Routes:
- `/`    → HomePage
- `/scan` → ScanPage
- `/about` → AboutPage

#### 2. `components/Navbar.jsx`
- Logo (brain SVG icon + "BrainScan AI" text)
- Navigation links: Home, Scan, About
- Dark theme, blur backdrop, sticky

#### 3. `pages/HomePage.jsx`
- Hero section: Large heading "AI-Powered Brain Tumor Detection", subheading, CTA button → /scan
- Stats section: 4 animated counter cards (95%+ accuracy, 4 tumor classes, <1s analysis, 7000+ training scans)
- How it works: 3-step illustrated cards (Upload Scan → AI Analysis → Get Results)
- Important disclaimer banner: "⚠️ For research and educational purposes only. Not a substitute for professional medical diagnosis."
- Tumor classes section: 4 cards, one per class, with color coding, brief description, and risk level badge

#### 4. `pages/ScanPage.jsx` — Main feature page
Build this as a multi-step interface:

**Step 1 — Upload**
- Large drag-and-drop zone with dashed border, brain icon, "Drop MRI image here or click to browse"
- File type restriction: JPG/PNG/JPEG
- Preview the uploaded image immediately after selection (use FileReader API)
- Show filename, file size
- "Analyze Scan" button (disabled until file selected)

**Step 2 — Analyzing (loading state)**
- Animated brain scan visualization (CSS animation: pulsing rings around a brain icon)
- Progress text cycling through: "Loading image...", "Preprocessing scan...", "Running inference...", "Analyzing results..."
- Each step takes ~800ms for realistic UX feel (use setTimeout)

**Step 3 — Results panel** (shown after API response)
Split into two columns:

LEFT COLUMN:
- Uploaded MRI image (full display, ~300px)
- Small metadata: filename, dimensions

RIGHT COLUMN:
- Prediction badge: Large class name + confidence percentage in class color
- Risk level indicator (colored badge: HIGH/MEDIUM/LOW/NONE)
- Probability bars: Animated horizontal bars for all 4 classes, colored per class
  (glioma=#ef4444, meningioma=#f97316, notumor=#22c55e, pituitary=#3b82f6)
- Clinical description text
- Recommendation text
- Processing time display

BELOW BOTH COLUMNS:
- Disclaimer box
- "Scan Another" button that resets to Step 1

#### 5. `pages/AboutPage.jsx`
- Model architecture explanation (EfficientNetB3)
- Dataset info (7,153 MRI images, 4 classes, Kaggle source)
- Training details (transfer learning, 2-phase strategy)
- Accuracy metrics displayed as visual bars
- Important medical disclaimer (large, prominent)
- Tech stack cards

#### 6. `components/DisclaimerBanner.jsx`
- Persistent bottom-of-screen banner on ScanPage
- Yellow/amber warning styling
- "This tool is for educational and research purposes only."

---

## FILE STRUCTURE to generate:

```
brain-tumor-app/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── ScanPage.jsx
│   │   │   └── AboutPage.jsx
│   │   └── components/
│   │       ├── Navbar.jsx
│   │       └── DisclaimerBanner.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── README.md
└── start.sh
```

---

## `README.md` must include:

1. Project overview with screenshot placeholder
2. Prerequisites (Python 3.10+, Node 18+, optionally CUDA GPU)
3. Setup steps:
   ```bash
   # Backend
   cd backend && pip install -r requirements.txt
   # Place your best_model.pth in backend/
   uvicorn main:app --reload --port 8000

   # Frontend (new terminal)
   cd frontend && npm install && npm run dev
   ```
4. API documentation (all endpoints)
5. How to train the model (link to notebook)
6. Disclaimer

---

## `start.sh` — One-command startup:
```bash
#!/bin/bash
echo "Starting BrainScan AI..."
cd backend && uvicorn main:app --reload --port 8000 &
cd frontend && npm run dev
```

---

## CRITICAL REQUIREMENTS:

1. Every file must be complete and runnable — no placeholder comments like "add logic here"
2. All API calls from frontend must handle loading, error, and success states
3. Use `axios` for HTTP requests in frontend
4. Add `react-router-dom` v6 for routing
5. TailwindCSS v3 — configure `content` in tailwind.config.js to include all jsx files
6. The app must work even if `best_model.pth` is missing (demo/mock mode)
7. Add proper TypeScript-style prop comments where helpful
8. No external UI libraries other than TailwindCSS (no shadcn, no MUI)
9. All colors must be defined in `tailwind.config.js` under `extend.colors`
10. Include `vite.config.js` with proxy: `/api → http://localhost:8000`

---

Generate ALL files now, complete and production-ready.
Start with `backend/main.py`, then frontend files in order.
