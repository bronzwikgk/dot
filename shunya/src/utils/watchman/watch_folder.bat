@echo off
setlocal enabledelayedexpansion

:: === CONFIGURATION ===
set "WATCH_FOLDER=D:\Gitlab\bronzwik_docs"
set "TRIGGER_COMMAND=clone_all_branches.bat"
set "DELAY_SECONDS=5"
set "HASH_FILE=watch_hash.txt"

:: === INIT ===
if exist "%HASH_FILE%" del /q "%HASH_FILE%"
call :generate_hash > "%HASH_FILE%"
echo Watching "%WATCH_FOLDER%" every %DELAY_SECONDS% seconds...
echo Press Ctrl+C to exit.
echo.

:loop
timeout /t %DELAY_SECONDS% >nul

:: Generate new hash
call :generate_hash > temp_hash.txt

:: Compare with previous
fc /b "%HASH_FILE%" temp_hash.txt >nul
if errorlevel 1 (
    echo Change detected at %time%!
    %TRIGGER_COMMAND%
    copy /Y temp_hash.txt "%HASH_FILE%" >nul
)

goto :loop

:: === Subroutine: generate dir hash ===
:generate_hash
dir /s /b /a:-d "%WATCH_FOLDER%" 2>nul | sort | for /f "usebackq delims=" %%F in (`more`) do (
    for %%A in ("%%F") do (
        echo %%~zA %%~tA %%F
    )
)
exit /b
