# 🌱 Scrapiz - Online Scrap Selling Platform

<div align="center">

![Scrapiz Logo](./assets/images/Logo%20without%20S.png)

**India's #1 Platform for Selling Scrap Online**

[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

[Download App](#) • [Report Bug](https://github.com/yourusername/Scrapiz-Client-App/issues) • [Request Feature](https://github.com/yourusername/Scrapiz-Client-App/issues)

</div>

---

## 📱 About Scrapiz

**Scrapiz** is a revolutionary mobile application that transforms the way Indians sell scrap. Built with **React Native** and **Expo**, our platform connects scrap sellers directly with verified buyers, ensuring fair prices, doorstep pickup, and instant payments.

### 🎯 Our Mission
Making scrap selling **simple**, **profitable**, and **eco-friendly** while promoting a circular economy and sustainable waste management across India.

---

## ✨ Key Features

### 🏠 **Home & Services**
- 📊 Real-time scrap rate calculator with live market prices
- 🔍 Search functionality for quick category access
- 📍 Location-based service availability check
- 🌟 Featured categories: E-Waste, Metal, Paper, Plastic, Cardboard

### 🛒 **Smart Selling System**
- 📸 Multi-image upload with photo guidelines
- ⚖️ Accurate weight estimation
- 💰 Instant price calculation
- 📅 Flexible pickup scheduling
- 📝 Order summary with detailed breakdown

### 👤 **User Management**
- 🔐 Secure email & password authentication
- 📱 Google Sign-In integration
- 👨‍💼 Comprehensive profile management
- 📍 Multiple address management
- 🔔 Push notifications for order updates

### 🎁 **Referral & Rewards**
- 💸 Earn ₹10 per successful referral
- 🎯 Friends get ₹10 off on first order (min ₹500)
- 💳 Auto-adjusting wallet balance
- 📊 Real-time referral tracking
- 🔗 Easy sharing via WhatsApp, SMS, Social Media

### 📦 **Order Management**
- 🔄 Real-time order status tracking
- 📍 Live pickup agent location
- ⏱️ Estimated arrival time
- 💬 In-app communication
- ⭐ Rating & feedback system

### 🎨 **Modern UI/UX**
- 🌈 Beautiful gradient designs
- ⚡ Smooth animations & transitions
- 📱 Responsive layouts
- 🎭 Intuitive navigation
- ♿ Accessibility-first approach

---

## 🛠️ Tech Stack

### **Frontend**
- ⚛️ **React Native** - Cross-platform mobile framework
- 📱 **Expo** (SDK 51) - Development & deployment platform
- 🎨 **TypeScript** - Type-safe development
- 🧭 **Expo Router** - File-based navigation

### **UI/UX Libraries**
- 🎨 **expo-linear-gradient** - Beautiful gradients
- 🎭 **lucide-react-native** - Modern icon library
- 📅 **react-native-calendars** - Date picking
- 📍 **react-native-maps** - Map integration
- 📸 **expo-image-picker** - Photo uploads

### **State Management**
- ⚡ **React Context API** - Global state
- 🔄 **React Hooks** - Component state

### **Storage & API**
- 💾 **AsyncStorage** - Local data persistence
- 🌐 **Fetch API** - Network requests (ready for backend integration)

---

## 📂 Project Structure

```
Scrapiz-Client-App/
├── app/                          # Expo Router screens
│   ├── (auth)/                   # Authentication flows
│   │   ├── login.tsx            # Login screen
│   │   └── register.tsx         # Sign up screen
│   ├── (tabs)/                   # Main app tabs
│   │   ├── index.tsx            # Home tab
│   │   ├── sell.tsx             # Sell tab
│   │   ├── orders.tsx           # Orders tab
│   │   └── profile.tsx          # Profile tab
│   ├── profile/                  # Profile sub-screens
│   │   ├── edit-profile.tsx
│   │   ├── addresses.tsx
│   │   └── refer-friends.tsx
│   └── _layout.tsx              # Root layout
├── components/                   # Reusable components
│   ├── SplashScreen.tsx         # Animated splash
│   └── ScrapizLogo.tsx          # Brand logo
├── contexts/                     # React contexts
│   ├── AuthContext.tsx          # Authentication state
│   └── ReferralContext.tsx      # Referral system
├── assets/                       # Images & fonts
│   ├── images/
│   └── fonts/
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
```bash
node >= 18.0.0
npm >= 9.0.0
expo-cli >= 6.0.0
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/Scrapiz-Client-App.git
cd Scrapiz-Client-App
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npx expo start
```

4. **Run on device/emulator**
```bash
# iOS
npx expo start --ios

# Android
npx expo start --android

# Web
npx expo start --web
```

---

## 📸 Screenshots

<div align="center">

| Splash Screen | Login | Home |
|:---:|:---:|:---:|
| ![Splash](link) | ![Login](link) | ![Home](link) |

| Sell Tab | Orders | Profile |
|:---:|:---:|:---:|
| ![Sell](link) | ![Orders](link) | ![Profile](link) |

</div>

---

## 🌟 Key Highlights

### ♻️ **Environmental Impact**
- 🌍 Promoting sustainable waste management
- 🔄 Encouraging circular economy
- 🌱 Reducing landfill waste
- 💚 Supporting green initiatives

### 💼 **Business Model**
- 🤝 Direct seller-to-buyer connection
- 💰 Fair market-rate pricing
- 🚚 Free doorstep pickup (above 15kg)
- ⚡ Instant payment settlement
- 🎯 Commission-based revenue

### 🛡️ **Quality Assurance**
- ✅ Verified buyers & sellers
- 🔒 Secure transactions
- 📸 Photo documentation
- ⚖️ Accurate weight measurement
- ⭐ Rating & review system

---

## 🔜 Upcoming Features

- [ ] 🎥 Video verification for high-value items
- [ ] 🤖 AI-powered price estimation
- [ ] 💳 Multiple payment gateway integration
- [ ] 🗣️ Multi-language support (Hindi, Tamil, Telugu, etc.)
- [ ] 📊 Advanced analytics dashboard
- [ ] 🎮 Gamification & loyalty rewards
- [ ] 🌐 Web app version
- [ ] 🔔 Advanced notification system

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

**Scrapiz Team**
- Built with ❤️ by passionate developers
- Bootstrapped startup focused on sustainability
- Based in India 🇮🇳

---

## 📞 Contact & Support

- 📧 Email: support@scrapiz.in
- 🌐 Website: [scrapiz.in](https://scrapiz.in)
- 📱 Download: [Play Store](#) | [App Store](#)
- 💬 Feedback: [GitHub Issues](https://github.com/yourusername/Scrapiz-Client-App/issues)

---

## 🙏 Acknowledgments

- 🎨 Design inspiration from modern fintech apps
- 🔧 Built with amazing open-source libraries
- 🌟 Special thanks to our early adopters
- ♻️ Dedicated to making India cleaner & greener

---

<div align="center">

**Made with 💚 for a Sustainable Future**

⭐ Star us on GitHub — it motivates us a lot!

[⬆ Back to Top](#-scrapiz---online-scrap-selling-platform)

</div>
