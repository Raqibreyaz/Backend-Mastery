# ⭐ What is the **if** condition in GitHub Actions

The **if** condition in GitHub Actions is used to **control whether a job or a step should run**.
It is like adding a gate. If the condition is true, the job or step runs. If it is false, it gets skipped.

The if condition can appear in **two places**:

1. At the **job level**
2. At the **step level**

GitHub evaluates the condition before executing that job or step.

---

# ⭐ Where the if condition can be used

## 1. Job level

If the job level condition is false, **the entire job is skipped**, including all steps inside it.

```yaml
jobs:
  deploy:
    if: github.ref_name == 'main'
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploying..."
```

If the branch is not main, this job will not run at all.

---

## 2. Step level

A job can run, but individual steps inside it can still be conditionally controlled.

```yaml
steps:
  - run: echo "This always runs"

  - run: echo "This runs only on main branch"
    if: github.ref_name == 'main'
```

If the branch is not main, only the step is skipped, not the whole job.

---

# ⭐ Expression syntax inside if is optional

There are **two valid ways** to write conditions:

## 1. Without expression syntax (simpler, recommended)

```yaml
if: github.ref_name == 'main'
```

## 2. With expression syntax

```yaml
if: ${{ github.ref_name == 'main' }}
```

Both behave the same. The first version is easier to read, so most people use it when conditions are simple.

---

# ⭐ What kind of comparisons can be done inside if

The if condition supports:

### ✔ Equality and inequality

```yaml
if: github.actor == 'anurag'
if: github.event_name != 'push'
```

### ✔ Greater than or less than (for numbers)

```yaml
if: github.run_number > 50
```

### ✔ Logical operators

```yaml
if: github.ref_name == 'main' && github.event_name == 'push'
```

```yaml
if: github.actor == 'anurag' || github.actor == 'akash'
```

### ✔ Boolean functions

GitHub provides built in functions:

```yaml
if: success()
if: failure()
if: cancelled()
if: always()
```

Examples:

```yaml
if: failure()
```

This step runs only if a previous step failed.

```yaml
if: always()
```

This step always runs even if earlier steps failed.

---

# ⭐ Common real world examples

## 1. Run only on main branch

```yaml
if: github.ref_name == 'main'
```

## 2. Run only when someone triggered manually

```yaml
if: github.event_name == 'workflow_dispatch'
```

## 3. Run only for pull requests

```yaml
if: github.event_name == 'pull_request'
```

## 4. Run only when commit message contains text

```yaml
if: contains(github.event.head_commit.message, '[deploy]')
```

## 5. Run only for a specific user

```yaml
if: github.actor == 'anuragsingh'
```

## 6. Run cleanup step even if everything else fails

```yaml
if: always()
```

---

# ⭐ How GitHub evaluates the if condition

Here is the sequence GitHub follows:

1. GitHub starts the workflow because an event triggered it.
2. GitHub reads the job or step.
3. GitHub reads the if condition.
4. GitHub evaluates the condition.
5. If the condition is true, execution continues.
6. If false, the job or step is skipped.

---

# ⭐ Things that are not allowed

### ❌ You cannot use if at workflow level

There is no workflow wide if.
It only works on:

- jobs
- steps

### ❌ You cannot write complex code

It is not JavaScript.
It is a simple boolean condition evaluator.

---

# ⭐ Summary

- The if condition controls whether a job or step runs.
- It can be written with or without expression syntax.
- It supports comparisons, logical operators, and built in functions.
- It can only be used at job level and step level, not workflow level.
- If the condition is false, GitHub skips that job or step.
