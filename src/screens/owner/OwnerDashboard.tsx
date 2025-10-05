import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../../contexts/AuthContext';

export const OwnerDashboard: React.FC = () => {
  const { ownerProfile, signOut } = useAuth();

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-8 pt-16 pb-8 bg-gray-50">
          <Text className="text-2xl font-light text-gray-900 mb-2">
            Welcome, {ownerProfile?.name}
          </Text>
          <Text className="text-sm font-light text-gray-500">{ownerProfile?.email}</Text>
          <Text className="text-sm font-light text-gray-500">
            Contact: {ownerProfile?.contact_no}
          </Text>
        </View>

        {/* Stats */}
        <View className="px-8 pt-8">
          <View className="flex-row mb-8">
            <View className="flex-1 bg-gray-50 rounded-lg p-4 mr-2">
              <Text className="text-3xl font-light text-gray-900 mb-1">
                {ownerProfile?.pg_ids?.length || 0}
              </Text>
              <Text className="text-sm font-light text-gray-500">Properties</Text>
            </View>
            <View className="flex-1 bg-gray-50 rounded-lg p-4 ml-2">
              <Text className="text-3xl font-light text-gray-900 mb-1">0</Text>
              <Text className="text-sm font-light text-gray-500">Bookings</Text>
            </View>
          </View>

          {/* Quick Actions */}
          <Text className="text-xl font-medium text-gray-900 mb-6">Manage Properties</Text>

          <TouchableOpacity className="bg-gray-900 rounded-lg p-6 mb-4">
            <Text className="text-lg font-medium text-white mb-2">➕ Add New PG</Text>
            <Text className="text-sm font-light text-gray-300">
              List a new property for rent
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
            <Text className="text-lg font-medium text-gray-900 mb-2">🏠 My Properties</Text>
            <Text className="text-sm font-light text-gray-500">
              View and manage your PG listings
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
            <Text className="text-lg font-medium text-gray-900 mb-2">📊 Analytics</Text>
            <Text className="text-sm font-light text-gray-500">
              View property performance and insights
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
            <Text className="text-lg font-medium text-gray-900 mb-2">💬 Messages</Text>
            <Text className="text-sm font-light text-gray-500">
              Chat with potential tenants
            </Text>
          </TouchableOpacity>

          {/* Profile Section */}
          <View className="mb-8">
            <Text className="text-lg font-medium text-gray-900 mb-4">Account</Text>
            
            <TouchableOpacity className="border-b border-gray-200 py-4">
              <Text className="text-base text-gray-900">Edit Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity className="border-b border-gray-200 py-4">
              <Text className="text-base text-gray-900">Settings</Text>
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
