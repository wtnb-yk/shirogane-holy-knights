#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "Building Lambda deployment packages using Docker..."

# Build Lambda Layer using Docker (Amazon Linux 2 compatible)
echo "Building Lambda Layer..."
cd layers/python-deps

# Clean up with error handling
echo "Cleaning up existing files..."
if [ -d "python" ]; then
    chmod -R u+w python 2>/dev/null || true
    rm -rf python || {
        echo "Warning: Could not remove python directory cleanly. Using sudo..."
        sudo rm -rf python
    }
fi
[ -f layer.zip ] && rm -f layer.zip

# Use Docker to build for Lambda environment
docker run --rm -v "$PWD":/var/task --entrypoint /bin/bash public.ecr.aws/lambda/python:3.11 -c "
    pip install --target /var/task/python/lib/python3.11/site-packages \
        google-api-python-client==2.108.0 \
        pandas==2.1.4 \
        psycopg2-binary==2.9.9 \
        python-dotenv==1.0.0 \
        --no-cache-dir
    
    # Clean up unnecessary files in Docker context (with proper permissions)
    find /var/task/python/lib/python3.11/site-packages -name '*.pyc' -delete 2>/dev/null || true
    find /var/task/python/lib/python3.11/site-packages -name '__pycache__' -type d -exec rm -rf {} + 2>/dev/null || true
    find /var/task/python/lib/python3.11/site-packages -name '*.dist-info' -type d -exec rm -rf {} + 2>/dev/null || true
    find /var/task/python/lib/python3.11/site-packages/googleapiclient/discovery_cache -name '*.json' -delete 2>/dev/null || true
    
    # Fix permissions for host access
    chown -R $(id -u):$(id -g) /var/task/python 2>/dev/null || true
"

# Create layer zip
echo "Creating layer zip file..."
if [ -d "python" ]; then
    zip -r9 layer.zip python/
    echo "Layer size: $(du -h layer.zip | cut -f1)"
    
    # Clean up with improved error handling
    echo "Cleaning up temporary files..."
    chmod -R u+w python 2>/dev/null || true
    rm -rf python || {
        echo "Warning: Could not remove python directory cleanly. Using sudo..."
        sudo rm -rf python
    }
else
    echo "Error: Python directory not found after Docker build"
    exit 1
fi

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