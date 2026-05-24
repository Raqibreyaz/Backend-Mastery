## Example

### 1) Reusable workflow
Save this as `.github/workflows/reusable-build.yml`:

```yaml
name: Reusable build

on:
  workflow_call:
    inputs:
      node-version:
        required: false
        type: string
        default: "20"
    secrets:
      NPM_TOKEN:
        required: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: ${{ inputs.node-version }}

      - name: Install
        run: npm ci

      - name: Test
        run: npm test
```

### 2) Caller workflow
Save this as `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches:
      - main
      - develop

jobs:
  call-build:
    uses: ./.github/workflows/reusable-build.yml
    with:
      node-version: "22"
    secrets:
      NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Notes to write it well

- Use `workflow_call` in the reusable workflow; that marks it as callable.
- Put trigger logic like `push`, `pull_request`, or branch filters in the caller workflow, not the reusable one.
- Pass only the inputs you need; keep reusable workflows small and focused.
- Use `inputs` for parameters like versions, paths, or flags.
- Use `secrets` only when the reusable workflow truly needs them.
- If the reusable workflow lives in the same repo, call it with a relative path like `./.github/workflows/reusable-build.yml`.
- If it lives in another repo, you call it by repo reference instead.
- Composite actions are better for repeating a small set of steps; reusable workflows are better for full jobs or multi-job pipelines.
- Keep the reusable workflow generic so multiple branches or repos can use it without editing the core logic.
- If you want consistent behavior across branches, keep the caller workflow and reusable workflow versions aligned.

## Mental model

- Caller workflow = “when should this run?”
- Reusable workflow = “what should this do?”

That separation makes the YAML much easier to maintain.