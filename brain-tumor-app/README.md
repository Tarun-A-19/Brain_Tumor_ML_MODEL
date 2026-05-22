# 🧠 BrainScan AI — Brain Tumor MRI Detection

AI-powered brain tumor classification from MRI scans using **EfficientNetB3** deep learning.

Upload a brain MRI image and get instant classification across four categories:
**Glioma** | **Meningioma** | **No Tumor** | **Pituitary**

![BrainScan AI Screenshot](screenshot-placeholder.png)

---

## Prerequisites

- **Python** 3.10+
- **Node.js** 18+
- **CUDA GPU** (optional — CPU works fine, GPU accelerates inference)

---

## Quick Start

### 1. Backend

```bash
cd brain-tumor-app/backend

# Create virtual environment (recommended)
python -m venv venv
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate

pip install -r requirements.txt

# The model weights are loaded from ../../outputs/best_model.pth by default.
# If your model is elsewhere, set MODEL_PATH in .env:
# cp .env.example .env && edit .env

uvicorn main:app --reload --port 8000
```

### 2. Frontend (new terminal)

```bash
cd brain-tumor-app/frontend
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## API Documentation

### `GET /health`
Health check — returns model status and device info.

```json
{
  "status": "healthy",
  "model_loaded": true,
  "demo_mode": false,
  "device": "cuda"
}
```

### `GET /model-info`
Returns model architecture summary, classes, and parameter count.

### `POST /predict`
Accepts multipart file upload (MRI image: JPG/PNG/JPEG, max 10 MB).

**Response:**
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
  "description": "Malignant tumor originating from glial cells...",
  "recommendation": "Immediate consultation with a neuro-oncologist...",
  "processing_time_ms": 145,
  "demo_mode": false
}
```

---

## Demo Mode

If `best_model.pth` is not found, the app runs in **demo mode** with randomly generated predictions. A visible banner warns users that results are not real.

---

## Training

The model was trained using the Jupyter notebook `Brain_Tumor_Detection.ipynb` in the project root. Training details:

- **Dataset**: [Kaggle Brain Tumor MRI Dataset](https://www.kaggle.com/datasets/masoudnickparvar/brain-tumor-mri-dataset) (7,153 images)
- **Architecture**: EfficientNetB3 with custom classifier head
- **Strategy**: 2-phase transfer learning (freeze backbone → fine-tune all)
- **Best accuracy**: 95%+

---

## Project Structure

```
brain-tumor-app/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   └── .env.example         # Environment variable template
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # Root with React Router
│   │   ├── main.jsx          # Entry point
│   │   ├── index.css         # Tailwind + custom styles
│   │   ├── pages/
│   │   │   ├── HomePage.jsx  # Landing page
│   │   │   ├── ScanPage.jsx  # Upload & analysis
│   │   │   └── AboutPage.jsx # Model info
│   │   └── components/
│   │       ├── Navbar.jsx
│   │       └── DisclaimerBanner.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── tailwind.config.js
├── README.md
├── start.sh                  # Linux/macOS launcher
└── start.bat                 # Windows launcher
```

---

## ⚠️ Disclaimer

**BrainScan AI is for educational and research purposes only.**
It is NOT a medical device and should NOT be used for clinical diagnosis.
Always consult a qualified healthcare professional for medical decisions.

---

## License

MIT
