# PG Management App

A React Native/Expo mobile application for managing Paying Guest (PG) accommodations with separate interfaces for PG owners and regular users.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (or Expo Go app on your device)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Add your Supabase credentials

3. Run the app:
```bash
npm start
```

## 📁 Project Structure

```
pgapp/
├── src/
│   ├── components/      # Reusable UI components
│   │   └── icons/       # Icon components
│   ├── config/          # Configuration files (Supabase, etc.)
│   ├── contexts/        # React contexts (Auth, etc.)
│   ├── navigation/      # Navigation components
│   └── screens/         # Screen components
│       ├── owner/       # Owner-specific screens
│       │   └── tabs/    # Owner tab screens
│       └── user/        # User-specific screens
├── assets/              # Images, fonts, etc.
├── App.tsx             # Main app component
├── app.json            # Expo configuration
├── db.sql              # Database schema
├── package.json        # Dependencies
└── tsconfig.json       # TypeScript configuration
```

## 🎯 Features

### For PG Owners
- Multi-step registration with PG details
- Dashboard with property management
- Room management
- Tenant tracking
- Payment management
- Profile management

### For Regular Users
- Simple sign up/sign in
- Browse PG listings
- User profile management

### Authentication
- Supabase-based authentication
- Email verification
- Persistent sessions
- Row Level Security (RLS)

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Styling**: NativeWind (TailwindCSS for React Native)
- **Backend**: Supabase (PostgreSQL)
- **Navigation**: Custom navigation system
- **State Management**: React Context API

## 📱 Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run on web
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🗄️ Database

The app uses Supabase (PostgreSQL) with the following main tables:
- `user_profiles` - Regular user profiles
- `owner_profiles` - PG owner profiles
- `pgs` - PG properties
- `user_metadata` - User type metadata

See `db.sql` for the complete schema.

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- Secure session management with AsyncStorage
- Environment variables for sensitive data
- User data isolation

## 📝 Configuration Files

- `app.json` - Expo app configuration
- `babel.config.js` - Babel configuration
- `metro.config.js` - Metro bundler configuration
- `tsconfig.json` - TypeScript configuration
- `eslint.config.js` - ESLint configuration
- `prettier.config.js` - Prettier configuration
- `postcss.config.mjs` - PostCSS configuration
- `tailwindcss.config.js` - TailwindCSS configuration (via NativeWind)

## 🚧 Development

1. Make sure to follow the existing code structure
2. Use TypeScript for all new files
3. Follow the existing naming conventions
4. Use NativeWind for styling
5. Test on both iOS and Android

## 📄 License

Private project - All rights reserved

## 👥 Author

Harsh Vaghela
