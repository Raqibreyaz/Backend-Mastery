# Common Terms in GitHub Actions

GitHub Actions is made up of several important parts. Each part describes how automation is organized inside a repository. Understanding these terms gives a complete picture of how workflows run and how tasks are executed.

---

## 🌟 Workflows

A **workflow** is an automation file stored inside `.github/workflows`.
A repository can have multiple workflows, each focused on a specific task such as deployment, testing, building, or formatting.

A workflow begins only when something triggers it. These triggers are called **events**.

---

## ⚡ Events

Events start workflows. They are specific activities that happen in a repository.

Examples of events:

* `push` when someone pushes code
* `pull_request` when a PR is opened or updated
* `workflow_dispatch` for manual runs
* `schedule` for time based automation
* `release` when a new release is created

Without an event, a workflow will not run.

---

## 🧱 Jobs

A **job** is a collection of tasks inside a workflow.
A workflow can contain one job or multiple jobs.

Important points:

* Each job runs on its own **runner machine**
* Jobs run **in parallel** by default
* You can make a job wait for another job using the `needs` keyword

Example:

```
jobs:
  build:
    runs-on: ubuntu-latest

  deploy:
    runs-on: ubuntu-latest
    needs: build
```

Here, the deploy job will run only after the build job finishes.

---

## 💻 Runners

A **runner** is the actual machine that executes a job.
It can be a virtual machine or a physical machine.

There are two types of runners:

### 1. GitHub hosted runners

These are provided by GitHub.
You get ready to use machines like:

* `ubuntu-latest`
* `windows-latest`
* `macos-latest`

These machines already include many tools such as:

* Node.js
* Git
* Docker (in Linux)
* Python
* Common utilities

Every time a job starts, GitHub creates a fresh runner, runs the job, and then deletes the machine.

### 2. Self hosted runners

These are machines that you configure yourself.

Examples:

* Your own laptop
* Your office server
* An EC2 instance
* A dedicated machine in your network

You install the GitHub runner software, and then your machine executes the jobs.

---

## 🪜 Steps

Each job contains multiple **steps**, and steps run in sequence.
A step is a single instruction.

Examples of steps:

* Running a shell script
* Installing packages
* Checking out the repository
* Running tests
* Uploading build files

Steps inside a job always run one after another.

---

## 🎛️ Actions

An **action** is a reusable automation component that you use inside steps.
Actions help you avoid writing everything manually.

Examples:

* `actions/checkout` to clone the repository
* `actions/setup-node` to install Node
* `actions/cache` to cache dependencies
* `docker/build-push-action` to build and push Docker images

You can also create your own custom actions.

---

## 🧩 Summary

Here is the complete structure:

* A repository can have multiple **workflows**
* A workflow starts when an **event** happens
* A workflow can contain multiple **jobs**
* Each job runs on a separate **runner machine**
* Jobs contain multiple **steps**
* Steps can use reusable **actions**

These terms together form the full automation system inside GitHub Actions.