#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "Building Lambda deployment packages using Docker..."

# Build Lambda Layer using Docker (Amazon Linux 2 compatible)
echo "Building Lambda Layer..."
cd layers/python-deps

# Clean up
rm -rf python layer.zip

# Use Docker to build for Lambda environment
docker run --rm -v "$PWD":/var/task --entrypoint /bin/bash public.ecr.aws/lambda/python:3.11 -c "
    pip install --target /var/task/python/lib/python3.11/site-packages \
        google-api-python-client==2.108.0 \
        psycopg2-binary==2.9.9 \
        python-dotenv==1.0.0 \
        --no-cache-dir
"

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