@echo off
:: CivIQ Development Environment Setup Script
:: This script installs required VS Code extensions, configures settings, and assists with Git authentication.

:: Enable command extensions
setlocal enableextensions

:: Print a welcome message
echo ==========================================
echo  CivIQ Development Environment Setup
echo ==========================================

echo.
echo Installing Required VS Code Extensions...
code --install-extension GitHub.vscode-pull-request-github
code --install-extension eamodio.gitlens
code --install-extension mhutchie.git-graph
code --install-extension esbenp.prettier-vscode
code --install-extension usernamehw.errorlens
code --install-extension dbaeumer.vscode-eslint
code --install-extension ms-python.python
code --install-extension MS-vsliveshare.vsliveshare
code --install-extension MS-vsliveshare.vsliveshare-audio
code --install-extension bradlc.vscode-tailwindcss
code --install-extension dsznajder.es7-react-js-snippets
code --install-extension rangav.vscode-thunder-client
code --install-extension yzhang.markdown-all-in-one
code --install-extension bierner.github-markdown-preview
code --install-extension ms-azuretools.vscode-docker
code --install-extension ms-vscode-remote.remote-ssh

echo.
echo VS Code Extensions Installed!

echo.
echo Configuring VS Code Settings...
:: Write the settings.json file
mkdir "%APPDATA%\Code\User" 2>nul
( echo {
  echo   "editor.formatOnSave": true,
  echo   "editor.codeActionsOnSave": {
  echo     "source.fixAll.eslint": true
  echo   },
  echo   "files.autoSave": "afterDelay",
  echo   "editor.tabSize": 2,
  echo   "editor.detectIndentation": false,
  echo   "terminal.integrated.defaultProfile.windows": "Git Bash",
  echo   "git.autofetch": true,
  echo   "eslint.alwaysShowStatus": true
  echo } ) > "%APPDATA%\Code\User\settings.json"

echo.
echo VS Code Settings Configured!

echo.
echo Setting Up Git Authentication...
:: Generate SSH key if not present
if not exist "%USERPROFILE%\.ssh\id_rsa" (
    ssh-keygen -t rsa -b 4096 -C "your-email@example.com" -f "%USERPROFILE%\.ssh\id_rsa" -N ""
    echo.
    echo SSH Key Generated. Add it to GitHub under SSH keys in settings.
    echo.
    echo Copying public key to clipboard...
    type "%USERPROFILE%\.ssh\id_rsa.pub" | clip
    echo Public key copied. Go to GitHub > Settings > SSH and GPG Keys and paste it.
    pause
) else (
    echo SSH Key already exists.
)

echo.
echo Configuring Git User Info...
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
git config --global credential.helper store
echo.
echo Git Configured!

echo.
echo CivIQ Development Environment Setup Complete!
pause
exit
