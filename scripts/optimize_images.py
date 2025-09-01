#!/usr/bin/env python3
"""
Portfolio Image Optimization Script
Compresses images using Python PIL library for cross-platform compatibility
"""

import os
import sys
from pathlib import Path
from datetime import datetime
from PIL import Image
import shutil

# Configuration
IMAGE_QUALITY = {
    'projects': 85,  # Project screenshots can be slightly lower quality
    'profile': 95,   # Profile images should be high quality
    'default': 90    # Default quality for other images
}

MAX_WIDTH = {
    'projects': 1920,  # Max width for project screenshots
    'profile': 800,    # Max width for profile images
    'default': 1600    # Default max width
}

def create_backup(src_dir):
    """Create a backup of the original images"""
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_dir = Path(f'assets/images/backup_{timestamp}')
    backup_dir.mkdir(parents=True, exist_ok=True)
    
    print(f"📁 Creating backup in {backup_dir}")
    
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if file.lower().endswith(('.jpg', '.jpeg', '.png', '.gif')):
                src_path = Path(root) / file
                rel_path = src_path.relative_to(src_dir)
                dst_path = backup_dir / rel_path
                dst_path.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(src_path, dst_path)
    
    return backup_dir

def get_image_category(file_path):
    """Determine the category of an image based on its path"""
    path_str = str(file_path).lower()
    if 'projects' in path_str:
        return 'projects'
    elif 'profile' in path_str or 'resume' in path_str:
        return 'profile'
    return 'default'

def optimize_image(file_path, dry_run=False):
    """Optimize a single image file"""
    try:
        # Skip if already optimized (has .webp version)
        webp_path = file_path.with_suffix('.webp')
        if webp_path.exists():
            print(f"  ⏭️  Skipping {file_path.name} (WebP exists)")
            return 0, 0
        
        # Get original size
        original_size = file_path.stat().st_size
        
        # Open image
        img = Image.open(file_path)
        
        # Convert RGBA to RGB if necessary (for JPEG)
        if img.mode == 'RGBA' and file_path.suffix.lower() in ['.jpg', '.jpeg']:
            # Create a white background
            background = Image.new('RGB', img.size, (255, 255, 255))
            background.paste(img, mask=img.split()[3] if len(img.split()) > 3 else None)
            img = background
        
        # Get category-specific settings
        category = get_image_category(file_path)
        quality = IMAGE_QUALITY.get(category, IMAGE_QUALITY['default'])
        max_width = MAX_WIDTH.get(category, MAX_WIDTH['default'])
        
        # Resize if too large
        if img.width > max_width:
            ratio = max_width / img.width
            new_height = int(img.height * ratio)
            img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
            print(f"  📐 Resized {file_path.name}: {img.width}x{img.height}")
        
        if not dry_run:
            # Save optimized version
            if file_path.suffix.lower() in ['.jpg', '.jpeg']:
                img.save(file_path, 'JPEG', quality=quality, optimize=True)
            elif file_path.suffix.lower() == '.png':
                img.save(file_path, 'PNG', optimize=True)
            
            # Create WebP version for larger images
            if original_size > 100 * 1024:  # > 100KB
                img.save(webp_path, 'WebP', quality=quality, method=6)
                webp_size = webp_path.stat().st_size
                print(f"  🎨 Created WebP: {webp_path.name} ({webp_size // 1024}KB)")
        
        # Get new size
        new_size = file_path.stat().st_size if not dry_run else original_size
        
        return original_size, new_size
        
    except Exception as e:
        print(f"  ❌ Error processing {file_path}: {e}")
        return 0, 0

def optimize_directory(directory, dry_run=False):
    """Optimize all images in a directory"""
    directory = Path(directory)
    total_original = 0
    total_optimized = 0
    file_count = 0
    
    print(f"\n📂 Processing {directory}")
    print("=" * 50)
    
    for file_path in directory.rglob('*'):
        if file_path.is_file() and file_path.suffix.lower() in ['.jpg', '.jpeg', '.png', '.gif']:
            # Skip backup directories
            if 'backup' in str(file_path):
                continue
                
            print(f"  🖼️  {file_path.relative_to(directory)}")
            original, optimized = optimize_image(file_path, dry_run)
            
            if original > 0:
                total_original += original
                total_optimized += optimized
                file_count += 1
                
                if original != optimized:
                    saved = original - optimized
                    percent = (saved / original) * 100
                    print(f"     ✅ Saved {saved // 1024}KB ({percent:.1f}%)")
    
    if file_count > 0:
        total_saved = total_original - total_optimized
        total_percent = (total_saved / total_original) * 100
        print(f"\n📊 Summary for {directory.name}:")
        print(f"  Files processed: {file_count}")
        print(f"  Original size: {total_original // (1024 * 1024):.1f}MB")
        print(f"  Optimized size: {total_optimized // (1024 * 1024):.1f}MB")
        print(f"  Total saved: {total_saved // (1024 * 1024):.1f}MB ({total_percent:.1f}%)")
    
    return total_original, total_optimized

def main():
    """Main execution"""
    print("🚀 Portfolio Image Optimization Tool")
    print("=" * 50)
    
    # Check if PIL is installed
    try:
        from PIL import Image
    except ImportError:
        print("❌ Pillow library not installed!")
        print("📦 Install with: pip install Pillow")
        sys.exit(1)
    
    # Set working directory
    os.chdir('/home/tony/Desktop/Portfolio-Website')
    
    # Parse arguments
    dry_run = '--dry-run' in sys.argv
    if dry_run:
        print("🔍 DRY RUN MODE - No files will be modified\n")
    
    # Create backup
    if not dry_run:
        backup_dir = create_backup(Path('assets/images'))
        print(f"✅ Backup created: {backup_dir}\n")
    
    # Optimize images
    assets_dir = Path('assets/images')
    total_original, total_optimized = optimize_directory(assets_dir, dry_run)
    
    # Final summary
    print("\n" + "=" * 50)
    print("✨ OPTIMIZATION COMPLETE!")
    print("=" * 50)
    
    if total_original > 0:
        total_saved = total_original - total_optimized
        total_percent = (total_saved / total_original) * 100
        print(f"📈 Total Results:")
        print(f"  Original size: {total_original // (1024 * 1024):.1f}MB")
        print(f"  Optimized size: {total_optimized // (1024 * 1024):.1f}MB")
        print(f"  Total saved: {total_saved // (1024 * 1024):.1f}MB ({total_percent:.1f}%)")
    
    if not dry_run:
        print(f"\n💾 Original images backed up to: {backup_dir}")
        print("🔍 Review optimized images and delete backup if satisfied")
    
    print("\n📝 Next Steps:")
    print("  1. Update HTML to use .webp images with fallbacks")
    print("  2. Implement lazy loading attributes")
    print("  3. Add responsive srcset attributes")
    print("  4. Test site performance with Lighthouse")

if __name__ == "__main__":
    main()