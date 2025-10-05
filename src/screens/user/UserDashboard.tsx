import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../../contexts/AuthContext';

export const UserDashboard: React.FC = () => {
  const { userProfile, signOut } = useAuth();

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-8 pt-16 pb-8 bg-gray-50">
          <Text className="text-2xl font-light text-gray-900 mb-2">
            Welcome, {userProfile?.name}
          </Text>
          <Text className="text-sm font-light text-gray-500">{userProfile?.email}</Text>
        </View>

        {/* Content */}
        <View className="px-8 pt-8">
          <Text className="text-xl font-medium text-gray-900 mb-6">Find Your Perfect PG</Text>

          {/* Quick Actions */}
          <View className="mb-8">
            <TouchableOpacity className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
              <Text className="text-lg font-medium text-gray-900 mb-2">🔍 Browse PGs</Text>
              <Text className="text-sm font-light text-gray-500">
                Explore available paying guest accommodations
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
              <Text className="text-lg font-medium text-gray-900 mb-2">⭐ Favorites</Text>
              <Text className="text-sm font-light text-gray-500">
                View your saved PG listings
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
              <Text className="text-lg font-medium text-gray-900 mb-2">📋 My Bookings</Text>
              <Text className="text-sm font-light text-gray-500">
                Check your booking history
              </Text>
            </TouchableOpacity>
          </View>

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
