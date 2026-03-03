## 📂 Editing the `hosts` File (For Local Testing)

### 💻 Windows

1. Open Notepad as Administrator.
2. Open the file: `C:\Windows\System32\drivers\etc\hosts`
3. Add entries like:

   ```
   127.0.0.1 app.local.com
   127.0.0.1 api.local.com
   ```

4. Save the file.

### 🥜 macOS

1. Open Terminal.
2. Run:

   ```sh
   sudo nano /etc/hosts
   ```

3. Add entries:

   ```
   127.0.0.1 app.local.com
   127.0.0.1 api.local.com
   ```

4. Press `Ctrl+O` to save and `Ctrl+X` to exit.
5. Flush DNS cache with:

   ```sh
   sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
   ```

### 💾 Linux

1. Open Terminal.
2. Edit the hosts file:

   ```sh
   sudo nano /etc/hosts
   ```

3. Add entries:

   ```
   127.0.0.1 app.local.com
   127.0.0.1 api.local.com
   ```

4. Save and close (`Ctrl+O`, then `Ctrl+X`).
5. Restart your browser if necessary.
