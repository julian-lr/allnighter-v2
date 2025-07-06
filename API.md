# AllNighter v2 - API Documentation

## JavaScript API Reference

### Core Functions

#### `StartOP(event)`
Main entry point for file processing.

**Parameters:**
- `event` (Event): File input change event or custom event object

**Description:**
Initializes file processing, validates files, and starts the scanning process.

**Example:**
```javascript
const fakeEvent = { target: { files: fileList } };
StartOP(fakeEvent);
```

---

#### `displayContents(contents)`
Processes file content and displays results.

**Parameters:**
- `contents` (string): File content to analyze

**Description:**
Scans text for special characters and displays results in the console area.

---

#### `checkForm(text)`
Validates if text contains special characters.

**Parameters:**
- `text` (string): Text content to check

**Returns:**
- `Array|null`: Array of matches or null if no matches found

---

### Validation Functions

#### `validateFileSize(file)`
Checks if file size is within allowed limits.

**Parameters:**
- `file` (File): File object to validate

**Returns:**
- `boolean`: True if file size is acceptable

---

#### `validateFileType(file)`
Validates file type against allowed extensions.

**Parameters:**
- `file` (File): File object to validate

**Returns:**
- `boolean`: True if file type is allowed

---

### Export Functions

#### `exportResults(format)`
Exports scan results to specified format.

**Parameters:**
- `format` (string): Export format ('txt' or 'csv')

**Description:**
Creates downloadable file with scan results.

---

#### `copyToClipboard()`
Copies scan results to clipboard.

**Description:**
Uses Clipboard API to copy formatted results.

---

### UI Functions

#### `showError(message)`
Displays error message in console.

**Parameters:**
- `message` (string): Error message to display

---

#### `showSuccess(message)`
Displays success message in console.

**Parameters:**
- `message` (string): Success message to display

---

#### `showProgress()`
Updates progress indicator.

**Description:**
Shows current file processing progress.

---

### Accessibility Functions

#### `initializeAccessibility()`
Sets up keyboard navigation and screen reader support.

**Description:**
Adds event listeners for keyboard navigation and ARIA announcements.

---

#### `announceToScreenReader(message)`
Announces message to screen readers.

**Parameters:**
- `message` (string): Message to announce

---

## CSS Classes

### Layout Classes

- `.maincontainer` - Main container for home page
- `.pagecontainer` - Container for language-specific pages
- `.drag-drop-area` - File upload area with drag & drop

### Component Classes

- `.line-1` - Console output line styling
- `.anim-typewriter` - Typewriter animation
- `.export-btn` - Export button styling
- `.progress-indicator` - Progress display
- `.error-message` - Error message styling
- `.success-message` - Success message styling

### Accessibility Classes

- `.sr-only` - Screen reader only content
- `.focused` - Keyboard navigation focus
- `.skip-link` - Skip navigation link

## SCSS Architecture

### Directory Structure

```
scss/
├── abstracts/
│   ├── _index.scss     # Forward all abstracts
│   └── _mixins.scss    # Animation mixins
├── base/
│   ├── _index.scss     # Forward base styles
│   └── _reset.scss     # CSS reset and globals
├── components/
│   ├── _index.scss     # Forward components
│   └── _console.scss   # Console interface styles
├── layout/
│   ├── _index.scss     # Forward layout styles
│   └── _header.scss    # Header navigation
├── pages/
│   ├── _index.scss     # Forward page styles
│   ├── _home.scss      # Home page animations
│   └── _espeng.scss    # Language page styles
└── main.scss           # Main entry point
```

### Mixins Available

#### Animation Mixins
- `@include keyframe-slide-left` - Left slide animation
- `@include keyframe-slide-right` - Right slide animation
- `@include keyframe-slide-up` - Up slide animation
- `@include keyframe-typewriter` - Typewriter effect
- `@include animation-typewriterblink` - Combined typewriter + blink

## Configuration

### File Validation

```javascript
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['.txt', '.html', '.htm', '.css', '.js', '.xml', '.csv'];
```

### Character Detection

The regex pattern detects:
- Spanish accents: á, é, í, ó, ú, ñ, ü
- Question/exclamation marks: ¿, ¡
- Ordinals: º, ª
- Quotes: «, », ', '
- International accents: À, Â, Ã, Ä, Æ, Ç, etc.
- Symbols: ™, ®, ©, €, –, —

## Events

### Custom Events

The application uses standard DOM events:

- `change` - File input changes
- `dragover`, `dragenter`, `dragleave`, `drop` - Drag & drop
- `keydown` - Keyboard navigation
- `click` - Button interactions

### Event Handlers

- File validation before processing
- Progress updates during scanning
- Result display with animations
- Error handling and user feedback

## Browser Compatibility

- **Chrome/Chromium**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

### Required APIs

- FileReader API
- Clipboard API
- Drag and Drop API
- CSS Custom Properties
- ES6+ Features (const, let, arrow functions)

## Performance Considerations

### Optimizations

1. **Regex Compilation**: Compile regex once, reuse for all scans
2. **Progress Indicators**: Non-blocking UI updates
3. **Memory Management**: Clean up DOM elements
4. **Efficient Scanning**: Use regex.exec() instead of character iteration

### Limitations

- 5MB file size limit to prevent browser crashes
- Maximum 10 files processed simultaneously
- Console output limited to prevent DOM bloat
