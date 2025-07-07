# AllNighter v2 Build Process

## Development Setup

1. Install dependencies:
```bash
npm install
```

2. Start development mode (SCSS watching):
```bash
npm run dev
```

3. Serve the application locally:
```bash
npm run serve
```

## Build Commands

- `npm run build` - Full production build (SCSS + minification + public directory)
- `npm run build:public` - Create public directory for deployment
- `npm run scss` - Compile SCSS to CSS (compressed)
- `npm run scss:watch` - Watch SCSS files for changes
- `npm run minify` - Minify CSS and JavaScript files
- `npm run lint` - Lint JavaScript files
- `npm run format` - Format code with Prettier
- `npm run validate` - Validate HTML files

## Deployment

The build process creates a `public` directory containing all deployment files:

```bash
npm run build
```

This will:
1. Compile SCSS to compressed CSS
2. Minify JavaScript files  
3. Copy all necessary files to `public/` directory

## File Structure

- Source SCSS files are in `/scss/`
- Compiled CSS goes to `/css/styles.css`
- Minified files have `.min.js` and `.min.css` extensions
- **Production files** are copied to `/public/` for deployment
- Use files in `public/` directory for production deployment

## Development Workflow

1. Run `npm run dev` to start SCSS watching
2. Run `npm run serve` in another terminal to serve the app
3. Make changes to SCSS files - CSS will auto-compile
4. Before deployment, run `npm run build` for production files
5. Deploy the `public/` directory to your hosting platform

## Platform-Specific Deployment

### Vercel
- Uses `vercel.json` configuration
- Automatically detects the `public` output directory
- Build command: `npm run build`
- Output directory: `public`

### Other platforms
- Build command: `npm run build`
- Output directory: `public`
