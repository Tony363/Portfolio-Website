#!/bin/bash

# Image Optimization Script for Portfolio Website
# This script uses imagemagick and optipng to optimize images
# Install dependencies: sudo apt-get install imagemagick optipng jpegoptim webp

echo "🖼️  Starting image optimization..."

# Create backup directory
BACKUP_DIR="assets/images/backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Function to optimize JPEG images
optimize_jpeg() {
    local file="$1"
    local dir=$(dirname "$file")
    local filename=$(basename "$file")
    
    # Backup original
    cp "$file" "$BACKUP_DIR/$filename"
    
    # Optimize JPEG (quality 85%, progressive, strip metadata)
    jpegoptim --max=85 --strip-all --all-progressive "$file" 2>/dev/null
    
    # Create WebP version
    cwebp -q 85 "$file" -o "${file%.*}.webp" 2>/dev/null
    
    echo "✅ Optimized: $file"
}

# Function to optimize PNG images
optimize_png() {
    local file="$1"
    local dir=$(dirname "$file")
    local filename=$(basename "$file")
    
    # Backup original
    cp "$file" "$BACKUP_DIR/$filename"
    
    # Optimize PNG
    optipng -o5 -strip all "$file" 2>/dev/null
    
    # Create WebP version
    cwebp -q 90 "$file" -o "${file%.*}.webp" 2>/dev/null
    
    echo "✅ Optimized: $file"
}

# Process project images
echo "📁 Processing project images..."
for img in assets/images/projects/*.{jpg,jpeg,png}; do
    if [ -f "$img" ]; then
        case "${img##*.}" in
            jpg|jpeg)
                optimize_jpeg "$img"
                ;;
            png)
                optimize_png "$img"
                ;;
        esac
    fi
done

# Process other images
echo "📁 Processing other images..."
for img in assets/images/*.{jpg,jpeg,png}; do
    if [ -f "$img" ]; then
        case "${img##*.}" in
            jpg|jpeg)
                optimize_jpeg "$img"
                ;;
            png)
                optimize_png "$img"
                ;;
        esac
    fi
done

# Calculate savings
ORIGINAL_SIZE=$(du -sh "$BACKUP_DIR" | cut -f1)
CURRENT_SIZE=$(du -sh assets/images | cut -f1)

echo ""
echo "🎉 Image optimization complete!"
echo "📊 Original size: $ORIGINAL_SIZE"
echo "📊 Optimized size: $CURRENT_SIZE"
echo "💾 Backup saved in: $BACKUP_DIR"
echo ""
echo "💡 Tip: Update your HTML to use WebP with fallback:"
echo '   <picture>'
echo '     <source srcset="image.webp" type="image/webp">'
echo '     <img src="image.jpg" alt="description">'
echo '   </picture>'