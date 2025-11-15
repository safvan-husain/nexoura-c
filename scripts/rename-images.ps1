# Script to rename images to match expected paths

$imagesPath = "public\images"

# Create images directory if it doesn't exist
if (-not (Test-Path $imagesPath)) {
    New-Item -ItemType Directory -Path $imagesPath -Force
}

# Rename existing images
$renames = @{
    "headphones-black.jpg" = "headphones-black.jpg"  # Already correct
    "keyboard-mouse-black.jpg" = "keyboard-mouse-black.jpg"  # Already correct
    "shoes-black-red.jpg" = "shoes-black-red.jpg"  # Already correct
    "blue-tshirt.jpeg" = "tshirt-navy.jpg"
    "shirt.jpeg" = "tshirt-white.jpg"
    "t-shirt.jpeg" = "tshirt-black.jpg"
    "yellow-t-shirt.jpeg" = "tshirt-white.jpg"
}

Write-Host "Renaming existing images..."
foreach ($old in $renames.Keys) {
    $oldPath = Join-Path $imagesPath $old
    $newPath = Join-Path $imagesPath $renames[$old]
    
    if (Test-Path $oldPath) {
        if (Test-Path $newPath) {
            Write-Host "Skipping $old -> $($renames[$old]) (target exists)"
        } else {
            Move-Item -Path $oldPath -Destination $newPath -Force
            Write-Host "Renamed: $old -> $($renames[$old])"
        }
    }
}

# List of all required images
$requiredImages = @(
    "watch-black-42.jpg",
    "watch-rosegold-38.jpg",
    "yoga-mat-purple.jpg",
    "yoga-mat-blue.jpg",
    "yoga-mat-green.jpg",
    "headphones-black.jpg",
    "headphones-silver.jpg",
    "tshirt-white.jpg",
    "tshirt-black.jpg",
    "tshirt-navy.jpg",
    "chair-black.jpg",
    "chair-gray.jpg",
    "bottle-matte-black.jpg",
    "bottle-blue.jpg",
    "lamp-white.jpg",
    "lamp-black.jpg",
    "shoes-black-red.jpg",
    "shoes-white-blue.jpg",
    "shoes-gray.jpg",
    "keyboard-mouse-black.jpg"
)

# Create placeholder for missing images by copying from existing placeholder
$placeholderSource = "public\placeholder-product.png"

Write-Host "`nCreating placeholders for missing images..."
foreach ($image in $requiredImages) {
    $imagePath = Join-Path $imagesPath $image
    
    if (-not (Test-Path $imagePath)) {
        if (Test-Path $placeholderSource) {
            Copy-Item -Path $placeholderSource -Destination $imagePath
            Write-Host "Created placeholder: $image"
        } else {
            Write-Host "Warning: Could not create $image (no placeholder source)"
        }
    } else {
        Write-Host "Already exists: $image"
    }
}

Write-Host "`nDone! All images are ready."
Write-Host "`nCurrent images in ${imagesPath}:"
Get-ChildItem $imagesPath | Select-Object Name
