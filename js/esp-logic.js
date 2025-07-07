/**
 * AllNighter v2 - Spanish Logic
 * 
 * A QA tool for detecting special characters in HTML content.
 * This file contains the main logic for the Spanish version of the application.
 * 
 * @author Julián LR, Lucas Salmerón Olschansky, Julián Moreira
 * @version 2.0.0
 * @license MIT
 */

// Import shared utilities and configuration
import { 
  getState,
  resetState,
  updateState,
  validateFile,
  validateFileSize,
  validateFileType,
  showError,
  showSuccess,
  showProgress,
  updateProgress,
  removeProgress,
  scanTextForCharacters,
  initializeDragAndDrop,
  exportResults,
  copyResultsToClipboard,
  createFileReader,
  createResultElement
} from './utils.js';

import { APP_CONFIG, MESSAGES, SELECTORS, REGEX_PATTERNS } from './config.js';

// Set language for this module
const LANG = 'SPANISH';

function StartOP(e) {
  resetState();
  const div = document.querySelector(SELECTORS.CONSOLE);

  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }

  // Validate files before processing
  const files = Array.from(e.target.files);
  const validFiles = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    if (!validateFile(file)) {
      if (!validateFileSize(file)) {
        showError(MESSAGES[LANG].ERROR_FILE_SIZE);
      }
      if (!validateFileType(file)) {
        showError(MESSAGES[LANG].ERROR_FILE_TYPE);
      }
      continue;
    }
    
    validFiles.push(file);
    const state = getState();
    state.namef[validFiles.length - 1] = file.name;
  }

  if (validFiles.length === 0) {
    showError(MESSAGES[LANG].ERROR_NO_FILES);
    return;
  }

  updateState({ totalFiles: validFiles.length });
  showProgress();

  // Process valid files
  for (let i = 0; i < validFiles.length; i++) {
    const reader = createFileReader(
      (content) => handleFileContent(content, i),
      (error) => {
        showError(`${MESSAGES[LANG].ERROR_FILE_READ}: ${validFiles[i].name}`);
        const state = getState();
        updateState({ processedFiles: state.processedFiles + 1 });
        updateProgress(state.processedFiles + 1, state.totalFiles);
        
        if (state.processedFiles + 1 >= state.totalFiles) {
          removeProgress();
          showSuccess(MESSAGES[LANG].SUCCESS_COMPLETE);
        }
      }
    );

    try {
      // Try reading as UTF-8 first, then fallback to other encodings
      reader.readAsText(validFiles[i], 'UTF-8');
    } catch (error) {
      // Try alternative encoding
      try {
        reader.readAsText(validFiles[i], 'ISO-8859-1');
      } catch (fallbackError) {
        showError(`${MESSAGES[LANG].ERROR_FILE_READ}: ${validFiles[i].name}`);
      }
    }
  }
}

function handleFileContent(content, index) {
  displayContents(content);
  updateState({ processedFiles: processedFiles + 1 });
  updateProgress(processedFiles, totalFiles, namef[index]);
  
  if (processedFiles >= totalFiles) {
    removeProgress();
    showSuccess(MESSAGES[LANG].SUCCESS_COMPLETE);
    addExportButtons();
  }
}

function displayContents(contents) {
  const name = namef[fileIndex];
  updateState({ fileIndex: fileIndex + 1 });

  const scanResult = scanTextForCharacters(contents);
  
  if (scanResult.hasSpecialChars) {
    const lines = contents.split('\n');
    let currentFileResults = [];

    for (let linea = 0; linea < lines.length; linea++) {
      const line = lines[linea];
      const matches = [...line.matchAll(REGEX_PATTERNS.SPECIAL_CHARS)];
      
      matches.forEach(match => {
        const result = `ARCHIVO: ${name}:    LINEA: ${linea + 1} - PUESTO: ${match.index + 1}`;
        const tag = createResultElement(
          'line-1 anim-typewriter',
          result,
          { 
            'role': 'listitem',
            'aria-label': `Archivo ${name}, línea ${linea + 1}, posición ${match.index + 1}, carácter especial ${match[0]}`
          }
        );
        
        document.querySelector(SELECTORS.CONSOLE).appendChild(tag);
        
        // Store result for export functionality
        currentFileResults.push({
          file: name,
          line: linea + 1,
          position: match.index + 1,
          character: match[0]
        });
      });
    }
    
    // Store consolidated results for export
    if (currentFileResults.length > 0) {
      const fileResult = {
        fileName: name,
        characters: [...new Set(currentFileResults.map(r => r.character))],
        count: currentFileResults.length,
        details: currentFileResults
      };
      scanResults.push(fileResult);
    }
  } else {
    const tag = createResultElement(
      'line-1 anim-typewriter',
      `ARCHIVO: ${name} - NO CONTIENE CARACTERES ESPECIALES`,
      { 
        'role': 'listitem',
        'aria-label': `Archivo ${name} no contiene caracteres especiales`
      }
    );
    document.querySelector(SELECTORS.CONSOLE).appendChild(tag);
  }
}

// Simplified checkForm function (legacy compatibility)
function checkForm(thetxt) {
  const result = scanTextForCharacters(thetxt);
  return result.hasSpecialChars ? result.foundCharacters : null;
}

// Export functionality - using shared utilities
function addExportButtons() {
  const consoleDiv = document.querySelector(SELECTORS.CONSOLE);
  
  // Only add buttons if they don't already exist
  if (document.querySelector(SELECTORS.EXPORT_TXT_BTN)) {
    return;
  }
  
  const exportContainer = document.createElement('div');
  exportContainer.className = 'export-container';
  exportContainer.style.marginTop = '20px';
  
  const exportTxtBtn = document.createElement('button');
  exportTxtBtn.id = 'export-txt';
  exportTxtBtn.textContent = 'Descargar TXT';
  exportTxtBtn.className = 'export-btn';
  exportTxtBtn.addEventListener('click', () => exportResults('txt', 'es'));
  
  const exportCsvBtn = document.createElement('button');
  exportCsvBtn.id = 'export-csv';
  exportCsvBtn.textContent = 'Descargar CSV';
  exportCsvBtn.className = 'export-btn';
  exportCsvBtn.addEventListener('click', () => exportResults('csv', 'es'));
  
  const copyBtn = document.createElement('button');
  copyBtn.id = 'copy-results';
  copyBtn.textContent = 'Copiar Resultados';
  copyBtn.className = 'export-btn';
  copyBtn.addEventListener('click', () => copyResultsToClipboard('es'));
  
  exportContainer.appendChild(exportTxtBtn);
  exportContainer.appendChild(exportCsvBtn);
  exportContainer.appendChild(copyBtn);
  consoleDiv.appendChild(exportContainer);
}

// Initialize application when page loads
document.addEventListener('DOMContentLoaded', () => {
  initializeDragAndDrop(StartOP);
  
  // Set up file input handler
  const fileInput = document.querySelector(SELECTORS.FILE_INPUT);
  if (fileInput) {
    fileInput.addEventListener('change', StartOP, false);
  }
  
  // Announce page ready to screen readers
  showSuccess('AllNighter v2 listo para analizar archivos');
});
