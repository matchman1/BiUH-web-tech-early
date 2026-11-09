@echo off
setlocal EnableExtensions

REM ============================================================
REM  serve.bat  --  start a local web server for this site
REM
REM  Why this is needed:
REM    The pages load nav.html / footer.html with fetch().
REM    Browsers block fetch() on file:// URLs (CORS), so opening
REM    index.html by double-clicking will show NO nav and NO footer.
REM    fetch needs a real HTTP server -- that is the whole reason
REM    this file exists.
REM
REM  Usage: double-click this file. Keep the window open while you
REM         are looking at the site. Close it to stop.
REM
REM  Site address:  http://127.0.0.1:8000/index.html
REM
REM  Called with the argument "hidden" (by serve-hidden.vbs) it runs
REM  without waiting at the final pause, so no invisible cmd.exe is
REM  left behind after stop-server.bat.
REM
REM  Three things that used to break this file, fixed here:
REM    1. The site root is the PARENT of this serve\ folder, because
REM       index.html and the nav/footer partials live up there.
REM    2. Windows ships a fake python.exe in ...\WindowsApps that
REM       only opens the Microsoft Store. It is skipped below;
REM       otherwise "python -m http.server" silently does nothing.
REM    3. If no usable Python is installed, Node.js runs serve.js
REM       instead (no packages, nothing to download).
REM ============================================================

title Local server - BiUH-web  (close this window to stop)

set "PORT=8000"

set "PAUSE_AT_END=1"
if /i "%~1"=="hidden" set "PAUSE_AT_END=0"

REM Site root = parent folder of this script.
for %%I in ("%~dp0..") do set "ROOT=%%~fI"

cd /d "%ROOT%"

echo.
echo   Serving folder: %ROOT%
echo   Open this in your browser:
echo.
echo       http://127.0.0.1:%PORT%/index.html
echo.
echo   Keep this window open while browsing.
echo   Press Ctrl+C or just close this window to stop the server.
echo.

REM --- look for a REAL python: skip the WindowsApps store stub ---
set "PY="
for /f "delims=" %%P in ('where python 2^>nul') do (
    echo %%P | find /i "WindowsApps" >nul
    if errorlevel 1 if not defined PY set "PY=%%P"
)

if not defined PY (
    for /f "delims=" %%P in ('where py 2^>nul') do (
        if not defined PY set "PY=%%P"
    )
)

if defined PY (
    echo   Server engine: Python
    echo   Python exe   : %PY%
    echo.
    "%PY%" -m http.server %PORT% --bind 127.0.0.1 --directory "%ROOT%"
    if not errorlevel 1 goto server_stopped
    echo.
    echo   Python could not start the server. Trying Node.js ...
    echo.
)

where node >nul 2>nul
if errorlevel 1 goto no_engine

echo   Server engine: Node.js
echo.
node "%~dp0serve.js" "%ROOT%" %PORT%
goto server_stopped

:no_engine
echo.
echo   ERROR: no usable Python and no Node.js found on PATH.
echo.
echo   Install either one, then run this file again:
echo       Python  https://www.python.org/downloads/windows/
echo       Node.js https://nodejs.org/
echo.
goto done

:server_stopped
echo.
echo   Server stopped.

:done
echo.
if "%PAUSE_AT_END%"=="1" pause
endlocal
