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
  var div = document.getElementById('console');

  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }

  // Validate files before processing
  const files = Array.from(e.target.files);
  const validFiles = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    if (!validateFileSize(file)) {
      showError(`File "${file.name}" is too large. Maximum allowed: 5MB`);
      continue;
    }
    
    if (!validateFileType(file)) {
      showError(`File type "${file.name}" not allowed. Valid types: ${ALLOWED_FILE_TYPES.join(', ')}`);
      continue;
    }
    
    validFiles.push(file);
    namef[validFiles.length - 1] = file.name;
  }

  if (validFiles.length === 0) {
    showError('No valid files to process');
    return;
  }

  // Process valid files
  for (let i = 0; i < validFiles.length; i++) {
    const reader = new FileReader();

    reader.onloadend = function (e) {
      const contents = reader.result;
      displayContents(contents);
    };

    reader.onerror = function() {
      showError(`Error reading file: ${validFiles[i].name}`);
    };

    reader.readAsText(validFiles[i]);
  }
}

function checkForm(thetxt) {
  var withoutEnter = thetxt.replace(/\r?\n|\r/g, '');
  var result = withoutEnter.match(
    /[¿º«»ª¡ÀÂÃÄÁÆàâãäæÇçÊËÉêëïÍÏÔÖÕÓöõôÜÚüáéí'óüúÑñ✓✔‑–—€®©℠™´’‘]/g
  );

  return result;
}

function displayContents(contents) {
  var texto = contents;
  var tag;
  var text;
  var element;
  var name = namef[a];
  a++;

  if (checkForm(contents)) {
    var result = '';
    var lines = [];
    lines = texto.split('\n');
    var element = document.getElementById('demo');

    for (var linea = 0; linea < lines.length; linea++) {
      for (var puesto = 0; puesto < lines[linea].length; puesto++) {
        if (
          lines[linea]
            .charAt(puesto)
            .match(
              /[¿º«»ª¡ÀÂÃÄÁÆàâãäæÇçÊËÉêëïÍÏÔÖÕÓöõôÜÚüáéí'óüúÑñ✓✔‑–—€®©℠™´’‘]/g
            ) !== null
        ) {
          result =
            'FILE: ' +
            name +
            ':    LINE: ' +
            (linea + 1).toString() +
            ' - CHARACTER: ' +
            (puesto + 1).toString() +
            '\n';
          tag = document.createElement('p');
          tag.className = 'line-1 anim-typewriter';
          text = document.createTextNode(result);
          tag.appendChild(text);
          element = document.getElementById('console');
          element.appendChild(tag);
        }
      }
    }
  } else {
    tag = document.createElement('p');
    text = document.createTextNode(
      'FILE: ' + name + ' - HAS NO SPECIAL CHARACTERS'
    );
    tag.appendChild(text);
    element = document.getElementById('console');
    tag.className = 'line-1 anim-typewriter';
    element.appendChild(tag);
  }
}

document.getElementById('btn').addEventListener('change', StartOP, false);
