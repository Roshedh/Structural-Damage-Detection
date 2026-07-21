"""
Export the ultra-fast trained model to ONNX format
"""

import torch
import torch.nn as nn
import torchvision.models as models
import os

print("Converting model to ONNX format...")

# Load class names
with open('class_names.txt', 'r') as f:
    class_names = [line.strip() for line in f.readlines()]

num_classes = len(class_names)
print(f"Detected {num_classes} classes: {class_names}")

# Recreate model architecture
model = models.mobilenet_v2(pretrained=False)
model.classifier[1] = nn.Linear(model.last_channel, num_classes)

# Load trained weights
model.load_state_dict(torch.load('best_model.pth', map_location='cpu'))
model.eval()

print("Model loaded successfully")

# Create dummy input
dummy_input = torch.randn(1, 3, 128, 128)

# Export to ONNX
output_path = 'damage_model.onnx'
torch.onnx.export(
    model,
    dummy_input,
    output_path,
    export_params=True,
    opset_version=11,
    do_constant_folding=True,
    input_names=['input'],
    output_names=['output'],
    dynamic_axes={
        'input': {0: 'batch_size'},
        'output': {0: 'batch_size'}
    }
)

print(f"\n✓ Model exported to '{output_path}'")
print(f"✓ Model size: {os.path.getsize(output_path) / (1024*1024):.2f} MB")
print("\nNext steps:")
print("1. Download this 'damage_model.onnx' file")
print("2. Place it in your project's 'public/' folder")
print("3. Run 'npm run dev' and test!")
