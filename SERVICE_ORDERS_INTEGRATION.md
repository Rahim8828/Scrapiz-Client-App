# Service Orders Integration

## Overview
This document describes the integration of service bookings with the orders system, allowing users to view their service bookings in the Profile → Orders section alongside scrap pickup orders.

## Implementation Date
December 2024

## Files Modified

### 1. `data/orderData.ts`
**Changes:**
- Added `OrderType` enum: `'scrap' | 'service'`
- Added `ServiceOrderDetails` interface with fields:
  - `serviceName`: Name of the service (e.g., "Doorstep Service", "AC Repair")
  - `serviceId`: Unique identifier for the service
  - `customerName`: Customer's full name
  - `customerPhone`: Customer's contact number
  - `customerAddress`: Full address for service location
  - `notes`: Optional notes (used for preferred date/time)
- Extended `Order` interface with:
  - `type: OrderType` (required field to distinguish scrap vs service orders)
  - `serviceDetails?: ServiceOrderDetails` (optional, only for service orders)
- Updated mock orders to include `type: 'scrap'` for existing scrap orders

### 2. `app/services/book.tsx`
**Changes:**
- Imported `addOrder` function from `orderData`
- Updated `submit()` function to create service order:
  - Creates order with `type: 'service'`
  - Sets `status: 'pending'`
  - Populates `serviceDetails` with form data
  - Stores preferred datetime in `notes` field
  - Empty `items[]` array (service orders don't have items)
  - `totalAmount: 0` (will be determined later)
- Enhanced success alert to include order number
- Added reference to Profile → Orders in confirmation message

### 3. `app/profile/orders.tsx`
**Changes:**
- Added imports: `User`, `Phone` icons
- Updated order card rendering to handle both types:
  - **Service Orders**: Display service icon, name, customer details, and notes
  - **Scrap Orders**: Display items list as before
- Added conditional footer:
  - Service orders: "Price to be confirmed"
  - Scrap orders: Total amount with ₹ symbol
- Added new styles:
  - `serviceOrderContent`: Container for service order display
  - `serviceHeader`: Service icon and name layout
  - `serviceIconContainer`: Green circular icon background
  - `serviceInfo`: Service name and type badge
  - `serviceName`: Bold service name text
  - `serviceType`: "Service Booking" badge
  - `serviceDetails`: Customer information container
  - `serviceDetailRow`: Individual detail row with icon
  - `serviceDetailText`: Detail text styling
  - `servicePriceNote`: Yellow background for price note
  - `servicePriceText`: "Price to be confirmed" text

### 4. `app/profile/orders/[id].tsx`
**Changes:**
- Updated order details page to handle service orders
- Added conditional rendering:
  - **Service Orders**: Display service details card with:
    - Large service icon and name
    - "Service Booking" badge
    - Customer Information section (name, phone, preferred time)
    - Service cost section with "To be confirmed" message
  - **Scrap Orders**: Display items list as before
- Added new styles:
  - `serviceDetailContainer`: Main container for service details
  - `serviceMainInfo`: Header with icon and service name
  - `serviceTextInfo`: Text layout for service info
  - `serviceNameLarge`: Large bold service name
  - `serviceTypeBadge`: Green badge for "Service Booking"
  - `serviceDivider`: Separator line
  - `customerDetailsSection`: Customer info container
  - `customerSectionTitle`: "CUSTOMER INFORMATION" title
  - `customerDetailRow`: Row for each detail (name, phone, time)
  - `customerLabel`: Label text (e.g., "Name:", "Phone:")
  - `customerValue`: Value text
  - `servicePriceSection`: Yellow price section
  - `servicePriceLabel`: "Service Cost" label
  - `servicePriceValue`: "To be confirmed" text

## User Flow

### Booking a Service
1. User navigates to Services tab
2. User selects a service (e.g., "Doorstep Service")
3. User fills booking form:
   - Name: Customer's name
   - Phone: 10-digit phone number
   - Address: Service location
   - Date & Time: Preferred schedule
4. User submits the form
5. System creates a service order with:
   - Auto-generated order number (e.g., "SCR-2024-003")
   - Status: "pending"
   - Type: "service"
   - Service details from form
6. User sees success alert with order number
7. User can track booking in Profile → Orders

### Viewing Service Orders
1. User navigates to Profile → Orders
2. Service orders appear alongside scrap orders
3. Service orders show:
   - Order number and scheduled date/time
   - Status badge (Pending, Scheduled, Completed, etc.)
   - Green service icon
   - Service name (e.g., "Doorstep Service")
   - "Service Booking" label
   - Customer name and phone
   - Preferred date/time (if provided)
   - "Price to be confirmed" label
   - Service location address
4. Tapping a service order opens detailed view with:
   - Full customer information
   - Service details
   - Pickup/service details
   - Address
   - Action buttons (if applicable)

## Data Structure

### Service Order Example
```typescript
{
  id: '3',
  orderNumber: 'SCR-2024-003',
  status: 'pending',
  type: 'service',
  items: [], // Empty for service orders
  serviceDetails: {
    serviceName: 'Doorstep Service',
    serviceId: 'doorstep-service',
    customerName: 'John Doe',
    customerPhone: '9876543210',
    customerAddress: '123, ABC Apartment, XYZ Road, Pune - 411001',
    notes: 'Tomorrow, 2:00 PM - 4:00 PM'
  },
  totalAmount: 0, // To be determined
  scheduledDate: 'Dec 20, 2024',
  scheduledTime: 'TBD',
  address: {
    title: 'Service Location',
    fullAddress: '123, ABC Apartment, XYZ Road, Pune - 411001'
  },
  createdAt: '2024-12-19T10:00:00Z',
  updatedAt: '2024-12-19T10:00:00Z'
}
```

## Visual Differences

### Service Orders in List View
- **Icon**: Green package icon instead of item images
- **Background**: Light green (`#f0fdf4`)
- **Content**: Service name, customer info, notes
- **Footer**: "Price to be confirmed" badge (yellow background)

### Scrap Orders in List View
- **Icon**: Item images (newspaper, cardboard, etc.)
- **Background**: White
- **Content**: Item list with quantities and rates
- **Footer**: Total amount with ₹ symbol

### Service Orders in Detail View
- **Header**: Large package icon with service name
- **Badge**: "Service Booking" in green
- **Sections**:
  1. Customer Information (name, phone, time)
  2. Service Cost (to be confirmed)
  3. Pickup Details (scheduled date/time)
  4. Service Address

### Scrap Orders in Detail View
- **Header**: "Items" section with count
- **Sections**:
  1. Items list with images and totals
  2. Total amount
  3. Pickup details
  4. Pickup address

## Filter Behavior
- Service orders respect the same filters as scrap orders:
  - **All Orders**: Shows both types
  - **Pending**: Shows pending service and scrap orders
  - **Scheduled**: Shows scheduled service and scrap orders
  - **Completed**: Shows completed service and scrap orders
- Filter counts include both types

## Future Enhancements
1. **Price Estimation**: Add service pricing logic
2. **Service Categories**: Group services by category in orders
3. **Service Status Updates**: Real-time status tracking
4. **Service History**: Separate view for completed services
5. **Rating & Reviews**: Allow users to rate completed services
6. **Cancellation Reasons**: Specific reasons for service cancellations
7. **Rescheduling**: Allow users to reschedule service bookings
8. **Payment Integration**: Handle service payments

## Testing Checklist
- [ ] Book a service from Services tab
- [ ] Verify order appears in Profile → Orders
- [ ] Check order number is generated correctly
- [ ] Verify service details are displayed properly
- [ ] Test filter functionality with mixed orders
- [ ] Open service order details page
- [ ] Verify customer information is correct
- [ ] Test with different service types
- [ ] Check status badge colors
- [ ] Verify empty states for no service orders
- [ ] Test cancellation of service orders (if applicable)

## Known Issues
None at this time.

## Dependencies
- `lucide-react-native`: Icons (Package, User, Phone, Clock)
- `expo-router`: Navigation
- `AsyncStorage`: Order persistence (future)

## Notes
- Service orders currently stored in memory (mockOrders array)
- Need to implement AsyncStorage or API persistence
- Price confirmation flow needs to be designed
- Service scheduling confirmation needs backend integration
