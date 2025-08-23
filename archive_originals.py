# archive_originals.py

import os
import shutil

# --- CONFIGURATION ---

# The folder where your current large images are. This is correct for your project.
SOURCE_DIR = 'public/images'

# The folder WHERE YOU WANT TO STORE YOUR ORIGINAL IMAGES.
# This MUST be outside your project folder. A folder on your Desktop is a good choice.
# !!! IMPORTANT: PLEASE REVIEW AND CHANGE THIS PATH IF NEEDED !!!
DESTINATION_DIR = os.path.expanduser('~/Desktop/Handsaeme_Original_Images')

# --------------------


def archive_original_images(source_dir, destination_dir):
    """
    Finds all JPG and PNG files in the source directory and its subdirectories,
    and moves them to the destination directory, preserving the folder structure.
    """
    print(f"Starting to archive original images from '{source_dir}'...")
    print(f"They will be moved to: '{destination_dir}'")
    
    if not os.path.isdir(source_dir):
        print(f"Error: Source directory '{source_dir}' not found.")
        return

    # Create the main destination directory if it doesn't exist
    if not os.path.exists(destination_dir):
        os.makedirs(destination_dir)
        print(f"Created archive folder: '{destination_dir}'")

    moved_count = 0
    # Walk through the source directory
    for root, dirs, files in os.walk(source_dir):
        for file in files:
            # Check for original image file types
            if file.lower().endswith(('.png', '.jpg', '.jpeg')):
                source_path = os.path.join(root, file)
                
                # Determine the corresponding destination path
                relative_path = os.path.relpath(source_path, source_dir)
                destination_path = os.path.join(destination_dir, relative_path)
                
                # Create the destination subfolder if it doesn't exist
                destination_subfolder = os.path.dirname(destination_path)
                if not os.path.exists(destination_subfolder):
                    os.makedirs(destination_subfolder)
                
                # Move the file
                try:
                    shutil.move(source_path, destination_path)
                    print(f"  → Moved: {file}")
                    moved_count += 1
                except Exception as e:
                    print(f"  ✗ Error moving {file}: {e}")

    print(f"\nArchive complete. Moved {moved_count} original image files.")


# --- SCRIPT EXECUTION ---
if __name__ == "__main__":
    # Add a confirmation step to prevent accidental runs
    user_input = input(f"This will MOVE original images to '{DESTINATION_DIR}'. Are you sure you want to continue? (yes/no): ")
    if user_input.lower() == 'yes':
        archive_original_images(SOURCE_DIR, DESTINATION_DIR)
    else:
        print("Operation cancelled by user.")