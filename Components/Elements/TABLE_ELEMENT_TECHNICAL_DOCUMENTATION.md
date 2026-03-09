# Table Element — Technical Documentation

## Overview

A fully editable HTML table with resizable columns, row/column insert/delete, cell merging, multiple themes, header text, caption, and label type support.

### Component Identifier
```javascript
"dataType": "tablesNew"
```

---

## File Structure

```
KITABOO_Authoring/
└── templates/
    └── tableNew/
        ├── tables.html                   ← AngularJS template
        ├── tables-settings-panel.html    ← Settings panel
        ├── scripts/
        │   ├── tablesTemplate-directive.js ← tableNewInit directive
        │   └── resizable.js              ← Column resize library
        ├── styles/
        │   └── tablesNew-template.css
        └── default/
            └── tablesTemplate.json
```

---

## Data Model

| Field | Type | Description |
|---|---|---|
| `identifier` | string | `"tablesNew"` |
| `theme` | string | Active visual theme class |
| `noOfRows` | number | Number of rows (creation dialog) |
| `noOfCol` | number | Number of columns (creation dialog) |
| `header` | string | Header text above table |
| `caption` | string | Caption text below table |
| `question` | string | Primary label text |
| `secondaryQuestion` | string | Secondary label text |
| `tableData` | array | Serialized cell content |
| `settings` | object | Display settings |

### settings Object

| Field | Type | Description |
|---|---|---|
| `isHeaderVisible` | boolean | Show/hide header text |
| `optionalcaption` | boolean | Show/hide caption |
| `isLabelTypeTable` | boolean | Show question label overlay |
| `labelType` | string | `"primary"` or `"secondary"` |
| `outline` | string | Border: `"outlineBg"` or `""` |
| `outlineBgColor` | string | Outline background color |

---

## Table Operations

### Row Operations (right-click context menu `.vmenu`)
```javascript
globalScope.appendRow(rowIndex - 1, 'up')   // Insert Above
globalScope.appendRow(rowIndex, 'down')      // Insert Below
globalScope.deleteRows(rowIndex)             // Delete Row
```

### Column Operations
```javascript
globalScope.appendColumn(colIndex - 1, 'left')   // Insert Left
globalScope.appendColumn(colIndex - 1, 'right')  // Insert Right
globalScope.deleteColumns(colIndex - 1)           // Delete Column
```

### Cell Merge
```javascript
scope.mergeAll(event)    // Merge selected cells
scope.unmergeAll(event)  // Split merged cell
```

### Column Resize
- Drag column border → resize via `resizable.js`
- Column widths persisted in `tableData`

---

## Table Creation Dialog

```
Rows: ng-model="fieldData.noOfRows" (1–20)
Cols: ng-model="fieldData.noOfCol"  (1–20)
isNoOfRowColChangedFlag = true → triggers table rebuild
```

---

## Integration & Dependencies

| Dependency | Role |
|---|---|
| `tablesTemplate-directive.js` | Core directive with all table logic |
| `resizable.js` | Column drag-resize |
| `globalScope` | Shared scope for row/col operations (from inline onclick) |
| `editor/floatingTextPanel.js` | Rich-text editing for cells |
| `tablesNew-template.css` | Table themes and styles |

> **Note:** `globalScope` is a legacy pattern where the AngularJS scope is exposed globally for inline `onclick` handlers in the row/column context menu.
