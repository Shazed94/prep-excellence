#!/bin/bash

# Authentication Test Script
# This script helps you test the authentication flow

echo "🔐 Authentication Test Guide"
echo "============================"
echo ""

echo "1️⃣  Start the development server:"
echo "   pnpm dev"
echo ""

echo "2️⃣  Open browser and go to: http://localhost:3000"
echo ""

echo "3️⃣  Test Login:"
echo "   - Click the 'Login' button"
echo "   - Enter credentials:"
echo "     Email: (your test email)"
echo "     Password: (your test password)"
echo "   - Click 'Log In'"
echo ""

echo "4️⃣  Expected Behavior:"
echo "   ✅ Login popup should close"
echo "   ✅ Should redirect to /admin dashboard"
echo "   ✅ Should see user email in sidebar"
echo "   ✅ Should see dashboard with stats"
echo ""

echo "5️⃣  Test Protected Routes:"
echo "   - Click 'Users' in sidebar"
echo "   ✅ Should navigate to /admin/users"
echo "   ✅ Should see users table"
echo ""

echo "6️⃣  Test Logout:"
echo "   - Click 'Logout' button in sidebar"
echo "   ✅ Should redirect to homepage"
echo "   ✅ localStorage should be cleared"
echo ""

echo "7️⃣  Test Protection:"
echo "   - Try accessing http://localhost:3000/admin directly"
echo "   ✅ Should redirect to homepage if not logged in"
echo ""

echo "🔍 Debug Tips:"
echo "-------------"
echo "• Open DevTools (F12)"
echo "• Check Console for 'loggedIn:' messages"
echo "• Check Application > Local Storage for tokens:"
echo "  - accessToken"
echo "  - refreshToken"
echo "  - user"
echo ""

echo "🧪 Test API Response:"
echo "-------------------"
echo "curl -X POST http://192.168.68.131:3000/api/v1/auth/login \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{"
echo "    \"email\": \"test@example.com\","
echo "    \"password\": \"password123\""
echo "  }'"
echo ""

echo "Expected Response:"
echo "{"
echo "  \"data\": {"
echo "    \"accessToken\": \"...\","
echo "    \"refreshToken\": \"...\","
echo "    \"user\": {"
echo "      \"id\": \"...\","
echo "      \"email\": \"test@example.com\","
echo "      \"name\": \"...\","
echo "      \"role\": \"...\""
echo "    }"
echo "  }"
echo "}"
echo ""

echo "✅ All tests passed? You're good to go!"
