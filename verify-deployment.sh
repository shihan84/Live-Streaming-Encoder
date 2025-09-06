#!/bin/bash

# =============================================================================
# Deployment Script Verification Script
# Tests the deployment scripts on both Ubuntu and Windows
# =============================================================================

set -e

echo "=================================================================="
echo "🧪 Deployment Script Verification"
echo "=================================================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Detect OS
detect_os() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        if [[ -f /etc/ubuntu-release ]] && grep -q "Ubuntu 24.04" /etc/ubuntu-release; then
            echo "ubuntu24"
        else
            echo "linux"
        fi
    elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "win32" ]]; then
        echo "windows"
    else
        echo "unknown"
    fi
}

OS=$(detect_os)
echo "Detected OS: $OS"
echo ""

# Test 1: Check if deployment scripts exist
echo "Test 1: Checking deployment script files..."
if [[ -f "deploy.sh" ]]; then
    print_success "deploy.sh exists"
else
    print_error "deploy.sh not found"
fi

if [[ -f "deploy-windows.bat" ]]; then
    print_success "deploy-windows.bat exists"
else
    print_error "deploy-windows.bat not found"
fi

if [[ -f "DEPLOYMENT_SCRIPTS.md" ]]; then
    print_success "DEPLOYMENT_SCRIPTS.md exists"
else
    print_error "DEPLOYMENT_SCRIPTS.md not found"
fi
echo ""

# Test 2: Check script permissions (Linux only)
if [[ "$OS" == "ubuntu24" ]]; then
    echo "Test 2: Checking script permissions..."
    if [[ -x "deploy.sh" ]]; then
        print_success "deploy.sh is executable"
    else
        print_warning "deploy.sh is not executable (this is normal in the repository)"
    fi
    echo ""
fi

# Test 3: Check script syntax
echo "Test 3: Checking script syntax..."

# Check bash script syntax
if bash -n deploy.sh 2>/dev/null; then
    print_success "deploy.sh syntax is valid"
else
    print_error "deploy.sh has syntax errors"
fi

# Check batch script syntax (basic check)
if grep -q "@echo off" deploy-windows.bat; then
    print_success "deploy-windows.bat appears to be a valid batch file"
else
    print_error "deploy-windows.bat may not be a valid batch file"
fi
echo ""

# Test 4: Check for required commands in scripts
echo "Test 4: Checking for required functionality..."

# Check deploy.sh for key functions
if grep -q "detect_os" deploy.sh; then
    print_success "deploy.sh contains OS detection"
else
    print_error "deploy.sh missing OS detection"
fi

if grep -q "install_dependencies" deploy.sh; then
    print_success "deploy.sh contains dependency installation"
else
    print_error "deploy.sh missing dependency installation"
fi

if grep -q "start_services" deploy.sh; then
    print_success "deploy.sh contains service startup"
else
    print_error "deploy.sh missing service startup"
fi

# Check deploy-windows.bat for key functionality
if grep -q "docker --version" deploy-windows.bat; then
    print_success "deploy-windows.bat contains Docker check"
else
    print_error "deploy-windows.bat missing Docker check"
fi

if grep -q "docker-compose" deploy-windows.bat; then
    print_success "deploy-windows.bat contains Docker Compose"
else
    print_error "deploy-windows.bat missing Docker Compose"
fi
echo ""

# Test 5: Check documentation completeness
echo "Test 5: Checking documentation..."

if grep -q "Ubuntu 24.04" DEPLOYMENT_SCRIPTS.md; then
    print_success "Documentation mentions Ubuntu 24.04"
else
    print_error "Documentation missing Ubuntu 24.04 reference"
fi

if grep -q "Windows" DEPLOYMENT_SCRIPTS.md; then
    print_success "Documentation mentions Windows"
else
    print_error "Documentation missing Windows reference"
fi

if grep -q "Docker Desktop" DEPLOYMENT_SCRIPTS.md; then
    print_success "Documentation mentions Docker Desktop"
else
    print_error "Documentation missing Docker Desktop reference"
fi
echo ""

# Test 6: Check for security features
echo "Test 6: Checking security features..."

if grep -q "NEXTAUTH_SECRET" deploy.sh; then
    print_success "deploy.sh generates secure secrets"
else
    print_error "deploy.sh missing secret generation"
fi

if grep -q "backup" deploy.sh; then
    print_success "deploy.sh includes backup functionality"
else
    print_error "deploy.sh missing backup functionality"
fi

if grep -q "backup" deploy-windows.bat; then
    print_success "deploy-windows.bat includes backup functionality"
else
    print_error "deploy-windows.bat missing backup functionality"
fi
echo ""

# Test 7: Check for monitoring features
echo "Test 7: Checking monitoring features..."

if grep -q "monitor" deploy.sh; then
    print_success "deploy.sh includes monitoring script"
else
    print_error "deploy.sh missing monitoring script"
fi

if grep -q "monitor" deploy-windows.bat; then
    print_success "deploy-windows.bat includes monitoring script"
