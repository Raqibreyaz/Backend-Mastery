# GitHub Actions Explained

## What is GitHub Actions? 🧩

GitHub Actions is an automation system built inside GitHub that lets you run tasks automatically whenever something happens in your repository. It can run tests, build your code, deploy applications, or execute any commands you want.

### A Simple Way to Think About It 🤖

You can think of GitHub Actions as a machine provided by GitHub that runs your commands whenever events occur in your repository. You describe what to run, and it executes everything for you.

### Singular or Plural? ✨

Even though the name sounds plural, we refer to it as a single service called GitHub Actions.

---

## Machines Used by GitHub Actions ⚙️

When a workflow runs, GitHub provides a temporary virtual machine that exists only for that run. These machines come preinstalled with many tools such as:

* Node.js
* Git
* Python
* Docker
* Java
* Ruby
* System utilities

You don’t need to install these tools manually unless you want specific versions.

---

## Workflow Files 📁

GitHub Actions automation is defined inside **workflow files**. These files must be placed in the following directory inside your repository:

```
.github/workflows/
```

Each file inside this folder represents one workflow.

---

## Workflow Examples 📝

### 1. A Workflow With a Single Step

```yaml
name: Single Command Example

on: push

jobs:
  run-one-command:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: List Files
        run: ls -la
```

### 2. Workflow Running Multi Line Scripts Using the Pipe Symbol |

```yaml
name: Multiline Script Example

on: push

jobs:
  multiline-job:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Run Multiline Script
        run: |
          echo "Starting Script"
          mkdir demo
          echo "Hello World" > demo/hello.txt
          cat demo/hello.txt
```

---

## Trigger Events ⏳

GitHub Actions workflows start automatically based on triggers.

### Common Triggers

* **push**: Runs when you push commits.
* **pull_request**: Runs when someone creates or updates a pull request.
* **create**: Runs when a new tag or branch is created.
* **schedule**: Runs on a cron schedule.
* **workflow_dispatch**: Lets you trigger workflows manually.

---

## GitHub Hosted Runners vs Self Hosted Runners 🖥️

### GitHub Hosted Runners

* Machines provided by GitHub.
* Automatically created and destroyed for every job.
* Come preinstalled with many tools.
* Ideal for most projects.

### Self Hosted Runners

* Your own server or machine.
* You install the runner software.
* Workflows run on your hardware.
* Useful for:

  * Large builds
  * Custom environments
  * Private infrastructure needs

---

## How GitHub Actions Relates to CI CD 🛠️

GitHub Actions behaves like an automated server that listens for repository events and runs your scripts. This makes it perfect for CI CD tasks such as:

* Running tests on each commit
* Building apps on every merge
* Deploying automatically
* Validating pull requests

GitHub Actions becomes your continuous automation engine.

---

## Pricing Information 💰

### Public Repositories

* Free unlimited minutes for GitHub hosted runners.

### Private Repositories

* Limited free minutes based on your plan.
* Additional minutes cost extra.

### Extra Charges

* Larger runner sizes
* Windows and macOS runners have different pricing
* Additional storage or artifacts may add cost

---

## Summary 🎉

GitHub Actions is a powerful automation tool inside GitHub that helps you run tasks based on repository events. With simple workflow files and powerful preconfigured machines, you can automate testing, building, and deploying your applications easily.

This system fits naturally into modern CI CD practices and is one of the easiest ways to automate DevOps tasks inside GitHub.


https://docs.github.com/en/actions/get-started/understand-github-actions