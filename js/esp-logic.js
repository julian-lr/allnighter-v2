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
  errorTag.style.color = '#ff6b6b';
  const errorText = document.createTextNode(`ERROR: ${message}`);
  errorTag.appendChild(errorText);
  consoleDiv.appendChild(errorTag);
}

function StartOP(e) {
  fileIndex = 0;
  processedFiles = 0;
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

document.getElementById('btn').addEventListener('change', StartOP, false);
