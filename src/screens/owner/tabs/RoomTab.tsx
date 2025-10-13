import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase, PG } from '../../../config/supabase';

export const RoomTab: React.FC = () => {
  const { ownerProfile } = useAuth();
  const [pgs, setPgs] = useState<PG[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPGs = async () => {
    try {
      if (!ownerProfile?.id) {
        setPgs([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('pgs')
        .select('*')
        .eq('owner_id', ownerProfile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPgs(data || []);
    } catch (error: any) {
      console.error('Error fetching PGs:', error);
      Alert.alert('Error', 'Failed to load properties');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPGs();
  }, [ownerProfile?.id]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPGs();
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#111827" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-8 pt-8 pb-4">
        <Text className="text-2xl font-light text-gray-900 mb-2">Rooms & Properties</Text>
        <Text className="text-sm font-light text-gray-500">
          {pgs.length} {pgs.length === 1 ? 'Property' : 'Properties'}
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#111827']} />
        }
      >
        <View className="px-8">
          {/* Add Property Button */}
          <TouchableOpacity className="bg-gray-900 rounded-lg p-5 mb-6">
            <Text className="text-base font-medium text-white text-center">
              Add New Property
            </Text>
          </TouchableOpacity>

          {/* Empty State */}
          {pgs.length === 0 ? (
            <View className="items-center py-12">
              <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
                <Text className="text-3xl">🏠</Text>
              </View>
              <Text className="text-lg font-light text-gray-900 mb-2">No Properties Yet</Text>
              <Text className="text-sm font-light text-gray-500 text-center px-8">
                Add your first PG property to start managing rooms and tenants
              </Text>
            </View>
          ) : (
            /* Property List */
            <View className="mb-8">
              {pgs.map((pg) => (
                <View
                  key={pg.id}
                  className="bg-white border border-gray-200 rounded-lg p-5 mb-4"
                >
                  <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-1">
                      <Text className="text-lg font-medium text-gray-900 mb-1">
                        {pg.name}
                      </Text>
                      <Text className="text-sm font-light text-gray-500">
                        {pg.location}
                      </Text>
                    </View>
                    <View className="bg-gray-100 px-3 py-1 rounded">
                      <Text className="text-xs font-medium text-gray-700">Active</Text>
                    </View>
                  </View>

                  {pg.description && (
                    <Text className="text-sm text-gray-600 mb-4" numberOfLines={2}>
                      {pg.description}
                    </Text>
                  )}

                  {/* Room Stats */}
                  <View className="flex-row border-t border-gray-100 pt-3 mb-3">
                    <View className="flex-1">
                      <Text className="text-xs font-light text-gray-500">Total Rooms</Text>
                      <Text className="text-base font-medium text-gray-900">0</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs font-light text-gray-500">Occupied</Text>
                      <Text className="text-base font-medium text-gray-900">0</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs font-light text-gray-500">Vacant</Text>
                      <Text className="text-base font-medium text-gray-900">0</Text>
                    </View>
                  </View>

                  {/* Action Buttons */}
                  <View className="flex-row">
                    <TouchableOpacity className="flex-1 bg-gray-900 rounded-lg py-3 items-center mr-2">
                      <Text className="text-white text-sm font-medium">Manage Rooms</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-1 bg-white border border-gray-200 rounded-lg py-3 items-center ml-2">
                      <Text className="text-gray-900 text-sm font-medium">View Details</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};
