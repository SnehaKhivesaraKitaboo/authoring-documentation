# Text (Paragraph) Element — Technical Documentation

## Table of Contents
1. [Overview](#overview)
2. [Component Architecture](#component-architecture)
3. [File Structure](#file-structure)
4. [Data Model](#data-model)
5. [Style Variants & Layout Modes](#style-variants--layout-modes)
6. [Floating Text Toolbar](#floating-text-toolbar)
7. [Editor Mode Implementation](#editor-mode-implementation)
8. [Settings Panel Reference](#settings-panel-reference)
9. [Authoring Flow](#authoring-flow)
10. [Preview Mode Behavior](#preview-mode-behavior)
11. [Integration & Dependencies](#integration--dependencies)
12. [CSS Reference](#css-reference)
13. [Known Behaviors & Notes](#known-behaviors--notes)
14. [Checklist for Implementation](#checklist-for-implementation)

---

## Overview

### Purpose

The **Text (Paragraph) Element** (`dataType: "paragraph"`) is the primary rich-text body content component in KITABOO Authoring. It supports standard body paragraphs, blockquotes with attribution, pull-quotes, inline image embedding with text wrap, numbered question labels (Q1/Q2), and math equation insertion. A shared floating text toolbar activates on text selection providing full formatting capabilities.

### Key Capabilities

- Standard body text paragraphs with full rich text formatting
- **Blockquote** style with optional author attribution line
- **Pull-quote** style — large emphasized text block
- **Inline image embedding** — text wraps around uploaded inline images (splitParagraph layout)
- **Paragraph number badge** — Q1., Q2. style labels for numbered question sets
- **Label type** — Primary / Secondary overlay label for question presentation
- **Math equations** — MathJax/MathLive embedding via floating toolbar
- Shared floating text toolbar with 15+ formatting options
- Apply All / Ignore Apply All for style consistency

### Component Identifier

```javascript
"dataType": "paragraph"
```

### Component Registration (config.js)

```javascript
{
  name: "Text",
  dataType: "paragraph",
  url: "templates/paragraph/paragraph.html",
  json: "templates/paragraph/default/paragraph.json",
  settingsURL: "templates/paragraph/paragraph_settings.html",
  iconClass: "icon-text-paragraph"
}
```

---

## Component Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                      KITABOO Authoring Tool                          │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  config.js ────────────► ngcontroller.js ─────► $compile             │
│  (dataType:"paragraph")    (drag-drop)          (canvas inject)      │
│                                 │                                    │
│                                 ▼                                    │
│             ┌─────────────────────────────────────┐                 │
│             │  paragraph.html (Canvas Template)    │                 │
│             │  [paragraphTemplate directive]       │                 │
│             │  Contenteditable rich-text div       │                 │
│             └─────────────────────────────────────┘                 │
│                     │                    │                           │
│                     ▼                    ▼                           │
│       ┌──────────────────────┐  ┌──────────────────────────┐        │
│       │ paragraph-directive  │  │  paragraph_settings.html  │        │
│       │      .js             │  │   (Settings Panel)        │        │
│       └──────────────────────┘  └──────────────────────────┘        │
│                     │                    │                           │
│                     ▼                    ▼                           │
│              fieldData              Settings Controls:               │
│              - header (HTML)         - Style selector                │
│              - authorName            - Label type                    │
│              - question              - Paragraph number              │
│              - ignoreApplyAll        - Author name toggle            │
│                                                                      │
│                     │                                                │
│                     ▼                                                │
│       ┌──────────────────────────────────────────┐                  │
│       │  floatingTextPanel.js (Shared Toolbar)    │                  │
│       │  Activates on text selection              │                  │
│       │  - Bold/Italic/Underline...               │                  │
│       │  - Math equations (MathLive)              │                  │
│       │  - Inline image upload                    │                  │
│       └──────────────────────────────────────────┘                  │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## File Structure

```
KITABOO_Authoring/
│
├── templates/
│   └── paragraph/
│       ├── paragraph.html              ← AngularJS canvas template
│       ├── paragraph_settings.html     ← Right-side settings panel
│       ├── scripts/
│       │   ├── paragraph-directive.js  ← paragraphTemplate directive
│       │   └── paragraph-preview1.js  ← Preview/reader mode handler
│       └── default/
│           └── paragraph.json         ← Default configuration JSON
│
├── editor/
│   └── floatingTextPanel.js            ← Shared floating toolbar (all text elements)
│
└── css/
    └── authoring/
        └── floatingTextPanel.css       ← Toolbar styles
```

### File Descriptions

#### `paragraph.html` — Canvas Template
- **Purpose**: Rendered component HTML on the authoring canvas
- **Key element**: `<div contenteditable="true" ng-model="fieldData.header">` — rich HTML content
- **Style switching**: `ng-class` applies `classparagraphg1`, `classparagraphg2`, `classparagraphg3`
- **Conditional rendering**: `ng-if` for paragraph number badge, author name, label type

#### `paragraph-directive.js` — Core Directive
- **Purpose**: AngularJS directive `paragraphTemplate` — manages style changes, label logic, number badge
- **Key functions**: `changeStyle()`, `toggleLabel()`, `toggleAuthorName()`, `setParagraphNumber()`

#### `paragraph-preview1.js` — Preview Mode
- **Purpose**: Adapts paragraph for preview — disables contenteditable, hides floating toolbar

#### `paragraph.json` — Default Configuration

```json
{
  "identifier": "paragraph",
  "header": "<p>Enter your text here...</p>",
  "authorName": "",
  "question": "",
  "secondaryQuestion": "",
  "ignoreApplyAll": false,
  "settings": {
    "classparagraphg1": "",
    "classparagraphg2": "",
    "classparagraphg3": "",
    "paragrahNumberShow": false,
    "paragrahNumber": "",
    "isLabelTypeParagraph": false,
    "labelType": "primary",
    "allowAuthorName": false,
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
| `identifier` | string | `"paragraph"` | Component type identifier |
| `header` | string (HTML) | `"<p>...</p>"` | Main body content — stores raw HTML |
| `authorName` | string | `""` | Attribution text for blockquote (rendered when `allowAuthorName=true`) |
| `question` | string | `""` | Primary label question text |
| `secondaryQuestion` | string | `""` | Secondary label question text |
| `ignoreApplyAll` | boolean | `false` | Exclude from Apply All |
| `settings` | object | `{}` | All display and layout settings |

### `settings` Object

| Field | Type | Default | Description |
|---|---|---|---|
| `classparagraphg1` | string | `""` | Base paragraph style class |
| `classparagraphg2` | string | `""` | Variant: `"blockquote"` / `"pull-quote"` / `""` |
| `classparagraphg3` | string | `""` | Additional modifier class |
| `paragrahNumberShow` | boolean | `false` | Show/hide paragraph number badge |
| `paragrahNumber` | string | `""` | Paragraph number text (e.g., "Q1.") |
| `isLabelTypeParagraph` | boolean | `false` | Show question label overlay |
| `labelType` | string | `"primary"` | `"primary"` or `"secondary"` |
| `allowAuthorName` | boolean | `false` | Show author attribution (blockquote only) |
| `metaTags` | array | `[]` | Content search metadata tags |
| `dimensionInfo` | array | `[]` | Inline image dimension tracking |

> **Note**: `paragrahNumber` and `paragrahNumberShow` contain a known typo in the codebase ("paragrah" not "paragraph"). This exact spelling must be preserved for compatibility.

### Complete fieldData Example — Blockquote with Author

```json
{
  "identifier": "paragraph",
  "header": "<p>The only way to do great work is to love what you do.</p>",
  "authorName": "Steve Jobs, Stanford Commencement Speech 2005",
  "question": "",
  "secondaryQuestion": "",
  "ignoreApplyAll": false,
  "settings": {
    "classparagraphg1": "",
    "classparagraphg2": "blockquote",
    "classparagraphg3": "",
    "paragrahNumberShow": false,
    "paragrahNumber": "",
    "isLabelTypeParagraph": false,
    "labelType": "primary",
    "allowAuthorName": true,
    "metaTags": ["quote", "inspiration"],
    "dimensionInfo": []
  }
}
```

### Complete fieldData Example — Numbered Question

```json
{
  "identifier": "paragraph",
  "header": "<p>What are the three main causes of climate change?</p>",
  "authorName": "",
  "question": "Reflect on what you've learned.",
  "secondaryQuestion": "",
  "ignoreApplyAll": false,
  "settings": {
    "classparagraphg1": "",
    "classparagraphg2": "",
    "classparagraphg3": "",
    "paragrahNumberShow": true,
    "paragrahNumber": "Q1.",
    "isLabelTypeParagraph": true,
    "labelType": "primary",
    "allowAuthorName": false,
    "metaTags": [],
    "dimensionInfo": []
  }
}
```

---

## Style Variants & Layout Modes

| Mode | `classparagraphg2` | Visual Description |
|---|---|---|
| Standard | `""` | Default body text paragraph |
| Blockquote | `"blockquote"` | Indented quote with left bar, optional attribution |
| Pull-quote | `"pull-quote"` | Large centered emphasized text |
| Inline Image | `""` (splitParagraph class) | Text wraps around uploaded inline image |

### Visual Reference

```
STANDARD:
Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Sed do eiusmod tempor incididunt ut labore et dolore magna.

BLOCKQUOTE:
    │ "The only way to do great work is to love what you do."
    │                                    — Steve Jobs, 2005

PULL-QUOTE:
         "Education is the most powerful weapon
          which you can use to change the world."

NUMBERED LABEL:
  Q1. │ What are the three main causes of climate change?
```

---

## Floating Text Toolbar

The floating text toolbar (`floatingTextPanel.js`) activates on text selection within the paragraph contenteditable area:

| Toolbar Feature | Function | Output |
|---|---|---|
| **Bold** | `execCommand('bold')` | `<strong>` |
| **Italic** | `execCommand('italic')` | `<em>` |
| **Underline** | `execCommand('underline')` | `<u>` |
| **Strikethrough** | `execCommand('strikeThrough')` | `<s>` |
| **Font Family** | Font picker dropdown | `<span style="font-family:...">` |
| **Font Size** | Size picker | `<span style="font-size:...">` |
| **Text Color** | Color picker | `<span style="color:...">` |
| **Background Color** | Color picker | `<span style="background-color:...">` |
| **Align Left/Center/Right/Justify** | `execCommand('justify*')` | Block alignment |
| **Ordered List** | `execCommand('insertOrderedList')` | `<ol><li>` |
| **Unordered List** | `execCommand('insertUnorderedList')` | `<ul><li>` |
| **Hyperlink** | URL dialog | `<a href="...">` |
| **Superscript** | `execCommand('superscript')` | `<sup>` |
| **Subscript** | `execCommand('subscript')` | `<sub>` |
| **Math Equation** | MathLive panel | `<math-live>` or MathJax markup |
| **Inline Image** | Upload → splitParagraph layout | `<img>` embedded in HTML |

> **Important**: All formatting is stored inside `fieldData.header` as raw HTML markup. The HTML string grows with each format operation.

---

## Editor Mode Implementation

### Canvas Template Key Pattern

```html
<div class="component-holder paragraph-container" paragraph-template>

  <!-- Paragraph number badge -->
  <div class="paragraph-badge" ng-if="fieldData.settings.paragrahNumberShow">
    {{fieldData.settings.paragrahNumber}}
  </div>

  <!-- Label overlay (Q1. style) -->
  <div class="label-overlay {{fieldData.settings.labelType}}"
       ng-if="fieldData.settings.isLabelTypeParagraph">
    {{fieldData.settings.labelType === 'primary' ? fieldData.question : fieldData.secondaryQuestion}}
  </div>

  <!-- Main content area -->
  <div class="paragraph-content {{fieldData.settings.classparagraphg1}}
                                  {{fieldData.settings.classparagraphg2}}
                                  {{fieldData.settings.classparagraphg3}}"
       contenteditable="true"
       ng-model="fieldData.header">
  </div>

  <!-- Blockquote author attribution -->
  <div class="author-name"
       ng-if="fieldData.settings.allowAuthorName && fieldData.settings.classparagraphg2 === 'blockquote'"
       contenteditable="true"
       ng-model="fieldData.authorName">
  </div>

</div>
```

### Key Directive Functions

| Function | Parameters | Purpose |
|---|---|---|
| `changeStyle(g1, g2, g3)` | Style class strings | Updates all three style class fields |
| `toggleParagraphNumber()` | none | Toggles `paragrahNumberShow` |
| `setParagraphNumber(num)` | `num: string` | Sets `paragrahNumber` text |
| `toggleLabel()` | none | Toggles `isLabelTypeParagraph` |
| `setLabelType(type)` | `"primary"/"secondary"` | Updates `labelType` |
| `toggleAuthorName()` | none | Toggles `allowAuthorName` |
| `handleInlineImageUpload(imgData)` | `imgData: object` | Embeds image into HTML, updates `dimensionInfo[]` |

---

## Settings Panel Reference

| Setting | Control Type | Binding | Values / Constraints |
|---|---|---|---|
| **Style** | Button group | `fieldData.settings.classparagraphg2` | `""` / `"blockquote"` / `"pull-quote"` |
| **Paragraph Number** | Checkbox + text input | `paragrahNumberShow` + `paragrahNumber` | Any string; shown when checkbox is on |
| **Label Type** | Radio + checkbox | `isLabelTypeParagraph` + `labelType` | `"primary"` / `"secondary"` |
| **Author Name** | Checkbox | `allowAuthorName` | Only relevant when blockquote style |
| **Ignore Apply All** | Checkbox | `fieldData.ignoreApplyAll` | `true` = excluded from Apply All |
| **Meta Tags** | Tag input | `fieldData.settings.metaTags[]` | Array of keyword strings |

---

## Authoring Flow

### Step-by-Step Sequence

```
1. Author drags Text element from Elements panel onto canvas
       ↓
2. ngcontroller.js $compile(paragraph.html) → injects component
   fieldData initialized from paragraph.json
       ↓
3. Paragraph renders with placeholder text in contenteditable area
       ↓
4. Author clicks into the text area
   contenteditable activates — cursor appears
       ↓
5. Author types or pastes text content
       ↓
6. Author selects text → floatingTextPanel.js shows toolbar
   Author applies formatting (bold, color, alignment, etc.)
   HTML markup stored in fieldData.header
       ↓
7. Author opens settings panel:
   - Selects style (blockquote / pull-quote)
   - Toggles paragraph number + types number text
   - Toggles label type for question presentation
   - Enables author attribution for blockquote
       ↓
8. Author inserts math equation:
   Toolbar → Math icon → MathLive editor opens
   Equation saved as markup inside fieldData.header HTML
       ↓
9. Save → fieldData.header (HTML) persisted to savedJson
```

---

## Preview Mode Behavior

| Property | Editor Mode | Preview Mode |
|---|---|---|
| Text editing | Contenteditable active | `contenteditable="false"` |
| Floating toolbar | Shows on text selection | Hidden |
| Paragraph number badge | Visible | Visible |
| Label overlay | Visible | Visible |
| Author attribution | Visible | Visible |
| Math equations | May show MathLive placeholder | Fully rendered |

---

## Integration & Dependencies

| Dependency | Role | Notes |
|---|---|---|
| `paragraph-directive.js` | Core directive `paragraphTemplate` | Style changes, label management |
| `paragraph-preview1.js` | Preview mode adapter | Disables editing |
| `editor/floatingTextPanel.js` | Shared floating toolbar | Activates on text selection |
| `editor/contenteditable-ng-model-directive.js` | `ng-model` on contenteditable | Two-way binding for `fieldData.header` |
| `css/authoring/floatingTextPanel.css` | Toolbar styles | Shared |
| MathLive / MathJax | Math equation rendering | Loaded globally |
| `ShellService` | Inline image upload | Triggered from toolbar |

---

## CSS Reference

| CSS Class | Description |
|---|---|
| `.paragraph-container` | Root element wrapper |
| `.paragraph-content` | Main contenteditable text area |
| `.blockquote` | Blockquote indented style |
| `.pull-quote` | Large emphasis text style |
| `.paragraph-badge` | Numbered badge (Q1., Q2.) |
| `.label-overlay` | Question label overlay |
| `.author-name` | Attribution line for blockquote |
| `.splitParagraph` | Inline image + text wrap layout |
| `.primary` | Primary label style |
| `.secondary` | Secondary label style |

---

## Known Behaviors & Notes

1. **`fieldData.header` stores raw HTML**: The main content field contains HTML markup including tags like `<strong>`, `<span style="...">`, math markup, etc. Save/load operations must handle HTML encoding correctly — do not double-encode.

2. **Typo in codebase preserved**: `paragrahNumberShow` and `paragrahNumber` (not "paragraph") are the exact field names in `fieldData.settings`. This typo exists in the JSON schema, directive, and template — all must use the same spelling.

3. **floatingTextPanel activates on any selection**: The shared toolbar registers a `document.addEventListener('mouseup')` — it will appear for any selected text in any contenteditable on the page, not just the paragraph element.

4. **Math equations in HTML string**: Math equations are embedded as markup tags inside `fieldData.header`. When the HTML is loaded back, MathJax/MathLive must process the markup for proper rendering. Rendering order matters — content loaded before MathJax initialized = broken equations.

5. **Inline image creates splitParagraph layout**: When an inline image is inserted from the floating toolbar, a CSS class `splitParagraph` is added to the container. The image URL is also stored in `dimensionInfo[]` for package processing.

6. **authorName only shown when both conditions true**: `allowAuthorName=true` AND `classparagraphg2="blockquote"` — if style is changed away from blockquote, authorName text is hidden but data preserved.

7. **Apply All behavior**: Apply All for paragraph primarily affects style class sync. However, `fieldData.header` (the HTML content) is NEVER overwritten by Apply All — only structural style classes are updated.

8. **Label type and question/secondaryQuestion**: `question` field is shown when `labelType="primary"`, `secondaryQuestion` when `labelType="secondary"`. Both fields are always persisted regardless of current labelType.

9. **Floating toolbar hyperlinks**: Links inserted via toolbar create `<a href="...">` tags in `fieldData.header`. Internal page links use KITABOO-specific URL schemes. External links open in new window in reader.

10. **Content Security**: `fieldData.header` is rendered via `ng-bind-html` which uses Angular's `$sce.trustAsHtml()`. This allows any HTML — content not sanitized at the component level. Platform-level sanitization is relied upon.

---

## Checklist for Implementation

### For Authors
- [ ] Click into the text area to activate contenteditable
- [ ] Select text to reveal the floating toolbar
- [ ] Use toolbar for formatting (not browser right-click)
- [ ] Enable paragraph number if this is a numbered question set
- [ ] Choose blockquote style for quoted material and enable author attribution
- [ ] Use pull-quote for key takeaway statements
- [ ] Add meta tags for search discoverability

### For Developers
- [ ] Verify `contenteditable-ng-model-directive.js` loaded before `paragraph-directive.js`
- [ ] Confirm `floatingTextPanel.js` registers `mouseup` after DOM is ready
- [ ] Test math equation rendering after fieldData load (MathJax/MathLive init timing)
- [ ] Validate HTML encoding on save/load cycle (no double-encoding)
- [ ] Test `paragrahNumber` (not "paragraph") field name in JSON schema
- [ ] Confirm inline image upload updates both `fieldData.header` and `dimensionInfo[]`
- [ ] Test blockquote + author attribution toggle sequence
- [ ] Verify Apply All does NOT overwrite `fieldData.header` content
