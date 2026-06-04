## 1️⃣ Dynamically choose environment name from branch

Goal:

* If branch is `main` → use environment `PROD`
* If branch is `develop` → use environment `TEST`

We can do this directly in the `environment:` key using an expression.

```yaml
name: Branch based deploy

on:
  push:
    branches:
      - main
      - develop

jobs:
  deploy:
    runs-on: ubuntu-latest

    # Pick environment based on branch
    environment: ${{ github.ref_name == 'main' && 'PROD' || 'TEST' }}

    steps:
      - name: Show environment choice
        run: |
          echo "Branch: ${{ github.ref_name }}"
          echo "Environment used: ${{ job.environment.name }}"
```

This pattern is used because the expression language does not have a real ternary operator.
So we simulate it with `condition && 'valueIfTrue' || 'valueIfFalse'`.