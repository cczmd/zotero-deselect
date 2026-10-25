# Zotero Deselect

**Click empty space to deselect — just like Finder and Windows File Explorer.**

[English](README.md) | [简体中文](README.zh-CN.md)

![Zotero Deselect demo](assets/demo.gif)

## What it does

Zotero Deselect brings familiar desktop file-manager deselection behavior to Zotero's item list and collection pane.

## Why

Finder and Windows File Explorer users are used to clicking empty space after selecting files to clear the selection. Zotero's default behavior differs from this familiar desktop interaction. Zotero Deselect restores that familiar way of working.

## Features

- Click empty space in the center item list to clear the current selection.
- Click the only selected item again to deselect it.
- Clear the residual blue dotted focus outline after deselection.
- Click empty space in the left collection pane to hide the current collection's blue highlight while keeping its contents displayed.
- Click any collection again to restore Zotero's native collection selection behavior.
- Keep Zotero's native Cmd/Ctrl/Shift multi-selection workflows unchanged.

## Installation

1. Download the `.xpi` file from the [latest GitHub Release](https://github.com/cczmd/zotero-deselect/releases/latest).
2. In Zotero, open **Tools → Plugins**.
3. Open the gear menu and choose **Install Add-on From File…**.
4. Select the downloaded `.xpi` file.

## Compatibility

Tested with **Zotero 10.0.6 on macOS**.

The manifest declares compatibility with Zotero 10.0.x (`10.0` through `10.0.*`). Other platforms and versions have not yet been tested. The Finder and Windows File Explorer references describe the intended interaction, not additional tested platforms.

## How it works

The plugin listens for primary-button clicks in Zotero's item list and collection pane. When a click lands on empty space, it clears the relevant visual selection state while preserving Zotero's normal browsing behavior. In the collection pane, the current collection remains active internally so the displayed items do not change.

## License

[MIT License](LICENSE). Copyright (c) 2026 Zotero Deselect contributors.
