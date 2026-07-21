import json
import os

# Create the Jupyter notebook structure
notebook = {
    "cells": [
        {
            "cell_type": "markdown",
            "metadata": {},
            "source": [
                "# Damage Detection Model Training\n",
                "\n",
                "This notebook trains a damage detection model using PyTorch and exports it to ONNX format for use in your Next.js web app."
            ]
        },
        {
            "cell_type": "markdown",
            "metadata": {},
            "source": [
                "## Step 1: Install Dependencies"
            ]
        },
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "!pip install torch torchvision opencv-python pillow numpy matplotlib scikit-learn onnx onnxruntime -q"
            ]
        },
        {
            "cell_type": "markdown",
            "metadata": {},
            "source": [
                "## Step 2: Import Libraries"
            ]
        },
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "import torch\n",
                "import torch.nn as nn\n",
                "import torch.optim as optim\n",
                "from torch.utils.data import DataLoader, Dataset\n",
                "import torchvision.transforms as transforms\n",
                "import torchvision.models as models\n",
                "from sklearn.model_selection import train_test_split\n",
                "from pathlib import Path\n",
                "import json\n",
                "import numpy as np\n",
                "from PIL import Image\n",
                "import matplotlib.pyplot as plt\n",
                "import os\n",
                "from google.colab import files\n",
                "\n",
                "print('Libraries imported successfully!')"
            ]
        },
        {
            "cell_type": "markdown",
            "metadata": {},
            "source": [
                "## Step 3: Upload Your Dataset\n",
                "\n",
                "Upload your damage detection dataset. Expected structure:\n",
                "```\n",
                "dataset/\n",
                "├── damaged/\n",
                "│   ├── image1.jpg\n",
                "│   └── ...\n",
                "└── undamaged/\n",
                "    ├── image1.jpg\n",
                "    └── ...\n",
                "```"
            ]
        },
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "# Upload dataset\n",
                "print('Click to upload your dataset folder or files:')\n",
                "uploaded = files.upload()\n",
                "print(f'Uploaded files: {list(uploaded.keys())}')"
            ]
        },
        {
            "cell_type": "markdown",
            "metadata": {},
            "source": [
                "## Step 4: Define Dataset Class"
            ]
        },
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "class DamageDataset(Dataset):\n",
                "    def __init__(self, image_paths, labels, transform=None):\n",
                "        self.image_paths = image_paths\n",
                "        self.labels = labels\n",
                "        self.transform = transform\n",
                "    \n",
                "    def __len__(self):\n",
                "        return len(self.image_paths)\n",
                "    \n",
                "    def __getitem__(self, idx):\n",
                "        image = Image.open(self.image_paths[idx]).convert('RGB')\n",
                "        if self.transform:\n",
                "            image = self.transform(image)\n",
                "        return image, self.labels[idx]\n",
                "\n",
                "print('DamageDataset class defined')"
            ]
        },
        {
            "cell_type": "markdown",
            "metadata": {},
            "source": [
                "## Step 5: Load Dataset"
            ]
        },
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "# Load images from dataset directory\n",
                "dataset_path = Path('/content/dataset')\n",
                "image_paths = []\n",
                "labels = []\n",
                "\n",
                "# Load damaged images (label: 1)\n",
                "damaged_path = dataset_path / 'damaged'\n",
                "if damaged_path.exists():\n",
                "    for img_file in damaged_path.glob('*.jpg'):\n",
                "        image_paths.append(str(img_file))\n",
                "        labels.append(1)\n",
                "\n",
                "# Load undamaged images (label: 0)\n",
                "undamaged_path = dataset_path / 'undamaged'\n",
                "if undamaged_path.exists():\n",
                "    for img_file in undamaged_path.glob('*.jpg'):\n",
                "        image_paths.append(str(img_file))\n",
                "        labels.append(0)\n",
                "\n",
                "print(f'Loaded {len(image_paths)} images')\n",
                "print(f'Damaged: {labels.count(1)}, Undamaged: {labels.count(0)}')"
            ]
        },
        {
            "cell_type": "markdown",
            "metadata": {},
            "source": [
                "## Step 6: Split Data"
            ]
        },
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "X_train, X_val, y_train, y_val = train_test_split(\n",
                "    image_paths, labels, test_size=0.2, random_state=42, stratify=labels\n",
                ")\n",
                "\n",
                "print(f'Training set: {len(X_train)} images')\n",
                "print(f'Validation set: {len(X_val)} images')"
            ]
        },
        {
            "cell_type": "markdown",
            "metadata": {},
            "source": [
                "## Step 7: Create Data Loaders"
            ]
        },
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "transform = transforms.Compose([\n",
                "    transforms.Resize((224, 224)),\n",
                "    transforms.ToTensor(),\n",
                "    transforms.Normalize(mean=[0.485, 0.456, 0.406],\n",
                "                       std=[0.229, 0.224, 0.225])\n",
                "])\n",
                "\n",
                "train_dataset = DamageDataset(X_train, y_train, transform)\n",
                "val_dataset = DamageDataset(X_val, y_val, transform)\n",
                "\n",
                "train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True)\n",
                "val_loader = DataLoader(val_dataset, batch_size=32, shuffle=False)\n",
                "\n",
                "print(f'Data loaders created')"
            ]
        },
        {
            "cell_type": "markdown",
            "metadata": {},
            "source": [
                "## Step 8: Define Model"
            ]
        },
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "class DamageDetectionModel(nn.Module):\n",
                "    def __init__(self):\n",
                "        super().__init__()\n",
                "        self.resnet = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)\n",
                "        self.resnet.fc = nn.Sequential(\n",
                "            nn.Linear(512, 256),\n",
                "            nn.ReLU(),\n",
                "            nn.Dropout(0.5),\n",
                "            nn.Linear(256, 1),\n",
                "            nn.Sigmoid()\n",
                "        )\n",
                "    \n",
                "    def forward(self, x):\n",
                "        return self.resnet(x)\n",
                "\n",
                "device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')\n",
                "model = DamageDetectionModel().to(device)\n",
                "print(f'Model created on {device}')"
            ]
        },
        {
            "cell_type": "markdown",
            "metadata": {},
            "source": [
                "## Step 9: Train Model"
            ]
        },
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "criterion = nn.BCELoss()\n",
                "optimizer = optim.Adam(model.parameters(), lr=0.001)\n",
                "\n",
                "epochs = 10\n",
                "train_losses = []\n",
                "val_losses = []\n",
                "\n",
                "for epoch in range(epochs):\n",
                "    # Training\n",
                "    model.train()\n",
                "    train_loss = 0\n",
                "    for images, labels_batch in train_loader:\n",
                "        images, labels_batch = images.to(device), labels_batch.to(device).float().unsqueeze(1)\n",
                "        \n",
                "        optimizer.zero_grad()\n",
                "        outputs = model(images)\n",
                "        loss = criterion(outputs, labels_batch)\n",
                "        loss.backward()\n",
                "        optimizer.step()\n",
                "        train_loss += loss.item()\n",
                "    \n",
                "    avg_train_loss = train_loss / len(train_loader)\n",
                "    train_losses.append(avg_train_loss)\n",
                "    \n",
                "    # Validation\n",
                "    model.eval()\n",
                "    val_loss = 0\n",
                "    with torch.no_grad():\n",
                "        for images, labels_batch in val_loader:\n",
                "            images, labels_batch = images.to(device), labels_batch.to(device).float().unsqueeze(1)\n",
                "            outputs = model(images)\n",
                "            loss = criterion(outputs, labels_batch)\n",
                "            val_loss += loss.item()\n",
                "    \n",
                "    avg_val_loss = val_loss / len(val_loader)\n",
                "    val_losses.append(avg_val_loss)\n",
                "    \n",
                "    print(f'Epoch {epoch+1}/{epochs} - Train Loss: {avg_train_loss:.4f}, Val Loss: {avg_val_loss:.4f}')\n",
                "\n",
                "print('Training completed!')"
            ]
        },
        {
            "cell_type": "markdown",
            "metadata": {},
            "source": [
                "## Step 10: Plot Training History"
            ]
        },
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "plt.figure(figsize=(10, 6))\n",
                "plt.plot(train_losses, label='Training Loss')\n",
                "plt.plot(val_losses, label='Validation Loss')\n",
                "plt.xlabel('Epoch')\n",
                "plt.ylabel('Loss')\n",
                "plt.title('Model Training History')\n",
                "plt.legend()\n",
                "plt.grid(True)\n",
                "plt.show()\n",
                "\n",
                "print('Training history plotted')"
            ]
        },
        {
            "cell_type": "markdown",
            "metadata": {},
            "source": [
                "## Step 11: Export to ONNX"
            ]
        },
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "import onnx\n",
                "import torch.onnx\n",
                "\n",
                "# Create a dummy input\n",
                "dummy_input = torch.randn(1, 3, 224, 224).to(device)\n",
                "\n",
                "# Export to ONNX\n",
                "torch.onnx.export(\n",
                "    model,\n",
                "    dummy_input,\n",
                "    'damage_model.onnx',\n",
                "    export_params=True,\n",
                "    opset_version=12,\n",
                "    do_constant_folding=True,\n",
                "    input_names=['input'],\n",
                "    output_names=['output'],\n",
                "    dynamic_axes={'input': {0: 'batch_size'}, 'output': {0: 'batch_size'}}\n",
                ")\n",
                "\n",
                "print('Model exported to ONNX format!')"
            ]
        },
        {
            "cell_type": "markdown",
            "metadata": {},
            "source": [
                "## Step 12: Download Model"
            ]
        },
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "# Download the ONNX model\n",
                "files.download('damage_model.onnx')\n",
                "print('Model downloaded! Move it to your Next.js public/ folder to use it in your web app.')"
            ]
        }
    ],
    "metadata": {
        "kernelspec": {
            "display_name": "Python 3",
            "language": "python",
            "name": "python3"
        },
        "language_info": {
            "codemirror_mode": {
                "name": "ipython",
                "version": 3
            },
            "file_extension": ".py",
            "mimetype": "text/x-python",
            "name": "python",
            "nbconvert_exporter": "python",
            "pygments_lexer": "ipython3",
            "version": "3.10.0"
        }
    },
    "nbformat": 4,
    "nbformat_minor": 4
}

# Save the notebook
output_path = 'Damage_Detection_Training.ipynb'
with open(output_path, 'w') as f:
    json.dump(notebook, f, indent=2)

print(f'Notebook created: {output_path}')
print('You can now download this file and open it in Google Colab!')
