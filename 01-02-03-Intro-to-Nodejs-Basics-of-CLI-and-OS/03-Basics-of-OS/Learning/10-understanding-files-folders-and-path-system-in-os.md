# Topic: OS Files, Folders, and Path Systems

- Lecture: Understanding Files, Folders, and the Path System in OS | Node.js Fundamentals Course | S3 Ep.10
- Date: 2026-06-06
- Source: [Youtube](https://youtu.be/KO_YcmPFOvk?si=GYpV5OsevU3H1XzH)
- Area: OS
- Confidence after lecture (1–5): 5
- One-sentence summary: An exploration of file systems, directory structures, symbolic links, and absolute vs. relative path conventions across Windows and Unix-like environments.

## 1. What is this topic?

- Definition: The OS path system manages how files (data containers) and folders/directories (containers for files/folders) are located and accessed on a storage device.
- Why it exists: It provides a logical hierarchy for the OS and applications to reliably find and manipulate data regardless of its physical location on the disk.
- Where it’s used: Everywhere in software development; from loading local config files to defining server-side file paths in Node.js applications.

## 2. Mental model & intuition

Think of the file system as a giant tree. The "Root" is the base of the tree. Every file or folder is a node. Paths are simply the set of directions you give to the computer to find a specific "leaf" (file) starting from a specific "node" (your current folder or the root).

## 3. Internal working (mechanism)

- Key steps:
  1. The OS identifies a file by its unique path string.
  2. For Absolute Paths, the OS starts traversal from the System Root (e.g., C:\ or /).
  3. For Relative Paths, the OS starts traversal from the current working directory (PWD).
  4. The OS resolves separators (\ vs /) based on the environment.
- Data flow: User input -> Path resolution via OS kernel -> File access/Error.

## 4. Important terms & concepts

- Symbolic Links: A "shortcut" file that points to another file or directory. Represented by 'l' in terminal lists.
- Absolute Path: A full path starting from the root directory (e.g., /home/user/app).
- Relative Path: A path defined relative to the current directory (e.g., ./src/app).
- Root Directory: The top-level directory in the file system hierarchy, represented by '/'.

## 5. Example(s)

- Toy: `cd ./src` (Go into a folder inside the current one).
- Production: `/home/ubuntu/app/server.js` (Absolute location of a production node script).

## 6. Code / commands / API patterns

bash

# Show file/directory info (d=directory, l=symlink, -=file)

ls -l

# Get current working directory

pwd

# Convert paths between Windows and Unix formats (via cygpath)

cygpath -w /path/to/file
cygpath -u C:\path\to\file

## 7. Edge cases, gotchas, and failure modes

- Gotchas: Windows uses backslashes (\) which are escape characters in most programming languages. Use double backslashes (\\) or forward slashes (/) to avoid bugs.
- Failure modes: Using a hardcoded absolute path in code (e.g., C:\Users\Name\...) will crash on any machine that isn't yours.

## 8. Trade-offs and alternatives

- Trade-offs: Absolute paths are explicit but non-portable; Relative paths are portable but depend on the execution context.
- Alternatives: Use built-in path resolution libraries (like Node.js `path` module) to construct paths dynamically, ensuring cross-platform compatibility.

## 9. Questions and doubts while learning

- Question: Why does `cd` sometimes fail with special characters?
  - Understanding: Shell interprets characters like ' ' or '&' as operators; paths should be quoted.

## 10. Practice tasks from the lecture

- Task: Experiment with `cygpath` and `ls -l`
  - Goal: Understand how to inspect file types and translate path formats.

## 11. Key takeaways

- Directories (folders) are containers; files are data storage containers.
- Symbolic links act as aliases for files/directories.
- Always prefer relative paths or dynamic path construction over hardcoded absolute paths.
- Unix uses forward slashes (/); Windows uses backslashes (\).

## 12. Minimal self-test

1. What is the difference between an absolute and a relative path?
2. What character represents a symbolic link in an `ls -l` list?
3. How do you refer to the parent directory?
4. Why should you avoid using single backslashes in code strings for Windows paths?
5. What is the command to view the current working directory?
