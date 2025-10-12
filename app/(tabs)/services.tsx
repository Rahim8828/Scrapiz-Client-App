import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Hammer, Wrench, Building, Trash2, ChevronRight, FileText } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export const services = [
  { id: 'demolition', title: 'Demolition Service', description: 'Building and structure demolition', icon: Hammer, color: '#dc2626', bgColor: '#fef2f2' },
  { id: 'dismantling', title: 'Dismantling', description: 'Equipment and machinery dismantling', icon: Wrench, color: '#ea580c', bgColor: '#fff7ed' },
  { id: 'paper-shredding', title: 'Paper Shredding', description: 'Secure document shredding', icon: FileText, color: '#0891b2', bgColor: '#f0f9ff' },
  { id: 'society-tieup', title: 'Society Tie-up', description: 'Scrap collection for societies', icon: Building, color: '#7c3aed', bgColor: '#f5f3ff' },
  { id: 'junk-removal', title: 'Junk Removal', description: 'Household and office junk removal', icon: Trash2, color: '#059669', bgColor: '#f0fdf4' },
];

export default function ServicesScreen() {
  const router = useRouter();

  const handleServiceSelect = (service: typeof services[0]) => {
    router.push(`/services/${service.id}`);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#16a34a', '#15803d']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Our Services</Text>
        <Text style={styles.headerSubtitle}>Professional services for all your needs</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.servicesList}>
          {services.map((service) => (
            <TouchableOpacity 
              key={service.id} 
              style={[styles.serviceCard, { backgroundColor: service.color }]}
              onPress={() => handleServiceSelect(service)}
              activeOpacity={0.8}
            >
              <View style={[styles.serviceIcon, { backgroundColor: 'white' }]}>
                <service.icon size={22} color={service.color} />
              </View>
              <View style={styles.serviceTextContainer}>
                <Text style={styles.serviceTitle}>{service.title}</Text>
                <Text style={styles.serviceDescription}>{service.description}</Text>
              </View>
              <ChevronRight size={20} color="#f1f5f9" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Why Choose Us?</Text>
          <View style={styles.infoList}>
            <Text style={styles.infoItem}>✓ Professional & Experienced Team</Text>
            <Text style={styles.infoItem}>✓ Competitive & Transparent Pricing</Text>
            <Text style={styles.infoItem}>✓ Eco-Friendly Disposal Methods</Text>
            <Text style={styles.infoItem}>✓ Fully Insured & Licensed</Text>
            <Text style={styles.infoItem}>✓ Quick Response & Flexible Scheduling</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8fafc' 
  },
  header: { 
    paddingTop: 60, 
    paddingHorizontal: 24, 
    paddingBottom: 24, 
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: { 
    fontSize: 24, 
    fontWeight: 'bold',
    color: 'white', 
    fontFamily: 'Inter-Bold', 
    textAlign: 'center', 
    marginBottom: 4 
  },
  headerSubtitle: { 
    fontSize: 15, 
    color: '#a7f3d0', 
    fontFamily: 'Inter-Regular', 
    textAlign: 'center' 
  },
  content: { 
    flex: 1, 
    padding: 16 
  },
  servicesList: { 
    marginBottom: 24 
  },
  serviceCard: { 
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2
  },
  serviceIcon: { 
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16
  },
  serviceTextContainer: {
    flex: 1,
    marginRight: 12
  },
  serviceTitle: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: 'white', 
    fontFamily: 'Inter-SemiBold',
    marginBottom: 3
  },
  serviceDescription: { 
    fontSize: 13, 
    color: 'white', 
    fontFamily: 'Inter-Regular',
    lineHeight: 18
  },
  infoCard: { 
    backgroundColor: '#ffffff', 
    borderRadius: 16, 
    padding: 20, 
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  infoTitle: { 
    fontSize: 17, 
    fontWeight: '600', 
    color: '#111827', 
    fontFamily: 'Inter-SemiBold', 
    marginBottom: 16 
  },
  infoList: { 
    gap: 10 
  },
  infoItem: { 
    fontSize: 14, 
    color: '#374151', 
    fontFamily: 'Inter-Regular', 
    lineHeight: 20 
  },
});
