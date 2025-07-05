const namef = ['', '', '', '', '', '', '', '', '', ''];
let fileIndex = 0;

function StartOP(e) {
  fileIndex = 0;
  var div = document.getElementById('console');

  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }

  for (var i = 0; i < e.target.files.length; i++) {
    namef[i] = e.target.files[i].name;
  }

  for (var i = 0; i < e.target.files.length; i++) {
    const reader = new FileReader();

    reader.onloadend = function (e) {
      const contents = reader.result;
      displayContents(contents);
    };

    reader.readAsText(e.target.files[i]);
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
