# Author Top Bar (Docked Text Editor Panel) — Technical Documentation

## Table of Contents
1. [Overview](#overview)
2. [Component Architecture](#component-architecture)
3. [File Structure](#file-structure)
4. [Directive & Template](#directive--template)
5. [Features Flow](#features-flow)
6. [Integration with Elements, Layout, TOC, Widgets](#integration-with-elements-layout-toc-widgets)
7. [API Reference](#api-reference)
8. [Known Behaviors & Notes](#known-behaviors--notes)
9. [Checklist for Implementation](#checklist-for-implementation)

---

## Overview

### Purpose

The **Author Top Bar** (implemented as the **Docked Text Editor Panel**) is the shared Rich Text Editor (RTE) toolbar in KITABOO Authoring. It appears as a horizontal bar of formatting controls when the author focuses or selects text inside any contenteditable area that supports rich text — including **Elements** (Title, Header, Text, Callout Box, Thumbs Card Header, Lesson Opener), **Layout** content areas, and **Widgets** (e.g. Extended Response, Table GO, Graphic Organizer, Annotation). The panel is rendered by the AngularJS directive `dockedtexteditorpanel` and uses the template `templates/textEditor.html`; formatting is applied via `document.execCommand` and the shared logic in `editor/floatingTextPanel.js`.

### Key Capabilities

- **Font family** and **font size** selection
- **Bold**, **Italic**, **Underline**, **Strikethrough**
- **Text color** and **background/highlight color**
- **Subscript** and **Superscript**
- **Clear formatting**
- **Alignment**: Left, Center, Right, Justify
- **Line height**: 1, 1.15, 1.5, 2
- **Ordered list** and **Unordered list**
- **Indent** and **Outdent**
- **Hyperlink**: Internal link, External link, Apply Glossary
- **Insert image** (inline)
- **Math Editor** (equation insertion)
- **Split text** (split paragraph)
- **Special character** insertion
- **Format painter** (copy format)

### Component Identifier

```html
<dockedtexteditorpanel id="editor" ng-class="{'edit': isSidebarVisible==false}" class="docked-text-editor"></dockedtexteditorpanel>
```

- **Directive name**: `dockedtexteditorpanel`
- **Restrict**: Element (`E`)
- **Template**: `templates/textEditor.html`
- **CSS class**: `docked-text-editor`
- **Inner container**: `.editing-container` (holds the toolbar `<ul class="editor-list">`)

---

## Component Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                     KITABOO Authoring (index.html)                   │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  <dockedtexteditorpanel id="editor" class="docked-text-editor">      │
│       │                                                              │
│       └── templateUrl: templates/textEditor.html                    │
│               │                                                      │
│               └── <div class="editing-container">                   │
│                       └── <ul class="editor-list">                  │
│                               ├── Format painter                    │
│                               ├── Font family (#font-family)        │
│                               ├── Font size (#font-size)            │
│                               ├── Bold / Italic / Underline         │
│                               ├── Text color / Background color     │
│                               ├── Strikethrough / Sub / Super       │
│                               ├── Clear formatting                  │
│                               ├── Align L / C / R / Justify         │
│                               ├── Line height dropdown              │
│                               ├── Ordered / Unordered list          │
│                               ├── Indent left / right               │
│                               ├── Link (Internal / External / Glossary) │
│                               ├── Insert image                      │
│                               ├── Math Editor (equation)             │
│                               ├── Split text                        │
│                               └── Special character                 │
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤
│  editor/floatingTextPanel.js (global functions)                      │
│  ├── editDoc(sCmd, sValue, flag)  → floatingPanelApply()             │
│  ├── allowCopyFormat()            → Format painter state            │
│  ├── onfontSizeChange(value)      → changefontSize()                 │
│  ├── changeLineHeight(value)       → line-height CSS                  │
│  ├── btnactiveClass(elm, obj)    → toggle button state             │
│  └── clickRemoveFormat()         → clear formatting                 │
│                                                                      │
│  editor/ngcontroller.js                                             │
│  ├── Color pickers (foreColor, backColor) → editDoc("foreColor"|"backColor", color) │
│  ├── addEditHyperLink(event, type)       → Internal/External/Glossary │
│  ├── onMathLiveClick(event)              → Math equation popup      │
│  ├── splitPara()                         → Split paragraph          │
│  ├── insertChar(char)                    → Special character        │
│  └── .docked-text-editor .open removal on blur/click outside        │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## File Structure

```
KITABOO_Authoring/
│
├── index.html
│   └── <dockedtexteditorpanel id="editor" class="docked-text-editor">
│
├── editor/
│   ├── ngdragdrop.js          ← App.directive("dockedtexteditorpanel", ...)
│   └── floatingTextPanel.js   ← editDoc(), floatingPanelApply(), changeLineHeight(), etc.
│
├── templates/
│   └── textEditor.html       ← Full toolbar markup (editing-container + editor-list)
│
├── css/
│   └── authoring/
│       └── floatingTextPanel.css  ← .docked-text-editor, .editing-container, toolbar styles
│
└── editor/ngcontroller.js     ← Color picker handlers, addEditHyperLink, onMathLiveClick, splitPara, insertChar
```

---

## Directive & Template

### Directive Definition (ngdragdrop.js)

```javascript
App.directive("dockedtexteditorpanel", function($timeout, $compile) {
  return {
    restrict: "E",
    templateUrl: 'templates/textEditor.html',
    link: function(scope, elem, attrs) {
      // No additional link logic; template is static toolbar
    }
  };
});
```

### Template Root (textEditor.html)

The template is a single `<div class="editing-container col-lg-5 col-md-7">` containing one `<ul class="editor-list">`. Each toolbar feature is a `<li>` containing either a `<button>`, a `<select>`, or a dropdown (`<button data-toggle="dropdown">` + `<ul class="dropdown-menu">`). Buttons call global functions (e.g. `editDoc('bold')`, `changeLineHeight('1.5')`) or Angular scope methods (e.g. `addEditHyperLink(event, 'external')`, `onMathLiveClick(event)`).

### Visibility & Layout

- The panel is shown/hidden via `$(".docked-text-editor").toggle()` (e.g. from ngdragdrop when entering/exiting a mode).
- When the left sidebar is hidden (`isSidebarVisible == false`), the element gets class `edit` via `ng-class="{'edit': isSidebarVisible==false}"`, which can be used to adjust width or position.
- The width of `.editing-container` is sometimes set to `whitePageWidth` (e.g. in ngcontroller/ngdragdrop) to align with the canvas width.

---

## Features Flow

### 1. Font and Size

| Control | HTML / ID | Action |
|---------|-----------|--------|
| Font family | `<select id="font-family">` | `onchange="editDoc('fontname', this[this.selectedIndex].value); fontChange(...)"` |
| Font size | `<select id="font-size">` + `.fontSizeViewport` | `onchange="editDoc('fontSize', this[this.selectedIndex].value)"` → `floatingPanelApply('fontSize', value)` → `onfontSizeChange(value)` → `changefontSize("fontSize", value)` (converts to rem, applies to selection) |

**Flow**: Select font/size → `editDoc()` → `floatingPanelApply()` → `document.execCommand(sCmd, false, sValue)` (or custom font-size handling). Only applies when selection is inside `[data-type="paragraph"]`, `[data-type="header"]`, or `[data-type="chapter-headingNew-h1"]`.

### 2. Bold, Italic, Underline, Strikethrough, Subscript, Superscript

| Feature | execCommand / Behavior |
|---------|-------------------------|
| Bold | `editDoc('bold')` → `document.execCommand('bold', false, null)` (italic has custom span wrap for .italics/.nonItalics) |
| Italic | Custom: wrap selection in `<span class="italics|nonItalics">` with font-style |
| Underline | `document.execCommand('underline', false, null)` |
| Strikethrough | `document.execCommand('strikethrough', false, null)` |
| Subscript | `document.execCommand('subscript', false, null)` |
| Superscript | `document.execCommand('superscript', false, null)` |

**Apply All**: When selection is inside a component with `data-applyall` and `ignoreApplyAll == false`, applying certain commands can set `ignoreApplyAll = true` and strip inline formatting so the element participates in Apply All styling.

### 3. Text Color & Background Color

- **Text color**: Button `#color1` / `.textColorPickerSpan` — opens color picker; on select, ngcontroller sets color and calls `editDoc("foreColor", color)`.
- **Background color**: Button `.bgColor1` / `.bgColorPickerSpan` — same pattern; `editDoc("backColor", color)`.

Both use the shared color palette and `floatingPanelApply("foreColor"|"backColor", sValue)`.

### 4. Clear Formatting

- Button `#removeFormat` → `editDoc('removeFormat')` → `clickRemoveFormat()` (removes .buttn-shadows, blockquote, resets line-height, clears inline styles in selection).

### 5. Alignment

- **Left / Center / Right / Justify**: Buttons with class `align-left`, `align-center`, `align-right`, `align-justify` → `editDoc('justifyleft'|'justifycenter'|'justifyright'|'justifyFull')` → `document.execCommand(sCmd)`.
- Only one alignment is active at a time; `btnactiveClass()` and manual removeClass on other align buttons keep UI in sync.

### 6. Line Height

- Dropdown with options 1, 1.15, 1.5, 2 → `changeLineHeight('1'|'1.15'|'1.5'|'2')` in floatingTextPanel.js.
- Applied to `$(window.getSelectedNodes()).parents("li, p, font, figcaption, .sc-intro, .header-data, .headerTitle").css("line-height", value)` or the contenteditable itself.

### 7. Lists & Indent

- **Ordered list**: `editDoc('insertOrderedList')` → `document.execCommand('insertOrderedList', false, null)`.
- **Unordered list**: `editDoc('insertUnorderedList')` → `document.execCommand('insertUnorderedList', false, null)`.
- **Indent / Outdent**: `editDoc('indent'|'outdent')` with guards (max nesting depth) in floatingTextPanel.js.

### 8. Hyperlink

- Dropdown with three options:
  - **Internal Link**: `addEditHyperLink(event, 'internal', 'internaledit')` — links to another page/asset within the lesson.
  - **External Link**: `addEditHyperLink(event, 'external')` — opens URL dialog, inserts `<a href="...">`.
  - **Apply Glossary**: `addEditHyperLink(event, 'glossary')` — applies glossary term to selection.

Implemented in ngcontroller.js; uses `elementActive` and dataset (e.g. `hashvalue`, `tooltipText`, `glossaryId`) for internal/glossary.

### 9. Insert Image

- Button `#inline-plain-image` with directive `uploadfiles` — opens file picker for image upload; inserts inline image into the current contenteditable (e.g. paragraph), creating split-paragraph layout where supported.

### 10. Math Editor

- Button `#equation` → `onMathLiveClick(event)` — opens MathLive (or platform equation editor) popup; inserts equation markup into selection. Disabled in some contexts (e.g. ITC panel) via class `cursorNotAllowedInITC` / `disableIconInPanel`.

### 11. Split Text

- Button `#splitParaButton` → `splitPara()` — splits the current paragraph at cursor into two paragraphs. Only enabled in paragraph context (e.g. `cusornotAllowedPara` / `disableParaIcon`).

### 12. Special Character

- Button `#specialcharacter` with directive `specialcharcall` — toggles `.specialCharList`; user clicks a character in the table → `insertChar(rowItem)` inserts that character into the selection. Characters are grouped by type in `specialCharArray` (e.g. Greek, symbols).

### 13. Format Painter

- Button toggles `allowCopyFormat` on controller scope; on next click in another text area, `formatPainter()` applies the stored format (font, size, colors, etc.) from the previous selection.

---

## Integration with Elements, Layout, TOC, Widgets

| Area | Use of Author Top Bar |
|------|------------------------|
| **Elements** | Title, Header, Text (paragraph), Callout Box, Thumbs Card Header, Lesson Opener — all use contenteditable with ng-model; selecting text shows the docked panel and formatting applies to their fieldData (e.g. header, body, title). |
| **Layout** | Layout column content that is contenteditable uses the same RTE; the panel appears when focus is inside that content. |
| **TOC** | TOC itself does not use the top bar; TOC entries are plain text from canvas headings. |
| **Widgets** | Extended Response (ITC), Table GO, Graphic Organizer, Annotation, and other widgets with rich-text fields show the top bar when the author selects text in those fields. Some widgets disable specific buttons (e.g. Math in ITC, alignment in Title) via classes like `cursorNotAllowedInPanel`, `disableOnlyTable`, `disableOnlyCover`. |

**Context checks in floatingTextPanel.js**: Formatting is only applied when the selection anchor is inside `[data-type="paragraph"]`, `[data-type="header"]`, or `[data-type="chapter-headingNew-h1"]` (and optionally other data-types as per project logic). This prevents the toolbar from affecting non-editable or wrong elements.

---

## API Reference

### Global Functions (floatingTextPanel.js)

| Function | Signature | Purpose |
|----------|-----------|---------|
| `editDoc(sCmd, sValue, flag)` | `(string, string?, boolean?)` | Entry point for toolbar; calls `floatingPanelApply(sCmd, sValue, flag)`. |
| `floatingPanelApply(sCmd, sValue, flag)` | — | Validates context (paragraph/header/title), handles removeFormat/fontSize/line-height/indent/italic specially, then `document.execCommand(sCmd, false, sValue)`. |
| `allowCopyFormat()` | — | Sets controller `allowCopyFormat = true` for format painter. |
| `onfontSizeChange(value)` | `(number|string)` | Updates font size viewport and calls `changefontSize("fontSize", value)`. |
| `changefontSize(cmd, value)` | — | Converts value to rem, applies to selection (font tags, spans), syncs table cell data if inside table. |
| `fontChange(sValue)` | — | Updates font family viewport text. |
| `btnactiveClass(elm, obj)` | — | Toggles class `obj` (e.g. 'buttn-shadows') on button for active state. |
| `clickRemoveFormat()` | — | Removes formatting from selection and resets toolbar button states. |
| `changeLineHeight(value)` | — | Sets line-height on selected block elements. |
| `formatPainter()` | — | Applies stored format (from allowCopyFormat) to current selection. |

### Controller Methods (ngcontroller.js)

- `addEditHyperLink(event, type, internaledit)` — Internal / External / Glossary link.
- `onMathLiveClick(event)` — Open equation editor.
- `splitPara()` — Split paragraph at cursor.
- `insertChar(char)` — Insert special character (used by special character table).

---

## Known Behaviors & Notes

1. **Single global panel**: There is one docked panel instance; it does not create a new toolbar per component. Which contenteditable is “active” is determined by `document.getSelection()` and the DOM hierarchy (e.g. `.focusactive` class and parents with `data-type`).

2. **Show/hide**: The panel can be hidden with `$(".docked-text-editor").hide()` (e.g. in preview or when no text is selected). Toggle is used when switching modes.

3. **Dropdowns**: Any open dropdown (`.open`) is closed when clicking outside or when applying format — e.g. `$(".docked-text-editor .open").removeClass("open")` in ngcontroller.

4. **Font/size reset**: On certain actions (e.g. selection change), font family and font size selects are reset — e.g. `#font-family` set to "NA", `#font-size` set to " " — to avoid showing stale values.

5. **Title element restrictions**: In Title element (chapter-headingNew-h1), alignment and justify can be disabled via `cursorNotAllowedInPane` so that only certain formats apply.

6. **Apply All and ignoreApplyAll**: When applying formatting to an element that has Apply All, the code may set `ignoreApplyAll = true` and strip inline formatting so the element follows global style.

7. **Italic custom span**: Italic uses a custom span with class .italics/.nonItalics and font-style instead of raw execCommand('italic') in some code paths.

8. **Table cell sync**: When changing font size inside a table (`.tableNew`), the table’s `celldata` array is updated from the DOM `.textNode` contents.

9. **Refresh after format**: After applying format, `refreshMathFieldsForStyleChange('#target')` is called and the active element’s ng-model is triggered so that saved JSON stays in sync.

---

## Checklist for Implementation

### For Authors
- Select text or place cursor in a contenteditable (paragraph, header, title, callout body, widget text field) to see the top bar.
- Use Format Painter: select formatted text → click Format Painter → select target text → click again to apply.
- Use Internal/External/Glossary links from the Link dropdown, not inline typing of URLs, for proper tracking.
- Use Math Editor for equations inside paragraph/header; it may be disabled in some widget panels.

### For Developers
- Ensure `floatingTextPanel.js` is loaded before any page that uses the docked panel (it is loaded from index.html).
- When adding new contenteditable areas that should use the top bar, ensure they live inside a container with the appropriate `data-type` or that `floatingPanelApply` context checks include them.
- Use `.docked-text-editor` and `.editing-container` for layout/visibility; avoid removing the directive from the DOM.
- To disable a feature in a context, add a class that hides or disables the button (e.g. `disableOnlyTable`, `cursorNotAllowedInPanel`) and document the restriction in this doc.
