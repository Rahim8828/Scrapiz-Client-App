import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ReferralContextType {
  walletBalance: number;
  setWalletBalance: (balance: number) => void;
  pendingBalance: number;
  setPendingBalance: (balance: number) => void;
  totalReferrals: number;
  setTotalReferrals: (count: number) => void;
  successfulReferrals: number;
  setSuccessfulReferrals: (count: number) => void;
  applyReferralDiscount: (amount: number) => number;
}

const ReferralContext = createContext<ReferralContextType | undefined>(undefined);

export function ReferralProvider({ children }: { children: ReactNode }) {
  const [walletBalance, setWalletBalance] = useState(120); // Total available balance
  const [pendingBalance, setPendingBalance] = useState(40); // Pending verification
  const [totalReferrals, setTotalReferrals] = useState(6);
  const [successfulReferrals, setSuccessfulReferrals] = useState(6);

  const applyReferralDiscount = (amount: number): number => {
    // Returns the discount that can be applied (min of wallet balance or order amount)
    return Math.min(walletBalance, amount);
  };

  return (
    <ReferralContext.Provider
      value={{
        walletBalance,
        setWalletBalance,
        pendingBalance,
        setPendingBalance,
        totalReferrals,
        setTotalReferrals,
        successfulReferrals,
        setSuccessfulReferrals,
        applyReferralDiscount,
      }}
    >
      {children}
    </ReferralContext.Provider>
  );
}

export function useReferral() {
  const context = useContext(ReferralContext);
  if (context === undefined) {
    throw new Error('useReferral must be used within a ReferralProvider');
  }
  return context;
}
