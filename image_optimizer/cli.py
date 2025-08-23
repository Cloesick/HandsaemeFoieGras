# image_optimizer/cli.py

import os
import argparse
from PIL import Image

def optimize_images(input_dir, output_dir, max_width, quality):
    """
    Walks through a directory, resizes, compresses, and converts images to WebP format,
    preserving the subfolder structure.
    """
    print(f"Starting image optimization for folder: {input_dir}")
    if not os.path.isdir(input_dir):
        print(f"Error: Input directory '{input_dir}' does not exist.")
        return

    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    for root, dirs, files in os.walk(input_dir):
        relative_path = os.path.relpath(root, input_dir)
        output_root = os.path.join(output_dir, relative_path)
        if not os.path.exists(output_root):
            os.makedirs(output_root)

        for file in files:
            if file.lower().endswith(('.png', '.jpg', '.jpeg')):
                input_path = os.path.join(root, file)
                filename_without_ext = os.path.splitext(file)[0]
                output_filename = f"{filename_without_ext}.webp"
                output_path = os.path.join(output_root, output_filename)

                try:
                    with Image.open(input_path) as img:
                        if img.width > max_width:
                            new_height = int(max_width * img.height / img.width)
                            img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
                        
                        if img.mode == 'RGBA':
                            img = img.convert('RGB')

                        img.save(output_path, 'webp', quality=quality)
                        print(f"  ✓ Processed: {output_path}")

                except Exception as e:
                    print(f"  ✗ Could not process {input_path}. Error: {e}")
    
    print("\nImage optimization complete!")
    print(f"Your optimized images are in the '{output_dir}' folder.")

def main():
    """
    This function handles the command-line arguments.
    """
    parser = argparse.ArgumentParser(description="Optimize images in a directory.")
    parser.add_argument("input_dir", help="The source folder with your original images.")
    parser.add_argument("output_dir", help="The destination folder for optimized images.")
    parser.add_argument("--width", type=int, default=1920, help="Maximum width for images in pixels.")
    parser.add_argument("--quality", type=int, default=80, help="Quality for WebP format (0-100).")
    
    args = parser.parse_args()
    
    optimize_images(args.input_dir, args.output_dir, args.width, args.quality)

if __name__ == "__main__":
    main()