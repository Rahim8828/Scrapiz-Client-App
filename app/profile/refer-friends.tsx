import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Alert,
  Clipboard,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Gift, Users, IndianRupee, Share2, Copy, MessageCircle, Wallet, CheckCircle, Info } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function ReferFriendsScreen() {
  const router = useRouter();
  const referralCode = 'SCRAPIZ2024';
  const referralLink = `https://scrapiz.in/ref/${referralCode}`;
  
  // User's referral wallet data
  const [walletBalance, setWalletBalance] = useState(120); // Total earned
  const [pendingBalance, setPendingBalance] = useState(40); // Pending verification
  const [totalReferrals, setTotalReferrals] = useState(6);
  const [successfulReferrals, setSuccessfulReferrals] = useState(6);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `🌱 Join me on Scrapiz - India's #1 Scrap Selling Platform!\n\n💰 Use my code: ${referralCode}\n🎁 You get ₹20 off on first order (min ₹500)\n🎁 I earn ₹20 when you complete pickup\n\n♻️ Turn your scrap into cash instantly!\n\n📲 Download now: ${referralLink}`,
        title: 'Earn with Scrapiz - Sell Scrap, Earn Money!',
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleCopyCode = () => {
    Clipboard.setString(referralCode);
    Alert.alert('✅ Copied!', 'Referral code copied to clipboard', [{ text: 'OK' }]);
  };

  const handleCopyLink = () => {
    Clipboard.setString(referralLink);
    Alert.alert('✅ Copied!', 'Referral link copied to clipboard', [{ text: 'OK' }]);
  };

  const handleWhatsAppShare = () => {
    const message = `🌱 Join me on Scrapiz - India's #1 Scrap Selling Platform!\n\n💰 Use my code: ${referralCode}\n🎁 You get ₹20 off on first order (min ₹500)\n🎁 I earn ₹20 when you complete pickup\n\n♻️ Turn your scrap into cash instantly!\n\n📲 Download now: ${referralLink}`;
    // In real app, use Linking.openURL with WhatsApp deep link
    Alert.alert('WhatsApp Share', 'Opening WhatsApp...');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#16a34a', '#15803d', '#166534']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Refer & Earn</Text>
        <View style={styles.headerRight} />
      </LinearGradient>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Wallet Balance Card */}
        <View style={styles.walletCard}>
          <LinearGradient
            colors={['#16a34a', '#15803d']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.walletGradient}
          >
            <View style={styles.walletHeader}>
              <View style={styles.walletIcon}>
                <Wallet size={24} color="white" />
              </View>
              <Text style={styles.walletTitle}>Referral Wallet</Text>
            </View>
            
            <View style={styles.balanceRow}>
              <View style={styles.balanceItem}>
                <Text style={styles.balanceLabel}>Available Balance</Text>
                <View style={styles.balanceAmount}>
                  <IndianRupee size={28} color="white" strokeWidth={3} />
                  <Text style={styles.balanceValue}>{walletBalance}</Text>
                </View>
                <Text style={styles.balanceSubtext}>Auto-adjusts on next pickup</Text>
              </View>
            </View>

            <View style={styles.pendingSection}>
              <View style={styles.pendingRow}>
                <View style={styles.pendingDot} />
                <Text style={styles.pendingText}>Pending: ₹{pendingBalance}</Text>
              </View>
              <Text style={styles.pendingSubtext}>Clears after pickup verification</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <View style={styles.statIconContainer}>
              <Users size={20} color="#16a34a" />
            </View>
            <Text style={styles.statNumber}>{totalReferrals}</Text>
            <Text style={styles.statLabel}>Total Referrals</Text>
          </View>

          <View style={styles.statBox}>
            <View style={styles.statIconContainer}>
              <CheckCircle size={20} color="#16a34a" />
            </View>
            <Text style={styles.statNumber}>{successfulReferrals}</Text>
            <Text style={styles.statLabel}>Successful</Text>
          </View>

          <View style={styles.statBox}>
            <View style={styles.statIconContainer}>
              <IndianRupee size={20} color="#16a34a" />
            </View>
            <Text style={styles.statNumber}>₹20</Text>
            <Text style={styles.statLabel}>Per Referral</Text>
          </View>
        </View>

        {/* How It Works */}
        <View style={styles.howItWorksCard}>
          <View style={styles.sectionHeader}>
            <Gift size={22} color="#16a34a" />
            <Text style={styles.sectionTitle}>How It Works</Text>
          </View>

          <View style={styles.stepsContainer}>
            <View style={styles.stepItem}>
              <View style={styles.stepNumberBox}>
                <Text style={styles.stepNumber}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Share Your Code</Text>
                <Text style={styles.stepDesc}>
                  Share your unique referral code with friends & family via WhatsApp, SMS or social media
                </Text>
              </View>
            </View>

            <View style={styles.stepConnector} />

            <View style={styles.stepItem}>
              <View style={styles.stepNumberBox}>
                <Text style={styles.stepNumber}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Friend Books Service</Text>
                <Text style={styles.stepDesc}>
                  Your friend signs up using your code & books a scrap pickup worth minimum ₹500
                </Text>
              </View>
            </View>

            <View style={styles.stepConnector} />

            <View style={styles.stepItem}>
              <View style={styles.stepNumberBox}>
                <Text style={styles.stepNumber}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Both Earn Rewards!</Text>
                <Text style={styles.stepDesc}>
                  You get ₹20 in wallet • Your friend gets ₹20 discount on their first order
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Referral Code Section */}
        <View style={styles.codeSection}>
          <Text style={styles.codeSectionTitle}>Your Referral Code</Text>
          
          <TouchableOpacity style={styles.codeCard} onPress={handleCopyCode} activeOpacity={0.7}>
            <View style={styles.codeLeft}>
              <Text style={styles.codeLabel}>CODE</Text>
              <Text style={styles.codeText}>{referralCode}</Text>
            </View>
            <View style={styles.copyIconContainer}>
              <Copy size={20} color="#16a34a" />
              <Text style={styles.copyText}>Copy</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkCard} onPress={handleCopyLink} activeOpacity={0.7}>
            <Text style={styles.linkText} numberOfLines={1}>{referralLink}</Text>
            <View style={styles.copyIconContainer}>
              <Copy size={18} color="#16a34a" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Share Buttons */}
        <View style={styles.shareSection}>
          <TouchableOpacity style={styles.shareButton} onPress={handleShare} activeOpacity={0.8}>
            <LinearGradient
              colors={['#16a34a', '#15803d']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.shareGradient}
            >
              <Share2 size={20} color="white" />
              <Text style={styles.shareButtonText}>Share Now</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.whatsappButton} onPress={handleWhatsAppShare} activeOpacity={0.8}>
            <MessageCircle size={20} color="#25D366" />
            <Text style={styles.whatsappText}>WhatsApp</Text>
          </TouchableOpacity>
        </View>

        {/* Benefits Section */}
        <View style={styles.benefitsCard}>
          <View style={styles.benefitRow}>
            <View style={styles.benefitIcon}>
              <Text style={styles.benefitEmoji}>💰</Text>
            </View>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Smart Savings</Text>
              <Text style={styles.benefitDesc}>
                Your ₹20 earnings auto-adjust on next pickup - no manual redemption needed!
              </Text>
            </View>
          </View>

          <View style={styles.benefitRow}>
            <View style={styles.benefitIcon}>
              <Text style={styles.benefitEmoji}>♻️</Text>
            </View>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Win-Win-Win</Text>
              <Text style={styles.benefitDesc}>
                You earn • Friend saves • Environment benefits from more recycling!
              </Text>
            </View>
          </View>

          <View style={styles.benefitRow}>
            <View style={styles.benefitIcon}>
              <Text style={styles.benefitEmoji}>🎯</Text>
            </View>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>No Limits</Text>
              <Text style={styles.benefitDesc}>
                Refer unlimited friends and keep earning ₹20 per successful referral
              </Text>
            </View>
          </View>
        </View>

        {/* Important Info */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Info size={18} color="#16a34a" />
            <Text style={styles.infoTitle}>Important Points</Text>
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoText}>
              ✓ Friend must use your code during signup{'\n'}
              ✓ First order must be minimum ₹500{'\n'}
              ✓ ₹20 credited after successful pickup verification{'\n'}
              ✓ Balance auto-adjusts on your next booking{'\n'}
              ✓ Valid for genuine referrals only
            </Text>
          </View>
        </View>

        {/* Footer Note */}
        <View style={styles.footerNote}>
          <Text style={styles.footerText}>
            🌱 As a bootstrapped startup, we're building Scrapiz sustainably. Every referral helps us grow while keeping our service cost-effective for you!
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
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  // Wallet Card
  walletCard: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  walletGradient: {
    padding: 24,
  },
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  walletIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  walletTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    fontFamily: 'Inter-Bold',
  },
  balanceRow: {
    marginBottom: 16,
  },
  balanceItem: {
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.85)',
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  balanceAmount: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  balanceValue: {
    fontSize: 42,
    fontWeight: '800',
    color: 'white',
    fontFamily: 'Inter-Bold',
    marginLeft: 4,
  },
  balanceSubtext: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.75)',
    fontFamily: 'Inter-Regular',
  },
  pendingSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  pendingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  pendingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fbbf24',
    marginRight: 8,
  },
  pendingText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    fontFamily: 'Inter-SemiBold',
  },
  pendingSubtext: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'Inter-Regular',
    marginLeft: 14,
  },

  // Stats Row
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ecfdf5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#6b7280',
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },

  // How It Works
  howItWorksCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Inter-Bold',
    marginLeft: 10,
  },
  stepsContainer: {
    gap: 0,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepNumberBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#16a34a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
    fontFamily: 'Inter-Bold',
  },
  stepContent: {
    flex: 1,
    paddingBottom: 20,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 6,
  },
  stepDesc: {
    fontSize: 13,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  stepConnector: {
    width: 2,
    height: 24,
    backgroundColor: '#d1d5db',
    marginLeft: 17,
    marginVertical: -6,
  },

  // Code Section
  codeSection: {
    marginBottom: 20,
  },
  codeSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  codeCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#16a34a',
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  codeLeft: {
    flex: 1,
  },
  codeLabel: {
    fontSize: 11,
    color: '#6b7280',
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
    letterSpacing: 1,
  },
  codeText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#16a34a',
    fontFamily: 'Inter-Bold',
    letterSpacing: 2,
  },
  copyIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  copyText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#16a34a',
    fontFamily: 'Inter-SemiBold',
  },
  linkCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  linkText: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
    flex: 1,
    marginRight: 12,
  },

  // Share Section
  shareSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  shareButton: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  shareGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 10,
  },
  shareButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: 'white',
    fontFamily: 'Inter-Bold',
  },
  whatsappButton: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 10,
    borderWidth: 2,
    borderColor: '#25D366',
    shadowColor: '#25D366',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  whatsappText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#25D366',
    fontFamily: 'Inter-Bold',
  },

  // Benefits
  benefitsCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    gap: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  benefitIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ecfdf5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  benefitEmoji: {
    fontSize: 24,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  benefitDesc: {
    fontSize: 13,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },

  // Info Card
  infoCard: {
    backgroundColor: '#ecfdf5',
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#16a34a',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#16a34a',
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
  infoContent: {
    paddingLeft: 0,
  },
  infoText: {
    fontSize: 13,
    color: '#166534',
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
  },

  // Footer
  footerNote: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  footerText: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
    lineHeight: 18,
    textAlign: 'center',
  },
});
