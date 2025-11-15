// Jest setup file
import '@testing-library/jest-dom';

// Mock Web Bluetooth API
global.navigator.bluetooth = {
    requestDevice: jest.fn(),
    getAvailability: jest.fn().mockResolvedValue(true)
};

// Mock FileReader
global.FileReader = class FileReader {
    readAsArrayBuffer = jest.fn();
    addEventListener = jest.fn();
    removeEventListener = jest.fn();
};

// Mock canvas
if (typeof HTMLCanvasElement !== 'undefined') {
    HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
        fillRect: jest.fn(),
        clearRect: jest.fn(),
        getImageData: jest.fn(() => ({
            data: new Uint8ClampedArray(4)
        })),
        putImageData: jest.fn(),
        createImageData: jest.fn(),
        setTransform: jest.fn(),
        drawImage: jest.fn(),
        save: jest.fn(),
        fillText: jest.fn(),
        restore: jest.fn(),
        beginPath: jest.fn(),
        moveTo: jest.fn(),
        lineTo: jest.fn(),
        closePath: jest.fn(),
        stroke: jest.fn(),
        translate: jest.fn(),
        scale: jest.fn(),
        rotate: jest.fn(),
        arc: jest.fn(),
        fill: jest.fn(),
        measureText: jest.fn(() => ({ width: 0 })),
        transform: jest.fn(),
        rect: jest.fn(),
        clip: jest.fn()
    }));
}

// Suppress console errors in tests
global.console = {
    ...console,
    error: jest.fn(),
    warn: jest.fn()
};
