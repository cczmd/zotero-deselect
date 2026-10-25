# Zotero Deselect

**Click empty space to deselect — just like Finder and Windows File Explorer.**

[English](#english) · [简体中文](#简体中文)

---

## English

### What it does

Zotero Deselect brings familiar desktop file-manager deselection behavior to Zotero's item list and collection pane.

### Why

Finder and Windows File Explorer users are used to clicking empty space after selecting files to clear the selection. Zotero's default behavior differs from this familiar desktop interaction. Zotero Deselect restores that familiar way of working.

### Features

- Click empty space in the center item list to clear the current selection.
- Click the only selected item again to deselect it.
- Clear the residual blue dotted focus outline after deselection.
- Click empty space in the left collection pane to hide the current collection's blue highlight while keeping its contents displayed.
- Click any collection again to restore Zotero's native collection selection behavior.
- Keep Zotero's native Cmd/Ctrl/Shift multi-selection workflows unchanged.

### Installation

1. Download the `.xpi` file from the [latest GitHub Release](https://github.com/cczmd/zotero-deselect/releases/latest).
2. In Zotero, open **Tools → Plugins**.
3. Open the gear menu and choose **Install Add-on From File…**.
4. Select the downloaded `.xpi` file.

### Compatibility

Tested with **Zotero 10.0.6 on macOS**.

The manifest declares compatibility with Zotero 10.0.x (`10.0` through `10.0.*`). Other platforms and versions have not yet been tested. The Finder and Windows File Explorer references describe the intended interaction, not additional tested platforms.

### How it works

The plugin listens for primary-button clicks in Zotero's item list and collection pane. When a click lands on empty space, it clears the relevant visual selection state while preserving Zotero's normal browsing behavior. In the collection pane, the current collection remains active internally so the displayed items do not change.

---

## 简体中文

### 功能简介

Zotero Deselect 将 macOS Finder 和 Windows 文件资源管理器中熟悉的**“点击空白处取消选中”**交互带到 Zotero 的条目列表和集合栏。

### 为什么做这个插件

在 Finder 和 Windows 文件资源管理器中，用户选中文件后，只需点击空白区域就能取消选择。这已经是很多桌面用户非常熟悉的操作习惯。

Zotero 默认不会采用这种交互。Zotero Deselect 的目的，就是把这种自然、熟悉的操作方式带回 Zotero。

### 功能

- 在中间条目列表点击空白区域，取消当前条目选择。
- 再次点击当前唯一选中的条目，可直接取消选择。
- 取消选择后，同时清除残留的蓝色虚线焦点框。
- 在左侧集合栏点击空白区域，隐藏当前集合的蓝色高亮，同时保持当前集合内容继续显示。
- 再次点击任意集合后，恢复 Zotero 原生的集合选择效果。
- 不影响 Zotero 原有的 Cmd/Ctrl/Shift 多选操作。

### 安装方法

1. 在 [GitHub Releases](https://github.com/cczmd/zotero-deselect/releases/latest) 下载最新的 `.xpi` 文件。
2. 打开 Zotero，进入 **Tools → Plugins**。
3. 点击齿轮菜单，选择 **Install Add-on From File…**。
4. 选择下载好的 `.xpi` 文件完成安装。

### 兼容性

目前已在 **macOS + Zotero 10.0.6** 上实际测试。

插件清单声明兼容 Zotero 10.0.x（`10.0` 至 `10.0.*`）。其他系统和版本目前尚未实际测试，因此不会做额外兼容性承诺。

### 工作原理

插件监听 Zotero 条目列表和集合栏中的鼠标点击。当用户点击空白区域时，插件清除对应的选中或高亮显示，同时尽量保持 Zotero 原有浏览逻辑不变。左侧集合栏取消高亮后，当前集合仍会在内部保持激活，因此中间显示的文献不会被切走。

---

## License

[MIT License](LICENSE). Copyright (c) 2026 Zotero Deselect contributors.
