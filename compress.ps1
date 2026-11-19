Add-Type -AssemblyName System.Drawing

function Compress-Jpg($source, $dest, $quality) {
    $img = [System.Drawing.Bitmap]::FromFile($source)
    $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
    $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [int64]$quality)
    $destTemp = $dest + ".tmp.jpg"
    $img.Save($destTemp, $codec, $encoderParams)
    $img.Dispose()
    Move-Item -Force $destTemp $dest
    $size = (Get-Item $dest).Length
    Write-Host "Saved $dest ($([math]::Round($size/1024, 1)) KB)"
}

Compress-Jpg "assets\1000093992.jpg" "assets\1000093992.jpg" 70
Compress-Jpg "assets\1000093992.jpg" "assets\preview.jpg" 70

