# Damage Detection System - Google Colab Notebook
# This script trains a damage detection model and runs inference in Google Colab
# No setup required - just run the cells!

# ============================================================================
# CELL 1: Install Dependencies
# ============================================================================
# !pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
# !pip install onnx onnxruntime pillow numpy matplotlib

# ============================================================================
# CELL 2: Import Libraries
# ============================================================================
import os
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, Dataset
import torchvision.transforms as transforms
from torchvision.models import efficientnet_b0
from pathlib import Path
from PIL import Image
import numpy as np
import matplotlib.pyplot as plt
from IPython.display import display, Image as IPImage
import onnx

print("[v0] Environment ready!")
print(f"[v0] PyTorch version: {torch.__version__}")
print(f"[v0] GPU available: {torch.cuda.is_available()}")
if torch.cuda.is_available():
    print(f"[v0] GPU: {torch.cuda.get_device_name(0)}")

# ============================================================================
# CELL 3: Configuration
# ============================================================================
# Configuration
DAMAGE_TYPES = ["rust", "dent", "corrosion", "fatigue_crack", "no_damage"]
BATCH_SIZE = 16
EPOCHS = 30  # Reduced for Colab demo
LEARNING_RATE = 0.001
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
MODEL_SAVE_PATH = "/content/trained_model.pth"
ONNX_MODEL_PATH = "/content/damage_model.onnx"
DATASET_PATH = "/content/dataset"

print(f"[v0] Configuration:")
print(f"[v0] Device: {DEVICE}")
print(f"[v0] Damage Types: {DAMAGE_TYPES}")
print(f"[v0] Epochs: {EPOCHS}")

# ============================================================================
# CELL 4: Define Dataset Class
# ============================================================================
class DamageDataset(Dataset):
    def __init__(self, root_dir, damage_types, transform=None):
        self.image_paths = []
        self.labels = []
        self.transform = transform
        
        for idx, damage_type in enumerate(damage_types):
            damage_dir = os.path.join(root_dir, damage_type)
            if not os.path.exists(damage_dir):
                print(f"[v0] Warning: {damage_dir} not found")
                continue
                
            images = [f for f in os.listdir(damage_dir) if f.endswith(('.jpg', '.jpeg', '.png'))]
            for image_name in images:
                self.image_paths.append(os.path.join(damage_dir, image_name))
                self.labels.append(idx)
        
        print(f"[v0] Loaded {len(self.image_paths)} images from {len(damage_types)} categories")
    
    def __len__(self):
        return len(self.image_paths)
    
    def __getitem__(self, idx):
        try:
            image = Image.open(self.image_paths[idx]).convert('RGB')
            if self.transform:
                image = self.transform(image)
            return image, self.labels[idx]
        except Exception as e:
            print(f"[v0] Error loading {self.image_paths[idx]}: {e}")
            return torch.zeros(3, 224, 224), 0

# ============================================================================
# CELL 5: Create Demo Dataset (or upload your own)
# ============================================================================
def create_demo_dataset(dataset_path, damage_types, images_per_type=10):
    """Create a demo dataset with random images for testing"""
    print("[v0] Creating demo dataset...")
    
    os.makedirs(dataset_path, exist_ok=True)
    
    for damage_type in damage_types:
        type_dir = os.path.join(dataset_path, damage_type)
        os.makedirs(type_dir, exist_ok=True)
        
        # Create 10 random images per category
        for i in range(images_per_type):
            # Create a random image
            img_array = np.random.randint(0, 256, (224, 224, 3), dtype=np.uint8)
            img = Image.fromarray(img_array)
            img.save(os.path.join(type_dir, f"{damage_type}_{i}.jpg"))
    
    print(f"[v0] Demo dataset created at {dataset_path}")
    print(f"[v0] Total images: {len(damage_types) * images_per_type}")

# Uncomment below to create demo dataset
# create_demo_dataset(DATASET_PATH, DAMAGE_TYPES, images_per_type=10)

# For production: Upload your dataset to Colab
# print("[v0] To use your own dataset:")
# print("[v0] 1. Click 'Files' in left sidebar")
# print("[v0] 2. Upload your 'dataset' folder with structure:")
# print("[v0]    dataset/rust/, dataset/dent/, dataset/corrosion/, etc.")

# ============================================================================
# CELL 6: Load Dataset and Create DataLoaders
# ============================================================================
print("[v0] Loading dataset...")

train_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.RandomHorizontalFlip(),
    transforms.RandomRotation(15),
    transforms.ColorJitter(brightness=0.2, contrast=0.2),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225])
])

val_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225])
])

# Load dataset
if not os.path.exists(DATASET_PATH):
    print(f"[v0] Dataset not found at {DATASET_PATH}")
    print("[v0] Creating demo dataset for training...")
    create_demo_dataset(DATASET_PATH, DAMAGE_TYPES, images_per_type=20)

dataset = DamageDataset(DATASET_PATH, DAMAGE_TYPES, transform=train_transform)

if len(dataset) == 0:
    print("[v0] ERROR: No images found in dataset!")
    print("[v0] Please upload your dataset to /content/dataset/")
else:
    # Split into train/val
    train_size = int(0.8 * len(dataset))
    val_size = len(dataset) - train_size
    train_dataset, val_dataset = torch.utils.data.random_split(dataset, [train_size, val_size])
    
    # Update val_dataset transform
    val_dataset.dataset.transform = val_transform
    
    train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=BATCH_SIZE, shuffle=False)
    
    print(f"[v0] Train samples: {len(train_dataset)}, Val samples: {len(val_dataset)}")

