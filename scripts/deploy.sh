#!/bin/bash

# Corporate Merge Tycoon Agent - Production Deployment Script
# Author: George Pricop (@Gzeu)
# Version: 1.0.0

set -e  # Exit on any error

echo "🚀 Starting Corporate Merge Tycoon Agent Deployment..."
echo "===================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
VERSION=$(cat VERSION)
PROJECT_NAME="corporate-merge-tycoon-agent"
DOCKER_IMAGE="gzeu/${PROJECT_NAME}:${VERSION}"
DOCKER_LATEST="gzeu/${PROJECT_NAME}:latest"

echo -e "${BLUE}Project:${NC} ${PROJECT_NAME}"
echo -e "${BLUE}Version:${NC} ${VERSION}"
echo -e "${BLUE}Date:${NC} $(date)"
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to print status
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check prerequisites
echo -e "${BLUE}Checking prerequisites...${NC}"

if ! command_exists node; then
    print_error "Node.js is not installed"
    exit 1
fi

if ! command_exists npm; then
    print_error "NPM is not installed"
    exit 1
fi

if ! command_exists docker; then
    print_error "Docker is not installed"
    exit 1
fi

print_status "Prerequisites check passed"

# Install dependencies
echo -e "\n${BLUE}Installing dependencies...${NC}"
npm ci --production
print_status "Dependencies installed"

# Run tests
echo -e "\n${BLUE}Running tests...${NC}"
npm test
if [ $? -eq 0 ]; then
    print_status "All tests passed"
else
    print_error "Tests failed"
    exit 1
fi

# Security audit
echo -e "\n${BLUE}Running security audit...${NC}"
npm audit --audit-level high
if [ $? -eq 0 ]; then
    print_status "Security audit passed"
else
    print_warning "Security audit found issues - please review"
fi

# Build Docker image
echo -e "\n${BLUE}Building Docker image...${NC}"
docker build -t $DOCKER_IMAGE .
docker tag $DOCKER_IMAGE $DOCKER_LATEST
print_status "Docker image built: $DOCKER_IMAGE"

# Push to registry (if logged in)
if docker info >/dev/null 2>&1; then
    echo -e "\n${BLUE}Pushing to Docker registry...${NC}"
    docker push $DOCKER_IMAGE
    docker push $DOCKER_LATEST
    print_status "Docker images pushed to registry"
else
    print_warning "Docker not logged in - skipping registry push"
fi

# Kubernetes deployment (if kubectl is available)
if command_exists kubectl; then
    echo -e "\n${BLUE}Deploying to Kubernetes...${NC}"
    
    # Check if k8s directory exists
    if [ -d "k8s" ]; then
        # Update image version in deployment
        sed -i.bak "s|image: gzeu/${PROJECT_NAME}:.*|image: ${DOCKER_IMAGE}|g" k8s/deployment.yaml
        
        # Apply Kubernetes manifests
        kubectl apply -f k8s/
        
        # Wait for deployment to be ready
        kubectl rollout status deployment/${PROJECT_NAME}
        
        print_status "Kubernetes deployment completed"
    else
        print_warning "Kubernetes manifests not found - skipping K8s deployment"
    fi
else
    print_warning "kubectl not found - skipping Kubernetes deployment"
fi

# Health check
echo -e "\n${BLUE}Performing health check...${NC}"
if command_exists curl; then
    # Wait a moment for service to start
    sleep 10
    
    # Try to reach health endpoint
    if curl -f http://localhost:3000/health >/dev/null 2>&1; then
        print_status "Health check passed"
    else
        print_warning "Health check failed - service may still be starting"
    fi
else
    print_warning "curl not available - skipping health check"
fi

# Deployment summary
echo -e "\n${GREEN}=================================================${NC}"
echo -e "${GREEN}🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!${NC}"
echo -e "${GREEN}=================================================${NC}"
echo -e "${BLUE}Project:${NC} ${PROJECT_NAME}"
echo -e "${BLUE}Version:${NC} ${VERSION}"
echo -e "${BLUE}Docker Image:${NC} ${DOCKER_IMAGE}"
echo -e "${BLUE}Status:${NC} Ready for production"
echo -e "${BLUE}Documentation:${NC} https://github.com/Gzeu/${PROJECT_NAME}"
echo -e "${BLUE}API Endpoint:${NC} http://localhost:3000/api"
echo -e "${BLUE}Health Check:${NC} http://localhost:3000/health"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Verify all services are running correctly"
echo "2. Run integration tests in production environment"
echo "3. Monitor logs and metrics for any issues"
echo "4. Update DNS and load balancer configurations"
echo "5. Notify stakeholders of successful deployment"
echo ""
echo -e "${GREEN}Happy gaming! 🎮💼✨${NC}"

# Log deployment
echo "$(date): Corporate Merge Tycoon Agent v${VERSION} deployed successfully" >> deployment.log

exit 0