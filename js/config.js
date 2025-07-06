/**
 * AllNighter v2 - Configuration
 * 
 * Central configuration file for the AllNighter application.
 * Contains all constants, regex patterns, and configuration options.
 * 
 * @author Julián LR, Lucas Salmerón Olschansky, Julián Moreira
 * @version 2.0.0
 * @license MIT
 */

// Application configuration
export const APP_CONFIG = {
  // File processing limits
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB limit
  MAX_FILES_ARRAY_SIZE: 10,
  
  // Supported file types
  ALLOWED_FILE_TYPES: ['.txt', '.html', '.htm', '.css', '.js', '.xml', '.csv'],
  
  // UI configuration
  ANIMATION_DELAY: 50, // milliseconds
  ERROR_COLOR: '#ff6b6b',
  SUCCESS_COLOR: '#51cf66',
  
  // Export configuration
  EXPORT_FORMATS: {
    TXT: 'txt',
    CSV: 'csv'
  }
};

// Regex patterns for character detection
export const REGEX_PATTERNS = {
  // Special characters that need to be detected
  SPECIAL_CHARS: /[¿º«»ª¡ÀÂÃÄÁÆàâãäæÇçÊËÉêëïÍÏÔÖÕÓöõôÜÚüáéí'óüúÑñ✓✔‑–—€®©℠™´'']/g,
  
  // File extension validation
  FILE_EXTENSION: /\.[^/.]+$/
};

// Localized messages
export const MESSAGES = {
  SPANISH: {
    ERROR_FILE_SIZE: 'El archivo es demasiado grande. Tamaño máximo: 5MB',
    ERROR_FILE_TYPE: 'Tipo de archivo no soportado. Tipos permitidos: .txt, .html, .htm, .css, .js, .xml, .csv',
    ERROR_FILE_READ: 'Error al leer el archivo',
    ERROR_NO_FILES: 'No se seleccionaron archivos',
    SUCCESS_PROCESSING: 'Procesando archivos...',
    SUCCESS_COMPLETE: 'Análisis completado',
    PROGRESS_PROCESSING: 'Procesando archivo {current} de {total}...',
    EXPORT_SUCCESS: 'Resultados exportados exitosamente',
    COPY_SUCCESS: 'Resultados copiados al portapapeles'
  },
  
  ENGLISH: {
    ERROR_FILE_SIZE: 'File is too large. Maximum size: 5MB',
    ERROR_FILE_TYPE: 'Unsupported file type. Allowed types: .txt, .html, .htm, .css, .js, .xml, .csv',
    ERROR_FILE_READ: 'Error reading file',
    ERROR_NO_FILES: 'No files selected',
    SUCCESS_PROCESSING: 'Processing files...',
    SUCCESS_COMPLETE: 'Analysis completed',
    PROGRESS_PROCESSING: 'Processing file {current} of {total}...',
    EXPORT_SUCCESS: 'Results exported successfully',
    COPY_SUCCESS: 'Results copied to clipboard'
  }
};

// DOM selectors
export const SELECTORS = {
  CONSOLE: '#console',
  FILE_INPUT: '#uploaded',
  UPLOAD_AREA: '#upload-area',
  EXPORT_TXT_BTN: '#export-txt',
  EXPORT_CSV_BTN: '#export-csv',
  COPY_RESULTS_BTN: '#copy-results',
  PROGRESS_CONTAINER: '#progress-container',
  PROGRESS_BAR: '#progress-bar',
  PROGRESS_TEXT: '#progress-text'
};
