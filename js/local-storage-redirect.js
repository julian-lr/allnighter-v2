// INDEX

// SET "LOCALE" "EN" FOR REDIRECCION A INGLES
(function () {
  'use strict';

  const eng = document.querySelector('.en');
  eng.addEventListener('click', () => {
    localStorage.setItem('locale', 'en');
  });

  // SET "LOCALE" "ES" FOR REDIRECCION A ESPAÑOL
  const esp = document.querySelector('.es');
  esp.addEventListener('click', () => {
    localStorage.setItem('locale', 'es');
  });

  // RECIBE QUE "LOCALE" TIENE Y REDIRECCIONA
  const locale = localStorage.getItem('locale');
  const getUrl = window.location;
  const siteUrl = getUrl.protocol + '//' + getUrl.host + '/';
  const actualUrl = window.location.href;
  const urlEsp = siteUrl + 'pages/esp.html';
  const urlEng = siteUrl + 'pages/eng.html';

  if (locale === 'en' && actualUrl === siteUrl) {
    window.location.href = urlEng;
  }
  if (locale === 'es' && actualUrl === siteUrl) {
    window.location.href = urlEsp;
  }
  if (locale === 'en' && urlEsp === actualUrl) {
    window.location.href = urlEng;
  }
  if (locale === 'es' && urlEng === actualUrl) {
    window.location.href = urlEsp;
  }
})();
