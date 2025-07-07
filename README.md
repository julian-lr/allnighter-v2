# AllNighter - v2

> **⚠️ DEPRECATION NOTICE**  
> This tool was originally created to detect special characters in HTML email content that could cause rendering issues. However, modern email marketing platforms (like Mailchimp, Constant Contact, SendGrid, etc.) now automatically detect and fix these character encoding issues during the sending process. As a result, this tool is largely deprecated for its original use case. It remains available for educational purposes and legacy workflows.

<div align="center">

![AllNighter Logo](./img/AN-logo.png)

**A legacy QA tool for detecting special characters in HTML content - now superseded by modern email platforms**

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/julian-lr/allnighter-v2)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Accessibility](https://img.shields.io/badge/accessibility-WCAG%202.1%20AA-brightgreen.svg)](#accessibility)
[![Status](https://img.shields.io/badge/status-deprecated-red.svg)](#deprecation-notice)

[🇪🇸 Español](#español) • [🇺🇸 English](#english)

</div>

---

## 🇪🇸 Español

### 📋 Descripción

AllNighter v2 es una herramienta de control de calidad (QA) que fue diseñada para identificar y localizar caracteres especiales problemáticos en contenido HTML para proyectos de email marketing. **Nota**: Las plataformas modernas de email marketing ahora manejan automáticamente estos problemas de codificación de caracteres, haciendo que esta herramienta sea principalmente de valor histórico y educativo.

### ✨ Características

- 🔍 **Detección Precisa**: Identifica caracteres especiales con ubicación exacta (línea y posición)
- 🎯 **Interfaz Drag & Drop**: Arrastrá archivos directamente o seleccioná múltiples archivos
- 📊 **Exportación**: Resultados en formato TXT y CSV
- 📋 **Portapapeles**: Copiá resultados con un clic
- ♿ **Accesibilidad**: Cumple con WCAG 2.1 AA
- 🎨 **Diseño Moderno**: Interfaz responsiva con animaciones suaves
- ⚡ **Alto Rendimiento**: Optimizado para archivos grandes
- 🌐 **Bilingüe**: Soporte completo para español argentino e inglés
- 🔒 **Seguridad**: Protección XSS y validación de archivos
- 📱 **PWA**: Funciona offline como aplicación nativa

### 🚀 Inicio Rápido

1. **Instalación de dependencias**:
   ```bash
   npm install
   ```

2. **Desarrollo**:
   ```bash
   npm run dev    # Inicia el compilador SCSS
   npm run serve  # Servidor local en puerto 3000
   ```

3. **Construcción**:
   ```bash
   npm run build  # Compilación completa para producción
   ```

### 📁 Tipos de Archivo Soportados

- `.txt` - Archivos de texto plano
- `.html` / `.htm` - Documentos HTML
- `.css` - Hojas de estilo
- `.js` - JavaScript
- `.xml` - Documentos XML
- `.csv` - Valores separados por comas

**Límite de tamaño**: 5MB por archivo

### 🎯 Caracteres Detectados

- **Acentos españoles**: á, é, í, ó, ú, ñ, ü
- **Signos especiales**: ¿, ¡, º, ª, «, »
- **Caracteres internacionales**: À, Â, Ã, Ä, Æ, Ç, etc.
- **Símbolos tipográficos**: ™, ®, ©, €, –, —
- **Comillas inteligentes**: '', ""

---

## 🇺🇸 English

### 📋 Description

AllNighter v2 is a quality assurance (QA) tool that was designed to identify and locate problematic special characters in HTML content for email marketing projects. **Note**: Modern email marketing platforms now automatically handle these character encoding issues, making this tool primarily of historical and educational value.

### ✨ Features

- 🔍 **Precise Detection**: Identifies special characters with exact location (line and position)
- 🎯 **Drag & Drop Interface**: Drag files directly or select multiple files
- 📊 **Export Options**: Results in TXT and CSV formats
- 📋 **Clipboard Support**: Copy results with one click
- ♿ **Accessibility**: WCAG 2.1 AA compliant
- 🎨 **Modern Design**: Responsive interface with smooth animations
- ⚡ **High Performance**: Optimized for large files
- 🌐 **Bilingual**: Full support for Argentine Spanish and English
- 🔒 **Security**: XSS protection and file validation
- 📱 **PWA**: Works offline as native app

### 🚀 Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Development**:
   ```bash
   npm run dev    # Start SCSS compiler
   npm run serve  # Local server on port 3000
   ```

3. **Build**:
   ```bash
   npm run build  # Complete production build
   ```

### 📁 Supported File Types

- `.txt` - Plain text files
- `.html` / `.htm` - HTML documents
- `.css` - Stylesheets
- `.js` - JavaScript files
- `.xml` - XML documents
- `.csv` - Comma-separated values

**Size limit**: 5MB per file

### 🎯 Detected Characters

- **Spanish accents**: á, é, í, ó, ú, ñ, ü
- **Special signs**: ¿, ¡, º, ª, «, »
- **International characters**: À, Â, Ã, Ä, Æ, Ç, etc.
- **Typographic symbols**: ™, ®, ©, €, –, —
- **Smart quotes**: '', ""

---

## 🏗️ Technical Details

### Architecture

- **Frontend**: HTML5, CSS3 (SCSS), Vanilla JavaScript (ES6+ modules)
- **Framework**: Bootstrap 5.3.2 for responsive design
- **Build Tools**: Sass, Terser, Clean-CSS
- **Quality Tools**: ESLint, Prettier, HTML Validate, Jest Testing
- **Security**: CSP headers, input sanitization, rate limiting
- **PWA**: Service Worker, Web App Manifest, offline support

### Browser Support

- ✅ Chrome/Chromium 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Accessibility

- **WCAG 2.1 AA** compliant
- **Screen reader** support
- **Keyboard navigation** throughout
- **High contrast** mode support
- **Reduced motion** preferences respected

## 🛠️ Development

### Available Scripts

```bash
npm run build      # Complete production build
npm run dev        # Start SCSS watching
npm run serve      # Local development server
npm run test       # Run Jest test suite
npm run lint       # JavaScript linting
npm run format     # Code formatting with Prettier
npm run validate   # HTML validation
npm run minify     # Minify CSS and JS files
```

### Project Structure

```
├── css/           # Compiled CSS files
├── scss/          # Source SCSS files
│   ├── abstracts/ # Mixins and variables
│   ├── base/      # Reset and global styles
│   ├── components/# Reusable components
│   ├── layout/    # Layout-specific styles
│   └── pages/     # Page-specific styles
├── js/            # JavaScript modules
│   ├── config.js  # Application configuration
│   ├── utils.js   # Shared utilities
│   ├── security.js# Security functions
│   └── pwa.js     # PWA functionality
├── pages/         # HTML pages (Spanish/English)
├── img/           # Images and assets
├── tests/         # Jest test files
├── API.md         # API documentation
├── BUILD.md       # Build process guide
└── CONTRIBUTING.md# Contribution guidelines
```

## 👥 Contributors

- **Julián LR** - Original creator and current maintainer
- **Lucas Salmerón Olschansky** - Co-creator
- **Julián Moreira** - Refinements and improvements

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Repository](https://github.com/julian-lr/allnighter-v2)
- [Issues](https://github.com/julian-lr/allnighter-v2/issues)
- [Contributing Guidelines](CONTRIBUTING.md)

---

<div align="center">
Made with ❤️ for the QA community
</div>
