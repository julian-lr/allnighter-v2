const namef = ['', '', '', '', '', '', '', '', '', ''];
let fileIndex = 0;

// Configuration constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit
const ALLOWED_FILE_TYPES = ['.txt', '.html', '.htm', '.css', '.js', '.xml', '.csv'];

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
  const div = document.getElementById('console');

  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }

  // Validate files before processing
  const files = Array.from(e.target.files);
  const validFiles = [];

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

  // Process valid files
  for (let i = 0; i < validFiles.length; i++) {
    let reader = new FileReader();

    reader.onloadend = function (e) {
      let contents = reader.result;
      displayContents(contents);
    };

    reader.onerror = function() {
      showError(`Error leyendo el archivo: ${validFiles[i].name}`);
    };

    reader.readAsText(validFiles[i]);
  }
}

function checkForm(thetxt) {
  let withoutEnter = thetxt.replace(/\r?\n|\r/g, '');
  let result = withoutEnter.match(
    /[¿º«»ª¡ÀÂÃÄÁÆàâãäæÇçÊËÉêëïÍÏÔÖÕÓöõôÜÚüáéí'óüúÑñ✓✔‑–—€®©℠™´’‘]/g
  );

  return result;
}

function displayContents(contents) {
  const name = namef[fileIndex];
  fileIndex++;

  if (checkForm(contents)) {
    const lines = contents.split('\n');

    for (let linea = 0; linea < lines.length; linea++) {
      for (let puesto = 0; puesto < lines[linea].length; puesto++) {
        if (
          lines[linea]
            .charAt(puesto)
            .match(
              /[¿º«»ª¡ÀÂÃÄÁÆàâãäæÇçÊËÉêëïÍÏÔÖÕÓöõôÜÚüáéí'óüúÑñ✓✔‑–—€®©℠™´’‘]/g
            ) !== null
        ) {
          const result =
            'ARCHIVO: ' +
            name +
            ':    LINEA: ' +
            (linea + 1).toString() +
            ' - PUESTO: ' +
            (puesto + 1).toString() +
            '\n';
          const tag = document.createElement('p');
          tag.className = 'line-1 anim-typewriter';
          const text = document.createTextNode(result);
          tag.appendChild(text);
          const element = document.getElementById('console');
          element.appendChild(tag);
        }
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
}

document.getElementById('btn').addEventListener('change', StartOP, false);
