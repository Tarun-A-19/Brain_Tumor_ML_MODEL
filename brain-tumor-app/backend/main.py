"""
BrainScan AI — Brain Tumor MRI Classification API
FastAPI backend with EfficientNetB3 PyTorch model inference.
"""

import os
import io
import time
import random
from contextlib import asynccontextmanager
from pathlib import Path

import numpy as np
from PIL import Image
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
MODEL_PATH = os.getenv(
    "MODEL_PATH",
    str(Path(__file__).resolve().parent.parent.parent / "outputs" / "best_model.pth"),
)
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB
ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png"}

CLASS_NAMES = ["glioma", "meningioma", "notumor", "pituitary"]

CLASS_COLORS = {
    "glioma": "#ef4444",
    "meningioma": "#f97316",
    "notumor": "#22c55e",
    "pituitary": "#3b82f6",
}

CLINICAL_DESCRIPTIONS = {
    "glioma": (
        "Malignant tumor originating from glial cells. Gliomas account for ~30% "
        "of all brain tumors and ~80% of malignant tumors. Graded I\u2013IV by WHO."
    ),
    "meningioma": (
        "Tumor arising from the meninges (brain/spinal cord membranes). ~85% are "
        "benign (WHO Grade I). Often slow-growing and asymptomatic."
    ),
    "notumor": (
        "No tumor detected in this MRI scan. The brain tissue appears within "
        "normal parameters for the regions visible."
    ),
    "pituitary": (
        "Tumor of the pituitary gland. The vast majority are benign adenomas. "
        "May affect hormone regulation causing systemic symptoms."
    ),
}

RECOMMENDATIONS = {
    "glioma": (
        "Immediate consultation with a neuro-oncologist is strongly recommended. "
        "Further imaging (contrast MRI, MR spectroscopy) and biopsy may be warranted."
    ),
    "meningioma": (
        "Consultation with a neurosurgeon for evaluation. Regular monitoring with "
        "follow-up MRI scans is typically recommended."
    ),
    "notumor": (
        "No immediate action required based on this scan. Continue routine health "
        "check-ups as advised by your physician."
    ),
    "pituitary": (
        "Endocrinological evaluation recommended to assess hormonal function. "
        "Consultation with a neurosurgeon for treatment planning."
    ),
}

# ---------------------------------------------------------------------------
# Model wrapper
# ---------------------------------------------------------------------------

class BrainTumorModel:
    """Wraps EfficientNetB3 with a custom classifier head for brain tumor classification."""

    def __init__(self):
        self.model = None
        self.device = None
        self.demo_mode = False
        self.transform = None

    def load(self, model_path: str):
        """Load model weights. Falls back to demo mode if anything fails."""
        try:
            import torch
            import torchvision.transforms as T
            from torchvision.models import efficientnet_b3

            self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

            # Build architecture matching the training notebook
            model = efficientnet_b3(weights=None)
            model.classifier = torch.nn.Sequential(
                torch.nn.Dropout(p=0.4),
                torch.nn.Linear(1536, 256),
                torch.nn.ReLU(),
                torch.nn.Dropout(p=0.3),
                torch.nn.Linear(256, 4),
            )

            if not Path(model_path).is_file():
                raise FileNotFoundError(f"Model file not found: {model_path}")

            state = torch.load(model_path, map_location=self.device, weights_only=True)
            model.load_state_dict(state)
            model.to(self.device)
            model.eval()

            self.model = model
            self.demo_mode = False

            # Preprocessing pipeline (ImageNet stats)
            self.transform = T.Compose([
                T.Resize((224, 224)),
                T.ToTensor(),
                T.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
            ])

            param_count = sum(p.numel() for p in model.parameters())
            print(f"[OK] Model loaded on {self.device} ({param_count:,} params)")

        except Exception as exc:
            print(f"[WARN] Model load failed ({exc}). Running in DEMO mode.")
            self.demo_mode = True
            self.device = "cpu"

    def predict(self, image: Image.Image) -> dict:
        """Run inference on a PIL Image and return probabilities dict."""
        if self.demo_mode:
            return self._demo_predict()

        import torch

        img_tensor = self.transform(image.convert("RGB")).unsqueeze(0).to(self.device)

        with torch.no_grad():
            logits = self.model(img_tensor)
            probs = torch.nn.functional.softmax(logits, dim=1).cpu().numpy()[0]

        return {name: round(float(p) * 100, 2) for name, p in zip(CLASS_NAMES, probs)}

    @staticmethod
    def _demo_predict() -> dict:
        """Generate plausible random probabilities for demo mode."""
        raw = [random.random() for _ in CLASS_NAMES]
        total = sum(raw)
        probs = [round(r / total * 100, 2) for r in raw]
        # Fix rounding so it sums to 100
        probs[-1] = round(100 - sum(probs[:-1]), 2)
        return dict(zip(CLASS_NAMES, probs))

    def get_info(self) -> dict:
        """Return model metadata."""
        param_count = 0
        if self.model is not None:
            param_count = sum(p.numel() for p in self.model.parameters())
        return {
            "architecture": "EfficientNetB3",
            "classifier": "Dropout(0.4) → Linear(1536,256) → ReLU → Dropout(0.3) → Linear(256,4)",
            "input_size": "224×224×3",
            "classes": CLASS_NAMES,
            "parameter_count": param_count,
            "device": str(self.device),
            "demo_mode": self.demo_mode,
        }


# ---------------------------------------------------------------------------
# App lifecycle & instance
# ---------------------------------------------------------------------------

brain_model = BrainTumorModel()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load model at startup."""
    brain_model.load(MODEL_PATH)
    yield


app = FastAPI(
    title="BrainScan AI",
    description="Brain Tumor MRI Classification API powered by EfficientNetB3",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _risk_level(predicted_class: str, confidence: float) -> str:
    if predicted_class == "notumor":
        return "none"
    if confidence >= 90:
        return "high"
    if confidence >= 70:
        return "medium"
    return "uncertain"


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@app.get("/health")
async def health():
    """Health check — returns model status and device info."""
    return {
        "status": "healthy",
        "model_loaded": brain_model.model is not None,
        "demo_mode": brain_model.demo_mode,
        "device": str(brain_model.device),
    }


@app.get("/model-info")
async def model_info():
    """Return model architecture summary."""
    return brain_model.get_info()


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    Accept an MRI image upload and return tumor classification results.
    """
    # --- validate extension ---
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided.")

    ext = file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else ""
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type '.{ext}'. Allowed: {', '.join(ALLOWED_EXTENSIONS)}",
        )

    # --- validate size ---
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large ({len(contents) / 1024 / 1024:.1f} MB). Max: 10 MB.",
        )

    # --- run inference ---
    start = time.perf_counter()
    try:
        image = Image.open(io.BytesIO(contents)).convert("RGB")
    except Exception:
        raise HTTPException(status_code=400, detail="Unable to open file as an image.")

    probabilities = brain_model.predict(image)
    elapsed_ms = round((time.perf_counter() - start) * 1000, 1)

    predicted_class = max(probabilities, key=probabilities.get)
    confidence = probabilities[predicted_class]
    risk = _risk_level(predicted_class, confidence)

    return {
        "prediction": predicted_class,
        "confidence": confidence,
        "probabilities": probabilities,
        "risk_level": risk,
        "description": CLINICAL_DESCRIPTIONS[predicted_class],
        "recommendation": RECOMMENDATIONS[predicted_class],
        "processing_time_ms": elapsed_ms,
        "demo_mode": brain_model.demo_mode,
    }


# ---------------------------------------------------------------------------
# Run directly
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", "8000"))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
