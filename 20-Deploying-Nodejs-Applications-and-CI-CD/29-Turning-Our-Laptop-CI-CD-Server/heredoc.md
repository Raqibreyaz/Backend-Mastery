# What is a heredoc?

A **heredoc** (here-document) lets you send a block of text or commands to a program’s **stdin**.

Think of it like:

“Run this command, and feed it everything between here and the word EOF.”

Example:

```bash
cat << EOF
Hello
This is a heredoc
EOF
```

Output:

```
Hello
This is a heredoc
```

---

# Why is it useful?

Because it lets you write **multiple commands** inline without creating a separate file.

Very useful for:

* SSH
* Writing config files
* Deployment scripts
* Complex scripts sent over the network

---

# Structure of a heredoc

```
COMMAND << MARKER
content...
content...
content...
MARKER
```

* `COMMAND` is any Linux command (cat, bash, ssh, etc)
* `MARKER` is any word (EOF, END, DONE, PROCODRR, script, etc)
* Content continues until the marker appears again
* The ending marker must start at column 1 on its line

---

# Heredoc with SSH (most common)

This runs multiple commands **on the remote server** without a script file:

```bash
ssh storageApp 'bash' << 'EOF'
    set -e
    echo "Running on server..."
    cd /home/ubuntu/stroageApp-backend
    git pull
    npm i
    pm2 reload storageApp
    echo "Backend Deployed Successfully..."
EOF
```

Everything between `<< 'EOF'` and `EOF` runs *inside* the server.

---

# Why put quotes around EOF?

```bash
<< 'EOF'
```

The single quotes mean:

* Do NOT expand variables locally
* Do NOT expand commands locally
* Do NOT substitute $HOME, $USER, etc

Inside the heredoc:

* `$USER` refers to **remote machine's user**
* Variables remain intact

This:

```bash
<< EOF
The user is $USER
EOF
```

Expands **locally**
So $USER will be your laptop user.

But this:

```bash
<< 'EOF'
The user is $USER
EOF
```

Expands **on remote machine**, which is what you want.

---

# Heredoc to create files on server

```bash
ssh storageApp << 'EOF'
cat > hello.txt << 'END'
Hello World
END
EOF
```

You are nesting heredocs here, completely valid.

---

# Small rules to remember

### 1. Ending marker must be at column 1

This **fails**:

```
    EOF
```

This **works**:

```
EOF
```

### 2. Quoted marker prevents local expansion

```
<< 'EOF'
```

✓ safest

### 3. Use `-T` with SSH to avoid PTY warnings

```bash
ssh -T storageApp << 'EOF'
...
EOF
```

---

# The simplest definition

**A heredoc is a way to feed a block of text/commands to a command as stdin, without creating a file.**