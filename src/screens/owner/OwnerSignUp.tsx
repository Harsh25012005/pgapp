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

interface OwnerSignUpProps {
  onNavigateToSignIn: () => void;
  onBack: () => void;
}

export const OwnerSignUp: React.FC<OwnerSignUpProps> = ({ onNavigateToSignIn, onBack }) => {
  const { signUpOwner } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Step 1 fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Step 2 fields
  const [contactNo, setContactNo] = useState('');
  const [pgName, setPgName] = useState('');
  const [pgLocation, setPgLocation] = useState('');

  const validateStep1 = () => {
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

  const validateStep2 = () => {
    const newErrors: { [key: string]: string } = {};

    if (!contactNo.trim()) {
      newErrors.contactNo = 'Contact number is required';
    } else if (!/^\d{10}$/.test(contactNo.trim())) {
      newErrors.contactNo = 'Contact number must be 10 digits';
    }

    if (!pgName.trim()) {
      newErrors.pgName = 'PG name is required';
    }

    if (!pgLocation.trim()) {
      newErrors.pgLocation = 'PG location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
      setErrors({});
    }
  };

  const handleSignUp = async () => {
    if (!validateStep2()) return;

    setLoading(true);
    const { error } = await signUpOwner(
      email.trim(),
      password,
      name.trim(),
      contactNo.trim(),
      pgName.trim(),
      pgLocation.trim()
    );
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
          <TouchableOpacity onPress={step === 1 ? onBack : () => setStep(1)} className="mb-8">
            <Text className="text-gray-900 text-base">← Back</Text>
          </TouchableOpacity>

          {/* Progress Indicator */}
          <View className="flex-row mb-8">
            <View className={`flex-1 h-1 rounded ${step >= 1 ? 'bg-gray-900' : 'bg-gray-200'} mr-2`} />
            <View className={`flex-1 h-1 rounded ${step >= 2 ? 'bg-gray-900' : 'bg-gray-200'}`} />
          </View>

          {/* Header */}
          <Text className="text-3xl font-light text-gray-900 mb-2">
            {step === 1 ? 'Create Owner Account' : 'PG Details'}
          </Text>
          <Text className="text-base font-light text-gray-500 mb-12">
            {step === 1 ? 'Step 1 of 2: Personal Information' : 'Step 2 of 2: Property Information'}
          </Text>

          {step === 1 ? (
            <>
              {/* Step 1: Personal Information */}
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

              <TouchableOpacity
                onPress={handleNext}
                className="bg-gray-900 rounded-lg py-4 items-center mb-6"
              >
                <Text className="text-white text-base font-medium">Next</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* Step 2: PG Details */}
              <View className="mb-6">
                <Text className="text-sm font-medium text-gray-900 mb-2">Contact Number</Text>
                <TextInput
                  value={contactNo}
                  onChangeText={(text) => {
                    setContactNo(text);
                    setErrors({ ...errors, contactNo: '' });
                  }}
                  placeholder="Enter your contact number"
                  placeholderTextColor="#9CA3AF"
                  className="border-b border-gray-200 py-3 text-base text-gray-900"
                  keyboardType="phone-pad"
                  maxLength={10}
                />
                {errors.contactNo ? (
                  <Text className="text-red-500 text-xs mt-1">{errors.contactNo}</Text>
                ) : null}
              </View>

              <View className="mb-6">
                <Text className="text-sm font-medium text-gray-900 mb-2">PG Name</Text>
                <TextInput
                  value={pgName}
                  onChangeText={(text) => {
                    setPgName(text);
                    setErrors({ ...errors, pgName: '' });
                  }}
                  placeholder="Enter PG name"
                  placeholderTextColor="#9CA3AF"
                  className="border-b border-gray-200 py-3 text-base text-gray-900"
                  autoCapitalize="words"
                />
                {errors.pgName ? (
                  <Text className="text-red-500 text-xs mt-1">{errors.pgName}</Text>
                ) : null}
              </View>

              <View className="mb-8">
                <Text className="text-sm font-medium text-gray-900 mb-2">PG Location</Text>
                <TextInput
                  value={pgLocation}
                  onChangeText={(text) => {
                    setPgLocation(text);
                    setErrors({ ...errors, pgLocation: '' });
                  }}
                  placeholder="Enter PG location"
                  placeholderTextColor="#9CA3AF"
                  className="border-b border-gray-200 py-3 text-base text-gray-900"
                  autoCapitalize="words"
                />
                {errors.pgLocation ? (
                  <Text className="text-red-500 text-xs mt-1">{errors.pgLocation}</Text>
                ) : null}
              </View>

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
            </>
          )}

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
