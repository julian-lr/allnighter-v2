let namef = ['', '', '', '', '', '', '', '', '', ''];
let a = 0;

function StartOP(e) {
  a = 0;
  let div = document.getElementById('console');

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
  let texto = contents;
  let tag;
  let text;
  let element;
  let name = namef[a];
  a++;

  if (checkForm(contents)) {
    let result = '';
    let lines = [];
    lines = texto.split('\n');
    let element = document.getElementById('demo');

    for (let linea = 0; linea < lines.length; linea++) {
      for (let puesto = 0; puesto < lines[linea].length; puesto++) {
        if (
          lines[linea]
            .charAt(puesto)
            .match(
              /[¿º«»ª¡ÀÂÃÄÁÆàâãäæÇçÊËÉêëïÍÏÔÖÕÓöõôÜÚüáéí'óüúÑñ✓✔‑–—€®©℠™´’‘]/g
            ) !== null
        ) {
          result =
            'ARCHIVO: ' +
            name +
            ':    LINEA: ' +
            (linea + 1).toString() +
            ' - PUESTO: ' +
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
      'ARCHIVO: ' + name + ' - NO CONTIENE CARACTERES ESPECIALES'
    );
    tag.appendChild(text);
    element = document.getElementById('console');
    tag.className = 'line-1 anim-typewriter';
    element.appendChild(tag);
  }
}

document.getElementById('btn').addEventListener('change', StartOP, false);

for (p of document.querySelectorAll('p')) {
  console.debug('text:', td, td.innerText);
  td.setAttribute('text', td.innerText);
}
for (td of document.querySelectorAll('td[text="male"]'))
  console.debug('male:', td, td.innerText);
