/**
 * PDF Room Detection Test Script
 * Tests the room parsing logic against actual PDF files
 */

const fs = require('fs');
const path = require('path');

// Try alternative: use pdfjs-dist instead which is what the app uses
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

/**
 * Room parsing logic - extracted from index.html
 */
function parseRoomData(text) {
    const logs = [];
    const log = (msg) => logs.push(msg);

    log('Parsing room data from extracted text...');
    log(`Full text length: ${text.length} characters`);

    const upperText = text.toUpperCase();
    const rooms = [];
    let roomId = 1;

    // IMPROVED: Generic pattern to match ANY room name followed by dimensions
    // OPTIONAL X separator - handles both "11'-0" × 10'-8"" and "11'-0" 10'-8""
    const genericRoomPattern = /([A-Z][A-Z\s\-0-9]*[A-Z0-9])\s+([\d]+[-''\s]+[\d]+[""]?)\s*(?:[xX×]\s*)?([\d]+[-''\s]+[\d]+[""]?)/gi;

    // Words to exclude (not room names)
    const excludeWords = ['FLOOR', 'ENTRY', 'LANDSCAPE', 'PROVISION', 'CHARGING', 'POINT', 'SINK', 'BELOW'];

    const matches = [...upperText.matchAll(genericRoomPattern)];
    log(`Found ${matches.length} potential room matches`);

    matches.forEach((match, index) => {
        const potentialRoomName = match[1].trim();
        const dim1 = match[2];
        const dim2 = match[3];

        log(`\nMatch ${index + 1}: "${potentialRoomName}" - ${dim1} × ${dim2}`);

        // Check if this is actually a room name
        const isExcluded = excludeWords.some(word => potentialRoomName.includes(word));

        if (!isExcluded && potentialRoomName.length > 2) {
            const lengthFt = convertToFeet(dim1);
            const widthFt = convertToFeet(dim2);
            const areaFt = lengthFt * widthFt;

            if (lengthFt > 0 && widthFt > 0) {
                const room = {
                    id: roomId++,
                    name: potentialRoomName,
                    type: determineRoomType(potentialRoomName),
                    plannedLength: parseFloat(lengthFt.toFixed(2)),
                    plannedBreadth: parseFloat(widthFt.toFixed(2)),
                    plannedArea: parseFloat(areaFt.toFixed(2)),
                    originalLengthFormat: dim1,
                    originalBreadthFormat: dim2,
                    confidence: 0.95,
                    originalText: `${potentialRoomName} ${dim1} × ${dim2}`
                };

                rooms.push(room);
                log(`✓ Added: ${potentialRoomName} = ${lengthFt.toFixed(2)}ft × ${widthFt.toFixed(2)}ft = ${areaFt.toFixed(2)} sq ft`);
            } else {
                log(`✗ Skipped: Invalid dimensions`);
            }
        } else {
            log(`✗ Skipped: Excluded word or too short`);
        }
    });

    log(`\nRoom extraction complete. Total: ${rooms.length} rooms found`);
    return { rooms, logs };
}

/**
 * Convert feet-inches to decimal feet
 */
