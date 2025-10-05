import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '../../../contexts/AuthContext';

export const DashboardTab: React.FC = () => {
  const { ownerProfile } = useAuth();

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-8 pt-16 pb-6">
        <Text className="mb-2 text-2xl font-semibold text-gray-900">
          Welcome, {ownerProfile?.name}
        </Text>
        <Text className="text-sm font-light text-gray-500">{ownerProfile?.email}</Text>
      </View>

      {/* Stats Cards */}
      <View className="mb-6 px-8">
        <View className="mb-4 flex-row">
          <View className="mr-2 flex-1 rounded-lg bg-gray-50 p-4">
            <Text className="mb-1 text-3xl font-light text-gray-900">
              {ownerProfile?.pg_ids?.length || 0}
            </Text>
            <Text className="text-sm font-light text-gray-500">Properties</Text>
          </View>
          <View className="ml-2 flex-1 rounded-lg bg-gray-50 p-4">
            <Text className="mb-1 text-3xl font-light text-gray-900">0</Text>
            <Text className="text-sm font-light text-gray-500">Total Tenants</Text>
          </View>
        </View>

        <View className="flex-row">
          <View className="mr-2 flex-1 rounded-lg bg-gray-50 p-4">
            <Text className="mb-1 text-3xl font-light text-gray-900">0</Text>
            <Text className="text-sm font-light text-gray-500">Vacant Rooms</Text>
          </View>
          <View className="ml-2 flex-1 rounded-lg bg-gray-50 p-4">
            <Text className="mb-1 text-3xl font-light text-gray-900">₹0</Text>
            <Text className="text-sm font-light text-gray-500">This Month</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View className="mb-6 px-8">
        <Text className="mb-4 text-lg font-medium text-gray-900">Quick Actions</Text>

        <TouchableOpacity className="mb-3 rounded-lg bg-gray-900 p-5">
          <Text className="mb-1 text-base font-medium text-white">Add New Property</Text>
          <Text className="text-sm font-light text-gray-300">List a new PG property</Text>
        </TouchableOpacity>

        <TouchableOpacity className="mb-3 rounded-lg border border-gray-200 bg-white p-5">
          <Text className="mb-1 text-base font-medium text-gray-900">Add New Tenant</Text>
          <Text className="text-sm font-light text-gray-500">Register a new tenant</Text>
        </TouchableOpacity>

        <TouchableOpacity className="mb-3 rounded-lg border border-gray-200 bg-white p-5">
          <Text className="mb-1 text-base font-medium text-gray-900">Collect Payment</Text>
          <Text className="text-sm font-light text-gray-500">Record rent payment</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Activity */}
      <View className="mb-8 px-8">
        <Text className="mb-4 text-lg font-medium text-gray-900">Recent Activity</Text>

        <View className="items-center rounded-lg bg-gray-50 p-6">
          <Text className="text-center text-sm font-light text-gray-500">No recent activity</Text>
        </View>
      </View>
    </ScrollView>
  );
};
