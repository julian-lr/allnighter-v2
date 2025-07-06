/**
 * AllNighter v2 - English Logic
 * 
 * A QA tool for detecting special characters in HTML content.
 * This file contains the main logic for the English version of the application.
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
const LANG = 'ENGLISH';

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
        updateState({ processedFiles: processedFiles + 1 });
        updateProgress(processedFiles, totalFiles);
        
        if (processedFiles >= totalFiles) {
          removeProgress();
          showSuccess(MESSAGES[LANG].SUCCESS_COMPLETE);
        }
      }
    );

    try {
      reader.readAsText(validFiles[i]);
    } catch (error) {
      showError(`${MESSAGES[LANG].ERROR_FILE_READ}: ${validFiles[i].name}`);
    }
  }
}

function handleFileContent(content, index) {
  displayContents(content);
  const state = getState();
  updateState({ processedFiles: state.processedFiles + 1 });
  updateProgress(state.processedFiles + 1, state.totalFiles, state.namef[index]);
  
  if (state.processedFiles + 1 >= state.totalFiles) {
    removeProgress();
    showSuccess(MESSAGES[LANG].SUCCESS_COMPLETE);
    addExportButtons();
  }
}

function displayContents(contents) {
  const state = getState();
  const name = state.namef[state.fileIndex];
  updateState({ fileIndex: state.fileIndex + 1 });

  const scanResult = scanTextForCharacters(contents);
  
  if (scanResult.hasSpecialChars) {
    const lines = contents.split('\n');
    let currentFileResults = [];

    for (let linea = 0; linea < lines.length; linea++) {
      const line = lines[linea];
      const matches = [...line.matchAll(REGEX_PATTERNS.SPECIAL_CHARS)];
      
      matches.forEach(match => {
        const result = `FILE: ${name}:    LINE: ${linea + 1} - POSITION: ${match.index + 1}`;
        const tag = createResultElement(
          'line-1 anim-typewriter',
          result,
          { 
            'role': 'listitem',
            'aria-label': `File ${name}, line ${linea + 1}, position ${match.index + 1}, special character ${match[0]}`
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
      const currentState = getState();
      currentState.scanResults.push(fileResult);
    }
  } else {
    const tag = createResultElement(
      'line-1 anim-typewriter',
      `FILE: ${name} - DOES NOT CONTAIN SPECIAL CHARACTERS`,
      { 
        'role': 'listitem',
        'aria-label': `File ${name} does not contain special characters`
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
  exportTxtBtn.textContent = 'Export TXT';
  exportTxtBtn.className = 'export-btn';
  exportTxtBtn.addEventListener('click', () => exportResults('txt', 'en'));
  
  const exportCsvBtn = document.createElement('button');
  exportCsvBtn.id = 'export-csv';
  exportCsvBtn.textContent = 'Export CSV';
  exportCsvBtn.className = 'export-btn';
  exportCsvBtn.addEventListener('click', () => exportResults('csv', 'en'));
  
  const copyBtn = document.createElement('button');
  copyBtn.id = 'copy-results';
  copyBtn.textContent = 'Copy to Clipboard';
  copyBtn.className = 'export-btn';
  copyBtn.addEventListener('click', () => copyResultsToClipboard('en'));
  
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
  showSuccess('AllNighter v2 ready to analyze files');
});
