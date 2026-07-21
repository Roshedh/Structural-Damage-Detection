# Ship Structural Damage Detection System

A professional offline damage detection system for analyzing structural damage in ships' enclosed spaces. Upload images and get instant classification of damage types (rust, dents, corrosion, etc.) running completely locally.

## Features

- **Offline Inference**: Model runs in browser, no internet needed
- **Custom Trained Models**: Train on your own dataset
- **Instant Results**: Real-time damage classification
- **Confidence Scores**: See how confident the model is
- **Severity Levels**: Quick assessment of damage criticality
- **Professional UI**: Dark theme optimized for industrial environments

## Quick Start

### Current State: Demo Mode

Right now, the system is running in **demo/simulation mode** with random detection results. To get **real AI-powered damage detection**, follow these steps:

### Step 1: Prepare Your Dataset

Use the dataset helper script:

\`\`\`bash
python scripts/download_dataset.py
\`\`\`

Or manually create this structure:

\`\`\`
dataset/
├── rust_corrosion/  (50-100+ images - combine both rust AND corrosion here)
├── dent/            (50-100+ images)
├── fatigue_crack/   (50-100+ images)
└── no_damage/       (50-100+ images)
\`\`\`

See [DATASET_GUIDE.md](DATASET_GUIDE.md) for help finding datasets.

### Step 2: Train Your Model

**Option A: Google Colab (Recommended - Free GPU)**

1. Run the notebook generator:
   \`\`\`bash
   python scripts/generate_colab_notebook.py
   \`\`\`

2. Upload `Damage_Detection_Training.ipynb` to [Google Colab](https://colab.research.google.com)

3. Upload your dataset to Colab and run all cells

4. Download the generated `damage_model.onnx` file

**Option B: Local Training**

\`\`\`bash
# Install Python dependencies
pip install torch torchvision onnx onnxruntime opencv-python pillow numpy matplotlib scikit-learn

# Train the model
python scripts/train.py

# Export to ONNX format
python scripts/export_to_onnx.py
\`\`\`

### Step 3: Add Model to Your App

1. Place `damage_model.onnx` in the `public/` folder
2. Restart your dev server:
   \`\`\`bash
   npm run dev
   \`\`\`

3. The app will automatically detect and use your trained model!

### Step 4: Test It Out

Visit `http://localhost:3000` and upload test images. You should see:
- "Real ONNX model loaded successfully" in the console
- Actual predictions based on your training data

## Project Structure

\`\`\`
├── app/
│   ├── page.tsx              # Main page
│   ├── api/detect-damage/    # Fallback API route
│   └── globals.css           # Styling
├── components/
│   ├── image-uploader.tsx    # Upload & detection
│   ├── damage-results.tsx    # Results display
│   └── header.tsx            # Header
├── lib/
│   └── model-inference.ts    # ONNX inference logic
├── public/
│   └── damage_model.onnx     # Trained model (after export)
└── scripts/
    ├── train.py              # Training script
    ├── export_to_onnx.py     # ONNX export script
    ├── download_dataset.py   # Dataset download helper
    └── generate_colab_notebook.py # Colab notebook generator
\`\`\`

## Damage Types

- **Rust/Corrosion**: Surface oxidation, rust, and material degradation
- **Dent**: Physical deformation and indentations
- **Fatigue Crack**: Structural cracks from stress
- **No Damage**: No significant issues detected

## How It Works

### Current Implementation

The system has **two modes**:

1. **Demo Mode** (Current): Uses simulated random results for testing the UI
   - Shows "[v0] Detection: [type] ([confidence]%)" in console
   - Helps you test the interface before training

2. **Production Mode** (After Training): Uses your trained ONNX model
   - Shows "[v0] Real ONNX model loaded successfully" in console
   - Shows "[v0] Real model detection: [type] ([confidence]%)" in console
   - Provides accurate predictions based on your dataset

### Inference Pipeline

1. **Upload Image**: Drag-drop or click to upload
2. **Preprocessing**: Image resized to 224x224 and normalized with ImageNet stats
3. **Model Check**: Looks for `/public/damage_model.onnx`
   - If found: Runs real inference with ONNX Runtime
   - If not found: Uses demo mode with simulated results
4. **Results**: Classification, confidence, and severity displayed

## Performance

### Demo Mode
- **Model Size**: 0 bytes (no model loaded)
- **Inference Time**: 1.5 seconds (simulated delay)
- **Accuracy**: N/A (random results for UI testing)

### Production Mode (With Trained Model)
- **Model Size**: ~50-100MB (ONNX)
- **Inference Time**: 1-3 seconds (browser-based)
- **Accuracy**: 85-95% (depends on your training data quality)
- **Compatibility**: Works offline on all modern browsers

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Connect GitHub repo in v0
3. Click "Publish"

The model will run offline on your deployed site.

### Run Locally

\`\`\`bash
npm run dev
\`\`\`

Then access at `http://localhost:3000`.

## Technology Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **ML**: PyTorch (training), ONNX (inference), ONNX Runtime (browser execution)
- **UI Components**: shadcn/ui
- **Icons**: Lucide React

## Tips for Best Results

1. **More training data**: 100+ images per damage type
2. **Quality images**: Clear shots showing damage
3. **Varied angles**: Images from different angles and lighting
4. **Balanced dataset**: Similar number of images per category
5. **Regular updates**: Retrain as you collect more data

## Troubleshooting

### "Detection results are random/wrong"
You're in demo mode. Train your model and add `damage_model.onnx` to `public/` folder.

### "Model not loading"
- Check that `public/damage_model.onnx` exists
- Check browser console for "[v0] Real ONNX model loaded successfully"
- If not, check for error messages

### "Low accuracy after training"
- Need more training data (100+ images per category recommended)
- Ensure balanced dataset (similar images per category)
- Check image quality (clear, well-lit photos)
- Train for more epochs

### "Slow inference"
Normal for browser-based inference. Expected 1-3 seconds per image.

## License

MIT

---

For detailed training instructions, see [TRAINING_GUIDE.md](TRAINING_GUIDE.md).
