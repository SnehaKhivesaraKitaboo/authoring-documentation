# Table GO - Technical Documentation

## 1. Overview

The **Table GO** component is a sophisticated interactive table authoring and rendering tool designed for educational content creation. It provides rich table editing capabilities in authoring mode and supports student interaction in preview/reader modes with configurable cell editing permissions.

### Component Identifier
- **Template ID**: `tableGO`
- **Display Name**: Table GO
- **Icon**: `icon-Table-01`

---

## 2. Component Types and Visual Styles

The component supports 4 pre-defined visual themes:

### 2.1 Style 1 (Default)
- **Theme Class**: `style1-theme`
- **First Row**: Black background with white text (header row)
- **Body Rows**: 
  - Odd rows: White background
  - Even rows: Light gray (#f0f0f0)
- **Use Case**: Professional documents, formal reports

### 2.2 Style 2
- **Theme Class**: `style2-theme`
- **First Row**: Light background (#f9fafb) with bottom border
- **Body Rows**:
  - Odd rows: White background
  - Even rows: Light gray (#f0f0f0)
- **Use Case**: Clean, minimal design

### 2.3 Style 3
- **Theme Class**: `style3-theme`
- **Color Scheme**: Dark theme with white text
- **Body Rows**:
  - Odd rows: Medium gray (#666)
  - Even rows: Dark gray (#444)
- **Use Case**: High contrast, accessibility focus

### 2.4 Style 4
- **Theme Class**: `style4-theme`
- **Body Rows**:
  - Odd rows: White background
  - Even rows: Light green (#f2f8e9)
- **Use Case**: Nature-themed or eco-friendly content

---

## 3. Architecture Overview

### 3.1 File Structure

```
templates/tableGO/
├── tableGO.html                         # Main template (editor view)
├── tableGO-settings-panel.html          # Settings panel UI
├── default/
│   └── tableGO.json                     # Default configuration
├── scripts/
│   ├── tableGO-directive.js             # AngularJS directive (2926 lines)
│   ├── tableGO-preview1.js              # Preview/Reader logic (605 lines)
│   └── resizable.js                     # Column resizing functionality
└── styles/
    └── tableGO-template.css             # Component styling (699 lines)
```

### 3.2 Technology Stack

- **Framework**: AngularJS 1.x
- **UI Libraries**: 
  - jQuery & jQuery UI (interactions)
  - jQuery mCustomScrollbar (scrolling)
  - Bootstrap (layout)
- **Text Editor**: Jodit WYSIWYG Editor (optional, for advanced formatting)
- **Math Rendering**: MathQuill/MathLive (equation support)
- **Styling**: CSS3 with custom scrollbars and responsive design

---

## 4. Data Model

### 4.1 Core Data Structure

```json
{
  "identifier": "tableGO",
  "templateName": "Table",
  "introduction": "",
  "header": "",
  "caption": "",
  "instruction": "Find the extraneous word in each groups of words",
  "noOfRows": -1,                    // -1 indicates table not yet created
  "noOfCol": -1,
  "rowInput": 2,                     // Default row count for creation dialog
  "colInput": 2,                     // Default column count for creation dialog
  "mergedCellsList": {},             // Stores merged cell information
  "columnArray": [],
  "theme": "style1-theme",
  "color": "black",
  "headervalues": [],                // Header row cell contents
  "celldata": [],                    // Body cell contents (flattened array)
  "cellwidth": [],                   // Column widths
  "cellcolors": [],                  // Cell background colors
  "studentEnabledCells": [],         // Cells editable by students
  "selectedCell": -1,
  "AlignedClass": "middleAlign",
  "question": "Question 1",
  "secondaryQuestion": "Part A",
  
  "settings": { /* ... */ },
  "wrappedColumns": [],
  "custom": {
    "css": [
      "css/authoring/jquery.mCustomScrollbar.css",
      "css/templates/tableGO-template.css"
    ],
    "javascript": [
      "js/jquery.mCustomScrollbar.js",
      "js/templates/tableGO-preview1.js"
    ]
  }
}
```

### 4.2 Settings Configuration

```json
{
  "labelType": "primary|secondary",
  "isLabelTypeTableGO": false,
  "isHeaderVisible": true,
  "optionalcaption": true,
  "enableSubmit": true,                      // Show Submit button & enable student editing
  "advancedFormatting": false,               // Enable Jodit editor
  "formattingValue": "ELA",
  "outline": "outline|outlineBg",
  "isDisabledSubmit": true,
  "outlineBgColor": "#FFFFFF",
  "headerColor": "#CFBA99",                  // First row background color
  "mediaToUpload": "tabel_align_top|tabel_align_middle|tabel_align_bottom",
  "rowAlternate": false,                     // Enable alternating row colors
  "rowAlternateColor1": "#faf8f5",
  "rowAlternateColor2": "#f5f1eb",
  "defaultRowAlternateColor1": "#faf8f5",
  "defaultRowAlternateColor2": "#f5f1eb",
  "verticalLines": true,                     // Show vertical borders
  "colorvalues": [
    {
      "colornumber": "1",
      "coloractive": false,
      "colorcode": "#D2E6E8"
    },
    // ... 5 color options
  ],
  "styleSelected": "style1",
  "headerStyleSettings": true,
  "style_tab": [ /* 4 style thumbnails */ ],
  "isWrapApplied": false,
  "isResized": false,
  "resizedColumns": [],
  "col_width": [],
  "cell_width": [],
  "AlignType": [],
  "isAlign": false,
  "columnresizedata": [],
  "altText": ""
}
```

### 4.3 Merged Cells Data Structure

```json
{
  "mergedCellsList": {
    "row-col": {
      "rowspan": 2,
      "colspan": 3,
      "originalRow": 1,
      "originalCol": 2
    }
  }
}
```

### 4.4 Student Enabled Cells Structure

```json
{
  "studentEnabledCells": [
    {
      "cellIndex": 5,
      "labelText": "Enter your answer here"
    }
  ]
}
```

---

## 5. Operational Modes

### 5.1 Editor Mode (Authoring)

**Location**: [tableGO-directive.js](scripts/tableGO-directive.js)

#### Key Features:

1. **Table Creation Dialog**
   - Initial state: `noOfRows = -1, noOfCol = -1`
   - Dialog with row/column input (range: 1-20)
   - Creates table with default styling and alternating colors

2. **Context Menu Operations (Right-Click)**
   - **Row Operations**:
     - Insert Above
     - Insert Below
     - Delete Row (minimum 1 row)
   - **Column Operations**:
     - Insert Left
     - Insert Right
     - Delete Column (minimum 1 column)
   - **Cell Merging**:
     - Merge All (for selected cells)
     - Unmerge

3. **Cell Selection & Editing**
   - Click cell to select (adds `tableDataSelected` class)
   - Multi-cell selection support
   - Contenteditable divs with math equation support
   - Rich text formatting (bold, italic, underline, colors)

4. **Excel Paste Support**
   - Detects Excel data from clipboard
   - Sanitizes MS Office styling/comments
   - Expands table if paste exceeds current dimensions
   - Preserves formatting (bold, italic, colors)
   - Handles merged cells intelligently

5. **Column Resizing**
   - Drag handle on column borders
   - Min-width: 50px
   - Stores resize data in settings

6. **Student Cell Configuration**
   - Select cell(s) → Enable for student editing
   - Add label text for student guidance
   - Visual indicator (blue border)

7. **Settings Panel Integration**
   - Row header color customization
   - Alternate row colors with color pickers
   - Vertical line toggle
   - Vertical alignment (Top/Middle/Bottom)
   - Show/Hide header, caption, submit button
   - Label type (Primary/Secondary)
   - Outline style (None/Outline+Background)
   - Advanced formatting toggle (Jodit editor)
   - Alt text for accessibility

#### Critical Functions:

```javascript
// Table creation
scope.onNoOfRowsColsChanged = function() {
  // Create table with specified rows/columns
  // Apply default styling and colors
  // Initialize cell data arrays
}

// Row operations
scope.appendRow = function(index, direction, isBulkProcessing, tableValue) {
  // direction: 'up' or 'down'
  // Handles merged cells
  // Updates cell data arrays
  // Applies row colors
}

scope.deleteRows = function(rowIndex) {
  // Minimum 1 row required
  // Handles merged cells
  // Updates cell data arrays
}

// Column operations
scope.appendColumn = function(index, direction, isBulkProcessing) {
  // direction: 'left' or 'right'
  // Handles merged cells
  // Updates cell data arrays
}

scope.deleteColumns = function(colIndex) {
  // Minimum 1 column required
  // Handles merged cells
  // Updates cell data arrays
}

// Merge/Unmerge
scope.mergeAll = function(tableOrEvent) {
  // Merges selected cells
  // Stores merge info in mergedCellsList
  // Handles rowspan/colspan attributes
}

scope.unmergeAll = function(e) {
  // Unmerges selected cells
  // Restores original cell structure
  // Clears merge data
}

// Excel paste
function pasteExcelGrid(html, editable) {
  // Parses Excel HTML
  // Sanitizes and cleans data
  // Expands table if needed
  // Restores merges outside paste region
}

function sanitizeCellHTML(html) {
  // Removes MS Office artifacts
  // Preserves formatting (bold, italic, colors)
  // Removes comments and styles
  // Returns clean HTML
}

// Save data
var saveTableData = function(evt, skipResanitize) {
  // Saves header values
  // Saves cell data
  // Saves cell colors
  // Enables save button
}
```

#### Context Menu Workflow:

```
Right-Click on Cell
    ↓
Show Context Menu (vmenu/margeMenu/unmargeMenu)
    ↓
Determine Selected Cells
    ├─ Single Cell → Show Row/Column Menu
    ├─ Multiple Cells → Show Merge Menu
    └─ Merged Cell → Show Unmerge Menu
    ↓
Execute Operation
    ↓
Update DOM & Data Model
    ↓
Apply Styling (colors, borders)
    ↓
Save to fieldData
```

### 5.2 Preview/Reader Mode

**Location**: [tableGO-preview1.js](scripts/tableGO-preview1.js)

#### Interaction Methods:

**Student Editing:**
- Click on enabled cells (blue border)
- Opens modal popup with text editor
- Supports plain text or Jodit editor (if enabled)
- Character limit: 2000 characters
- Real-time character count
- Math equation support

#### User Flow:

```
1. Load Component
   ↓
2. Initialize Jodit Editor (if enabled)
   ↓
3. Student clicks enabled cell
   ↓
4. Show modal popup
   ├─ Display label text (if configured)
   ├─ Load existing cell content
   ├─ Initialize editor (plain or Jodit)
   ├─ Show character count (2000 max)
   └─ Enable Add/Cancel buttons
   ↓
5. Student enters text
   ├─ Real-time validation
   ├─ Character count updates
   ├─ Truncate if exceeds 2000 chars
   └─ Disable Add button if empty or too long
   ↓
6. Student clicks "Add"
   ↓
7. Update cell content
   ↓
8. Mark cell as submitted
   ↓
9. Enable Submit button (when all required cells filled)
   ↓
10. Submit Answer
    ↓
11. Disable all editing
    ↓
12. Save state to SCORM/xAPI
```

#### Key Functions:

```javascript
// Enable submit button when all cells filled
function enableSubmitGOBtn(table) {
  // Check if all student-enabled cells are submitted
  // Enable/disable submit button
}

// Submit answer
function submitAnswerTableGO(event) {
  // Disable submit button
  // Disable cell editing
  // Save state to SCORM
}

// Modal popup handling
$(".tableGOtemplate .tableGONew .studentEditingEnabled").on('click', function() {
  // Show modal with editor
  // Load cell content
  // Initialize Jodit (if enabled)
  // Set up character count
  // Enable drag-to-move modal
});

// Add button handler
$(".table-go-answertext-popup .tableGOpreviewAddBtn").on("click", function() {
  // Validate text length
  // Update cell content
  // Mark as submitted
  // Close modal
  // Enable submit button
  // Save state
});

// State management
function stateMainatainTableGO($table) {
  // Collect all cell values
  // Create SCORM object
  // Save via saveAction()
}
```

#### Modal Popup Features:

1. **Draggable Modal**
   - Drag by icon handle
   - Constrained to viewport
   - Positioned center by default

2. **Text Editor**
   - Plain text mode: Contenteditable div
   - Advanced mode: Jodit WYSIWYG editor
   - Math equation support (MathLive)
   - Character limit: 2000
   - Real-time validation

3. **Character Counter**
   - Shows "X characters remaining"
   - Turns red when approaching limit
   - Auto-truncates if exceeded

4. **Validation**
   - Empty text → "Text field cannot be empty"
   - >2000 chars → "Text can have a maximum of 2000 characters"
   - Add button disabled if validation fails

---

## 6. Key Features

### 6.1 Core Functionality
- ✅ Dynamic table creation (1-20 rows/columns)
- ✅ Row/Column operations (insert, delete)
- ✅ Cell merging and unmerging
- ✅ Excel data paste with formatting preservation
- ✅ Column resizing with drag handles
- ✅ Cell selection (single and multi-select)
- ✅ Rich text editing in cells
- ✅ Math equation support

### 6.2 Assessment Features
- ✅ Student cell editing permissions
- ✅ Label text for student guidance
- ✅ Submit answer functionality
- ✅ SCORM/xAPI state persistence
- ✅ Character limit enforcement (2000 chars)
- ✅ Real-time validation
- ✅ Modal popup editor

### 6.3 Content Authoring
- ✅ 4 visual styles/themes
- ✅ Customizable row header color
- ✅ Alternating row colors
- ✅ Vertical alignment (Top/Middle/Bottom)
- ✅ Vertical lines toggle
- ✅ Outline styles (None/Outline+Background)
- ✅ Optional header and caption
- ✅ Label type (Primary/Secondary)
- ✅ Advanced formatting (Jodit editor)
- ✅ Alt text for accessibility

### 6.4 Advanced Features
- ✅ Excel paste sanitization
- ✅ MS Office artifact removal
- ✅ Merged cell preservation
- ✅ Drag-to-move modal popup
- ✅ Custom scrollbars
- ✅ Responsive layout
- ✅ Touch device support

---

## 7. Data Flow Architecture

### 7.1 Editor Mode Data Flow

```
User Interaction (Edit Cell)
    ↓
AngularJS Directive (tableGoInit)
    ↓
Update Cell Data (saveTableData)
    |  - headervalues[]
    |  - celldata[]
    |  - cellcolors[]
    ↓
Sanitize HTML (sanitizeCellHTML)
    ↓
Update fieldData Model
    ↓
AngularJS Two-Way Binding
    ↓
Update DOM
    ↓
Save to savedJson (main controller)
    ↓
Persist to Server/Local Storage
```

### 7.2 Context Menu Operation Flow

```
Right-Click on Cell
    ↓
Capture Event (contextmenu)
    ↓
Determine Operation Type
    |  - Single cell → Row/Column menu
    |  - Multiple cells → Merge menu
    |  - Merged cell → Unmerge menu
    ↓
Show Menu Overlay
    ↓
User Selects Operation
    ↓
Execute Function
    |  - appendRow()
    |  - deleteRows()
    |  - appendColumn()
    |  - deleteColumns()
    |  - mergeAll()
    |  - unmergeAll()
    ↓
Update Table Structure
    |  - Modify DOM
    |  - Update data arrays
    |  - Handle merged cells
    ↓
Apply Styling
    |  - Row colors
    |  - Borders
    |  - Alignment
    ↓
Save Data (saveTableData)
    ↓
Enable Save Button
```

### 7.3 Preview/Reader Mode Data Flow

```
Component Load
    ↓
Parse JSON Configuration
    ↓
Render HTML Table
    ↓
Initialize Student Editing
    |  - Mark enabled cells
    |  - Initialize Jodit (if enabled)
    ↓
Student Clicks Enabled Cell
    ↓
Show Modal Popup
    |  - Display label text
    |  - Load cell content
    |  - Initialize editor
    |  - Show character count
    ↓
Student Enters Text
    ↓
Validate Input
    |  - Check empty
    |  - Check length (≤2000)
    |  - Enable/disable Add button
    ↓
Student Clicks "Add"
    ↓
Update Cell Content
    ↓
Mark Cell as Submitted
    ↓
Check All Required Cells
    ↓
Enable Submit Button
    ↓
Student Submits Answer
    ↓
Save State to SCORM (stateMainatainTableGO)
    ↓
Disable All Editing
```

### 7.4 Excel Paste Data Flow

```
User Copies from Excel
    ↓
Paste into Table Cell (Ctrl+V)
    ↓
Capture Paste Event
    ↓
Extract HTML from Clipboard
    ↓
Parse Excel Grid (pasteExcelGrid)
    |  - Build logical grid
    |  - Find paste position
    |  - Extract cell data
    ↓
Sanitize Each Cell (sanitizeCellHTML)
    |  - Remove MS Office comments
    |  - Remove style patterns (mso-*)
    |  - Preserve formatting (bold, italic, colors)
    |  - Clean HTML structure
    ↓
Check Table Dimensions
    |  - Expand rows if needed (ensureRows)
    |  - Expand columns if needed (ensureCols)
    ↓
Paste Data into Cells
    |  - Apply to target cells
    |  - Preserve existing merges
    ↓
Restore Merged Cells
    |  - Identify merges to restore
    |  - Apply rowspan/colspan
    ↓
Save Data (saveTableData with skipResanitize=true)
    ↓
Update Display
```

### 7.5 SCORM State Management

```javascript
function stateMainatainTableGO($table) {
  // Collects current state:
  // - All cell values (inputSeleced)
  // - Attempt counter
  // - Submit button state
  // - Component ID
  
  // Saves to SCORM API via saveAction()
}
```

**Saved State Object:**
```json
{
  "inputSeleced": [
    "<cell content HTML>",
    "..."
  ],
  "componentId": "page1234-5-6",
  "isSubmitEnable": false,
  "attemptsDone": 1
}
```

---

## 8. High-Level Architectural Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                     TABLE GO COMPONENT                              │
└─────────────────────────────────────────────────────────────────────┘
                                    │
            ┌───────────────────────┴────────────────────────┐
            │                                                 │
            ▼                                                 ▼
┌──────────────────────┐                          ┌──────────────────────┐
│   EDITOR MODE        │                          │  PREVIEW/READER MODE │
│  (Authoring Tool)    │                          │   (Student View)     │
└──────────────────────┘                          └──────────────────────┘
            │                                                 │
    ┌───────┴───────┐                            ┌────────────┴─────────────┐
    ▼               ▼                            ▼                          ▼
┌─────────┐   ┌──────────┐              ┌──────────────┐        ┌──────────────┐
│Template │   │Directive │              │Modal Popup   │        │Jodit Editor  │
│HTML     │   │.js       │              │Editor        │        │(Optional)    │
└─────────┘   └──────────┘              └──────────────┘        └──────────────┘
    │               │                            │                          │
    │         ┌─────┴─────────────┐            │                          │
    │         ▼                   ▼             │                          │
    │   ┌─────────┐    ┌──────────────┐        │                          │
    │   │Settings │    │Context Menu  │        │                          │
    │   │Panel    │    │Operations    │        │                          │
    │   └─────────┘    └──────────────┘        │                          │
    │         │                │                │                          │
    │         │                │                │                          │
    └─────────┴────────────────┴────────────────┴──────────────────────────┘
                                    │
                    ┌───────────────┴────────────────┐
                    ▼                                ▼
            ┌──────────────┐              ┌──────────────────┐
            │   DATA MODEL │              │   SCORM/xAPI     │
            │   (JSON)     │              │   State Handler  │
            └──────────────┘              └──────────────────┘
                    │                                │
                    ▼                                ▼
            ┌──────────────┐              ┌──────────────────┐
            │   CSS STYLES │              │  LMS/Package     │
            │   (4 Themes) │              │  Integration     │
            └──────────────┘              └──────────────────┘

KEY OPERATIONS:
──────────────
  Author Creates Table → Configure Rows/Cols → Edit Cells → Merge/Format
                                                      ↓
  Student Interaction → Click Enabled Cell → Edit in Modal → Submit Answer
                                                      ↓
  Excel Paste → Sanitize Data → Expand Table → Apply Formatting → Save
```

### Data Flow Diagram

```
┌──────────────┐
│   Author     │
│  Configures  │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────┐
│  Create Table Dialog             │
│  - Rows (1-20)                   │
│  - Columns (1-20)                │
└──────┬───────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│  AngularJS Directive             │
│  - Table rendering               │
│  - Context menu                  │
│  - Cell editing                  │
│  - Excel paste handling          │
└──────┬───────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│  Data Model (fieldData)          │
│  - noOfRows, noOfCol             │
│  - headervalues[]                │
│  - celldata[]                    │
│  - cellcolors[]                  │
│  - mergedCellsList{}             │
│  - studentEnabledCells[]         │
│  - settings{}                    │
└──────┬───────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│  JSON Serialization              │
│  - Stored in savedJson           │
│  - Persisted to server           │
└──────┬───────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│  Package/Publish                 │
│  - Included in content package   │
└──────┬───────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│  Reader/Preview Render           │
│  - Parse JSON                    │
│  - Generate HTML Table           │
│  - Mark student-enabled cells    │
│  - Initialize Jodit (if enabled) │
└──────┬───────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│  Student Interaction             │
│  - Click enabled cell            │
│  - Edit in modal popup           │
│  - Validate input (≤2000 chars)  │
│  - Submit answer                 │
└──────┬───────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│  State Management                │
│  - Save cell values              │
│  - SCORM/xAPI tracking           │
│  - Disable editing after submit  │
└──────────────────────────────────┘
```

---

## 9. Visual Styles and Theming

### 9.1 Theme Comparison

| Feature | Style 1 | Style 2 | Style 3 | Style 4 |
|---------|---------|---------|---------|---------|
| Header Row | Black (#000) | Light (#f9fafb) | Dark Gray | Light |
| Text Color | White (header) | Black | White | Black |
| Odd Rows | White | White | #666 | White |
| Even Rows | #f0f0f0 | #f0f0f0 | #444 | #f2f8e9 |
| Border Style | 1px solid #ccc | 1px solid #ccc | 1px solid #ccc | 1px solid #ccc |
| Use Case | Formal | Clean/Minimal | High Contrast | Nature Theme |

### 9.2 Customization Options

**Row Colors:**
- Header color (color picker)
- Alternating row colors (2 colors)
- Cell-specific colors (preserved from paste)

**Borders:**
- Vertical lines (toggle on/off)
- Always horizontal lines
- Cell borders: 1px solid #ccc

**Alignment:**
- Vertical: Top / Middle / Bottom
- Horizontal: Left / Center / Right (via cell formatting)

**Outline Styles:**
- **None**: No component outline
- **Outline with Fill**: Background color + border

---

## 10. Excel Paste Feature (Deep Dive)

### 10.1 Supported Excel Features

✅ **Preserved:**
- Text content
- Bold, italic, underline formatting
- Font colors
- Background colors
- Merged cells (partial support)

⚠️ **Partially Supported:**
- Tables with complex merges
- Formulas (pasted as calculated values)

❌ **Not Supported:**
- Excel functions/formulas
- Conditional formatting
- Data validation
- Charts/graphs
- Hyperlinks
- Comments/notes

### 10.2 Sanitization Process

**Step 1: Extract HTML**
```javascript
const html = e.clipboardData.getData('text/html');
```

**Step 2: Parse Table Structure**
```javascript
const $temp = $('<div>').html(html);
const $rows = $temp.find('tr');
```

**Step 3: Clean Each Cell**
```javascript
function sanitizeCellHTML(html) {
  // Remove MS Office comments (<!--...-->)
  // Remove mso-* style attributes
  // Remove <style> and <script> tags
  // Preserve <b>, <i>, <u>, <span>
  // Keep color and font-family styles
  // Convert <font> to <span>
}
```

**Step 4: Expand Table**
```javascript
function ensureRows(table, requiredRows) {
  // Add rows if paste exceeds current table
}

function ensureCols(table, requiredCols) {
  // Add columns if paste exceeds current table
}
```

**Step 5: Apply Data**
```javascript
// Paste cells into target positions
// Restore merged cells outside paste region
```

### 10.3 Known Paste Issues

1. **Complex Merged Cells**: Multi-level merges may not preserve correctly
2. **Large Pastes**: Performance degrades with >100 cells
3. **Nested Tables**: Not supported, flattened to text
4. **Rich Media**: Images pasted as placeholders or text

---

## 11. Offline/Package Behavior

### 11.1 Package Contents
When published, the component includes:
- HTML template with table structure
- Cell data arrays (headervalues, celldata, cellcolors)
- Merged cell information
- Student editing configuration
- CSS stylesheets (including mCustomScrollbar)
- JavaScript files (directive, preview, resizable)
- Jodit editor bundle (if advanced formatting enabled)

### 11.2 Offline Functionality
✅ **Fully Supported:**
- Table rendering with all styles
- Cell selection and highlighting
- Visual theme application
- Custom scrollbars

✅ **Supported (if libraries bundled):**
- Student cell editing (requires Jodit if enabled)
- Math equation rendering (requires MathLive)

⚠️ **Limitations:**
- SCORM state persistence requires LMS connection
- Jodit editor requires internet if CDN-loaded
- Large tables may have performance issues on low-end devices

### 11.3 Asset Management
- No external images (uses CSS for styling)
- Inline cell content (HTML strings)
- All dependencies packaged with content

---

## 12. Error Handling

### 12.1 Validation Errors

```javascript
// Row/Column limits
if (noOfRows < 1 || noOfRows > 20) {
  // Show error or constrain to range
}

// Cell editing validation
if (textLength > 2000) {
  // Show error: "Text can have a maximum of 2000 characters"
  // Disable Add button
}

if (textLength === 0) {
  // Show error: "Text field cannot be empty"
  // Disable Add button
}
```

### 12.2 Runtime Errors

**Missing Dependencies:**
- jQuery not loaded → Fallback or error message
- AngularJS not loaded → Component fails to initialize
- Jodit not loaded → Fallback to plain text editor

**Invalid Data:**
- Missing cell data → Render empty cells
- Invalid merge coordinates → Skip merge
- Corrupted JSON → Use default configuration

**Browser Compatibility:**
- Contenteditable not supported → Disable editing
- SVG not supported → Use plain text tables
- Paste API not supported → Manual data entry only

### 12.3 User Input Errors

**Incomplete Actions:**
- Delete last row/column → Minimum 1 required, show warning

**Invalid Paste:**
- Non-table data → Paste as plain text into single cell
- Too large paste → Warn or auto-expand (up to 20x20)

**Concurrent Editing:**
- Multiple cells selected during context menu → Merge option
- No cells selected → Disable merge option

---

## 13. Known Issues

### 13.1 Critical Issues

1. **Excel Paste Performance**
   - **Issue**: Large Excel pastes (>100 cells) freeze UI
   - **Impact**: Poor user experience, potential timeouts
   - **Workaround**: Paste in smaller chunks
   - **Status**: Optimization needed (debouncing, web workers)

2. **Complex Merged Cell Handling**
   - **Issue**: Nested or overlapping merges may not restore correctly
   - **Impact**: Lost merge data after paste
   - **Workaround**: Manually re-merge cells
   - **Status**: Partial fix implemented, edge cases remain

3. **Memory Leak with Jodit**
   - **Issue**: Jodit instances not properly destroyed
   - **Impact**: Memory grows over time, especially with many tables
   - **Workaround**: Refresh page periodically
   - **Status**: Fix required in cleanup code

### 13.2 Minor Issues

1. **Modal Popup Position**
   - **Issue**: Modal may appear off-screen on small viewports
   - **Mitigation**: Dragto-move feature helps, but initial position could be better

2. **Context Menu Flicker**
   - **Issue**: Menu briefly appears in wrong position before repositioning
   - **Cause**: Offset calculation delay
   - **Impact**: Visual glitch, not functional

3. **Character Counter Delay**
   - **Issue**: Counter updates slightly after input
   - **Impact**: Minor UX issue, not critical

4. **Excel Comment Remnants**
   - **Issue**: Some Excel comments appear as visible text
   - **Status**: Most cases fixed, rare edge cases remain

### 13.3 Browser-Specific Issues

- **Safari**: Context menu positioning occasionally off
- **Firefox**: Contenteditable cursor position issues after paste
- **Edge**: Jodit toolbar may overlap modal on small screens
- **Mobile**: Context menu requires careful tap precision

---

## 14. Recommendations for Improvement

### 14.1 Performance Optimization

1. **Virtual Scrolling**: For tables >100 cells
2. **Lazy Loading**: Load Jodit only when needed
3. **Web Workers**: Offload Excel paste parsing
4. **Debouncing**: Reduce save frequency during rapid typing
5. **Memory Management**: Properly destroy Jodit instances

### 14.2 Accessibility Enhancements

1. **Keyboard Navigation**: 
   - Tab through cells
   - Arrow keys to navigate
   - Enter to edit cell
   - Esc to close modal
2. **Screen Reader Support**:
   - ARIA labels for all interactive elements
   - Announce table dimensions
   - Read cell coordinates on focus
3. **High Contrast Mode**: Support system preferences
4. **Focus Indicators**: Visible focus outlines for all elements
5. **Alt Text**: Enforce alt text for tables with images

### 14.3 Feature Enhancements

1. **Undo/Redo**: Global undo for table operations
2. **Cell Formatting Toolbar**: Quick bold/italic/color buttons
3. **Sort/Filter**: Sort table by column
4. **Export**: Export table to Excel/CSV
5. **Templates**: Pre-defined table templates (schedule, rubric, etc.)
6. **Cell Formulas**: Basic sum/average calculations
7. **Conditional Formatting**: Highlight cells based on rules
8. **Image in Cells**: Support inline images
9. **Bulk Operations**: Select and format multiple cells at once
10. **Version History**: Track table changes over time

### 14.4 Code Quality

1. **Migrate to Modern Framework**: 
   - Replace AngularJS 1.x with Angular/React/Vue
   - Use TypeScript for type safety
2. **Modularize Code**: 
   - Split 2926-line directive into smaller modules
   - Separate concerns (UI, data, validation)
3. **Unit Tests**: 
   - Test cell operations
   - Test paste sanitization
   - Test merge logic
4. **Documentation**: 
   - Add JSDoc comments
   - Create API reference
   - Document merge algorithms

### 14.5 UX Improvements

1. **Visual Feedback**:
   - Loading spinner during paste
   - Success confirmation after save
   - Undo visual cue
2. **Guided Tour**: First-time user walkthrough
3. **Context-Sensitive Help**: Tooltips on hover
4. **Error Prevention**:
   - Confirm before deleting rows/columns with data
   - Warn before large pastes
5. **Responsive Design**: Better mobile experience
6. **Dark Mode**: Support dark theme

### 14.6 Content Authoring

1. **Drag-to-Resize Rows**: Not just columns
2. **Cell Styles Library**: Save and reuse cell styles
3. **Table Import**: Import from CSV/Excel file
4. **Duplicate Table**: Clone entire table
5. **Cell History**: Track changes to individual cells
6. **Collaboration**: Multi-user editing (real-time)

---

## 15. Integration Points

### 15.1 Main Application Integration

The component integrates with the main authoring application through:

1. **Angular Controller** (`myController`):
   - Manages global state (`savedJson`)
   - Handles save operations
   - Coordinates settings panel display

2. **Common Directives**:
   - `add-common-hover`: Hover effects
   - `edittemplate`: Template editing mode
   - `commonbuttons`: Action button rendering (Submit)

3. **Modal Service**: For image upload and dialogs

4. **Settings Panel**: Right-side configuration panel

### 15.2 Settings Panel Communication

```javascript
// Settings panel opened via click on table
$(element).parents('.sd-item').bind('click', function(e) {
  // Load table settings
  // Display settings panel with URL: settingsPath + "?t=" + timestamp
});

// Settings changes propagated via watchers
$scope.$watch('currSettings.headerColor', function(newVal) {
  // Apply header color to table
});
```

### 15.3 SCORM/xAPI Integration

```javascript
// Save state to LMS:
if (typeof apiHandle != "undefined") {
  stateMainatainTableGO($table);
  // Calls: saveAction(event, scoObj)
}
```

**Required Functions:**
- `apiHandle`: SCORM API handle
- `saveAction(event, scoObj)`: Save state to LMS

### 15.4 External Dependencies

**Required Libraries:**
- jQuery 1.9.1+
- jQuery UI
- jQuery mCustomScrollbar
- AngularJS 1.x
- Bootstrap (for modal/dropdown)

**Optional Libraries:**
- Jodit WYSIWYG Editor (for advanced formatting)
- MathLive (for math equations)

---

## 16. Testing Recommendations

### 16.1 Functional Testing
- [ ] Create table (various dimensions: 1x1, 10x10, 20x20)
- [ ] Insert row (above/below, at start/middle/end)
- [ ] Delete row (minimum 1 row protection)
- [ ] Insert column (left/right, at start/middle/end)
- [ ] Delete column (minimum 1 column protection)
- [ ] Merge cells (2x2, 3x3, irregular shapes)
- [ ] Unmerge cells
- [ ] Edit cell content (text, formatting)
- [ ] Resize columns
- [ ] Context menu on various cell states
- [ ] Student cell editing (modal popup)
- [ ] Character limit enforcement (2000 chars)
- [ ] Submit answer
- [ ] SCORM state save/restore

### 16.2 Excel Paste Testing
- [ ] Simple table (2x2)
- [ ] Large table (20x20)
- [ ] Table with merged cells
- [ ] Table with formatting (bold, colors)
- [ ] Table exceeding current dimensions
- [ ] Table with comments
- [ ] Table with formulas
- [ ] Paste into merged cell
- [ ] Paste over existing data

### 16.3 Edge Case Testing
- [ ] Maximum table size (20x20)
- [ ] Minimum table size (1x1)
- [ ] Delete all content
- [ ] Very long text in cell (>10,000 chars)
- [ ] Paste HTML from non-Excel source
- [ ] Rapid context menu open/close
- [ ] Multiple selections during merge
- [ ] Resize column to minimum width
- [ ] Highly nested HTML in cell

### 16.4 Cross-Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### 16.5 Accessibility Testing
- [ ] Screen reader navigation (NVDA, JAWS)
- [ ] Keyboard-only navigation
- [ ] High contrast mode
- [ ] Zoom levels (up to 200%)
- [ ] Color blindness simulation

### 16.6 Performance Testing
- [ ] Load time with 20x20 table
- [ ] Paste performance (100+ cells)
- [ ] Memory usage over time
- [ ] Context menu latency
- [ ] Save operation duration

---

## 17. Maintenance and Support

### 17.1 Dependency Updates

**Critical Dependencies:**
- jQuery 1.9.1+ (consider migrating to 3.x)
- jQuery UI 1.10.3+ (latest: 1.13.x)
- jQuery mCustomScrollbar (consider native scrollbars)
- AngularJS 1.x (EOL: consider migration to modern framework)
- Jodit 3.x+ (keep updated for security)

**Update Risks:**
- AngularJS breaking changes → major rewrite
- jQuery API changes → minimal impact
- Jodit breaking changes → fallback to plain text

### 17.2 Browser Support Matrix

| Browser          | Minimum Version | Status      | Notes |
|------------------|-----------------|-------------|-------|
| Chrome           | 90+             | ✅ Supported | Full support |
| Firefox          | 88+             | ✅ Supported | Full support |
| Safari           | 14+             | ✅ Supported | Minor context menu issues |
| Edge             | 90+             | ✅ Supported | Full support |
| Mobile Safari    | 14+             | ✅ Supported | Touch support via UI Touch Punch |
| Chrome Mobile    | 90+             | ✅ Supported | Full support |
| Internet Explorer| 11              | ⚠️ Limited   | Performance issues, no support |

### 17.3 File Size Metrics
- `tableGO-directive.js`: ~120KB (2926 lines)
- `tableGO-preview1.js`: ~22KB (605 lines)
- `tableGO-template.css`: ~23KB (699 lines)
- `tableGO.json`: ~12KB (default)
- **Total Component Size**: ~180KB (excluding Jodit)

### 17.4 Version History
- **v1.0**: Initial release with basic table functionality
- **vCurrent**: Enhanced Excel paste, student editing, 4 themes, advanced formatting

---

## 18. Security Considerations

### 18.1 Input Sanitization

- ⚠️ **XSS Risk**: Contenteditable cells allow HTML injection
- **Mitigation**: `sanitizeCellHTML()` removes dangerous tags and scripts
- **Status**: Partial protection (need more thorough sanitization)

**Current Sanitization:**
```javascript
// Removes: <script>, <style>, MS Office comments, mso-* attributes
// Preserves: <b>, <i>, <u>, <span> with color/font-family
// Risk: Potential for XSS via event handlers (onclick, onerror)
```

**Recommendations:**
- Use DOMPurify for robust sanitization
- Whitelist allowed tags and attributes
- Strip all event handlers
- Validate color values (prevent `expression()` in IE)

### 18.2 Excel Paste Security

- ⚠️ **Malicious Excel Files**: Could contain scripts or macros
- **Mitigation**: Paste as values only (formulas not executed)
- **Status**: Safe from formula execution, but HTML/CSS injection possible

**Recommendations:**
- Scan pasted content for suspicious patterns
- Limit HTML complexity
- Implement Content Security Policy (CSP)

### 18.3 State Management

- ✅ **SCORM State**: Read-only after submission (prevent tampering)
- ⚠️ **Local Storage**: Clear sensitive data on logout
- **Status**: Basic security, could be improved

---

## 19. Conclusion

The **Table GO** component is a powerful and feature-rich table authoring and rendering tool designed for educational content. Its support for complex operations (merge/unmerge, Excel paste, student editing) and 4 visual themes makes it suitable for a wide range of use cases.

**Strengths:**
- Comprehensive table editing capabilities
- Excel paste with intelligent sanitization
- Student interaction with modal popup editor
- Multiple visual themes
- Column resizing and cell formatting
- Context menu for quick operations
- SCORM/xAPI integration

**Areas for Improvement:**
- Performance optimization (large tables, Excel paste)
- Accessibility enhancements (keyboard navigation, ARIA labels)
- Modern framework migration (AngularJS 1.x EOL)
- Enhanced error handling and validation
- Better documentation and testing
- Security hardening (XSS prevention)

**Recommended Next Steps:**
1. Implement performance optimizations (web workers for paste, virtual scrolling)
2. Add comprehensive unit and integration tests
3. Implement accessibility improvements (WCAG 2.1 AA)
4. Plan migration to modern JavaScript framework
5. Conduct security audit and implement DOMPurify
6. Add keyboard shortcuts and undo/redo
7. Conduct user testing with educators and learners

---

## 20. Appendix

### A. Glossary
- **Table GO**: Interactive table component with authoring and student editing
- **Merged Cell**: Cell spanning multiple rows/columns (rowspan/colspan)
- **Context Menu**: Right-click menu for table operations
- **Student Enabled Cell**: Cell editable by students in preview/reader mode
- **Jodit**: WYSIWYG editor for advanced text formatting
- **Sanitization**: Process of cleaning HTML to remove dangerous content
- **SCORM**: Sharable Content Object Reference Model (e-learning standard)

### B. Color Palette
- **Header Colors**: Configurable (default #CFBA99)
- **Alternating Rows**: Configurable (default #faf8f5, #f5f1eb)
- **Borders**: #ccc (light gray)
- **Student Enabled Cells**: #113e9a (blue border)
- **Selected Cells**: #dedede background, #714cda border
- **Outline Background**: Configurable (5 preset options + custom)

### C. Character Limits
- **Cell Content**: 2000 characters (enforced in preview mode)
- **Alt Text**: 2000 characters
- **Caption**: No enforced limit

### D. Table Limits
- **Minimum**: 1 row × 1 column
- **Maximum**: 20 rows × 20 columns
- **Merged Cells**: No hard limit, but complex merges may have issues

### E. References
- AngularJS Documentation: https://docs.angularjs.org/
- jQuery UI: https://jqueryui.com/
- Jodit Editor: https://xdsoft.net/jodit/
- MathLive: https://cortexjs.io/mathlive/
- SCORM 2004: https://scorm.com/scorm-explained/technical-scorm/

