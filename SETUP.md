# CivIQ Development Environment Setup Guide

## 📌 Overview
This guide explains how to set up your CivIQ development environment using the provided batch script (`setup.bat`). The script automates the installation of necessary VS Code extensions, configures VS Code settings, and assists with Git authentication.

---

## 🔧 **Running the Setup Script**

### **Step 1: Download & Run the Script**
1. Download `setup.bat` and place it in your project folder.
2. Right-click the script and select **"Run as Administrator"** to ensure it has the necessary permissions.
3. The script will:
   - Install all required VS Code extensions.
   - Configure VS Code settings.
   - Set up Git authentication and generate an SSH key (if not already present).

### **Step 2: Manually Add SSH Key to GitHub**
If prompted by the script:
1. Go to **GitHub → Settings → SSH and GPG Keys**.
2. Click **New SSH Key**.
3. Paste the SSH key (copied to your clipboard by the script).
4. Save the key.
5. Test the connection by running:
   ```sh
   ssh -T git@github.com
   ```

---

## 📦 **What The Script Automates**

### **1️⃣ VS Code Extensions**
The script installs the following extensions:
- Git & GitHub:
  - GitHub Pull Requests and Issues
  - GitLens
  - Git Graph
- Code Formatting & Linting:
  - Prettier - Code Formatter
  - ESLint
- Web Development:
  - Tailwind CSS IntelliSense
  - React Developer Tools
- Collaboration:
  - Live Share
- Documentation:
  - Markdown All in One

### **2️⃣ VS Code Settings**
The script automatically configures VS Code settings, including:
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.autoSave": "afterDelay",
  "editor.tabSize": 2,
  "editor.detectIndentation": false,
  "terminal.integrated.defaultProfile.windows": "Git Bash",
  "git.autofetch": true,
  "eslint.alwaysShowStatus": true
}
```

### **3️⃣ Git Authentication Setup**
- Generates a new SSH key if none exists.
- Configures Git global settings for username and email.
- Copies the SSH public key to the clipboard for easy GitHub setup.

---

## ✅ **Final Steps**
After running the script and adding the SSH key to GitHub:
1. Open **VS Code**.
2. Open the **terminal** and navigate to your project folder.
3. Clone your repository:
   ```sh
   git clone git@github.com:YourUsername/YourRepo.git
   ```

Your CivIQ development environment is now ready! 🚀

For any issues, check the script output or reach out to the development team.
