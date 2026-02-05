# File Hashing Guide with SHA-256

This guide explains how to hash files using SHA-256 on different platforms: Windows, macOS, and Linux. It also demonstrates a cross-platform method using `openssl`.

---

## ✅ Hashing Files on Windows with `certutil`

`certutil` is a built-in tool on Windows that can be used to generate SHA-256 hashes.

### Example:

```bash
certutil -hashfile path/to/file.txt SHA256
```

Hash as string input.
```bash
echo Hello World > temp.txt
certutil -hashfile temp.txt SHA256
rm temp.txt
```

List supported algorithms and commands.

```bash
certutil -hashfile -?
```

---

## ✅ Alternative for macOS and Linux: `shasum`

macOS and most Linux distributions come with `shasum` pre-installed.

### Example:

```bash
shasum -a 256 path/to/file.txt
```

Hash as string input.
```bash
echo "Hello World" | shasum -a 256 path/to/file.txt
```

List supported algorithms and commands.

```bash
shasum -h
```

---

## ✅ Cross-Platform Method: Using `openssl`

`openssl` is available on Windows, macOS, and Linux, and provides a consistent way to generate hashes.

### Example:

```bash
openssl dgst -sha256 path/to/file.txt
```

Hash as string input.

```bash
echo "Hello World" | openssl dgst -sha256
```

List supported algorithms and commands.

```bash
openssl list -digest-algorithms
```

> **Note:** If `openssl` is not installed, you can install it using a package manager:
>
> - **macOS**: `brew install openssl`
> - **Linux**: `sudo apt install openssl` or `sudo yum install openssl`
> - **Windows**: Install Git Bash or Download from [https://slproweb.com/products/Win32OpenSSL.html](https://slproweb.com/products/Win32OpenSSL.html)

---

## Summary

| Platform | Tool     | Command                              |
| -------- | -------- | ------------------------------------ |
| Windows  | certutil | `certutil -hashfile file.txt SHA256` |
| macOS    | shasum   | `shasum -a 256 file.txt`             |
| Linux    | shasum   | `shasum -a 256 file.txt`             |
| All      | openssl  | `openssl dgst -sha256 file.txt`      |
