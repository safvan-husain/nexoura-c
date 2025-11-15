# Database Seeding Scripts

## Overview

This directory contains scripts to populate your database with sample data for development and testing.

## Available Scripts

### `npm run seed`

Seeds the entire database with sample data including:

- **2 Admins**
  - Super Admin: `admin@nexoura.com` / `Admin123!`
  - Store Manager: `manager@nexoura.com` / `Manager123!`

- **3 Users**
  - `john.doe@example.com` / `Password123!`
  - `jane.smith@example.com` / `Password123!`
  - `bob.wilson@example.com` / `Password123!`

- **5 Categories**
  - Electronics
  - Clothing
  - Home & Garden
  - Sports & Outdoors
  - Books

- **10 Products** with multiple variants
  - Wireless Bluetooth Headphones
  - Smart Fitness Watch
  - Classic Cotton T-Shirt
  - Ergonomic Office Chair
  - Yoga Mat Premium
  - The Complete Guide to JavaScript
  - Stainless Steel Water Bottle
  - LED Desk Lamp
  - Running Shoes Pro
  - Wireless Keyboard & Mouse Combo

### `npm run seed:admin`

Seeds only admin users (legacy script).

## Usage

1. Make sure your MongoDB connection is configured in `.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/nexoura
   ```

2. Run the seed script:
   ```bash
   npm run seed
   ```

3. The script will:
   - Clear all existing data
   - Create fresh sample data
   - Display a summary of created records

## Warning

⚠️ **This script will DELETE all existing data** in the following collections:
- users
- admins
- categories
- products

Only use this in development environments!

## Customization

To modify the seed data, edit `scripts/seed.ts` and adjust the data arrays in each seed function.
