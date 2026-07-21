import torch
import torch.nn as nn
from torchvision.models import efficientnet_b0
import onnx

# Configuration
MODEL_PATH = "./trained_model.pth"
ONNX_MODEL_PATH = "./public/damage_model.onnx"
NUM_CLASSES = 4  # rust_corrosion, dent, fatigue_crack, no_damage

print("[v0] Loading trained model...")

# Load model
model = efficientnet_b0(pretrained=False)
num_features = model.classifier[1].in_features
model.classifier[1] = nn.Linear(num_features, NUM_CLASSES)

# Load weights
state_dict = torch.load(MODEL_PATH, map_location='cpu')
model.load_state_dict(state_dict)
model.eval()

print("[v0] Converting to ONNX format...")

# Create dummy input
dummy_input = torch.randn(1, 3, 224, 224)

# Export to ONNX
torch.onnx.export(
    model,
    dummy_input,
    ONNX_MODEL_PATH,
    input_names=['input'],
    output_names=['output'],
    dynamic_axes={'input': {0: 'batch_size'}, 'output': {0: 'batch_size'}},
    opset_version=14,
    verbose=False
)

print(f"[v0] Model exported to {ONNX_MODEL_PATH}")

# Verify ONNX model
onnx_model = onnx.load(ONNX_MODEL_PATH)
onnx.checker.check_model(onnx_model)
print("[v0] ONNX model verified successfully!")
