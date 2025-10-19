import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ArrowLeft, 
  Coins, 
  TrendingUp, 
  Gift, 
  Clock, 
  CheckCircle,
  History,
  Zap,
  Sparkles,
  Target,
  Award,
  IndianRupee,
  ArrowUpRight,
  Info,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

interface Transaction {
  id: string;
  type: 'earned' | 'spent' | 'pending';
  title: string;
  description: string;
  amount: number;
  date: string;
  icon: 'referral' | 'booking' | 'bonus' | 'adjustment';
}

export default function RewardsWalletScreen() {
  const router = useRouter();
  
  // Wallet data
  const [walletBalance] = useState(120);
  const [pendingAmount] = useState(40);
  const [totalEarned] = useState(580);
  const [totalSpent] = useState(460);

  // Transaction history
  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'earned',
      title: 'Referral Bonus',
      description: 'Priya Singh completed first pickup',
      amount: 20,
      date: 'Today, 2:30 PM',
      icon: 'referral',
    },
    {
      id: '2',
      type: 'pending',
      title: 'Referral Pending',
      description: 'Raj Kumar booked pickup',
      amount: 20,
      date: 'Today, 11:15 AM',
      icon: 'referral',
    },
    {
      id: '3',
      type: 'spent',
      title: 'Redeemed to Bank',
      description: 'Transferred to A/C ending 4532',
      amount: -100,
      date: 'Yesterday, 4:20 PM',
      icon: 'adjustment',
    },
    {
      id: '4',
      type: 'earned',
      title: 'Referral Bonus',
      description: 'Amit Verma completed first pickup',
      amount: 20,
      date: '14 Oct, 3:10 PM',
      icon: 'referral',
    },
    {
      id: '5',
      type: 'earned',
      title: 'Referral Bonus',
      description: 'Neha Sharma completed first pickup',
      amount: 20,
      date: '12 Oct, 11:25 AM',
      icon: 'referral',
    },
  ];

  const getTransactionIcon = (iconType: string) => {
    switch (iconType) {
      case 'referral':
        return <Gift size={18} color="#16a34a" />;
      case 'booking':
        return <CheckCircle size={18} color="#16a34a" />;
      case 'bonus':
        return <Sparkles size={18} color="#f59e0b" />;
      case 'adjustment':
        return <ArrowUpRight size={18} color="#6b7280" />;
      default:
        return <Coins size={18} color="#16a34a" />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with Gradient */}
      <LinearGradient
        colors={['#16a34a', '#15803d', '#166534']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Rewards Wallet</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Main Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <View style={styles.balanceIconBox}>
              <Coins size={28} color="#f59e0b" strokeWidth={2.5} />
            </View>
            <Text style={styles.balanceLabel}>Available Balance</Text>
          </View>
          
          <View style={styles.balanceAmountRow}>
            <IndianRupee size={36} color="white" strokeWidth={3} />
            <Text style={styles.balanceAmount}>{walletBalance}</Text>
          </View>
          
          <Text style={styles.balanceSubtext}>
            � Extra earnings from referrals - withdraw anytime to your bank
          </Text>

          {/* Pending Badge */}
          {pendingAmount > 0 && (
            <View style={styles.pendingBadge}>
              <Clock size={14} color="white" />
              <Text style={styles.pendingText}>
                ₹{pendingAmount} pending verification
              </Text>
            </View>
          )}

          {/* Withdraw Button */}
          {walletBalance >= 100 && (
            <TouchableOpacity 
              style={styles.withdrawButton}
              activeOpacity={0.8}
              onPress={() => {
                // Withdraw functionality
                console.log('Withdraw to bank');
              }}
            >
              <IndianRupee size={18} color="white" strokeWidth={2.5} />
              <Text style={styles.withdrawButtonText}>Withdraw to Bank</Text>
            </TouchableOpacity>
          )}

          {walletBalance < 100 && walletBalance > 0 && (
            <View style={styles.withdrawDisabled}>
              <Text style={styles.withdrawDisabledText}>
                ₹{100 - walletBalance} more to withdraw
              </Text>
            </View>
          )}
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIconWrapper}>
              <TrendingUp size={20} color="#16a34a" />
            </View>
            <Text style={styles.statValue}>₹{totalEarned}</Text>
            <Text style={styles.statLabel}>Referrals Earned</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconWrapper}>
              <Zap size={20} color="#f59e0b" />
            </View>
            <Text style={styles.statValue}>₹{totalSpent}</Text>
            <Text style={styles.statLabel}>Withdrawn</Text>
          </View>
        </View>

        {/* How It Works */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <View style={styles.infoIconBox}>
              <Info size={20} color="#16a34a" />
            </View>
            <Text style={styles.infoTitle}>How Referral Wallet Works</Text>
          </View>
          
          <View style={styles.infoContent}>
            <View style={styles.infoPoint}>
              <View style={styles.infoDot} />
              <Text style={styles.infoText}>
                <Text style={styles.infoBold}>Sell scrap, get paid directly</Text> to your bank account
              </Text>
            </View>
            
            <View style={styles.infoPoint}>
              <View style={styles.infoDot} />
              <Text style={styles.infoText}>
                <Text style={styles.infoBold}>Referral bonus is separate</Text> - earn extra ₹20 per referral
              </Text>
            </View>
            
            <View style={styles.infoPoint}>
              <View style={styles.infoDot} />
              <Text style={styles.infoText}>
                <Text style={styles.infoBold}>Withdraw anytime</Text> - minimum ₹100 to bank account
              </Text>
            </View>
          </View>

          {/* Example Card */}
          <View style={styles.exampleBox}>
            <Text style={styles.exampleTitle}>💡 How it works:</Text>
            <View style={styles.exampleRow}>
              <Text style={styles.exampleText}>Scrap Payment:</Text>
              <Text style={styles.exampleValue}>Direct to Bank ✅</Text>
            </View>
            <View style={styles.exampleRow}>
              <Text style={styles.exampleText}>Referral Bonus:</Text>
              <Text style={styles.exampleValueGreen}>In Wallet ₹120</Text>
            </View>
            <View style={styles.exampleDivider} />
            <View style={styles.exampleRow}>
              <Text style={styles.exampleTextBold}>Withdraw Option:</Text>
              <Text style={styles.exampleValueBold}>Min ₹100</Text>
            </View>
          </View>
        </View>

        {/* Earn More CTA */}
        <TouchableOpacity 
          style={styles.earnMoreCard}
          onPress={() => router.push('/profile/refer-friends' as any)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#f59e0b', '#f97316']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.earnMoreGradient}
          >
            <View style={styles.earnMoreLeft}>
              <View style={styles.earnMoreIconBox}>
                <Gift size={24} color="white" />
              </View>
              <View style={styles.earnMoreContent}>
                <Text style={styles.earnMoreTitle}>Invite Friends & Earn</Text>
                <Text style={styles.earnMoreSubtitle}>Get ₹20 per referral</Text>
              </View>
            </View>
            <View style={styles.earnMoreArrow}>
              <ArrowUpRight size={24} color="white" strokeWidth={2.5} />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Transaction History */}
        <View style={styles.historySection}>
          <View style={styles.historyHeader}>
            <View style={styles.historyIconBox}>
              <History size={20} color="#16a34a" />
            </View>
            <Text style={styles.historyTitle}>Transaction History</Text>
          </View>

          <View style={styles.transactionsList}>
            {transactions.map((transaction, index) => (
              <View key={transaction.id} style={styles.transactionCard}>
                <View style={styles.transactionLeft}>
                  <View style={[
                    styles.transactionIcon,
                    transaction.type === 'earned' && styles.transactionIconEarned,
                    transaction.type === 'spent' && styles.transactionIconSpent,
                    transaction.type === 'pending' && styles.transactionIconPending,
                  ]}>
                    {getTransactionIcon(transaction.icon)}
                  </View>
                  
                  <View style={styles.transactionDetails}>
                    <Text style={styles.transactionTitle}>{transaction.title}</Text>
                    <Text style={styles.transactionDesc}>{transaction.description}</Text>
                    <Text style={styles.transactionDate}>{transaction.date}</Text>
                  </View>
                </View>

                <View style={styles.transactionRight}>
                  <Text style={[
                    styles.transactionAmount,
                    transaction.type === 'earned' && styles.transactionAmountEarned,
                    transaction.type === 'spent' && styles.transactionAmountSpent,
                    transaction.type === 'pending' && styles.transactionAmountPending,
                  ]}>
                    {transaction.amount > 0 ? '+' : ''}₹{Math.abs(transaction.amount)}
                  </Text>
                  {transaction.type === 'pending' && (
                    <View style={styles.pendingChip}>
                      <Text style={styles.pendingChipText}>Pending</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Bottom Tip */}
        <View style={styles.tipCard}>
          <View style={styles.tipIcon}>
            <Target size={18} color="#16a34a" />
          </View>
          <Text style={styles.tipText}>
            <Text style={styles.tipBold}>Remember:</Text> Your scrap selling payments go directly to your bank account. This wallet is only for referral bonuses - withdraw anytime once you reach ₹100!
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    paddingTop: 55,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: 'white',
    fontFamily: 'Inter-Bold',
    letterSpacing: 0.3,
  },
  headerRight: {
    width: 40,
  },

  // Balance Card
  balanceCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  balanceLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'Inter-SemiBold',
    letterSpacing: 0.3,
  },
  balanceAmountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  balanceAmount: {
    fontSize: 56,
    fontWeight: '800',
    color: 'white',
    fontFamily: 'Inter-Bold',
    marginLeft: 8,
    letterSpacing: -1,
  },
  balanceSubtext: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'Inter-Regular',
    marginBottom: 12,
  },
  pendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(251, 191, 36, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    alignSelf: 'flex-start',
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.4)',
  },
  pendingText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
    fontFamily: 'Inter-SemiBold',
  },
  withdrawButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginTop: 16,
    gap: 8,
  },
  withdrawButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: 'white',
    fontFamily: 'Inter-Bold',
  },
  withdrawDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 16,
    alignItems: 'center',
  },
  withdrawDisabledText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'Inter-SemiBold',
  },

  // Content
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  // Stats
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ecfdf5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'Inter-Medium',
  },

  // Info Card
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ecfdf5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Inter-Bold',
  },
  infoContent: {
    gap: 12,
    marginBottom: 16,
  },
  infoPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16a34a',
    marginTop: 7,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
    lineHeight: 21,
  },
  infoBold: {
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
  },

  // Example Box
  exampleBox: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  exampleTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 10,
  },
  exampleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  exampleText: {
    fontSize: 13,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
  },
  exampleValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
  },
  exampleValueGreen: {
    fontSize: 13,
    fontWeight: '600',
    color: '#16a34a',
    fontFamily: 'Inter-SemiBold',
  },
  exampleDivider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 8,
  },
  exampleTextBold: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Inter-Bold',
  },
  exampleValueBold: {
    fontSize: 16,
    fontWeight: '700',
    color: '#16a34a',
    fontFamily: 'Inter-Bold',
  },

  // Earn More Card
  earnMoreCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  earnMoreGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  earnMoreLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  earnMoreIconBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  earnMoreContent: {
    flex: 1,
  },
  earnMoreTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  earnMoreSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'Inter-Medium',
  },
  earnMoreArrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Transaction History
  historySection: {
    marginBottom: 20,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  historyIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ecfdf5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Inter-Bold',
  },
  transactionsList: {
    gap: 10,
  },
  transactionCard: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionIconEarned: {
    backgroundColor: '#ecfdf5',
  },
  transactionIconSpent: {
    backgroundColor: '#f3f4f6',
  },
  transactionIconPending: {
    backgroundColor: '#fef3c7',
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 3,
  },
  transactionDesc: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
    marginBottom: 3,
  },
  transactionDate: {
    fontSize: 11,
    color: '#9ca3af',
    fontFamily: 'Inter-Regular',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  transactionAmountEarned: {
    color: '#16a34a',
  },
  transactionAmountSpent: {
    color: '#6b7280',
  },
  transactionAmountPending: {
    color: '#f59e0b',
  },
  pendingChip: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  pendingChipText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#f59e0b',
    fontFamily: 'Inter-SemiBold',
  },

  // Tip Card
  tipCard: {
    backgroundColor: '#ecfdf5',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    borderLeftWidth: 3,
    borderLeftColor: '#16a34a',
  },
  tipIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: '#166534',
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  tipBold: {
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
});
