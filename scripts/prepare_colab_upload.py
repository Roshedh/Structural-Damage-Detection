"""
Helper script to prepare your dataset for Colab upload
Run this on your local machine before uploading to Colab
"""

import os
import zipfile
from pathlib import Path

def create_dataset_zip():
    """Create a ZIP file of your dataset folder"""
    
    dataset_path = Path('dataset')
    
    if not dataset_path.exists():
        print("❌ Error: 'dataset' folder not found!")
        print("Make sure you run this script from your project root directory.")
        return
    
    # Check if dataset has images
    categories = ['rust_corrosion', 'dent', 'fatigue_crack', 'no_damage']
    total_images = 0
    
    print("📊 Checking dataset structure...\n")
    print("-" * 50)
    
    for category in categories:
        cat_path = dataset_path / category
        if cat_path.exists():
            images = list(cat_path.glob('*.jpg')) + list(cat_path.glob('*.jpeg')) + list(cat_path.glob('*.png'))
            count = len(images)
            total_images += count
            print(f"{category:20s}: {count:4d} images")
        else:
            print(f"{category:20s}: ❌ MISSING")
    
    print("-" * 50)
    print(f"Total images: {total_images}\n")
    
    if total_images == 0:
        print("❌ No images found in dataset folders!")
        return
    
    # Create ZIP file
    zip_filename = 'dataset_for_colab.zip'
    print(f"📦 Creating {zip_filename}...")
    
    with zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(dataset_path):
            for file in files:
                if file.lower().endswith(('.jpg', '.jpeg', '.png')):
                    file_path = os.path.join(root, file)
                    arcname = os.path.relpath(file_path, '.')
                    zipf.write(file_path, arcname)
                    print(f"  Added: {arcname}")
    
    zip_size = os.path.getsize(zip_filename) / (1024 * 1024)  # MB
    print(f"\n✅ Success! Created {zip_filename} ({zip_size:.2f} MB)")
    print(f"\n📤 Next steps:")
    print(f"1. Upload '{zip_filename}' to Google Colab")
    print(f"2. Run the upload cell in your Colab notebook")
    print(f"3. The dataset will be extracted to /content/dataset/")

if __name__ == "__main__":
    create_dataset_zip()
