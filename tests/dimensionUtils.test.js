import {
    convertFeetInchesToDecimal,
    convertDecimalToFeetInches,
    calculateVariance,
    getMeasurementStatus,
    calculateArea,
    isValidDimension
} from './utils/dimensionUtils';

describe('Dimension Conversion Functions', () => {
    describe('convertFeetInchesToDecimal', () => {
        test('converts feet-inches with hyphen (11-6) to decimal', () => {
            expect(convertFeetInchesToDecimal('11-6')).toBeCloseTo(11.5, 2);
        });

        test('converts feet-inches with quotes (11\'6") to decimal', () => {
            expect(convertFeetInchesToDecimal('11\'6"')).toBeCloseTo(11.5, 2);
        });

        test('converts feet-inches with space (11 6) to decimal', () => {
            expect(convertFeetInchesToDecimal('11 6')).toBeCloseTo(11.5, 2);
        });

        test('handles edge case of 0 inches', () => {
            expect(convertFeetInchesToDecimal('10-0')).toBe(10);
        });

        test('handles edge case of 11 inches', () => {
            expect(convertFeetInchesToDecimal('5-11')).toBeCloseTo(5.917, 2);
        });

        test('returns 0 for invalid input', () => {
            expect(convertFeetInchesToDecimal('')).toBe(0);
            expect(convertFeetInchesToDecimal(null)).toBe(0);
            expect(convertFeetInchesToDecimal(undefined)).toBe(0);
        });

        test('handles decimal input', () => {
            expect(convertFeetInchesToDecimal('10.5')).toBe(10.5);
        });
    });

    describe('convertDecimalToFeetInches', () => {
        test('converts 11.5 to 11\'-6"', () => {
            expect(convertDecimalToFeetInches(11.5)).toBe('11\'-6"');
        });

        test('converts whole numbers correctly', () => {
            expect(convertDecimalToFeetInches(10)).toBe('10\'-0"');
        });

        test('rounds inches to nearest whole number', () => {
            expect(convertDecimalToFeetInches(11.45)).toBe('11\'-5"'); // 11.45 * 12 = 5.4 inches, rounds to 5
        });

        test('returns 0\'-0" for invalid input', () => {
            expect(convertDecimalToFeetInches(NaN)).toBe('0\'-0"');
            expect(convertDecimalToFeetInches(null)).toBe('0\'-0"');
        });

        test('handles very small decimals', () => {
            expect(convertDecimalToFeetInches(0.25)).toBe('0\'-3"'); // 0.25 * 12 = 3 inches
        });
    });
});

describe('Variance Calculation Functions', () => {
    describe('calculateVariance', () => {
        test('calculates correct variance for planned < actual', () => {
            expect(calculateVariance(10, 11)).toBeCloseTo(10, 1); // 10% variance
        });

        test('calculates correct variance for planned > actual', () => {
            expect(calculateVariance(10, 9)).toBeCloseTo(10, 1); // 10% variance (absolute)
        });

        test('returns 0 for identical values', () => {
            expect(calculateVariance(10, 10)).toBe(0);
        });

        test('returns 0 when planned is 0', () => {
            expect(calculateVariance(0, 5)).toBe(0);
        });

        test('handles invalid inputs', () => {
            expect(calculateVariance(null, 10)).toBe(0);
            expect(calculateVariance(10, null)).toBe(0);
            expect(calculateVariance(NaN, 10)).toBe(0);
        });

        test('calculates variance for small differences', () => {
            expect(calculateVariance(100, 103)).toBeCloseTo(3, 1); // 3% variance
        });

        test('calculates variance for large differences', () => {
            expect(calculateVariance(10, 20)).toBeCloseTo(100, 1); // 100% variance
        });
    });

    describe('getMeasurementStatus', () => {
        test('returns "match" for variance within tolerance', () => {
            expect(getMeasurementStatus(3, 5)).toBe('match');
            expect(getMeasurementStatus(5, 5)).toBe('match');
        });

        test('returns "variance" for variance exceeding tolerance', () => {
            expect(getMeasurementStatus(6, 5)).toBe('variance');
            expect(getMeasurementStatus(10, 5)).toBe('variance');
        });

        test('returns "pending" for null/undefined variance', () => {
            expect(getMeasurementStatus(null)).toBe('pending');
            expect(getMeasurementStatus(undefined)).toBe('pending');
        });

        test('uses default tolerance of 5%', () => {
            expect(getMeasurementStatus(4)).toBe('match');
            expect(getMeasurementStatus(6)).toBe('variance');
        });

        test('respects custom tolerance', () => {
            expect(getMeasurementStatus(8, 10)).toBe('match');
            expect(getMeasurementStatus(11, 10)).toBe('variance');
        });
    });
});

describe('Area Calculation Functions', () => {
    describe('calculateArea', () => {
        test('calculates area correctly', () => {
            expect(calculateArea(10, 5)).toBe(50);
            expect(calculateArea(11.5, 10.5)).toBeCloseTo(120.75, 2);
        });

        test('handles zero dimensions', () => {
            expect(calculateArea(0, 5)).toBe(0);
            expect(calculateArea(5, 0)).toBe(0);
        });

        test('returns 0 for invalid inputs', () => {
            expect(calculateArea(null, 5)).toBe(0);
            expect(calculateArea(5, null)).toBe(0);
            expect(calculateArea(NaN, 5)).toBe(0);
        });

        test('handles decimal dimensions', () => {
            expect(calculateArea(10.5, 10.5)).toBeCloseTo(110.25, 2);
        });
    });
});

describe('Dimension Validation Functions', () => {
    describe('isValidDimension', () => {
        test('returns true for valid dimensions', () => {
            expect(isValidDimension(10)).toBe(true);
            expect(isValidDimension(100.5)).toBe(true);
            expect(isValidDimension(0.1)).toBe(true);
        });

        test('returns false for dimensions below minimum', () => {
            expect(isValidDimension(0)).toBe(false);
            expect(isValidDimension(0.05)).toBe(false);
        });

        test('returns false for dimensions above maximum', () => {
            expect(isValidDimension(1001)).toBe(false);
            expect(isValidDimension(10000)).toBe(false);
        });

        test('respects custom min/max', () => {
            expect(isValidDimension(5, 1, 10)).toBe(true);
            expect(isValidDimension(0.5, 1, 10)).toBe(false);
            expect(isValidDimension(15, 1, 10)).toBe(false);
        });

        test('returns false for invalid types', () => {
            expect(isValidDimension(null)).toBe(false);
            expect(isValidDimension(undefined)).toBe(false);
            expect(isValidDimension(NaN)).toBe(false);
            expect(isValidDimension('10')).toBe(false);
        });
    });
});
