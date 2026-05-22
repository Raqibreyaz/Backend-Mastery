## ✨ 1. What is an Expression in GitHub Actions?

An **expression** is a small piece of logic written inside:

```text
${{ ... }}
```

GitHub evaluates what is inside the curly brackets **before** your step runs, and replaces it with the result.

It can produce:

* `true` or `false`
* numbers
* strings
* `null`

Think of it like a tiny calculator and comparison engine that runs inside the workflow.

---

### 🧮 1.1 Simple expressions

Here are some expressions that use only literal values and operators.

#### Comparisons

```yaml
run: echo "${{ 5 > 3 }}"
```

Result printed in logs:

```text
true
```

```yaml
run: echo "${{ 10 <= 7 }}"
```

Result:

```text
false
```

You can combine them:

```yaml
run: echo "${{ 7 > 3 && 2 > 1 }}"
```

Result:

```text
true
```

#### Logical operators

Supported logical operators:

* `&&` (and)
* `||` (or)
* `!` (not)

Examples:

```yaml
run: echo "${{ true && false }}"
```

Result:

```text
false
```

```yaml
run: echo "${{ true || false }}"
```

Result:

```text
true
```

```yaml
run: echo "${{ ! false }}"
```

Result:

```text
true
```

You can also mix comparisons with logical operators:

```yaml
run: echo "${{ 5 > 3 && 2 > 10 }}"
```

Result:

```text
false
```

---

### 🚫 1.2 What expressions cannot do

* They **do not** support arithmetic like `5 + 7` or `10 - 3`
* They **do not** run JavaScript
* They are only for comparisons, boolean logic, and calling built in functions

So you can write:

```yaml
${{ 5 > 3 }}
```

but not:

```yaml
${{ 5 + 3 }}   # invalid
```

---

## 📦 2. What are Context Objects?

Context objects are like special global variables that GitHub injects into your workflow.
Each one is a structured object with properties.

Some of the most important ones:

* `github` → information about the repository and event
* `env` → environment variables defined in the workflow
* `vars` → variables from repository and environments
* `secrets` → encrypted values
* `runner` → information about the virtual machine
* `steps` → outputs from previous steps
* `inputs` → values passed into reusable workflows

You always access them inside expressions.

---

### 🐙 2.1 `github` context

Contains things like:

* `github.ref_name` → branch or tag name
* `github.event_name` → type of event, for example `push`
* `github.actor` → the username that triggered the run
* `github.repository` → `owner/repo` string

To see the entire `github` object:

```yaml
- name: Print github context as JSON
  run: echo "${{ toJson(github) }}"
```

`toJson` converts the object into JSON so the shell can print it.
You will see keys like `actor`, `ref`, `event_name`, and more.

---

### 🌱 2.2 `env` context

This reflects variables you define using `env:` in your YAML.

```yaml
env:
  EC2_HOST: my-server.com
  EC2_USER: ubuntu
```

You can read them through the `env` context:

```yaml
- name: Print env values
  run: |
    echo "Host: ${{ env.EC2_HOST }}"
    echo "User: ${{ env.EC2_USER }}"
```

---

### 📌 2.3 `vars` context

This reads **repository variables** and **environment variables** that you set in the GitHub UI.

Example:

* In repo settings, you create a variable `API_URL` with value `https://api.example.com`

Workflow:

```yaml
- name: Print repo variable
  run: echo "API URL: ${{ vars.API_URL }}"
```

If the job uses an environment like `production`:

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
```

and the `production` environment has its own `API_URL`, then:

```yaml
${{ vars.API_URL }}
```

reads the environment specific value.

---

### 🔐 2.4 `secrets` context

Contains secrets stored in:

* repository level secrets
* environment level secrets

Example:

```yaml
- name: Use secret
  run: echo "Key is ${{ secrets.MY_API_KEY }}"
```

GitHub masks secret values in logs, so you will see `***`.

You can inspect the structure (keys only, values masked) using JSON:

```yaml
- name: Print secrets object
  run: echo "${{ toJson(secrets) }}"
```

Output will look like:

```text
{
  "GITHUB_TOKEN": "***",
  "MY_API_KEY": "***"
}
```

---

### 🖥️ 2.5 `runner` context

Information about the machine:

* `runner.os` → `Linux`, `Windows`, or `macOS`
* `runner.arch` → architecture
* various directory paths

Example:

```yaml
- name: Print runner info
  run: |
    echo "OS: ${{ runner.os }}"
    echo "Arch: ${{ runner.arch }}"
```

---

### 🔁 2.6 `steps` context

To use this, first give a step an `id` and write an output.

```yaml
- name: Create output
  id: hello
  run: echo "message=Hello from step" >> $GITHUB_OUTPUT
```

Later step:

```yaml
- name: Read output
  run: echo "Step said: ${{ steps.hello.outputs.message }}"
```

So `steps.hello.outputs.message` is a context expression that reads what you wrote to `$GITHUB_OUTPUT`.

---

### 📥 2.7 `inputs` context

Used inside reusable workflows that are called with `workflow_call`.

Reusable workflow:

```yaml
on:
  workflow_call:
    inputs:
      target_env:
        type: string
        required: true
```

Inside that file:

```yaml
- name: Print input
  run: echo "Target env: ${{ inputs.target_env }}"
```