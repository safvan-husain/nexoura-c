# Product Viewer Feature

## Overview
The root page (`/`) now displays a full-featured product viewer with image navigation and product gallery.

## Features

### Main Product Display
- Large product image with navigation arrows
- Product details card showing:
  - Name, price, and compare-at price
  - Description
  - Variant details (color, size, stock)
  - Add to Cart button

### Image Navigation
- Left/Right arrow buttons to navigate through images
- Progress dots indicator for multiple images
- Automatic progression to next/previous product when reaching image boundaries
- Smooth transitions between images and products

### Product Gallery
- Horizontal scrollable gallery at the bottom
- Shows all available products
- Click any product thumbnail to view it
- Current product highlighted with blue ring
- Hover effects for better UX

## Usage

### View Products
```
http://localhost:3000/
```

### View Specific Product
```
http://localhost:3000/?productId=<product-id>
```

## Navigation Flow
1. Use arrow buttons to navigate through images of current product
2. When reaching the last image, next arrow moves to next product
3. When on first image, previous arrow moves to previous product
4. Click any thumbnail in gallery to jump to that product
5. URL updates automatically to reflect current product

## Technical Details
- Client component for interactive navigation
- Server-side data fetching with caching
- Responsive design (mobile-friendly)
- Image optimization with Next.js Image component
- Smooth animations and transitions
