# Owner Bottom Navigation - Documentation

## 🎯 Overview

The owner flow now includes a bottom navigation bar with 5 tabs for managing PG properties, tenants, rooms, payments, and more.

## 📱 Navigation Structure

### Bottom Navigation Tabs

1. **Dashboard** - Home screen with overview and quick actions
2. **Tenant** - Manage tenants and their details
3. **Room** - View and manage properties and rooms
4. **Payment** - Track payments and rent collection
5. **More** - Settings, profile, reports, and support

## 🎨 Design

### Icons
- Custom SVG icons (no emojis)
- Clean, minimal line icons
- Active state: Dark gray (#111827) with thicker stroke
- Inactive state: Light gray (#9CA3AF) with normal stroke

### Bottom Bar Style
- White background
- Top border (gray-200)
- Centered icons with labels
- Touch feedback on tap

## 📂 File Structure

```
src/
├── components/
│   └── icons/
│       └── Icons.tsx                    # Custom SVG icons
├── navigation/
│   └── OwnerBottomNav.tsx              # Bottom navigation component
└── screens/
    └── owner/
        ├── OwnerMainScreen.tsx          # Main container with tabs
        └── tabs/
            ├── DashboardTab.tsx         # Dashboard content
            ├── TenantTab.tsx            # Tenant management
            ├── RoomTab.tsx              # Room/Property management
            ├── PaymentTab.tsx           # Payment tracking
            └── MoreTab.tsx              # Settings and more
```

## 🔧 Components

### 1. Icons Component (`Icons.tsx`)

Custom SVG icons using `react-native-svg`:

- `HomeIcon` - Dashboard tab
- `UsersIcon` - Tenant tab
- `BuildingIcon` - Room tab
- `CreditCardIcon` - Payment tab
- `GridIcon` - More tab

**Props:**
- `size?: number` - Icon size (default: 24)
- `color?: string` - Icon color (default: '#000')
- `strokeWidth?: number` - Stroke width (default: 2)

### 2. OwnerBottomNav (`OwnerBottomNav.tsx`)

Bottom navigation bar component.

**Props:**
- `activeTab: TabName` - Currently active tab
- `onTabChange: (tab: TabName) => void` - Tab change callback

**Tab Names:**
- `'dashboard'`
- `'tenant'`
- `'room'`
- `'payment'`
- `'more'`

### 3. OwnerMainScreen (`OwnerMainScreen.tsx`)

Main container that manages tab state and renders appropriate content.

**Features:**
- State management for active tab
- Conditional rendering of tab content
- Persistent bottom navigation

## 📋 Tab Features

### Dashboard Tab

**Features:**
- Welcome message with owner name
- Stats cards (Properties, Tenants, Vacant Rooms, Monthly Revenue)
- Quick actions (Add Property, Add Tenant, Collect Payment)
- Recent activity feed

**Stats Displayed:**
- Total Properties
- Total Tenants
- Vacant Rooms
- This Month Revenue

### Tenant Tab

**Features:**
- Search bar for tenants
- Stats (Active Tenants, Pending Dues)
- Add new tenant button
- Tenant list (empty state ready)

**Empty State:**
- Icon placeholder
- Helpful message
- Call to action

### Room Tab

**Features:**
- Property count display
- Pull-to-refresh functionality
- Add new property button
- Property list with details
- Room statistics per property
- Manage rooms and view details buttons

**Property Card Shows:**
- Property name and location
- Active status badge
- Description
- Room stats (Total, Occupied, Vacant)
- Action buttons

**Supabase Integration:**
- Fetches properties from `pgs` table
- Uses owner's `pg_ids` array
- Real-time refresh capability

### Payment Tab

**Features:**
- Month selector
- Payment summary (Expected, Received, Pending)
- Color-coded stats (green for received, red for pending)
- Quick actions (Collect Payment, Send Reminder)
- Payment history

**Summary Cards:**
- Total Expected (large display)
- Received (green background)
- Pending (red background)

### More Tab

**Sections:**

1. **Profile**
   - My Profile
   - Business Information
   - Change Password

2. **Settings**
   - Notifications
   - Privacy & Security
   - Payment Settings

3. **Reports**
   - Analytics
   - Financial Reports
   - Tenant Reports

4. **Support**
   - Help Center
   - Contact Support
   - Terms & Conditions
   - Privacy Policy

5. **Account**
   - Sign Out
   - App Version

## 🔄 Authentication Flow

```
Owner Sign In/Sign Up → OwnerMainScreen (Dashboard Tab)
```

The owner is automatically redirected to the main screen with the Dashboard tab active after successful authentication.

## 🎨 Styling

### Color Scheme
- Active tab: `#111827` (gray-900)
- Inactive tab: `#9CA3AF` (gray-400)
- Background: `#FFFFFF` (white)
- Border: `#E5E7EB` (gray-200)

### Typography
- Active label: `font-medium`
- Inactive label: `font-light`
- Font size: `text-xs` (12px)

### Spacing
- Bottom bar padding: `px-2 py-3`
- Icon-label gap: `mt-1`
- Tab item padding: `py-2`

## 📊 State Management

### Local State (OwnerMainScreen)
```typescript
const [activeTab, setActiveTab] = useState<TabName>('dashboard');
```

### Tab Content Rendering
```typescript
const renderTabContent = () => {
  switch (activeTab) {
    case 'dashboard': return <DashboardTab />;
    case 'tenant': return <TenantTab />;
    case 'room': return <RoomTab />;
    case 'payment': return <PaymentTab />;
    case 'more': return <MoreTab />;
  }
};
```

## 🔌 Integration with AuthContext

All tabs have access to:
- `ownerProfile` - Owner profile data
- `signOut()` - Sign out function
- `refreshProfile()` - Refresh profile data

## 🚀 Usage Example

```typescript
import { OwnerMainScreen } from './src/screens/owner/OwnerMainScreen';

// In App.tsx
if (session && userType === 'owner') {
  return <OwnerMainScreen />;
}
```

## 📱 User Experience

### Navigation
- Tap any tab to switch content
- Active tab is highlighted
- Smooth transitions between tabs
- Bottom bar always visible

### Visual Feedback
- Active state with darker color and bold text
- Touch opacity on tap
- Thicker stroke for active icon

### Performance
- Lazy rendering of tab content
- Efficient state management
- Minimal re-renders

## 🔮 Future Enhancements

### Planned Features

1. **Badge Notifications**
   - Show unread count on Tenant tab
   - Pending payment count on Payment tab
   - New messages on More tab

2. **Tab Persistence**
   - Remember last active tab
   - Restore tab on app restart

3. **Animations**
   - Smooth tab transitions
   - Slide animations for content
   - Icon animations on tap

4. **Deep Linking**
   - Direct navigation to specific tabs
   - URL-based navigation

5. **Gestures**
   - Swipe between tabs
   - Pull-to-refresh on all tabs

## 🧪 Testing Checklist

- [ ] All tabs render correctly
- [ ] Tab switching works smoothly
- [ ] Active state displays correctly
- [ ] Icons render properly
- [ ] Dashboard shows correct stats
- [ ] Room tab fetches properties
- [ ] Pull-to-refresh works on Room tab
- [ ] Sign out works from More tab
- [ ] Bottom bar stays fixed at bottom
- [ ] Touch feedback works on all tabs

## 📝 Notes

- Icons use `react-native-svg` library
- No emoji icons (as requested)
- Clean minimal design matching app theme
- All tabs have empty states ready
- Supabase integration in Room tab
- Ready for feature expansion

---

**Status:** ✅ Fully implemented and ready to use
**Last Updated:** 2025-10-05
