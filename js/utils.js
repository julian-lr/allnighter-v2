/**
 * AllNighter v2 - Utilities
 * 
 * Shared utility functions for the AllNighter application.
 * Contains common functionality used by both Spanish and English versions.
 * 
 * @author Julián LR, Lucas Salmerón Olschansky, Julián Moreira
 * @version 2.0.0
 * @license MIT
 */

import { APP_CONFIG, REGEX_PATTERNS, SELECTORS } from './config.js';

// Global state management
let fileIndex = 0;
let totalFiles = 0;
let processedFiles = 0;
let scanResults = [];
const namef = ['', '', '', '', '', '', '', '', '', ''];

/**
 * Get current state
 */
export function getState() {
  return {
    fileIndex,
    totalFiles,
    processedFiles,
    scanResults,
    namef
  };
}

/**
 * Reset global state for new scan session
 */
export function resetState() {
  fileIndex = 0;
  totalFiles = 0;
  processedFiles = 0;
  scanResults = [];
  namef.fill('');
}

/**
 * Update global state
 * @param {Object} updates - Object containing state updates
 */
export function updateState(updates) {
  if (updates.fileIndex !== undefined) {
    fileIndex = updates.fileIndex;
  }
  if (updates.totalFiles !== undefined) {
    totalFiles = updates.totalFiles;
  }
  if (updates.processedFiles !== undefined) {
    processedFiles = updates.processedFiles;
  }
  if (updates.scanResults !== undefined) {
    scanResults = updates.scanResults;
  }
}

/**
 * File validation functions
 */
export function validateFileSize(file) {
  return file.size <= APP_CONFIG.MAX_FILE_SIZE;
}

export function validateFileType(file) {
  const fileName = file.name.toLowerCase();
  return APP_CONFIG.ALLOWED_FILE_TYPES.some(type => fileName.endsWith(type));
}

export function validateFile(file) {
  return validateFileSize(file) && validateFileType(file);
}

/**
 * DOM manipulation utilities
 */
export function showError(message) {
  const consoleDiv = document.querySelector(SELECTORS.CONSOLE);
  const errorTag = document.createElement('p');
  errorTag.className = 'line-1 anim-typewriter error-message';
  errorTag.setAttribute('role', 'alert');
  errorTag.setAttribute('aria-live', 'assertive');
  errorTag.style.color = APP_CONFIG.ERROR_COLOR;
  const errorText = document.createTextNode(`ERROR: ${message}`);
  errorTag.appendChild(errorText);
  consoleDiv.appendChild(errorTag);
  
  // Announce error to screen readers
  if (window.speechSynthesis) {
    const utterance = new SpeechSynthesisUtterance(`Error: ${message}`);
    utterance.volume = 0.1;
    window.speechSynthesis.speak(utterance);
  }
}

export function showSuccess(message) {
  const consoleDiv = document.querySelector(SELECTORS.CONSOLE);
  const successTag = document.createElement('p');
  successTag.className = 'line-1 anim-typewriter success-message';
  successTag.setAttribute('role', 'status');
  successTag.setAttribute('aria-live', 'polite');
  successTag.style.color = APP_CONFIG.SUCCESS_COLOR;
  const successText = document.createTextNode(message);
  successTag.appendChild(successText);
  consoleDiv.appendChild(successTag);
}

/**
 * Progress indicator functions
 */
export function showProgress() {
  const progressHTML = `
    <div id="progress-container" role="progressbar" aria-label="File processing progress" aria-valuemin="0" aria-valuemax="100">
      <div id="progress-bar"></div>
      <div id="progress-text">Processing files...</div>
    </div>
  `;
  
  const consoleDiv = document.querySelector(SELECTORS.CONSOLE);
  consoleDiv.insertAdjacentHTML('beforeend', progressHTML);
}

export function updateProgress(current, total, fileName = '') {
  const progressContainer = document.querySelector(SELECTORS.PROGRESS_CONTAINER);
  const progressBar = document.querySelector(SELECTORS.PROGRESS_BAR);
  const progressText = document.querySelector(SELECTORS.PROGRESS_TEXT);
  
  if (progressContainer && progressBar && progressText) {
    const percentage = Math.round((current / total) * 100);
    progressBar.style.width = `${percentage}%`;
    progressContainer.setAttribute('aria-valuenow', percentage);
    
    const message = fileName 
      ? `Processing ${fileName} (${current}/${total})...`
      : `Processing file ${current} of ${total}...`;
    progressText.textContent = message;
  }
}

