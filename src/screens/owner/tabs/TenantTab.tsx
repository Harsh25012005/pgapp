import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';

export const TenantTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-8 pt-8 pb-4">
        <Text className="text-2xl font-light text-gray-900 mb-4">Tenants</Text>
        
        {/* Search Bar */}
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search tenants..."
          placeholderTextColor="#9CA3AF"
          className="border-b border-gray-200 py-3 text-base text-gray-900"
        />
      </View>

      <ScrollView className="flex-1">
        <View className="px-8">
          {/* Stats */}
          <View className="flex-row mb-6">
            <View className="flex-1 bg-gray-50 rounded-lg p-4 mr-2">
              <Text className="text-2xl font-light text-gray-900 mb-1">0</Text>
              <Text className="text-xs font-light text-gray-500">Active Tenants</Text>
            </View>
            <View className="flex-1 bg-gray-50 rounded-lg p-4 ml-2">
              <Text className="text-2xl font-light text-gray-900 mb-1">0</Text>
              <Text className="text-xs font-light text-gray-500">Pending Dues</Text>
            </View>
          </View>

          {/* Add Tenant Button */}
          <TouchableOpacity className="bg-gray-900 rounded-lg p-5 mb-6">
            <Text className="text-base font-medium text-white text-center">
              Add New Tenant
            </Text>
          </TouchableOpacity>

          {/* Empty State */}
          <View className="items-center py-12">
            <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
              <Text className="text-3xl">👥</Text>
            </View>
            <Text className="text-lg font-light text-gray-900 mb-2">No Tenants Yet</Text>
            <Text className="text-sm font-light text-gray-500 text-center px-8">
              Start by adding your first tenant to manage their details and payments
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
