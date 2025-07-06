# Contributing to AllNighter v2

Thank you for your interest in contributing to AllNighter v2! This document provides guidelines for contributing to the project.

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/allnighter-v2.git
   cd allnighter-v2
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Start development mode**:
   ```bash
   npm run dev
   ```

## 📝 Development Guidelines

### Code Style

- **JavaScript**: Follow ESLint configuration (ES6+, no var, prefer const)
- **CSS/SCSS**: Use BEM naming convention, modular architecture
- **HTML**: Semantic HTML5, proper accessibility attributes
- **Commits**: Use conventional commit format

### Accessibility Requirements

- Maintain **WCAG 2.1 AA** compliance
- Test with screen readers
- Ensure keyboard navigation works
- Add proper ARIA labels and roles

### Testing Checklist

Before submitting a PR, ensure:

- [ ] Code passes `npm run lint`
- [ ] HTML validates with `npm run validate`
- [ ] Code is formatted with `npm run format`
- [ ] Features work in both Spanish and English
- [ ] Accessibility standards are maintained
- [ ] Performance is not degraded
- [ ] All file types are supported correctly

## 🐛 Bug Reports

When reporting bugs, include:

1. **Environment**: Browser, version, OS
2. **Steps to reproduce**: Clear, numbered steps
3. **Expected behavior**: What should happen
4. **Actual behavior**: What actually happens
5. **Screenshots/Files**: If applicable

## 💡 Feature Requests

For new features:

1. **Check existing issues** to avoid duplicates
2. **Describe the problem** the feature would solve
3. **Propose a solution** with implementation details
4. **Consider accessibility** and internationalization impact

## 🔧 Technical Contributions

### Architecture

- **Modular SCSS**: Use the existing folder structure
- **JavaScript**: Maintain separation between Spanish/English logic
- **Accessibility**: All interactive elements must be keyboard accessible
- **Performance**: Consider file size and processing speed

### Pull Request Process

1. **Create a feature branch** from `main`
2. **Make your changes** following the guidelines
3. **Test thoroughly** across browsers and languages
4. **Update documentation** if needed
5. **Submit PR** with clear description

### Commit Messages

Use conventional commit format:

```
type(scope): description

- feat: new feature
- fix: bug fix
- docs: documentation
- style: formatting
- refactor: code restructuring
- perf: performance improvement
- test: adding tests
- chore: maintenance
```

## 🌐 Internationalization

When adding new features:

- **Maintain bilingual support** (Spanish/English)
- **Update both language files** (`esp-logic.js` and `eng-logic.js`)
- **Add appropriate translations** in HTML files
- **Test in both languages**

## 📦 Release Process

1. Update version in `package.json`
2. Update `README.md` with new features
3. Run full build and tests
4. Create release notes
5. Tag the release

## 🤝 Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help newcomers feel welcome
- Maintain professional communication

## 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and ideas
- **Email**: For security-related issues

## 🙏 Recognition

Contributors will be acknowledged in:

- README.md contributors section
- Release notes
- Project documentation

Thank you for helping make AllNighter v2 better! 🎉
