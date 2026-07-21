"""
EMERGENCY ULTRA-FAST TRAINING SCRIPT
Trains in 20-30 minutes with minimal dataset
Optimized for speed over accuracy - good enough for project demo
"""

import torch
import torch.nn as nn
import torchvision.transforms as transforms
from torchvision.datasets import ImageFolder
from torch.utils.data import DataLoader, random_split
import torchvision.models as models
import os
from pathlib import Path

print("=" * 50)
print("ULTRA-FAST EMERGENCY TRAINING")
print("=" * 50)

# Ultra-fast configuration
EPOCHS = 10  # Reduced from 50 for speed
BATCH_SIZE = 32
IMG_SIZE = 128  # Smaller for faster training
LEARNING_RATE = 0.001

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f"Using device: {device}")

# Data transforms (minimal augmentation for speed)
transform = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], 
                       std=[0.229, 0.224, 0.225])
])

# Load dataset
print("\nLoading dataset...")
dataset_path = 'dataset'
if not os.path.exists(dataset_path):
    raise FileNotFoundError(f"Dataset not found at {dataset_path}")

dataset = ImageFolder(dataset_path, transform=transform)
class_names = dataset.classes
num_classes = len(class_names)

print(f"Found {len(dataset)} images across {num_classes} classes:")
for i, name in enumerate(class_names):
    print(f"  {i}: {name}")

# Split dataset
train_size = int(0.8 * len(dataset))
val_size = len(dataset) - train_size
train_dataset, val_dataset = random_split(dataset, [train_size, val_size])

train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True, num_workers=2)
val_loader = DataLoader(val_dataset, batch_size=BATCH_SIZE, shuffle=False, num_workers=2)

print(f"\nTrain samples: {train_size}, Validation samples: {val_size}")

# Use tiny pretrained model (MobileNetV2) for speed
print("\nLoading pretrained MobileNetV2 (small & fast)...")
model = models.mobilenet_v2(pretrained=True)

# Modify final layer
model.classifier[1] = nn.Linear(model.last_channel, num_classes)
model = model.to(device)

# Loss and optimizer
criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=LEARNING_RATE)

print("\nStarting training...")
print(f"Epochs: {EPOCHS} (fast mode)")

best_val_acc = 0

for epoch in range(EPOCHS):
    # Training
    model.train()
    train_loss = 0
    train_correct = 0
    train_total = 0
    
    for batch_idx, (images, labels) in enumerate(train_loader):
        images, labels = images.to(device), labels.to(device)
        
        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        
        train_loss += loss.item()
        _, predicted = outputs.max(1)
        train_total += labels.size(0)
        train_correct += predicted.eq(labels).sum().item()
    
    train_acc = 100. * train_correct / train_total
    
    # Validation
    model.eval()
    val_loss = 0
    val_correct = 0
    val_total = 0
    
    with torch.no_grad():
        for images, labels in val_loader:
            images, labels = images.to(device), labels.to(device)
            outputs = model(images)
            loss = criterion(outputs, labels)
            
            val_loss += loss.item()
            _, predicted = outputs.max(1)
            val_total += labels.size(0)
            val_correct += predicted.eq(labels).sum().item()
    
    val_acc = 100. * val_correct / val_total
    
    print(f"Epoch [{epoch+1}/{EPOCHS}] - "
          f"Train Loss: {train_loss/len(train_loader):.3f}, "
          f"Train Acc: {train_acc:.2f}%, "
          f"Val Loss: {val_loss/len(val_loader):.3f}, "
          f"Val Acc: {val_acc:.2f}%")
    
    # Save best model
    if val_acc > best_val_acc:
        best_val_acc = val_acc
        torch.save(model.state_dict(), 'best_model.pth')

print(f"\nTraining complete! Best validation accuracy: {best_val_acc:.2f}%")
print("Model saved as 'best_model.pth'")

# Save class names
with open('class_names.txt', 'w') as f:
    for name in class_names:
        f.write(f"{name}\n")

print("\nClass names saved to 'class_names.txt'")
print("\nNext: Run 'python scripts/export_fast_to_onnx.py' to convert to ONNX")
