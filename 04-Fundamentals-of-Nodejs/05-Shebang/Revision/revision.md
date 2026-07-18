# Shebang — One-Shot Revision

## 1. One-line Definition

A **shebang** (hashbang) is the first line of a Unix-like executable script—`#!` followed by its interpreter command.

## 2. Why was it introduced?

It lets the operating system run a script directly, without the user typing the interpreter manually each time.

## 3. Core Mental Model

The shebang is the script’s “open with” instruction for the OS. Running `./tool.js` tells the OS to read its first line, start the chosen interpreter, and give that interpreter the script.

## 4. Internal Working

For a directly executed file, the OS recognizes `#!` at the beginning and uses the rest of that line to choose the interpreter. The script must also have execute permission. Node itself treats the shebang as a comment, so it does not matter when using `node tool.js`.

## 5. Key APIs / Syntax

```js
#!/usr/bin/env node

console.log('Hello from a CLI');
```

```bash
chmod +x tool.js
./tool.js
```

`#!/usr/bin/env node` asks `env` to find `node` through `PATH`, making the script more portable than hardcoding a specific installation path.

## 6. Comparison

| Command | Needs shebang? | Needs executable bit? |
| --- | --- | --- |
| `node tool.js` | No | No |
| `./tool.js` on Unix-like OS | Yes | Yes |

## 7. Common Mistakes

- Placing the shebang anywhere other than the first line.
- Using a nonexistent interpreter path or a relative interpreter path.
- Forgetting `chmod +x`, causing permission errors.
- Using Windows-specific expectations: direct execution behaviour varies outside Unix-like shells/WSL.
- Assuming it makes a file a compiled binary; it remains an interpreter-run script.

## 8. Production Considerations

- Use `#!/usr/bin/env node` for Node CLI entry files unless the deployment environment needs a fixed interpreter path.
- Declare the executable in an npm package’s `bin` field so npm links it into `.bin` / global command locations.
- Keep CLI startup quick and validate arguments/errors cleanly.
- Ensure the file is executable in the published package or source checkout when direct execution is expected.

## 9. Interview Questions

1. What does `#!` mean?
2. Why use `/usr/bin/env node` rather than `/usr/bin/node`?
3. Why is `chmod +x` needed?
4. Is a shebang needed for `node app.js`?
5. How does an npm package expose a shebang script as a command?

## 10. Memory Triggers

- **Shebang = OS interpreter label.**
- **First line, then execute bit.**
- **`env` finds Node through `PATH`.**
- **Direct `./tool.js`, not required for `node tool.js`.**

## 11. Summary

A shebang makes a script directly executable on Unix-like systems. Put `#!/usr/bin/env node` first, grant execute permission, and connect the script through `bin` when publishing an npm CLI.
