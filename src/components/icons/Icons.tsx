import React from 'react';
import { View, Text } from 'react-native';

interface IconProps {
  size?: number;
  color?: string;
  isActive?: boolean;
}

// Home/Dashboard Icon - Simple house shape
export const HomeIcon: React.FC<IconProps> = ({ size = 24, color = '#000', isActive = false }) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <View
      style={{
        width: size * 0.75,
        height: size * 0.75,
        borderWidth: isActive ? 2.5 : 2,
        borderColor: color,
        borderTopWidth: 0,
        position: 'relative',
      }}
    >
      <View
        style={{
          position: 'absolute',
          top: -size * 0.35,
          left: -size * 0.05,
          width: 0,
          height: 0,
          borderLeftWidth: size * 0.4,
          borderRightWidth: size * 0.4,
          borderBottomWidth: size * 0.35,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: color,
        }}
      />
    </View>
  </View>
);

// Tenant/Users Icon - Two circles representing people
export const UsersIcon: React.FC<IconProps> = ({ size = 24, color = '#000', isActive = false }) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
      <View
        style={{
          width: size * 0.35,
          height: size * 0.35,
          borderRadius: size * 0.175,
          borderWidth: isActive ? 2.5 : 2,
          borderColor: color,
          marginRight: size * 0.1,
        }}
      />
      <View
        style={{
          width: size * 0.35,
          height: size * 0.35,
          borderRadius: size * 0.175,
          borderWidth: isActive ? 2.5 : 2,
          borderColor: color,
        }}
      />
    </View>
  </View>
);

// Room/Building Icon - Rectangle with windows
export const BuildingIcon: React.FC<IconProps> = ({ size = 24, color = '#000', isActive = false }) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <View
      style={{
        width: size * 0.65,
        height: size * 0.8,
        borderWidth: isActive ? 2.5 : 2,
        borderColor: color,
        borderRadius: 3,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: size * 0.1 }}>
        <View
          style={{
            width: size * 0.12,
            height: size * 0.12,
            backgroundColor: color,
          }}
        />
        <View
          style={{
            width: size * 0.12,
            height: size * 0.12,
            backgroundColor: color,
          }}
        />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: size * 0.08 }}>
        <View
          style={{
            width: size * 0.12,
            height: size * 0.12,
            backgroundColor: color,
          }}
        />
        <View
          style={{
            width: size * 0.12,
            height: size * 0.12,
            backgroundColor: color,
          }}
        />
      </View>
    </View>
  </View>
);

// Payment/Credit Card Icon - Rectangle with line
export const CreditCardIcon: React.FC<IconProps> = ({ size = 24, color = '#000', isActive = false }) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <View
      style={{
        width: size * 0.8,
        height: size * 0.55,
        borderWidth: isActive ? 2.5 : 2,
        borderColor: color,
        borderRadius: 3,
      }}
    >
      <View
        style={{
          width: '100%',
          height: size * 0.12,
          backgroundColor: color,
          marginTop: size * 0.08,
        }}
      />
    </View>
  </View>
);

// Grid Icon - Four squares
export const GridIcon: React.FC<IconProps> = ({ size = 24, color = '#000', isActive = false }) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{ flexDirection: 'row' }}>
      <View style={{ marginRight: size * 0.08 }}>
        <View
          style={{
            width: size * 0.35,
            height: size * 0.35,
            borderWidth: isActive ? 2.5 : 2,
            borderColor: color,
            borderRadius: 2,
            marginBottom: size * 0.08,
          }}
        />
        <View
          style={{
            width: size * 0.35,
            height: size * 0.35,
            borderWidth: isActive ? 2.5 : 2,
            borderColor: color,
            borderRadius: 2,
          }}
        />
      </View>
      <View>
        <View
          style={{
            width: size * 0.35,
            height: size * 0.35,
            borderWidth: isActive ? 2.5 : 2,
            borderColor: color,
            borderRadius: 2,
            marginBottom: size * 0.08,
          }}
        />
        <View
          style={{
            width: size * 0.35,
            height: size * 0.35,
            borderWidth: isActive ? 2.5 : 2,
            borderColor: color,
            borderRadius: 2,
          }}
        />
      </View>
    </View>
  </View>
);
