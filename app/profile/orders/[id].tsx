import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { ArrowLeft, MapPin, Calendar, Clock, Phone, IndianRupee, Package, CheckCircle, X } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getOrderById, getStatusColor, getStatusText, updateOrderStatus } from '../../../data/orderData';

export default function OrderDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const order = getOrderById(id as string);

  if (!order) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order Not Found</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Order not found</Text>
        </View>
      </View>
    );
  }

  const handleCancelOrder = () => {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order?',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Yes, Cancel', 
          style: 'destructive',
          onPress: () => {
            updateOrderStatus(order.id, 'cancelled');
            Alert.alert('Order Cancelled', 'Your order has been cancelled successfully.');
            router.back();
          }
        }
      ]
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={20} color={getStatusColor(status as any)} />;
      case 'scheduled': return <Calendar size={20} color={getStatusColor(status as any)} />;
      case 'completed': return <CheckCircle size={20} color={getStatusColor(status as any)} />;
      case 'cancelled': return <X size={20} color={getStatusColor(status as any)} />;
      default: return <Package size={20} color={getStatusColor(status as any)} />;
    }
  };

  const canCancelOrder = order.status === 'pending' || order.status === 'scheduled';

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Order Details</Text>
          <Text style={styles.headerSubtitle}>{order.orderNumber}</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order Status */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            {getStatusIcon(order.status)}
            <Text style={styles.statusTitle}>Order Status</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
              {getStatusText(order.status)}
            </Text>
          </View>
        </View>

        {/* Order Items or Service Details */}
        {order.type === 'service' && order.serviceDetails ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Service Details</Text>
            <View style={styles.itemsCard}>
              <View style={styles.serviceDetailContainer}>
                <View style={styles.serviceMainInfo}>
                  <Package size={32} color="#16a34a" />
                  <View style={styles.serviceTextInfo}>
                    <Text style={styles.serviceNameLarge}>{order.serviceDetails.serviceName}</Text>
                    <Text style={styles.serviceTypeBadge}>Service Booking</Text>
                  </View>
                </View>
                
                <View style={styles.serviceDivider} />
                
                <View style={styles.customerDetailsSection}>
                  <Text style={styles.customerSectionTitle}>Customer Information</Text>
                  <View style={styles.customerDetailRow}>
                    <Text style={styles.customerLabel}>Name:</Text>
                    <Text style={styles.customerValue}>{order.serviceDetails.customerName}</Text>
                  </View>
                  <View style={styles.customerDetailRow}>
                    <Text style={styles.customerLabel}>Phone:</Text>
                    <Text style={styles.customerValue}>{order.serviceDetails.customerPhone}</Text>
                  </View>
                  {order.serviceDetails.notes && (
                    <View style={styles.customerDetailRow}>
                      <Text style={styles.customerLabel}>Preferred Time:</Text>
                      <Text style={styles.customerValue}>{order.serviceDetails.notes}</Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.servicePriceSection}>
                  <Text style={styles.servicePriceLabel}>Service Cost</Text>
                  <Text style={styles.servicePriceValue}>To be confirmed</Text>
                </View>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Items ({order.items.length})</Text>
            <View style={styles.itemsCard}>
              {order.items.map((item, index) => (
                <View key={index} style={styles.itemRow}>
                  <View style={styles.itemLeft}>
                    <Image source={item.image} style={styles.itemIconImage} />
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemRate}>₹{item.rate}/kg</Text>
                    </View>
                  </View>
                  <View style={styles.itemRight}>
                    <Text style={styles.itemQuantity}>{item.quantity}kg</Text>
                    <Text style={styles.itemTotal}>₹{item.rate * item.quantity}</Text>
                  </View>
                </View>
              ))}
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Estimated Value</Text>
                <View style={styles.totalAmount}>
                  <IndianRupee size={18} color="#6b7280" />
                  <Text style={styles.totalValue}>₹{order.totalAmount}</Text>
                </View>
              </View>
              {order.referralBonus && order.referralBonus > 0 && (
                <>
                  <View style={styles.referralRow}>
                    <Text style={styles.referralLabel}>🎁 Referral Bonus</Text>
                    <View style={styles.referralAmount}>
                      <Text style={styles.referralValue}>+₹{order.referralBonus}</Text>
                    </View>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.finalRow}>
                    <Text style={styles.finalLabel}>Total Payout</Text>
                    <View style={styles.finalAmount}>
                      <IndianRupee size={20} color="#16a34a" strokeWidth={2.5} />
                      <Text style={styles.finalValue}>₹{order.finalAmount || order.totalAmount}</Text>
                    </View>
                  </View>
                </>
              )}
            </View>
          </View>
        )}

        {/* Pickup Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pickup Details</Text>
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Calendar size={20} color="#6b7280" />
              <View style={styles.detailInfo}>
                <Text style={styles.detailLabel}>Scheduled Date</Text>
                <Text style={styles.detailValue}>{order.scheduledDate}</Text>
              </View>
            </View>
            <View style={styles.detailRow}>
              <Clock size={20} color="#6b7280" />
              <View style={styles.detailInfo}>
                <Text style={styles.detailLabel}>Time Slot</Text>
                <Text style={styles.detailValue}>{order.scheduledTime}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Address Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pickup Address</Text>
          <View style={styles.addressCard}>
            <View style={styles.addressHeader}>
              <MapPin size={20} color="#111827" />
              <Text style={styles.addressTitle}>{order.address.title}</Text>
            </View>
            <Text style={styles.addressText}>{order.address.fullAddress}</Text>
          </View>
        </View>

        {/* Order Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Timeline</Text>
          <View style={styles.timelineCard}>
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, { backgroundColor: '#16a34a' }]} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Order Placed</Text>
                <Text style={styles.timelineDate}>{new Date(order.createdAt).toLocaleDateString()}</Text>
              </View>
            </View>
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, { backgroundColor: getStatusColor(order.status) }]} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>{getStatusText(order.status)}</Text>
                <Text style={styles.timelineDate}>{new Date(order.updatedAt).toLocaleDateString()}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        {canCancelOrder && (
          <View style={styles.actionsSection}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancelOrder}>
              <X size={20} color="#dc2626" />
              <Text style={styles.cancelButtonText}>Cancel Order</Text>
            </TouchableOpacity>
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
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
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
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statusCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  itemsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  itemIconImage: {
    width: 36,
    height: 36,
    marginRight: 12,
    borderRadius: 6,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    fontFamily: 'Inter-Medium',
    marginBottom: 2,
  },
  itemRate: {
    fontSize: 14,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
  },
  itemRight: {
    alignItems: 'flex-end',
  },
  itemQuantity: {
    fontSize: 14,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
    marginBottom: 2,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#16a34a',
    fontFamily: 'Inter-SemiBold',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
  },
  totalAmount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#16a34a',
    fontFamily: 'Inter-SemiBold',
    marginLeft: 4,
  },
  detailsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailInfo: {
    marginLeft: 12,
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    fontFamily: 'Inter-Medium',
  },
  addressCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
  addressText: {
    fontSize: 14,
    color: '#374151',
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  timelineCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 16,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    fontFamily: 'Inter-Medium',
    marginBottom: 2,
  },
  timelineDate: {
    fontSize: 14,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
  },
  actionsSection: {
    marginTop: 20,
    marginBottom: 40,
  },
  cancelButton: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#dc2626',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#dc2626',
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 18,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
  },
  // Service Order Styles
  serviceDetailContainer: {
    padding: 20,
  },
  serviceMainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  serviceTextInfo: {
    flex: 1,
    marginLeft: 16,
  },
  serviceNameLarge: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 6,
  },
  serviceTypeBadge: {
    fontSize: 12,
    color: '#16a34a',
    fontFamily: 'Inter-Medium',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  serviceDivider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 16,
  },
  customerDetailsSection: {
    marginBottom: 16,
  },
  customerSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  customerDetailRow: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  customerLabel: {
    fontSize: 15,
    color: '#6b7280',
    fontFamily: 'Inter-Medium',
    width: 120,
  },
  customerValue: {
    fontSize: 15,
    color: '#111827',
    fontFamily: 'Inter-Regular',
    flex: 1,
  },
  servicePriceSection: {
    backgroundColor: '#fef3c7',
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
  },
  servicePriceLabel: {
    fontSize: 13,
    color: '#92400e',
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  servicePriceValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400e',
    fontFamily: 'Inter-SemiBold',
  },
  referralRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 8,
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
  },
  referralLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#16a34a',
    fontFamily: 'Inter-SemiBold',
  },
  referralAmount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  referralValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#16a34a',
    fontFamily: 'Inter-SemiBold',
  },
  divider: {
    height: 1,
    backgroundColor: '#16a34a',
    marginVertical: 12,
    marginHorizontal: 16,
    opacity: 0.2,
  },
  finalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#dcfce7',
    borderRadius: 8,
    marginTop: 8,
  },
  finalLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
  },
  finalAmount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  finalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#16a34a',
    fontFamily: 'Inter-SemiBold',
  },
});
