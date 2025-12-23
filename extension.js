const vscode = require('vscode');
const { launchApp } = require('./appLauncher');
const path = require('path');

let registeredCommands = [];
let mainCommand = null;

/**
 * Validates app configuration
 */
function validateAppConfig(app, index) {
  if (!app.name || typeof app.name !== 'string') {
    return `App at index ${index}: 'name' is required and must be a string`;
  }
  if (!app.fileTypes || !Array.isArray(app.fileTypes) || app.fileTypes.length === 0) {
    return `App '${app.name}': 'fileTypes' is required and must be a non-empty array`;
  }
  if (!app.appName && !app.appPath) {
    return `App '${app.name}': either 'appName' or 'appPath' must be provided`;
  }
  return null;
}

/**
 * Checks if a file matches any of the configured file types
 */
function matchesFileType(filePath, fileName, languageId, fileTypes) {
  for (const fileType of fileTypes) {
    // Check file extension
    if (fileType.startsWith('.')) {
      const ext = path.extname(filePath).toLowerCase();
      if (ext === fileType.toLowerCase()) {
        return true;
      }
      // Check exact filename (e.g., ".cursorrules")
      if (fileName === fileType) {
        return true;
      }
    } else if (fileName === fileType || fileName.endsWith(fileType)) {
      return true;
    }
    // Check language ID for editor context
    if (languageId && fileType === languageId) {
      return true;
    }
  }
  return false;
}

/**
 * Gets the file path from URI or active editor
 */
function getFilePath(uri) {
  if (uri && uri.fsPath) {
    return uri.fsPath;
  }
  const activeEditor = vscode.window.activeTextEditor;
  if (activeEditor) {
    return activeEditor.document.fileName;
  }
  return null;
}

/**
 * Gets all apps that match the current file
 */
function getMatchingApps(apps, filePath, fileName, languageId) {
  if (!apps || !Array.isArray(apps)) {
    return [];
  }

  return apps
    .map((app, index) => ({ app, index }))
    .filter(({ app }) => {
      const validationError = validateAppConfig(app, 0);
      if (validationError) {
        return false;
      }
      return matchesFileType(filePath, fileName, languageId, app.fileTypes);
    })
    .map(({ app, index }) => ({ ...app, originalIndex: index }));
}

/**
 * Registers the main open command
 * This command dynamically shows app names based on configuration
 */
function registerOpenCommand(context, apps) {
  // Dispose existing main command
  if (mainCommand) {
    mainCommand.dispose();
    mainCommand = null;
  }

  const command = vscode.commands.registerCommand('openWithContextMenu.open', async (uri) => {
    const filePath = getFilePath(uri);
    if (!filePath) {
      vscode.window.showErrorMessage('No file selected.');
      return;
    }

    const fileName = path.basename(filePath);
    const languageId = vscode.window.activeTextEditor?.document.languageId;

    // Get current configuration
    const config = vscode.workspace.getConfiguration('openWithContextMenu');
    const currentApps = config.get('apps', []);

    // Find matching apps
    const matchingApps = getMatchingApps(currentApps, filePath, fileName, languageId);

    if (matchingApps.length === 0) {
      vscode.window.showInformationMessage('No apps configured for this file type.');
      return;
    }

    let selectedApp;
    if (matchingApps.length === 1) {
      // Only one match, use it directly and show which app
      selectedApp = matchingApps[0];
      vscode.window.setStatusBarMessage(`Opening with ${selectedApp.name}...`, 2000);
    } else {
      // Multiple matches, show quick pick with "Open With [AppName]" format
      const items = matchingApps.map(app => ({
        label: `Open With ${app.name}`,
        description: app.appPath || app.appName || '',
        app: app
      }));

      const selected = await vscode.window.showQuickPick(items, {
        placeHolder: 'Select an application to open this file'
      });

      if (!selected) {
        return; // User cancelled
      }

      selectedApp = selected.app;
    }

    try {
      await launchApp(selectedApp.appName || '', selectedApp.appPath || '', filePath);
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to open with ${selectedApp.name}: ${error.message}`);
    }
  });

  mainCommand = command;
  context.subscriptions.push(command);
}

/**
 * Registers individual commands for each app with "Open With [AppName]" titles
 * These commands can be used directly from command palette
 */
function registerAppCommands(context, apps) {
  // Dispose existing app commands (keep the main command)
  registeredCommands.forEach(cmd => cmd.dispose());
  registeredCommands = [];

  if (!apps || !Array.isArray(apps) || apps.length === 0) {
    return;
  }

  apps.forEach((app, index) => {
    const validationError = validateAppConfig(app, index);
    if (validationError) {
      vscode.window.showWarningMessage(`Open Files Externally: ${validationError}`);
      return;
    }

    // Create a unique command ID for this app
    const commandId = `openWithContextMenu.openApp.${index}`;

    // Register command with title including app name
    const command = vscode.commands.registerCommand(commandId, async (uri) => {
      const filePath = getFilePath(uri);
      if (!filePath) {
        vscode.window.showErrorMessage('No file selected.');
        return;
      }

      const fileName = path.basename(filePath);
      const languageId = vscode.window.activeTextEditor?.document.languageId;

      // Verify file type matches
      if (!matchesFileType(filePath, fileName, languageId, app.fileTypes)) {
        vscode.window.showErrorMessage(`This command only works with: ${app.fileTypes.join(', ')}`);
        return;
      }

      try {
        await launchApp(app.appName || '', app.appPath || '', filePath);
      } catch (error) {
        vscode.window.showErrorMessage(`Failed to open with ${app.name}: ${error.message}`);
      }
    });

    registeredCommands.push(command);
    context.subscriptions.push(command);
  });
}

function activate(context) {
  console.log('Open Files Externally: Extension activating...');
  
  // Load initial configuration
  const config = vscode.workspace.getConfiguration('openWithContextMenu');
  const apps = config.get('apps', []);

  console.log(`Open Files Externally: Found ${apps.length} app(s) configured`);

  // Register main command
  registerOpenCommand(context, apps);

  // Register individual app commands
  registerAppCommands(context, apps);
  
  console.log('Open Files Externally: Extension activated successfully');

  // Watch for configuration changes
  const configWatcher = vscode.workspace.onDidChangeConfiguration(e => {
    if (e.affectsConfiguration('openWithContextMenu.apps')) {
      const newConfig = vscode.workspace.getConfiguration('openWithContextMenu');
      const newApps = newConfig.get('apps', []);
      registerAppCommands(context, newApps);
      // Note: Menu items in package.json are static, so users need to reload
      // But commands will work immediately
    }
  });

  context.subscriptions.push(configWatcher);
}

function deactivate() {
  if (mainCommand) {
    mainCommand.dispose();
    mainCommand = null;
  }
  registeredCommands.forEach(cmd => cmd.dispose());
  registeredCommands = [];
}

module.exports = {
  activate,
  deactivate
};
