/**
 * Unit Tests for AllNighter v2 Utilities
 * Tests for js/utils.js functionality
 */

import { jest } from '@jest/globals';

// Mock the config module
const mockConfig = {
  APP_CONFIG: {
    MAX_FILE_SIZE: 5 * 1024 * 1024,
    MAX_FILES_ARRAY_SIZE: 10,
    ALLOWED_FILE_TYPES: ['.txt', '.html', '.htm', '.css', '.js', '.xml', '.csv'],
    ERROR_COLOR: '#ff6b6b',
    SUCCESS_COLOR: '#51cf66'
  },
  REGEX_PATTERNS: {
    SPECIAL_CHARS: /[¿º«»ª¡ÀÂÃÄÁÆàâãäæÇçÊËÉêëïÍÏÔÖÕÓöõôÜÚüáéí'óüúÑñ✓✔‑–—€®©℠™´'']/g
  },
  SELECTORS: {
    CONSOLE: '#console',
    FILE_INPUT: '#uploaded',
    UPLOAD_AREA: '#upload-area',
    EXPORT_TXT_BTN: '#export-txt',
    EXPORT_CSV_BTN: '#export-csv',
    COPY_RESULTS_BTN: '#copy-results',
    PROGRESS_CONTAINER: '#progress-container',
    PROGRESS_BAR: '#progress-bar',
    PROGRESS_TEXT: '#progress-text'
  }
};

jest.unstable_mockModule('../js/config.js', () => mockConfig);

const {
  getState,
  resetState,
  updateState,
  validateFileSize,
  validateFileType,
  validateFile,
  showError,
  showSuccess,
  showProgress,
  updateProgress,
  removeProgress,
  scanTextForCharacters,
  exportResults,
  copyResultsToClipboard,
  createFileReader,
  createResultElement
} = await import('../js/utils.js');

describe('State Management', () => {
  beforeEach(() => {
    resetState();
  });

  test('should initialize with empty state', () => {
    const state = getState();
    expect(state.fileIndex).toBe(0);
    expect(state.totalFiles).toBe(0);
    expect(state.processedFiles).toBe(0);
    expect(state.scanResults).toEqual([]);
    expect(state.namef).toEqual(['', '', '', '', '', '', '', '', '', '']);
  });

  test('should update state correctly', () => {
    updateState({
      fileIndex: 2,
      totalFiles: 5,
      processedFiles: 1
    });

    const state = getState();
    expect(state.fileIndex).toBe(2);
    expect(state.totalFiles).toBe(5);
    expect(state.processedFiles).toBe(1);
  });

  test('should reset state to initial values', () => {
    updateState({
      fileIndex: 5,
      totalFiles: 10,
      processedFiles: 3,
      scanResults: [{ test: 'data' }]
    });

    resetState();
    const state = getState();
    expect(state.fileIndex).toBe(0);
    expect(state.totalFiles).toBe(0);
    expect(state.processedFiles).toBe(0);
    expect(state.scanResults).toEqual([]);
  });
});

describe('File Validation', () => {
  test('should validate file size correctly', () => {
    const smallFile = { size: 1024 }; // 1KB
    const largeFile = { size: 10 * 1024 * 1024 }; // 10MB

    expect(validateFileSize(smallFile)).toBe(true);
    expect(validateFileSize(largeFile)).toBe(false);
  });

  test('should validate file types correctly', () => {
    const validFiles = [
      { name: 'test.txt' },
      { name: 'index.html' },
      { name: 'styles.css' },
      { name: 'script.js' },
      { name: 'data.xml' },
      { name: 'data.csv' }
    ];

    const invalidFiles = [
      { name: 'image.jpg' },
      { name: 'document.pdf' },
      { name: 'archive.zip' },
      { name: 'noextension' }
    ];

    validFiles.forEach(file => {
      expect(validateFileType(file)).toBe(true);
      expect(file.name).toHaveValidFileExtension();
    });

    invalidFiles.forEach(file => {
      expect(validateFileType(file)).toBe(false);
    });
  });

  test('should validate file completely', () => {
    const validFile = { name: 'test.txt', size: 1024 };
    const invalidSizeFile = { name: 'test.txt', size: 10 * 1024 * 1024 };
    const invalidTypeFile = { name: 'test.jpg', size: 1024 };

    expect(validateFile(validFile).isValid).toBe(true);
    expect(validateFile(invalidSizeFile).isValid).toBe(false);
    expect(validateFile(invalidTypeFile).isValid).toBe(false);
  });
});

describe('Character Scanning', () => {
  test('should detect special characters correctly', () => {
    const textWithSpecialChars = 'Hola, ¿cómo estás? ¡Muy bien!';
    const textWithoutSpecialChars = 'Hello, how are you? Very well!';

    const resultWithChars = scanTextForCharacters(textWithSpecialChars);
    const resultWithoutChars = scanTextForCharacters(textWithoutSpecialChars);

    expect(resultWithChars.hasSpecialChars).toBe(true);
    expect(resultWithChars.foundCharacters).toContain('¿');
    expect(resultWithChars.foundCharacters).toContain('ó');
    expect(resultWithChars.foundCharacters).toContain('á');
    expect(resultWithChars.foundCharacters).toContain('¡');
    expect(resultWithChars.totalCount).toBeGreaterThan(0);

    expect(resultWithoutChars.hasSpecialChars).toBe(false);
    expect(resultWithoutChars.foundCharacters).toEqual([]);
    expect(resultWithoutChars.totalCount).toBe(0);
  });

  test('should handle empty text', () => {
    const result = scanTextForCharacters('');
    expect(result.hasSpecialChars).toBe(false);
    expect(result.foundCharacters).toEqual([]);
    expect(result.totalCount).toBe(0);
  });

  test('should deduplicate found characters', () => {
    const text = 'ááááááá'; // Multiple same characters
    const result = scanTextForCharacters(text);
    
    expect(result.foundCharacters).toEqual(['á']);
    expect(result.totalCount).toBe(7); // Total count should be 7
  });

  test('should validate individual special characters', () => {
    const specialChars = ['¿', 'ñ', 'á', 'é', 'í', 'ó', 'ú', '¡'];
    specialChars.forEach(char => {
      expect(char).toBeValidSpecialCharacter();
    });

    const normalChars = ['a', 'e', 'i', 'o', 'u', '?', '!'];
    normalChars.forEach(char => {
      expect(char).not.toBeValidSpecialCharacter();
    });
  });
});

describe('DOM Manipulation', () => {
  beforeEach(() => {
    document.getElementById('console').innerHTML = '';
  });

  test('should show error messages with proper accessibility', () => {
    showError('Test error message');
    
    const console = document.getElementById('console');
    const errorElements = console.querySelectorAll('.error-message');
    
    expect(errorElements).toHaveLength(1);
    expect(errorElements[0]).toHaveAttribute('role', 'alert');
    expect(errorElements[0]).toHaveAttribute('aria-live', 'assertive');
    expect(errorElements[0].textContent).toContain('Test error message');
  });

  test('should show success messages with proper accessibility', () => {
    showSuccess('Test success message');
    
    const console = document.getElementById('console');
    const successElements = console.querySelectorAll('.success-message');
    
    expect(successElements).toHaveLength(1);
    expect(successElements[0]).toHaveAttribute('role', 'status');
    expect(successElements[0]).toHaveAttribute('aria-live', 'polite');
    expect(successElements[0].textContent).toContain('Test success message');
  });

  test('should create result elements with proper attributes', () => {
    const element = createResultElement(
      'test-class',
      'Test content',
      { 'role': 'listitem', 'aria-label': 'Test label' }
    );

    expect(element.tagName).toBe('P');
    expect(element.className).toBe('test-class');
    expect(element.textContent).toBe('Test content');
    expect(element).toHaveAttribute('role', 'listitem');
    expect(element).toHaveAttribute('aria-label', 'Test label');
  });
});

describe('Progress Tracking', () => {
  beforeEach(() => {
    document.getElementById('console').innerHTML = '';
  });

  test('should show progress indicator', () => {
    showProgress();
    
    const progressContainer = document.getElementById('progress-container');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    
    expect(progressContainer).toBeTruthy();
    expect(progressBar).toBeTruthy();
    expect(progressText).toBeTruthy();
    expect(progressContainer).toHaveAttribute('role', 'progressbar');
  });

  test('should update progress correctly', () => {
    showProgress();
    updateProgress(3, 5, 'test.txt');
    
    const progressContainer = document.getElementById('progress-container');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    
    expect(progressContainer).toHaveAttribute('aria-valuenow', '60');
    expect(progressBar.style.width).toBe('60%');
    expect(progressText.textContent).toContain('test.txt');
    expect(progressText.textContent).toContain('3/5');
  });

  test('should remove progress indicator', () => {
    showProgress();
    expect(document.getElementById('progress-container')).toBeTruthy();
    
    removeProgress();
    expect(document.getElementById('progress-container')).toBeFalsy();
  });
});

describe('File Processing', () => {
  test('should create FileReader with proper callbacks', () => {
    const onSuccess = jest.fn();
    const onError = jest.fn();
    
    const reader = createFileReader(onSuccess, onError);
    
    expect(reader).toBeInstanceOf(FileReader);
    expect(reader.onloadend).toBeTruthy();
    expect(reader.onerror).toBeTruthy();
  });

  test('should handle file read success', () => {
    const onSuccess = jest.fn();
    const onError = jest.fn();
    
    const reader = createFileReader(onSuccess, onError);
    const testContent = 'Test file content';
    
    reader._simulateLoad(testContent);
    
    expect(onSuccess).toHaveBeenCalledWith(testContent);
    expect(onError).not.toHaveBeenCalled();
  });

  test('should handle file read error', () => {
    const onSuccess = jest.fn();
    const onError = jest.fn();
    
    const reader = createFileReader(onSuccess, onError);
    const testError = new Error('File reading failed');
    
    reader._simulateError(testError);
    
    expect(onError).toHaveBeenCalledWith(testError);
    expect(onSuccess).not.toHaveBeenCalled();
  });
});

describe('Export Functionality', () => {
  beforeEach(() => {
    // Set up mock scan results
    updateState({
      scanResults: [
        {
          fileName: 'test1.txt',
          characters: ['á', 'é'],
          count: 3
        },
        {
          fileName: 'test2.html',
          characters: ['ñ', '¿'],
          count: 2
        }
      ]
    });
  });

  test('should export results as TXT format', () => {
    const createElementSpy = jest.spyOn(document, 'createElement');
    const appendChildSpy = jest.spyOn(document.body, 'appendChild');
    const removeChildSpy = jest.spyOn(document.body, 'removeChild');
    
    exportResults('txt', 'en');
    
    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(window.URL.createObjectURL).toHaveBeenCalled();
    
    // Clean up spies
    createElementSpy.mockRestore();
    appendChildSpy.mockRestore();
    removeChildSpy.mockRestore();
  });

  test('should copy results to clipboard', async () => {
    await copyResultsToClipboard('en');
    
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
  });

  test('should handle empty results for export', () => {
    updateState({ scanResults: [] });
    
    exportResults('txt', 'en');
    
    // Should show error message
    const console = document.getElementById('console');
    const errorElements = console.querySelectorAll('.error-message');
    expect(errorElements.length).toBeGreaterThan(0);
  });
});
