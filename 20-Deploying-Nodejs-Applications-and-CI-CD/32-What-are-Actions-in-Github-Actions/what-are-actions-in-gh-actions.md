## ⭐ What are Actions inside GitHub Actions?

> **Actions are pre built automation tasks that can be used inside steps.
> They help you avoid writing long scripts by allowing you to reuse tools created by GitHub or the community.**

In other words, an action is a small, reusable unit of work that runs as a **single step** inside a job.

Example:

```yaml
steps:
  - name: Checkout code
    uses: actions/checkout@v4
```

Here `actions/checkout@v4` is an **action**, and it runs as one step inside the job.

---

## 🧱 Where do Actions live in the hierarchy?

The structure of a workflow looks like this:

```text
workflow
└── jobs
    └── steps
        └── actions (inside steps)
```

Important points:

* You **cannot** put an action directly at workflow level.
* You **cannot** put an action directly at job level.
* You **always** use an action inside a **step** with the `uses:` keyword.

This is why we say:

> Actions are always attached to steps.
> A step either runs a command (`run:`) or calls an action (`uses:`).

Example of both in one job:

```yaml
steps:
  - name: Checkout code
    uses: actions/checkout@v4        # using an action

  - name: Install dependencies
    run: npm install                  # running a shell command
```

---

## 🎯 What does an Action do?

An action usually performs one focused task, such as:

* Cloning the repository
* Installing Node, Python or Java
* Authenticating with AWS, GCP or Azure
* Building and pushing Docker images
* Uploading or downloading artifacts
* Running code quality checks

Instead of writing long shell scripts, you plug in these ready made building blocks.

So in practice, actions give you:

* Less code to maintain
* Fewer mistakes in setup
* Consistent behaviour across projects

---

## 🏪 GitHub Marketplace for Actions

The **GitHub Marketplace** is where you discover ready made actions.

```text
https://github.com/marketplace?type=actions
```

In the Marketplace, you can:

* Search for actions by keyword, for example: `node`, `docker`, `aws`, `lint`
* Open an action’s page to see:

  * What it does
  * How to use it
  * Example `uses:` snippet
  * Available inputs and outputs
  * Which versions exist

You do not install actions manually.
You simply copy the `uses:` line from the Marketplace and paste it into your step.

Example from Marketplace:

```yaml
- name: Setup Node
  uses: actions/setup-node@v4
  with:
    node-version: 20
```

GitHub automatically:

1. Downloads this action from its repository
2. Reads its `action.yml`
3. Executes it as part of your step

---

## 🔍 Difference between Actions and Apps (quick clarification)

In the same Marketplace, there is also a section called **Apps**.
Students often confuse these.

* **Actions**

  * Used **inside steps**
  * Run only when a workflow is executing
  * Are part of your CI or automation pipeline

* **Apps**

  * Installed on your repository or organization
  * Run as integrations or services (for example Vercel, Netlify)

---

## 🧠 Summary


> * A workflow is made of jobs.
> * Jobs are made of steps.
> * Steps can either run commands or use actions.
> * **Actions are reusable tasks that live inside steps and are discovered from the GitHub Marketplace.**