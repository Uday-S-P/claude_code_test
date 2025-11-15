# Simulated & Placeholder Data Report

**File:** `src/web-app/index.html`
**Analysis Date:** November 15, 2025
**Purpose:** Identify all simulated, placeholder, or hardcoded data for potential replacement with real implementations

---

## SUMMARY

| Category | Type | Status | Lines | Impact |
|----------|------|--------|-------|--------|
| Sample Room Data | Fallback Data | ⚠️ Review | 424-448 | Medium - Only used when PDF parsing fails |
| Upload Progress | Simulated UX | ⚠️ Review | 261-264 | Low - Visual feedback only |
| Wall Adjacency | Random Generation | ⚠️ Review | 597 | Medium - Affects wall generation logic |
| Processing Time | Hardcoded Value | ⚠️ Review | 669 | Low - Display only |

---

## 1. SAMPLE ROOM DATA (Fallback)

### Location
**Lines:** 424-448
**Function:** `parseRoomData(text)`

### Description
When the PDF text extraction finds no rooms (regex pattern matching fails), the system generates fallback sample data to allow the user to continue testing the workflow.

### Hardcoded Values

```javascript
const sampleRooms = [
    {
        name: 'MASTER BEDROOM',
        length: 13.8,
        breadth: 12.5,
        originalLength: "13'-10\"",
        originalBreadth: "12'-6\""
    },
    {
        name: 'BEDROOM-2',
        length: 11.5,
        breadth: 10.5,
        originalLength: "11'-6\"",
        originalBreadth: "10'-6\""
    },
    {
        name: 'TOILET',
        length: 6.9,
        breadth: 5.9,
        originalLength: "6'-11\"",
        originalBreadth: "5'-11\""
    },
    {
        name: 'LOUNGE',
        length: 17.1,
        breadth: 13.5,
        originalLength: "17'-1\"",
        originalBreadth: "13'-6\""
    }
];
```

### When Triggered
- PDF has no extractable text
- Text exists but no room pattern matches found
- Pattern matching regex fails to find room dimensions

### Confidence Score
- Real data: 0.95
- Sample data: **0.85** (lower to indicate fallback)

### Original Text Marker
- Real data: Shows actual extracted text
- Sample data: **"{Room Name} (Sample Data)"**

### Impact Analysis

| Impact Area | Severity | Details |
|-------------|----------|---------|
| **User Confusion** | Medium | User might not realize they're seeing sample data |
| **Data Accuracy** | Low | Clearly marked as "Sample Data" in originalText |
| **Workflow Testing** | High | Allows testing without valid PDF |
| **Production Risk** | Low | Only triggers when parsing genuinely fails |

### Recommendation

**Option 1: Keep with Better Warning**
- ✅ Add prominent visual warning when sample data is used
- ✅ Add notification: "No rooms detected. Sample data loaded for demo purposes."
- ✅ Disable "Proceed to Measurements" until user manually adds rooms

**Option 2: Remove Fallback**
- ✅ Return empty array when no rooms found
- ✅ Show clear message: "No rooms detected. Please manually add rooms or upload a different PDF."
- ✅ Force user to manually enter room data

**Option 3: Smart Fallback (Recommended)**
- ✅ Keep fallback but add clear UI indicator
- ✅ Add "Clear Sample Data" button
- ✅ Log warning in analysis logs
- ✅ Show sample data in different color (e.g., yellow background)

---

## 2. SIMULATED UPLOAD PROGRESS

### Location
**Lines:** 261-264
**Function:** `processFiles(files)`

### Description
File upload progress is **simulated** with artificial delays rather than tracking actual file read progress. The progress bar increments in 20% steps with 100ms delays.

### Implementation

```javascript
for (let progress = 0; progress <= 100; progress += 20) {
    await new Promise(resolve => setTimeout(resolve, 100));
    setUploadProgress(prev => ({ ...prev, [file.name]: progress }));
}
```

### Progress Simulation

| Step | Progress | Delay | Total Time |
|------|----------|-------|------------|
| 1 | 0% | 0ms | 0ms |
| 2 | 20% | 100ms | 100ms |
| 3 | 40% | 100ms | 200ms |
| 4 | 60% | 100ms | 300ms |
| 5 | 80% | 100ms | 400ms |
| 6 | 100% | 100ms | 500ms |

**Total Time:** Always **500ms** regardless of file size

### Impact Analysis

| Impact Area | Severity | Details |
|-------------|----------|---------|
| **User Experience** | Low | Provides visual feedback |
| **Accuracy** | Low | Not real progress, but acceptable |
| **Large Files** | Medium | 50MB file shows as complete in 500ms (misleading) |
| **Performance** | None | Files load instantly anyway (client-side) |

