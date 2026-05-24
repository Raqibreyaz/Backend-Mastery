## 🚀 Assignments for the Deployment Section

After finishing this section, try these assignments to truly own the deployment process.

### 1️⃣ Build a Reusable CI CD Server in Node.js ⚙️

**Question:**
Build a reusable CI CD server using Node.js that can work for multiple projects.

**Requirements:**

* ✅ **Webhook listener**

  * Listen to GitHub `push` events using webhooks.
  * On each push:

    * Pull or clone the repo.
    * Run tests.
    * Run build.
    * Run your deploy script.

* 🧩 **Config driven setup**

  * Use a config file (JSON or YAML) to describe:

    * Repositories.
    * Branch rules.
    * Build and deploy commands.
  * The same CI CD server should be reusable for at least 2 different projects by changing only the config.

* ✔️ **GitHub Commit Status API integration**

  * Use GitHub Commit Status or Check Runs API to:

    * Set status `pending` when the pipeline starts.
    * Set `success` when everything passes.
    * Set `failure` if any step fails.
  * The status should show:

    * Green check or red cross on the commit in GitHub.
    * A target URL that points to logs or a simple status page on your CI CD server.

* 📧 **Failure notifications by mail**

  * Whenever the pipeline fails at any stage:

    * Send a message to a configured address.
  * The failure message should include:

    * Repository name.
    * Branch name.
    * Commit hash and short message.
    * Which step failed (tests, build, deploy).
  * You can use any provider:

    * SMTP server with Nodemailer.
    * Transactional mail service.
    * Anything you are comfortable with.

---

### 2️⃣ Branch Based Deployments for Test and Prod 🌱🌳

**Question:**
Create two environments, Test and Prod, and deploy to them automatically based on the branch.

**Requirements:**

* 🏷️ **Two environments**

  * `TEST` environment for the `develop` branch.
  * `PROD` environment for the `main` branch.
  * Each environment should have:

    * Its own env variables or `.env` file.
    * Its own domain, subdomain or at least a different port.

* 🔀 **Branch based deploy rules**

  * On push to `develop`:

    * CI CD server should deploy to the Test setup.
  * On push to `main`:

    * CI CD server should deploy to the Prod setup.

* 🧠 **Implementation ideas**

  * Use the branch name from webhook payload to:

    * Decide which config to load.
    * Decide which deploy script to call, for example:

      * `deploy-test.sh`
      * `deploy-prod.sh`

---

### 3️⃣ Learn and Compare Deployment Strategies 📚

**Question:**
Study different deployment strategies and map them to your project.

**Requirements:**

* 🔎 **Research these strategies**

  * Blue green deployment.
  * Canary deployment.
  * Rolling deployment.
  * Recreate deployment (classic stop then start).
  * Shadow deployment or A/B style release.

* 🧮 **Compare them**

  * For each strategy write:

    * What it is in simple words.
    * Pros.
    * Cons.
    * When it is a good fit.

* 🧩 **Apply to your app**

  * Pick one strategy that fits your current app and infra.
  * Explain:

    * Why you chose it.
    * How you would implement it with your stack (Node, Nginx, EC2 or your setup).

---

### 4️⃣ Add a Rollback Mechanism 🔁

**Question:**
Add a simple rollback system so that a bad deployment does not break everything.

**Requirements:**

* 📂 **Keep at least two versions**

  * Store:

    * Current release.
    * Previous release.
  * This can be:

    * Two folders like `releases/2025-12-06-1` and `releases/2025-12-06-2`.
    * Or a `current` and `previous` symlink.

* ❤️ **Health check after deploy**

  * After deployment, your CI CD server should:

    * Call a `/health` or `/` endpoint.
    * Check if the response is OK.

* ⏪ **Automatic rollback**

  * If the health check fails:

    * Switch back to the previous version automatically:

      * Point Nginx or your process manager to the previous folder.
      * Or revert the symlink to the old release.

---

### 5️⃣ Add Basic Monitoring and Logs for Deployments 👀

**Question:**
Add simple monitoring so you can see what happened in every deployment.

**Requirements:**

* 📝 **Deployment logs**

  * Save logs for each deployment in a file with date and time.

    * Example: `logs/deploy-2025-12-06-20-30.txt`.
  * Include steps:

    * Git pull.
    * Tests.
    * Build.
    * Deploy.
    * Health check result.

* ❤️ **Health endpoint in the app**

  * Add a `/health` endpoint in your Node app that:

    * Returns a small JSON like `{ status: "ok", version: "1.0.0" }`.
  * Use this endpoint in your CI CD pipeline for post deploy checks.

* 🔔 **Optional: notifications for success**

  * Send a small message on successful deploy:

    * Telegram, Discord webhook or any simple notification.
  * Include:

    * Branch.
    * Status.
    * Commit message.