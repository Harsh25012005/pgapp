import React from 'react';
import { View } from 'react-native';

interface IconProps {
  size?: number;
  color?: string;
  isActive?: boolean;
}

// Bell Icon - For notifications
export const BellIcon: React.FC<IconProps> = ({ size = 24, color = '#000', isActive = false }) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{ alignItems: 'center' }}>
      <View
        style={{
          width: size * 0.6,
          height: size * 0.5,
          borderWidth: isActive ? 2.5 : 2,
          borderColor: color,
          borderTopLeftRadius: size * 0.3,
          borderTopRightRadius: size * 0.3,
          borderBottomWidth: 0,
        }}
      />
      <View
        style={{
          width: size * 0.7,
          height: size * 0.08,
          backgroundColor: color,
          borderRadius: size * 0.04,
        }}
      />
      <View
        style={{
          width: size * 0.12,
          height: size * 0.12,
          backgroundColor: color,
          borderRadius: size * 0.06,
          marginTop: size * 0.05,
        }}
      />
    </View>
  </View>
);

// Settings Icon - Gear shape
export const SettingsIcon: React.FC<IconProps> = ({ size = 24, color = '#000', isActive = false }) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{ position: 'relative' }}>
      <View
        style={{
          width: size * 0.7,
          height: size * 0.7,
          borderWidth: isActive ? 2.5 : 2,
          borderColor: color,
          borderRadius: size * 0.1,
          transform: [{ rotate: '45deg' }],
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: size * 0.2,
          left: size * 0.2,
          width: size * 0.3,
          height: size * 0.3,
          borderWidth: isActive ? 2.5 : 2,
          borderColor: color,
          borderRadius: size * 0.15,
        }}
      />
    </View>
  </View>
);

// Profile Icon - Person silhouette
export const ProfileIcon: React.FC<IconProps> = ({ size = 24, color = '#000', isActive = false }) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{ alignItems: 'center' }}>
      <View
        style={{
          width: size * 0.35,
          height: size * 0.35,
          borderRadius: size * 0.175,
          borderWidth: isActive ? 2.5 : 2,
          borderColor: color,
          marginBottom: size * 0.05,
        }}
      />
      <View
        style={{
          width: size * 0.6,
          height: size * 0.4,
          borderTopLeftRadius: size * 0.3,
          borderTopRightRadius: size * 0.3,
          borderWidth: isActive ? 2.5 : 2,
          borderColor: color,
          borderBottomWidth: 0,
        }}
      />
    </View>
  </View>
);

// Search Icon - Magnifying glass
export const SearchIcon: React.FC<IconProps> = ({ size = 24, color = '#000', isActive = false }) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{ position: 'relative' }}>
      <View
        style={{
          width: size * 0.5,
          height: size * 0.5,
          borderRadius: size * 0.25,
          borderWidth: isActive ? 2.5 : 2,
          borderColor: color,
        }}
      />
      <View
        style={{
          position: 'absolute',
          bottom: -size * 0.15,
          right: -size * 0.15,
          width: size * 0.25,
          height: isActive ? 2.5 : 2,
          backgroundColor: color,
          transform: [{ rotate: '45deg' }],
          borderRadius: 1,
        }}
      />
    </View>
  </View>
);

// Calendar Icon - For scheduling
export const CalendarIcon: React.FC<IconProps> = ({ size = 24, color = '#000', isActive = false }) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <View
      style={{
        width: size * 0.75,
        height: size * 0.65,
        borderWidth: isActive ? 2.5 : 2,
        borderColor: color,
        borderRadius: 3,
      }}
    >
      <View
        style={{
          width: '100%',
          height: size * 0.15,
          backgroundColor: color,
          borderTopLeftRadius: 1,
          borderTopRightRadius: 1,
        }}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: size * 0.08 }}>
        <View
          style={{
            width: size * 0.08,
            height: size * 0.08,
            backgroundColor: color,
            borderRadius: size * 0.04,
          }}
        />
        <View
          style={{
            width: size * 0.08,
            height: size * 0.08,
            backgroundColor: color,
            borderRadius: size * 0.04,
          }}
        />
        <View
          style={{
            width: size * 0.08,
            height: size * 0.08,
            backgroundColor: color,
            borderRadius: size * 0.04,
          }}
        />
      </View>
    </View>
  </View>
);

// Chart Icon - Bar chart for analytics
export const ChartIcon: React.FC<IconProps> = ({ size = 24, color = '#000', isActive = false }) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', width: size * 0.7 }}>
      <View
        style={{
          width: size * 0.12,
          height: size * 0.3,
          backgroundColor: color,
          borderRadius: isActive ? 2 : 1,
        }}
      />
      <View
        style={{
          width: size * 0.12,
          height: size * 0.5,
          backgroundColor: color,
          borderRadius: isActive ? 2 : 1,
        }}
      />
      <View
        style={{
          width: size * 0.12,
          height: size * 0.4,
          backgroundColor: color,
          borderRadius: isActive ? 2 : 1,
        }}
      />
      <View
        style={{
          width: size * 0.12,
          height: size * 0.6,
          backgroundColor: color,
          borderRadius: isActive ? 2 : 1,
        }}
      />
    </View>
  </View>
);
