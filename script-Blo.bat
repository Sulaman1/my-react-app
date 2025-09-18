@echo off


REM Set the URL for Google Chrome
set "CHROME_URL=https://pmis-bl/"

REM Launch Google Chrome with the specified URL
echo Launching...
start "" "%CHROME_URL%"

REM Launch the application
echo Launching your application...
cd "C:\Program Files\nodejs"
node server.js

echo Done!

REM Pause to keep the console window open for a moment
pause