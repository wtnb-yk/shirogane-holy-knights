#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "Building Lambda deployment packages..."

# Build Lambda Layer (without pandas to reduce size)
echo "Building Lambda Layer..."
cd layers/python-deps

# Clean up
rm -rf python layer.zip

# Create directory structure for Lambda Layer
mkdir -p python/lib/python3.11/site-packages

# Install lightweight dependencies only
pip3 install --target python/lib/python3.11/site-packages \
  google-api-python-client==2.108.0 \
  psycopg2-binary==2.9.9 \
  python-dotenv==1.0.0 \
  --no-deps

# Install required dependencies for google-api-python-client
pip3 install --target python/lib/python3.11/site-packages \
  google-auth \
  google-auth-httplib2 \
  httplib2 \
  uritemplate \
  --no-deps

# Create layer zip
zip -r9 layer.zip python/
echo "Layer size: $(du -h layer.zip | cut -f1)"

# Clean up
rm -rf python

cd "$SCRIPT_DIR"

# Build Lambda function
echo "Building Lambda function..."
cd sync-batch

# Clean up
rm -rf package function.zip

# Create package directory
mkdir -p package

# Copy handler
cp handler.py package/

# Create function zip
cd package
zip -r9 ../function.zip .
cd ..
echo "Function size: $(du -h function.zip | cut -f1)"

# Clean up
rm -rf package

echo "Build complete!"
echo ""
echo "Created files:"
echo "  - layers/python-deps/layer.zip: $(du -h ../layers/python-deps/layer.zip | cut -f1)"
echo "  - sync-batch/function.zip: $(du -h function.zip | cut -f1)"