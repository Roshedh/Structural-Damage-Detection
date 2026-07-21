"""
Clean Metal Surface Image Downloader
Downloads undamaged metal surface images for the 'no_damage' category
"""

import os
import requests
from pathlib import Path
import time

def create_no_damage_folder():
    """Create the no_damage folder if it doesn't exist"""
    path = Path('dataset/no_damage')
    path.mkdir(parents=True, exist_ok=True)
    return path

def download_from_unsplash(query, count=50):
    """
    Download images from Unsplash (free stock photos)
    Note: For production use, register for Unsplash API key at https://unsplash.com/developers
    """
    print(f"\n🔍 Searching for: {query}")
    print("⚠️  For large-scale use, register for Unsplash API at https://unsplash.com/developers")
    print("📝 Manual download recommended for best quality\n")
    
    # Free search URLs for manual download
    search_urls = [
        f"https://unsplash.com/s/photos/{query.replace(' ', '-')}",
        f"https://pixabay.com/images/search/{query.replace(' ', '%20')}/",
        f"https://www.pexels.com/search/{query.replace(' ', '%20')}/",
    ]
    
    print("📸 Download clean metal images from these sources:")
    for i, url in enumerate(search_urls, 1):
        print(f"   {i}. {url}")
    
    return search_urls

def show_manual_instructions():
    """Show instructions for manually downloading images"""
    print("\n" + "="*60)
    print("  How to Get Clean Metal Surface Images")
    print("="*60)
    
    print("\n📋 Recommended Search Terms:")
    terms = [
        "clean steel surface",
        "polished metal texture",
        "stainless steel surface",
        "aluminum sheet",
        "clean ship hull",
        "metal plate texture",
        "industrial metal surface",
        "chrome metal surface",
        "brushed metal texture",
        "clean steel plate"
    ]
    
    for term in terms:
        print(f"   • {term}")
    
    print("\n🌐 Free Stock Photo Websites:")
    websites = [
        ("Unsplash", "https://unsplash.com", "High-quality, free images"),
        ("Pexels", "https://www.pexels.com", "Free stock photos"),
        ("Pixabay", "https://pixabay.com", "Free images and videos"),
        ("Freepik", "https://www.freepik.com", "Free vectors and photos"),
    ]
    
    for name, url, desc in websites:
        print(f"\n   {name} - {desc}")
        print(f"   {url}")
    
    print("\n📝 Download Instructions:")
    print("   1. Visit any of the websites above")
    print("   2. Search for the terms listed")
    print("   3. Download 50-100 images of clean, undamaged metal")
    print("   4. Save them to: dataset/no_damage/")
    print("   5. Supported formats: JPG, PNG, BMP, WebP")
    
    print("\n✅ Image Quality Tips:")
    print("   • Look for clear, well-lit surfaces")
    print("   • Avoid images with damage, rust, or scratches")
    print("   • Include variety: different metals, finishes, angles")
    print("   • Resolution: At least 224x224 pixels (higher is better)")

def download_sample_images():
    """
    Download a few sample images using requests
    (Limited quantity without API key)
    """
    path = create_no_damage_folder()
    
    print("\n📥 Downloading sample clean metal images...")
    print("⚠️  This downloads only a few samples.")
    print("    For training, you need 50-100+ images.\n")
    
    # Sample direct image URLs (royalty-free)
    # Note: These are placeholders - in production, use proper API or manual download
    sample_urls = [
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",  # Steel texture
        "https://images.unsplash.com/photo-1558618666-f6d21a5e8f8f?w=400",  # Metal surface
    ]
    
    count = 0
    for i, url in enumerate(sample_urls, 1):
        try:
            response = requests.get(url, timeout=10)
            if response.status_code == 200:
                filename = path / f"clean_metal_sample_{i}.jpg"
                with open(filename, 'wb') as f:
                    f.write(response.content)
                print(f"✓ Downloaded: {filename.name}")
                count += 1
                time.sleep(1)  # Be respectful to servers
        except Exception as e:
            print(f"✗ Failed to download image {i}: {e}")
    
    print(f"\n✅ Downloaded {count} sample images")
    print("📝 You need to manually download 50-100+ more images")

def check_no_damage_count():
    """Check how many images are in no_damage folder"""
    path = Path('dataset/no_damage')
    if not path.exists():
        print("❌ Folder 'dataset/no_damage' doesn't exist")
        return 0
    
    extensions = ['.jpg', '.jpeg', '.png', '.bmp', '.webp']
    count = sum(1 for f in path.iterdir() 
                if f.is_file() and f.suffix.lower() in extensions)
    
    print(f"\n📊 Current no_damage images: {count}")
    
    if count < 50:
        print(f"⚠️  Need {50 - count} more images (minimum 50 recommended)")
    else:
        print("✅ Sufficient images for training!")
    
    return count

def main():
    print("="*60)
    print("  Clean Metal Surface Dataset Helper")
    print("="*60)
    
    print("\nOptions:")
    print("1. Show manual download instructions")
    print("2. Download sample images (limited)")
    print("3. Open search pages in browser")
    print("4. Check current image count")
    print("5. Exit")
    
    choice = input("\nEnter your choice (1-5): ").strip()
    
    if choice == '1':
        show_manual_instructions()
    
    elif choice == '2':
        create_no_damage_folder()
        download_sample_images()
        print("\n📝 Next: Manually download more images using option 1 instructions")
    
    elif choice == '3':
        queries = ["clean+steel+surface", "polished+metal", "stainless+steel+texture"]
        print("\n🌐 Opening search pages...")
        for query in queries:
            download_from_unsplash(query, 50)
        
        print("\n💡 TIP: Right-click images and 'Save As' to dataset/no_damage/")
    
    elif choice == '4':
        check_no_damage_count()
    
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
