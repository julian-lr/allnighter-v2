//INDEX

//SETEA "LOCALE" "EN" PARA REDIRECCION A INGLES
(function (){
  'use strict';

 var eng = document.querySelector('.eng')
     eng.addEventListener('click', () => {
		 localStorage.setItem('locale','en')
    })

	
//SETEA "LOCALE" "ES" PARA REDIRECCION A ESPAÑOL
var esp = document.querySelector('.esp')
     	esp.addEventListener('click', () => {
		 localStorage.setItem('locale','es')
    })

	
//RECIBE QUE "LOCALE" TIENE Y REDIRECCIONA
		const locale = localStorage.getItem('locale');
		var getUrl = window.location;
		var siteUrl = getUrl .protocol + "//" + getUrl.host;
		const actualUrl = window.location.href;
		var urlEsp = siteUrl + "/esp.html";
		console.log("urlEsp", urlEsp);
		var urlEng = siteUrl + "/eng.html";
		var urlIndex =  siteUrl;
		console.log("actualUrl",window.location.href);
		if (locale === 'en' && actualUrl === urlIndex) window.location.href = urlEng;
		if (locale === 'es' && actualUrl === urlIndex) window.location.href = urlEsp;
		if (locale === 'en' && urlEsp === actualUrl) window.location.href = urlEng; 
		if (locale === 'es' && urlEng === actualUrl) window.location.href = urlEsp;  
  		 
}());