param([string]$DockerPath = 'C:\Users\Windows\AppData\Local\Programs\DockerDesktop\resources\bin\docker.exe')
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$compose = Join-Path $root 'docker-compose.yml'
& $DockerPath compose -f $compose up -d
& $DockerPath compose -f $compose cp (Join-Path $PSScriptRoot 'schema.sql') db:/tmp/schema.sql
& $DockerPath compose -f $compose cp (Join-Path $PSScriptRoot 'seed.sql') db:/tmp/seed.sql
& $DockerPath compose -f $compose exec -T db psql -U traceability_app -d traceability -f /tmp/schema.sql
& $DockerPath compose -f $compose exec -T db psql -U traceability_app -d traceability -f /tmp/seed.sql
