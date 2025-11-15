// Room Parsing Utility Functions
// Extracted from index.html for testing

/**
 * Converts feet-inches notation to decimal feet (helper function)
 */
function convertFeetInchesToDecimal(feetInches) {
    if (!feetInches || typeof feetInches !== 'string') return 0;
    const cleaned = feetInches.replace(/["']/g, '').trim();
    const match = cleaned.match(/(\d+)[-\s]+(\d+)/);
    if (match) {
        const feet = parseInt(match[1], 10);
        const inches = parseInt(match[2], 10);
        return feet + (inches / 12);
    }
    const decimal = parseFloat(cleaned);
    return isNaN(decimal) ? 0 : decimal;
}

/**
 * Identifies room type from room name
 * @param {string} roomName - The room name
 * @returns {string} - Room type category
 */
export function identifyRoomType(roomName) {
    if (!roomName) return 'other';

    const name = roomName.toUpperCase();

    if (name.includes('BEDROOM') || name.includes('MASTER')) return 'bedroom';
    if (name.includes('BATHROOM') || name.includes('TOILET') || name.includes('WC')) return 'bathroom';
    if (name.includes('KITCHEN')) return 'kitchen';
    if (name.includes('LIVING') || name.includes('LOUNGE') || name.includes('HALL')) return 'living';
    if (name.includes('DINING')) return 'dining';
    if (name.includes('BALCONY') || name.includes('TERRACE')) return 'balcony';
    if (name.includes('UTILITY') || name.includes('STORE')) return 'utility';

    return 'other';
}

/**
 * Parses a single room entry from text
 * @param {string} text - Text containing room information
 * @param {number} roomId - Room ID
 * @returns {Object|null} - Parsed room object or null
 */
export function parseSingleRoom(text, roomId = 1) {
    if (!text || typeof text !== 'string') return null;

    // Match patterns like: BEDROOM-2 11'6" X 10'6"
    // Pattern: Room name + dimension + X/x/× + dimension
    // Dimensions can be: 11'6", 11-6, 11 6, etc.
    const pattern = /([A-Z][\w\s\-]+?)\s+(\d+[-'\s]\d+["']?)\s*[xX×]\s*(\d+[-'\s]\d+["']?)/i;
    const match = text.trim().match(pattern);

    if (!match) return null;

    const roomName = match[1].trim();
    const lengthStr = match[2].trim();
    const breadthStr = match[3].trim();

    const length = convertFeetInchesToDecimal(lengthStr);
    const breadth = convertFeetInchesToDecimal(breadthStr);

    // Validate dimensions (must be between 0.5 and 1000 sq ft per dimension)
    if (length < 0.5 || length > 1000 || breadth < 0.5 || breadth > 1000) {
        return null;
    }

    const area = length * breadth;

    // Validate total area (must be between 6 and 1000 sq ft)
    if (area < 6 || area > 1000) {
        return null;
    }

    return {
        id: roomId,
        name: roomName,
        length: parseFloat(length.toFixed(2)),
        breadth: parseFloat(breadth.toFixed(2)),
        area: parseFloat(area.toFixed(2)),
        originalLength: lengthStr,
        originalBreadth: breadthStr,
        originalText: `${roomName} ${lengthStr} X ${breadthStr}`,
        confidence: 0.95,
        type: identifyRoomType(roomName)
    };
}

/**
 * Parses all rooms from extracted text
 * @param {string} text - Full extracted text from PDF/OCR
 * @returns {Array} - Array of room objects
 */
export function parseRooms(text) {
    if (!text || typeof text !== 'string') return [];

    const upperText = text.toUpperCase();
    const rooms = [];
    let roomId = 1;

    // Split text into potential room entries
    const lines = upperText.split(/[\n\r]+/);

    for (const line of lines) {
        const room = parseSingleRoom(line, roomId);
        if (room) {
            rooms.push(room);
            roomId++;
        }
    }

    return rooms;
}

/**
 * Validates room object structure
 * @param {Object} room - Room object to validate
 * @returns {boolean} - True if valid
 */
export function isValidRoom(room) {
    if (!room || typeof room !== 'object') return false;

    const requiredFields = ['id', 'name', 'length', 'breadth', 'area'];
    const hasAllFields = requiredFields.every(field => room.hasOwnProperty(field));

    if (!hasAllFields) return false;

    // Validate field types and ranges
    if (typeof room.id !== 'number' || room.id < 1) return false;
    if (typeof room.name !== 'string' || room.name.trim() === '') return false;
    if (typeof room.length !== 'number' || room.length < 0.5 || room.length > 1000) return false;
    if (typeof room.breadth !== 'number' || room.breadth < 0.5 || room.breadth > 1000) return false;
    if (typeof room.area !== 'number' || room.area < 6 || room.area > 1000) return false;

    return true;
}

/**
 * Calculates total area from array of rooms
 * @param {Array} rooms - Array of room objects
 * @returns {number} - Total area in square feet
 */
export function calculateTotalArea(rooms) {
    if (!Array.isArray(rooms)) return 0;

    return rooms.reduce((total, room) => {
        return total + (room.area || 0);
    }, 0);
}

/**
 * Gets room by ID
 * @param {Array} rooms - Array of room objects
 * @param {number} id - Room ID
 * @returns {Object|null} - Room object or null
 */
export function getRoomById(rooms, id) {
    if (!Array.isArray(rooms)) return null;
    return rooms.find(room => room.id === id) || null;
}

/**
 * Filters rooms by type
 * @param {Array} rooms - Array of room objects
 * @param {string} type - Room type to filter
 * @returns {Array} - Filtered array of rooms
 */
export function filterRoomsByType(rooms, type) {
    if (!Array.isArray(rooms)) return [];
    return rooms.filter(room => room.type === type);
}
