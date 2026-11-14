#Requires -Version 5.1
<#
.SYNOPSIS
  Upload a local file to the remote server over SCP.

.EXAMPLE
  .\remote-upload.ps1 "C:\backups\dump.sql" "/tmp/dump.sql"
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory = $true, Position = 0)]
    [string] $LocalPath,

    [Parameter(Mandatory = $true, Position = 1)]
    [string] $RemotePath,

    [string] $ConfigPath
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Get-RemoteConfig {
    param([string] $Path)

    if (-not (Test-Path -LiteralPath $Path)) {
        throw "Missing config file: $Path"
    }

    $config = @{}
    Get-Content -LiteralPath $Path | ForEach-Object {
        $line = $_.Trim()
        if ($line -eq "" -or $line.StartsWith("#")) { return }
        $eq = $line.IndexOf("=")
        if ($eq -lt 1) { return }
        $config[$line.Substring(0, $eq).Trim()] = $line.Substring($eq + 1).Trim()
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
    Install-Module -Name Posh-SSH -Scope CurrentUser -Force -AllowClobber -Confirm:$false
    Import-Module Posh-SSH -ErrorAction Stop
}

if (-not (Test-Path -LiteralPath $LocalPath)) {
    throw "Local file not found: $LocalPath"
}

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if ([string]::IsNullOrWhiteSpace($ConfigPath)) {
    $ConfigPath = Join-Path $scriptDir "remote.config"
}

$config = Get-RemoteConfig -Path $ConfigPath
$usesKey = $config.ContainsKey("KEY_PATH") -and -not [string]::IsNullOrWhiteSpace($config["KEY_PATH"])

if ($usesKey) {
    $keyPath = $config["KEY_PATH"]
    if (-not (Test-Path -LiteralPath $keyPath)) {
        throw "SSH key not found: $keyPath"
    }
    & scp -i $keyPath -P $config["PORT"] -o StrictHostKeyChecking=accept-new $LocalPath "$($config['USER'])@$($config['HOST']):$RemotePath"
    exit $LASTEXITCODE
}

Ensure-PoshSshModule
$securePassword = ConvertTo-SecureString $config["PASSWORD"] -AsPlainText -Force
$credential = New-Object System.Management.Automation.PSCredential($config["USER"], $securePassword)

Set-SCPItem `
    -ComputerName $config["HOST"] `
    -Port ([int]$config["PORT"]) `
    -Credential $credential `
    -Path $LocalPath `
    -Destination $RemotePath `
    -AcceptKey `
    -ConnectionTimeout 120 `
    -OperationTimeout 600
Write-Host "Uploaded $LocalPath -> $($config['HOST']):$RemotePath"
