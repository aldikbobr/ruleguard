# Renders the assets/logo.svg geometry to a 1024x1024 PNG with System.Drawing (no extra tools).
# If you change the logo, change both files the same way.
# Usage: powershell -File scripts/logo-png.ps1 -Out assets/logo.png
param([string]$Out = "assets/logo.png")
Add-Type -AssemblyName System.Drawing
$s = 2.0  # 512 -> 1024
$bmp = New-Object System.Drawing.Bitmap 1024, 1024
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.Clear([System.Drawing.Color]::Transparent)
function C($hex) { [System.Drawing.ColorTranslator]::FromHtml($hex) }

# rounded square background
$r = 112 * $s; $bg = New-Object System.Drawing.Drawing2D.GraphicsPath
$bg.AddArc(0, 0, 2*$r, 2*$r, 180, 90); $bg.AddArc(1024-2*$r, 0, 2*$r, 2*$r, 270, 90)
$bg.AddArc(1024-2*$r, 1024-2*$r, 2*$r, 2*$r, 0, 90); $bg.AddArc(0, 1024-2*$r, 2*$r, 2*$r, 90, 90); $bg.CloseFigure()
$g.FillPath((New-Object System.Drawing.SolidBrush (C "#0E1726")), $bg)

# shield
$sh = New-Object System.Drawing.Drawing2D.GraphicsPath
$sh.AddLine(256*$s, 84*$s, 398*$s, 136*$s); $sh.AddLine(398*$s, 136*$s, 398*$s, 246*$s)
$sh.AddBezier(398*$s, 246*$s, 398*$s, 336*$s, 338*$s, 400*$s, 256*$s, 432*$s)
$sh.AddBezier(256*$s, 432*$s, 174*$s, 400*$s, 114*$s, 336*$s, 114*$s, 246*$s)
$sh.AddLine(114*$s, 246*$s, 114*$s, 136*$s); $sh.CloseFigure()
$pen = New-Object System.Drawing.Pen (C "#F08A3C"), (30*$s); $pen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
$g.DrawPath($pen, $sh)

# two equal rule lines
$lp = New-Object System.Drawing.Pen (C "#F4F1EA"), (26*$s)
$lp.StartCap = [System.Drawing.Drawing2D.LineCap]::Round; $lp.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$g.DrawLine($lp, 188*$s, 214*$s, 324*$s, 214*$s); $g.DrawLine($lp, 188*$s, 270*$s, 324*$s, 270*$s)

# check
$cp = New-Object System.Drawing.Pen (C "#5B9BF0"), (26*$s)
$cp.StartCap = [System.Drawing.Drawing2D.LineCap]::Round; $cp.EndCap = [System.Drawing.Drawing2D.LineCap]::Round; $cp.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
$pts = [System.Drawing.PointF[]]@((New-Object System.Drawing.PointF (206*$s), (336*$s)), (New-Object System.Drawing.PointF (240*$s), (368*$s)), (New-Object System.Drawing.PointF (306*$s), (306*$s)))
$g.DrawLines($cp, $pts)

$bmp.Save($Out, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $bmp.Dispose()
"saved $Out"
