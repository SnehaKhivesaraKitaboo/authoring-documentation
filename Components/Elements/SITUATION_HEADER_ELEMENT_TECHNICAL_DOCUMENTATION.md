# Situation Header Element — Technical Documentation

## Overview

A visually distinct context-setting prompt box with a decorative arrow icon and a rich-text editable area. Used to present scenario introductions and situational prompts.

### Component Identifier
```javascript
"dataType": "situationbox"
```

---

## File Structure

```
KITABOO_Authoring/
└── templates/
    └── situation-box/
        ├── situation-box.html              ← AngularJS template
        ├── situation-box-settings.html     ← Settings panel
        ├── scripts/
        │   ├── situation-box-directive.js  ← situationbox directive
        │   └── situation-box-preview1.js   ← Preview mode handler
        ├── styles/
        │   └── situation-box.css
        └── default/
            └── situation-box.json
```

---

## Data Model

| Field | Type | Description |
|---|---|---|
| `identifier` | string | `"situationbox"` |
| `textArea` | string (HTML) | Main body content (rich HTML) |
| `settings.altText` | string | Alt text for arrow icon image |

---

## Template Structure

```html
<div class="situation-box-container"
  style="background-color: #f3ecfe; border-radius: 16px;">
  <div style="display: flex; padding: 16px 16px 0px 16px">
    <!-- Arrow icon (non-draggable) -->
    <img src="images/arrow.svg" draggable="false"/>
    <!-- Rich text area -->
    <div contenteditable="true" ng-model="fieldData.textArea"
      style="font-family: Roboto; font-size: 16px; line-height: 24px;
             min-height: 72px;">
    </div>
  </div>
</div>
```

---

## Design Constraints

> **Non-Customizable Design:** The background color (`#f3ecfe`), border radius (`16px`), padding, arrow icon, font family, size, and line height are all hard-coded. Authors cannot change the visual theme.

---

## Key Behaviors

- Arrow icon is `pointer-events: none` and `user-select: none` — cannot be dragged or selected
- Body text supports full rich-text formatting via floating text toolbar
- Math equations supported via `math-read-only-field` class
- `situation-box-preview1.js` handles rendering differences in preview/reader mode

---

## Integration & Dependencies

| Dependency | Role |
|---|---|
| `situation-box-directive.js` | Core directive |
| `situation-box-preview1.js` | Preview/reader rendering |
| `editor/floatingTextPanel.js` | Floating rich-text toolbar |
| `images/arrow.svg` | Decorative arrow icon |
| `situation-box.css` | Component styles |
