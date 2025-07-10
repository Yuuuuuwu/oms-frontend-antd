#!/usr/bin/env bash
# Build script for React frontend on Render

set -o errexit  # Exit on error

# Install dependencies
npm install

# Build the application
npm run build

echo "Frontend build completed successfully!"