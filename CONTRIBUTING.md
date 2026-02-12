# Contributing to JARVIS AI 🤖

Dhanyavaad! Thank you for your interest in contributing to JARVIS AI! 🎉

## 🌟 How to Contribute

### 1. Fork the Repository
- GitHub par repository ko fork karo
- Apne account mein copy ban jayegi

### 2. Clone Your Fork
```bash
git clone https://github.com/YOUR_USERNAME/android-jarvis.git
cd android-jarvis
```

### 3. Create a Branch
```bash
git checkout -b feature/amazing-feature
```

**Branch naming convention:**
- `feature/` - Naye features ke liye
- `fix/` - Bug fixes ke liye
- `docs/` - Documentation updates ke liye
- `refactor/` - Code refactoring ke liye

### 4. Make Your Changes
- Code likhte waqt existing style follow karo
- Comments Hindi ya English mein likh sakte ho
- TypeScript types properly use karo

### 5. Test Your Changes
```bash
npm start
npm run android
```

### 6. Commit Your Changes
```bash
git add .
git commit -m "Add: Amazing new feature"
```

**Commit message format:**
- `Add:` - Naya feature
- `Fix:` - Bug fix
- `Update:` - Existing feature update
- `Docs:` - Documentation changes
- `Refactor:` - Code refactoring

### 7. Push to Your Fork
```bash
git push origin feature/amazing-feature
```

### 8. Create Pull Request
- GitHub par jao
- "New Pull Request" button click karo
- Apne changes ka description likho
- Submit karo!

---

## 📋 Pull Request Guidelines

### ✅ Do's:
- Clear description likho
- Screenshots add karo (agar UI changes hain)
- Test karo apne changes
- Existing code style follow karo
- Documentation update karo (agar zaruri ho)

### ❌ Don'ts:
- API keys commit mat karo
- Unnecessary files mat add karo
- Breaking changes bina discussion ke mat karo
- Code formatting mat bigado

---

## 🎯 Areas to Contribute

### 1. New Features
- Wake word detection ("Hey JARVIS")
- Offline mode
- Settings screen
- Theme switching UI
- Calendar integration
- Smart home control

### 2. Bug Fixes
- Voice recognition issues
- App crashes
- Permission handling
- API errors

### 3. Documentation
- README improvements
- Code comments
- User guide updates
- Translation (other languages)

### 4. UI/UX
- Better animations
- New themes
- Accessibility improvements
- Icon designs

### 5. Performance
- Faster response times
- Battery optimization
- Memory management
- Cache improvements

---

## 🐛 Reporting Bugs

Bug report karne ke liye:

1. **Check existing issues** - Pehle dekho koi aur ne report kiya hai ya nahi
2. **Create new issue** - "Bug Report" template use karo
3. **Provide details:**
   - Bug ka clear description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (agar possible ho)
   - Device info (Android version, phone model)

---

## 💡 Suggesting Features

Naya feature suggest karne ke liye:

1. **Check existing issues** - Dekho koi aur ne suggest kiya hai ya nahi
2. **Create new issue** - "Feature Request" template use karo
3. **Explain clearly:**
   - Feature ka purpose
   - Use case
   - Implementation ideas (optional)

---

## 📝 Code Style

### TypeScript/JavaScript
```typescript
// Good
export class MyService {
    static async doSomething(param: string): Promise<string> {
        try {
            // Implementation
            return 'Success';
        } catch (error) {
            console.error('Error:', error);
            return 'Failed';
        }
    }
}

// Comments Hindi ya English mein
// Ye function SMS bhejta hai
static async sendSMS(number: string, message: string): Promise<boolean> {
    // Implementation
}
```

### File Naming
- Components: `PascalCase.tsx` (e.g., `ArcReactor.tsx`)
- Services: `PascalCase.ts` (e.g., `SMSService.ts`)
- Utils: `PascalCase.ts` (e.g., `HindiHelper.ts`)
- Constants: `PascalCase.ts` (e.g., `Colors.ts`)

---

## 🤝 Code of Conduct

### Be Respectful
- Sabka respect karo
- Constructive feedback do
- Inclusive bano

### Be Helpful
- Beginners ki help karo
- Questions ka answer do
- Knowledge share karo

### Be Professional
- Spam mat karo
- Off-topic discussions mat karo
- Guidelines follow karo

---

## 📞 Questions?

Koi doubt ho to:

1. **GitHub Issues** - Question poocho
2. **Discussions** - Community se baat karo
3. **Email** - suryansh1914@users.noreply.github.com

---

## 🎉 Recognition

Contributors ko README mein credit denge! ⭐

---

**Happy Coding! 🚀**

Made with ❤️ for the JARVIS AI community