else
    print_error "deploy-windows.bat missing monitoring script"
fi
echo ""

# Test 8: Check for service management
echo "Test 8: Checking service management..."

if grep -q "systemd" deploy.sh; then
    print_success "deploy.sh includes systemd service creation"
else
    print_error "deploy.sh missing systemd service creation"
fi

if grep -q "start-streaming-encoder.bat" deploy-windows.bat; then
    print_success "deploy-windows.bat includes service management scripts"
else
    print_error "deploy-windows.bat missing service management scripts"
fi
echo ""

# Test 9: Check file sizes (basic completeness check)
echo "Test 9: Checking file sizes..."

DEPLOY_SH_SIZE=$(wc -l < deploy.sh)
DEPLOY_BAT_SIZE=$(wc -l < deploy-windows.bat)
DOCS_SIZE=$(wc -l < DEPLOYMENT_SCRIPTS.md)

echo "deploy.sh: $DEPLOY_SH_SIZE lines"
echo "deploy-windows.bat: $DEPLOY_BAT_SIZE lines"
echo "DEPLOYMENT_SCRIPTS.md: $DOCS_SIZE lines"

if [[ $DEPLOY_SH_SIZE -gt 100 ]]; then
    print_success "deploy.sh has substantial content"
else
    print_error "deploy.sh may be incomplete"
fi

if [[ $DEPLOY_BAT_SIZE -gt 50 ]]; then
    print_success "deploy-windows.bat has substantial content"
else
    print_error "deploy-windows.bat may be incomplete"
fi

if [[ $DOCS_SIZE -gt 50 ]]; then
    print_success "DEPLOYMENT_SCRIPTS.md has substantial content"
else
    print_error "DEPLOYMENT_SCRIPTS.md may be incomplete"
fi
echo ""

# Test 10: Check for error handling
echo "Test 10: Checking error handling..."

if grep -q "set -e" deploy.sh; then
    print_success "deploy.sh has error handling"
else
    print_error "deploy.sh missing error handling"
fi

if grep -q "errorlevel 1" deploy-windows.bat; then
    print_success "deploy-windows.bat has error handling"
else
    print_error "deploy-windows.bat missing error handling"
fi
echo ""

# Summary
echo "=================================================================="
echo "📊 Verification Summary"
echo "=================================================================="
echo ""

TOTAL_TESTS=10
PASSED_TESTS=0

# Count passed tests (simplified)
if [[ -f "deploy.sh" ]] && [[ -f "deploy-windows.bat" ]] && [[ -f "DEPLOYMENT_SCRIPTS.md" ]]; then
    ((PASSED_TESTS++))
fi

if bash -n deploy.sh 2>/dev/null; then
    ((PASSED_TESTS++))
fi

if grep -q "detect_os" deploy.sh && grep -q "install_dependencies" deploy.sh && grep -q "start_services" deploy.sh; then
    ((PASSED_TESTS++))
fi

if grep -q "docker --version" deploy-windows.bat && grep -q "docker-compose" deploy-windows.bat; then
    ((PASSED_TESTS++))
fi

if grep -q "Ubuntu 24.04" DEPLOYMENT_SCRIPTS.md && grep -q "Windows" DEPLOYMENT_SCRIPTS.md; then
    ((PASSED_TESTS++))
fi

if grep -q "NEXTAUTH_SECRET" deploy.sh && grep -q "backup" deploy.sh; then
    ((PASSED_TESTS++))
fi

if grep -q "monitor" deploy.sh && grep -q "monitor" deploy-windows.bat; then
    ((PASSED_TESTS++))
fi

if grep -q "systemd" deploy.sh && grep -q "start-streaming-encoder.bat" deploy-windows.bat; then
    ((PASSED_TESTS++))
fi

if [[ $DEPLOY_SH_SIZE -gt 100 ]] && [[ $DEPLOY_BAT_SIZE -gt 50 ]] && [[ $DOCS_SIZE -gt 50 ]]; then
    ((PASSED_TESTS++))
fi

if grep -q "set -e" deploy.sh && grep -q "errorlevel 1" deploy-windows.bat; then
    ((PASSED_TESTS++))
fi

echo "Tests Passed: $PASSED_TESTS/$TOTAL_TESTS"

if [[ $PASSED_TESTS -eq $TOTAL_TESTS ]]; then
    echo ""
    print_success "🎉 All verification tests passed!"
    echo ""
    echo "The deployment scripts are ready for use!"
    echo ""
    echo "Next Steps:"
    echo "1. Run './deploy.sh' on Ubuntu 24.04"
    echo "2. Run 'deploy-windows.bat' on Windows"
    echo "3. Follow the post-deployment instructions"
    echo ""
else
    echo ""
    FAILED_TESTS=$((TOTAL_TESTS - PASSED_TESTS))
    print_error "$FAILED_TESTS test(s) failed!"
    echo ""
    echo "Please review the failed tests above and fix any issues."
    echo ""
fi

echo "=================================================================="
echo "Verification Complete"
echo "=================================================================="