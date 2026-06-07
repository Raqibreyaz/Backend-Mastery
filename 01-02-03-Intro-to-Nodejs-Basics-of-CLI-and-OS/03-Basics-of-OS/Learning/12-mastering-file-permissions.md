# Topic: File Permissions in Windows & Linux

- Lecture: Mastering File Permissions in Windows & Linux | Node.js Fundamentals Course | S3 Ep.12
- Date: 2026-06-06
- Source: [Youtube](https://youtu.be/5doKEeIKOyI?si=6uaLu2CUfOpRj8B8)
- Area: OS
- Confidence after lecture (1–5): 5
- One-sentence summary: An exploration of how operating systems manage file access security using permissions and how to manipulate them via GUI and terminal commands.

## 1. What is this topic?

- Definition: File permissions are access rights assigned to files and directories that dictate who can read, write, or execute them.
- Why it exists: To ensure system security, prevent unauthorized access to sensitive files, and isolate data between users.
- Where it’s used: Every modern operating system (Windows, Linux, macOS) manages system stability and multi-user data isolation through these mechanisms.

## 2. Mental model & intuition

Think of a file like a room in a building. Permissions are the keys given to people:

- **Read (r)**: The ability to look into the room.
- **Write (w)**: The ability to rearrange furniture (change content).
- **Execute (x)**: The ability to open the door and enter/run the activity inside.

Permissions are assigned to three groups: the **Owner** (you), the **Group** (your team), and **Others** (the rest of the world).

## 3. Internal working (mechanism)

- Key steps:
  1. Linux defines permissions using a 10-character string (e.g., `-rwxr-xr--`).
  2. The first character indicates file type (`-` for file, `d` for directory).
  3. The next 9 characters represent Read, Write, and Execute for the User, Group, and Others respectively.
  4. `chmod` translates these symbolic characters into numerical values (4=r, 2=w, 1=x) to apply settings.
- Assumptions: Systems assume the owner should usually have more control than others, and root/administrator bypasses these constraints.

## 4. Important terms & concepts

- **Owner**: The user who created the file.
- **Group**: A collection of users with shared access levels.
- **Others**: Everyone else on the system.
- **rwx**: The standard triad of permissions.
- **Octal Representation**: Summing values (4+2+1=7) to represent combinations of permissions.

## 5. Example(s)

- Minimal example: A file `app.js` with `644` (rw-r--r--) means the owner can read/write, while group/others can only read.
- Realistic example: A script `script.sh` set to `755` (rwxr-xr-x) allows the owner to execute, edit, and read, while others can only execute and read.

## 6. Code / commands / API patterns

bash

# Change permissions symbolically

chmod u+x filename # Add execute for owner
chmod g-w filename # Remove write for group

# Change permissions using octal numbers

chmod 755 filename # rwxr-xr-x
chmod 644 filename # rw-r--r--

- `chmod`: The command used to change mode bits.
- `ls -l`: Displays long-form file details including current permissions.

## 7. Edge cases, gotchas, and failure modes

- **Gotcha**: Changing permissions via WSL (Windows Subsystem for Linux) on a file stored on the Windows file system often behaves unpredictably or is ignored because of how Windows handles NTFS security.
- **Failure**: Attempting to run `git` on files with insufficient read permissions results in `permission denied` errors.

## 8. Trade-offs and alternatives

- Performance: Negligible overhead for checking permissions at the kernel level.
- Scalability: Essential for multi-user servers where manual access control is impossible.
- Alternatives: ACLs (Access Control Lists) offer finer-grained control than the basic rwx model.

## 9. Questions and doubts while learning

- Question: Can I give Write access without Read access?
  - Understanding: Yes, it is theoretically possible to have a write-only file, but most editors require read access to open the file for editing.

## 10. Practice tasks from the lecture

- Task: Experiment with `chmod` on a dummy file.
  - Goal: Master changing permissions for different user groups using both symbolic and numeric modes.

## 11. Key takeaways

- File permissions are hierarchical: Owner -> Group -> Others.
- Octal math (4, 2, 1) is the standard way to set permissions efficiently.
- Directories require 'execute' (x) permission to be traversed (cd into).
- Modifying Linux-style permissions on Windows-backed filesystems is discouraged.

## 12. Minimal self-test

1. What does the 'x' permission mean for a directory?
2. What is the difference between `chmod 644` and `chmod 755`?
3. How do you check the current permissions of a file in the terminal?
4. Why might `git` fail to track a file?
5. What is the octal value for "Read and Write" permission?

## 13. Links to related materials

- Related: Official Linux man pages for `chmod`.
- Docs: Understanding WSL file permissions (Microsoft Documentation).
