const namef = ['', '', '', '', '', '', '', '', '', ''];
let fileIndex = 0;

function StartOP(e) {
  fileIndex = 0;
  const div = document.getElementById('console');

  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }

  for (let i = 0; i < e.target.files.length; i++) {
    namef[i] = e.target.files[i].name;
  }

  let tag;
  let text;
  let element;

  for (let i = 0; i < e.target.files.length; i++) {
    let reader = new FileReader();

    reader.onloadend = function (e) {
      let contents = reader.result;
      displayContents(contents);
    };

    reader.readAsText(e.target.files[i]);
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
