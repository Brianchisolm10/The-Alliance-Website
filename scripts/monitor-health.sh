#!/bin/bash

# Health Monitoring Script
# Run this script to check the health of the production application

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_URL="${1:-https://theafya.org}"
HEALTH_ENDPOINT="${APP_URL}/api/health"

echo -e "${BLUE}🏥 AFYA Wellness - Health Check${NC}"
echo "=================================="
echo ""
echo "Checking: $HEALTH_ENDPOINT"
echo ""

# Check if curl is available
if ! command -v curl &> /dev/null; then
    echo -e "${RED}Error: curl is not installed${NC}"
    exit 1
fi

# Check if jq is available (for JSON parsing)
if ! command -v jq &> /dev/null; then
    echo -e "${YELLOW}Warning: jq is not installed. Install for better output formatting.${NC}"
    USE_JQ=false
else
    USE_JQ=true
fi

# Make health check request
echo "Making health check request..."
RESPONSE=$(curl -s -w "\n%{http_code}" "$HEALTH_ENDPOINT")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

echo ""
echo "HTTP Status Code: $HTTP_CODE"
echo ""

# Check HTTP status
if [ "$HTTP_CODE" -eq 200 ]; then
    echo -e "${GREEN}✓ Application is responding${NC}"
elif [ "$HTTP_CODE" -eq 503 ]; then
    echo -e "${RED}✗ Application is unhealthy (503)${NC}"
else
    echo -e "${YELLOW}⚠ Unexpected status code: $HTTP_CODE${NC}"
fi

echo ""
echo "Health Check Response:"
echo "----------------------"

# Parse and display response
if [ "$USE_JQ" = true ]; then
    echo "$BODY" | jq '.'
    
    # Extract key information
    STATUS=$(echo "$BODY" | jq -r '.status')
    DB_STATUS=$(echo "$BODY" | jq -r '.checks.database.status')
    DB_TIME=$(echo "$BODY" | jq -r '.checks.database.responseTime')
    STORAGE_STATUS=$(echo "$BODY" | jq -r '.checks.storage.status')
    EMAIL_STATUS=$(echo "$BODY" | jq -r '.checks.email.status')
    RESPONSE_TIME=$(echo "$BODY" | jq -r '.responseTime')
    
    echo ""
    echo "Summary:"
    echo "--------"
    
    # Overall status
    if [ "$STATUS" = "healthy" ]; then
        echo -e "Overall Status: ${GREEN}✓ Healthy${NC}"
    elif [ "$STATUS" = "degraded" ]; then
        echo -e "Overall Status: ${YELLOW}⚠ Degraded${NC}"
    else
        echo -e "Overall Status: ${RED}✗ Unhealthy${NC}"
    fi
    
    # Database status
    if [ "$DB_STATUS" = "healthy" ]; then
        echo -e "Database: ${GREEN}✓ Healthy${NC} (${DB_TIME}ms)"
    else
        echo -e "Database: ${RED}✗ Unhealthy${NC}"
    fi
    
    # Storage status
    if [ "$STORAGE_STATUS" = "healthy" ]; then
        echo -e "Storage: ${GREEN}✓ Healthy${NC}"
    else
        echo -e "Storage: ${YELLOW}⚠ Degraded${NC}"
    fi
    
    # Email status
    if [ "$EMAIL_STATUS" = "healthy" ]; then
        echo -e "Email: ${GREEN}✓ Healthy${NC}"
    else
        echo -e "Email: ${YELLOW}⚠ Degraded${NC}"
    fi
    
    echo ""
    echo "Response Time: ${RESPONSE_TIME}ms"
    
else
    echo "$BODY"
fi

echo ""
echo "=================================="

# Exit with appropriate code
if [ "$HTTP_CODE" -eq 200 ]; then
    exit 0
else
    exit 1
fi
