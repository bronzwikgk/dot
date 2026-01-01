# Manifest for tauri-cli.sh

## Description

`tauri-cli.sh` is a bash script that provides a command-line interface (CLI) for scaffolding, developing, and building [Tauri](https://tauri.app/) applications. It simplifies the process of creating a new Tauri project and includes options for building for both desktop (Windows, macOS, Linux) and Android.

The script also features a built-in, self-contained HTML/CSS/JS single-page application (SPA) that serves as a VSCode-like shell for the Tauri app.

## Features

- **Cross-Platform:** Designed to run on Linux, macOS, and Windows (with WSL).
- **Menu-Driven:** An easy-to-use menu to navigate through the available options.
- **Project Scaffolding:** Creates a new Tauri project with the necessary file structure.
- **Embedded SPA:** Injects a pre-built VSCode-like HTML shell into the project.
- **Desktop Development:** Run the Tauri app in development mode.
- **Desktop Build:** Build the final desktop installer.
- **Android Development:** Initialize and run the app on a connected Android device.
- **Android Build:** Build the Android APK.
- **Environment Check:** Verifies that all the required dependencies (Rust, Cargo, npm) are installed.

## Dependencies

- **bash:** The script is a bash script and needs a bash-compatible shell to run.
- **Rust & Cargo:** Required for building the Tauri backend.
- **npm:** Optional, but recommended for managing frontend dependencies.
- **Tauri CLI:** The script can install the Tauri CLI if it's not already present.
- **jq:** Optional, used for parsing JSON configuration. `sed` is used as a fallback.

## File Structure

When a new project is created, it will have the standard Tauri project structure. The script interacts with the following key files:

- `config.txt`: A configuration file created by the script to store the project name.
- `index.html`: The embedded SPA that is injected into the project.
- `src-tauri/tauri.conf.json`: The main Tauri configuration file.

## Functions

### `save_config()`

Saves the project name to `config.txt`.

### `check_env()`

Checks if Rust, Cargo, and npm are installed and available in the system's PATH.

### `show_menu()`

Displays the main menu of the script.

### `create_project()`

Prompts the user for a project name and creates a new Tauri project.

### `insert_html()`

Replaces the default Tauri frontend with the embedded VSCode-like SPA.

### `run_desktop()`

Starts the Tauri development server for desktop.

### `build_desktop()`

Builds the desktop installer for the current platform.

### `init_android()`

Initializes the Android project and sets up the necessary dependencies.

### `run_android()`

Runs the app in development mode on a connected Android device.

### `build_android()`

Builds the Android APK.

## Usage

1.  Make the script executable: `chmod +x tauri-cli.sh`
2.  Run the script: `./tauri-cli.sh`
3.  Follow the on-screen menu to create and manage your Tauri application.
