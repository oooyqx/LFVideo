@echo off
cd /d "%~dp0\..\OpenMontage\remotion-composer"
echo Starting Remotion Studio...
start "" http://localhost:3000
npm start
pause
