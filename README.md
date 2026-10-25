# Zotero Deselect

Click empty space to deselect — just like Finder and Windows File Explorer.

## What it does

Zotero Deselect brings familiar desktop file-manager deselection behavior to Zotero's item list and collection pane.

## Why

Finder and Windows File Explorer users are used to clicking empty space after selecting files to clear the selection. Zotero's default behavior differs from this familiar desktop file-manager interaction. Zotero Deselect restores that familiar way of working.

## Features

- Click empty space in the center item list to clear the current selection.
- Click the only selected item again to deselect it.
- Clear the residual blue dotted focus outline after deselection.
- Click empty space in the left collection pane to hide the current collection's blue highlight while keeping its contents displayed.
- Click any collection again to restore Zotero's native collection selection behavior.
- Keep Zotero's existing selection handling for other item-row clicks, including native Cmd/Ctrl/Shift multi-selection workflows.

## Installation

1. Download the `.xpi` file from the [latest GitHub Release](https://github.com/cczmd/zotero-deselect/releases/latest).
2. In Zotero, open **Tools → Plugins**.
3. Open the gear menu and choose **Install Add-on From File…**.
4. Select the downloaded `.xpi` file.

## Compatibility

Tested with Zotero 10.0.6 on macOS.

The manifest declares compatibility with Zotero 10.0.x (`10.0` through `10.0.*`). Other platforms and versions have not been tested. The Finder and Windows File Explorer references describe the intended interaction, not additional tested platforms.

## How it works

The plugin listens for primary-button `pointerdown` events in Zotero's main windows. In the item list, it clears selection when a click lands on empty space or on the only selected row, then clears the separate focus marker so a blue dotted outline does not remain.

In the collection pane, clicking empty space removes the visual selection classes. A mutation observer keeps that highlight hidden across redraws while Zotero's actual current collection stays selected internally, preserving the current item view. Clicking a collection restores native selection rendering.

Version 0.2.8 preserves the verified plugin implementation and its original generated icons. The add-on ID remains `zotero-deselect@local`. The update manifest is hosted in this repository and points to this repository's release assets.

## 中文说明

Zotero Deselect 将 macOS Finder 和 Windows 文件资源管理器中熟悉的“点击空白处取消选中”操作带到 Zotero。

## License

[MIT License](LICENSE). Copyright (c) 2026 Zotero Deselect contributors.
