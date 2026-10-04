$port = 3000
$root = $PSScriptRoot
if (-not $root) { $root = (Get-Location).Path }

$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$port/"
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
} catch {
    $port = 8080
    $prefix = "http://localhost:$port/"
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add($prefix)
    $listener.Start()
}

Write-Output "HastKala server running at http://localhost:$port/"

$mimeTypes = @{
    ".html"  = "text/html; charset=utf-8"
    ".htm"   = "text/html; charset=utf-8"
    ".css"   = "text/css; charset=utf-8"
    ".js"    = "application/javascript; charset=utf-8"
    ".json"  = "application/json; charset=utf-8"
    ".png"   = "image/png"
    ".jpg"   = "image/jpeg"
    ".jpeg"  = "image/jpeg"
    ".gif"   = "image/gif"
    ".svg"   = "image/svg+xml"
    ".ico"   = "image/x-icon"
    ".woff"  = "font/woff"
    ".woff2" = "font/woff2"
    ".ttf"   = "font/ttf"
    ".webp"  = "image/webp"
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $rawPath = [System.Uri]::UnescapeDataString($request.Url.AbsolutePath.TrimStart('/'))
        if ([string]::IsNullOrWhiteSpace($rawPath)) {
            $rawPath = "index.html"
        }

        $filePath = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($root, $rawPath))

        # Security check: prevent directory traversal outside root
        if (-not $filePath.StartsWith($root, [System.StringComparison]::OrdinalIgnoreCase)) {
            $response.StatusCode = 403
            $response.OutputStream.Close()
            continue
        }

        # Clean URL support if requested without .html
        if (-not (Test-Path -Path $filePath -PathType Leaf) -and (Test-Path -Path "$filePath.html" -PathType Leaf)) {
            $filePath = "$filePath.html"
        }

        if (Test-Path -Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mime = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
            $response.ContentType = $mime
            $response.StatusCode = 200

            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $bytes.Length

            if ($request.HttpMethod -ne "HEAD") {
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            }
        } else {
            $response.StatusCode = 404
            $notFound = [System.Text.Encoding]::UTF8.GetBytes("<h1>404 - Not Found</h1>")
            $response.ContentType = "text/html; charset=utf-8"
            $response.ContentLength64 = $notFound.Length
            if ($request.HttpMethod -ne "HEAD") {
                $response.OutputStream.Write($notFound, 0, $notFound.Length)
            }
        }

        $response.OutputStream.Close()
    }
} finally {
    if ($listener.IsListening) {
        $listener.Stop()
    }
    $listener.Close()
}
