import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

type TabName = 'dashboard' | 'tenant' | 'room' | 'payment' | 'more';

interface OwnerBottomNavProps {
  activeTab: TabName;
  onTabChange: (tab: TabName) => void;
}

export const OwnerBottomNav: React.FC<OwnerBottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs: { 
    name: TabName; 
    label: string; 
    iconSet: 'MaterialIcons' | 'Ionicons' | 'FontAwesome5'; 
    iconName: string;
    iconNameFilled: string;
  }[] = [
    { name: 'dashboard', label: 'Dashboard', iconSet: 'Ionicons', iconName: 'grid-outline', iconNameFilled: 'grid' },
    { name: 'tenant', label: 'Tenant', iconSet: 'Ionicons', iconName: 'people-outline', iconNameFilled: 'people' },
    { name: 'room', label: 'Room', iconSet: 'Ionicons', iconName: 'bed-outline', iconNameFilled: 'bed' },
    { name: 'payment', label: 'Payment', iconSet: 'Ionicons', iconName: 'card-outline', iconNameFilled: 'card' },
    { name: 'more', label: 'More', iconSet: 'Ionicons', iconName: 'ellipsis-horizontal-outline', iconNameFilled: 'ellipsis-horizontal' },
  ];

  return (
    <View className="bg-white border-t border-gray-200">
      <View className="flex-row justify-around items-center px-2 py-3">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.name;
          
          const renderIcon = () => {
            const iconProps = {
              name: isActive ? tab.iconNameFilled : tab.iconName,
              size: 24,
              color: isActive ? '#111827' : '#9CA3AF',
            };

            switch (tab.iconSet) {
              case 'MaterialIcons':
                return <MaterialIcons {...iconProps} />;
              case 'Ionicons':
                return <Ionicons {...iconProps} />;
              case 'FontAwesome5':
                return <FontAwesome5 {...iconProps} solid={isActive} />;
              default:
                return <MaterialIcons {...iconProps} />;
            }
          };
          
          return (
            <TouchableOpacity
              key={tab.name}
              onPress={() => onTabChange(tab.name)}
              className="flex-1 items-center justify-center py-2"
              activeOpacity={0.7}
            >
              <View className="items-center">
                {renderIcon()}
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
