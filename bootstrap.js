var ZoteroDeselect = {
  windows: new Map(),

  getPane(win) {
    return win.ZoteroPane || null;
  },

  getView(win) {
    let pane = this.getPane(win);
    return pane && pane.itemsView ? pane.itemsView : null;
  },

  getCollectionsView(win) {
    let pane = this.getPane(win);
    return pane && pane.collectionsView ? pane.collectionsView : null;
  },

  getCollectionsTreeElement(win) {
    return win.document.getElementById("zotero-collections-tree");
  },

  isInsideCollectionsTree(win, event) {
    let root = this.getCollectionsTreeElement(win);
    if (!root) return false;
    let r = root.getBoundingClientRect();
    return event.clientX >= r.left && event.clientX <= r.right &&
           event.clientY >= r.top && event.clientY <= r.bottom;
  },

  stripCollectionSelectionClasses(win) {
    let root = this.getCollectionsTreeElement(win);
    if (!root) return;
    for (let row of root.querySelectorAll(".row.selected, .row.first-selected, .row.last-selected, .row.focused")) {
      row.classList.remove("selected", "first-selected", "last-selected", "focused");
      try { row.removeAttribute("aria-selected"); } catch (e) {}
    }
    let table = root.querySelector(".virtualized-table");
    try { table?.removeAttribute("aria-activedescendant"); } catch (e) {}
  },

  hideCollectionSelection(win) {
    let state = this.windows.get(win);
    let root = this.getCollectionsTreeElement(win);
    if (!state || !root) return;

    state.collectionVisualClear = true;
    this.stripCollectionSelectionClasses(win);

    if (!state.collectionObserver) {
      state.collectionObserver = new win.MutationObserver(() => {
        if (!state.collectionVisualClear || state.collectionStripping) return;
        state.collectionStripping = true;
        try { this.stripCollectionSelectionClasses(win); }
        finally { state.collectionStripping = false; }
      });
      state.collectionObserver.observe(root, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ["class", "aria-selected", "aria-activedescendant"]
      });
    }

    // Zotero may repaint the collection tree after the pointer event.
    win.setTimeout(() => { if (state.collectionVisualClear) this.stripCollectionSelectionClasses(win); }, 0);
    win.setTimeout(() => { if (state.collectionVisualClear) this.stripCollectionSelectionClasses(win); }, 40);
  },

  restoreCollectionSelection(win) {
    let state = this.windows.get(win);
    if (!state || !state.collectionVisualClear) return;
    state.collectionVisualClear = false;

    if (state.collectionObserver) {
      try { state.collectionObserver.disconnect(); } catch (e) {}
      state.collectionObserver = null;
    }

    // The real Zotero collection selection was never changed. Ask the tree to
    // repaint so its normal selected classes come back immediately.
    let cv = this.getCollectionsView(win);
    try { cv?.tree?.invalidate?.(); } catch (e) {}
    win.setTimeout(() => {
      try { this.getCollectionsView(win)?.tree?.invalidate?.(); } catch (e) {}
    }, 0);
  },

  getItemsPaneBounds(win) {
    // Prefer the actual center pane/tree. Zotero 10 can use different internal
    // nodes depending on platform/build, so use several stable-ish anchors.
    let selectors = [
      "#zotero-items-tree",
      "#item-tree-main-default",
      "#zotero-items-pane",
      ".items-tree",
      ".item-tree",
      ".virtualized-table"
    ];
    for (let s of selectors) {
      let el = win.document.querySelector(s);
      if (el) {
        let r = el.getBoundingClientRect();
        if (r.width > 100 && r.height > 100) return { el, r };
      }
    }

    // Fallback: infer the middle pane from the splitter layout.
    // The items list is between the collections pane and the item-details pane.
    let collections = win.document.querySelector("#zotero-collections-pane");
    let details = win.document.querySelector("#zotero-item-pane");
    if (collections && details) {
      let a = collections.getBoundingClientRect();
      let b = details.getBoundingClientRect();
      return {
        el: null,
        r: {
          left: a.right,
          right: b.left,
          top: Math.min(a.top, b.top),
          bottom: Math.max(a.bottom, b.bottom),
          width: b.left - a.right,
          height: Math.max(a.bottom, b.bottom) - Math.min(a.top, b.top)
        }
      };
    }
    return null;
  },

  rowFromTarget(target) {
    let n = target;
    while (n && n.nodeType === 1) {
      let role = n.getAttribute && n.getAttribute("role");
      let cls = typeof n.className === "string" ? n.className : "";
      if (role === "row" ||
          /(^|\s)(row|item-tree-row|virtualized-table-row)(\s|$)/i.test(cls) ||
          n.getAttribute?.("aria-rowindex")) {
        return n;
      }
      n = n.parentElement;
    }
    return null;
  },

  rowIndex(row) {
    if (!row) return null;
    let vals = [
      row.dataset?.index,
      row.dataset?.rowIndex,
      row.getAttribute?.("data-index"),
      row.getAttribute?.("data-row-index"),
      row.getAttribute?.("aria-rowindex")
    ];
    for (let v of vals) {
      if (v !== null && v !== undefined && v !== "") {
        let num = Number(v);
        if (Number.isFinite(num)) {
          // aria-rowindex is 1-based
          if (row.getAttribute?.("aria-rowindex") == v &&
              !row.dataset?.index && !row.dataset?.rowIndex) {
            return num - 1;
          }
          return num;
        }
      }
    }
    return null;
  },

  clearTreeFocusState(win) {
    let view = this.getView(win);
    if (!view || !view.selection) return;

    // Zotero's VirtualizedTable keeps a separate focused-row index and an
    // aria-activedescendant pointer. clearSelection() does not reliably clear
    // those when the selection becomes empty, which can leave the dotted blue
    // focus ring painted around the previously selected row.
    try {
      view.selection.focused = -1;
    } catch (e) {}

    try {
      let treeEl = win.document.getElementById("item-tree-main-default");
      if (treeEl) treeEl.removeAttribute("aria-activedescendant");
    } catch (e) {}

    try {
      if (view.tree?._topDiv) {
        view.tree._topDiv.removeAttribute("aria-activedescendant");
      }
    } catch (e) {}

    // Re-render the tree after changing its separate focus state.
    try {
      if (view.tree?.invalidate) view.tree.invalidate();
    } catch (e) {}
  },

  clear(win) {
    let view = this.getView(win);
    if (!view || !view.selection) return;

    try {
      view.selection.clearSelection();
    } catch (e) {
      try { view.selection.select(-1); } catch (_) {}
    }

    // Clear the VirtualizedTable focus marker every time selection is cleared.
    this.clearTreeFocusState(win);

    // Keep the stable 0.2.0 focus behavior.
    try {
      let active = win.document.activeElement;
      if (active && active.blur) active.blur();

      let neutral =
        win.document.querySelector("#zotero-tb-search") ||
        win.document.querySelector("#zotero-collections-pane") ||
        win.document.documentElement;
      if (neutral && neutral.focus) {
        neutral.focus({ preventScroll: true });
        if (neutral.id === "zotero-tb-search" && neutral.blur) neutral.blur();
      }
    } catch (e) {}

    // Zotero can perform another render pass after the pointer event. Repeat
    // both selection clearing and focus-marker clearing after those passes so
    // aria-activedescendant cannot be left pointing at the previous row.
    win.setTimeout(() => {
      try {
        let v = this.getView(win);
        if (v?.selection?.count) v.selection.clearSelection();
        this.clearTreeFocusState(win);
      } catch (e) {}
    }, 0);
    win.setTimeout(() => {
      try {
        let v = this.getView(win);
        if (v?.selection?.count) v.selection.clearSelection();
        this.clearTreeFocusState(win);
      } catch (e) {}
    }, 40);
  },

  initWindow(win) {
    if (!win || this.windows.has(win)) return;

    let state = {
      onPointerDown: null,
      collectionVisualClear: false,
      collectionObserver: null,
      collectionStripping: false
    };
    this.windows.set(win, state);

    let onPointerDown = (event) => {
      if (event.button !== 0) return;

      // Left collection tree: clicking blank space visually clears the blue
      // selection highlight, while preserving Zotero's real current collection
      // so the center items view stays on the same collection.
      if (this.isInsideCollectionsTree(win, event)) {
        let root = this.getCollectionsTreeElement(win);
        let row = this.rowFromTarget(event.target);
        if (row && root?.contains(row)) {
          this.restoreCollectionSelection(win);
        }
        else {
          this.hideCollectionSelection(win);
        }
        return;
      }

      let view = this.getView(win);
      if (!view?.selection) return;

      let bounds = this.getItemsPaneBounds(win);
      if (!bounds) return;
      let r = bounds.r;

      if (event.clientX < r.left || event.clientX > r.right ||
          event.clientY < r.top || event.clientY > r.bottom) {
        return;
      }

      let row = this.rowFromTarget(event.target);

      // Important change in 0.2.0:
      // Any click inside the center items pane that is NOT on an item row
      // is treated as empty-space click, regardless of virtualized DOM nodes.
      if (!row) {
        event.preventDefault();
        event.stopPropagation();
        this.clear(win);
        return;
      }

      // If exactly one item is selected and user clicks that same row again,
      // deselect it. Leave clicks on other rows untouched so Zotero selects normally.
      if (view.selection.count === 1) {
        let current = view.selection.currentIndex;
        let clicked = this.rowIndex(row);

        // If the rendered row doesn't expose an index, use hit-testing against
        // the currently focused row as a conservative fallback.
        let same = Number.isFinite(clicked) ? clicked === current : false;
        if (!same) {
          try {
            same = row.getAttribute("aria-selected") === "true" ||
                   row.classList.contains("selected");
          } catch (e) {}
        }

        if (same) {
          event.preventDefault();
          event.stopPropagation();
          this.clear(win);
        }
      }
    };

    // pointerdown occurs before Zotero's normal click selection handling.
    state.onPointerDown = onPointerDown;
    win.addEventListener("pointerdown", onPointerDown, true);
  },

  uninitWindow(win) {
    let state = this.windows.get(win);
    if (state) {
      if (state.onPointerDown) {
        win.removeEventListener("pointerdown", state.onPointerDown, true);
      }
      if (state.collectionObserver) {
        try { state.collectionObserver.disconnect(); } catch (e) {}
      }
      this.windows.delete(win);
    }
  }
};

async function startup({ id, version, rootURI }, reason) {
  await Zotero.initializationPromise;
  await Zotero.uiReadyPromise;
  for (let win of Zotero.getMainWindows()) ZoteroDeselect.initWindow(win);
}

function onMainWindowLoad({ window }) {
  ZoteroDeselect.initWindow(window);
}

function onMainWindowUnload({ window }) {
  ZoteroDeselect.uninitWindow(window);
}

function shutdown({ id, version, rootURI }, reason) {
  if (reason === APP_SHUTDOWN) return;
  for (let win of Array.from(ZoteroDeselect.windows.keys())) {
    ZoteroDeselect.uninitWindow(win);
  }
}

function install(data, reason) {}
function uninstall(data, reason) {}
