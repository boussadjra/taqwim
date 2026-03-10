# Contributing to Taqwim

We love your input! We want to make contributing to Taqwim as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Setup

### Prerequisites

- Node.js (>= 18)
- pnpm (>= 8)

### Getting Started

1. **Fork and Clone the repository**

   ```bash
   git clone https://github.com/your-username/taqwim.git
   cd taqwim
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Run tests to ensure everything works**

   ```bash
   pnpm core:test
   ```

4. **Start the development playground**
   ```bash
   pnpm vue:play:dev
   ```

### Project Structure

```
taqwim/
├── packages/
│   ├── core-utils/     # Core Hijri date utilities
│   └── vue/            # Vue.js components
├── playground/
│   └── vue3/           # Development playground
├── docs/               # Documentation (VitePress)
└── .github/            # GitHub workflows and templates
```

## Development Workflow

### Making Changes

1. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write code following our style guide
   - Add tests for new functionality
   - Update documentation if needed

3. **Test your changes**

   ```bash
   # Run linting
   pnpm lint

   # Run tests
   pnpm core:test
   pnpm --filter taqwim-vue test:unit

   # Build packages
   pnpm core:build
   pnpm vue:build
   ```

4. **Commit your changes**
   ```bash
   # We use conventional commits
   git add .
   git commit -m "feat: add new date formatting function"
   ```

### Code Standards

#### TypeScript

- Use TypeScript strict mode
- Provide proper type definitions
- Avoid `any` types unless absolutely necessary

#### Testing

- Write unit tests for all new functions
- Maintain test coverage above 90%
- Use descriptive test names

#### Documentation

- Add JSDoc comments for all public APIs
- Update relevant markdown documentation
- Include usage examples

#### Commit Messages

We use [Conventional Commits](https://conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Types:

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

Examples:

```
feat(core): add new date comparison functions
fix(vue): resolve datepicker timezone issue
docs: update API documentation
test(core): add edge case tests for leap years
```

## Package-Specific Guidelines

### Core Utils (`packages/core-utils`)

- Pure functions only, no side effects
- Comprehensive unit tests required
- Performance considerations for date calculations
- Support for multiple locales

### Vue Components (`packages/vue`)

- Follow Vue 3 Composition API patterns
- Provide TypeScript definitions
- Include comprehensive prop validation
- Add accessibility attributes
- Write component tests with Vue Test Utils

## Pull Request Process

1. **Ensure CI passes**
   - All tests pass
   - Linting passes
   - Builds succeed

2. **Update documentation**
   - API documentation (auto-generated)
   - User guides if needed
   - CHANGELOG.md entry

3. **Request review**
   - Assign to maintainers
   - Respond to feedback promptly
   - Make requested changes

4. **Merge requirements**
   - Approved by at least one maintainer
   - All CI checks pass
   - Up-to-date with main branch

## Release Process

We use [Changesets](https://github.com/changesets/changesets) for versioning and publishing. Each PR that changes published code should include a changeset.

### Adding a changeset

```bash
# Run the changeset wizard — it will ask which packages changed and the semver bump type
pnpm changeset
```

This creates a markdown file in `.changeset/` describing the change. Commit it with your PR.

### Publishing (maintainers)

On merge to `main`, the CI creates a **Release PR** that batches pending changesets. When that PR is merged:

1. `package.json` versions and `CHANGELOG.md` are updated automatically
2. Packages are built, tested, and published to npm
3. GitHub releases are created for each tag

For manual releases:

```bash
# Version packages (applies changesets, updates CHANGELOG)
pnpm version-packages

# Build, test, and publish
pnpm release
```

## Reporting Issues

### Bug Reports

Use the [Bug Report](https://github.com/boussadjra/taqwim/issues/new?template=bug_report.md) template and include:

- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details (Node.js version, browser, etc.)
- Minimal code example

### Feature Requests

Use the [Feature Request](https://github.com/boussadjra/taqwim/issues/new?template=feature_request.md) template and include:

- Clear description of the feature
- Use case and motivation
- Proposed API (if applicable)
- Alternative solutions considered

## Community Guidelines

### Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

### Getting Help

- **Documentation**: Check our [docs](https://taqwim.netlify.app/)
- **Discussions**: Use [GitHub Discussions](https://github.com/boussadjra/taqwim/discussions)
- **Issues**: For bugs and feature requests only

## Recognition

Contributors are recognized in:

- GitHub contributors list
- CHANGELOG.md for significant contributions
- Package.json contributors field

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Taqwim! 🎉
