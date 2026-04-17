# AGENTS.md

Operational guide for AI agents / Copilot skills working in this repository.
This document is **authoritative for agent behavior** but is **always overridden by explicit system or developer instructions** in a given task.

## 1. Triggering Rules
- A skill MUST be activated when:
  - The user references the skill by name, OR
  - The user's task clearly matches the skill's documented purpose.
- If no skill matches, proceed with general-purpose tools and state that no skill was used.

## 2. Context & Scope Hygiene
- Load only the files and references strictly required for the current task.
- Prefer narrow code search over wholesale directory reads.
- Never inflate context with unrelated documentation.

## 3. Progressive Disclosure
- Open `SKILL.md` (or any other heavy reference file) only when needed for the task at hand.
- Reuse existing scripts/assets before authoring new ones.
- Start with the minimal viable skill set; expand only if the task requires it.

## 4. Skill Selection — Decision Matrix
When multiple skills could apply, classify each:

| Priority  | Meaning                                            | Behavior                          |
|-----------|----------------------------------------------------|-----------------------------------|
| Required  | Core to the task; blocking                         | MUST execute                      |
| Helper    | Adds quality/coverage but not strictly required    | SHOULD execute if budget allows   |
| Optional  | Nice-to-have                                       | MAY execute; skip under pressure  |

Always announce decisions using the Output Template (Section 6).

## 5. Conflict Resolution
1. Explicit user instructions in the current turn win.
2. System/developer instructions override skill instructions.
3. Skill instructions override general defaults.
4. If two skills conflict, prefer the Required-priority one; if still tied, prefer the more specific one and announce the choice.

## 6. Output Template
Every agent response that involves skills should begin with a short status line:

```
Using:    <skill-name> [Required | Helper | Optional]
Skipping: <skill-name> — <reason>
```
