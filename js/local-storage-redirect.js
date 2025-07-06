/**
 * AllNighter v2 - Local Storage and Language Redirect
 * 
 * Handles language preference storage and automatic redirection
 * based on user's previous language selection.
 * 
 * @author Julián LR, Lucas Salmerón Olschansky, Julián Moreira
 * @version 2.0.0
 * @license MIT
 */

// INDEX

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    const esp = document.querySelector(".esp");
    const eng = document.querySelector(".eng");
  
    // If .esp class is found, then "locale" will be changed to es when it is clicked
    if (esp) {
      esp.addEventListener("click", () => {
        localStorage.setItem("locale", "es");
      });
    // Else if .eng class is found, then "locale" will be changed to es when it is clicked
    } else if (eng) {
      eng.addEventListener("click", () => {
        localStorage.setItem("locale", "en");
      });
    }
  });

  // RECEIVES "LOCALE" AND REDIRECTS
  const locale = localStorage.getItem("locale");
  const getUrl = window.location;
  const siteUrl = getUrl.protocol + "//" + getUrl.host + "/";
  const actualUrl = window.location.href;
  const urlEsp = siteUrl + "pages/esp.html";
  const urlEng = siteUrl + "pages/eng.html";

  if (locale === "en" && actualUrl === siteUrl) {
    window.location.href = urlEng;
  }
  if (locale === "es" && actualUrl === siteUrl) {
    window.location.href = urlEsp;
  }
  if (locale === "en" && urlEsp === actualUrl) {
    window.location.href = urlEng;
  }
  if (locale === "es" && urlEng === actualUrl) {
    window.location.href = urlEsp;
  }
})();
