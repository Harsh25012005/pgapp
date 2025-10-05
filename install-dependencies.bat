@echo off
echo ============================================
echo Installing PG Management App Dependencies
echo ============================================
echo.

echo Installing Supabase and required packages...
call npm install @supabase/supabase-js @react-native-async-storage/async-storage react-native-url-polyfill

echo.
echo ============================================
echo Installation Complete!
echo ============================================
echo.
echo Next steps:
echo 1. Run: npm start
echo 2. Test the authentication flow
echo.
pause
