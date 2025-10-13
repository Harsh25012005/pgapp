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
  amenities: string[];
  boys_only: boolean;
  girls_only: boolean;
  property_type: string;
  furnishing_status: string;
  parking_available: boolean;
  wifi_available: boolean;
  ac_available: boolean;
  laundry_available: boolean;
  security_deposit: number;
  monthly_rent: number;
  electricity_charges: string;
  water_charges: string;
  food_provided: boolean;
  guest_allowed: boolean;
  smoking_allowed: boolean;
  pets_allowed: boolean;
  notice_period_days: number;
}

export const EditPropertyPage: React.FC<EditPropertyPageProps> = ({ pg, onBack, onPropertyUpdated }) => {
  const { ownerProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [formData, setFormData] = useState({
    name: pg.name || '',
    location: pg.location || '',
    address: pg.address || '',
    amenities: '',
    boysOnly: false,
    girlsOnly: false,
    propertyType: '',
    furnishingStatus: '',
    parkingAvailable: false,
    wifiAvailable: false,
    acAvailable: false,
    laundryAvailable: false,
    securityDeposit: '',
    monthlyRent: '',
    electricityCharges: 'included',
    waterCharges: 'included',
    foodProvided: false,
    guestAllowed: false,
    smokingAllowed: false,
    petsAllowed: false,
    noticePeriodDays: '30',
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
          amenities: data.amenities ? data.amenities.join(', ') : '',
          boysOnly: data.boys_only || false,
          girlsOnly: data.girls_only || false,
          propertyType: data.property_type || '',
          furnishingStatus: data.furnishing_status || '',
          parkingAvailable: data.parking_available || false,
          wifiAvailable: data.wifi_available || false,
          acAvailable: data.ac_available || false,
          laundryAvailable: data.laundry_available || false,
          securityDeposit: data.security_deposit ? data.security_deposit.toString() : '',
          monthlyRent: data.monthly_rent ? data.monthly_rent.toString() : '',
          electricityCharges: data.electricity_charges || 'included',
          waterCharges: data.water_charges || 'included',
          foodProvided: data.food_provided || false,
          guestAllowed: data.guest_allowed || false,
          smokingAllowed: data.smoking_allowed || false,
          petsAllowed: data.pets_allowed || false,
          noticePeriodDays: data.notice_period_days ? data.notice_period_days.toString() : '30',
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
      Alert.alert('Error', 'Please enter property name');
      return false;
    }
    if (!formData.location.trim()) {
      Alert.alert('Error', 'Please enter location');
      return false;
    }
    if (!formData.address.trim()) {
      Alert.alert('Error', 'Please enter address');
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
          address: formData.address.trim(),
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
        amenities: formData.amenities.trim() ? [formData.amenities.trim()] : [],
        boys_only: formData.boysOnly,
        girls_only: formData.girlsOnly,
        property_type: formData.propertyType.trim() || null,
        furnishing_status: formData.furnishingStatus.trim() || null,
        parking_available: formData.parkingAvailable,
        wifi_available: formData.wifiAvailable,
        ac_available: formData.acAvailable,
        laundry_available: formData.laundryAvailable,
        security_deposit: formData.securityDeposit ? parseFloat(formData.securityDeposit) : null,
        monthly_rent: formData.monthlyRent ? parseFloat(formData.monthlyRent) : null,
        electricity_charges: formData.electricityCharges,
        water_charges: formData.waterCharges,
        food_provided: formData.foodProvided,
        guest_allowed: formData.guestAllowed,
        smoking_allowed: formData.smokingAllowed,
        pets_allowed: formData.petsAllowed,
        notice_period_days: parseInt(formData.noticePeriodDays) || 30,
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
        {/* Property Name */}
        <View className="mb-6">
          <Text className="mb-2 text-base font-medium text-gray-900">Property Name *</Text>
          <TextInput
            className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900"
            placeholder="Enter property name"
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

        {/* Address */}
        <View className="mb-6">
          <Text className="mb-2 text-base font-medium text-gray-900">Address *</Text>
          <TextInput
            className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900"
            placeholder="Enter full address"
            value={formData.address}
            onChangeText={(value) => handleInputChange('address', value)}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            editable={!loading}
          />
        </View>

        {/* Amenities */}
        <View className="mb-6">
          <Text className="mb-2 text-base font-medium text-gray-900">Amenities</Text>
          <TextInput
            className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900"
            placeholder="Enter amenities (e.g., WiFi, AC, Parking, Laundry)"
            value={formData.amenities}
            onChangeText={(value) => handleInputChange('amenities', value)}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            editable={!loading}
          />
        </View>

        {/* Gender Restrictions */}
        <View className="mb-6">
          <Text className="mb-4 text-base font-medium text-gray-900">Gender Restrictions</Text>
          
          <TouchableOpacity
            className={`mb-3 rounded-lg border p-4 ${
              formData.girlsOnly
                ? 'border-pink-500 bg-pink-50'
                : 'border-gray-300 bg-white'
            }`}
            onPress={() => handleInputChange('girlsOnly', !formData.girlsOnly)}
            disabled={loading}
          >
            <View className="flex-row items-center justify-between">
              <View>
                <Text className={`text-base font-medium ${
                  formData.girlsOnly ? 'text-pink-700' : 'text-gray-900'
                }`}>
                  Girls Only
                </Text>
                <Text className={`text-sm ${
                  formData.girlsOnly ? 'text-pink-600' : 'text-gray-500'
                }`}>
                  This property is exclusively for female tenants
                </Text>
              </View>
              <View className={`h-6 w-6 rounded-full border-2 ${
                formData.girlsOnly
                  ? 'border-pink-500 bg-pink-500'
                  : 'border-gray-300 bg-white'
              }`}>
                {formData.girlsOnly && (
                  <Text className="text-center text-xs text-white leading-5">✓</Text>
                )}
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className={`mb-3 rounded-lg border p-4 ${
              formData.boysOnly
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 bg-white'
            }`}
            onPress={() => handleInputChange('boysOnly', !formData.boysOnly)}
            disabled={loading}
          >
            <View className="flex-row items-center justify-between">
              <View>
                <Text className={`text-base font-medium ${
                  formData.boysOnly ? 'text-blue-700' : 'text-gray-900'
                }`}>
                  Boys Only
                </Text>
                <Text className={`text-sm ${
                  formData.boysOnly ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  This property is exclusively for male tenants
                </Text>
              </View>
              <View className={`h-6 w-6 rounded-full border-2 ${
                formData.boysOnly
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-300 bg-white'
              }`}>
                {formData.boysOnly && (
                  <Text className="text-center text-xs text-white leading-5">✓</Text>
                )}
              </View>
            </View>
          </TouchableOpacity>

          {!formData.girlsOnly && !formData.boysOnly && (
            <View className="rounded-lg border border-gray-300 bg-gray-50 p-4">
              <Text className="text-base font-medium text-gray-700">Co-ed Property</Text>
              <Text className="text-sm text-gray-600">
                This property accepts both male and female tenants
              </Text>
            </View>
          )}
        </View>

        {/* Property Details */}
        <View className="mb-6">
          <Text className="mb-4 text-base font-medium text-gray-900">Property Details</Text>
          
          <View className="mb-4">
            <Text className="mb-2 text-sm font-medium text-gray-700">Property Type</Text>
            <TextInput
              className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900"
              placeholder="e.g., Apartment, Villa, Hostel"
              value={formData.propertyType}
              onChangeText={(value) => handleInputChange('propertyType', value)}
              editable={!loading}
            />
          </View>

          <View className="mb-4">
            <Text className="mb-2 text-sm font-medium text-gray-700">Furnishing Status</Text>
            <TextInput
              className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900"
              placeholder="e.g., Fully Furnished, Semi Furnished, Unfurnished"
              value={formData.furnishingStatus}
              onChangeText={(value) => handleInputChange('furnishingStatus', value)}
              editable={!loading}
            />
          </View>
        </View>

        {/* Available Amenities */}
        <View className="mb-6">
          <Text className="mb-4 text-base font-medium text-gray-900">Available Amenities</Text>
          
          <View className="flex-row flex-wrap">
            {[
              { key: 'parkingAvailable', label: 'Parking' },
              { key: 'wifiAvailable', label: 'WiFi' },
              { key: 'acAvailable', label: 'AC' },
              { key: 'laundryAvailable', label: 'Laundry' },
            ].map((amenity) => (
              <TouchableOpacity
                key={amenity.key}
                className={`mb-3 mr-3 rounded-lg border px-4 py-2 ${
                  formData[amenity.key as keyof typeof formData]
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 bg-white'
                }`}
                onPress={() => handleInputChange(amenity.key, !formData[amenity.key as keyof typeof formData])}
                disabled={loading}
              >
                <Text className={`text-sm font-medium ${
                  formData[amenity.key as keyof typeof formData] ? 'text-green-700' : 'text-gray-700'
                }`}>
                  {amenity.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Financial Details */}
        <View className="mb-6">
          <Text className="mb-4 text-base font-medium text-gray-900">Financial Details</Text>
          
          <View className="mb-4">
            <Text className="mb-2 text-sm font-medium text-gray-700">Monthly Rent (₹)</Text>
            <TextInput
              className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900"
              placeholder="Enter monthly rent amount"
              value={formData.monthlyRent}
              onChangeText={(value) => handleInputChange('monthlyRent', value)}
              keyboardType="numeric"
              editable={!loading}
            />
          </View>

          <View className="mb-4">
            <Text className="mb-2 text-sm font-medium text-gray-700">Security Deposit (₹)</Text>
            <TextInput
              className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900"
              placeholder="Enter security deposit amount"
              value={formData.securityDeposit}
              onChangeText={(value) => handleInputChange('securityDeposit', value)}
              keyboardType="numeric"
              editable={!loading}
            />
          </View>

          <View className="mb-4">
            <Text className="mb-2 text-sm font-medium text-gray-700">Electricity Charges</Text>
            <TextInput
              className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900"
              placeholder="e.g., Included, Separate, Per Unit"
              value={formData.electricityCharges}
              onChangeText={(value) => handleInputChange('electricityCharges', value)}
              editable={!loading}
            />
          </View>

          <View className="mb-4">
            <Text className="mb-2 text-sm font-medium text-gray-700">Water Charges</Text>
            <TextInput
              className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900"
              placeholder="e.g., Included, Separate"
              value={formData.waterCharges}
              onChangeText={(value) => handleInputChange('waterCharges', value)}
              editable={!loading}
            />
          </View>
        </View>

        {/* Policies */}
        <View className="mb-6">
          <Text className="mb-4 text-base font-medium text-gray-900">Property Policies</Text>
          
          <View className="flex-row flex-wrap">
            {[
              { key: 'foodProvided', label: 'Food Provided' },
              { key: 'guestAllowed', label: 'Guests Allowed' },
              { key: 'smokingAllowed', label: 'Smoking Allowed' },
              { key: 'petsAllowed', label: 'Pets Allowed' },
            ].map((policy) => (
              <TouchableOpacity
                key={policy.key}
                className={`mb-3 mr-3 rounded-lg border px-4 py-2 ${
                  formData[policy.key as keyof typeof formData]
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 bg-white'
                }`}
                onPress={() => handleInputChange(policy.key, !formData[policy.key as keyof typeof formData])}
                disabled={loading}
              >
                <Text className={`text-sm font-medium ${
                  formData[policy.key as keyof typeof formData] ? 'text-blue-700' : 'text-gray-700'
                }`}>
                  {policy.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Notice Period */}
        <View className="mb-8">
          <Text className="mb-2 text-base font-medium text-gray-900">Notice Period (Days)</Text>
          <TextInput
            className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900"
            placeholder="Enter notice period in days (default: 30)"
            value={formData.noticePeriodDays}
            onChangeText={(value) => handleInputChange('noticePeriodDays', value)}
            keyboardType="numeric"
            editable={!loading}
          />
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
