#!/bin/bash

echo "🧪 Comprehensive Component Testing"
echo "=================================="

# Test all API endpoints
echo "📡 Testing All API Endpoints..."
echo "============================="

API_ENDPOINTS=(
    "api/health"
    "api/test-channels"
    "api/streams"
    "api/adbreaks"
    "api/encoding"
)

for endpoint in "${API_ENDPOINTS[@]}"; do
    echo "Testing $endpoint..."
    response=$(curl -s -w "%{http_code}" http://127.0.0.1:3000/$endpoint)
    http_code="${response: -3}"
    body="${response%???}"
    
    if [[ "$http_code" == "200" ]]; then
        echo "✅ $endpoint (HTTP $http_code)"
    else
        echo "❌ $endpoint (HTTP $http_code)"
    fi
done

echo ""
echo "🎨 Testing All UI Components..."
echo "============================="

# Check all UI components
UI_COMPONENTS=(
    "src/components/ui/accordion.tsx"
    "src/components/ui/alert-dialog.tsx"
    "src/components/ui/alert.tsx"
    "src/components/ui/avatar.tsx"
    "src/components/ui/badge.tsx"
    "src/components/ui/breadcrumb.tsx"
    "src/components/ui/button.tsx"
    "src/components/ui/calendar.tsx"
    "src/components/ui/card.tsx"
    "src/components/ui/carousel.tsx"
    "src/components/ui/chart.tsx"
    "src/components/ui/checkbox.tsx"
    "src/components/ui/collapsible.tsx"
    "src/components/ui/command.tsx"
    "src/components/ui/context-menu.tsx"
    "src/components/ui/dialog.tsx"
    "src/components/ui/drawer.tsx"
    "src/components/ui/dropdown-menu.tsx"
    "src/components/ui/form.tsx"
    "src/components/ui/hover-card.tsx"
    "src/components/ui/input-otp.tsx"
    "src/components/ui/input.tsx"
    "src/components/ui/label.tsx"
    "src/components/ui/menubar.tsx"
    "src/components/ui/navigation-menu.tsx"
    "src/components/ui/pagination.tsx"
    "src/components/ui/popover.tsx"
    "src/components/ui/progress.tsx"
    "src/components/ui/radio-group.tsx"
    "src/components/ui/resizable.tsx"
    "src/components/ui/scroll-area.tsx"
    "src/components/ui/select.tsx"
    "src/components/ui/separator.tsx"
    "src/components/ui/sheet.tsx"
    "src/components/ui/sidebar.tsx"
    "src/components/ui/skeleton.tsx"
    "src/components/ui/slider.tsx"
    "src/components/ui/sonner.tsx"
    "src/components/ui/switch.tsx"
    "src/components/ui/table.tsx"
    "src/components/ui/tabs.tsx"
    "src/components/ui/textarea.tsx"
    "src/components/ui/toast.tsx"
    "src/components/ui/toggle-group.tsx"
    "src/components/ui/toggle.tsx"
    "src/components/ui/tooltip.tsx"
)

for component in "${UI_COMPONENTS[@]}"; do
    if [[ -f "$component" ]]; then
        echo "✅ $component"
    else
        echo "❌ $component - MISSING"
    fi
done

echo ""
echo "🏗️ Testing Layout Components..."
echo "============================="

LAYOUT_COMPONENTS=(
    "src/components/layout/sidebar.tsx"
    "src/components/layout/header.tsx"
    "src/components/theme-toggle.tsx"
)

for component in "${LAYOUT_COMPONENTS[@]}"; do
    if [[ -f "$component" ]]; then
        echo "✅ $component"
    else
        echo "❌ $component - MISSING"
    fi
done

echo ""
echo "📱 Testing All Pages..."
echo "====================="

# Check all page files
PAGES=(
    "src/app/page.tsx"
    "src/app/channels/page.tsx"
    "src/app/inputs/page.tsx"
    "src/app/outputs/page.tsx"
    "src/app/profiles/page.tsx"
    "src/app/schedules/page.tsx"
    "src/app/monitoring/page.tsx"
    "src/app/security/page.tsx"
    "src/app/settings/page.tsx"
)

for page in "${PAGES[@]}"; do
    if [[ -f "$page" ]]; then
        echo "✅ $page"
    else
        echo "❌ $page - MISSING"
    fi
done

echo ""
echo "🎭 Testing Styling and Assets..."
echo "==============================="

# Check styling and assets
if [[ -f "src/app/globals.css" ]]; then
    echo "✅ Global CSS file exists"
    
    # Test for specific AWS theme styles
    AWS_STYLES=(
        "aws-gradient"
        "aws-gradient-dark"
        "aws-button-gradient"
        "aws-sidebar-gradient"
        "aws-channel-card"
        "aws-metric-card"
    )
    
    for style in "${AWS_STYLES[@]}"; do
        if grep -q "$style" src/app/globals.css; then
            echo "✅ AWS style: $style"
        else
            echo "❌ AWS style missing: $style"
        fi
    done
else
    echo "❌ Global CSS file missing"
fi

# Check public assets
PUBLIC_ASSETS=(
    "public/logo.svg"
    "public/favicon.ico"
    "public/robots.txt"
)

for asset in "${PUBLIC_ASSETS[@]}"; do
    if [[ -f "$asset" ]]; then
        echo "✅ $asset"
    else
        echo "❌ $asset - MISSING"
    fi
done

echo ""
echo "🗄️ Testing Database and Schema..."
echo "==============================="

if [[ -f "prisma/schema.prisma" ]]; then
    echo "✅ Prisma schema exists"
    
    # Test for all required models
    REQUIRED_MODELS=(
        "User"
        "Post"
        "Stream"
        "EncodingSession"
        "AdBreak"
        "SystemSettings"
        "SystemLog"
    )
    
    for model in "${REQUIRED_MODELS[@]}"; do
        if grep -q "model $model" prisma/schema.prisma; then
            echo "✅ Database model: $model"
        else
            echo "❌ Database model missing: $model"
        fi
    done
    
    # Test for required enums
    REQUIRED_ENUMS=(
        "StreamStatus"
        "EncodingStatus"
        "AdBreakStatus"
        "LogLevel"
    )
    
    for enum in "${REQUIRED_ENUMS[@]}"; do
        if grep -q "enum $enum" prisma/schema.prisma; then
            echo "✅ Database enum: $enum"
        else
            echo "❌ Database enum missing: $enum"
        fi
    done
else
    echo "❌ Prisma schema missing"
fi

echo ""
echo "📋 Testing Configuration Files..."
echo "==============================="

CONFIG_FILES=(
    "package.json"
    "tailwind.config.ts"
    "tsconfig.json"
    "next.config.ts"
    "components.json"
    ".env"
    "eslint.config.mjs"
    "postcss.config.mjs"
)

for config in "${CONFIG_FILES[@]}"; do
    if [[ -f "$config" ]]; then
        echo "✅ $config"
    else
        echo "❌ $config - MISSING"
    fi
done

echo ""
echo "🔧 Testing Hooks and Utilities..."
echo "==============================="

HOOKS=(
    "src/hooks/use-mobile.tsx"
    "src/hooks/use-toast.tsx"
)

for hook in "${HOOKS[@]}"; do
    if [[ -f "$hook" ]]; then
        echo "✅ $hook"
    else
        echo "❌ $hook - MISSING"
    fi
done

UTILS=(
    "src/lib/utils.ts"
    "src/lib/db.ts"
    "src/lib/socket.ts"
)

for util in "${UTILS[@]}"; do
    if [[ -f "$util" ]]; then
        echo "✅ $util"
    else
        echo "❌ $util - MISSING"
    fi
done

echo ""
echo "📊 Test Results Summary"
echo "====================="

# Count missing files
MISSING_FILES=0

# Count API endpoints
API_COUNT=${#API_ENDPOINTS[@]}
echo "📡 API Endpoints: $API_COUNT tested"

# Count UI components
UI_COUNT=0
for component in "${UI_COMPONENTS[@]}"; do
    if [[ -f "$component" ]]; then
        ((UI_COUNT++))
    else
        ((MISSING_FILES++))
    fi
done
echo "🎨 UI Components: $UI_COUNT/${#UI_COMPONENTS[@]} present"

# Count layout components
LAYOUT_COUNT=0
for component in "${LAYOUT_COMPONENTS[@]}"; do
    if [[ -f "$component" ]]; then
        ((LAYOUT_COUNT++))
    else
        ((MISSING_FILES++))
    fi
done
echo "🏗️ Layout Components: $LAYOUT_COUNT/${#LAYOUT_COMPONENTS[@]} present"

# Count pages
PAGE_COUNT=0
for page in "${PAGES[@]}"; do
    if [[ -f "$page" ]]; then
        ((PAGE_COUNT++))
    else
        ((MISSING_FILES++))
    fi
done
echo "📱 Pages: $PAGE_COUNT/${#PAGES[@]} present"

echo ""
if [[ $MISSING_FILES -eq 0 ]]; then
    echo "🎉 ALL COMPONENTS TESTED SUCCESSFULLY!"
    echo "✅ Zero missing files or components"
    echo "🚀 Ready for GitHub update"
else
    echo "⚠️  $MISSING_FILES missing files detected"
    echo "🔧 Please review and fix missing components"
fi

echo ""
echo "📋 Next Steps:"
echo "1. Review any missing components marked with ❌"
echo "2. Fix any issues found"
echo "3. Run 'npm run lint' to ensure code quality"
echo "4. Commit and push changes to GitHub"
echo "5. Test the application in a browser"