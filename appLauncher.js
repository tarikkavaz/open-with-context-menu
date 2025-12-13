const { exec } = require('child_process');
const path = require('path');

/**
 * Launches an external application with a file on the current platform
 * @param {string} appName - Application name (for macOS app bundle, Windows/Linux executable name)
 * @param {string} appPath - Full path to application executable (optional, takes precedence over appName)
 * @param {string} filePath - Path to the file to open
 * @returns {Promise<void>}
 */
function launchApp(appName, appPath, filePath) {
  return new Promise((resolve, reject) => {
    const platform = process.platform;
    let command;

    // Normalize file path for the platform
    const normalizedFilePath = path.normalize(filePath);

    if (appPath) {
      // Use provided path
      if (platform === 'win32') {
        // Windows: use start command
        const escapedAppPath = appPath.replace(/"/g, '""');
        const escapedFilePath = normalizedFilePath.replace(/"/g, '""');
        command = `start "" "${escapedAppPath}" "${escapedFilePath}"`;
      } else if (platform === 'darwin') {
        // macOS: use open command with path
        const escapedAppPath = appPath.replace(/"/g, '\\"');
        const escapedFilePath = normalizedFilePath.replace(/"/g, '\\"');
        command = `open -a "${escapedAppPath}" "${escapedFilePath}"`;
      } else {
        // Linux: execute directly
        const escapedAppPath = appPath.replace(/"/g, '\\"');
        const escapedFilePath = normalizedFilePath.replace(/"/g, '\\"');
        command = `"${escapedAppPath}" "${escapedFilePath}"`;
      }
    } else if (appName) {
      // Use app name
      if (platform === 'win32') {
        // Windows: try to find and launch by name
        // First try with .exe extension
        const appNameWithExt = appName.endsWith('.exe') ? appName : `${appName}.exe`;
        const escapedFilePath = normalizedFilePath.replace(/"/g, '""');
        command = `start "" "${appNameWithExt}" "${escapedFilePath}"`;
      } else if (platform === 'darwin') {
        // macOS: use open -a with app bundle name
        const escapedAppName = appName.replace(/"/g, '\\"');
        const escapedFilePath = normalizedFilePath.replace(/"/g, '\\"');
        command = `open -a "${escapedAppName}" "${escapedFilePath}"`;
      } else {
        // Linux: try to execute app name directly, fallback to xdg-open
        const escapedAppName = appName.replace(/"/g, '\\"');
        const escapedFilePath = normalizedFilePath.replace(/"/g, '\\"');
        // Try executing the app name directly first
        // If that fails, xdg-open will be used as fallback
        command = `"${escapedAppName}" "${escapedFilePath}" 2>/dev/null || xdg-open "${escapedFilePath}"`;
      }
    } else {
      reject(new Error('Either appName or appPath must be provided'));
      return;
    }

    exec(command, (error, stdout, stderr) => {
      if (error) {
        // On Linux with appName, the command uses || fallback, so check exit code
        if (platform === 'linux' && !appPath && appName) {
          // If exit code is 0 or 1 (common for || fallback), consider it success
          if (error.code === 0 || error.code === 1) {
            resolve();
            return;
          }
        }
        reject(new Error(`Failed to launch application: ${error.message}`));
        return;
      }
      resolve();
    });
  });
}

module.exports = {
  launchApp
};
