# Open Files Externally

A VS Code extension that adds context menu items to open files with external applications. Configure multiple apps and associate them with specific file types.

## Features

- **Multiple Applications**: Add multiple external applications to the context menu
- **File Type Associations**: Associate apps with specific file types (extensions or filenames)
- **Cross-Platform**: Full support for Windows, macOS, and Linux
- **Flexible Configuration**: Support for both app names and full executable paths
- **Smart Selection**: Automatic app selection when only one matches, or quick pick menu for multiple matches
- **Easy Setup**: Configuration via VS Code settings (UI or JSON)
- **Command Palette**: Commands available in Command Palette for quick access

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
  - [Configuration Format](#configuration-format)
  - [Configuration Properties](#configuration-properties)
  - [Platform-Specific Notes](#platform-specific-notes)
- [Usage](#usage)
- [Examples](#examples)
- [Requirements](#requirements)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)
- [Known Issues](#known-issues)
- [Contributing](#contributing)
- [Support](#support)
- [License](#license)

## Installation

### Via VS Code Extensions Marketplace

1. Open VS Code
2. Go to Extensions view (`Ctrl+Shift+X` / `Cmd+Shift+X`)
3. Search for "Open Files Externally"
4. Click Install

### Via Command Line (VS Code)

For Visual Studio Code (Microsoft Marketplace):

```bash
code --install-extension tarikkavaz.open-with-context-menu
```

### Via Open VSX Registry

For VSCodium or other VS Code forks using Open VSX Registry:

```bash
codium --install-extension tarikkavaz.open-with-context-menu
```

Or using the `ovsx` CLI tool:

```bash
ovsx install tarikkavaz.open-with-context-menu
```

You can also install directly from the [Open VSX Registry](https://open-vsx.org/extension/tarikkavaz/open-with-context-menu) in the Extensions view.

## Configuration

Configure apps and file type associations in VS Code settings:

1. Open Settings (`Ctrl+,` / `Cmd+,`)
2. Search for "Open Files Externally"
3. Click "Edit in settings.json" to configure apps

### Configuration Format

```json
{
  "openWithContextMenu.apps": [
    {
      "name": "Typora",
      "appName": "Typora",
      "fileTypes": [".md", ".markdown"]
    },
    {
      "name": "Preview",
      "appName": "Preview",
      "fileTypes": [".pdf", ".png", ".jpg"]
    }
  ]
}
```

### Configuration Properties

- **name** (required): Display name shown in the context menu and quick pick
- **appName** (optional): Application name
  - macOS: App bundle name (e.g., "Typora", "Sublime Text")
  - Windows: Executable name without extension (e.g., "notepad", "code")
  - Linux: Executable name (e.g., "gedit", "code")
- **appPath** (optional): Full path to the application executable
  - Takes precedence over `appName` if provided
  - macOS: Path to `.app` bundle or executable (e.g., "/Applications/Typora.app")
  - Windows: Path to `.exe` file (e.g., "C:\\Program Files\\App\\app.exe")
  - Linux: Path to executable (e.g., "/usr/bin/gedit")
- **fileTypes** (required): Array of file extensions (with dot) or filenames
  - Examples: `[".md", ".txt", ".cursorrules"]`
  - Can also match language IDs for editor context

**Note**: Either `appName` or `appPath` must be provided for each app configuration.

### Platform-Specific Notes

#### macOS

- Use `appName` with the app bundle name (e.g., "Typora", "Sublime Text")
- Or use `appPath` pointing to the `.app` bundle or executable inside it
- Examples:
  - `"appName": "Typora"`
  - `"appPath": "/Applications/Typora.app"`
  - `"appPath": "/Applications/Typora.app/Contents/MacOS/Typora"`

#### Windows

- Use `appName` for common apps (e.g., "notepad", "code")
- Or use `appPath` with full path to `.exe` file
- Example: `"appPath": "C:\\Program Files\\Typora\\Typora.exe"`

#### Linux

- `appName` may work for some apps via `xdg-open`, but `appPath` is more reliable
- Use `appPath` with full path to executable
- Examples:
  - `"appPath": "/usr/bin/gedit"`
  - `"appPath": "/usr/local/bin/code"`

## Usage

### Context Menu

1. Right-click on a file in the Explorer or Editor
2. Select "Open Files Externally" from the context menu
3. If multiple apps are configured for the file type, a quick pick menu will appear
4. If only one app matches, it will open directly

### Command Palette

1. Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. Type "Open Files Externally"
3. Select "Open Files Externally"
4. Choose the application from the quick pick menu

## Examples

### Using appName (macOS)

```json
{
  "openWithContextMenu.apps": [
    {
      "name": "Typora",
      "appName": "Typora",
      "fileTypes": [".md", ".markdown"]
    }
  ]
}
```

### Using appPath

```json
{
  "openWithContextMenu.apps": [
    {
      "name": "GIMP",
      "appName": "",
      "appPath": "/usr/bin/gimp",
      "fileTypes": [".png", ".jpg", ".jpeg", ".gif", ".bmp", ".xcf"]
    },
    {
      "name": "LibreOffice Writer",
      "appName": "",
      "appPath": "/usr/bin/libreoffice",
      "fileTypes": [".doc", ".docx", ".odt", ".rtf"]
    },
    {
      "name": "Okular",
      "appName": "",
      "appPath": "/usr/bin/okular",
      "fileTypes": [".pdf"]
    }
  ]
}
```

### Multiple Apps for Same File Type

When multiple apps are configured for the same file type, a quick pick menu will appear:

```json
{
  "openWithContextMenu.apps": [
    {
      "name": "Photoshop",
      "appName": "Photoshop",
      "fileTypes": [".psd"]
    },
    {
      "name": "Preview",
      "appName": "Preview",
      "fileTypes": [".psd"]
    }
  ]
}
```

## Requirements

- VS Code 1.60.0 or higher

## Troubleshooting

### App Not Found

**Problem**: You get an error that the application cannot be found.

**Solutions**:
- On macOS: Verify the app name matches the bundle name exactly (check in `/Applications` folder)
- On Windows: Use the executable name without `.exe` extension, or use `appPath` with full path
- On Linux: Use `appPath` with the full path to the executable instead of `appName`
- Check that the application is installed and accessible from the command line

### Context Menu Not Appearing

**Problem**: The "Open Files Externally" option doesn't appear in the context menu.

**Solutions**:
- Reload the VS Code window (`Ctrl+R` / `Cmd+R` or `Ctrl+Shift+P` → "Developer: Reload Window")
- Verify the extension is installed and enabled
- Check that you're right-clicking on a file (not a folder)
- Ensure you have at least one app configured in settings

### Quick Pick Menu Not Showing Apps

**Problem**: No apps appear in the quick pick menu or you get "No apps configured" message.

**Solutions**:
- Verify your configuration syntax is correct (valid JSON)
- Check that `fileTypes` array includes the extension of the file you're trying to open (with the dot, e.g., `.md`)
- Ensure either `appName` or `appPath` is provided for each app
- Check the Output panel for extension errors (`View` → `Output` → select "Open Files Externally" from dropdown)

### Path Issues on Windows

**Problem**: Paths with spaces or special characters don't work.

**Solutions**:
- Use double backslashes in JSON: `"C:\\Program Files\\App\\app.exe"`
- Or use forward slashes: `"C:/Program Files/App/app.exe"`
- Ensure the path is properly escaped in JSON

### Menu Items Not Updating After Configuration Change

**Problem**: You changed the configuration but the menu doesn't reflect the changes.

**Solutions**:
- Reload the VS Code window (`Ctrl+R` / `Cmd+R`)
- Menu items are static, but commands work immediately - use Command Palette if needed

## FAQ

### Can I use this extension with any file type?

Yes! You can configure the extension to work with any file type by adding the file extension (with dot) to the `fileTypes` array.

### How do I find the correct app name or path?

- **macOS**: The app name is usually the name of the `.app` bundle in `/Applications`. You can also right-click an app and select "Show Package Contents" to find the executable path.
- **Windows**: The app name is the executable name without `.exe`. You can find the path by right-clicking a shortcut and selecting "Properties" → "Target".
- **Linux**: Use `which <app-name>` to find the executable path, or check `/usr/bin`, `/usr/local/bin`, etc.

### Can I configure different apps for the same file type?

Yes! If multiple apps are configured for the same file type, a quick pick menu will appear when you use the context menu, allowing you to choose which app to use.

### Does the extension work with unsaved files?

No, the extension requires a file to be saved to disk before it can be opened with an external application.

### Can I use environment variables in paths?

Not currently. You must use absolute paths or app names that are available in your system PATH.

### How do I remove an app from the context menu?

Simply remove the app configuration from the `openWithContextMenu.apps` array in your settings.json file.

## Known Issues

- Menu items are static and defined in `package.json`. After changing configuration, commands work immediately, but you may need to reload the window for menu visibility changes.
- On Linux, `appName` may not work reliably for all applications. Use `appPath` for best results.

## Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository** and create your feature branch (`git checkout -b feature/AmazingFeature`)
2. **Make your changes** following the existing code style
3. **Test your changes** on multiple platforms if possible
4. **Commit your changes** with clear commit messages (`git commit -m 'Add some AmazingFeature'`)
5. **Push to the branch** (`git push origin feature/AmazingFeature`)
6. **Open a Pull Request**

### Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Open the folder in VS Code
4. Press `F5` to open a new Extension Development Host window
5. Make changes and test in the development window

### Reporting Bugs

Please use the [GitHub Issues](https://github.com/tarikkavaz/open-with-context-menu/issues) page to report bugs. Include:
- VS Code version
- Operating system
- Extension version
- Steps to reproduce
- Expected vs actual behavior

## Support

- **Issues**: [GitHub Issues](https://github.com/tarikkavaz/open-with-context-menu/issues)
- **Repository**: [GitHub Repository](https://github.com/tarikkavaz/open-with-context-menu)
- **VS Code Marketplace**: [Extension Page](https://marketplace.visualstudio.com/items?itemName=tarikkavaz.open-with-context-menu)

If you find this extension helpful, please consider giving it a star on GitHub!

## License

MIT
