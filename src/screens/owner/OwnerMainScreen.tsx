import React, { useState } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { OwnerBottomNav } from '../../navigation/OwnerBottomNav';
import { DashboardTab } from './tabs/DashboardTab';
import { TenantTab } from './tabs/TenantTab';
import { RoomTab } from './tabs/RoomTab';
import { PaymentTab } from './tabs/PaymentTab';
import { MoreTab } from './tabs/MoreTab';

type TabName = 'dashboard' | 'tenant' | 'room' | 'payment' | 'more';

export const OwnerMainScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabName>('dashboard');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab />;
      case 'tenant':
        return <TenantTab />;
      case 'room':
        return <RoomTab />;
      case 'payment':
        return <PaymentTab />;
      case 'more':
        return <MoreTab />;
      default:
        return <DashboardTab />;
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      
      {/* Tab Content */}
      <View className="flex-1">
        {renderTabContent()}
      </View>

      {/* Bottom Navigation */}
      <OwnerBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </View>
  );
};