function convertToFeet(feetInches) {
    if (!feetInches) return 0;

    // Remove various quote styles and clean up
    const cleanInput = feetInches.toString()
        .replace(/["""'']/g, '')
        .replace(/\s+/g, '')
        .trim();

    // Try feet-inches format: 11-0, 11'0, 11-0, etc.
    let match = cleanInput.match(/^(\d+)[-'](\d+)$/);

    if (match) {
        const feet = parseInt(match[1], 10);
        const inches = parseInt(match[2], 10);
        return feet + (inches / 12);
    }

    // Try decimal format
    const decimal = parseFloat(cleanInput);
    return isNaN(decimal) ? 0 : decimal;
}

/**
 * Determine room type from name
 */
function determineRoomType(roomName) {
    if (!roomName) return 'other';
    const name = roomName.toUpperCase();

    if (name.includes('BEDROOM') || name.includes('MASTER')) return 'bedroom';
    if (name.includes('BATHROOM') || name.includes('TOILET') || name.includes('WC')) return 'bathroom';
    if (name.includes('KITCHEN')) return 'kitchen';
    if (name.includes('LIVING') || name.includes('LOUNGE') || name.includes('HALL')) return 'living';
    if (name.includes('DINING')) return 'dining';
    if (name.includes('BALCONY') || name.includes('TERRACE')) return 'balcony';
    if (name.includes('UTILITY') || name.includes('STORE')) return 'utility';
    if (name.includes('CLOSET') || name.includes('WARDROBE')) return 'storage';

    return 'other';
}

/**
 * Test a single PDF file
 */
async function testPDF(pdfPath) {
    console.log('\n' + '='.repeat(80));
    console.log(`Testing: ${path.basename(pdfPath)}`);
    console.log('='.repeat(80));

    try {
        // Read PDF file
        const dataBuffer = fs.readFileSync(pdfPath);
        const data = new Uint8Array(dataBuffer);

        // Parse PDF using PDF.js (same as the app)
        const loadingTask = pdfjsLib.getDocument({ data });
        const pdfDoc = await loadingTask.promise;

        console.log(`\nPDF Info:`);
        console.log(`  Pages: ${pdfDoc.numPages}`);

        // Extract text from all pages
        let fullText = '';
        for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
            const page = await pdfDoc.getPage(pageNum);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
                .map(item => item.str)
                .join(' ')
                .replace(/\s+/g, ' ')
                .trim();
            fullText += pageText + ' ';
        }

        const extractedText = fullText.trim();
        console.log(`  Text length: ${extractedText.length} characters`);
        console.log(`\nExtracted text preview (first 500 chars):`);
        console.log('-'.repeat(80));
        console.log(extractedText.substring(0, 500));
        console.log('-'.repeat(80));

        // Parse rooms from extracted text
        const { rooms, logs } = parseRoomData(extractedText);

        console.log(`\n📋 PARSING LOGS:`);
        logs.forEach(log => console.log(`  ${log}`));

        console.log(`\n🏠 DETECTED ROOMS (${rooms.length} total):`);
        console.log('='.repeat(80));

        if (rooms.length === 0) {
            console.log('  ⚠️  NO ROOMS DETECTED!');
        } else {
            rooms.forEach((room, index) => {
                console.log(`\n${index + 1}. ${room.name}`);
                console.log(`   Type: ${room.type}`);
                console.log(`   Dimensions: ${room.originalLengthFormat} × ${room.originalBreadthFormat}`);
                console.log(`   Decimal: ${room.plannedLength} ft × ${room.plannedBreadth} ft`);
                console.log(`   Area: ${room.plannedArea} sq ft`);
                console.log(`   Confidence: ${room.confidence * 100}%`);
            });
        }

        return rooms;

    } catch (error) {
        console.error(`\n❌ Error processing PDF: ${error.message}`);
        throw error;
    }
}

/**
 * Compare detected rooms with expected rooms
 */
function compareResults(detected, expected, pdfName) {
    console.log(`\n\n${'='.repeat(80)}`);
    console.log(`COMPARISON: ${pdfName}`);
    console.log('='.repeat(80));

    console.log(`\nDetected: ${detected.length} rooms`);
    console.log(`Expected: ${expected.length} rooms`);

    let matches = 0;
    let missing = [];
    let extra = [];

    // Check each expected room
    expected.forEach(exp => {
        const found = detected.find(det =>
            det.name.toUpperCase().includes(exp.name.toUpperCase()) ||
            exp.name.toUpperCase().includes(det.name.toUpperCase())
        );

        if (found) {
            matches++;
            const lengthMatch = Math.abs(found.plannedLength - exp.length) < 0.2;
            const breadthMatch = Math.abs(found.plannedBreadth - exp.breadth) < 0.2;

            console.log(`\n✓ ${exp.name}`);
            console.log(`  Expected: ${exp.length} × ${exp.breadth}`);
            console.log(`  Detected: ${found.plannedLength} × ${found.plannedBreadth}`);
            console.log(`  Status: ${lengthMatch && breadthMatch ? '✓ MATCH' : '⚠️  DIMENSIONS DIFFER'}`);
        } else {
            missing.push(exp.name);
            console.log(`\n✗ ${exp.name}`);
            console.log(`  Expected: ${exp.length} × ${exp.breadth}`);
            console.log(`  Status: ❌ NOT DETECTED`);
        }
    });

    // Check for extra detected rooms
    detected.forEach(det => {
        const isExpected = expected.some(exp =>
            det.name.toUpperCase().includes(exp.name.toUpperCase()) ||
            exp.name.toUpperCase().includes(det.name.toUpperCase())
        );

        if (!isExpected) {
            extra.push(det.name);
        }
    });

    console.log(`\n\n📊 SUMMARY:`);
    console.log(`  Matches: ${matches}/${expected.length} (${Math.round(matches/expected.length*100)}%)`);
    if (missing.length > 0) {
        console.log(`  Missing: ${missing.join(', ')}`);
    }
    if (extra.length > 0) {
        console.log(`  Extra detected: ${extra.join(', ')}`);
    }
}

/**
 * Main test function
 */
async function runTests() {
    console.log('\n🧪 PDF ROOM DETECTION TEST SUITE');
    console.log('='.repeat(80));

    const pdfsDir = '/Users/uday.simha.prakash/Documents/Claude_Code_test/docs/pdfs';

    // Expected rooms for Plan 1.pdf (from user's reference data)
    const plan1Expected = [
        { name: 'MASTER BEDROOM', length: 11.0, breadth: 16.83 }, // 16'10" = 16.83ft
        { name: 'LOUNGE', length: 6.25, breadth: 13.75 }, // 6'3" × 13'9"
        { name: 'TOILET', length: 7.08, breadth: 5.33 }, // 7'1" × 5'4"
        { name: 'WALK IN CLOSET', length: 3.58, breadth: 5.33 }, // 3'7" × 5'4"
        { name: 'TERRACE', length: 11.5, breadth: 3.25 }, // 11'6" × 3'3"
        { name: 'TERRACE', length: 3.92, breadth: 7.25 }, // 3'11" × 7'3"
        { name: 'BEDROOM TWO', length: 11.0, breadth: 11.0 }, // 11'0" × 11'0"
        { name: 'TOILET', length: 5.0, breadth: 7.0 }, // 5'0" × 7'0"
        { name: 'WALK IN CLOSET', length: 5.67, breadth: 7.33 }, // 5'8" × 7'4"
    ];

    try {
        // Test Plan 1.pdf
        const plan1Path = path.join(pdfsDir, 'Plan 1.pdf');
        const detectedRooms = await testPDF(plan1Path);

        // Compare with expected results
        compareResults(detectedRooms, plan1Expected, 'Plan 1.pdf');

        console.log('\n\n✅ Test complete!');

    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        process.exit(1);
    }
}

// Run tests
runTests();
