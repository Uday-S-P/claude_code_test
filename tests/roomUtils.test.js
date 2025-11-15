import {
    identifyRoomType,
    parseSingleRoom,
    parseRooms,
    isValidRoom,
    calculateTotalArea,
    getRoomById,
    filterRoomsByType
} from './utils/roomUtils';

describe('Room Type Identification', () => {
    describe('identifyRoomType', () => {
        test('identifies bedrooms correctly', () => {
            expect(identifyRoomType('BEDROOM-2')).toBe('bedroom');
            expect(identifyRoomType('MASTER BEDROOM')).toBe('bedroom');
            expect(identifyRoomType('bedroom 1')).toBe('bedroom');
        });

        test('identifies bathrooms correctly', () => {
            expect(identifyRoomType('BATHROOM')).toBe('bathroom');
            expect(identifyRoomType('TOILET')).toBe('bathroom');
            expect(identifyRoomType('WC')).toBe('bathroom');
        });

        test('identifies kitchens correctly', () => {
            expect(identifyRoomType('KITCHEN')).toBe('kitchen');
        });

        test('identifies living rooms correctly', () => {
            expect(identifyRoomType('LIVING ROOM')).toBe('living');
            expect(identifyRoomType('LOUNGE')).toBe('living');
            expect(identifyRoomType('HALL')).toBe('living');
        });

        test('identifies dining rooms correctly', () => {
            expect(identifyRoomType('DINING ROOM')).toBe('dining');
        });

        test('identifies balconies correctly', () => {
            expect(identifyRoomType('BALCONY')).toBe('balcony');
            expect(identifyRoomType('TERRACE')).toBe('balcony');
        });

        test('identifies utility rooms correctly', () => {
            expect(identifyRoomType('UTILITY')).toBe('utility');
            expect(identifyRoomType('STORE')).toBe('utility');
        });

        test('returns "other" for unknown types', () => {
            expect(identifyRoomType('GARAGE')).toBe('other');
            expect(identifyRoomType('PORCH')).toBe('other');
        });

        test('handles empty or null input', () => {
            expect(identifyRoomType('')).toBe('other');
            expect(identifyRoomType(null)).toBe('other');
        });
    });
});

describe('Single Room Parsing', () => {
    describe('parseSingleRoom', () => {
        test('parses room with feet-inches dimensions', () => {
            const room = parseSingleRoom("BEDROOM-2 11'6\" X 10'6\"", 1);

            expect(room).not.toBeNull();
            expect(room.id).toBe(1);
            expect(room.name).toBe('BEDROOM-2');
            expect(room.length).toBeCloseTo(11.5, 2);
            expect(room.breadth).toBeCloseTo(10.5, 2);
            expect(room.area).toBeCloseTo(120.75, 2);
            expect(room.type).toBe('bedroom');
        });

        test('parses room with hyphenated dimensions', () => {
            const room = parseSingleRoom("TOILET 6-11 X 5-11", 2);

            expect(room).not.toBeNull();
            expect(room.length).toBeCloseTo(6.917, 2);
            expect(room.breadth).toBeCloseTo(5.917, 2);
        });

        test('returns null for invalid text', () => {
            expect(parseSingleRoom('')).toBeNull();
            expect(parseSingleRoom(null)).toBeNull();
            expect(parseSingleRoom('NO DIMENSIONS')).toBeNull();
        });

        test('returns null for dimensions outside valid range', () => {
            // Too small (< 6 sq ft total area)
            expect(parseSingleRoom('ROOM 1-0 X 1-0', 1)).toBeNull();

            // Too large (> 1000 sq ft per dimension)
            expect(parseSingleRoom('WAREHOUSE 1001-0 X 10-0', 1)).toBeNull();
        });

        test('includes confidence score', () => {
            const room = parseSingleRoom("LOUNGE 17'1\" X 13'6\"", 1);
            expect(room.confidence).toBe(0.95);
        });

        test('preserves original dimension strings', () => {
            const room = parseSingleRoom("KITCHEN 12'0\" X 10'0\"", 1);
            expect(room.originalLength).toBe("12'0\"");
            expect(room.originalBreadth).toBe("10'0\"");
        });

        test('handles different separator symbols', () => {
            const room1 = parseSingleRoom("ROOM 10-0 x 8-0", 1);
            const room2 = parseSingleRoom("ROOM 10-0 X 8-0", 1);
            const room3 = parseSingleRoom("ROOM 10-0 × 8-0", 1);

            expect(room1).not.toBeNull();
            expect(room2).not.toBeNull();
            expect(room3).not.toBeNull();
        });
    });
});

