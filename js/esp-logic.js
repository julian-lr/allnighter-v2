const namef = ['', '', '', '', '', '', '', '', '', ''];
let fileIndex = 0;

// Configuration constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit
const ALLOWED_FILE_TYPES = ['.txt', '.html', '.htm', '.css', '.js', '.xml', '.csv'];

// Performance optimization: compile regex once
const SPECIAL_CHARS_REGEX = /[¿º«»ª¡ÀÂÃÄÁÆàâãäæÇçÊËÉêëïÍÏÔÖÕÓöõôÜÚüáéí'óüúÑñ✓✔‑–—€®©℠™´'']/g;

// Progress tracking
let totalFiles = 0;
let processedFiles = 0;

// Results storage for export functionality
let scanResults = [];

// File validation functions
function validateFileSize(file) {
  return file.size <= MAX_FILE_SIZE;
}

function validateFileType(file) {
  const fileName = file.name.toLowerCase();
  return ALLOWED_FILE_TYPES.some(type => fileName.endsWith(type));
}

function showError(message) {
  const consoleDiv = document.getElementById('console');
  const errorTag = document.createElement('p');
  errorTag.className = 'line-1 anim-typewriter error-message';
  errorTag.setAttribute('role', 'alert');
  errorTag.setAttribute('aria-live', 'assertive');
  errorTag.style.color = '#ff6b6b';
  const errorText = document.createTextNode(`ERROR: ${message}`);
  errorTag.appendChild(errorText);
  consoleDiv.appendChild(errorTag);
  
  // Announce error to screen readers
  announceToScreenReader(`Error: ${message}`);
}

function StartOP(e) {
  fileIndex = 0;
  processedFiles = 0;
  scanResults = []; // Reset results for new scan
  const div = document.getElementById('console');

  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }

  // Validate files before processing
  const files = Array.from(e.target.files);
  const validFiles = [];

  totalFiles = files.length; // Track total files for progress
  processedFiles = 0; // Reset processed files count

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    if (!validateFileSize(file)) {
      showError(`Archivo "${file.name}" es demasiado grande. Máximo permitido: 5MB`);
      continue;
    }
    
    if (!validateFileType(file)) {
      showError(`Tipo de archivo "${file.name}" no permitido. Tipos válidos: ${ALLOWED_FILE_TYPES.join(', ')}`);
      continue;
    }
    
    validFiles.push(file);
    namef[validFiles.length - 1] = file.name;
  }

  if (validFiles.length === 0) {
    showError('No hay archivos válidos para procesar');
    return;
  }

  totalFiles = validFiles.length;
  showProgress();

  // Process valid files
  for (let i = 0; i < validFiles.length; i++) {
    let reader = new FileReader();

    reader.onloadend = function (e) {
      let contents = reader.result;
      displayContents(contents);
      processedFiles++;
      showProgress();
      
      if (processedFiles === totalFiles) {
        removeProgress();
        addExportButtons(); // Add export buttons when all files are processed
      }
    };

    reader.onerror = function() {
      showError(`Error leyendo el archivo: ${validFiles[i].name}`);
      processedFiles++;
      showProgress();
    };

    reader.readAsText(validFiles[i]);
  }
}

function checkForm(thetxt) {
  let withoutEnter = thetxt.replace(/\r?\n|\r/g, '');
  let result = withoutEnter.match(SPECIAL_CHARS_REGEX);

  return result;
}

function displayContents(contents) {
  const name = namef[fileIndex];
  fileIndex++;

  if (checkForm(contents)) {
    const lines = contents.split('\n');

    for (let linea = 0; linea < lines.length; linea++) {
      const line = lines[linea];
      // Use regex to find all matches in the line with their positions
      let match;
      SPECIAL_CHARS_REGEX.lastIndex = 0; // Reset regex state
      
      while ((match = SPECIAL_CHARS_REGEX.exec(line)) !== null) {
        const result = `ARCHIVO: ${name}:    LINEA: ${linea + 1} - PUESTO: ${match.index + 1}`;
        const tag = document.createElement('p');
        tag.className = 'line-1 anim-typewriter';
        const text = document.createTextNode(result);
        tag.appendChild(text);
        const element = document.getElementById('console');
        element.appendChild(tag);
        
        // Make result accessible
        makeElementAccessible(tag, 'listitem');

        // Store result for export functionality
        scanResults.push({
          file: name,
          line: linea + 1,
          position: match.index + 1,
          character: match[0]
        });
      }
    }
  } else {
    const tag = document.createElement('p');
    const text = document.createTextNode(
      'ARCHIVO: ' + name + ' - NO CONTIENE CARACTERES ESPECIALES'
    );
    tag.appendChild(text);
    const element = document.getElementById('console');
    tag.className = 'line-1 anim-typewriter';
    element.appendChild(tag);
  }

  processedFiles++; // Increment processed files count
  showProgress(); // Update progress indicator
  removeProgress(); // Remove progress indicator after processing
}

