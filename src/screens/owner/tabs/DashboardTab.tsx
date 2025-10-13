import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, ActivityIndicator } from 'react-native';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase, PG } from '../../../config/supabase';

export const DashboardTab: React.FC = () => {
  const { ownerProfile } = useAuth();
  const [pgCount, setPgCount] = useState(0);
  const [pgs, setPgs] = useState<PG[]>([]);
  const [selectedPG, setSelectedPG] = useState<PG | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);

  // Custom hook for fetching PGs
  const usePGs = () => {
    const fetchPGs = async () => {
      if (!ownerProfile?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error, count } = await supabase
          .from('pgs')
          .select('*', { count: 'exact' })
          .eq('owner_id', ownerProfile.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setPgs(data || []);
        setPgCount(count || 0);

        // Set first PG as selected by default if none selected
        if (!selectedPG && data && data.length > 0) {
          setSelectedPG(data[0]);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    return { fetchPGs };
  };

  const { fetchPGs } = usePGs();

  useEffect(() => {
    fetchPGs();
  }, [ownerProfile?.id]);

  const handlePGSelect = (pg: PG) => {
    setSelectedPG(pg);
    setShowDropdown(false);
  };

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-8 pt-16 pb-6">
        <View className="flex-row items-start justify-between">
          <View className="flex-1">
            <Text className="mb-2 text-2xl font-semibold text-gray-900">
              Welcome, {ownerProfile?.name}
            </Text>
            <Text className="text-sm font-light text-gray-500">{ownerProfile?.email}</Text>
          </View>
          
          {/* Dropdown in top right */}
          {pgCount > 0 && (
            <TouchableOpacity
              className="ml-4 rounded-lg border border-gray-200 bg-white px-3 py-2 min-w-[120px]"
              onPress={() => {
                setShowDropdown(true);
              }}>
              {loading ? (
                <View className="flex-row items-center">
                  <ActivityIndicator size="small" color="#6B7280" />
                  <Text className="ml-1 text-xs text-gray-500">Loading...</Text>
                </View>
              ) : selectedPG ? (
                <View>
                  <Text className="text-sm font-medium text-gray-900" numberOfLines={1}>{selectedPG.name}</Text>
                  <Text className="text-xs text-gray-500" numberOfLines={1}>{selectedPG.location}</Text>
                </View>
              ) : (
                <Text className="text-sm text-gray-500">Select Property</Text>
              )}
              <Text className="absolute top-2 right-2 text-gray-400 text-xs">▼</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>


      {/* Stats Cards */}
      <View className="mb-6 px-8">
        <View className="mb-4 flex-row">
          <View className="mr-2 flex-1 rounded-lg bg-gray-50 p-4">
            <Text className="mb-1 text-3xl font-light text-gray-900">{pgCount}</Text>
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

        {selectedPG && (
          <>
            <TouchableOpacity className="mb-3 rounded-lg border border-gray-200 bg-white p-5">
              <Text className="mb-1 text-base font-medium text-gray-900">
                Manage {selectedPG.name}
              </Text>
              <Text className="text-sm font-light text-gray-500">View rooms and tenants</Text>
            </TouchableOpacity>

            <TouchableOpacity className="mb-3 rounded-lg border border-gray-200 bg-white p-5">
              <Text className="mb-1 text-base font-medium text-gray-900">Add New Tenant</Text>
              <Text className="text-sm font-light text-gray-500">
                Register a new tenant to {selectedPG.name}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="mb-3 rounded-lg border border-gray-200 bg-white p-5">
              <Text className="mb-1 text-base font-medium text-gray-900">Collect Payment</Text>
              <Text className="text-sm font-light text-gray-500">
                Record rent payment for {selectedPG.name}
              </Text>
            </TouchableOpacity>
          </>
        )}

        {pgCount === 0 && (
          <View className="mb-3 rounded-lg border border-gray-200 bg-gray-50 p-5">
            <Text className="mb-1 text-base font-medium text-gray-500">No Properties Yet</Text>
            <Text className="text-sm font-light text-gray-400">
              Add your first property to get started
            </Text>
          </View>
        )}
      </View>

      {/* Recent Activity */}
      <View className="mb-8 px-8">
        <Text className="mb-4 text-lg font-medium text-gray-900">Recent Activity</Text>

        <View className="items-center rounded-lg bg-gray-50 p-6">
          <Text className="text-center text-sm font-light text-gray-500">
            {selectedPG ? `No recent activity for ${selectedPG.name}` : 'No recent activity'}
          </Text>
        </View>
      </View>

      {/* PG Selection Dropdown - Simple Approach */}
      {showDropdown && (
        <View
          className="absolute top-0 right-0 bottom-0 left-0 z-50"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <TouchableOpacity
            className="flex-1"
            onPress={() => {
              setShowDropdown(false);
            }}>
            <View className="flex-1 justify-center px-8">
              <TouchableOpacity activeOpacity={1} className="rounded-lg bg-white">
                <View className="border-b border-gray-200 p-4">
                  <Text className="text-lg font-medium text-gray-900">Select Property</Text>
                </View>

                <ScrollView className="max-h-80">
                  {pgs.length > 0 ? (
                    pgs.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        className="border-b border-gray-100 p-4"
                        onPress={() => {
                          handlePGSelect(item);
                        }}>
                        <Text className="text-base font-medium text-gray-900">{item.name}</Text>
                        <Text className="text-sm text-gray-500">{item.location}</Text>
                      </TouchableOpacity>
                    ))
                  ) : (
                    <View className="p-6">
                      <Text className="text-center text-gray-500">No properties found</Text>
                    </View>
                  )}
                </ScrollView>

                <TouchableOpacity
                  className="border-t border-gray-200 p-4"
                  onPress={() => {
                    setShowDropdown(false);
                  }}>
                  <Text className="text-center text-base font-medium text-gray-500">Cancel</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};
