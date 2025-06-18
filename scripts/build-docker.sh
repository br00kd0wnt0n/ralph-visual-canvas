#!/bin/bash

# Docker build script for Visual Canvas Lab
# This script builds the Docker image with the correct environment variables

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🐳 Building Docker image for Visual Canvas Lab...${NC}"

# Check if .env.local exists and read MONGODB_URI
if [ -f ".env.local" ]; then
    echo -e "${YELLOW}📄 Found .env.local file${NC}"
    export MONGODB_URI=$(grep MONGODB_URI .env.local | cut -d '=' -f2)
    echo -e "${GREEN}✅ Using MONGODB_URI from .env.local${NC}"
else
    echo -e "${RED}❌ .env.local file not found${NC}"
    echo -e "${YELLOW}Please create .env.local with your MONGODB_URI${NC}"
    exit 1
fi

# Build the Docker image
echo -e "${GREEN}🔨 Building Docker image...${NC}"
docker build \
    --build-arg MONGODB_URI="$MONGODB_URI" \
    -t visual-canvas-lab:latest \
    .

echo -e "${GREEN}✅ Docker image built successfully!${NC}"
echo -e "${YELLOW}To run the container:${NC}"
echo -e "docker run -p 3000:3000 visual-canvas-lab:latest" 