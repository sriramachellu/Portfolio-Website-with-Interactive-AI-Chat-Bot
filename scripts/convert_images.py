import os
import glob
from PIL import Image
import rawpy
import imageio
from pillow_heif import register_heif_opener

# Register HEIF/HEIC support with Pillow
register_heif_opener()

def convert_to_jpg(directory):
    print(f"\n🔍 Scanning directory: {directory} for unsupported images...")
    
    # Supported web formats
    valid_extensions = {'.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'}
    
    # Fetch all files
    all_files = glob.glob(os.path.join(directory, '*.*'))
    
    for input_path in all_files:
        filename = os.path.basename(input_path)
        ext = os.path.splitext(filename)[1].lower()
        
        # Skip if already a web-friendly format
        if ext in valid_extensions:
            continue
            
        # Target output path
        output_filename = os.path.splitext(filename)[0] + '.jpg'
        output_path = os.path.join(directory, output_filename)
        
        try:
            print(f"⏳ Converting: {filename} ...", end=" ")
            
            if ext in ['.dng', '.cr2', '.nef', '.arw', '.raw']:
                # Handle RAW formats using rawpy
                with rawpy.imread(input_path) as raw:
                    rgb = raw.postprocess()
                img = Image.fromarray(rgb)
                img.save(output_path, 'JPEG', quality=90)
            else:
                # Handle HEIC and other formats supported by Pillow
                img = Image.open(input_path)
                if img.mode != 'RGB':
                    img = img.convert('RGB')
                img.save(output_path, 'JPEG', quality=90)
                
            print(f"✅ Success -> {output_filename}")
            
            # Optionally remove the original file to save space and clean up public directory
            os.remove(input_path)
            print(f"   🗑️ Removed original: {filename}")
            
        except Exception as e:
            print(f"❌ Failed to convert {filename}: {e}")

if __name__ == "__main__":
    # Target directories
    cooking_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../public/cooking'))
    photo_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../public/Photography'))
    
    if os.path.exists(cooking_dir):
        convert_to_jpg(cooking_dir)
    else:
        print(f"⚠️ Directory not found: {cooking_dir}")
        
    if os.path.exists(photo_dir):
        convert_to_jpg(photo_dir)
    else:
        print(f"⚠️ Directory not found: {photo_dir}")
        
    print("\n🎉 All conversion tasks completed. Update portfolio.json if filenames changed!\n")
