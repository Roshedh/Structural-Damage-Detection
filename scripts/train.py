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

# Configuration
DATASET_PATH = "./dataset"  # Update this to your dataset folder path
DAMAGE_TYPES = ["rust_corrosion", "dent", "fatigue_crack", "no_damage"]
BATCH_SIZE = 16
EPOCHS = 50
LEARNING_RATE = 0.001
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
MODEL_SAVE_PATH = "./trained_model.pth"

print(f"[v0] Training on device: {DEVICE}")

# Dataset class
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
                
            for image_name in os.listdir(damage_dir):
                if image_name.endswith(('.jpg', '.jpeg', '.png')):
                    self.image_paths.append(os.path.join(damage_dir, image_name))
                    self.labels.append(idx)
        
        print(f"[v0] Loaded {len(self.image_paths)} images")
    
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

# Data transforms
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
print("[v0] Loading dataset...")
dataset = DamageDataset(DATASET_PATH, DAMAGE_TYPES, transform=train_transform)

# Split into train/val
train_size = int(0.8 * len(dataset))
val_size = len(dataset) - train_size
train_dataset, val_dataset = torch.utils.data.random_split(dataset, [train_size, val_size])

# Update val_dataset transform
val_dataset.dataset.transform = val_transform

train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True)
val_loader = DataLoader(val_dataset, batch_size=BATCH_SIZE, shuffle=False)

print(f"[v0] Train samples: {len(train_dataset)}, Val samples: {len(val_dataset)}")

# Model
model = efficientnet_b0(pretrained=True)
num_features = model.classifier[1].in_features
model.classifier[1] = nn.Linear(num_features, len(DAMAGE_TYPES))
model = model.to(DEVICE)

# Loss and optimizer
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=LEARNING_RATE)

# Training loop
best_val_loss = float('inf')

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
    accuracy = 100 * correct / total
    
    print(f"[v0] Epoch {epoch+1}/{EPOCHS} - Train Loss: {train_loss:.4f}, Val Loss: {val_loss:.4f}, Accuracy: {accuracy:.2f}%")
    
    # Save best model
    if val_loss < best_val_loss:
        best_val_loss = val_loss
        torch.save(model.state_dict(), MODEL_SAVE_PATH)
        print(f"[v0] Model saved to {MODEL_SAVE_PATH}")

print(f"[v0] Training complete! Best model saved to {MODEL_SAVE_PATH}")