describe('Multiple Room Parsing', () => {
    describe('parseRooms', () => {
        test('parses multiple rooms from text', () => {
            const text = `
                MASTER BEDROOM 13'10" X 12'6"
                BEDROOM-2 11'6" X 10'6"
                TOILET 6'11" X 5'11"
                LOUNGE 17'1" X 13'6"
            `;

            const rooms = parseRooms(text);

            expect(rooms).toHaveLength(4);
            expect(rooms[0].name).toBe('MASTER BEDROOM');
            expect(rooms[1].name).toBe('BEDROOM-2');
            expect(rooms[2].name).toBe('TOILET');
            expect(rooms[3].name).toBe('LOUNGE');
        });

        test('assigns sequential IDs to rooms', () => {
            const text = `
                ROOM-1 10-0 X 10-0
                ROOM-2 10-0 X 10-0
            `;

            const rooms = parseRooms(text);

            expect(rooms[0].id).toBe(1);
            expect(rooms[1].id).toBe(2);
        });

        test('returns empty array for invalid input', () => {
            expect(parseRooms('')).toEqual([]);
            expect(parseRooms(null)).toEqual([]);
            expect(parseRooms('NO ROOMS HERE')).toEqual([]);
        });

        test('skips invalid room entries', () => {
            const text = `
                VALID ROOM 10-0 X 10-0
                INVALID LINE WITHOUT DIMENSIONS
                ANOTHER VALID ROOM 12-0 X 11-0
            `;

            const rooms = parseRooms(text);

            expect(rooms).toHaveLength(2);
        });
    });
});

describe('Room Validation', () => {
    describe('isValidRoom', () => {
        const validRoom = {
            id: 1,
            name: 'BEDROOM-2',
            length: 11.5,
            breadth: 10.5,
            area: 120.75,
            type: 'bedroom'
        };

        test('returns true for valid room', () => {
            expect(isValidRoom(validRoom)).toBe(true);
        });

        test('returns false for missing required fields', () => {
            const incompleteRoom = { id: 1, name: 'ROOM' };
            expect(isValidRoom(incompleteRoom)).toBe(false);
        });

        test('returns false for invalid ID', () => {
            const room = { ...validRoom, id: 0 };
            expect(isValidRoom(room)).toBe(false);
        });

        test('returns false for empty name', () => {
            const room = { ...validRoom, name: '' };
            expect(isValidRoom(room)).toBe(false);
        });

        test('returns false for invalid dimensions', () => {
            const room1 = { ...validRoom, length: 0 };
            const room2 = { ...validRoom, breadth: 1001 };
            const room3 = { ...validRoom, area: 5 };

            expect(isValidRoom(room1)).toBe(false);
            expect(isValidRoom(room2)).toBe(false);
            expect(isValidRoom(room3)).toBe(false);
        });

        test('returns false for null or non-object input', () => {
            expect(isValidRoom(null)).toBe(false);
            expect(isValidRoom(undefined)).toBe(false);
            expect(isValidRoom('not an object')).toBe(false);
        });
    });
});

describe('Room Utility Functions', () => {
    const testRooms = [
        { id: 1, name: 'BEDROOM-1', area: 120, type: 'bedroom' },
        { id: 2, name: 'BEDROOM-2', area: 100, type: 'bedroom' },
        { id: 3, name: 'BATHROOM', area: 40, type: 'bathroom' },
        { id: 4, name: 'KITCHEN', area: 80, type: 'kitchen' }
    ];

    describe('calculateTotalArea', () => {
        test('calculates total area correctly', () => {
            expect(calculateTotalArea(testRooms)).toBe(340);
        });

        test('returns 0 for empty array', () => {
            expect(calculateTotalArea([])).toBe(0);
        });

        test('returns 0 for invalid input', () => {
            expect(calculateTotalArea(null)).toBe(0);
            expect(calculateTotalArea('not an array')).toBe(0);
        });

        test('handles rooms with missing area', () => {
            const rooms = [
                { id: 1, area: 100 },
                { id: 2 }, // missing area
                { id: 3, area: 50 }
            ];
            expect(calculateTotalArea(rooms)).toBe(150);
        });
    });

    describe('getRoomById', () => {
        test('returns correct room for valid ID', () => {
            const room = getRoomById(testRooms, 2);
            expect(room.name).toBe('BEDROOM-2');
        });

        test('returns null for non-existent ID', () => {
            expect(getRoomById(testRooms, 999)).toBeNull();
        });

        test('returns null for invalid input', () => {
            expect(getRoomById(null, 1)).toBeNull();
            expect(getRoomById('not an array', 1)).toBeNull();
        });
    });

    describe('filterRoomsByType', () => {
        test('filters bedrooms correctly', () => {
            const bedrooms = filterRoomsByType(testRooms, 'bedroom');
            expect(bedrooms).toHaveLength(2);
            expect(bedrooms[0].type).toBe('bedroom');
            expect(bedrooms[1].type).toBe('bedroom');
        });

        test('returns empty array for non-existent type', () => {
            const balconies = filterRoomsByType(testRooms, 'balcony');
            expect(balconies).toEqual([]);
        });

        test('returns empty array for invalid input', () => {
            expect(filterRoomsByType(null, 'bedroom')).toEqual([]);
            expect(filterRoomsByType('not an array', 'bedroom')).toEqual([]);
        });
    });
});
