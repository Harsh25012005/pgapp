import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '../../../contexts/AuthContext';

export const MoreTab: React.FC = () => {
  const { ownerProfile, signOut } = useAuth();

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-8 pt-8 pb-6">
        <Text className="text-2xl font-light text-gray-900 mb-2">More</Text>
        <Text className="text-sm font-light text-gray-500">{ownerProfile?.email}</Text>
      </View>

      <View className="px-8">
        {/* Profile Section */}
        <View className="mb-6">
          <Text className="text-base font-medium text-gray-900 mb-4">Profile</Text>
          
          <TouchableOpacity className="border-b border-gray-200 py-4">
            <Text className="text-base text-gray-900">My Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity className="border-b border-gray-200 py-4">
            <Text className="text-base text-gray-900">Business Information</Text>
          </TouchableOpacity>

          <TouchableOpacity className="border-b border-gray-200 py-4">
            <Text className="text-base text-gray-900">Change Password</Text>
          </TouchableOpacity>
        </View>

        {/* Settings Section */}
        <View className="mb-6">
          <Text className="text-base font-medium text-gray-900 mb-4">Settings</Text>
          
          <TouchableOpacity className="border-b border-gray-200 py-4">
            <Text className="text-base text-gray-900">Notifications</Text>
          </TouchableOpacity>

          <TouchableOpacity className="border-b border-gray-200 py-4">
            <Text className="text-base text-gray-900">Privacy & Security</Text>
          </TouchableOpacity>

          <TouchableOpacity className="border-b border-gray-200 py-4">
            <Text className="text-base text-gray-900">Payment Settings</Text>
          </TouchableOpacity>
        </View>

        {/* Reports Section */}
        <View className="mb-6">
          <Text className="text-base font-medium text-gray-900 mb-4">Reports</Text>
          
          <TouchableOpacity className="border-b border-gray-200 py-4">
            <Text className="text-base text-gray-900">Analytics</Text>
          </TouchableOpacity>

          <TouchableOpacity className="border-b border-gray-200 py-4">
            <Text className="text-base text-gray-900">Financial Reports</Text>
          </TouchableOpacity>

          <TouchableOpacity className="border-b border-gray-200 py-4">
            <Text className="text-base text-gray-900">Tenant Reports</Text>
          </TouchableOpacity>
        </View>

        {/* Support Section */}
        <View className="mb-6">
          <Text className="text-base font-medium text-gray-900 mb-4">Support</Text>
          
          <TouchableOpacity className="border-b border-gray-200 py-4">
            <Text className="text-base text-gray-900">Help Center</Text>
          </TouchableOpacity>

          <TouchableOpacity className="border-b border-gray-200 py-4">
            <Text className="text-base text-gray-900">Contact Support</Text>
          </TouchableOpacity>

          <TouchableOpacity className="border-b border-gray-200 py-4">
            <Text className="text-base text-gray-900">Terms & Conditions</Text>
          </TouchableOpacity>

          <TouchableOpacity className="border-b border-gray-200 py-4">
            <Text className="text-base text-gray-900">Privacy Policy</Text>
          </TouchableOpacity>
        </View>

        {/* Sign Out */}
        <View className="mb-8">
          <TouchableOpacity onPress={signOut} className="border-b border-gray-200 py-4">
            <Text className="text-base text-red-500">Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View className="items-center py-6">
          <Text className="text-xs font-light text-gray-400">Version 1.0.0</Text>
        </View>
      </View>
    </ScrollView>
  );
};
