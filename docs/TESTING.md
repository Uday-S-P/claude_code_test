# Testing Guide - Property Area Verification App

## Overview

This document outlines testing procedures for all features of the Property Area Verification app, including PWA functionality, data persistence, and core features.

---

## **1. Data Persistence Testing (localStorage)**

### **Test 1.1: Auto-Save Functionality**
**Steps:**
1. Open https://uday-s-p.github.io/claude_code_test/
2. Upload a PDF and analyze rooms
3. Take some measurements
4. **Close the browser completely**
5. Reopen the URL

**Expected Result:**
- ✅ All analyzed rooms should be restored
- ✅ All measurements should be present
- ✅ Active tab should be restored
- ✅ Notification: "Previous session restored"

**Status:** Pass/Fail ___

---

### **Test 1.2: Clear Session**
**Steps:**
1. Have some data in the app
2. Click the red "Clear" button in header
3. Confirm the dialog
4. Refresh the page

**Expected Result:**
- ✅ All data cleared
- ✅ App resets to Upload tab
- ✅ No previous session data
- ✅ Notification: "Session cleared successfully"

**Status:** Pass/Fail ___

---

### **Test 1.3: Data Survival**
**Steps:**
1. Add data to the app
2. Close browser completely
3. Restart phone/computer
4. Reopen browser and load app

**Expected Result:**
- ✅ Data survives phone/computer restart
- ✅ All measurements intact

**Status:** Pass/Fail ___

---

## **2. Progressive Web App (PWA) Testing**

### **Test 2.1: Install to Home Screen (iPhone)**
**Steps:**
1. Open https://uday-s-p.github.io/claude_code_test/ in Safari
2. Tap Share button
3. Tap "Add to Home Screen"
4. Tap "Add"
5. Find icon on home screen
6. Tap to open

**Expected Result:**
- ✅ Icon appears on home screen
- ✅ Opens in full screen (no Safari UI)
- ✅ App loads correctly
- ✅ All features work

**Status:** Pass/Fail ___

---

### **Test 2.2: Install to Home Screen (Android)**
**Steps:**
1. Open https://uday-s-p.github.io/claude_code_test/ in Chrome
2. Tap menu (three dots)
3. Tap "Install App" or "Add to Home Screen"
4. Tap "Install"
5. Find icon on home screen
6. Tap to open

**Expected Result:**
- ✅ Icon appears on home screen
- ✅ Opens in full screen (no Chrome UI)
- ✅ App loads correctly
- ✅ All features work

**Status:** Pass/Fail ___

---

### **Test 2.3: Offline Mode**
**Steps:**
1. Load https://uday-s-p.github.io/claude_code_test/ once (with internet)
2. Wait for page to fully load
3. **Turn off WiFi and cellular data**
4. Reload the page
5. Try using the app

