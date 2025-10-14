import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, ActivityIndicator } from 'react-native';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase, PG } from '../../../config/supabase';
import { AddPropertyPage } from '../AddPropertyPage';
import { EditPropertyPage } from '../EditPropertyPage';

export const DashboardTab: React.FC = () => {
  const { ownerProfile } = useAuth();
  const [pgCount, setPgCount] = useState(0);
  const [pgs, setPgs] = useState<PG[]>([]);
  const [selectedPG, setSelectedPG] = useState<PG | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [showEditProperty, setShowEditProperty] = useState(false);
  const [editingPG, setEditingPG] = useState<PG | null>(null);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
  const [incompleteProperties, setIncompleteProperties] = useState<PG[]>([]);
  const [hasIncompleteSetup, setHasIncompleteSetup] = useState(false);

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

        // Check for incomplete properties (missing essential details)
        const incomplete = (data || []).filter(pg => 
          !pg.address || 
          !pg.city || 
          !pg.state || 
          !pg.pin_code || 
          !pg.type
        );
        
        setIncompleteProperties(incomplete);
        setHasIncompleteSetup(incomplete.length > 0);

        // Check if this is a first-time user (no properties and account created recently)
        const accountAge = ownerProfile?.created_at ? 
          (new Date().getTime() - new Date(ownerProfile.created_at).getTime()) / (1000 * 60 * 60 * 24) : 0;
        
        setIsFirstTimeUser((count || 0) === 0 && accountAge < 7); // First week and no properties

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

  const handlePropertyAdded = () => {
    fetchPGs(); // Refresh the PG list
  };

  const handleEditPG = (pg: PG) => {
    setEditingPG(pg);
    setShowEditProperty(true);
    setShowDropdown(false);
  };

  const handlePropertyUpdated = () => {
    fetchPGs(); // Refresh the PG list
  };

  const handleSetupIncompleteProperty = () => {
    if (incompleteProperties.length > 0) {
      setEditingPG(incompleteProperties[0]); // Edit the first incomplete property
      setShowEditProperty(true);
    }
  };

  if (showAddProperty) {
    return (
      <AddPropertyPage
        onBack={() => setShowAddProperty(false)}
        onPropertyAdded={handlePropertyAdded}
      />
    );
  }

  if (showEditProperty && editingPG) {
    return (
      <EditPropertyPage
        pg={editingPG}
        onBack={() => {
          setShowEditProperty(false);
          setEditingPG(null);
        }}
        onPropertyUpdated={handlePropertyUpdated}
      />
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-8 pt-16 pb-6">
        <View className="flex-row items-start justify-between">
          <View className="flex-1">
            <Text className="mb-2 text-2xl font-semibold text-gray-900">
              {isFirstTimeUser ? `Welcome, ${ownerProfile?.name}!` : `Welcome back, ${ownerProfile?.name}`}
            </Text>
            <Text className="text-sm font-light text-gray-500">
              {isFirstTimeUser ? 'Let\'s set up your first PG property' : ownerProfile?.email}
            </Text>
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
                  <Text className="text-xs text-gray-500" numberOfLines={1}>{selectedPG.city}, {selectedPG.state}</Text>
                </View>
              ) : (
                <Text className="text-sm text-gray-500">Select Property</Text>
              )}
              <Text className="absolute top-2 right-2 text-gray-400 text-xs">▼</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>


      {/* Stats Cards or Setup Card */}
      <View className="mb-6 px-8">
        {pgCount === 0 ? (
          /* Setup Your PG Card - Enhanced for First Time Users */
          <TouchableOpacity 
            className="mb-4 rounded-lg p-6"
            style={{ 
              backgroundColor: isFirstTimeUser ? '#3B82F6' : '#6B7280',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4
            }}
            onPress={() => setShowAddProperty(true)}
          >
            <View className="items-center">
              <Text className="mb-3 text-3xl">{isFirstTimeUser ? '🎉' : '🏠'}</Text>
              <Text className="mb-2 text-xl font-semibold text-white text-center">
                {isFirstTimeUser ? 'Welcome! Set Up Your First PG' : 'Set Up Your PG'}
              </Text>
              <Text className="mb-4 text-sm text-center" style={{ color: isFirstTimeUser ? '#DBEAFE' : '#D1D5DB' }}>
                {isFirstTimeUser 
                  ? 'Welcome to PG Manager! Let\'s get you started by adding your first property. You\'ll be able to manage tenants, rooms, and payments in no time.'
                  : 'Get started by adding your first PG property and start managing tenants, rooms, and payments.'
                }
              </Text>
              <View className="rounded-lg bg-white px-6 py-3">
                <Text className="text-sm font-semibold" style={{ color: isFirstTimeUser ? '#3B82F6' : '#6B7280' }}>
                  {isFirstTimeUser ? '🚀 Get Started →' : 'Add Property →'}
                </Text>
              </View>
              {isFirstTimeUser && (
                <Text className="mt-3 text-xs text-center" style={{ color: '#DBEAFE' }}>
                  ✨ This will only take 2 minutes
                </Text>
              )}
            </View>
          </TouchableOpacity>
        ) : hasIncompleteSetup ? (
          /* Incomplete Setup Card */
          <TouchableOpacity 
            className="mb-4 rounded-lg p-6"
            style={{ 
              backgroundColor: '#F59E0B',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4
            }}
            onPress={handleSetupIncompleteProperty}
          >
            <View className="items-center">
              <Text className="mb-3 text-3xl">⚠️</Text>
              <Text className="mb-2 text-xl font-semibold text-white text-center">
                Complete Your PG Setup
              </Text>
              <Text className="mb-4 text-sm text-center text-amber-100">
                Your property "{incompleteProperties[0]?.name}" is missing important details. Complete the setup to start accepting tenants and managing your PG effectively.
              </Text>
              <View className="rounded-lg bg-white px-6 py-3">
                <Text className="text-sm font-semibold text-amber-600">
                  🔧 Complete Setup →
                </Text>
              </View>
              <Text className="mt-3 text-xs text-center text-amber-100">
                Missing: {incompleteProperties[0] && [
                  !incompleteProperties[0].address && 'Address',
                  !incompleteProperties[0].city && 'City', 
                  !incompleteProperties[0].state && 'State',
                  !incompleteProperties[0].pin_code && 'Pin Code',
                  !incompleteProperties[0].type && 'PG Type'
                ].filter(Boolean).join(', ')}
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          /* Regular Stats Cards */
          <>
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
          </>
        )}
      </View>

      {/* Quick Actions */}
      {pgCount > 0 && !hasIncompleteSetup && (
        <View className="mb-6 px-8">
          <Text className="mb-4 text-lg font-medium text-gray-900">Quick Actions</Text>

          <TouchableOpacity 
            className="mb-3 rounded-lg bg-gray-900 p-5"
            onPress={() => setShowAddProperty(true)}
          >
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

        </View>
      )}

      {/* Incomplete Properties Warning */}
      {hasIncompleteSetup && pgCount > 0 && (
        <View className="mb-6 px-8">
          <Text className="mb-4 text-lg font-medium text-gray-900">Action Required</Text>
          
          <View className="mb-4 rounded-lg border-l-4 border-amber-500 bg-amber-50 p-4">
            <View className="flex-row items-start">
              <Text className="mr-3 text-lg">⚠️</Text>
              <View className="flex-1">
                <Text className="mb-1 text-base font-medium text-amber-800">
                  {incompleteProperties.length} Property Setup Incomplete
                </Text>
                <Text className="mb-3 text-sm text-amber-700">
                  Complete your property details to start managing tenants and payments effectively.
                </Text>
                <TouchableOpacity
                  className="rounded-lg bg-amber-600 px-4 py-2 self-start"
                  onPress={handleSetupIncompleteProperty}
                >
                  <Text className="text-sm font-medium text-white">Complete Setup</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          
          {/* Show other quick actions for complete properties */}
          {pgs.filter(pg => 
            pg.address && pg.city && pg.state && pg.pin_code && pg.type
          ).length > 0 && (
            <>
              <TouchableOpacity 
                className="mb-3 rounded-lg bg-gray-900 p-5"
                onPress={() => setShowAddProperty(true)}
              >
                <Text className="mb-1 text-base font-medium text-white">Add New Property</Text>
                <Text className="text-sm font-light text-gray-300">List another PG property</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}

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
                      <View key={item.id} className="border-b border-gray-100">
                        <TouchableOpacity
                          className="p-4"
                          onPress={() => {
                            handlePGSelect(item);
                          }}>
                          <Text className="text-base font-medium text-gray-900">{item.name}</Text>
                          <Text className="text-sm text-gray-500">{item.city}, {item.state}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          className="border-t border-gray-100 px-4 py-2 bg-gray-50"
                          onPress={() => handleEditPG(item)}
                        >
                          <Text className="text-sm font-medium text-blue-600">✏️ Edit Property</Text>
                        </TouchableOpacity>
                      </View>
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
