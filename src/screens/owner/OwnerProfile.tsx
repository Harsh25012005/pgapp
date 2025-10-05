import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../config/supabase';

export const OwnerProfile: React.FC = () => {
  const { ownerProfile, user, signOut, refreshProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form state
  const [name, setName] = useState(ownerProfile?.name || '');
  const [contactNo, setContactNo] = useState(ownerProfile?.contact_no || '');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!contactNo.trim()) {
      newErrors.contactNo = 'Contact number is required';
    } else if (!/^\d{10}$/.test(contactNo.trim())) {
      newErrors.contactNo = 'Contact number must be 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('owner_profiles')
        .update({
          name: name.trim(),
          contact_no: contactNo.trim(),
        })
        .eq('id', user?.id);

      if (error) throw error;

      await refreshProfile();
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setName(ownerProfile?.name || '');
    setContactNo(ownerProfile?.contact_no || '');
    setErrors({});
    setIsEditing(false);
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-8 pt-16 pb-8 bg-gray-50">
          <Text className="text-2xl font-light text-gray-900 mb-2">My Profile</Text>
          <Text className="text-sm font-light text-gray-500">
            Manage your business information
          </Text>
        </View>

        {/* Profile Content */}
        <View className="px-8 pt-8">
          {/* Profile Picture Placeholder */}
          <View className="items-center mb-8">
            <View className="w-24 h-24 bg-gray-200 rounded-full items-center justify-center mb-4">
              <Text className="text-4xl">🏢</Text>
            </View>
            {!isEditing && (
              <TouchableOpacity>
                <Text className="text-sm text-gray-500">Change Photo</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Profile Information */}
          <View className="mb-8">
            <Text className="text-lg font-medium text-gray-900 mb-6">
              Business Information
            </Text>

            {/* Name Field */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-900 mb-2">Full Name</Text>
              {isEditing ? (
                <>
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
                </>
              ) : (
                <Text className="text-base text-gray-900 py-3 border-b border-gray-200">
                  {ownerProfile?.name}
                </Text>
              )}
            </View>

            {/* Email Field (Read-only) */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-900 mb-2">Email</Text>
              <Text className="text-base text-gray-500 py-3 border-b border-gray-200">
                {ownerProfile?.email}
              </Text>
              <Text className="text-xs text-gray-400 mt-1">Email cannot be changed</Text>
            </View>

            {/* Contact Number Field */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-900 mb-2">Contact Number</Text>
              {isEditing ? (
                <>
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
                </>
              ) : (
                <Text className="text-base text-gray-900 py-3 border-b border-gray-200">
                  {ownerProfile?.contact_no}
                </Text>
              )}
            </View>

            {/* Properties Count */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-900 mb-2">Properties</Text>
              <Text className="text-base text-gray-900 py-3 border-b border-gray-200">
                {ownerProfile?.pg_ids?.length || 0} PG{ownerProfile?.pg_ids?.length !== 1 ? 's' : ''}
              </Text>
            </View>

            {/* Account Created */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-900 mb-2">Member Since</Text>
              <Text className="text-base text-gray-500 py-3 border-b border-gray-200">
                {ownerProfile?.created_at
                  ? new Date(ownerProfile.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'N/A'}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          {isEditing ? (
            <View className="mb-8">
              <TouchableOpacity
                onPress={handleSave}
                disabled={loading}
                className="bg-gray-900 rounded-lg py-4 items-center mb-4"
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text className="text-white text-base font-medium">Save Changes</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleCancel}
                disabled={loading}
                className="bg-white border border-gray-200 rounded-lg py-4 items-center"
              >
                <Text className="text-gray-900 text-base font-medium">Cancel</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="mb-8">
              <TouchableOpacity
                onPress={() => setIsEditing(true)}
                className="bg-gray-900 rounded-lg py-4 items-center mb-4"
              >
                <Text className="text-white text-base font-medium">Edit Profile</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Additional Options */}
          <View className="mb-8">
            <Text className="text-lg font-medium text-gray-900 mb-4">Account</Text>

            <TouchableOpacity className="border-b border-gray-200 py-4">
              <Text className="text-base text-gray-900">Change Password</Text>
            </TouchableOpacity>

            <TouchableOpacity className="border-b border-gray-200 py-4">
              <Text className="text-base text-gray-900">Business Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity className="border-b border-gray-200 py-4">
              <Text className="text-base text-gray-900">Notification Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity className="border-b border-gray-200 py-4">
              <Text className="text-base text-gray-900">Privacy Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={signOut} className="border-b border-gray-200 py-4">
              <Text className="text-base text-red-500">Sign Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
