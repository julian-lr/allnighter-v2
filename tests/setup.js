/**
 * Jest Test Setup
 * Configure the testing environment for AllNighter v2
 */

import { jest } from '@jest/globals';
import '@testing-library/jest-dom';

// Mock SpeechSynthesisUtterance constructor
global.SpeechSynthesisUtterance = jest.fn().mockImplementation((text) => ({
  text,
  volume: 1,
  rate: 1,
  pitch: 1
}));

// Mock DOM APIs not available in JSDOM
Object.defineProperty(window, 'speechSynthesis', {
  writable: true,
  value: {
    speak: jest.fn(),
    cancel: jest.fn(),
    pause: jest.fn(),
    resume: jest.fn(),
    getVoices: jest.fn(() => [])
  }
});

Object.defineProperty(navigator, 'clipboard', {
  writable: true,
  value: {
    writeText: jest.fn(() => Promise.resolve()),
    readText: jest.fn(() => Promise.resolve(''))
  }
});

// Mock FileReader
global.FileReader = class MockFileReader {
  constructor() {
    this.readAsText = jest.fn();
    this.result = null;
    this.error = null;
    this.onloadend = null;
    this.onerror = null;
  }
  
  // Simulate successful file read
  _simulateLoad(content) {
    this.result = content;
    if (this.onloadend) {
      this.onloadend({ target: this });
    }
  }
  
  // Simulate file read error
  _simulateError(error) {
    this.error = error;
    if (this.onerror) {
      this.onerror({ target: this });
    }
  }
};

// Mock URL.createObjectURL and revokeObjectURL for download tests
Object.defineProperty(window.URL, 'createObjectURL', {
  writable: true,
  value: jest.fn(() => 'blob:mock-url')
});

Object.defineProperty(window.URL, 'revokeObjectURL', {
  writable: true,
  value: jest.fn()
});

// Mock console methods to avoid noise in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
  log: jest.fn()
};

// Set up DOM with basic structure
document.body.innerHTML = `
  <div id="console" role="log" aria-live="polite"></div>
  <input type="file" id="uploaded" multiple>
  <div id="upload-area"></div>
`;

// Add custom matchers
expect.extend({
  toBeValidSpecialCharacter(received) {
    const specialCharsRegex = /[¿º«»ª¡ÀÂÃÄÁÆàâãäæÇçÊËÉêëïÍÏÔÖÕÓöõôÜÚüáéí'óüúÑñ✓✔‑–—€®©℠™´'']/;
    const pass = specialCharsRegex.test(received);
    
    if (pass) {
      return {
        message: () => `expected ${received} not to be a special character`,
        pass: true
      };
    } else {
      return {
        message: () => `expected ${received} to be a special character`,
        pass: false
      };
    }
  },
  
  toHaveValidFileExtension(received) {
    const validExtensions = ['.txt', '.html', '.htm', '.css', '.js', '.xml', '.csv'];
    const pass = validExtensions.some(ext => received.toLowerCase().endsWith(ext));
    
    return {
      message: () => pass 
        ? `expected ${received} not to have a valid file extension`
        : `expected ${received} to have a valid file extension`,
      pass
    };
  }
});
