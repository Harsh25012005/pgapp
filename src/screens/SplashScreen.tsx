import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';

interface SplashScreenProps {
  onSelectUserType: (type: 'user' | 'owner') => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onSelectUserType }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
        className="flex-1 justify-center items-center px-8"
      >
        {/* Logo/Icon */}
        <View className="w-24 h-24 bg-gray-900 rounded-3xl items-center justify-center mb-8">
          <Text className="text-5xl font-bold text-white">PG</Text>
        </View>

        {/* App Title */}
        <Text className="text-3xl font-light text-gray-900 mb-3">
          Welcome to PG Manager
        </Text>
        
        <Text className="text-base font-light text-gray-500 text-center mb-12 px-4">
          Find your perfect paying guest accommodation or manage your PG properties
        </Text>

        {/* User Type Selection */}
        <View className="w-full max-w-sm">
          <Text className="text-sm font-medium text-gray-900 mb-4 text-center">
            I am a...
          </Text>

          {/* Normal User Button */}
          <TouchableOpacity
            onPress={() => onSelectUserType('user')}
            className="bg-white border border-gray-200 rounded-lg p-6 mb-4 active:bg-gray-50"
          >
            <View className="items-center">
              <Text className="text-4xl mb-3">🏠</Text>
              <Text className="text-lg font-medium text-gray-900 mb-2">
                Looking for PG
              </Text>
              <Text className="text-sm font-light text-gray-500 text-center">
                Find and book paying guest accommodations
              </Text>
            </View>
          </TouchableOpacity>

          {/* PG Owner Button */}
          <TouchableOpacity
            onPress={() => onSelectUserType('owner')}
            className="bg-gray-900 rounded-lg p-6 active:bg-gray-800"
          >
            <View className="items-center">
              <Text className="text-4xl mb-3">🏢</Text>
              <Text className="text-lg font-medium text-white mb-2">
                PG Owner
              </Text>
              <Text className="text-sm font-light text-gray-400 text-center">
                Manage your paying guest properties
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <Text className="text-xs font-light text-gray-400 mt-12">
          By continuing, you agree to our Terms & Privacy Policy
        </Text>
      </Animated.View>
    </View>
  );
};
