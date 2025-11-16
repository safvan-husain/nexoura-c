# Background Removal Script

This script removes backgrounds from all product images in the `public/images` folder using AI-powered background removal.

## Usage

```bash
npm run remove-bg
```

## What it does

1. Scans all images in `public/images/` (supports .jpg, .jpeg, .png, .webp)
2. Removes the background from each image using the `@imgly/background-removal-node` library
3. Saves the processed images as PNG files in `public/images/no-bg/`

## Configuration

The script uses the following settings:
- **Model**: `medium` (~80MB) - Better quality, fewer artifacts
- **Output format**: PNG with transparency
- **Quality**: 0.8 (80%)
- **Type**: Foreground (removes background, keeps subject)

## Notes

- First run will download the AI model (~80MB), subsequent runs will be faster
- Images are processed sequentially to avoid memory issues
- Original images are preserved, processed images go to a separate folder
- Processing time depends on image size and complexity

## Output

Processed images will be saved to: `public/images/no-bg/`

All output files will be in PNG format with transparent backgrounds.

## Troubleshooting

If some images fail with "unsupported image format" errors, the JPG files may have unusual encoding or be corrupted. You can:
1. Re-save the images using an image editor
2. Convert them to PNG first
3. Try a different source image
