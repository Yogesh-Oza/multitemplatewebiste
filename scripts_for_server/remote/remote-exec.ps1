#Requires -Version 5.1
<#
.SYNOPSIS
  Run a shell command on a remote server over SSH.

.DESCRIPTION
  Reads connection details from remote.config (same folder as this script).
  Uses Posh-SSH for password auth, or native ssh when KEY_PATH is set.

.EXAMPLE
  .\remote-exec.ps1 "uname -a"

.EXAMPLE
  .\remote-exec.ps1 "cd /var/www/svkk && docker compose ps"

.EXAMPLE
  Get-Content .\deploy.sh | .\remote-exec.ps1 -Stdin
#>
[CmdletBinding()]
param(
    [Parameter(Position = 0, ValueFromRemainingArguments = $true)]
    [string[]] $CommandParts,

    [switch] $Stdin,
    [string] $ConfigPath
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Get-RemoteConfig {
    param([string] $Path)

    if (-not (Test-Path -LiteralPath $Path)) {
        throw @"
Missing config file: $Path

1. Copy remote.config.example to remote.config
2. Set HOST, USER, PASSWORD (or KEY_PATH), and PORT
"@
    }

    $config = @{}
    Get-Content -LiteralPath $Path | ForEach-Object {
        $line = $_.Trim()
        if ($line -eq "" -or $line.StartsWith("#")) {
            return
        }

        $eq = $line.IndexOf("=")
        if ($eq -lt 1) {
            return
        }

        $key = $line.Substring(0, $eq).Trim()
        $value = $line.Substring($eq + 1).Trim()
        $config[$key] = $value
    }

    foreach ($required in @("HOST", "USER")) {
        if (-not $config.ContainsKey($required) -or [string]::IsNullOrWhiteSpace($config[$required])) {
            throw "remote.config is missing required setting: $required"
        }
    }

    if (-not $config.ContainsKey("PORT") -or [string]::IsNullOrWhiteSpace($config["PORT"])) {
        $config["PORT"] = "22"
    }

    $hasPassword = $config.ContainsKey("PASSWORD") -and -not [string]::IsNullOrWhiteSpace($config["PASSWORD"])
    $hasKey = $config.ContainsKey("KEY_PATH") -and -not [string]::IsNullOrWhiteSpace($config["KEY_PATH"])

    if (-not $hasPassword -and -not $hasKey) {
        throw "remote.config must set PASSWORD or KEY_PATH"
    }

    return $config
}

function Ensure-PoshSshModule {
    if (Get-Module -ListAvailable -Name Posh-SSH) {
        Import-Module Posh-SSH -ErrorAction Stop
        return
    }

    Write-Host "Installing Posh-SSH module (one-time setup)..." -ForegroundColor Yellow

    if (-not (Get-PackageProvider -Name NuGet -ListAvailable -ErrorAction SilentlyContinue)) {
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
        Install-PackageProvider -Name NuGet -MinimumVersion 2.8.5.201 -Force -Scope CurrentUser | Out-Null
    }

    $gallery = Get-PSRepository -Name PSGallery -ErrorAction SilentlyContinue
    if ($gallery -and $gallery.InstallationPolicy -ne "Trusted") {
        Set-PSRepository -Name PSGallery -InstallationPolicy Trusted
    }

    Install-Module -Name Posh-SSH -Scope CurrentUser -Force -AllowClobber -Confirm:$false
    Import-Module Posh-SSH -ErrorAction Stop
}

function Invoke-RemoteWithKey {
    param(
        [hashtable] $Config,
        [string] $Command
    )

    $keyPath = $Config["KEY_PATH"]
    if (-not (Test-Path -LiteralPath $keyPath)) {
        throw "SSH key not found: $keyPath"
    }

    $sshArgs = @(
        "-i", $keyPath,
        "-p", $Config["PORT"],
        "-o", "StrictHostKeyChecking=accept-new",
        "-o", "BatchMode=yes",
        "$($Config['USER'])@$($Config['HOST'])",
        $Command
    )

    & ssh @sshArgs
    exit $LASTEXITCODE
}

function Invoke-RemoteWithPassword {
    param(
        [hashtable] $Config,
        [string] $Command
    )

    Ensure-PoshSshModule

    $securePassword = ConvertTo-SecureString $Config["PASSWORD"] -AsPlainText -Force
    $credential = New-Object System.Management.Automation.PSCredential($Config["USER"], $securePassword)

    $session = New-SSHSession `
        -ComputerName $Config["HOST"] `
        -Port ([int]$Config["PORT"]) `
        -Credential $credential `
        -AcceptKey `
        -ErrorAction Stop

    try {
        $result = Invoke-SSHCommand -SessionId $session.SessionId -Command $Command -TimeOut 600

        if ($result.Output) {
            $result.Output | ForEach-Object { Write-Output $_ }
        }

        if ($result.Error) {
            $result.Error | ForEach-Object { Write-Error $_ }
        }

        exit ([int]$result.ExitStatus)
    }
    finally {
        Remove-SSHSession -SessionId $session.SessionId -ErrorAction SilentlyContinue | Out-Null
    }
}

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if ([string]::IsNullOrWhiteSpace($ConfigPath)) {
    $ConfigPath = Join-Path $scriptDir "remote.config"
}

$config = Get-RemoteConfig -Path $ConfigPath

if ($Stdin) {
    $command = [Console]::In.ReadToEnd().Trim()
}
elseif ($CommandParts -and $CommandParts.Count -gt 0) {
    $command = ($CommandParts -join " ").Trim()
}
else {
    throw "Provide a command, e.g. .\remote-exec.ps1 `"ls -la`""
}

if ([string]::IsNullOrWhiteSpace($command)) {
    throw "Command cannot be empty."
}

$usesKey = $config.ContainsKey("KEY_PATH") -and -not [string]::IsNullOrWhiteSpace($config["KEY_PATH"])
if ($usesKey) {
    Invoke-RemoteWithKey -Config $config -Command $command
}
else {
    Invoke-RemoteWithPassword -Config $config -Command $command
}
