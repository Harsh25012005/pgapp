# Install Dependencies

## Required Packages

Run the following commands to install all required dependencies:

### 1. Supabase and Authentication
```bash
npm install @supabase/supabase-js @react-native-async-storage/async-storage react-native-url-polyfill
```

### 2. SVG Icons (for Bottom Navigation)
```bash
npm install react-native-svg
npx expo install react-native-svg
```

## All Dependencies in One Command

```bash
npm install @supabase/supabase-js @react-native-async-storage/async-storage react-native-url-polyfill react-native-svg
```

## Verify Installation

After installation, run:
```bash
npm start
```

If you encounter any issues, try:
```bash
npm cache clean --force
npm install
npx expo start --clear
```

## Dependencies List

### Production Dependencies
- `@supabase/supabase-js` - Supabase client for authentication and database
- `@react-native-async-storage/async-storage` - Persistent storage for sessions
- `react-native-url-polyfill` - URL polyfill for React Native
- `react-native-svg` - SVG support for custom icons

### Already Installed
- `expo` - Expo framework
- `react` - React library
- `react-native` - React Native framework
- `nativewind` - TailwindCSS for React Native
- `expo-status-bar` - Status bar component

## Notes

- Make sure you're using Node.js version 16 or higher
- Expo CLI should be installed globally: `npm install -g expo-cli`
- For iOS development, you need Xcode installed
- For Android development, you need Android Studio installed
