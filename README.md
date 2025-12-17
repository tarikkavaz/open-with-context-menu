# Open With Context Menu

A VS Code extension that adds context menu items to open files with external applications. Configure multiple apps and associate them with specific file types.

## Features

- Add multiple external applications to the context menu
- Associate apps with specific file types (extensions or filenames)
- Cross-platform support (Windows, macOS, Linux)
- Support for both app names and full executable paths
- Automatic app selection when only one matches, or quick pick menu for multiple matches
- Configuration via VS Code settings (UI or JSON)

## Installation

1. Open VS Code
2. Go to Extensions view (Ctrl+Shift+X / Cmd+Shift+X)
3. Search for "Open With Context Menu"
4. Click Install

Or install from the command line:
```bash
code --install-extension Tarik.open-with-context-menu
```

## Configuration

Configure apps and file type associations in VS Code settings:

1. Open Settings (Ctrl+, / Cmd+,)
2. Search for "Open With Context Menu"
3. Click "Edit in settings.json" to configure apps

### Configuration Format

```json
{
  "openWithContextMenu.apps": [
    {
      "name": "Typora",
      "appName": "Typora",
      "appPath": "",
      "fileTypes": [".md", ".markdown", ".cursorrules"]
    },
    {
      "name": "Sublime Text",
      "appName": "",
      "appPath": "/Applications/Sublime Text.app/Contents/SharedSupport/bin/subl",
      "fileTypes": [".js", ".ts", ".json"]
    }
  ]
}
```

### Configuration Properties

- **name** (required): Display name shown in the context menu
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

### Platform-Specific Notes

#### macOS
- Use `appName` with the app bundle name (e.g., "Typora", "Sublime Text")
- Or use `appPath` pointing to the `.app` bundle or executable inside it
- Example: `"/Applications/Typora.app"` or `"/Applications/Typora.app/Contents/MacOS/Typora"`

#### Windows
- Use `appName` for common apps (e.g., "notepad", "code")
- Or use `appPath` with full path to `.exe` file
- Example: `"C:\\Program Files\\Typora\\Typora.exe"`

#### Linux
- `appName` may work for some apps via `xdg-open`, but `appPath` is more reliable
- Use `appPath` with full path to executable
- Example: `"/usr/bin/gedit"` or `"/usr/local/bin/code"`

## Usage

1. Right-click on a file in the Explorer or Editor
2. Select "Open with External App" from the context menu
3. If multiple apps are configured for the file type, a quick pick menu will appear
4. If only one app matches, it will open directly

## Examples

### Example 1: Open Markdown Files with Typora

```json
{
  "openWithContextMenu.apps": [
    {
      "name": "Typora",
      "appName": "Typora",
      "appPath": "",
      "fileTypes": [".md", ".markdown"]
    }
  ]
}
```

### Example 2: Open Code Files with Sublime Text (macOS)

```json
{
  "openWithContextMenu.apps": [
    {
      "name": "Sublime Text",
      "appName": "",
      "appPath": "/Applications/Sublime Text.app/Contents/SharedSupport/bin/subl",
      "fileTypes": [".js", ".ts", ".jsx", ".tsx", ".json", ".py"]
    }
  ]
}
```

### Example 3: Multiple Apps for Same File Type

```json
{
  "openWithContextMenu.apps": [
    {
      "name": "Typora",
      "appName": "Typora",
      "fileTypes": [".md"]
    },
    {
      "name": "VS Code",
      "appName": "code",
      "fileTypes": [".md"]
    }
  ]
}
```

When right-clicking a `.md` file, you'll see a quick pick menu to choose between Typora and VS Code.

## Requirements

- VS Code 1.60.0 or higher

## Known Issues

- Menu items are static and defined in `package.json`. After changing configuration, commands work immediately, but you may need to reload the window for menu visibility changes.
- On Linux, `appName` may not work reliably for all applications. Use `appPath` for best results.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
