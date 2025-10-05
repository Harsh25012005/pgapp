import React, { useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { SplashScreen } from './src/screens/SplashScreen';
import { UserSignUp } from './src/screens/user/UserSignUp';
import { UserSignIn } from './src/screens/user/UserSignIn';
import { OwnerSignUp } from './src/screens/owner/OwnerSignUp';
import { OwnerSignIn } from './src/screens/owner/OwnerSignIn';
import { UserProfile } from './src/screens/user/UserProfile';
import { OwnerMainScreen } from './src/screens/owner/OwnerMainScreen';

import './global.css';

type Screen = 'splash' | 'user-signup' | 'user-signin' | 'owner-signup' | 'owner-signin';

const AppContent: React.FC = () => {
  const { session, userType, loading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');

  // Show loading indicator while checking auth state
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#111827" />
      </View>
    );
  }

  // If user is authenticated, show appropriate screen
  if (session && userType) {
    if (userType === 'user') {
      return <UserProfile />;
    } else if (userType === 'owner') {
      return <OwnerMainScreen />;
    }
  }

  // Authentication flow
  const handleSelectUserType = (type: 'user' | 'owner') => {
    if (type === 'user') {
      setCurrentScreen('user-signin');
    } else {
      setCurrentScreen('owner-signin');
    }
  };

  const handleBackToSplash = () => {
    setCurrentScreen('splash');
  };

  // Render appropriate screen
  switch (currentScreen) {
    case 'splash':
      return <SplashScreen onSelectUserType={handleSelectUserType} />;

    case 'user-signup':
      return (
        <UserSignUp
          onNavigateToSignIn={() => setCurrentScreen('user-signin')}
          onBack={handleBackToSplash}
        />
      );

    case 'user-signin':
      return (
        <UserSignIn
          onNavigateToSignUp={() => setCurrentScreen('user-signup')}
          onBack={handleBackToSplash}
        />
      );

    case 'owner-signup':
      return (
        <OwnerSignUp
          onNavigateToSignIn={() => setCurrentScreen('owner-signin')}
          onBack={handleBackToSplash}
        />
      );

    case 'owner-signin':
      return (
        <OwnerSignIn
          onNavigateToSignUp={() => setCurrentScreen('owner-signup')}
          onBack={handleBackToSplash}
        />
      );

    default:
      return <SplashScreen onSelectUserType={handleSelectUserType} />;
  }
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
      <StatusBar style="auto" />
    </AuthProvider>
  );
}
