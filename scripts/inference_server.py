"""
Local Flask server for damage detection inference.
Run this after training your model to enable offline detection in the web app.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
import torch.nn as nn
from torchvision.models import efficientnet_b0
import torchvision.transforms as transforms
from PIL import Image
import io
import base64
import os

app = Flask(__name__)
CORS(app)

# Configuration
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
MODEL_PATH = "./trained_model.pth"
DAMAGE_TYPES = ["rust", "dent", "corrosion", "fatigue_crack", "no_damage"]

# Load model
def load_model():
    """Load the trained PyTorch model"""
    model = efficientnet_b0(pretrained=False)
    num_features = model.classifier[1].in_features
    model.classifier[1] = nn.Linear(num_features, len(DAMAGE_TYPES))
    
    if os.path.exists(MODEL_PATH):
        model.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE))
        print(f"[v0] Model loaded from {MODEL_PATH}")
    else:
        print(f"[v0] Warning: Model not found at {MODEL_PATH}")
    
    model = model.to(DEVICE)
    model.eval()
    return model

model = load_model()

# Image transforms (same as training)
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225])
])

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({"status": "ok", "model_loaded": True})

@app.route('/detect', methods=['POST'])
def detect_damage():
    """Detect damage in uploaded image"""
    try:
        data = request.json
        if not data or 'image' not in data:
            return jsonify({"error": "No image provided"}), 400
        
        # Decode base64 image
        image_data = data['image']
        if image_data.startswith('data:image'):
            image_data = image_data.split(',')[1]
        
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        
        # Transform image
        image_tensor = transform(image).unsqueeze(0).to(DEVICE)
        
        # Run inference
        with torch.no_grad():
            outputs = model(image_tensor)
            probabilities = torch.nn.functional.softmax(outputs, dim=1)
            confidence, predicted_idx = torch.max(probabilities, 1)
        
        confidence = confidence.item()
        damage_type = DAMAGE_TYPES[predicted_idx.item()]
        
        # Determine severity
        severity_map = {
            "no_damage": "low",
            "rust": "medium",
            "dent": "medium",
            "corrosion": "high",
            "fatigue_crack": "critical"
        }
        
        descriptions = {
            "rust": "Surface oxidation detected. Recommend monitoring and potential coating application.",
            "dent": "Physical deformation detected. Assess structural integrity if deep.",
            "corrosion": "Advanced material degradation detected. Requires immediate inspection and repair.",
            "fatigue_crack": "Structural crack detected. This requires urgent professional assessment.",
            "no_damage": "No significant damage detected in the inspected area."
        }
        
        result = {
            "type": damage_type,
            "confidence": float(confidence),
            "severity": severity_map[damage_type],
            "description": descriptions[damage_type]
        }
        
        print(f"[v0] Detection: {damage_type} ({confidence*100:.1f}%)")
        return jsonify(result)
    
    except Exception as e:
        print(f"[v0] Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print(f"[v0] Starting inference server on http://localhost:5000")
    print(f"[v0] Running on device: {DEVICE}")
    app.run(debug=False, port=5000, host='127.0.0.1')
