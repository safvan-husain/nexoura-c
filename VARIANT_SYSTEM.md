# Product Variant System

## Overview

The product variant system has been updated to use **fixed color and size fields** with automatic combination generation on the client side.

## Key Changes

### 1. Variant Model Structure

Each variant now includes:
- `name`: Auto-generated as "Color / Size"
- `sku`: Auto-generated from product slug, color, and size
- `color`: Required field (e.g., "Red", "Blue", "Black")
- `size`: Required field (e.g., "S", "M", "L", "XL")
- `price`: Required field - each variant can have its own price
- `stock`: Required field - stock count per variant
- `images`: Optional array of images
- `attributes`: Optional additional attributes

### 2. Client-Side Form Flow

The ProductForm now works as follows:

1. **Define Colors**: Add one or more colors (e.g., Red, Blue, Black)
2. **Define Sizes**: Add one or more sizes (e.g., S, M, L, XL)
3. **Set Combination Data**: For each color/size combination:
   - Set the price
   - Set the stock count
   - SKU is auto-generated

### 3. Automatic Combination Generation

When the form is submitted:
- All possible combinations of colors × sizes are generated
- Each combination becomes a variant with:
  - Name: `{color} / {size}`
  - SKU: `{slug}-{color}-{size}` (normalized)
  - Price and stock from the form inputs

### 4. Example

If you add:
- Colors: Red, Blue
- Sizes: S, M, L

The system will generate 6 variants:
1. Red / S
2. Red / M
3. Red / L
4. Blue / S
5. Blue / M
6. Blue / L

Each with its own price and stock count.

## Backend Structure

The backend remains unchanged and continues to:
- Store variants as an array in the product document
- Validate each variant has required fields (color, size, price, stock)
- Support all existing product operations

## Migration Notes

- Existing products need to be updated to include `color`, `size`, and `price` fields in their variants
- The seed script has been updated with example data
- Run `npm run seed` to populate the database with updated product data

## Benefits

1. **Consistency**: All products follow the same color/size pattern
2. **Ease of Use**: Admins don't manually create each variant
3. **Flexibility**: Each variant can have different prices and stock
4. **Scalability**: Easy to add new colors or sizes
5. **Auto-SKU**: SKUs are automatically generated consistently
