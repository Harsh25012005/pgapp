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
  total_floors: number;
  total_rooms: number;
  total_ac_rooms: number;
  total_non_ac_rooms: number;
}

export const EditPropertyPage: React.FC<EditPropertyPageProps> = ({ pg, onBack, onPropertyUpdated }) => {
  const { ownerProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [formData, setFormData] = useState({
    name: pg.name || '',
    location: pg.location || '',
    genderPreference: 'both',
    acRoomRent: '',
    nonAcRoomRent: '',
    totalFloors: '',
    totalRooms: '',
    totalAcRooms: '',
    totalNonAcRooms: '',
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
        .eq('pg_id', pg.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw error;
      }

      if (data) {
        setFormData(prev => ({
          ...prev,
          totalFloors: data.total_floors ? data.total_floors.toString() : '',
          totalRooms: data.total_rooms ? data.total_rooms.toString() : '',
          totalAcRooms: data.total_ac_rooms ? data.total_ac_rooms.toString() : '',
          totalNonAcRooms: data.total_non_ac_rooms ? data.total_non_ac_rooms.toString() : '',
        }));
      }

      // Also fetch PG data to get rent information
      const { data: pgData, error: pgDataError } = await supabase
        .from('pgs')
        .select('gender_preference, ac_room_rent, non_ac_room_rent')
        .eq('id', pg.id)
        .single();

      if (pgDataError) {
        console.error('Error fetching PG data:', pgDataError);
      } else if (pgData) {
        setFormData(prev => ({
          ...prev,
          genderPreference: pgData.gender_preference || 'both',
          acRoomRent: pgData.ac_room_rent ? pgData.ac_room_rent.toString() : '',
          nonAcRoomRent: pgData.non_ac_room_rent ? pgData.non_ac_room_rent.toString() : '',
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
    if (!formData.location.trim()) {
      Alert.alert('Error', 'Please enter location');
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
          location: formData.location.trim(),
          gender_preference: formData.genderPreference,
          ac_room_rent: formData.acRoomRent ? parseFloat(formData.acRoomRent) : null,
          non_ac_room_rent: formData.nonAcRoomRent ? parseFloat(formData.nonAcRoomRent) : null,
        })
        .eq('id', pg.id);

      if (pgError) throw pgError;

      // Check if metadata exists
      const { data: existingMetadata, error: checkError } = await supabase
        .from('pgs_metadata')
        .select('id')
        .eq('pg_id', pg.id)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      const metadataPayload = {
        pg_id: pg.id,
        total_floors: formData.totalFloors ? parseInt(formData.totalFloors) : null,
        total_rooms: formData.totalRooms ? parseInt(formData.totalRooms) : null,
        total_ac_rooms: formData.totalAcRooms ? parseInt(formData.totalAcRooms) : null,
        total_non_ac_rooms: formData.totalNonAcRooms ? parseInt(formData.totalNonAcRooms) : null,
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

        {/* Location */}
        <View className="mb-6">
          <Text className="mb-2 text-base font-medium text-gray-900">Location *</Text>
          <TextInput
            className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900"
            placeholder="Enter location (e.g., Koramangala, Bangalore)"
            value={formData.location}
            onChangeText={(value) => handleInputChange('location', value)}
            editable={!loading}
          />
        </View>

        {/* Gender Preference */}
        <View className="mb-6">
          <Text className="mb-4 text-base font-medium text-gray-900">Gender Preference</Text>
          
          <View className="flex-row flex-wrap">
            {[
              { key: 'girls', label: 'Girls Only', color: 'pink' },
              { key: 'boys', label: 'Boys Only', color: 'blue' },
              { key: 'both', label: 'Both (Co-ed)', color: 'green' },
            ].map((option) => (
              <TouchableOpacity
                key={option.key}
                className={`mb-3 mr-3 rounded-lg border px-4 py-3 ${
                  formData.genderPreference === option.key
                    ? `border-${option.color}-500 bg-${option.color}-50`
                    : 'border-gray-300 bg-white'
                }`}
                onPress={() => handleInputChange('genderPreference', option.key)}
                disabled={loading}
              >
                <Text className={`text-sm font-medium ${
                  formData.genderPreference === option.key ? `text-${option.color}-700` : 'text-gray-700'
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
          
          <View className="mb-4">
            <Text className="mb-2 text-sm font-medium text-gray-700">Total Floors</Text>
            <TextInput
              className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900"
              placeholder="Enter total number of floors"
              value={formData.totalFloors}
              onChangeText={(value) => handleInputChange('totalFloors', value)}
              keyboardType="numeric"
              editable={!loading}
            />
          </View>

          <View className="mb-4">
            <Text className="mb-2 text-sm font-medium text-gray-700">Total Rooms</Text>
            <TextInput
              className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900"
              placeholder="Enter total number of rooms"
              value={formData.totalRooms}
              onChangeText={(value) => handleInputChange('totalRooms', value)}
              keyboardType="numeric"
              editable={!loading}
            />
          </View>

          <View className="mb-4">
            <Text className="mb-2 text-sm font-medium text-gray-700">Total AC Rooms</Text>
            <TextInput
              className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900"
              placeholder="Enter number of AC rooms"
              value={formData.totalAcRooms}
              onChangeText={(value) => handleInputChange('totalAcRooms', value)}
              keyboardType="numeric"
              editable={!loading}
            />
          </View>

          <View className="mb-4">
            <Text className="mb-2 text-sm font-medium text-gray-700">Total Non-AC Rooms</Text>
            <TextInput
              className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900"
              placeholder="Enter number of non-AC rooms"
              value={formData.totalNonAcRooms}
              onChangeText={(value) => handleInputChange('totalNonAcRooms', value)}
              keyboardType="numeric"
              editable={!loading}
            />
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
