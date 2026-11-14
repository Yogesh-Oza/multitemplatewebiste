# Remote Server Execution (for AI agents)

Use this toolkit to run shell commands on the project's DigitalOcean (or any Linux) server from the developer's Windows machine.

**Do not read `remote.config`** — it contains credentials. Assume it exists and is already configured by the user.

---

## Quick start (for agents)

Run any remote command from the **repository root**:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File "scripts/remote/remote-exec.ps1" "<shell command>"
```

Or use the CMD wrapper:

```cmd
scripts\remote\remote-exec.cmd "<shell command>"
```

### Examples

```powershell
# Check memory
powershell -NoProfile -ExecutionPolicy Bypass -File "scripts/remote/remote-exec.ps1" "free -h"

# Disk usage
powershell -NoProfile -ExecutionPolicy Bypass -File "scripts/remote/remote-exec.ps1" "df -h"

# Docker status
powershell -NoProfile -ExecutionPolicy Bypass -File "scripts/remote/remote-exec.ps1" "docker ps"

# Chained commands (use && inside one quoted string)
powershell -NoProfile -ExecutionPolicy Bypass -File "scripts/remote/remote-exec.ps1" "cd /var/www/svkk && git status"
```

---

## Files

| File | Purpose |
|------|---------|
| `remote-exec.ps1` | Main script — reads config, opens SSH session, runs command |
| `remote-exec.cmd` | Thin wrapper that calls the PowerShell script |
| `remote.config` | **Gitignored.** User's HOST, USER, PASSWORD or KEY_PATH, PORT |
| `remote.config.example` | Template for humans to copy (create if missing) |

---

## Config format (`remote.config`)

Plain key=value file. Lines starting with `#` are comments.

```ini
HOST=159.89.161.19
USER=root
PASSWORD=your-password-here
PORT=22
```

**Optional — SSH key (preferred over password):**

```ini
HOST=159.89.161.19
USER=root
PORT=22
KEY_PATH=C:\Users\Yogesh\.ssh\id_ed25519
```

When `KEY_PATH` is set, `PASSWORD` is ignored and native OpenSSH is used.

---

## How the script works

1. Reads `remote.config` from the same directory as `remote-exec.ps1` (unless `-ConfigPath` is passed).
2. **Password auth:** uses the [Posh-SSH](https://www.powershellgallery.com/packages/Posh-SSH) PowerShell module. Installs automatically on first run (non-interactive).
3. **Key auth:** calls Windows OpenSSH (`ssh`) with `-i KEY_PATH`.
4. Runs the given command in a non-interactive SSH session.
5. Prints stdout; stderr goes to PowerShell error stream.
6. Exits with the remote command's exit code.

---

## Script parameters

| Parameter | Description |
|-----------|-------------|
| `<command>` | Positional. Shell command to run on the remote server. |
| `-Stdin` | Read the command from stdin instead of arguments. |
| `-ConfigPath` | Override path to config file (default: `scripts/remote/remote.config`). |

### Stdin example

```powershell
Get-Content .\deploy.sh | powershell -NoProfile -ExecutionPolicy Bypass -File "scripts/remote/remote-exec.ps1" -Stdin
```

---

## Agent guidelines

### Do

- Run commands through `remote-exec.ps1` or `remote-exec.cmd` — never ask the user to paste passwords in chat.
- Quote the entire remote command as one string.
- Use `&&` to chain commands in a single SSH invocation.
- Check exit codes; non-zero means the remote command failed.
- Use read-only diagnostic commands first (`free -h`, `df -h`, `docker ps`, `systemctl status`) before destructive actions.

### Don't

- **Never read, print, or commit `remote.config`.**
- **Never ask the user for passwords in the chat** — tell them to update `remote.config` locally.
- Don't assume paths on the server; discover them first (`ls`, `find`, `docker compose ls`).
- Don't run destructive commands (`rm -rf`, `DROP DATABASE`, etc.) unless the user explicitly requests it.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `Missing config file: ...remote.config` | User must create `remote.config` (copy from example and fill in values). |
| First run hangs on "Installing Posh-SSH" | Posh-SSH should auto-install. If stuck, run manually: `Install-Module Posh-SSH -Scope CurrentUser -Force -AllowClobber -Confirm:$false` |
| Connection timeout | Check HOST/IP, firewall (port 22), and that the droplet is running. |
| Auth failed | User should verify USER/PASSWORD or KEY_PATH in `remote.config`. |
| `Command cannot be empty` | Pass a command string as the first argument. |

---

## Human setup (one-time)

```powershell
cd scripts\remote
copy remote.config.example remote.config
# Edit remote.config with HOST, USER, PASSWORD (or KEY_PATH), PORT
```

Test:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File "scripts/remote/remote-exec.ps1" "uname -a && free -h"
```

Expected: Linux kernel info and memory table.
