# Progressive Web App (PWA) Setup Guide

## 🌐 Live App

**The app is now live!**

**URL:** https://uday-s-p.github.io/claude_code_test/

Access it from any device with a modern browser (iPhone, Android, Desktop).

---

## Overview

The Property Area Verification app is now a **Progressive Web App** that can:
- ✅ **Access online** via GitHub Pages URL
- ✅ **Work offline** after first load
- ✅ **Install to home screen** (like a native app)
- ✅ **Save data locally** (survives app close and phone restart)
- ✅ **Work on any phone** with a modern browser

## Features Implemented

### 1. **Data Persistence** (localStorage)
- ✅ Auto-saves all data on every change
- ✅ Restores previous session on app restart
- ✅ "Clear Session" button to start fresh
- ✅ Data saved:
  - Room analysis results
  - Measurements (planned and actual)
  - Wall measurements
  - Measurement history
  - Last GLM reading
  - Current tab position

### 2. **Progressive Web App** (PWA)
- ✅ `manifest.json` - App metadata for installation
- ✅ `service-worker.js` - Offline caching
- ✅ Apple iOS support with meta tags
- ✅ Android support

### 3. **Offline Capability**
- ✅ Works without internet after first load
- ✅ Caches all required resources
- ✅ Bluetooth still works offline

## How to Use

### **Quick Start (Recommended)**

1. **Open in any browser:**
   ```
   https://uday-s-p.github.io/claude_code_test/
   ```

2. **Start using immediately** - No installation required!

3. **Optional:** Install to home screen for app-like experience (see below)

---

### **Install to Home Screen (Optional but Recommended)**

Makes the app feel like a native app with full-screen mode.

#### **On iPhone (Safari):**
1. Open https://uday-s-p.github.io/claude_code_test/ in Safari
2. Tap the **Share** button (square with arrow at bottom)
3. Scroll down and tap **"Add to Home Screen"**
4. Tap **"Add"**
5. App icon appears on home screen! 📱

#### **On Android (Chrome):**
1. Open https://uday-s-p.github.io/claude_code_test/ in Chrome
2. Tap the **menu** (three dots)
3. Tap **"Add to Home Screen"** or **"Install App"**
4. Tap **"Install"**
5. App icon appears on home screen! 📱

**OR** Look for the install prompt/banner that appears automatically.

#### **Use Like a Native App:**
- ✅ Tap the icon on your home screen
- ✅ Opens in full screen (no browser UI)
- ✅ Works offline (after first load)
- ✅ Data persists between sessions
- ✅ Bluetooth works normally
- ✅ Feels just like a native app!

## Files Added

```
src/web-app/
├── manifest.json           # PWA metadata
├── service-worker.js       # Offline caching
├── icon-192.png           # App icon (192x192) - NEEDS TO BE CREATED
└── icon-512.png           # App icon (512x512) - NEEDS TO BE CREATED
```

## ⚠️ TODO: Create App Icons

You need to create two icon files:

### **icon-192.png** (192x192 pixels)
- For Android home screen
- For iOS home screen
- Suggested design: House icon with ruler/measurement theme

### **icon-512.png** (512x512 pixels)
- For high-res displays
- For splash screens
- Same design as 192px version

**Icon Guidelines:**
- Square format (192x192 or 512x512)
- Simple, clear design
- Works on light and dark backgrounds
- Represents property/measurement theme
- Save as PNG with transparency

**Quick Icon Creation:**
- Use Canva, Figma, or similar tools
- Or use an online icon generator
- Or hire a designer on Fiverr

**Temporary Solution:**
Until icons are created, the app will use browser defaults. The PWA still works, just won't have custom icons.

## How It Works

### **localStorage (Data Persistence)**
```javascript
// Auto-saves on every change
useEffect(() => {
    saveToLocalStorage();
}, [analysisResults, measurements, wallMeasurements]);

// Loads on app start
useEffect(() => {
    loadFromLocalStorage();
}, []);
```

**Storage Limit:** ~5-10MB (plenty for this app)
**Data Survives:** App close, browser close, phone restart
**Doesn't Survive:** Clearing browser data, uninstalling app

### **Service Worker (Offline Mode)**
Caches these resources:
- Main HTML file
- React libraries
- Tailwind CSS
- PDF.js library
- Service worker itself

**After first load:**
- App works completely offline
- Only PDFs/images need internet to upload
- Bluetooth works offline (it's hardware, not internet)

## Testing

### **Test Data Persistence:**
1. Upload a PDF and analyze it
2. Take some measurements
3. Close the browser/app completely
4. Reopen → All your data should be there!

### **Test Offline Mode:**
1. Load the app once (with internet)
2. Turn off WiFi/data
3. Reload the page → Should still work!
4. Upload a PDF → Works (local file)
5. Connect Bluetooth → Works (hardware)

### **Test PWA Installation:**
1. On phone, open in browser
2. Look for "Add to Home Screen" or install prompt
3. Install it
4. Open from home screen → Should open full-screen

## Browser Support

| Browser | Data Persistence | PWA Install | Offline Mode |
|---------|-----------------|-------------|--------------|
| Chrome (Desktop) | ✅ | ✅ | ✅ |
| Chrome (Android) | ✅ | ✅ | ✅ |
| Safari (iPhone) | ✅ | ✅ | ✅ |
| Edge (Desktop) | ✅ | ✅ | ✅ |
| Firefox (Desktop) | ✅ | ⚠️ Limited | ✅ |
| Samsung Internet | ✅ | ✅ | ✅ |

## Troubleshooting

**Data not saving?**
- Check browser console for errors
- Make sure localStorage isn't disabled
- Check if browser is in private/incognito mode

**Can't install as PWA?**
- Needs HTTPS (or localhost for testing)
- Check manifest.json is accessible
- Try Chrome/Safari (best support)

**Offline mode not working?**
- Service worker needs HTTPS to work (or localhost)
- Check browser console for registration errors
- Clear cache and reload once with internet

**Lost data?**
- Check if browser data was cleared
- localStorage clears if browser storage is cleared
- Use CSV export as backup!

## Future Enhancements

Possible additions:
- ⏳ IndexedDB for larger storage (>10MB)
- ⏳ Cloud sync (Google Drive, Dropbox)
- ⏳ Multiple session management
- ⏳ Import/Export session files
- ⏳ Background sync for pending uploads

## Version

- **PWA Version:** 1.0
- **Added:** November 15, 2025
- **Storage:** localStorage
- **Offline:** Service Worker
- **Platform:** Cross-platform (iOS, Android, Desktop)
