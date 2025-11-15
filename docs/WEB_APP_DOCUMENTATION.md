# Property Area Verification Web Application Documentation

## Overview

`src/web-app/index.html` is a **complete standalone web application** for property area verification. It's a single-file React application that runs entirely in your browser without needing a server.

## Core Functionality

### 1. **Floor Plan Document Processing**
- **Uploads**: Accepts PDF floor plans or images (JPEG, PNG, TIFF, BMP)
- **Text Extraction**: Uses PDF.js to extract text from PDF documents
- **OCR Processing**: ⏳ *Pending Implementation* - Will use Tesseract.js for scanned PDFs without text layers
- **Validation**: Checks file types, sizes (max 50MB), and prevents duplicates

### 2. **Intelligent Room Detection**
The app automatically extracts room information from floor plans:
- **Advanced Pattern Matching**: Finds room names followed by dimensions
  - Multi-word names: LIVING ROOM, MASTER BEDROOM, WALK IN CLOSET
  - Hyphenated with numbers: BEDROOM-1, BEDROOM-2, BEDROOM-3
  - Optional X separator: Handles both "11'-0" × 10'-8"" and "11'-0" 10'-8""
  - Complex formats: "16'-10"" with multiple separators (apostrophe + hyphen)
- **Multiple Formats**: Recognizes various dimension formats:
  - `11'6"` (feet-inches)
  - `11-6` (hyphenated)
  - `11.5` (decimal feet)
  - `1106` (glued digits → 11'6")
- **Automatic Room Numbering**: Duplicate room names get sequential numbers
  - TOILET, TOILET → TOILET - 1, TOILET - 2
  - TERRACE, TERRACE → TERRACE - 1, TERRACE - 2
  - Single rooms remain unchanged (no " - 1" suffix)
- **Smart Filtering**: Excludes non-room text like "FLOOR", "NOTE", "DETAILS"
- **Room Classification**: Categorizes rooms (bedroom, bathroom, kitchen, living, etc.)
- **Confidence Scoring**: Assigns confidence levels to detected rooms

### 3. **Bluetooth Device Integration**
Connects to **Bosch GLM 50C** laser distance measuring devices:
- **Real-time Connection**: Uses Web Bluetooth API to connect wirelessly
- **Live Measurements**: Captures distance measurements from the laser device
- **Measurement History**: Tracks all measurements taken during verification
- **Specific Configuration**: Uses GLM 50C's Bluetooth GATT service UUIDs
  - Service UUID: `00005301-0000-0041-5253-534f46540000`
  - Characteristic UUID: `00004301-0000-0041-5253-534f46540000`

### 4. **Dimension Verification**
Compares planned vs actual measurements:
- **Variance Calculation**: Calculates percentage difference between planned and actual dimensions
- **Tolerance Checking**: Default 5% tolerance (configurable)
- **Status Indicators**:
  - ✅ **Match**: Variance within tolerance
  - ❌ **Variance**: Exceeds tolerance
  - ⏳ **Pending**: Not yet measured
- **Area Calculations**: Automatically computes room areas (length × breadth)

### 5. **Wall Thickness Analysis**
- **Auto-generation**: Creates wall data based on room adjacency
- **Smart Thickness Assignment**:
  - External walls: 0.656 ft (≈8 inches / 0.20m)
  - Internal walls: 0.492 ft (≈6 inches / 0.15m)
  - Wet area walls: 0.656 ft (thicker for kitchens, bathrooms)
- **Measurement Verification**: Compare actual wall thickness against plans

### 6. **Manual Room Management**
- **Add Rooms**: Manually enter rooms not detected automatically
- **Edit Dimensions**: Modify detected room data
- **Remove Rooms**: Delete incorrect detections
- **Fallback Data**: If no rooms detected, provides sample data for testing

### 7. **Export & Reporting**
Two export formats available:
- **RERA CSV Export**: Official RERA Area Calculation Sheet format
  - Follows standardized template structure
  - Header section with client/project information
  - Section 1: Room Floor Area Calculations table
  - "As per" (Planned) vs "Actual" (Measured) columns
  - Up to 30 rows with subtotals
  - Professional format for regulatory compliance
- **JSON Export**: Complete data export with all measurements, variance analysis, and compliance scoring

### 8. **Data Persistence & Progressive Web App**
Complete data management and offline capability:
- **localStorage Auto-Save**:
  - Saves all data automatically on every change
  - Restores previous session on app restart
  - Data survives app close, browser close, phone restart
  - Storage: ~5-10MB (sufficient for hundreds of rooms)
- **Data Saved**:
  - Room analysis results from PDFs
  - All measurements (planned and actual dimensions)
  - Wall measurements and thickness data
  - Measurement history from Bluetooth device
  - Last GLM reading
  - Current active tab
- **Session Management**:
  - Auto-load on mount: `useEffect(() => loadFromLocalStorage(), [])`
  - Auto-save on change: `useEffect(() => saveToLocalStorage(), [data])`
  - Clear Session button with confirmation dialog
- **Progressive Web App Features**:
  - Service Worker for offline caching
  - Web App Manifest for installation
  - Install to home screen on iPhone/Android
  - Works offline after first load
  - Full-screen app experience
  - Hosted on GitHub Pages: https://uday-s-p.github.io/claude_code_test/

### 9. **Mobile-Responsive Design**
Fully optimized for phones and tablets:
- **Adaptive Layouts**: Stacks vertically on mobile, horizontal on desktop
- **Touch-Friendly**: All buttons meet minimum 44px tap target size
- **Responsive Text**: Font sizes adapt to screen size (text-xs sm:text-base)
- **Scrollable Tables**: Horizontal scroll on mobile to prevent data cutoff
- **Optimized Navigation**: Tab navigation scrolls horizontally on small screens
- **Smart Button Labels**: Shorter text on mobile ("RERA CSV Export" vs "Export RERA CSV Report")

### 10. **User Interface**
5-tab workflow:
1. **Upload**: Document upload and file management
2. **Analysis**: View detected rooms and extraction results
3. **Measurements**: Record actual room dimensions (with Bluetooth device)
4. **Walls**: Wall thickness verification
5. **Export**: Export verification results in RERA CSV or JSON format

## Technical Architecture

### Technology Stack

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| Frontend Framework | React | 18 | UI components and state management |
| Styling | Tailwind CSS | Latest (CDN) | Responsive design and styling |
| PDF Processing | PDF.js | 3.11.174 | Extract text from PDF documents |
| OCR Engine | Tesseract.js | 2.1.5 | OCR for scanned documents |
| Device Integration | Web Bluetooth API | Native | Connect to laser measuring devices |
| Data Persistence | localStorage API | Native | Auto-save and session management |
| PWA | Service Worker + Manifest | Native | Offline mode and installability |
| Hosting | GitHub Pages | - | Online access via HTTPS |
| Transpilation | Babel Standalone | Latest | JSX to JavaScript conversion |

### Advanced OCR Processing

> **⏳ Note**: OCR functionality is currently pending implementation. The sections below describe the planned OCR features.

#### Image Preprocessing
- **Resolution**: Converts PDF pages to 300 DPI images for optimal OCR accuracy
- **Adaptive Thresholding**: Applies intelligent contrast enhancement
- **Grayscale Conversion**: Converts to monochrome for better text detection

#### OCR Configuration
```javascript
{
  tessedit_pageseg_mode: '6',           // Uniform block of text
  preserve_interword_spaces: '1',       // Keep spacing
  user_defined_dpi: '300',              // High resolution
  tessedit_char_whitelist: "...",       // Only valid characters
  tessedit_char_blacklist: "_{}[]()..." // Exclude symbols
}
```

#### Error Correction
Common OCR mistakes automatically fixed:
- `ROC` → `ROOM`
- `TORET` → `TOILET`
- Smart quote normalization
- Whitespace cleanup

### Data Conversion & Validation

#### Dimension Parsing Algorithm
```javascript
Input formats supported:
1. Feet-inches: 11'6" or 11'-6"
2. Hyphenated: 11-6
3. Decimal feet: 11.5
4. Glued digits: 1106 → 11'6"
5. Feet only: 11'

All converted to decimal feet internally
Example: 11'6" → 11.5 feet
```

#### Plausibility Checks
- **Dimension Range**: 0-60 feet per side
- **Area Range**: 6-1000 square feet
- **Inch Validation**: Must be < 12 when in feet-inches format
- **Type Validation**: Numeric values only

### Room Detection Algorithm

#### Pattern Matching
```regex
Generic room pattern (Phase 1 - Enhanced):
([A-Z][A-Z\s\-0-9]*[A-Z0-9])\s+([\d]+[-''\s]+[\d]+[""]?)\s*(?:[xX×]\s*)?([\d]+[-''\s]+[\d]+[""]?)

Improvements:
- Multi-word names: [A-Z\s\-0-9]* captures spaces, hyphens, numbers
- Hyphenated with numbers: BEDROOM-1, BEDROOM-2
- Complex dimensions: [\d]+[-''\s]+[\d]+ handles multiple separators (16'-10")
- Optional X separator: (?:[xX×]\s*)? - handles both "11'-0" × 10'-8"" and "11'-0" 10'-8""
- Non-capturing group: (?:...) for X separator doesn't create extra match group
- Greedy matching: [A-Z\s\-0-9]* captures full room names

Matches:
- Room name (one or more words, with hyphens and numbers)
- Optional dimension separator (×, x, X, or just spaces)
- Length and breadth in various formats
```

#### Exclusion List
Words excluded from room names:
- `FLOOR`, `ENTRY`, `LANDSCAPE`
- `PROVISION`, `CHARGING`, `POINT`
- `NOTE`, `DETAILS`, `SUBJECT`
- `SANCTION`, `SERVICES`, `STRUCTURAL`

#### Room Type Classification
```javascript
Bedroom: "bedroom", "bed room"
Bathroom: "toilet", "bathroom", "bath"
Kitchen: "kitchen"
Living: "lounge", "living", "hall"
Dining: "dining"
Storage: "closet", "store"
Outdoor: "terrace", "balcony", "sitout"
Utility: "utility"
Office: "office", "study"
Other: Everything else
```

### Data Flow Architecture

```
┌─────────────────────────────────────────────────┐
│           1. FILE UPLOAD                        │
│  User uploads PDF or image → Validation         │
└─────────────────┬───────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────┐
│           2. TEXT EXTRACTION                    │
│  PDF.js (text layer) OR Tesseract.js (OCR)     │
└─────────────────┬───────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────┐
│           3. PATTERN MATCHING                   │
│  Regex patterns → Extract room data             │
└─────────────────┬───────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────┐
│           4. DATA STRUCTURING                   │
│  Room objects with planned dimensions           │
└─────────────────┬───────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────┐
│           5. BLUETOOTH INTEGRATION              │
│  Connect GLM 50C → Capture measurements         │
└─────────────────┬───────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────┐
│           6. VARIANCE CALCULATION               │
│  Compare planned vs actual → Status             │
└─────────────────┬───────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────┐
│           7. EXPORT & REPORTING                 │
│  Generate verification report                   │
└─────────────────────────────────────────────────┘
```

## Use Cases

### 1. Property Surveyors
**Scenario**: Verify that constructed property matches approved floor plans

**Workflow**:
1. Upload approved floor plan PDF
2. Review auto-detected room dimensions
3. Visit property with Bluetooth laser device
4. Measure each room using GLM 50C
5. Compare measurements against plan
6. Export variance report for client

**Benefits**:
- Eliminates manual calculation errors
- Faster verification process
- Professional documentation
- Evidence for discrepancies

### 2. Architects & Quality Control
**Scenario**: Ensure construction adheres to specifications

**Workflow**:
1. Upload architectural drawings
2. Track construction progress with periodic measurements
3. Identify deviations early in construction
4. Document compliance for building authorities

**Benefits**:
- Early detection of construction errors
- Reduced rework costs
- Compliance documentation
- Quality assurance

### 3. Real Estate Professionals
**Scenario**: Document actual property dimensions for listings

**Workflow**:
1. Upload developer-provided floor plans
2. Verify actual dimensions during property inspection
3. Provide accurate measurements to buyers
4. Avoid legal disputes over misrepresented dimensions

**Benefits**:
- Accurate property listings
- Buyer confidence
- Legal protection
- Professional credibility

### 4. Building Inspectors
**Scenario**: Compliance verification against building codes

**Workflow**:
1. Upload approved building plans
2. Inspect property and measure critical dimensions
3. Verify compliance with minimum room sizes
4. Document findings for approval process

**Benefits**:
- Systematic verification
- Audit trail
- Compliance reporting
- Reduced inspection time

### 5. Homeowners
**Scenario**: Verify what was built matches purchase agreement

**Workflow**:
1. Upload floor plan from sales brochure
2. Measure rooms after handover
3. Identify discrepancies
4. Negotiate with builder/developer

**Benefits**:
- Consumer protection
- Evidence for disputes
- Peace of mind
- Fair negotiation

## Step-by-Step Operational Guide

### Starting the Application

1. **Open the Application**
   ```bash
   # Navigate to project directory
   cd /path/to/claude_code_test

   # Open in browser
   open src/web-app/index.html
   # or
   chrome src/web-app/index.html
   ```

2. **Browser Requirements**
   - Chrome 56+ (recommended)
   - Edge 79+
   - Opera 43+
   - Bluetooth must be enabled

### Tab 1: Upload Documents

1. **Select File**
   - Click "Upload Document" or drag-and-drop
   - Supported formats: PDF, JPEG, PNG, TIFF, BMP
   - Maximum size: 50MB

2. **File Validation**
   - Application checks file type
   - Validates file size
   - Prevents duplicate uploads
   - Shows upload progress

3. **File Information Displayed**
   - File name and size
   - Upload date/time
   - Document type (PDF/Image)
   - Quality indicator
   - Image dimensions (for images)

### Tab 2: Analysis & Room Detection

1. **Run Analysis**
   - Click "Analyze Document"
   - Application shows processing logs
   - Progress indicator for OCR (if needed)

2. **Review Detected Rooms**
   - Room list with planned dimensions
   - Confidence scores
   - Room types (color-coded)
   - Original dimension format preserved

3. **Manual Adjustments**
   - Click "Add Room" to manually enter missing rooms
   - Edit detected room names or dimensions
   - Remove false detections
   - Verify all critical rooms are present

4. **Room Data Structure**
   ```javascript
   {
     id: 1,
     name: "MASTER BEDROOM",
     type: "bedroom",
     plannedLength: 13.83,        // feet (decimal)
     plannedBreadth: 12.5,        // feet (decimal)
     plannedArea: 172.88,         // sq ft
     originalLengthFormat: "13'-10\"",
     originalBreadthFormat: "12'-6\"",
     confidence: 0.95,
     originalText: "MASTER BEDROOM 13'-10\" × 12'-6\""
   }
   ```

### Tab 3: Room Measurements

1. **Connect Bluetooth Device** (Optional but recommended)
   - Click "Connect Bluetooth Device"
   - Enable Bluetooth on computer
   - Put GLM 50C in pairing mode
   - Select "GLM 50C" from device list
   - Wait for connection confirmation

2. **Take Measurements**

   **With Bluetooth Device**:
   - Select room from list
   - Point laser at wall
   - Press measure button on GLM 50C
   - Measurement auto-fills in app
   - Repeat for length and breadth

   **Without Bluetooth Device**:
   - Use any measuring tool (tape measure, etc.)
   - Manually enter measurements in feet
   - Click "Save" for each dimension

3. **View Comparison**
   - Planned vs Actual side-by-side
   - Variance percentage calculated
   - Status indicator (Match/Variance/Pending)
   - Color coding for quick assessment

### Tab 4: Wall Thickness Verification

1. **Review Generated Walls**
   - Application auto-generates wall list
   - Based on room adjacency
   - Smart thickness defaults assigned

2. **Measure Wall Thickness**
   - Use Bluetooth device or manual entry
   - Measure at multiple points
   - Record actual thickness
   - Compare against planned

3. **Wall Types**
   - Internal partition walls
   - External perimeter walls
   - Wet area walls (bathroom/kitchen)

### Tab 5: Export Results

1. **Review Summary**
   - Total rooms verified
   - Rooms within tolerance
   - Rooms with variance
   - Overall compliance percentage

2. **Export Options**
   - Export to CSV
   - Generate PDF report
   - Copy to clipboard
   - Print verification results

3. **Report Contents**
   - Property details
   - Room-by-room comparison
   - Variance analysis
   - Wall thickness data
   - Measurement timestamp
   - Device information

## Troubleshooting Guide

### Issue: No Rooms Detected

**Possible Causes**:
- PDF has scanned images without text layer
- Poor scan quality
- Non-standard dimension format
- Floor plan uses metric units

**Solutions**:
1. Check OCR logs for extraction issues
2. Ensure document is right-side up
3. Try higher resolution scan (300+ DPI)
4. Manually add rooms using "Add Room" button
5. Verify dimension format (feet-inches expected)

### Issue: Bluetooth Connection Fails

**Possible Causes**:
- Browser doesn't support Web Bluetooth
- Bluetooth disabled on computer
- GLM 50C not in pairing mode
- Device already paired elsewhere

**Solutions**:
1. Use Chrome, Edge, or Opera browser
2. Enable Bluetooth in system settings
3. Put GLM 50C in pairing mode (refer to device manual)
4. Unpair device from other devices
5. Refresh browser page and retry
6. Check browser console for specific errors

### Issue: OCR Accuracy Problems

**Possible Causes**:
- Low resolution scan
- Poor contrast
- Skewed or rotated image
- Complex background patterns

**Solutions**:
1. Use high-resolution scans (300 DPI minimum)
2. Ensure good lighting and contrast
3. Align document straight before scanning
4. Remove watermarks if possible
5. Clean up scan (remove shadows, artifacts)
6. Try different scan settings

### Issue: Incorrect Room Dimensions

**Possible Causes**:
- OCR misread numbers
- Dimension format not recognized
- Decimal point misinterpreted

**Solutions**:
1. Check original document for dimension format
2. Manually correct dimensions
3. Verify feet vs inches interpretation
4. Check for decimal vs fraction notation

### Issue: High Variance in Measurements

**Possible Causes**:
- Incorrect measurement technique
- Measuring to wrong points
- Unit confusion (feet vs meters)
- Device calibration issue

**Solutions**:
1. Measure to same reference points as plan
2. Verify units (app expects feet)
3. Take multiple measurements and average
4. Calibrate laser device
5. Check if measurements include wall thickness

## Browser Console Logging

The application provides detailed logging for debugging:

```javascript
// Enable verbose logging
localStorage.setItem('debug', 'true');

// Log categories
[INFO] - General information
[WARN] - Warnings (non-critical issues)
[ERROR] - Errors requiring attention
[OCR] - OCR-specific messages
[BLUETOOTH] - Device connection logs
[PARSING] - Dimension parsing details
```

## Performance Optimization

### File Size Recommendations
- **Optimal**: 1-5 MB per PDF
- **Acceptable**: 5-20 MB
- **Slow**: 20-50 MB
- **Not Recommended**: > 50 MB

### OCR Performance
- **Fast**: 1-5 pages, simple layout
- **Moderate**: 6-10 pages, complex layout
- **Slow**: 10+ pages, hand-drawn plans

### Browser Performance
- Close unnecessary tabs
- Use modern browser versions
- Ensure adequate RAM (4GB+ recommended)
- Clear browser cache if sluggish

## Security & Privacy

### Data Storage
- **All processing client-side** - No data sent to servers
- **No cloud storage** - Everything stays on your device
- **Browser storage only** - LocalStorage for preferences
- **Clear data**: Clear browser cache to remove all information

### File Upload Security
- File type validation (whitelist only)
- File size limits enforced
- No executable file uploads
- Client-side processing only

### Bluetooth Security
- Secure GATT connection
- Device identity verification
- No data transmission beyond measurement values
- Connection requires user approval

## Future Development Roadmap

### Planned Features
1. **Multi-device Support**: Connect multiple laser devices simultaneously
2. **Cloud Sync**: Optional cloud backup of verification reports
3. **Mobile App**: Native iOS/Android versions
4. **Metric Support**: Add metric unit support alongside imperial
5. **PDF Reports**: Generate professional PDF reports
6. **Historical Tracking**: Compare measurements over time
7. **Team Collaboration**: Share verification projects
8. **Advanced OCR**: Support for hand-drawn plans
9. **3D Visualization**: Visualize floor plan from measurements
10. **Batch Processing**: Process multiple floor plans at once

### Known Limitations
- Single-user application (no multi-user support)
- No backend database (all data browser-local)
- Limited to Web Bluetooth compatible browsers
- Imperial units only (no metric)
- No CAD drawing import
- No automatic wall thickness detection from documents

## Technical Support

### Getting Help
1. Check this documentation first
2. Review browser console logs
3. Verify browser compatibility
4. Check Bluetooth device manual
5. Review common troubleshooting section

### Reporting Issues
When reporting problems, include:
- Browser name and version
- Operating system
- File type and size
- Console error messages
- Steps to reproduce
- Expected vs actual behavior

## License & Attribution

This application is part of the Property Area Verification System project.

### Third-Party Libraries
- React 18 - MIT License
- Tailwind CSS - MIT License
- PDF.js - Apache License 2.0
- Tesseract.js - Apache License 2.0
- Web Bluetooth API - W3C Standard

---

**Document Version**: 1.0
**Last Updated**: November 15, 2025
**Application Status**: Working Prototype with Bluetooth Integration
