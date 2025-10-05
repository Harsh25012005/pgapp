import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

export const PaymentTab: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState('January 2025');

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-8 pt-8 pb-4">
        <Text className="text-2xl font-light text-gray-900 mb-4">Payments</Text>
        
        {/* Month Selector */}
        <TouchableOpacity className="border-b border-gray-200 py-3">
          <Text className="text-sm font-light text-gray-500 mb-1">Selected Period</Text>
          <Text className="text-base text-gray-900">{selectedMonth}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        <View className="px-8">
          {/* Payment Summary */}
          <View className="mb-6">
            <Text className="text-base font-medium text-gray-900 mb-4">Summary</Text>
            
            <View className="bg-gray-50 rounded-lg p-5 mb-3">
              <Text className="text-sm font-light text-gray-500 mb-2">Total Expected</Text>
              <Text className="text-3xl font-light text-gray-900">₹0</Text>
            </View>

            <View className="flex-row">
              <View className="flex-1 bg-green-50 rounded-lg p-4 mr-2">
                <Text className="text-xs font-light text-green-600 mb-1">Received</Text>
                <Text className="text-xl font-light text-green-700">₹0</Text>
              </View>
              <View className="flex-1 bg-red-50 rounded-lg p-4 ml-2">
                <Text className="text-xs font-light text-red-600 mb-1">Pending</Text>
                <Text className="text-xl font-light text-red-700">₹0</Text>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View className="mb-6">
            <Text className="text-base font-medium text-gray-900 mb-4">Quick Actions</Text>
            
            <TouchableOpacity className="bg-gray-900 rounded-lg p-5 mb-3">
              <Text className="text-base font-medium text-white text-center">
                Collect Payment
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-white border border-gray-200 rounded-lg p-5 mb-3">
              <Text className="text-base font-medium text-gray-900 text-center">
                Send Payment Reminder
              </Text>
            </TouchableOpacity>
          </View>

          {/* Payment History */}
          <View className="mb-8">
            <Text className="text-base font-medium text-gray-900 mb-4">Recent Payments</Text>
            
            <View className="bg-gray-50 rounded-lg p-6 items-center">
              <Text className="text-sm font-light text-gray-500 text-center">
                No payment records yet
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
