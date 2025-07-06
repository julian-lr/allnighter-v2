# AllNighter - v2

<div align="center">

![AllNighter Logo](./img/AN-logo.png)

**A modern, accessible QA tool for detecting special characters in HTML content for email marketing projects**

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/julian-lr/allnighter-v2)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Accessibility](https://img.shields.io/badge/accessibility-WCAG%202.1%20AA-brightgreen.svg)](#accessibility)

[🇪🇸 Español](#español) • [🇺🇸 English](#english)

</div>

---

## 🇪🇸 Español

### 📋 Descripción

AllNighter v2 es una herramienta de control de calidad (QA) diseñada para identificar y localizar caracteres especiales problemáticos en contenido HTML, especialmente útil para proyectos de email marketing donde ciertos caracteres pueden causar problemas de renderizado.

### ✨ Características

- 🔍 **Detección Precisa**: Identifica caracteres especiales con ubicación exacta (línea y posición)
- 🎯 **Interfaz Drag & Drop**: Arrastra archivos directamente o selecciona múltiples archivos
- 📊 **Exportación**: Resultados en formato TXT y CSV
- 📋 **Portapapeles**: Copia resultados con un click
- ♿ **Accesibilidad**: Cumple con WCAG 2.1 AA
- 🎨 **Diseño Moderno**: Interfaz responsiva con animaciones suaves
- ⚡ **Alto Rendimiento**: Optimizado para archivos grandes
- 🌐 **Bilingüe**: Soporte completo para español e inglés

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

AllNighter v2 is a quality assurance (QA) tool designed to identify and locate problematic special characters in HTML content, especially useful for email marketing projects where certain characters can cause rendering issues.

### ✨ Features

- 🔍 **Precise Detection**: Identifies special characters with exact location (line and position)
- 🎯 **Drag & Drop Interface**: Drag files directly or select multiple files
- 📊 **Export Options**: Results in TXT and CSV formats
- 📋 **Clipboard Support**: Copy results with one click
- ♿ **Accessibility**: WCAG 2.1 AA compliant
- 🎨 **Modern Design**: Responsive interface with smooth animations
- ⚡ **High Performance**: Optimized for large files
- 🌐 **Bilingual**: Full support for Spanish and English

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

- **Frontend**: HTML5, CSS3 (SCSS), Vanilla JavaScript (ES6+)
- **Framework**: Bootstrap 5.3.2 for responsive design
- **Build Tools**: Sass, Terser, Clean-CSS
- **Quality Tools**: ESLint, Prettier, HTML Validate

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
npm run lint       # JavaScript linting
npm run format     # Code formatting
npm run validate   # HTML validation
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
├── js/            # JavaScript files
├── pages/         # HTML pages
├── img/           # Images and assets
└── ...
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
