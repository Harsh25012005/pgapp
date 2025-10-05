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

interface UserSignUpProps {
  onNavigateToSignIn: () => void;
  onBack: () => void;
}

export const UserSignUp: React.FC<UserSignUpProps> = ({ onNavigateToSignIn, onBack }) => {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);
    const { error } = await signUp(email.trim(), password, name.trim(), 'user');
    setLoading(false);

    if (error) {
      Alert.alert('Sign Up Error', error.message);
    } else {
      Alert.alert(
        'Verification Email Sent',
        'Please check your email to verify your account before signing in.',
        [{ text: 'OK', onPress: onNavigateToSignIn }]
      );
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
          <Text className="text-3xl font-light text-gray-900 mb-2">Create Account</Text>
          <Text className="text-base font-light text-gray-500 mb-12">
            Sign up to find your perfect PG
          </Text>

          {/* Name Input */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-900 mb-2">Full Name</Text>
            <TextInput
              value={name}
              onChangeText={(text) => {
                setName(text);
                setErrors({ ...errors, name: '' });
              }}
              placeholder="Enter your name"
              placeholderTextColor="#9CA3AF"
              className="border-b border-gray-200 py-3 text-base text-gray-900"
              autoCapitalize="words"
            />
            {errors.name ? (
              <Text className="text-red-500 text-xs mt-1">{errors.name}</Text>
            ) : null}
          </View>

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
          <View className="mb-6">
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

          {/* Confirm Password Input */}
          <View className="mb-8">
            <Text className="text-sm font-medium text-gray-900 mb-2">Confirm Password</Text>
            <TextInput
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setErrors({ ...errors, confirmPassword: '' });
              }}
              placeholder="Confirm your password"
              placeholderTextColor="#9CA3AF"
              className="border-b border-gray-200 py-3 text-base text-gray-900"
              secureTextEntry
            />
            {errors.confirmPassword ? (
              <Text className="text-red-500 text-xs mt-1">{errors.confirmPassword}</Text>
            ) : null}
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            onPress={handleSignUp}
            disabled={loading}
            className="bg-gray-900 rounded-lg py-4 items-center mb-6"
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-white text-base font-medium">Sign Up</Text>
            )}
          </TouchableOpacity>

          {/* Sign In Link */}
          <View className="flex-row justify-center mb-8">
            <Text className="text-gray-500 text-sm font-light">
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={onNavigateToSignIn}>
              <Text className="text-gray-900 text-sm font-medium">Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
