# Table Element — Technical Documentation

## Table of Contents
1. [Overview](#overview)
2. [Component Architecture](#component-architecture)
3. [File Structure](#file-structure)
4. [Data Model](#data-model)
5. [Table Structure & Rendering](#table-structure--rendering)
6. [Editor Mode Implementation](#editor-mode-implementation)
7. [Settings Panel Reference](#settings-panel-reference)
8. [Authoring Flow](#authoring-flow)
9. [Preview Mode Behavior](#preview-mode-behavior)
10. [Integration & Dependencies](#integration--dependencies)
11. [CSS Reference](#css-reference)
12. [Known Behaviors & Notes](#known-behaviors--notes)
13. [Checklist for Implementation](#checklist-for-implementation)

---

## Overview

### Purpose

The **Table Element** (`dataType: "table"`) is a static data display component for presenting structured tabular information. Authors define rows and columns of plain text content, choose whether the first row is a styled header row, and configure border/background colors. This is a **content-display table only** — cells are not student-editable in the reader, there is no cell merging, and no SCORM tracking.

> **Important**: For interactive student-editable tables, use the **Table GO** widget instead. The Table Element is for read-only data presentation.

### Key Capabilities

- Configurable rows and columns (min 1×1, max 20×10)
- Optional styled header row (first row highlighted)
- Author edits cell text directly on canvas (contenteditable)
- Configurable header background color
- Table caption (semantic `<caption>` element)
- Outline border with configurable background color
- Semantic HTML table output (`<table>`, `<thead>`, `<tbody>`, `<th>`, `<td>`)
- No student interaction — display only

### Component Identifier

```javascript
"dataType": "table"
```

### Component Registration (config.js)

```javascript
{
  name: "Table",
  dataType: "table",
  url: "templates/table/table.html",
  json: "templates/table/default/table.json",
  settingsURL: "templates/table/table-settings.html",
  iconClass: "icon-table"
}
```

---

## Component Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                      KITABOO Authoring Tool                          │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  config.js ──────────► ngcontroller.js ──────► $compile              │
│  (dataType:"table")     (drag-drop)            (canvas inject)       │
│                               │                                      │
│                               ▼                                      │
│          ┌────────────────────────────────────────┐                  │
│          │  table.html (Canvas Template)           │                  │
│          │  [tableTemplate directive]              │                  │
│          │  ng-repeat rows + cols → <td> cells    │                  │
│          └────────────────────────────────────────┘                  │
│                    │                   │                             │
│                    ▼                   ▼                             │
│       ┌───────────────────┐  ┌──────────────────────────────┐       │
│       │ table-directive.js │  │ table-settings.html           │       │
│       │ (tableTemplate)    │  │ (Settings Panel)             │       │
│       └───────────────────┘  └──────────────────────────────┘       │
│                    │                   │                             │
│                    ▼                   ▼                             │
│          fieldData.settings       Settings Controls:                 │
│          .tableData[][]            - Rows input                      │
│          .rows, .cols              - Columns input                   │
│          .hasHeader                - Has Header Row                  │
│          .headerBgColor            - Header Background Color         │
│                                    - Caption toggle                  │
│                                    - Outline radio + color           │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## File Structure

```
KITABOO_Authoring/
│
└── templates/
    └── table/
        ├── table.html               ← AngularJS canvas template
        ├── table-settings.html      ← Right-side settings panel
        ├── scripts/
        │   └── table-directive.js   ← tableTemplate directive
        └── default/
            └── table.json           ← Default configuration JSON
```

### `table.json` — Default Configuration

```json
{
  "identifier": "table",
  "caption": "",
  "settings": {
    "rows": 3,
    "cols": 3,
    "hasHeader": true,
    "headerBgColor": "#f0f0f0",
    "outline": "",
    "outlineBgColor": "#ffffff",
    "showCaption": false,
    "tableData": [
      [
        { "text": "Header 1", "isHeader": true },
        { "text": "Header 2", "isHeader": true },
        { "text": "Header 3", "isHeader": true }
      ],
      [
        { "text": "Row 1, Cell 1", "isHeader": false },
        { "text": "Row 1, Cell 2", "isHeader": false },
        { "text": "Row 1, Cell 3", "isHeader": false }
      ],
      [
        { "text": "Row 2, Cell 1", "isHeader": false },
        { "text": "Row 2, Cell 2", "isHeader": false },
        { "text": "Row 2, Cell 3", "isHeader": false }
      ]
    ],
    "metaTags": [],
    "dimensionInfo": []
  }
}
```

---

## Data Model

### Root-Level Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `identifier` | string | `"table"` | Component type identifier |
| `caption` | string | `""` | Table caption (semantic `<caption>` element) |
| `settings` | object | `{}` | All table structure and display settings |

### `settings` Object

| Field | Type | Default | Description |
|---|---|---|---|
| `rows` | number | `3` | Number of rows (includes header row if `hasHeader=true`) |
| `cols` | number | `3` | Number of columns |
| `hasHeader` | boolean | `true` | First row is a styled header row |
| `headerBgColor` | string | `"#f0f0f0"` | Header row background color |
| `outline` | string | `""` | Border: `"outlineBg"` or `""` |
| `outlineBgColor` | string | `"#ffffff"` | Outline box background color |
| `showCaption` | boolean | `false` | Show/hide table caption |
| `tableData` | array | `[[...]]` | 2D array of cell objects `[row][col]` |
| `metaTags` | array | `[]` | Content search metadata |
| `dimensionInfo` | array | `[]` | Dimension tracking (legacy) |

### Cell Object Structure

```typescript
interface TableCell {
  text: string;      // Cell content (plain text, no HTML)
  isHeader: boolean; // true = header cell (<th>), false = data cell (<td>)
}
```

### `tableData` 2D Array

```javascript
// tableData[rowIndex][colIndex]
tableData = [
  // Row 0 (header row)
  [
    { text: "Student Name", isHeader: true },
    { text: "Score", isHeader: true },
    { text: "Grade", isHeader: true }
  ],
  // Row 1
  [
    { text: "Alice Johnson", isHeader: false },
    { text: "92", isHeader: false },
    { text: "A", isHeader: false }
  ],
  // Row 2
  [
    { text: "Bob Smith", isHeader: false },
    { text: "78", isHeader: false },
    { text: "C+", isHeader: false }
  ]
];
```

### Complete fieldData Example — Grade Table

```json
{
  "identifier": "table",
  "caption": "Student Assessment Results — Quarter 1",
  "settings": {
    "rows": 4,
    "cols": 3,
    "hasHeader": true,
    "headerBgColor": "#2563EB",
    "outline": "outlineBg",
    "outlineBgColor": "#f8f9fa",
    "showCaption": true,
    "tableData": [
      [
        {"text": "Student Name", "isHeader": true},
        {"text": "Score", "isHeader": true},
        {"text": "Grade", "isHeader": true}
      ],
      [
        {"text": "Alice Johnson", "isHeader": false},
        {"text": "92", "isHeader": false},
        {"text": "A", "isHeader": false}
      ],
      [
        {"text": "Bob Smith", "isHeader": false},
        {"text": "78", "isHeader": false},
        {"text": "C+", "isHeader": false}
      ],
      [
        {"text": "Carol Davis", "isHeader": false},
        {"text": "85", "isHeader": false},
        {"text": "B+", "isHeader": false}
      ]
    ],
    "metaTags": ["table", "grades", "assessment"],
    "dimensionInfo": []
  }
}
```

---

## Table Structure & Rendering

### HTML Output Structure

```html
<table class="data-table {{settings.outline}}"
       ng-style="{'background-color': settings.outlineBgColor}">

  <!-- Optional caption -->
  <caption ng-if="settings.showCaption">{{fieldData.caption}}</caption>

  <!-- Header row (if hasHeader = true) -->
  <thead ng-if="settings.hasHeader">
    <tr ng-style="{'background-color': settings.headerBgColor}">
      <th ng-repeat="cell in tableData[0]"
          contenteditable="true"
          ng-model="cell.text"
          class="header-cell">
        {{cell.text}}
      </th>
    </tr>
  </thead>

  <!-- Data rows -->
  <tbody>
    <tr ng-repeat="row in tableData | startFrom: (settings.hasHeader ? 1 : 0)">
      <td ng-repeat="cell in row"
          contenteditable="true"
          ng-model="cell.text"
          class="data-cell">
        {{cell.text}}
      </td>
    </tr>
  </tbody>

</table>
```

### Row/Column Resize Logic

```javascript
// Adding a row — appends new empty row to tableData
function addRow() {
  var newRow = [];
  for (var i = 0; i < settings.cols; i++) {
    newRow.push({ text: "", isHeader: false });
  }
  settings.tableData.push(newRow);
  settings.rows++;
}

// Removing a row — removes last row only
function removeRow() {
  if (settings.rows > 1) {
    settings.tableData.pop();
    settings.rows--;
  }
}

// Adding a column — appends one cell to each existing row
function addCol() {
  settings.tableData.forEach(function(row, i) {
    row.push({ text: "", isHeader: i === 0 && settings.hasHeader });
  });
  settings.cols++;
}

// Removing a column — removes last cell from each row
function removeCol() {
  if (settings.cols > 1) {
    settings.tableData.forEach(function(row) {
      row.pop();
    });
    settings.cols--;
  }
}
```

---

## Editor Mode Implementation

### Key Directive Functions

| Function | Parameters | Purpose |
|---|---|---|
| `addRow()` | none | Appends new row of empty cells to `tableData` |
| `removeRow()` | none | Removes last row from `tableData` (min 1 row) |
| `addCol()` | none | Appends new cell to each row |
| `removeCol()` | none | Removes last cell from each row (min 1 col) |
| `toggleHeader()` | none | Toggles `hasHeader`; updates first row `isHeader` flags |
| `setHeaderColor(color)` | `color: string` | Updates `headerBgColor` |
| `toggleCaption()` | none | Toggles `showCaption` |
| `setOutline(val)` | `val: string` | Updates `outline` class |
| `setOutlineColor(color)` | `color: string` | Updates `outlineBgColor` |
| `initTableData(rows, cols)` | `rows, cols: number` | Rebuilds `tableData` 2D array |

---

## Settings Panel Reference

| Setting | Control Type | Binding | Values / Constraints |
|---|---|---|---|
| **Rows** | Number input | `fieldData.settings.rows` | Min 1, max 20; increment/decrement adds/removes rows |
| **Columns** | Number input | `fieldData.settings.cols` | Min 1, max 10; increment/decrement adds/removes cols |
| **Has Header Row** | Checkbox | `fieldData.settings.hasHeader` | Toggles `<thead>` vs all `<tbody>` |
| **Header Background** | Color picker | `fieldData.settings.headerBgColor` | Hex color |
| **Show Caption** | Checkbox | `fieldData.settings.showCaption` | |
| **Outline** | Radio (None/Box) | `fieldData.settings.outline` | `""` / `"outlineBg"` |
| **Background Color** | Color picker | `fieldData.settings.outlineBgColor` | Hex; visible when outline active |
| **Meta Tags** | Tag input | `fieldData.settings.metaTags[]` | Array of strings |

---

## Authoring Flow

### Step-by-Step Sequence

```
1. Author drags Table element from Elements panel onto canvas
       ↓
2. Component renders with default 3×3 table (header row + 2 data rows)
   tableData pre-populated with placeholder text
       ↓
3. Author adjusts table dimensions in settings panel:
   - Increase/decrease rows (add/remove from bottom)
   - Increase/decrease columns (add/remove from right)
       ↓
4. Author clicks each cell in canvas to edit text:
   - Click cell → contenteditable activates
   - Type cell content (plain text only)
   - Press Tab to move to next cell
       ↓
5. Author configures appearance:
   - Toggle Has Header Row (styles first row differently)
   - Set header background color
   - Toggle caption → types caption text
   - Set outline border style
       ↓
6. Save → tableData 2D array persisted to savedJson
       ↓
7. Package output: semantic HTML table with all cell text
```

---

## Preview Mode Behavior

| Property | Editor Mode | Preview Mode |
|---|---|---|
| Cell text editing | Contenteditable active | Read-only |
| Caption editing | Contenteditable active | Read-only |
| Add/Remove row/col buttons | Visible | Hidden |
| Settings panel | Accessible | Hidden |
| Table rendered as | Editable table | Semantic HTML table |

---

## Integration & Dependencies

| Dependency | Role | Notes |
|---|---|---|
| `table-directive.js` | Core directive `tableTemplate` | Row/col management, init |
| `editor/ngcontroller.js` | `$compile` + inject + `savedJson` | |
| `editor/contenteditable-ng-model-directive.js` | `ng-model` on each `<td>/<th>` | |
| `css/authoring/authoring-style.css` | `.data-table` base styles | Shared |

---

## CSS Reference

| CSS Class | Description |
|---|---|
| `.data-table` | Root `<table>` element styles |
| `.header-cell` | `<th>` cell styling |
| `.data-cell` | `<td>` cell styling |
| `.outlineBg` | Border box wrapper |

### Table Base CSS

```css
.data-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ddd;
}

.data-table th,
.data-table td {
  padding: 8px 12px;
  border: 1px solid #ddd;
  text-align: left;
  vertical-align: top;
  min-width: 80px;
}

.header-cell {
  font-weight: bold;
  /* background-color set via ng-style from headerBgColor */
}
```

---

## Known Behaviors & Notes

1. **Display-only table**: This element is for READ-ONLY content display in the reader. Students cannot edit table cells. For interactive, student-editable tables, use the **Table GO** widget.

2. **Row/column operations on ends only**: The directive only supports adding/removing rows from the bottom and columns from the right. There is no mid-table insertion, deletion, or reordering. Authors must manually re-type content if structure needs changing.

3. **Cell text is PLAIN TEXT only**: Unlike the Text element, table cells do not have floating toolbar support. The cell contenteditable stores plain text only — no bold, italic, colors, or HTML markup inside cells.

4. **No cell merging**: Cell spanning (`rowspan`, `colspan`) is not supported. For merged cells, authors must use an alternative layout approach or the Table GO widget.

5. **`tableData` is a 2D array**: The JSON serialization stores `tableData` as a nested array. Large tables with many rows/columns can produce large JSON objects. Max recommended: 20 rows × 10 columns.

6. **`hasHeader` toggles `isHeader` flags on first row**: When `hasHeader` is toggled, the directive updates each cell in row 0 to set `isHeader: true` (renders as `<th>`) or `false` (renders as `<td>`). This is done in-place without rebuilding the array.

7. **`caption` renders as semantic `<caption>` element**: The HTML `<caption>` element is the first child of `<table>`, rendering above the table visually. It is the accessible label for screen readers.

8. **Rows/Cols settings are source of truth**: `settings.rows` and `settings.cols` must always match the actual dimensions of `tableData`. If they get out of sync (e.g., due to a bug), the `ng-repeat` may render incorrectly. The directive should validate this on load.

9. **headerBgColor applies inline via ng-style**: The header row background color is applied as `ng-style="{'background-color': settings.headerBgColor}"` on the `<tr>` element, overriding any CSS default.

10. **No SCORM**: The Table element is content-only — no student interaction, no SCORM events. Use Table GO widget if student interaction with table data is needed.

---

## Checklist for Implementation

### For Authors
- [ ] Use Table element for static reference/display data only
- [ ] Use Table GO widget if students need to fill in cells
- [ ] Set appropriate row and column counts before typing content (re-typing after resize is tedious)
- [ ] Use header row for column labels
- [ ] Add semantic caption for accessibility (screen readers read caption first)
- [ ] Type plain text in cells — no formatting supported

### For Developers
- [ ] Verify `tableData` 2D array initialized with correct dimensions on drag-drop
- [ ] Confirm `rows` and `cols` in settings match `tableData` array dimensions (sync validation)
- [ ] Test add/remove row and col operations preserve existing cell text
- [ ] Verify `hasHeader` toggle correctly updates `isHeader` flags on row 0 cells
- [ ] Confirm `<caption>` element renders only when `showCaption=true`
- [ ] Test large tables (20×10) for performance with `ng-repeat`
- [ ] Verify table renders as semantic HTML (`<table>`, `<thead>`, `<tbody>`, `<th>`, `<td>`) in package output
