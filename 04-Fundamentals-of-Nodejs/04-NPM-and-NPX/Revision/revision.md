# NPM and NPX — One-Shot Revision

## 1. One-line Definition

**npm** manages Node.js packages and project metadata; **npx** (modernly backed by `npm exec`) runs package-provided command-line executables.

## 2. Why was it introduced?

Packages let teams share and version reusable code. npm makes installing and reproducing dependencies practical; npx runs project-specific or temporary CLI tools without global installation.

## 3. Core Mental Model

`package.json` is the project’s contract and shopping list. The lockfile records the exact resolved delivery. `node_modules` is the installed, regenerable result. A package can be a library you import, a CLI you execute, or both.

## 4. Internal Working

When Node sees a bare specifier such as `express`, it resolves a package from module search locations such as `node_modules` and follows the package’s `exports` map (or legacy entry fields). `exports` can route `import` and `require` consumers to different files.

`npm install` resolves a dependency tree, writes packages into `node_modules`, updates the manifest as appropriate, and records exact resolution in `package-lock.json`. `npx command` prioritizes the local project executable; it may download a requested package for temporary execution when one is not installed locally.

## 5. Key APIs / Syntax

```bash
npm init -y
npm install axios
npm install -D vite
npm run dev
npx vite
npm exec -- vite
npm publish
```

```json
{
  "name": "my-package",
  "version": "1.0.0",
  "type": "module",
  "scripts": { "dev": "vite", "start": "node app.js" },
  "exports": {
    "import": "./dist/index.js",
    "require": "./dist/index.cjs"
  }
}
```

- `dependencies`: required at runtime.
- `devDependencies`: tools needed to develop, test, or build.
- `bin`: maps a CLI command name to an executable script in a package.
- SemVer: `major.minor.patch`; `^` normally permits compatible minor/patch updates, `~` normally permits patch updates.
- `npm login` authenticates before publishing; published package versions are immutable.

## 6. Comparison

| Area | Library package | CLI package |
| --- | --- | --- |
| Main use | Imported by application code | Run from terminal |
| Typical API | `import express from 'express'` | `npx vite` / npm script |
| Package metadata | Exports/entry points | `bin` mapping, often plus exports |
| Best installation | Local project dependency | Local project dev dependency |

| Scope | Local | Global |
| --- | --- | --- |
| Location | Project `node_modules` | System npm prefix |
| Version control | Per-project, reproducible | One machine-wide version |
| Recommendation | Default | Only for personal, cross-project tools when appropriate |

## 7. Common Mistakes

- Committing `node_modules` rather than the manifest and lockfile.
- Installing build/test tools under `dependencies` rather than `devDependencies`.
- Running a local CLI as a bare shell command instead of through an npm script, `npx`, or `npm exec`.
- Publishing a taken package name or a version that already exists.
- Editing files in `node_modules` as a configuration strategy; installations overwrite them.
- Running an unfamiliar remote `npx` package without checking what it will execute.
- Assuming the non-standard `module` field is Node’s authoritative ESM entry point; prefer a well-defined `exports` map for packages.

## 8. Production Considerations

- Commit `package-lock.json` and use `npm ci` in reproducible CI/deployment environments.
- Do not commit `node_modules`; use `.gitignore`.
- Prefer local, versioned CLI tools invoked via npm scripts.
- Keep `exports` intentional: it defines a package’s supported public surface and can provide CJS/ESM dual entry points.
- Before publishing, verify package contents with `npm pack --dry-run`, add repository/license metadata, and use scoped/private packages where necessary.
- Audit and update dependencies deliberately; lockfiles improve repeatability but do not remove supply-chain risk.

## 9. Interview Questions

1. What is the role of `package.json` and `package-lock.json`?
2. Compare `dependencies` and `devDependencies`.
3. What does the `bin` field do?
4. Why prefer a locally installed CLI to a global one?
5. How does npx differ from `npm install -g`?
6. What is SemVer and what do `^` and `~` mean?
7. Why can’t an npm package version be republished?
8. What does a package `exports` map solve?

## 10. Memory Triggers

- **Manifest:** `package.json` says what is wanted.
- **Receipt:** lockfile says exactly what resolved.
- **Warehouse:** `node_modules` can be rebuilt.
- **Library = import; CLI = execute.**
- **Local CLI: script / npx / npm exec.**
- **`bin` makes a command; `exports` makes an import API.**

## 11. Summary

npm manages packages, scripts, versions, and publishing; npx runs executables without making them global. Keep dependencies local and reproducible, use the lockfile, publish immutable versions deliberately, and use `exports`/`bin` to define how a package is consumed.
