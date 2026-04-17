# Branch Protection Rules

This document outlines the branch protection policies for the `sbrkn/f_solar` repository.

## Protected Branches

The following branches are protected and require adherence to specific rules before merging:
- `main` - Production-ready code
- `develop` - Development integration branch

## Rules for Protected Branches

### 1. No Direct Pushes
- Direct pushes to protected branches are disabled
- All changes must be submitted via Pull Requests

### 2. Code Review Requirement
- **Minimum reviewers**: 1 approval required
- At least one code review from a repository maintainer must be completed before merge
- Reviews must address all requested changes

### 3. Continuous Integration (CI) Checks
- All automated tests must pass
- CI pipeline must complete successfully
- Status checks cannot be bypassed

### 4. Branch Sync Requirement
- Branches must be up to date with the base branch before merging
- Outdated branches must be updated before merge is allowed
- Use "Update branch" button to sync with latest changes

### 5. Automatic Branch Deletion
- Branches are automatically deleted after successful merge
- This keeps the repository clean and organized
- Local cleanup: Use `git branch -d <branch-name>` after merge

## Enforcement

These rules are enforced at the repository level and cannot be bypassed without explicit administrator action.

## Stale Branch Policy

### Definition
A branch is considered stale if:
- No commits for 30+ days
- Not actively being worked on
- No associated open Pull Request

### Cleanup Schedule
- Stale branches are reviewed monthly
- Inactive branches are deleted to maintain repository hygiene
- Important branches should be documented in project wiki

### Exceptions
Branches with active pull requests are not deleted, even if stale.

## How to Comply

1. **Create your branch** from `main`:
   ```bash
   git checkout -b feat/your-feature
   ```

2. **Make your changes** and commit with descriptive messages

3. **Push to remote**:
   ```bash
   git push origin feat/your-feature
   ```

4. **Open a Pull Request** with required information

5. **Address review comments** and ensure CI passes

6. **Merge** when all requirements are met

7. **Delete branch** (automatic or manual cleanup)