import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Alert,
} from 'react-native';
import { ArrowLeft, Gift, Users, IndianRupee, Share2, Copy, MessageCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function ReferFriendsScreen() {
  const router = useRouter();
  const referralCode = 'RAJESH2024';
  const referralLink = `https://scrapiz.com/ref/${referralCode}`;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join me on Scrapiz and earn money by selling scrap! Use my referral code ${referralCode} and get ₹50 bonus. Download: ${referralLink}`,
        title: 'Join Scrapiz - Earn Money from Scrap!',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share. Please try again.');
    }
  };

  const handleCopyCode = () => {
    // In a real app, you would copy to clipboard
    Alert.alert('Copied!', 'Referral code copied to clipboard');
  };

  const handleCopyLink = () => {
    // In a real app, you would copy to clipboard
    Alert.alert('Copied!', 'Referral link copied to clipboard');
  };

  const referralStats = [
    { label: 'Friends Referred', value: '12', icon: Users, color: '#3b82f6' },
    { label: 'Total Earned', value: '₹600', icon: IndianRupee, color: '#16a34a' },
    { label: 'Pending Rewards', value: '₹150', icon: Gift, color: '#f59e0b' },
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Share Your Code',
      description: 'Share your unique referral code with friends and family',
    },
    {
      step: '2',
      title: 'Friend Signs Up',
      description: 'Your friend downloads the app and uses your referral code',
    },
    {
      step: '3',
      title: 'Both Earn Rewards',
      description: 'You both get ₹50 when they complete their first pickup',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Refer Friends</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <Text style={styles.heroEmoji}>🎁</Text>
          <Text style={styles.heroTitle}>Earn ₹50 for Every Friend!</Text>
          <Text style={styles.heroSubtitle}>
            Invite your friends to join Scrapiz and both of you earn ₹50 when they complete their first pickup.
          </Text>
        </View>

        <View style={styles.statsSection}>
          {referralStats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
                <stat.icon size={24} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.referralSection}>
          <Text style={styles.sectionTitle}>Your Referral Code</Text>
          <View style={styles.codeCard}>
            <Text style={styles.codeText}>{referralCode}</Text>
            <TouchableOpacity style={styles.copyButton} onPress={handleCopyCode}>
              <Copy size={16} color="#16a34a" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.sectionTitle}>Referral Link</Text>
          <View style={styles.linkCard}>
            <Text style={styles.linkText} numberOfLines={1}>{referralLink}</Text>
            <TouchableOpacity style={styles.copyButton} onPress={handleCopyLink}>
              <Copy size={16} color="#16a34a" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.shareSection}>
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Share2 size={20} color="white" />
            <Text style={styles.shareButtonText}>Share with Friends</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.whatsappButton}>
            <MessageCircle size={20} color="#25d366" />
            <Text style={styles.whatsappButtonText}>Share on WhatsApp</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.howItWorksSection}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          {howItWorks.map((step, index) => (
            <View key={index} style={styles.stepCard}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{step.step}</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDescription}>{step.description}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.termsSection}>
          <Text style={styles.termsTitle}>Terms & Conditions</Text>
          <Text style={styles.termsText}>
            • Referral bonus is credited after friend's first successful pickup{'\n'}
            • Maximum 10 referrals per month{'\n'}
            • Bonus amount may vary based on promotions{'\n'}
            • Scrapiz reserves the right to modify terms
          </Text>
        </View>
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
    justifyContent: 'space-between',
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
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  heroEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  referralSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  codeCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#16a34a',
  },
  codeText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#16a34a',
    fontFamily: 'Inter-SemiBold',
    letterSpacing: 2,
  },
  linkCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  linkText: {
    fontSize: 14,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
    flex: 1,
    marginRight: 12,
  },
  copyButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareSection: {
    marginBottom: 32,
  },
  shareButton: {
    backgroundColor: '#16a34a',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    fontFamily: 'Inter-SemiBold',
  },
  whatsappButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#25d366',
  },
  whatsappButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#25d366',
    fontFamily: 'Inter-SemiBold',
  },
  howItWorksSection: {
    marginBottom: 32,
  },
  stepCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#16a34a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    fontFamily: 'Inter-SemiBold',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
    lineHeight: 16,
  },
  termsSection: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  termsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  termsText: {
    fontSize: 12,
    color: '#92400e',
    fontFamily: 'Inter-Regular',
    lineHeight: 16,
  },
});
