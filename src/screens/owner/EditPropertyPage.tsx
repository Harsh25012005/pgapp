import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, PG } from '../../config/supabase';

interface EditPropertyPageProps {
  pg: PG;
  onBack: () => void;
  onPropertyUpdated: () => void;
}

interface PGMetadata {
  total_ac_rooms: number;
  ac_room_rent: number;
  total_non_ac_rooms: number;
  non_ac_room_rent: number;
  total_beds: number;
  available_beds: number;
  food_included: boolean;
  wifi_available: boolean;
}

export const EditPropertyPage: React.FC<EditPropertyPageProps> = ({ pg, onBack, onPropertyUpdated }) => {
  const { ownerProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [formData, setFormData] = useState({
    name: pg.name || '',
    address: pg.address || '',
    city: pg.city || '',
    state: pg.state || '',
    pinCode: pg.pin_code || '',
    type: pg.type || 'co-ed',
    mapLocation: pg.map_location || '',
    totalFloors: pg.total_floors ? pg.total_floors.toString() : '',
    totalRooms: pg.total_rooms ? pg.total_rooms.toString() : '',
    totalAcRooms: '',
    acRoomRent: '',
    totalNonAcRooms: '',
    nonAcRoomRent: '',
    totalBeds: '',
    availableBeds: '',
    foodIncluded: false,
    wifiAvailable: false,
  });

  useEffect(() => {
    fetchPGMetadata();
  }, [pg.id]);

  const fetchPGMetadata = async () => {
    try {
      setLoadingData(true);
      const { data, error } = await supabase
        .from('pgs_metadata')
        .select('*')
        .eq('property_id', pg.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw error;
      }

      if (data) {
        setFormData(prev => ({
          ...prev,
          totalAcRooms: data.total_ac_rooms ? data.total_ac_rooms.toString() : '',
          acRoomRent: data.ac_room_rent ? data.ac_room_rent.toString() : '',
          totalNonAcRooms: data.total_non_ac_rooms ? data.total_non_ac_rooms.toString() : '',
          nonAcRoomRent: data.non_ac_room_rent ? data.non_ac_room_rent.toString() : '',
          totalBeds: data.total_beds ? data.total_beds.toString() : '',
          availableBeds: data.available_beds ? data.available_beds.toString() : '',
          foodIncluded: data.food_included || false,
          wifiAvailable: data.wifi_available || false,
        }));
      }

    } catch (error: any) {
      Alert.alert('Error', 'Failed to load property metadata');
    } finally {
      setLoadingData(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter PG name');
      return false;
    }
    if (!formData.address.trim()) {
      Alert.alert('Error', 'Please enter full address');
      return false;
    }
    if (!formData.city.trim()) {
      Alert.alert('Error', 'Please enter city');
      return false;
    }
    if (!formData.state.trim()) {
      Alert.alert('Error', 'Please enter state');
      return false;
    }
    if (!formData.pinCode.trim()) {
      Alert.alert('Error', 'Please enter pin code');
      return false;
    }
    if (!formData.acRoomRent.trim() && !formData.nonAcRoomRent.trim()) {
      Alert.alert('Error', 'Please enter at least one room rent (AC or Non-AC)');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (!ownerProfile?.id) {
      Alert.alert('Error', 'Owner profile not found');
      return;
    }

    setLoading(true);

    try {
      // Update the main PG record
      const { error: pgError } = await supabase
        .from('pgs')
        .update({
          name: formData.name.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          pin_code: formData.pinCode.trim(),
          type: formData.type,
          map_location: formData.mapLocation.trim() || null,
          total_floors: formData.totalFloors ? parseInt(formData.totalFloors) : null,
          total_rooms: formData.totalRooms ? parseInt(formData.totalRooms) : null,
        })
        .eq('id', pg.id);

      if (pgError) throw pgError;

      // Check if metadata exists
      const { data: existingMetadata, error: checkError } = await supabase
        .from('pgs_metadata')
        .select('id')
        .eq('property_id', pg.id)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      const metadataPayload = {
        property_id: pg.id,
        total_ac_rooms: formData.totalAcRooms ? parseInt(formData.totalAcRooms) : null,
        ac_room_rent: formData.acRoomRent ? parseInt(formData.acRoomRent) : null,
        total_non_ac_rooms: formData.totalNonAcRooms ? parseInt(formData.totalNonAcRooms) : null,
        non_ac_room_rent: formData.nonAcRoomRent ? parseInt(formData.nonAcRoomRent) : null,
        total_beds: formData.totalBeds ? parseInt(formData.totalBeds) : null,
        available_beds: formData.availableBeds ? parseInt(formData.availableBeds) : null,
        food_included: formData.foodIncluded,
        wifi_available: formData.wifiAvailable,
      };

      if (existingMetadata) {
        // Update existing metadata
        const { error: metadataError } = await supabase
          .from('pgs_metadata')
          .update(metadataPayload)
          .eq('id', existingMetadata.id);

        if (metadataError) throw metadataError;
      } else {
        // Insert new metadata
        const { error: metadataError } = await supabase
          .from('pgs_metadata')
          .insert([metadataPayload]);

        if (metadataError) throw metadataError;
      }

      Alert.alert('Success', 'Property updated successfully!', [
        {
          text: 'OK',
          onPress: () => {
            onPropertyUpdated();
            onBack();
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update property');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#374151" />
        <Text className="mt-4 text-gray-600">Loading property data...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-8 pt-16 pb-6">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity onPress={onBack} className="p-2 -ml-2">
            <Text className="text-lg text-gray-600">← Back</Text>
          </TouchableOpacity>
          <Text className="text-xl font-semibold text-gray-900">Edit Property</Text>
          <View className="w-12" />
        </View>
      </View>

      {/* Form */}
      <View className="px-8">
        {/* PG Name */}
        <View className="mb-6">
          <Text className="mb-2 text-base font-medium text-gray-900">PG Name *</Text>
          <TextInput
            className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900"
            placeholder="Enter PG name"
            value={formData.name}
            onChangeText={(value) => handleInputChange('name', value)}
            editable={!loading}
          />
        </View>

        {/* Address */}
        <View className="mb-6">
          <Text className="mb-2 text-base font-medium text-gray-900">Full Address *</Text>
          <TextInput
            className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900"
            placeholder="Enter complete address"
            value={formData.address}
            onChangeText={(value) => handleInputChange('address', value)}
            editable={!loading}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* City, State, Pin Code Row */}
        <View className="mb-6">
          <View className="flex-row mb-4">
            <View className="flex-1 mr-2">
              <Text className="mb-2 text-base font-medium text-gray-900">City *</Text>
              <TextInput
                className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900"
                placeholder="City"
                value={formData.city}
                onChangeText={(value) => handleInputChange('city', value)}
                editable={!loading}
              />
            </View>
            <View className="flex-1 ml-2">
              <Text className="mb-2 text-base font-medium text-gray-900">State *</Text>
              <TextInput
                className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900"
                placeholder="State"
                value={formData.state}
                onChangeText={(value) => handleInputChange('state', value)}
                editable={!loading}
              />
            </View>
          </View>
          
          <View className="mb-4">
            <Text className="mb-2 text-base font-medium text-gray-900">Pin Code *</Text>
            <TextInput
              className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900"
              placeholder="Enter pin code"
              value={formData.pinCode}
              onChangeText={(value) => handleInputChange('pinCode', value)}
              keyboardType="numeric"
              editable={!loading}
            />
          </View>
        </View>

        {/* Map Location */}
        <View className="mb-6">
          <Text className="mb-2 text-base font-medium text-gray-900">Map Location (Optional)</Text>
          <TextInput
            className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900"
            placeholder="Google Maps link or coordinates"
            value={formData.mapLocation}
            onChangeText={(value) => handleInputChange('mapLocation', value)}
            editable={!loading}
          />
        </View>

        {/* PG Type */}
        <View className="mb-6">
          <Text className="mb-4 text-base font-medium text-gray-900">PG Type</Text>
          
          <View className="flex-row flex-wrap">
            {[
              { key: 'girls', label: 'Girls Only', color: 'pink' },
              { key: 'boys', label: 'Boys Only', color: 'blue' },
              { key: 'co-ed', label: 'Co-ed', color: 'green' },
            ].map((option) => (
              <TouchableOpacity
                key={option.key}
                className={`mb-3 mr-3 rounded-lg border px-4 py-3 ${
                  formData.type === option.key
                    ? `border-${option.color}-500 bg-${option.color}-50`
                    : 'border-gray-300 bg-white'
                }`}
                onPress={() => handleInputChange('type', option.key)}
                disabled={loading}
              >
                <Text className={`text-sm font-medium ${
                  formData.type === option.key ? `text-${option.color}-700` : 'text-gray-700'
                }`}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Room Rent Details */}
        <View className="mb-6">
          <Text className="mb-4 text-base font-medium text-gray-900">Room Rent Details</Text>
          
          <View className="mb-4">
            <Text className="mb-2 text-sm font-medium text-gray-700">AC Room Rent (₹/month)</Text>
            <TextInput
              className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900"
              placeholder="Enter AC room rent"
              value={formData.acRoomRent}
              onChangeText={(value) => handleInputChange('acRoomRent', value)}
              keyboardType="numeric"
              editable={!loading}
            />
          </View>

          <View className="mb-4">
            <Text className="mb-2 text-sm font-medium text-gray-700">Non-AC Room Rent (₹/month)</Text>
            <TextInput
              className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900"
              placeholder="Enter non-AC room rent"
              value={formData.nonAcRoomRent}
              onChangeText={(value) => handleInputChange('nonAcRoomRent', value)}
              keyboardType="numeric"
              editable={!loading}
            />
          </View>
        </View>

        {/* Property Structure Details */}
        <View className="mb-6">
          <Text className="mb-4 text-base font-medium text-gray-900">Property Structure Details</Text>
          
          <View className="flex-row mb-4">
            <View className="flex-1 mr-2">
              <Text className="mb-2 text-sm font-medium text-gray-700">Total Floors</Text>
              <TextInput
                className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900"
                placeholder="Floors"
                value={formData.totalFloors}
                onChangeText={(value) => handleInputChange('totalFloors', value)}
                keyboardType="numeric"
                editable={!loading}
              />
            </View>
            <View className="flex-1 ml-2">
              <Text className="mb-2 text-sm font-medium text-gray-700">Total Rooms</Text>
              <TextInput
                className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900"
                placeholder="Rooms"
                value={formData.totalRooms}
                onChangeText={(value) => handleInputChange('totalRooms', value)}
                keyboardType="numeric"
                editable={!loading}
              />
            </View>
          </View>

          <View className="flex-row mb-4">
            <View className="flex-1 mr-2">
              <Text className="mb-2 text-sm font-medium text-gray-700">AC Rooms</Text>
              <TextInput
                className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900"
                placeholder="AC rooms"
                value={formData.totalAcRooms}
                onChangeText={(value) => handleInputChange('totalAcRooms', value)}
                keyboardType="numeric"
                editable={!loading}
              />
            </View>
            <View className="flex-1 ml-2">
              <Text className="mb-2 text-sm font-medium text-gray-700">Non-AC Rooms</Text>
              <TextInput
                className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900"
                placeholder="Non-AC rooms"
                value={formData.totalNonAcRooms}
                onChangeText={(value) => handleInputChange('totalNonAcRooms', value)}
                keyboardType="numeric"
                editable={!loading}
              />
            </View>
          </View>

          <View className="flex-row mb-4">
            <View className="flex-1 mr-2">
              <Text className="mb-2 text-sm font-medium text-gray-700">Total Beds</Text>
              <TextInput
                className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900"
                placeholder="Total beds"
                value={formData.totalBeds}
                onChangeText={(value) => handleInputChange('totalBeds', value)}
                keyboardType="numeric"
                editable={!loading}
              />
            </View>
            <View className="flex-1 ml-2">
              <Text className="mb-2 text-sm font-medium text-gray-700">Available Beds</Text>
              <TextInput
                className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900"
                placeholder="Available beds"
                value={formData.availableBeds}
                onChangeText={(value) => handleInputChange('availableBeds', value)}
                keyboardType="numeric"
                editable={!loading}
              />
            </View>
          </View>
        </View>

        {/* Amenities */}
        <View className="mb-6">
          <Text className="mb-4 text-base font-medium text-gray-900">Amenities</Text>
          
          <View className="flex-row mb-3">
            <TouchableOpacity
              className={`flex-1 mr-2 rounded-lg border px-4 py-3 ${
                formData.foodIncluded
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 bg-white'
              }`}
              onPress={() => handleInputChange('foodIncluded', !formData.foodIncluded)}
              disabled={loading}
            >
              <Text className={`text-sm font-medium text-center ${
                formData.foodIncluded ? 'text-green-700' : 'text-gray-700'
              }`}>
                🍽️ Food Included
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className={`flex-1 ml-2 rounded-lg border px-4 py-3 ${
                formData.wifiAvailable
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 bg-white'
              }`}
              onPress={() => handleInputChange('wifiAvailable', !formData.wifiAvailable)}
              disabled={loading}
            >
              <Text className={`text-sm font-medium text-center ${
                formData.wifiAvailable ? 'text-blue-700' : 'text-gray-700'
              }`}>
                📶 Wi-Fi Available
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          className={`mb-8 rounded-lg p-4 ${
            loading ? 'bg-gray-400' : 'bg-gray-900'
          }`}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <View className="flex-row items-center justify-center">
              <ActivityIndicator size="small" color="white" />
              <Text className="ml-2 text-base font-medium text-white">Updating Property...</Text>
            </View>
          ) : (
            <Text className="text-center text-base font-medium text-white">Update Property</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
