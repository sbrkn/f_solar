# Contribution Guidelines

## Workflow Overview
When contributing to this project, please follow the guidelines below to ensure a smooth and efficient workflow.

### Branch Naming Standards
Branches should be named according to the following standards:
- `feat/` for new features (e.g., `feat/user-authentication`)
- `fix/` for bug fixes (e.g., `fix/login-bug`)
- `chore/` for maintenance tasks (e.g., `chore/update-dependencies`)
- `docs/` for documentation-related changes (e.g., `docs/update-readme`)
- `refactor/` for code improvements without adding features or fixing bugs (e.g., `refactor/login-component`)
- `spike/` for experimental features or investigations (e.g., `spike/new-approach`)

### Conventional Commit Format
All commits should follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types include:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc.)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools and libraries such as documentation generation

Examples:
- `feat(api): add new login endpoint`
- `fix(docs): correct typo in README`
  
### Pull Request Checklist
When submitting a pull request, ensure the following fields are filled out:
- **Amaç**: Purpose of the PR
- **Kapsam Dışı**: What’s not included in this PR
- **Test Adımları**: Steps to test the changes
- **Breaking Change**: Any breaking changes introduced
- **Ekran Görüntüsü**: Screenshots if applicable
- **Screenshots**: Include before and after if applicable

### Branch Protection Rules for main
To maintain the integrity of the main branch, the following rules apply:
- No direct pushes to main
- At least 1 approval required before merging
- Continuous Integration (CI) checks must all pass
- Automatically delete branches after merge

### Stale Branch Cleanup Policy
To keep the repository clean, stale branches (inactive for more than 30 days) will be automatically deleted unless they have an open pull request.

### AI-Generated Code Guidelines
When contributing AI-generated code, please ensure it follows the repository’s code style and is properly reviewed by maintainers.

### Merge Strategy
We use **Squash & Merge** strategy for merging pull requests to keep the commit history clean and focused on feature development or fixes.