// Dimension Utility Functions
// Extracted from index.html for testing

/**
 * Converts feet-inches notation to decimal feet
 * Handles formats: 11'6", 11-6, 11'6, 11-6", etc.
 * @param {string} feetInches - The feet-inches string
 * @returns {number} - Decimal feet
 */
export function convertFeetInchesToDecimal(feetInches) {
    if (!feetInches || typeof feetInches !== 'string') return 0;

    // Try to match feet-inches pattern FIRST (before removing quotes)
    // Matches: 11'6", 11-6, 11 6, etc.
    const pattern = /(\d+)[-'\s]+(\d+)/;
    const match = feetInches.match(pattern);

    if (match) {
        const feet = parseInt(match[1], 10);
        const inches = parseInt(match[2], 10);
        return feet + (inches / 12);
    }

    // If no match, try to parse as decimal (remove quotes first)
    const cleaned = feetInches.replace(/["']/g, '').trim();
    const decimal = parseFloat(cleaned);
    return isNaN(decimal) ? 0 : decimal;
}

/**
 * Converts decimal feet to feet-inches notation
 * @param {number} decimalFeet - Decimal feet value
 * @returns {string} - Feet-inches notation (e.g., "11'-6\"")
 */
export function convertDecimalToFeetInches(decimalFeet) {
    if (typeof decimalFeet !== 'number' || isNaN(decimalFeet)) return "0'-0\"";

    const feet = Math.floor(decimalFeet);
    const inches = Math.round((decimalFeet - feet) * 12);

    return `${feet}'-${inches}"`;
}

/**
 * Calculates variance percentage between two values
 * @param {number} planned - Planned value
 * @param {number} actual - Actual value
 * @returns {number} - Variance percentage (absolute value)
 */
export function calculateVariance(planned, actual) {
    if (typeof planned !== 'number' || typeof actual !== 'number') return 0;
    if (isNaN(planned) || isNaN(actual)) return 0;
    if (planned === 0) return 0;

    return Math.abs(((actual - planned) / planned) * 100);
}

/**
 * Determines measurement status based on variance and tolerance
 * @param {number} variance - Variance percentage
 * @param {number} tolerance - Tolerance threshold (default 5%)
 * @returns {string} - Status: 'match', 'variance', or 'pending'
 */
export function getMeasurementStatus(variance, tolerance = 5) {
    if (variance === null || variance === undefined) return 'pending';
    return variance <= tolerance ? 'match' : 'variance';
}

/**
 * Calculates area from length and breadth
 * @param {number} length - Length in feet
 * @param {number} breadth - Breadth in feet
 * @returns {number} - Area in square feet
 */
export function calculateArea(length, breadth) {
    if (typeof length !== 'number' || typeof breadth !== 'number') return 0;
    if (isNaN(length) || isNaN(breadth)) return 0;
    return length * breadth;
}

/**
 * Validates dimension value
 * @param {number} value - Dimension value
 * @param {number} min - Minimum acceptable value
 * @param {number} max - Maximum acceptable value
 * @returns {boolean} - True if valid
 */
export function isValidDimension(value, min = 0.1, max = 1000) {
    return typeof value === 'number' && value >= min && value <= max;
}