function showProgress() {
  const progressDiv = document.getElementById('console');
  const existingProgress = document.querySelector('.progress-indicator');
  
  if (existingProgress) {
    existingProgress.remove();
  }
  
  if (processedFiles < totalFiles) {
    const progressTag = document.createElement('p');
    progressTag.className = 'line-1 progress-indicator';
    progressTag.style.color = '#4CAF50';
    const progressText = document.createTextNode(
      `Procesando archivos... ${processedFiles}/${totalFiles} completados`
    );
    progressTag.appendChild(progressText);
    progressDiv.appendChild(progressTag);
  }
}

function removeProgress() {
  const existingProgress = document.querySelector('.progress-indicator');
  if (existingProgress) {
    existingProgress.remove();
  }
}

// Drag and drop functionality
function initializeDragAndDrop() {
  const uploadArea = document.querySelector('.pagecontainer__form');
  const fileInput = document.getElementById('btn');
  
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    uploadArea.addEventListener(eventName, preventDefaults, false);
  });
  
  ['dragenter', 'dragover'].forEach(eventName => {
    uploadArea.addEventListener(eventName, highlight, false);
  });
  
  ['dragleave', 'drop'].forEach(eventName => {
    uploadArea.addEventListener(eventName, unhighlight, false);
  });
  
  uploadArea.addEventListener('drop', handleDrop, false);
  uploadArea.addEventListener('click', () => fileInput.click());
}

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

function highlight(e) {
  e.currentTarget.classList.add('drag-highlight');
}

function unhighlight(e) {
  e.currentTarget.classList.remove('drag-highlight');
}

function handleDrop(e) {
  const dt = e.dataTransfer;
  const files = dt.files;
  
  // Create a fake event to reuse existing StartOP function
  const fakeEvent = { target: { files: files } };
  StartOP(fakeEvent);
}

// Export functionality
function exportResults(format = 'txt') {
  if (scanResults.length === 0) {
    showError('No hay resultados para exportar');
    return;
  }
  
  let content = '';
  let filename = '';
  let mimeType = '';
  
  if (format === 'csv') {
    content = 'Archivo,Línea,Posición,Carácter\n';
    scanResults.forEach(result => {
      content += `"${result.file}",${result.line},${result.position},"${result.character}"\n`;
    });
    filename = 'allnighter-results.csv';
    mimeType = 'text/csv';
  } else {
    content = 'Resultados de AllNighter - Caracteres Especiales Encontrados\n';
    content += '='.repeat(60) + '\n\n';
    scanResults.forEach(result => {
      content += `ARCHIVO: ${result.file} - LÍNEA: ${result.line} - POSICIÓN: ${result.position} - CARÁCTER: "${result.character}"\n`;
    });
    filename = 'allnighter-results.txt';
    mimeType = 'text/plain';
  }
  
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}

function copyToClipboard() {
  if (scanResults.length === 0) {
    showError('No hay resultados para copiar');
    return;
  }
  
  let content = scanResults.map(result => 
    `ARCHIVO: ${result.file} - LÍNEA: ${result.line} - POSICIÓN: ${result.position}`
  ).join('\n');
  
  navigator.clipboard.writeText(content).then(() => {
    showSuccess('Resultados copiados al portapapeles');
  }).catch(() => {
    showError('Error al copiar al portapapeles');
  });
}

