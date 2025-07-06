/**
 * End-to-End Tests for AllNighter v2
 * Tests complete user workflows and scenarios
 */

import { jest } from '@jest/globals';

// Mock the config module
const mockConfig = {
  APP_CONFIG: {
    MAX_FILE_SIZE: 5 * 1024 * 1024,
    ALLOWED_FILE_TYPES: ['.txt', '.html', '.htm', '.css', '.js', '.xml', '.csv']
  },
  REGEX_PATTERNS: {
    SPECIAL_CHARS: /[¿º«»ª¡ÀÂÃÄÁÆàâãäæÇçÊËÉêëïÍÏÔÖÕÓöõôÜÚüáéí'óüúÑñ✓✔‑–—€®©℠™´'']/g
  },
  SELECTORS: {
    CONSOLE: '#console',
    FILE_INPUT: '#uploaded',
    UPLOAD_AREA: '#upload-area'
  },
  MESSAGES: {
    SPANISH: {
      ERROR_FILE_SIZE: 'El archivo es demasiado grande',
      ERROR_FILE_TYPE: 'Tipo de archivo no soportado',
      ERROR_NO_FILES: 'No se seleccionaron archivos',
      SUCCESS_COMPLETE: 'Análisis completado'
    },
    ENGLISH: {
      ERROR_FILE_SIZE: 'File is too large',
      ERROR_FILE_TYPE: 'Unsupported file type', 
      ERROR_NO_FILES: 'No files selected',
      SUCCESS_COMPLETE: 'Analysis completed'
    }
  }
};

jest.unstable_mockModule('../js/config.js', () => mockConfig);

describe('End-to-End User Scenarios', () => {
  beforeEach(() => {
    // Set up complete DOM structure
    document.body.innerHTML = `
      <header>
        <nav class="navbar">
          <div class="container">
            <a class="navbar-brand me-auto eng" href="./eng.html">
              <h2>Go to English version</h2>
            </a>
            <a class="navbar-brand ms-auto" href="../index.html">
              <img src="../img/AN-logo.png" alt="AllNighter" />
            </a>
          </div>
        </nav>
      </header>
      <main role="main" id="main">
        <div class="pagecontainer">
          <h1 class="pagecontainer__title">Choose files to analyze</h1>
          <div class="form-upload pagecontainer__form drag-drop-area" 
               id="upload-area"
               role="button" 
               tabindex="0">
            <form class="upload">
              <input type="file" id="uploaded" name="uploaded" multiple accept=".txt,.html,.css,.js,.xml,.csv">
            </form>
          </div>
          <div id="outdiv">
            <div id="console" role="log" aria-live="polite"></div>
          </div>
        </div>
      </main>
    `;
  });

  describe('Complete Spanish Workflow', () => {
    test('should handle complete Spanish file analysis workflow', async () => {
      const { 
        getState, 
        resetState, 
        updateState, 
        validateFile, 
        scanTextForCharacters,
        showProgress,
        updateProgress,
        removeProgress,
        showSuccess
      } = await import('../js/utils.js');

      // Reset state for fresh test
      resetState();

      // Step 1: User selects Spanish files
      const spanishFiles = [
        {
          name: 'documento.txt',
          size: 2048,
          content: `
            Este documento contiene varios caracteres especiales.
            ¿Cómo están ustedes?
            ¡Muy bien, gracias!
            Acentos: áéíóú
            Eñes: niño, año, señor
            Símbolos: © ® ™
          `
        },
        {
          name: 'articulo.html',
          size: 1024,
          content: `
            <html>
              <head><title>Artículo en Español</title></head>
              <body>
                <h1>¿Qué tal?</h1>
                <p>Este es un artículo con acentos y eñes.</p>
              </body>
            </html>
          `
        }
      ];

      // Step 2: Validate files
      const validFiles = spanishFiles.filter(validateFile);
      expect(validFiles).toHaveLength(2);

      // Step 3: Set up processing
      updateState({ totalFiles: validFiles.length });
      const state = getState();
      validFiles.forEach((file, index) => {
        state.namef[index] = file.name;
      });

      // Step 4: Show progress
      showProgress();
      expect(document.getElementById('progress-container')).toBeTruthy();

      // Step 5: Process each file
      const allResults = [];
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        
        // Scan file content
        const scanResult = scanTextForCharacters(file.content);
        expect(scanResult.hasSpecialChars).toBe(true);
        
        // Simulate line-by-line processing
        const lines = file.content.split('\n');
        const fileResults = [];
        
        lines.forEach((line, lineIndex) => {
          const matches = [...line.matchAll(mockConfig.REGEX_PATTERNS.SPECIAL_CHARS)];
          matches.forEach(match => {
            fileResults.push({
              file: file.name,
              line: lineIndex + 1,
              position: match.index + 1,
              character: match[0]
            });
          });
        });
        
        allResults.push(...fileResults);
        
        // Update progress
        updateState({ processedFiles: i + 1 });
        updateProgress(i + 1, validFiles.length, file.name);
      }

      // Step 6: Complete processing
      removeProgress();
      showSuccess('Análisis completado');
      
      // Verify results
      expect(allResults.length).toBeGreaterThan(0);
      
      // Should find Spanish-specific characters
      const foundChars = [...new Set(allResults.map(r => r.character))];
      expect(foundChars).toContain('¿');
      expect(foundChars).toContain('á');
      expect(foundChars).toContain('é');
      expect(foundChars).toContain('ñ');
      
      // Verify final state
      const finalState = getState();
      expect(finalState.processedFiles).toBe(2);
      expect(finalState.totalFiles).toBe(2);
      
      // Check success message displayed
      const successMessages = document.querySelectorAll('.success-message');
      expect(successMessages.length).toBeGreaterThan(0);
    });
  });

  describe('Complete English Workflow', () => {
    test('should handle complete English file analysis workflow', async () => {
      const { 
        resetState, 
        updateState, 
        validateFile, 
        scanTextForCharacters,
        showSuccess
      } = await import('../js/utils.js');

      resetState();

      // English files with minimal special characters
      const englishFiles = [
        {
          name: 'document.txt',
          size: 1500,
          content: `
            This document contains mostly regular text.
            Some special quotes: "hello" and 'world'.
            Maybe some symbols: € and ©.
            But mostly standard English characters.
          `
        },
        {
          name: 'styles.css',
          size: 800,
          content: `
            body { font-family: 'Arial', sans-serif; }
            h1::before { content: "→"; }
            .special { color: #333; }
          `
        }
      ];

      const validFiles = englishFiles.filter(validateFile);
      expect(validFiles).toHaveLength(2);

      updateState({ totalFiles: validFiles.length });

      // Process files
      let totalSpecialChars = 0;
      for (const file of validFiles) {
        const scanResult = scanTextForCharacters(file.content);
        totalSpecialChars += scanResult.totalCount;
      }

      // English files should have fewer special characters than Spanish
      expect(totalSpecialChars).toBeLessThan(10);
      
      showSuccess('Analysis completed');
      const successMessages = document.querySelectorAll('.success-message');
      expect(successMessages.length).toBeGreaterThan(0);
    });
  });

  describe('Error Handling Scenarios', () => {
    test('should handle invalid file types gracefully', async () => {
      const { validateFile, showError } = await import('../js/utils.js');

      const invalidFiles = [
        { name: 'image.jpg', size: 1024 },
        { name: 'document.pdf', size: 2048 },
        { name: 'archive.zip', size: 512 }
      ];

      invalidFiles.forEach(file => {
        expect(validateFile(file)).toBe(false);
      });

      // Simulate error display
      showError('Unsupported file type');
      
      const errorMessages = document.querySelectorAll('.error-message');
      expect(errorMessages.length).toBeGreaterThan(0);
      expect(errorMessages[0]).toHaveAttribute('role', 'alert');
    });

    test('should handle oversized files appropriately', async () => {
      const { validateFile, showError } = await import('../js/utils.js');

      const oversizedFile = {
        name: 'large.txt',
        size: 10 * 1024 * 1024 // 10MB
      };

      expect(validateFile(oversizedFile)).toBe(false);
      
      showError('File is too large');
      
      const errorMessages = document.querySelectorAll('.error-message');
      expect(errorMessages[0].textContent).toContain('File is too large');
    });

    test('should handle empty file selection', async () => {
      const { showError } = await import('../js/utils.js');

      // Simulate no files selected
      showError('No files selected');
      
      const errorMessages = document.querySelectorAll('.error-message');
      expect(errorMessages[0].textContent).toContain('No files selected');
    });
  });

  describe('Accessibility Compliance', () => {
    test('should maintain accessibility throughout workflow', async () => {
      const { 
        showProgress, 
        showSuccess, 
        showError,
        createResultElement 
      } = await import('../js/utils.js');

      // Check progress accessibility
      showProgress();
      const progressContainer = document.getElementById('progress-container');
      expect(progressContainer).toHaveAttribute('role', 'progressbar');
      expect(progressContainer).toHaveAttribute('aria-label');

      // Check success message accessibility
      showSuccess('Test success');
      const successMessages = document.querySelectorAll('.success-message');
      expect(successMessages[0]).toHaveAttribute('role', 'status');
      expect(successMessages[0]).toHaveAttribute('aria-live', 'polite');

      // Check error message accessibility
      showError('Test error');
      const errorMessages = document.querySelectorAll('.error-message');
      expect(errorMessages[0]).toHaveAttribute('role', 'alert');
      expect(errorMessages[0]).toHaveAttribute('aria-live', 'assertive');

      // Check result element accessibility
      const resultElement = createResultElement(
        'line-1',
        'Test result',
        { 'role': 'listitem', 'aria-label': 'Test description' }
      );
      expect(resultElement).toHaveAttribute('role', 'listitem');
      expect(resultElement).toHaveAttribute('aria-label');
    });

    test('should support keyboard navigation', () => {
      const uploadArea = document.getElementById('upload-area');
      expect(uploadArea).toHaveAttribute('tabindex', '0');
      expect(uploadArea).toHaveAttribute('role', 'button');
      
      const console = document.getElementById('console');
      expect(console).toHaveAttribute('role', 'log');
      expect(console).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('Export Functionality', () => {
    test('should handle complete export workflow', async () => {
      const { 
        updateState, 
        exportResults, 
        copyResultsToClipboard 
      } = await import('../js/utils.js');

      // Set up mock results
      updateState({
        scanResults: [
          {
            fileName: 'test.txt',
            characters: ['á', 'é', 'ñ'],
            count: 5,
            details: [
              { file: 'test.txt', line: 1, position: 5, character: 'á' },
              { file: 'test.txt', line: 2, position: 3, character: 'é' }
            ]
          }
        ]
      });

      // Test TXT export
      exportResults('txt', 'en');
      expect(window.URL.createObjectURL).toHaveBeenCalled();

      // Test CSV export  
      exportResults('csv', 'en');
      expect(window.URL.createObjectURL).toHaveBeenCalledTimes(2);

      // Test clipboard copy
      await copyResultsToClipboard('en');
      expect(navigator.clipboard.writeText).toHaveBeenCalled();
    });
  });

  describe('Performance and Edge Cases', () => {
    test('should handle large number of special characters efficiently', async () => {
      const { scanTextForCharacters } = await import('../js/utils.js');

      // Create text with many special characters
      const largeText = 'á'.repeat(1000) + 'é'.repeat(1000) + 'ñ'.repeat(1000);
      
      const startTime = performance.now();
      const result = scanTextForCharacters(largeText);
      const endTime = performance.now();
      
      expect(result.hasSpecialChars).toBe(true);
      expect(result.totalCount).toBe(3000);
      expect(result.foundCharacters).toEqual(['á', 'é', 'ñ']);
      
      // Should complete within reasonable time
      expect(endTime - startTime).toBeLessThan(100); // 100ms
    });

    test('should handle edge case characters correctly', async () => {
      const { scanTextForCharacters } = await import('../js/utils.js');

      const edgeCaseText = '´\'\'‑–—€®©℠™✓✔«»º';
      const result = scanTextForCharacters(edgeCaseText);
      
      expect(result.hasSpecialChars).toBe(true);
      expect(result.foundCharacters.length).toBeGreaterThan(10);
      
      // Verify specific edge case characters
      expect(result.foundCharacters).toContain('€');
      expect(result.foundCharacters).toContain('®');
      expect(result.foundCharacters).toContain('©');
      expect(result.foundCharacters).toContain('™');
    });
  });
});