### Why It's Simulated
- Files are selected via File API (already in memory)
- No actual upload to server occurs
- No network transfer happens
- File is immediately available as File object

### Recommendation

**Option 1: Keep Simulation (Current)**
- ✅ Works fine for UX feedback
- ✅ Simple implementation
- ❌ Misleading for large files

**Option 2: Remove Progress Bar**
- ✅ Honest - no fake progress
- ✅ Simpler code
- ❌ No visual feedback

**Option 3: Real Progress (Recommended)**
- ✅ Track actual FileReader progress
- ✅ Show accurate progress for large files
- ✅ Better UX for 50MB PDFs
- Implementation:
```javascript
const reader = new FileReader();
reader.onprogress = (event) => {
    const percent = (event.loaded / event.total) * 100;
    setUploadProgress(prev => ({ ...prev, [file.name]: percent }));
};
reader.onload = () => { /* Complete */ };
reader.readAsArrayBuffer(file);
```

---

## 3. RANDOM WALL ADJACENCY GENERATION

### Location
**Lines:** 595-607
**Function:** `generateWallsFromRooms(rooms)`

### Description
Wall generation between rooms uses **Math.random()** to determine which rooms are adjacent. This is non-deterministic and produces different results each time.

### Implementation

```javascript
for (let i = 0; i < rooms.length - 1; i++) {
    for (let j = i + 1; j < rooms.length; j++) {
        if (Math.random() > 0.6) {  // 40% chance of adjacency
            const thickness = getWallThickness(rooms[i].type, rooms[j].type);
            walls.push({
                id: wallId++,
                name: `Wall between ${rooms[i].name} and ${rooms[j].name}`,
                rooms: [rooms[i].name, rooms[j].name],
                plannedThickness: thickness
            });
        }
    }
}
```

### Probability

| Condition | Probability | Meaning |
|-----------|-------------|---------|
| `Math.random() > 0.6` | **40%** | Room pair has a wall |
| `Math.random() ≤ 0.6` | **60%** | Room pair has no wall |

### Impact Analysis

| Impact Area | Severity | Details |
|-------------|----------|---------|
| **Reproducibility** | High | Same PDF produces different walls each time |
| **Accuracy** | High | Random walls don't match actual floor plan |
| **User Confusion** | High | "Why did walls change when I re-analyzed?" |
| **Data Integrity** | High | Cannot verify actual building structure |

### Why It's Random
- System has no actual floor plan drawing/CAD data
- Cannot determine real adjacency from text alone
- Placeholder logic for demonstration

### Real-World Behavior
- Floor plans have specific, deterministic adjacencies
- Walls are fixed based on architecture
- Should be derived from actual floor plan layout

### Recommendation

**Option 1: Remove Random Generation (Recommended)**
- ✅ Don't auto-generate walls
- ✅ Let user manually add walls they need to measure
- ✅ Provide "Add Wall" button with dropdowns to select adjacent rooms
- Example:
  ```javascript
  // Remove automatic wall generation entirely
  // User adds: "Wall between BEDROOM and BATHROOM"
  ```

**Option 2: Deterministic Pattern**
- ✅ Use a deterministic pattern based on room order
- ✅ Always connect adjacent rooms in list
- ❌ Still not accurate to real floor plan

**Option 3: Manual Only with Presets**
- ✅ No automatic generation
- ✅ Provide common patterns as templates:
  - "All rooms to external walls"
  - "Linear arrangement (sequential rooms)"
  - "Grid arrangement (2x2, 3x3, etc.)"
- ✅ User selects pattern that matches their floor plan

**Option 4: Future: OCR Floor Plan Drawing**
- ✅ Detect actual walls from floor plan images
- ✅ Use computer vision to identify adjacencies
- ❌ Complex implementation (future feature)

---

## 4. HARDCODED PROCESSING TIME

### Location
**Lines:** 669, 1132
**Function:** `runAIAnalysis()`

### Description
The analysis "processing time" is **hardcoded to "3.2s"** regardless of actual processing duration.

### Implementation

```javascript
const analysisResults = {
    confidence: avgConfidence,
    totalRooms: rooms.length,
    totalArea: totalArea,
    processingTime: '3.2s',  // ⚠️ Hardcoded value
    rooms: rooms,
    walls: walls,
    analysisMethod: 'PDF Text Extraction',
    extractedText: extractedText.substring(0, 500),
    textLength: extractedText.length
};
```

