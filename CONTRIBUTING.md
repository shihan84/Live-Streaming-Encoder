# Contributing to MediaLive Encoder

Thank you for your interest in contributing to MediaLive Encoder! This document provides guidelines and instructions for contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Reporting Issues](#reporting-issues)

## 🤝 Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Git
- A GitHub account

### Setup Instructions

1. **Fork the Repository**
   ```bash
   # Fork the repository on GitHub
   git clone https://github.com/YOUR_USERNAME/medialive-encoder.git
   cd medialive-encoder
   ```

2. **Set Up Development Environment**
   ```bash
   # Install dependencies
   npm install
   
   # Set up the database
   npm run db:push
   
   # Start development server
   npm run dev
   ```

3. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 🔄 Development Workflow

### 1. Planning

- Check the [GitHub Issues](https://github.com/YOUR_USERNAME/medialive-encoder/issues) for existing tasks
- Create a new issue for significant changes
- Discuss your approach in the issue comments

### 2. Development

- Work on your feature branch
- Follow the coding standards outlined below
- Write tests for new functionality
- Update documentation as needed

### 3. Testing

```bash
# Run the test suite
npm test

# Run linting
npm run lint

# Type checking
npm run type-check
```

### 4. Commit Guidelines

- Use [Conventional Commits](https://www.conventionalcommits.org/) format
- Keep commits focused on a single change
- Include relevant issue numbers in commit messages

**Examples:**
```bash
git commit -m "feat: add SCTE-35 ad break scheduling"
git commit -m "fix: resolve memory leak in encoding sessions"
git commit -m "docs: update API documentation"
git commit -m "style: improve button hover effects"
```

## 📥 Pull Request Process

### 1. Before Submitting

- Ensure your code follows the coding standards
- Run all tests and ensure they pass
- Update documentation if necessary
- Check that your changes don't break existing functionality

### 2. Creating the Pull Request

1. **Push your branch**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create Pull Request**
   - Go to the repository on GitHub
   - Click "New Pull Request"
   - Select your branch and the main branch
   - Fill in the PR template

3. **PR Description Template**
   ```markdown
   ## Description
   [Brief description of changes]
   
   ## Type of Change
   - [ ] Bug fix (non-breaking change which fixes an issue)
   - [ ] New feature (non-breaking change which adds functionality)
   - [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
   - [ ] Documentation update
   - [ ] Refactoring (no functional changes)
   - [ ] Performance improvement (non-breaking change that improves performance)
   - [ ] Tests (add missing tests or correct existing tests)
   
   ## How Has This Been Tested?
   [Describe the testing performed]
   
   ## Checklist:
   - [ ] My code follows the style guidelines of this project
   - [ ] I have performed a self-review of my own code
   - [ ] I have commented my code, particularly in hard-to-understand areas
   - [ ] I have made corresponding changes to the documentation
   - [ ] My changes generate no new warnings
   - [ ] I have added tests that prove my fix is effective or that my feature works
   - [ ] New and existing unit tests pass locally with my changes
   - [ ] Any dependent changes have been merged and published in downstream modules
   ```

### 3. Review Process

- Maintain at least two approvals for significant changes
- Address all review comments
- Keep the PR updated with the latest changes
- Be responsive to reviewer feedback

## 📝 Coding Standards

### TypeScript

- Use strict TypeScript mode
- Provide proper type annotations
- Avoid `any` type when possible
- Use interfaces for object shapes
- Prefer `const` and `let` over `var`

### React/Next.js

- Use functional components with hooks
- Prefer arrow functions for component definitions
- Use TypeScript interfaces for props
- Implement proper error boundaries
- Use Next.js App Router patterns

### Styling

- Use Tailwind CSS classes
- Follow the established AWS theme colors
- Use responsive design patterns
- Implement proper hover and focus states
- Ensure accessibility with proper contrast

### File Organization

- Keep files small and focused
- Use descriptive file names
- Group related functionality together
- Follow the established project structure

### Performance

- Optimize images and assets
- Use React.memo for expensive components
- Implement proper loading states
- Use lazy loading for non-critical components
- Monitor bundle size

## 🧪 Testing Guidelines

### Unit Testing

- Test individual functions and components
- Mock external dependencies
- Test both success and error cases
- Aim for high code coverage

### Integration Testing

- Test API endpoints
- Test database interactions
- Test WebSocket connections
- Test user workflows

### E2E Testing

- Test complete user journeys
- Test across different browsers
- Test on different screen sizes
- Test accessibility features

### Test File Naming

- Use `.test.ts` extension for test files
- Match test file names with source files
- Group tests by feature/module

## 📚 Documentation

### Code Comments

- Comment complex logic
- Document API endpoints
- Explain non-obvious implementations
- Use JSDoc for functions and classes

### README Updates

- Update installation instructions
- Document new features
- Update configuration options
- Keep examples current

### API Documentation

- Document all API endpoints
- Include request/response examples
- Document error responses
- Keep authentication requirements clear

## 🐛 Reporting Issues

### Bug Reports

When reporting bugs, please include:

1. **Environment Information**
   - Node.js version
   - Operating system
   - Browser version (if applicable)

2. **Steps to Reproduce**
   - Clear, step-by-step instructions
   - Expected behavior
   - Actual behavior

3. **Error Messages**
   - Full error messages
   - Stack traces
   - Screenshots (if helpful)

4. **Additional Context**
   - Browser console logs
   - Network requests
   - Any other relevant information

### Feature Requests

When requesting features, please include:

1. **Problem Statement**
   - What problem are you trying to solve?
   - What use case would this address?

2. **Proposed Solution**
   - Detailed description of the feature
   - How it should work
   - User interface considerations

3. **Alternatives**
   - Any alternative solutions you've considered
   - Why the proposed solution is preferred

4. **Additional Context**
   - Screenshots or mockups (if helpful)
   - Examples from other applications
   - Any other relevant information

## 🏆 Recognition

Contributors will be recognized in:

- The README contributors section
- Release notes for significant contributions
- GitHub contributor statistics
- Project documentation

## 📞 Getting Help

If you need help with contributing:

1. **Check Documentation**: Review this guide and existing documentation
2. **Search Issues**: Look for similar problems or questions
3. **Join Discussions**: Participate in GitHub Discussions
4. **Contact Maintainers**: Reach out to project maintainers for guidance

---

Thank you for contributing to MediaLive Encoder! Your help is greatly appreciated. 🎉