function showSuccess(message) {
  const consoleDiv = document.getElementById('console');
  const successTag = document.createElement('p');
  successTag.className = 'line-1 success-message';
  successTag.setAttribute('role', 'status');
  successTag.setAttribute('aria-live', 'polite');
  successTag.style.color = '#4CAF50';
  const successText = document.createTextNode(`✓ ${message}`);
  successTag.appendChild(successText);
  consoleDiv.appendChild(successTag);
  
  // Announce success to screen readers
  announceToScreenReader(message);
  
  // Remove success message after 3 seconds
  setTimeout(() => {
    if (successTag.parentNode) {
      successTag.parentNode.removeChild(successTag);
    }
  }, 3000);
}

function addExportButtons() {
  // Remove existing export buttons if any
  const existingButtons = document.querySelector('.export-buttons');
  if (existingButtons) {
    existingButtons.remove();
  }

  if (scanResults.length === 0) {
    return; // No results to export
  }

  const consoleDiv = document.getElementById('console');
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'export-buttons';
  buttonContainer.setAttribute('role', 'region');
  buttonContainer.setAttribute('aria-label', 'Opciones de exportación');
  buttonContainer.innerHTML = `
    <div style="margin: 20px 0; text-align: center; border-top: 1px solid #555; padding-top: 20px;">
      <p style="color: #4CAF50; margin-bottom: 10px;" role="status" aria-live="polite">📊 ${scanResults.length} caracteres especiales encontrados</p>
      <button onclick="exportResults('txt')" class="export-btn" aria-label="Exportar resultados como archivo de texto">📄 Exportar TXT</button>
      <button onclick="exportResults('csv')" class="export-btn" aria-label="Exportar resultados como archivo CSV">📊 Exportar CSV</button>
      <button onclick="copyToClipboard()" class="export-btn" aria-label="Copiar resultados al portapapeles">📋 Copiar</button>
    </div>
  `;
  
  consoleDiv.appendChild(buttonContainer);
  
  // Announce completion to screen readers
  announceToScreenReader(`Análisis completado. ${scanResults.length} caracteres especiales encontrados. Opciones de exportación disponibles.`);
}

// Accessibility functions
function initializeAccessibility() {
  // Add keyboard navigation to drag-drop area
  const dragDropArea = document.querySelector('.drag-drop-area');
  if (dragDropArea) {
    dragDropArea.addEventListener('keydown', handleDragDropKeyDown);
  }

  // Add keyboard navigation to console area
  const consoleArea = document.getElementById('console');
  if (consoleArea) {
    consoleArea.addEventListener('keydown', handleConsoleKeyDown);
  }

  // Announce page load to screen readers
  announceToScreenReader('Página cargada. AllNighter - Analizador de caracteres especiales');
}

function handleDragDropKeyDown(e) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    document.getElementById('btn').click();
  }
}

function handleConsoleKeyDown(e) {
  const console = e.target;
  const results = console.querySelectorAll('.line-1:not(.progress-indicator):not(.error-message):not(.success-message)');
  
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault();
    
    if (results.length > 0) {
      let currentIndex = Array.from(results).findIndex(el => el.classList.contains('focused'));
      
      if (e.key === 'ArrowDown') {
        currentIndex = (currentIndex + 1) % results.length;
      } else {
        currentIndex = currentIndex <= 0 ? results.length - 1 : currentIndex - 1;
      }
      
      // Remove focus from all items
      results.forEach(el => el.classList.remove('focused'));
      
      // Focus current item
      results[currentIndex].classList.add('focused');
      results[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Announce to screen reader
      announceToScreenReader(results[currentIndex].textContent);
    }
  }
}

function announceToScreenReader(message) {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'assertive');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

function makeElementAccessible(element, role = 'listitem') {
  element.setAttribute('role', role);
  element.setAttribute('tabindex', '0');
  
  // Add keyboard navigation
  element.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      // Copy this result to clipboard
      navigator.clipboard.writeText(element.textContent).then(() => {
        announceToScreenReader('Resultado copiado al portapapeles');
      });
    }
  });
}

// Initialize drag and drop when page loads
document.addEventListener('DOMContentLoaded', () => {
  initializeDragAndDrop();
  initializeAccessibility();
});

document.getElementById('btn').addEventListener('change', StartOP, false);