**Expected Result:**
- ✅ App still loads (from cache)
- ✅ UI is functional
- ✅ Can access previously saved data
- ✅ Bluetooth connection works (it's hardware, not internet)
- ⚠️ Cannot upload new PDFs from internet (expected)

**Status:** Pass/Fail ___

---

## **3. PDF Room Detection Testing**

### **Test 3.1: Multi-Word Room Names**
**Test Files:** docs/pdfs/Plan 1.pdf, Plan 2.pdf, Plan 3.pdf

**Steps:**
1. Upload Plan 1.pdf
2. Click "Extract Rooms" (Analysis tab)
3. Check detected rooms list

**Expected Result:**
- ✅ "MASTER BEDROOM" detected (2 words)
- ✅ "WALK IN CLOSET" detected (3 words)
- ✅ "LIVING ROOM" detected (if present)
- ✅ All multi-word names captured fully

**Actual Results:**
Plan 1.pdf: ___ rooms detected
Plan 2.pdf: ___ rooms detected
Plan 3.pdf: ___ rooms detected

**Status:** Pass/Fail ___

---

### **Test 3.2: Automatic Room Numbering**
**Steps:**
1. Upload a PDF with duplicate room names (e.g., multiple TERRACE, TOILET)
2. Extract rooms
3. Check room names in the table

**Expected Result:**
- ✅ First TERRACE → "TERRACE - 1"
- ✅ Second TERRACE → "TERRACE - 2"
- ✅ First TOILET → "TOILET - 1"
- ✅ Second TOILET → "TOILET - 2"
- ✅ Unique rooms have no number suffix

**Status:** Pass/Fail ___

---

### **Test 3.3: Dimension Format Handling**
**Steps:**
1. Upload PDFs with various dimension formats
2. Check if dimensions are correctly parsed

**Formats to Test:**
- ✅ 11'-6" (standard feet-inches)
- ✅ 11-6 (hyphenated)
- ✅ 16'-10" (complex with multiple separators)
- ✅ Dimensions without X separator (space-separated)

**Status:** Pass/Fail ___

---

## **4. Bluetooth Integration Testing**

### **Test 4.1: GLM 50C Connection**
**Prerequisites:** Bosch GLM 50C device

**Steps:**
1. Click "Connect" button in header
2. Select GLM 50C from Bluetooth devices
3. Wait for connection

**Expected Result:**
- ✅ Button changes to "Connected" (green)
- ✅ Device successfully paired
- ✅ No connection errors

**Status:** Pass/Fail ___

---

### **Test 4.2: Live Measurements**
**Prerequisites:** Connected GLM 50C

**Steps:**
1. Go to Measurements tab
2. Click "Capture Length" on a room
3. Take measurement with GLM device
4. Repeat for Breadth

**Expected Result:**
- ✅ Measurement value appears immediately
- ✅ "Last GLM" reading shows in header
- ✅ Values are in feet
- ✅ Area auto-calculates

**Status:** Pass/Fail ___

---

## **5. Export Functionality Testing**

### **Test 5.1: RERA CSV Export**
**Steps:**
1. Complete room analysis and measurements
2. Go to Export tab
3. Click "Export RERA CSV Report"
4. Open downloaded CSV file in Excel/Google Sheets

**Expected Result:**
- ✅ File downloads as `RERA-Area-Calculation-{date}.csv`
- ✅ Header information present
- ✅ Section 1 table formatted correctly
- ✅ "As per" columns have planned dimensions
- ✅ "Actual" columns have measured dimensions (if taken)
- ✅ Subtotal A calculated correctly
- ✅ Up to 30 rows present

**Status:** Pass/Fail ___

---

### **Test 5.2: JSON Export**
**Steps:**
1. Complete room analysis and measurements
2. Go to Export tab
3. Click "Export JSON Report"
4. Open downloaded JSON file

**Expected Result:**
- ✅ File downloads as `property-verification-{timestamp}.json`
- ✅ Contains all project data
- ✅ Includes rooms, measurements, walls
- ✅ Includes summary and compliance score
- ✅ Valid JSON format

**Status:** Pass/Fail ___

---

## **6. Mobile Responsiveness Testing**

### **Test 6.1: Phone Layout (iPhone)**
**Steps:**
1. Open app on iPhone (any size)
2. Navigate through all tabs
3. Check UI elements

**Expected Result:**
- ✅ All elements visible and accessible
- ✅ Buttons are touch-friendly (minimum 44px)
- ✅ Text is readable (not too small)
- ✅ Tables scroll horizontally
- ✅ Navigation tabs scroll horizontally
- ✅ No overlapping elements

**Status:** Pass/Fail ___

---

### **Test 6.2: Phone Layout (Android)**
**Steps:**
1. Open app on Android phone
2. Navigate through all tabs
3. Check UI elements

**Expected Result:**
- ✅ All elements visible and accessible
- ✅ Buttons are touch-friendly
- ✅ Text is readable
- ✅ Tables scroll horizontally
- ✅ No overlapping elements

**Status:** Pass/Fail ___

---

### **Test 6.3: Tablet Layout**
**Steps:**
1. Open app on tablet (iPad/Android tablet)
2. Check responsive design

**Expected Result:**
- ✅ Uses larger screen space effectively
- ✅ Export buttons side-by-side (not stacked)
- ✅ Tables display more columns
- ✅ Larger text and buttons

**Status:** Pass/Fail ___

---

## **7. Cross-Browser Testing**

### **Test 7.1: Chrome (Desktop)**
- ✅ App loads correctly
- ✅ All features work
- ✅ PWA installable
- ✅ localStorage works
- ✅ Service worker registers

**Status:** Pass/Fail ___

---

### **Test 7.2: Safari (iPhone)**
- ✅ App loads correctly
- ✅ Add to Home Screen works
- ✅ localStorage works
- ✅ Bluetooth works
- ✅ All features functional

**Status:** Pass/Fail ___

---

### **Test 7.3: Chrome (Android)**
- ✅ App loads correctly
- ✅ Install App works
- ✅ localStorage works
- ✅ Bluetooth works
- ✅ All features functional

**Status:** Pass/Fail ___

---

## **8. Unit Tests**

### **Test 8.1: Jest Unit Tests**
**Steps:**
```bash
npm test
```

**Expected Result:**
- ✅ 69 tests pass
- ✅ ~94% pass rate or higher
- ✅ No critical failures
- ✅ All core functions tested

**Status:** Pass/Fail ___

---

### **Test 8.2: Test Coverage**
**Steps:**
```bash
npm run test:coverage
```

**Expected Result:**
- ✅ Coverage above 70% threshold
- ✅ Key functions covered
- ✅ Report generated successfully

**Status:** Pass/Fail ___

---

## **Test Summary**

| Category | Tests | Passed | Failed | Notes |
|----------|-------|--------|--------|-------|
| Data Persistence | 3 | | | |
| PWA Features | 3 | | | |
| PDF Detection | 3 | | | |
| Bluetooth | 2 | | | |
| Export | 2 | | | |
| Mobile Responsive | 3 | | | |
| Cross-Browser | 3 | | | |
| Unit Tests | 2 | | | |
| **TOTAL** | **21** | **__** | **__** | |

---

## **Known Issues**

Track any discovered issues here:

1.
2.
3.

---

## **Test Environment**

- **Date:** _______________
- **Tester:** _______________
- **App Version:** November 15, 2025
- **App URL:** https://uday-s-p.github.io/claude_code_test/
- **Devices Tested:**
  - iPhone: _______________
  - Android: _______________
  - Desktop: _______________

---

## **Notes**

Add any additional testing notes or observations here:
