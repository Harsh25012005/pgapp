import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { HomeIcon, UsersIcon, BuildingIcon, CreditCardIcon, GridIcon } from '../components/icons/Icons';

type TabName = 'dashboard' | 'tenant' | 'room' | 'payment' | 'more';

interface OwnerBottomNavProps {
  activeTab: TabName;
  onTabChange: (tab: TabName) => void;
}

export const OwnerBottomNav: React.FC<OwnerBottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs: { name: TabName; label: string; icon: typeof HomeIcon }[] = [
    { name: 'dashboard', label: 'Dashboard', icon: HomeIcon },
    { name: 'tenant', label: 'Tenant', icon: UsersIcon },
    { name: 'room', label: 'Room', icon: BuildingIcon },
    { name: 'payment', label: 'Payment', icon: CreditCardIcon },
    { name: 'more', label: 'More', icon: GridIcon },
  ];

  return (
    <View className="bg-white border-t border-gray-200">
      <View className="flex-row justify-around items-center px-2 py-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.name;
          
          return (
            <TouchableOpacity
              key={tab.name}
              onPress={() => onTabChange(tab.name)}
              className="flex-1 items-center justify-center py-2"
              activeOpacity={0.7}
            >
              <View className="items-center">
                <Icon
                  size={24}
                  color={isActive ? '#111827' : '#9CA3AF'}
                  isActive={isActive}
                />
                <Text
                  className={`text-xs mt-1 ${
                    isActive ? 'text-gray-900 font-medium' : 'text-gray-400 font-light'
                  }`}
                >
                  {tab.label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
