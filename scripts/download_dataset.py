"""
Dataset Download and Organization Script
This script helps you download and organize ship/vehicle damage datasets
"""

import os
import shutil
import zipfile
from pathlib import Path
import json

def create_dataset_structure():
    """Create the required dataset folder structure"""
    categories = ['rust', 'dent', 'corrosion', 'fatigue_crack', 'no_damage']
    
    print("Creating dataset folder structure...")
    for category in categories:
        path = Path(f'dataset/{category}')
        path.mkdir(parents=True, exist_ok=True)
        print(f"✓ Created: dataset/{category}/")
    
    print("\n✅ Dataset structure created successfully!")
    print("\nFolder structure:")
    print("dataset/")
    for category in categories:
        print(f"  ├── {category}/")
    
    return categories

def download_from_kaggle(dataset_name):
    """
    Download a dataset from Kaggle
    Requires: pip install kaggle
    And Kaggle API credentials in ~/.kaggle/kaggle.json
    """
    try:
        import kaggle
        print(f"\nDownloading dataset: {dataset_name}")
        kaggle.api.dataset_download_files(dataset_name, path='downloads', unzip=True)
        print("✅ Download complete!")
        return True
    except ImportError:
        print("❌ Kaggle library not installed.")
        print("Install with: pip install kaggle")
        return False
    except Exception as e:
        print(f"❌ Error downloading: {e}")
        print("\nTo use Kaggle API:")
        print("1. Go to https://www.kaggle.com/settings/account")
        print("2. Click 'Create New API Token'")
        print("3. Save kaggle.json to ~/.kaggle/ (Linux/Mac) or C:\\Users\\<username>\\.kaggle\\ (Windows)")
        return False

def organize_images(source_folder, target_category):
    """
    Move images from source folder to target category
    """
    supported_formats = ['.jpg', '.jpeg', '.png', '.bmp', '.webp']
    source_path = Path(source_folder)
    target_path = Path(f'dataset/{target_category}')
    
    if not source_path.exists():
        print(f"❌ Source folder not found: {source_folder}")
        return 0
    
    count = 0
    for file in source_path.rglob('*'):
        if file.is_file() and file.suffix.lower() in supported_formats:
            target_file = target_path / file.name
            # Avoid overwriting
            if target_file.exists():
                target_file = target_path / f"{file.stem}_{count}{file.suffix}"
            shutil.copy2(file, target_file)
            count += 1
    
    print(f"✅ Copied {count} images to dataset/{target_category}/")
    return count

def show_dataset_stats():
    """Show statistics about the current dataset"""
    categories = ['rust', 'dent', 'corrosion', 'fatigue_crack', 'no_damage']
    print("\n📊 Dataset Statistics:")
    print("-" * 40)
    
    total = 0
    for category in categories:
        path = Path(f'dataset/{category}')
        if path.exists():
            count = len(list(path.glob('*.jpg'))) + len(list(path.glob('*.jpeg'))) + \
                    len(list(path.glob('*.png'))) + len(list(path.glob('*.bmp'))) + \
                    len(list(path.glob('*.webp')))
            print(f"{category:20s}: {count:4d} images")
            total += count
        else:
            print(f"{category:20s}:    0 images")
    
    print("-" * 40)
    print(f"{'TOTAL':20s}: {total:4d} images")
    
    if total > 0:
        print("\n✅ You have enough images to start training!" if total >= 250 else 
              f"⚠️  Recommended: {250 - total} more images (50+ per category)")

def main():
    print("=" * 50)
    print("  Damage Detection Dataset Helper")
    print("=" * 50)
    
    print("\nOptions:")
    print("1. Create dataset folder structure")
    print("2. Download sample dataset from Kaggle")
    print("3. Organize existing images into categories")
    print("4. Show dataset statistics")
    print("5. Exit")
    
    choice = input("\nEnter your choice (1-5): ").strip()
    
    if choice == '1':
        create_dataset_structure()
        print("\n📝 Next steps:")
        print("   1. Add images to each category folder")
        print("   2. Run option 4 to check your dataset")
        print("   3. Run: python scripts/train.py")
    
    elif choice == '2':
        print("\n📦 Recommended Kaggle Datasets:")
        print("   1. ultralyticsassist/vechicle-damage-classification")
        print("   2. anujms/car-damage-detection")
        print("   3. lplenka/coco-car-damage-detection-dataset")
        print("   4. Custom dataset")
        
        dataset_choice = input("\nEnter dataset number (1-4): ").strip()
        
        datasets = {
            '1': 'ultralyticsassist/vechicle-damage-classification',
            '2': 'anujms/car-damage-detection',
            '3': 'lplenka/coco-car-damage-detection-dataset',
        }
        
        if dataset_choice == '4':
            dataset_name = input("Enter Kaggle dataset name (username/dataset-name): ").strip()
        else:
            dataset_name = datasets.get(dataset_choice)
        
        if dataset_name:
            create_dataset_structure()
            success = download_from_kaggle(dataset_name)
            if success:
                print("\n✅ Dataset downloaded to 'downloads/' folder")
                print("📝 Next: Use option 3 to organize images into categories")
    
    elif choice == '3':
        print("\nOrganize images into damage categories")
        source = input("Enter source folder path: ").strip()
        
        print("\nAvailable categories:")
        categories = ['rust', 'dent', 'corrosion', 'fatigue_crack', 'no_damage']
        for i, cat in enumerate(categories, 1):
            print(f"   {i}. {cat}")
        
        cat_choice = input("Select category (1-5): ").strip()
        
        if cat_choice.isdigit() and 1 <= int(cat_choice) <= 5:
            target_category = categories[int(cat_choice) - 1]
            organize_images(source, target_category)
        else:
            print("❌ Invalid category")
    
    elif choice == '4':
        show_dataset_stats()
    
    elif choice == '5':
        print("Goodbye!")
        return
    
    else:
        print("❌ Invalid choice")
    
    # Ask to continue
    if input("\nContinue? (y/n): ").strip().lower() == 'y':
        main()

if __name__ == "__main__":
    main()
