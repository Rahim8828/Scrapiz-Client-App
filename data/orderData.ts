// Order types and data management
export type OrderStatus = 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
export type OrderType = 'scrap' | 'service';

export type OrderItem = {
  id: string;
  name: string;
  image: number;
  quantity: number;
  rate: number;
  categoryColor: string;
};

export type ServiceOrderDetails = {
  serviceName: string;
  serviceId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  notes?: string;
};

export type Order = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  type: OrderType;
  items: OrderItem[];
  totalAmount: number;
  referralBonus?: number; // Added for referral wallet usage
  finalAmount?: number; // Total amount including referral bonus
  scheduledDate: string;
  scheduledTime: string;
  address: {
    title: string;
    fullAddress: string;
  };
  contact?: {
    name: string;
    mobile: string;
  };
  notes?: string;
  photos?: string[];
  serviceDetails?: ServiceOrderDetails;
  createdAt: string;
  updatedAt: string;
};

// Mock orders data
export const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'SCR-2024-001',
    status: 'completed',
    type: 'scrap',
    items: [
      {
        id: '1',
        name: 'Old Newspapers',
        image: require('../assets/images/Scrap Rates Photos/Newspaper.jpg'),
        quantity: 5,
        rate: 8,
        categoryColor: '#16a34a'
      },
      {
        id: '2',
        name: 'Cardboard Boxes',
        image: require('../assets/images/Scrap Rates Photos/Cardboard.jpg'),
        quantity: 3,
        rate: 6,
        categoryColor: '#16a34a'
      }
    ],
    totalAmount: 58,
    scheduledDate: 'Dec 15, 2024',
    scheduledTime: '10:00 AM - 12:00 PM',
    address: {
      title: 'Home',
      fullAddress: '123, Green Valley Apartment, Sector 21, Pune - 411001'
    },
    createdAt: '2024-12-10T10:00:00Z',
    updatedAt: '2024-12-15T14:30:00Z'
  },
  {
    id: '2',
    orderNumber: 'SCR-2024-002',
    status: 'scheduled',
    type: 'scrap',
    items: [
      {
        id: '3',
        name: 'Aluminum Cans',
        image: require('../assets/images/Scrap Rates Photos/Aluminium.jpg'),
        quantity: 2,
        rate: 45,
        categoryColor: '#ea580c'
      }
    ],
    totalAmount: 90,
    scheduledDate: 'Dec 20, 2024',
    scheduledTime: '2:00 PM - 4:00 PM',
    address: {
      title: 'Office',
      fullAddress: '456, Tech Park, Sector 5, Pune - 411001'
    },
    createdAt: '2024-12-18T15:30:00Z',
    updatedAt: '2024-12-18T15:30:00Z'
  }
];

// Order management functions
export const addOrder = (order: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Order => {
  const newOrder: Order = {
    ...order,
    id: Date.now().toString(),
    orderNumber: `SCR-2024-${String(mockOrders.length + 1).padStart(3, '0')}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  mockOrders.unshift(newOrder);
  return newOrder;
};

export const updateOrderStatus = (orderId: string, status: OrderStatus): Order | null => {
  const orderIndex = mockOrders.findIndex(order => order.id === orderId);
  if (orderIndex !== -1) {
    mockOrders[orderIndex].status = status;
    mockOrders[orderIndex].updatedAt = new Date().toISOString();
    return mockOrders[orderIndex];
  }
  return null;
};

export const getOrdersByStatus = (status?: OrderStatus): Order[] => {
  if (status) {
    return mockOrders.filter(order => order.status === status);
  }
  return mockOrders;
};

export const getOrderById = (orderId: string): Order | null => {
  return mockOrders.find(order => order.id === orderId) || null;
};

// Status display helpers
export const getStatusColor = (status: OrderStatus): string => {
  switch (status) {
    case 'pending': return '#f59e0b';
    case 'scheduled': return '#3b82f6';
    case 'in_progress': return '#8b5cf6';
    case 'completed': return '#10b981';
    case 'cancelled': return '#ef4444';
    default: return '#6b7280';
  }
};

export const getStatusText = (status: OrderStatus): string => {
  switch (status) {
    case 'pending': return 'Pending';
    case 'scheduled': return 'Scheduled';
    case 'in_progress': return 'In Progress';
    case 'completed': return 'Completed';
    case 'cancelled': return 'Cancelled';
    default: return 'Unknown';
  }
};
