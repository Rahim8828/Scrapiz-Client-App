# 🎁 Scrapiz Referral System

## Overview
A cost-effective, bootstrapped startup-friendly referral program that incentivizes user growth while maintaining financial sustainability.

## 💰 Referral Economics

### Reward Structure
- **Referrer earns:** ₹20 per successful referral
- **Referee gets:** ₹20 discount on first order
- **Minimum order value:** ₹500 for referee's first booking

### Why ₹20?
As a bootstrapped startup without external funding, we've designed this system to be:
1. **Sustainable** - Cost-effective for our limited budget
2. **Valuable** - Still meaningful enough to encourage referrals
3. **Win-Win-Win** - Referrer earns, referee saves, environment benefits

## 🔄 How It Works

### Step 1: User Shares Code
- Each user gets a unique referral code (e.g., SCRAPIZ2024)
- Can share via WhatsApp, SMS, social media
- Personalized referral link: `https://scrapiz.com/ref/[code]`

### Step 2: Friend Signs Up & Books
- New user signs up using referral code
- Books first scrap pickup worth minimum ₹500
- Code must be applied during signup/first booking

### Step 3: Rewards Distribution
- **After successful pickup verification:**
  - Referrer: ₹20 added to referral wallet
  - Referee: ₹20 discount applied on first order

## 💳 Referral Wallet System

### Balance Types
1. **Available Balance**
   - Money already verified and ready to use
   - Auto-adjusts on next booking

2. **Pending Balance**
   - Awaiting pickup verification
   - Typically clears within 24-48 hours after pickup

### Auto-Adjustment Feature
- **No manual redemption needed**
- When user books next pickup:
  - System automatically applies available wallet balance
  - Reduces total payable amount
  - Example: Order of ₹800 with ₹60 wallet = Pay only ₹740

### Benefits
- ✅ Seamless user experience
- ✅ No extra redemption steps
- ✅ Automatic cost savings
- ✅ Encourages repeat bookings

## 📊 User Interface Features

### 1. Referral Wallet Card
- Green gradient design matching brand
- Shows available balance prominently
- Pending balance indicator
- Auto-adjust message for clarity

### 2. Stats Dashboard
- Total referrals count
- Successful referrals
- ₹20 per referral display

### 3. How It Works Section
- Visual step-by-step guide
- Clear numbered steps with icons
- Easy-to-understand process

### 4. Share Options
- One-tap share button
- WhatsApp quick share
- Copy code/link functionality

### 5. Benefits Section
- Smart Savings explanation
- Win-Win-Win messaging
- Unlimited referrals highlight

### 6. Important Points Card
- Eligibility criteria
- Minimum order requirement
- Verification timeline
- Terms clarification

## 🎯 Eligibility & Rules

### For Referrer
- ✓ Must be registered Scrapiz user
- ✓ Unlimited referrals allowed
- ✓ ₹20 per successful referral
- ✓ Valid for genuine referrals only

### For Referee (New User)
- ✓ Must be new to Scrapiz
- ✓ Use referral code during signup
- ✓ First order minimum ₹500
- ✓ Pickup must be successfully completed
- ✓ ₹20 discount auto-applied

### Verification Process
1. New user signs up with code
2. Books pickup (min ₹500)
3. Pickup team completes collection
4. Admin verifies the pickup
5. ₹20 credited to referrer's wallet
6. Referee's ₹20 discount applied

## 💡 Business Logic

### Cost-Effectiveness
- **Customer Acquisition Cost (CAC):** ₹40 per new customer (₹20 + ₹20)
- **Average Order Value:** ₹800-1200
- **Minimum Order Requirement:** ₹500 (filters serious users)
- **ROI:** Positive from first order itself

### Fraud Prevention
- Minimum order requirement (₹500)
- Verification after successful pickup
- Genuine user validation
- No cash payout (wallet credits only)

### Growth Strategy
- Word-of-mouth marketing
- Viral coefficient potential
- User-driven acquisition
- Low-cost scaling

## 🎨 Design Philosophy

### Custom-Coded Feel
- **Not AI-Generic:**
  - Custom gradient combinations
  - Thoughtful spacing and shadows
  - Brand-consistent green theme
  - Micro-interactions

- **Professional Polish:**
  - Smooth transitions
  - Proper visual hierarchy
  - Consistent typography
  - Attention to detail

### Brand Integration
- Primary green: #16a34a
- Gradient flow: #16a34a → #15803d → #166534
- White space optimization
- Lucide icons for consistency

## 📱 Technical Implementation

### State Management
```typescript
const [walletBalance, setWalletBalance] = useState(120);
const [pendingBalance, setPendingBalance] = useState(40);
const [totalReferrals, setTotalReferrals] = useState(6);
const [successfulReferrals, setSuccessfulReferrals] = useState(6);
```

### Share Functionality
- Native Share API integration
- Clipboard API for copy
- WhatsApp deep linking ready
- Custom share messages

### UI Components
- LinearGradient for premium feel
- Lucide React Native icons
- TouchableOpacity for interactions
- ScrollView with proper padding

## 🚀 Future Enhancements

### Potential Additions
1. **Referral Tiers**
   - Bronze: 1-5 referrals
   - Silver: 6-15 referrals
   - Gold: 16+ referrals
   - Higher tier = bonus rewards

2. **Limited Time Bonuses**
   - Festival specials
   - Milestone celebrations
   - Flash referral campaigns

3. **Leaderboard**
   - Top referrers of the month
   - Gamification elements
   - Additional rewards for top 10

4. **Social Proof**
   - "Your friend X just earned ₹20!"
   - Referral success stories
   - Community impact stats

## 📈 Success Metrics

### Track:
- Referral conversion rate
- Average referrals per user
- Wallet balance utilization
- Repeat booking rate
- CAC vs LTV ratio

### Goals:
- 15% referral conversion rate
- 2+ referrals per active user
- 80%+ wallet utilization
- Cost-positive acquisition

## 🌱 Startup-Friendly Message

**Footer Note:**
"As a bootstrapped startup, we're building Scrapiz sustainably. Every referral helps us grow while keeping our service cost-effective for you!"

This messaging:
- ✓ Builds transparency and trust
- ✓ Creates emotional connection
- ✓ Justifies the ₹20 amount
- ✓ Encourages community support
- ✓ Differentiates from VC-funded competitors

---

**Built with ❤️ for sustainable growth and environmental impact**
