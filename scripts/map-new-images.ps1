# Map new images to missing product names

$imagesPath = "public\images"

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

# Check which images are missing
$missingImages = @()
foreach ($image in $requiredImages) {
    $imagePath = Join-Path $imagesPath $image
    if (-not (Test-Path $imagePath)) {
        $missingImages += $image
    }
}

Write-Host "Missing images that need to be filled:"
$missingImages | ForEach-Object { Write-Host "  - $_" }

# New images to map
$newImages = @(
    "black-t-shirt.jpeg",
    "download (1).jpeg",
    "download (2).jpeg",
    "download (3).jpeg",
    "download.jpeg",
    "images (1).jpeg",
    "images (2).jpeg",
    "images (3).jpeg",
    "images (4).jpeg",
    "images.jpeg",
    "shirtsa.jpeg"
)

# Smart mapping based on content hints
$mapping = @{
    "black-t-shirt.jpeg" = "tshirt-black.jpg"  # Override if better
    "shirtsa.jpeg" = "tshirt-white.jpg"  # Override if better
    "download.jpeg" = "watch-black-42.jpg"
    "download (1).jpeg" = "watch-rosegold-38.jpg"
    "download (2).jpeg" = "yoga-mat-purple.jpg"
    "download (3).jpeg" = "yoga-mat-blue.jpg"
    "images.jpeg" = "yoga-mat-green.jpg"
    "images (1).jpeg" = "headphones-silver.jpg"
    "images (2).jpeg" = "chair-black.jpg"
    "images (3).jpeg" = "chair-gray.jpg"
    "images (4).jpeg" = "bottle-matte-black.jpg"
}

# Find next available missing image for unmapped files
$mappingIndex = 0

Write-Host "`nRenaming new images..."
foreach ($newImage in $newImages) {
    $oldPath = Join-Path $imagesPath $newImage
    
    if (-not (Test-Path $oldPath)) {
        Write-Host "Skipping $newImage (not found)"
        continue
    }
    
    # Get target name from mapping or next missing image
    if ($mapping.ContainsKey($newImage)) {
        $targetName = $mapping[$newImage]
    } else {
        # Find next missing image
        while ($mappingIndex -lt $missingImages.Count) {
            $targetName = $missingImages[$mappingIndex]
            $mappingIndex++
            $targetPath = Join-Path $imagesPath $targetName
            if (-not (Test-Path $targetPath)) {
                break
            }
        }
    }
    
    if ($targetName) {
        $newPath = Join-Path $imagesPath $targetName
        
        if (Test-Path $newPath) {
            Write-Host "Skipping $newImage -> $targetName (target exists)"
        } else {
            Move-Item -Path $oldPath -Destination $newPath -Force
            Write-Host "Renamed: $newImage -> $targetName"
        }
    }
}

Write-Host "`nFinal image list:"
Get-ChildItem $imagesPath -Filter "*.jpg" | Select-Object Name | Sort-Object Name
