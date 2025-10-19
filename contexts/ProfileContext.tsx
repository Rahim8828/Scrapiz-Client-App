import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PROFILE_STORAGE_KEY = '@scrapiz_user_profile';

export type ProfileData = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  profileImage: string;
};

type ProfileContextType = {
  profile: ProfileData;
  loadProfile: () => Promise<void>;
  updateProfile: (data: ProfileData) => Promise<void>;
  isLoading: boolean;
};

const defaultProfile: ProfileData = {
  fullName: 'Anas Farooqui',
  email: 'Farooquianas05@gmail.com',
  phone: '9920397636',
  address: 'R M 8, Zaheer Residential Society, Jogeshwari West, Mumbai - 400102',
  profileImage: '',
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const savedProfile = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      } else {
        setProfile(defaultProfile);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setProfile(defaultProfile);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: ProfileData) => {
    try {
      await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(data));
      setProfile(data);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, loadProfile, updateProfile, isLoading }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
