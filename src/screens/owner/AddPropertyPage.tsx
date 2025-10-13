import React, { useState } from 'react';
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
import { supabase } from '../../config/supabase';

interface AddPropertyPageProps {
  onBack: () => void;
  onPropertyAdded: () => void;
}

export const AddPropertyPage: React.FC<AddPropertyPageProps> = ({ onBack, onPropertyAdded }) => {
  const { ownerProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    genderPreference: 'both',
    acRoomRent: '',
    nonAcRoomRent: '',
    totalFloors: '',
    totalRooms: '',
    totalAcRooms: '',
    totalNonAcRooms: '',
  });

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
      // First, insert the main PG record
      const { data: pgData, error: pgError } = await supabase
        .from('pgs')
        .insert([
          {
            owner_id: ownerProfile.id,
            name: formData.name.trim(),
            location: formData.location.trim(),
            gender_preference: formData.genderPreference,
            ac_room_rent: formData.acRoomRent ? parseFloat(formData.acRoomRent) : null,
            non_ac_room_rent: formData.nonAcRoomRent ? parseFloat(formData.nonAcRoomRent) : null,
          },
        ])
        .select()
        .single();

      if (pgError) throw pgError;

      // Then, insert the metadata
      const { error: metadataError } = await supabase
        .from('pgs_metadata')
        .insert([
          {
            pg_id: pgData.id,
            total_floors: formData.totalFloors ? parseInt(formData.totalFloors) : null,
            total_rooms: formData.totalRooms ? parseInt(formData.totalRooms) : null,
            total_ac_rooms: formData.totalAcRooms ? parseInt(formData.totalAcRooms) : null,
            total_non_ac_rooms: formData.totalNonAcRooms ? parseInt(formData.totalNonAcRooms) : null,
          },
        ]);

      if (metadataError) throw metadataError;

      Alert.alert('Success', 'Property added successfully!', [
        {
          text: 'OK',
          onPress: () => {
            onPropertyAdded();
            onBack();
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-8 pt-16 pb-6">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity onPress={onBack} className="p-2 -ml-2">
            <Text className="text-lg text-gray-600">← Back</Text>
          </TouchableOpacity>
          <Text className="text-xl font-semibold text-gray-900">Add New Property</Text>
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
              <Text className="ml-2 text-base font-medium text-white">Adding Property...</Text>
            </View>
          ) : (
            <Text className="text-center text-base font-medium text-white">Add Property</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