# ============================================================================
# CELL 7: Build Model
# ============================================================================
print("[v0] Building model...")

model = efficientnet_b0(pretrained=True)
num_features = model.classifier[1].in_features
model.classifier[1] = nn.Linear(num_features, len(DAMAGE_TYPES))
model = model.to(DEVICE)

print(f"[v0] Model: EfficientNet-B0")
print(f"[v0] Output classes: {len(DAMAGE_TYPES)}")
print(f"[v0] Total parameters: {sum(p.numel() for p in model.parameters()):,}")

# ============================================================================
# CELL 8: Training Loop
# ============================================================================
print("[v0] Starting training...")

criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=LEARNING_RATE)

best_val_loss = float('inf')
train_losses = []
val_losses = []
val_accuracies = []

for epoch in range(EPOCHS):
    # Train
    model.train()
    train_loss = 0
    for images, labels in train_loader:
        images, labels = images.to(DEVICE), labels.to(DEVICE)
        
        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        
        train_loss += loss.item()
    
    # Validate
    model.eval()
    val_loss = 0
    correct = 0
    total = 0
    
    with torch.no_grad():
        for images, labels in val_loader:
            images, labels = images.to(DEVICE), labels.to(DEVICE)
            outputs = model(images)
            loss = criterion(outputs, labels)
            val_loss += loss.item()
            
            _, predicted = torch.max(outputs.data, 1)
            total += labels.size(0)
            correct += (predicted == labels).sum().item()
    
    train_loss /= len(train_loader)
    val_loss /= len(val_loader)
    accuracy = 100 * correct / total if total > 0 else 0
    
    train_losses.append(train_loss)
    val_losses.append(val_loss)
    val_accuracies.append(accuracy)
    
    print(f"[v0] Epoch {epoch+1}/{EPOCHS} - Train Loss: {train_loss:.4f}, Val Loss: {val_loss:.4f}, Accuracy: {accuracy:.2f}%")
    
    # Save best model
    if val_loss < best_val_loss:
        best_val_loss = val_loss
        torch.save(model.state_dict(), MODEL_SAVE_PATH)

print(f"[v0] Training complete! Model saved to {MODEL_SAVE_PATH}")

# ============================================================================
# CELL 9: Plot Training History
# ============================================================================
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4))

# Loss plot
ax1.plot(train_losses, label='Train Loss')
ax1.plot(val_losses, label='Val Loss')
ax1.set_xlabel('Epoch')
ax1.set_ylabel('Loss')
ax1.set_title('Training History - Loss')
ax1.legend()
ax1.grid(True)

# Accuracy plot
ax2.plot(val_accuracies, label='Val Accuracy')
ax2.set_xlabel('Epoch')
ax2.set_ylabel('Accuracy (%)')
ax2.set_title('Training History - Accuracy')
ax2.legend()
ax2.grid(True)

plt.tight_layout()
plt.savefig('/content/training_history.png', dpi=100, bbox_inches='tight')
plt.show()

print("[v0] Training history saved!")

# ============================================================================
# CELL 10: Export to ONNX
# ============================================================================
print("[v0] Converting model to ONNX format...")

# Load best model
model = efficientnet_b0(pretrained=False)
num_features = model.classifier[1].in_features
model.classifier[1] = nn.Linear(num_features, len(DAMAGE_TYPES))
state_dict = torch.load(MODEL_SAVE_PATH, map_location='cpu')
model.load_state_dict(state_dict)
model.eval()

# Export to ONNX
dummy_input = torch.randn(1, 3, 224, 224)
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

# Verify ONNX model
onnx_model = onnx.load(ONNX_MODEL_PATH)
onnx.checker.check_model(onnx_model)

print(f"[v0] Model exported to {ONNX_MODEL_PATH}")
print(f"[v0] Model size: {os.path.getsize(ONNX_MODEL_PATH) / 1e6:.2f} MB")
print("[v0] ONNX model verified successfully!")

# ============================================================================
# CELL 11: Test Inference
# ============================================================================
print("[v0] Testing inference on validation set...")

# Create a test image
val_dataset_obj = DamageDataset(DATASET_PATH, DAMAGE_TYPES, transform=val_transform)
test_loader = DataLoader(val_dataset_obj, batch_size=1, shuffle=True)

model = model.to(DEVICE)
model.eval()

with torch.no_grad():
    images, labels = next(iter(test_loader))
    images = images.to(DEVICE)
    outputs = model(images)
    probabilities = torch.nn.functional.softmax(outputs, dim=1)
    confidence, predicted = torch.max(probabilities, 1)
    
    predicted_class = DAMAGE_TYPES[predicted.item()]
    true_class = DAMAGE_TYPES[labels.item()]
    confidence_pct = confidence.item() * 100
    
    print(f"[v0] Test Prediction:")
    print(f"[v0] Predicted: {predicted_class} ({confidence_pct:.1f}%)")
    print(f"[v0] True: {true_class}")
    print(f"[v0] Match: {'✓' if predicted_class == true_class else '✗'}")

print("\n[v0] ============================================================")
print("[v0] Training Complete!")
print("[v0] ============================================================")
print(f"[v0] Model saved: {MODEL_SAVE_PATH}")
print(f"[v0] ONNX model: {ONNX_MODEL_PATH}")
print(f"[v0] Next steps:")
print(f"[v0] 1. Download the ONNX model to use in your web app")
print(f"[v0] 2. Place it in your project's 'public/' folder")
print(f"[v0] 3. Run the web app with 'npm run dev'")
print("[v0] ============================================================")
