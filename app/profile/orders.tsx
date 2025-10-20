import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { ArrowLeft, Package, Clock, CheckCircle, X, MapPin, Calendar, IndianRupee, User, Phone } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { mockOrders, getStatusColor, getStatusText, type Order } from '../../data/orderData';

export default function OrdersScreen() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const filterOptions = [
    { key: 'all', label: 'All Orders', count: mockOrders.length },
    { key: 'pending', label: 'Pending', count: mockOrders.filter(o => o.status === 'pending').length },
    { key: 'scheduled', label: 'Scheduled', count: mockOrders.filter(o => o.status === 'scheduled').length },
    { key: 'completed', label: 'Completed', count: mockOrders.filter(o => o.status === 'completed').length },
  ];

  const filteredOrders = selectedFilter === 'all' 
    ? mockOrders 
    : mockOrders.filter(order => order.status === selectedFilter);

  const handleOrderPress = (order: Order) => {
    router.push(`/profile/orders/${order.id}`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={16} color={getStatusColor(status as any)} />;
      case 'scheduled': return <Calendar size={16} color={getStatusColor(status as any)} />;
      case 'completed': return <CheckCircle size={16} color={getStatusColor(status as any)} />;
      case 'cancelled': return <X size={16} color={getStatusColor(status as any)} />;
      default: return <Package size={16} color={getStatusColor(status as any)} />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>My Orders</Text>
          <Text style={styles.headerSubtitle}>{mockOrders.length} orders</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {filterOptions.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.filterTab,
                selectedFilter === option.key && styles.filterTabActive
              ]}
              onPress={() => setSelectedFilter(option.key)}
            >
              <Text style={[
                styles.filterTabText,
                selectedFilter === option.key && styles.filterTabTextActive
              ]}>
                {option.label}
              </Text>
              <View style={[
                styles.filterCount,
                selectedFilter === option.key && styles.filterCountActive
              ]}>
                <Text style={[
                  styles.filterCountText,
                  selectedFilter === option.key && styles.filterCountTextActive
                ]}>
                  {option.count}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Orders List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <TouchableOpacity
              key={order.id}
              style={styles.orderCard}
              onPress={() => handleOrderPress(order)}
              activeOpacity={0.7}
            >
              <View style={styles.orderHeader}>
                <View style={styles.orderInfo}>
                  <Text style={styles.orderNumber}>{order.orderNumber}</Text>
                  <Text style={styles.orderDate}>{order.scheduledDate} • {order.scheduledTime}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '20' }]}>
                  {getStatusIcon(order.status)}
                  <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                    {getStatusText(order.status)}
                  </Text>
                </View>
              </View>
              
              {/* Display Service Orders differently from Scrap Orders */}
              {order.type === 'service' && order.serviceDetails ? (
                <View style={styles.serviceOrderContent}>
                  <View style={styles.serviceHeader}>
                    <View style={styles.serviceIconContainer}>
                      <Package size={24} color="#16a34a" />
                    </View>
                    <View style={styles.serviceInfo}>
                      <Text style={styles.serviceName}>{order.serviceDetails.serviceName}</Text>
                      <Text style={styles.serviceType}>Service Booking</Text>
                    </View>
                  </View>
                  <View style={styles.serviceDetails}>
                    <View style={styles.serviceDetailRow}>
                      <User size={14} color="#6b7280" />
                      <Text style={styles.serviceDetailText}>{order.serviceDetails.customerName}</Text>
                    </View>
                    <View style={styles.serviceDetailRow}>
                      <Phone size={14} color="#6b7280" />
                      <Text style={styles.serviceDetailText}>{order.serviceDetails.customerPhone}</Text>
                    </View>
                    {order.serviceDetails.notes && (
                      <View style={styles.serviceDetailRow}>
                        <Clock size={14} color="#6b7280" />
                        <Text style={styles.serviceDetailText}>{order.serviceDetails.notes}</Text>
                      </View>
                    )}
                  </View>
                </View>
              ) : (
                <View style={styles.orderItems}>
                  {order.items.slice(0, 3).map((item, index) => (
                    <View key={index} style={styles.orderItem}>
                      <Image source={item.image} style={styles.orderItemImage} />
                      <Text style={styles.orderItemName}>{item.name}</Text>
                      <Text style={styles.orderItemQuantity}>{item.quantity}kg</Text>
                      <Text style={styles.orderItemRate}>₹{item.rate}/kg</Text>
                    </View>
                  ))}
                  {order.items.length > 3 && (
                    <Text style={styles.moreItemsText}>+{order.items.length - 3} more items</Text>
                  )}
                </View>
              )}
              
              <View style={styles.orderFooter}>
                {order.type === 'service' ? (
                  <View style={styles.servicePriceNote}>
                    <Text style={styles.servicePriceText}>Price to be confirmed</Text>
                  </View>
                ) : (
                  <View style={styles.orderTotal}>
                    <IndianRupee size={16} color="#16a34a" />
                    <Text style={styles.orderTotalAmount}>₹{order.totalAmount}</Text>
                  </View>
                )}
                <View style={styles.orderAddress}>
                  <MapPin size={12} color="#6b7280" />
                  <Text style={styles.orderAddressText}>{order.address.title}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Package size={64} color="#d1d5db" />
            <Text style={styles.emptyTitle}>No Orders Found</Text>
            <Text style={styles.emptySubtitle}>
              {selectedFilter === 'all' 
                ? "You haven't placed any orders yet" 
                : `No ${selectedFilter} orders found`
              }
            </Text>
            {selectedFilter !== 'all' && (
              <TouchableOpacity 
                style={styles.clearFilterButton}
                onPress={() => setSelectedFilter('all')}
              >
                <Text style={styles.clearFilterText}>View All Orders</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: 'white',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
  },
  filterContainer: {
    backgroundColor: 'white',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  filterScroll: {
    paddingHorizontal: 20,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
  },
  filterTabActive: {
    backgroundColor: '#16a34a',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    fontFamily: 'Inter-Medium',
    marginRight: 6,
  },
  filterTabTextActive: {
    color: 'white',
  },
  filterCount: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  filterCountActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  filterCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#16a34a',
    fontFamily: 'Inter-SemiBold',
  },
  filterCountTextActive: {
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  orderItems: {
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderItemImage: {
    width: 24,
    height: 24,
    borderRadius: 4,
    marginRight: 12,
  },
  orderItemName: {
    fontSize: 14,
    color: '#374151',
    fontFamily: 'Inter-Regular',
    flex: 1,
  },
  orderItemQuantity: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
    marginRight: 8,
  },
  orderItemRate: {
    fontSize: 12,
    fontWeight: '600',
    color: '#16a34a',
    fontFamily: 'Inter-SemiBold',
  },
  moreItemsText: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
    fontStyle: 'italic',
    marginTop: 4,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderTotal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderTotalAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#16a34a',
    fontFamily: 'Inter-SemiBold',
    marginLeft: 4,
  },
  orderAddress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderAddressText: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
    marginLeft: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  clearFilterButton: {
    backgroundColor: '#16a34a',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  clearFilterText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    fontFamily: 'Inter-SemiBold',
  },
  // Service Order Styles
  serviceOrderContent: {
    padding: 16,
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    marginTop: 12,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  serviceType: {
    fontSize: 12,
    color: '#16a34a',
    fontFamily: 'Inter-Medium',
  },
  serviceDetails: {
    gap: 8,
  },
  serviceDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  serviceDetailText: {
    fontSize: 13,
    color: '#374151',
    fontFamily: 'Inter-Regular',
    flex: 1,
  },
  servicePriceNote: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  servicePriceText: {
    fontSize: 12,
    color: '#92400e',
    fontFamily: 'Inter-Medium',
  },
});
