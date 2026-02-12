# JARVIS AI Assistant 🤖

<div align="center">

![JARVIS](https://img.shields.io/badge/JARVIS-AI%20Assistant-00d4ff?style=for-the-badge)
![Platform](https://img.shields.io/badge/Platform-Android-3DDC84?style=for-the-badge&logo=android)
![React Native](https://img.shields.io/badge/React%20Native-Expo-61DAFB?style=for-the-badge&logo=react)
![Language](https://img.shields.io/badge/Language-Hindi%2FHinglish-FF9933?style=for-the-badge)

**An AI-powered voice assistant for Android, inspired by Tony Stark's JARVIS from Iron Man**

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Commands](#-voice-commands) • [Contributing](#-contributing)

</div>

---

## ✨ Features

### 🎤 Voice Control
- **Hindi/Hinglish Support** - Natural language processing in Hindi and Hinglish
- **Conversation Context** - Remembers previous conversations
- **Smart Recognition** - Accurate voice recognition with noise filtering

### 📞 Communication
- **Call by Name** - "Mummy ko call karo"
- **SMS Integration** - Send messages via voice
- **Contact Search** - Fuzzy matching for Hindi names

### 📱 App Control
- **40+ Apps Supported** - YouTube, WhatsApp, Instagram, Paytm, and more
- **Quick Launch** - Voice-activated app opening
- **Smart Fallback** - Web search if app not found

### 💡 Device Control
- **Flashlight** - Voice-controlled torch
- **Brightness** - Adjust screen brightness
- **Volume** - Control system volume

### ⏰ Time Management
- **Alarms** - Set alarms with voice
- **Timers** - Quick timer setup
- **Reminders** - Voice-based reminders

### 🌤️ Information
- **Weather** - Real-time weather updates
- **News** - Latest news headlines
- **System Info** - Battery, network status

### 🗺️ Navigation
- **Location Services** - Get current location
- **Navigation** - Voice-guided navigation
- **Home Navigation** - Quick route to home

### 🎨 UI/UX
- **Arc Reactor Design** - Iron Man inspired interface
- **Dark/Light Themes** - Theme switching support
- **Smooth Animations** - Fluid user experience
- **Status Indicators** - Clear visual feedback

---

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Android device or emulator

### Setup

1. **Clone the repository:**
```bash
git clone https://github.com/YOUR_USERNAME/jarvis-ai.git
cd jarvis-ai
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env` file:**
```bash
cp .env.example .env
```

4. **Add your API keys in `.env`:**
```env
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
WEATHER_API_KEY=your_openweathermap_api_key_here
NEWS_API_KEY=your_news_api_key_here
```

5. **Start the development server:**
```bash
npm start
```

6. **Run on Android:**
```bash
npm run android
```

---

## 📖 Usage

1. **Launch the app**
2. **Grant permissions** (Contacts, SMS, Location, Notifications, etc.)
3. **Tap the Arc Reactor** to start listening
4. **Speak your command** in Hindi or Hinglish
5. **JARVIS will respond** and execute the command

---

## 🎤 Voice Commands

### Basic Commands
```
"YouTube chalao"          → Opens YouTube
"Mummy ko call karo"      → Calls Mom
"Torch jalao"             → Turns on flashlight
"Brightness 50 karo"      → Sets brightness to 50%
"5 minute ka timer lagao" → Sets 5-minute timer
"Mausam kaisa hai?"       → Gets weather info
"Aaj ki news sunao"       → Reads latest news
```

### Advanced Commands
```
"Raj ko SMS bhejo ki main late aaunga"  → Sends SMS
"Kal subah 7 baje alarm lagao"          → Sets alarm
"Connaught Place ka rasta dikhao"       → Starts navigation
"Battery kitni hai?"                     → Shows battery level
```

**For complete command list, see [USER_GUIDE.md](./USER_GUIDE.md)**

---

## 🛠️ Tech Stack

- **Framework:** React Native (Expo)
- **Language:** TypeScript
- **AI:** Google Gemini Pro
- **Voice:** @react-native-voice/voice
- **TTS:** expo-speech
- **Storage:** AsyncStorage
- **APIs:** OpenWeatherMap, News API

---

## 📦 Packages Used

```json
{
  "expo": "~54.0.33",
  "react-native": "0.81.5",
  "@react-native-voice/voice": "^3.2.4",
  "expo-speech": "~14.0.8",
  "expo-torch": "latest",
  "expo-sms": "latest",
  "expo-contacts": "latest",
  "expo-calendar": "latest",
  "expo-location": "latest",
  "expo-notifications": "latest",
  "@react-native-async-storage/async-storage": "latest",
  "@react-native-community/netinfo": "latest",
  "axios": "latest"
}
```

---

## 🔑 API Keys

### Required:
- **Gemini API** (Free) - [Get it here](https://makersuite.google.com/app/apikey)

### Optional:
- **OpenWeatherMap API** (Free) - [Get it here](https://openweathermap.org/api)
- **News API** (Free) - [Get it here](https://newsapi.org)

---

## 🎯 Supported Apps

### Social Media
YouTube, WhatsApp, Facebook, Instagram, Twitter, Telegram, Snapchat, LinkedIn

### Shopping
Amazon, Flipkart, Myntra, Meesho

### Payment
Paytm, PhonePe, Google Pay, BHIM

### Entertainment
Spotify, Netflix, Amazon Prime, Hotstar, Gaana, JioSaavn

### Food Delivery
Zomato, Swiggy

### Transport
Uber, Ola

### Google Apps
Gmail, Maps, Drive, Photos, Calendar, Chrome

---

## 📱 Permissions Required

- **Microphone** - Voice recognition
- **Contacts** - Call by name
- **SMS** - Send messages
- **Location** - Navigation & weather
- **Notifications** - Alarms & reminders
- **Brightness** - Screen control

---

## 🐛 Troubleshooting

**Voice not working?**
- Check microphone permission
- Reduce background noise
- Speak clearly

**Commands failing?**
- Check internet connection
- Verify permissions
- Restart the app

**Apps not opening?**
- Ensure app is installed
- Use correct app name

For more help, see [USER_GUIDE.md](./USER_GUIDE.md)

---

## 🗺️ Roadmap

- [ ] Wake word detection ("Hey JARVIS")
- [ ] Offline mode for basic commands
- [ ] Multi-language support
- [ ] Smart home integration
- [ ] Custom voice profiles
- [ ] Automation routines
- [ ] Widget support
- [ ] Wear OS support

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Suryansh Chaturvedi**

- GitHub: [@suryansh1914](https://github.com/suryansh1914)
- Email: suryanshchaturvedi282@gmail.com

---

## 🙏 Acknowledgments

- Inspired by Marvel's Iron Man
- Powered by Google Gemini AI
- Built with React Native & Expo
- Icons from [Expo Vector Icons](https://icons.expo.fyi)

---

## ⚠️ Disclaimer

This is a personal project and is not affiliated with Marvel, Disney, or any other entity. JARVIS and Iron Man are trademarks of Marvel Entertainment, LLC.

---

<div align="center">

**Made with ❤️ and lots of ☕**

⭐ Star this repo if you like it!

</div>