### Display Location
```javascript
<div className="text-2xl font-bold text-orange-600">
    {analysisResults.processingTime}
</div>
```

### Impact Analysis

| Impact Area | Severity | Details |
|-------------|----------|---------|
| **Accuracy** | Low | Always shows 3.2s regardless of actual time |
| **User Trust** | Low | Minor cosmetic issue |
| **Performance Metrics** | Medium | Cannot track real performance |
| **Debugging** | Low | No impact on functionality |

### Real Processing Time
- Small PDFs: Usually < 500ms
- Large PDFs: Can be 2-5 seconds
- OCR (when implemented): 10-30 seconds per page

### Recommendation

**Option 1: Remove Display (Simplest)**
- ✅ Remove "Processing Time" field entirely
- ✅ Not critical information for users
- ✅ Eliminates fake data

**Option 2: Real Timing (Recommended)**
- ✅ Capture actual processing time
- ✅ More accurate and useful
- Implementation:
```javascript
const startTime = Date.now();
// ... processing ...
const endTime = Date.now();
const processingTime = ((endTime - startTime) / 1000).toFixed(1) + 's';
```

**Option 3: Show as "< 1s" for Fast Operations**
- ✅ Generic but honest
- ✅ Simple to implement

---

## 5. UI PLACEHOLDER TEXT (Input Fields)

### Location
Multiple form inputs throughout the file

### Description
Standard HTML `placeholder` attributes for form inputs. These are **normal and expected** UX patterns, not simulated data.

### Examples

| Line | Field | Placeholder | Purpose |
|------|-------|-------------|---------|
| 1202 | Room Name | "e.g., BEDROOM-2" | Example format |
| 1213 | Length | "0.00" | Number format hint |
| 1224 | Breadth | "0.00" | Number format hint |
| 1311 | Actual Length | "0.00" | Number format hint |
| 1345 | Actual Breadth | "0.00" | Number format hint |
| 1485 | Reference Point | "e.g., Corner A" | Example format |
| 1509 | Inner Measurement | "0.00" | Number format hint |
| 1542 | Outer Measurement | "0.00" | Number format hint |

### Impact Analysis

| Impact Area | Severity | Details |
|-------------|----------|---------|
| **User Confusion** | None | Standard UX practice |
| **Data Accuracy** | None | Not actual data |
| **Functionality** | None | Visual hints only |

### Recommendation
✅ **Keep as-is** - These are standard, appropriate placeholder text for inputs.

---

## PRIORITY RECOMMENDATIONS

### High Priority (Should Fix)

1. **Random Wall Generation** → Replace with manual wall entry
   - **Why:** Major data accuracy issue
   - **Impact:** High - affects core functionality
   - **Effort:** Medium - 2-3 hours

2. **Sample Room Data Warning** → Add clear visual indicator
   - **Why:** User confusion about data source
   - **Impact:** Medium - affects user understanding
   - **Effort:** Low - 30 minutes

### Medium Priority (Should Improve)

3. **Real Upload Progress** → Track actual file reading
   - **Why:** Better UX for large files
   - **Impact:** Medium - improves accuracy
   - **Effort:** Low - 1 hour

4. **Real Processing Time** → Calculate actual duration
   - **Why:** Accurate performance metrics
   - **Impact:** Low - nice to have
   - **Effort:** Very Low - 15 minutes

### Low Priority (Optional)

5. **Placeholder Text** → Keep as-is
   - **Why:** Standard UX practice
   - **Impact:** None
   - **Effort:** None

---

## IMPLEMENTATION PLAN

### Phase 1: Critical Fixes (High Priority)
```
1. Remove random wall generation
2. Add manual "Add Wall" functionality
3. Add sample data warning indicators
4. Test with real PDFs
```

### Phase 2: UX Improvements (Medium Priority)
```
1. Implement real upload progress
2. Calculate actual processing time
3. Test with large files (50MB PDFs)
```

### Phase 3: Future Enhancements (Low Priority)
```
1. OCR-based wall detection from floor plan drawings
2. Smart adjacency suggestions
3. Floor plan templates
```

---

## CONCLUSION

**Total Simulated Data Points:** 4 (plus standard placeholders)

**Critical Issues:** 1 (Random wall generation)

**Recommended Actions:**
1. ✅ Replace random wall generation with manual entry system
2. ✅ Add sample data warnings
3. ✅ Implement real progress tracking
4. ✅ Calculate actual processing time

**No Critical Blockers:** The simulated data is mostly for UX/demo purposes and doesn't prevent the app from functioning with real data. However, fixing the wall generation randomness should be a priority for production use.
