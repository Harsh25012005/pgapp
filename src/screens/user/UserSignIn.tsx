import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../../contexts/AuthContext';

interface UserSignInProps {
  onNavigateToSignUp: () => void;
  onBack: () => void;
}

export const UserSignIn: React.FC<UserSignInProps> = ({ onNavigateToSignUp, onBack }) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;

    setLoading(true);
    const { error } = await signIn(email.trim(), password);
    setLoading(false);

    if (error) {
      Alert.alert('Sign In Error', error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <StatusBar style="dark" />
      <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
        <View className="flex-1 px-8 pt-16">
          {/* Back Button */}
          <TouchableOpacity onPress={onBack} className="mb-8">
            <Text className="text-gray-900 text-base">← Back</Text>
          </TouchableOpacity>

          {/* Header */}
          <Text className="text-3xl font-light text-gray-900 mb-2">Welcome Back</Text>
          <Text className="text-base font-light text-gray-500 mb-12">
            Sign in to continue
          </Text>

          {/* Email Input */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-900 mb-2">Email</Text>
            <TextInput
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setErrors({ ...errors, email: '' });
              }}
              placeholder="Enter your email"
              placeholderTextColor="#9CA3AF"
              className="border-b border-gray-200 py-3 text-base text-gray-900"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email ? (
              <Text className="text-red-500 text-xs mt-1">{errors.email}</Text>
            ) : null}
          </View>

          {/* Password Input */}
          <View className="mb-8">
            <Text className="text-sm font-medium text-gray-900 mb-2">Password</Text>
            <TextInput
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setErrors({ ...errors, password: '' });
              }}
              placeholder="Enter your password"
              placeholderTextColor="#9CA3AF"
              className="border-b border-gray-200 py-3 text-base text-gray-900"
              secureTextEntry
            />
            {errors.password ? (
              <Text className="text-red-500 text-xs mt-1">{errors.password}</Text>
            ) : null}
          </View>

          {/* Sign In Button */}
          <TouchableOpacity
            onPress={handleSignIn}
            disabled={loading}
            className="bg-gray-900 rounded-lg py-4 items-center mb-6"
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-white text-base font-medium">Sign In</Text>
            )}
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View className="flex-row justify-center mb-8">
            <Text className="text-gray-500 text-sm font-light">
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity onPress={onNavigateToSignUp}>
              <Text className="text-gray-900 text-sm font-medium">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