export function removeProgress() {
  const progressContainer = document.querySelector(SELECTORS.PROGRESS_CONTAINER);
  if (progressContainer) {
    progressContainer.remove();
  }
}

/**
 * Character scanning utilities
 */
export function scanTextForCharacters(text) {
  const matches = text.match(REGEX_PATTERNS.SPECIAL_CHARS);
  const foundChars = matches ? [...new Set(matches)] : [];
  const count = matches ? matches.length : 0;
  
  return {
    foundCharacters: foundChars,
    totalCount: count,
    hasSpecialChars: count > 0
  };
}

/**
 * Drag and drop utilities
 */
export function initializeDragAndDrop(handleFilesCallback) {
  const uploadArea = document.querySelector(SELECTORS.UPLOAD_AREA);
  if (!uploadArea) return;

  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    uploadArea.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
  });

  ['dragenter', 'dragover'].forEach(eventName => {
    uploadArea.addEventListener(eventName, highlight, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    uploadArea.addEventListener(eventName, unhighlight, false);
  });

  uploadArea.addEventListener('drop', (e) => handleDrop(e, handleFilesCallback), false);
}

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

function highlight(e) {
  e.target.classList.add('drag-over');
}

function unhighlight(e) {
  e.target.classList.remove('drag-over');
}

function handleDrop(e, handleFilesCallback) {
  const dt = e.dataTransfer;
  const files = dt.files;
  
  // Create a fake event to reuse existing file handling
  const fakeEvent = { target: { files: files } };
  handleFilesCallback(fakeEvent);
}

/**
 * Export functionality
 */
export function exportResults(format = 'txt', language = 'en') {
  if (scanResults.length === 0) {
    const message = language === 'es' 
      ? 'No hay resultados para exportar' 
      : 'No results to export';
    showError(message);
    return;
  }

  let content = '';
  let filename = '';
  let mimeType = '';

  if (format === 'csv') {
    content = 'File,Characters Found,Total Count\n';
    content += scanResults.map(result => 
      `"${result.fileName}","${result.characters.join(', ')}",${result.count}`
    ).join('\n');
    filename = 'allnighter-results.csv';
    mimeType = 'text/csv';
  } else {
    content = 'AllNighter v2 - Scan Results\n';
    content += '================================\n\n';
    content += scanResults.map(result => 
      `File: ${result.fileName}\n` +
      `Characters found: ${result.characters.join(', ')}\n` +
      `Total count: ${result.count}\n\n`
    ).join('');
    filename = 'allnighter-results.txt';
    mimeType = 'text/plain';
  }

  downloadFile(content, filename, mimeType);
  
  const message = language === 'es' 
    ? 'Resultados exportados exitosamente' 
    : 'Results exported successfully';
  showSuccess(message);
}

export function copyResultsToClipboard(language = 'en') {
  if (scanResults.length === 0) {
    const message = language === 'es' 
      ? 'No hay resultados para copiar' 
      : 'No results to copy';
    showError(message);
    return;
  }

  const content = scanResults.map(result => 
    `${result.fileName}: ${result.characters.join(', ')} (${result.count} total)`
  ).join('\n');

  navigator.clipboard.writeText(content).then(() => {
    const message = language === 'es' 
      ? 'Resultados copiados al portapapeles' 
      : 'Results copied to clipboard';
    showSuccess(message);
  }).catch(() => {
    const message = language === 'es' 
      ? 'Error al copiar al portapapeles' 
      : 'Error copying to clipboard';
    showError(message);
  });
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * File processing utilities
 */
export function createFileReader(onSuccess, onError) {
  const reader = new FileReader();
  
  reader.onloadend = function(e) {
    try {
      onSuccess(e.target.result);
    } catch (error) {
      onError(error);
    }
  };
  
  reader.onerror = function() {
    onError(new Error('File reading failed'));
  };
  
  return reader;
}

/**
 * DOM creation utilities
 */
export function createResultElement(className, content, attributes = {}) {
  const element = document.createElement('p');
  element.className = className;
  
  // Set attributes
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  
  // Set content
  if (typeof content === 'string') {
    element.textContent = content;
  } else {
    element.appendChild(content);
  }
  
  return element;
}
