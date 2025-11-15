# Property Area Verification System

A comprehensive web-based application for verifying property measurements against floor plan documents using OCR technology and Bluetooth-connected laser measuring devices.

## Project Overview

This repository contains tools for property verification and AI-assisted development:

1. **Property Area Verification App** - Web application for extracting and verifying room dimensions from floor plans
2. **Claude CLI Tool** - Command-line interface for interacting with Claude AI

## Main Application: Property Area Verification

### Description

The Property Area Verification System is a React-based web application that helps property surveyors, architects, and real estate professionals verify actual property measurements against planned dimensions from floor plans.

### Key Features

#### 1. Document Processing
- **Multi-format Support**: Upload PDF floor plans or images (JPEG, PNG, TIFF, BMP)
- **PDF Text Extraction**: Uses PDF.js to extract embedded text from floor plans
- **Smart Dimension Parsing**: Automatically detects room names and dimensions in various formats:
  - Feet-inches notation (e.g., 11'6" x 10'6")
  - Hyphenated format (e.g., 11-6 x 10-6)
  - Decimal feet (e.g., 11.5 x 10.5)
- **OCR Technology**: ✅ Tesseract.js integration for scanned documents with adaptive threshold preprocessing

#### 2. Bluetooth Integration
- **Bosch GLM 50C Support**: Real-time connection to Bluetooth laser distance measuring devices
- **Live Measurements**: Capture actual room dimensions directly from the measuring device
- **Measurement History**: Track all measurements taken during verification
- **Service UUID**: `00005301-0000-0041-5253-534f46540000`
- **Characteristic UUID**: `00004301-0000-0041-5253-534f46540000`

#### 3. Room Analysis
- **Automatic Room Detection**: Identifies rooms from floor plan text with confidence scoring
- **Intelligent Pattern Matching**:
  - Multi-word room names (LIVING ROOM, MASTER BEDROOM, WALK IN CLOSET)
  - Hyphenated names with numbers (BEDROOM-1, BEDROOM-2)
  - Optional X separator handling (11'-0" × 10'-8" or 11'-0" 10'-8")
  - Complex dimension formats (16'-10" with multiple separators)
- **Automatic Room Numbering**: Duplicate room names get sequential numbers (TERRACE - 1, TERRACE - 2)
- **Room Type Classification**: Categorizes rooms (bedroom, bathroom, kitchen, living, etc.)
- **Manual Entry**: Add or modify room data manually when needed
- **Dimension Conversion**: Automatic conversion between different measurement formats

#### 4. Verification & Comparison
- **Variance Calculation**: Compare planned vs. actual measurements with percentage variance
- **Tolerance Checking**: Configurable tolerance levels (default: 5%)
- **Status Indicators**:
  - Match (variance within tolerance)
  - Variance (exceeds tolerance)
  - Pending (measurement not yet taken)

#### 5. Wall Thickness Analysis
- **Auto-generation**: Creates wall data based on room adjacency
- **Smart Thickness**: Different thicknesses for internal, external, and wet-area walls
- **Thickness Verification**: Measure and verify actual wall thicknesses

#### 6. Data Persistence & PWA
- **Auto-Save**: All data automatically saved to localStorage
- **Session Restore**: Previous work loads automatically on app restart
- **Offline Mode**: Works without internet after first load (via service worker)
- **Install to Home Screen**: Use like a native app on iPhone/Android
- **Clear Session**: Reset and start fresh anytime
- **Data Survives**: App close, browser close, phone restart

#### 7. Export & Reporting
- **RERA CSV Export**: Export data in official RERA Area Calculation Sheet format
  - Follows standard template with all required sections
  - "As per" (Planned) vs "Actual" (Measured) columns
  - Professional format for regulatory compliance
- **JSON Export**: Complete data export with all measurements and analysis
- **Comprehensive Logs**: Detailed activity logging for audit trails

### Technology Stack

- **Frontend**: React 18 (with Babel transpilation)
- **Styling**: Tailwind CSS
- **PDF Processing**: PDF.js 3.11.174
- **OCR Engine**: Tesseract.js 2.1.5 with adaptive threshold preprocessing
- **Bluetooth**: Web Bluetooth API
- **Data Persistence**: localStorage API
- **PWA**: Service Worker + Web App Manifest
- **Hosting**: GitHub Pages (https://uday-s-p.github.io/claude_code_test/)
- **UI Components**: Custom React components with icon library
- **Testing**: Jest 29.7.0 + React Testing Library (69 unit tests, 94% pass rate)

### Architecture

The application follows a single-page architecture with tab-based workflow:

1. **Upload Tab**: Document upload and validation
2. **Analysis Tab**: AI-powered room extraction and parsing
3. **Measurements Tab**: Room dimension verification with Bluetooth device
4. **Walls Tab**: Wall thickness measurement and verification
5. **Export Tab**: Data export and reporting

### Intelligent Features

#### Room Detection Algorithm
```javascript
- Generic pattern matching for room names + dimensions
- Excludes non-room text (floor indicators, notes, etc.)
- Validates dimension plausibility (6-1000 sq ft)
- Fallback to sample data if no rooms detected
```

#### Dimension Parsing
```javascript
- Handles multiple formats: feet-inches, decimal, hyphenated
- Converts all to decimal feet internally
- Preserves original format for display
- Smart number pattern recognition (e.g., "1110" → 11'10")
```

#### OCR Enhancement
```javascript
- Adaptive threshold for image preprocessing
- Custom character whitelist/blacklist
- Common OCR error correction (ROC → ROOM, TORET → TOILET)
- High DPI rendering (300 DPI) for better accuracy
```

### Use Cases

1. **Property Verification**: Verify built property against approved floor plans
2. **Quality Control**: Ensure construction matches specifications
3. **Real Estate Documentation**: Document actual property dimensions
4. **Compliance Checking**: Verify adherence to building codes
5. **Dispute Resolution**: Provide documented evidence of actual measurements

### Browser Requirements

- Modern browser with Web Bluetooth API support (Chrome, Edge, Opera)
- JavaScript enabled
- File API support for document uploads
- **Mobile-Friendly**: Fully responsive design optimized for phones and tablets
  - Touch-friendly buttons with proper tap targets
  - Adaptive layouts that stack on mobile
  - Horizontal scrolling tables for data viewing
  - Optimized text sizes and spacing

### Getting Started

#### **Option 1: Use Online (Recommended)**
1. Visit **https://uday-s-p.github.io/claude_code_test/**
2. **On Phone (iPhone/Android):**
   - Safari/Chrome → Share → "Add to Home Screen"
   - Opens like a native app!
3. Upload a floor plan PDF or image
4. Review auto-detected rooms (or add manually)
5. Connect Bluetooth laser measuring device (optional)
6. Take measurements and verify against plan
7. Export results to RERA CSV or JSON

#### **Option 2: Run Locally**
1. Open `src/web-app/index.html` in a supported browser
2. Follow steps 3-7 above

**Note:** Online version has full PWA features (offline mode, data persistence)

### Testing

The project includes comprehensive unit tests for all core functionality:

```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

**Test Coverage:**
- ✅ Dimension conversion functions (feet-inches ↔ decimal)
- ✅ Variance calculation and status determination
- ✅ Area calculation
- ✅ Room type identification
- ✅ Room parsing from text
- ✅ Data validation

**Test Results:** 69 tests, 94% pass rate

---

## Utility: Claude CLI

### Description

A lightweight Python command-line tool for interacting with Anthropic's Claude AI directly from the terminal.

### Features

- Send prompts to Claude models from command line
- Support for multiple Claude models (Haiku, Sonnet, Opus)
- Configurable response length
- Secure API key management via `.env` file
- Shell script integration support

### Requirements

- Python 3.6+
- `anthropic` Python package
- `python-dotenv` package
- Anthropic API key

### Installation

1. Navigate to the CLI directory:
```bash
cd src/cli
```

2. Install required packages:
```bash
pip install -r requirements.txt
```

3. Create `.env` file in the project root with your API key:
```
ANTHROPIC_API_KEY=your_api_key_here
```

### Usage

Basic usage:
```bash
python src/cli/claude_cli.py "Your prompt here"
```

With specific model:
```bash
python src/cli/claude_cli.py "Explain quantum computing" -m claude-3-sonnet-20240229
```

With longer response:
```bash
python src/cli/claude_cli.py "Write a detailed analysis" -t 2048
```

### Available Models

- `claude-3-haiku-20240307` (fastest, default)
- `claude-3-sonnet-20240229`
- `claude-3-opus-20240229` (most capable)
- `claude-3-5-sonnet-20241022`

### Command-Line Options

- `-m, --model`: Specify Claude model (default: claude-3-haiku-20240307)
- `-t, --max-tokens`: Maximum response length (default: 1024)

---

## Project Structure

```
.
├── src/                           # Source code
│   ├── web-app/                   # Property verification web application
│   │   └── index.html            # Main web application (React SPA)
│   └── cli/                       # Command-line tools
│       ├── claude_cli.py         # Claude CLI utility
│       └── requirements.txt      # Python dependencies
├── docs/                          # Documentation
│   ├── images/                    # Screenshots, diagrams, planning
│   │   └── Plan_1.png            # Project planning diagram
│   └── guides/                    # User guides and tutorials
├── tests/                         # Test files
├── scripts/                       # Utility scripts
├── config/                        # Configuration files
├── .claude/                       # Claude Code configuration
├── .env                           # Environment variables (gitignored)
├── .gitignore                     # Git ignore rules
└── README.md                      # This file
```

## Security Considerations

### API Keys
- Never commit `.env` file to version control
- Add `.env` to `.gitignore`
- Rotate API keys periodically
- Use environment-specific keys

### Bluetooth Security
- Ensure device pairing security
- Verify device identity before connection
- Use secure connections only

### File Upload Security
- File type validation (PDF, images only)
- File size limits (50MB max)
- Client-side processing (no server upload)

## Technical Implementation

### Property Verification App

**Core Technologies**:
- React hooks for state management
- Canvas API for PDF rendering
- Web Workers for OCR processing
- Bluetooth GATT for device communication

**Data Flow**:
1. File Upload → Validation → Processing
2. PDF/Image → Text Extraction (PDF.js or OCR)
3. Text → Pattern Matching → Room Data
4. Bluetooth → Live Measurements → Comparison
5. Results → Variance Calculation → Export

### Claude CLI

**Architecture**:
- Single-file executable design
- Argparse for CLI interface
- Anthropic SDK for API communication
- Dotenv for configuration management

## Known Limitations

### Property Verification App
- Requires modern browser with Bluetooth support
- OCR accuracy depends on document quality
- Designed for standard floor plan formats
- Single-page application (no backend)

### Claude CLI
- Single-turn conversations only
- Text-only interactions
- No streaming responses
- No custom system prompts

## Future Enhancements

### Property Verification
- Multi-device support for team measurements
- Cloud storage for verification reports
- Mobile app version
- Advanced floor plan drawing recognition
- PDF report generation
- Historical comparison tracking

### Claude CLI
- Conversation history
- Streaming response support
- Image analysis capabilities
- Interactive mode
- Custom system prompts

## Contributing

This is a development/testing project. Contributions, suggestions, and improvements are welcome.

## License

This project is provided as-is for educational and professional use.

## Support

For issues or questions:
1. Check browser console for error messages
2. Verify Bluetooth device compatibility
3. Ensure PDF quality is sufficient for OCR
4. Review logs in the application for debugging

---

**Last Updated**: November 15, 2025
**Current Version**: November 15, 2025
**Status**: Production-ready with full features

**Recent Updates**:
- ✅ **PWA Implementation** - Install to home screen, works offline
- ✅ **Data Persistence** - Auto-save with localStorage
- ✅ **GitHub Pages Hosting** - Access from anywhere via URL
- ✅ **RERA CSV Export** - Official format for regulatory compliance
- ✅ **Automatic Room Numbering** - Duplicates get sequential numbers
- ✅ **Mobile-Responsive Design** - Touch-friendly, adaptive layouts
- ✅ **Improved PDF Detection** - Multi-word names, flexible formats
- ✅ **Comprehensive Testing** - 69 unit tests, 94% pass rate
