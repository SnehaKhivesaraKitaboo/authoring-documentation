# Layout Component - Quick Reference Guide

## Overview
This quick reference provides essential information for developers working with the KITABOO Authoring layout component system.

---

## 📁 File Locations

```
templates/layouts/
├── layout1.html              # Left layout (30-70)
├── layout2.html              # Center layout (50-50)
├── layout3.html              # Right layout (70-30)
├── layout4.html              # Four columns (25-25-25-25)
├── layout5.html              # Three columns (33-33-33)
├── layout6.html              # Custom with question banks
├── layout-setting-panel.html # Settings UI
├── default/
│   └── layout.json           # Default data model
├── scripts/
│   └── layout-directive.js   # Main directive (301 lines)
└── styles/
    └── layout-template.css   # All styles (366 lines)
```

**Related Files:**
- `config/config.js`: Lines 10-80 (layout definitions)
- `editor/ngcontroller.js`: Lines 2700-2800 (findTag, addAttr)
- `editor/services.js`: Lines 210-250 (TemplateService)

---

## 🚀 Quick Start

### Adding a Layout to a Page

```javascript
// 1. User drags layout from widget panel
// 2. Drops onto page canvas
// 3. System automatically:
//    - Loads layout HTML template
//    - Fetches default JSON (layout.json)
//    - Compiles directive
//    - Renders empty columns
//    - Enables drop zones
```

### Dropping a Widget into Layout

```javascript
// 1. User drags widget (e.g., paragraph)
// 2. Hovers over layout column
// 3. Drop zone highlights (green dashed border)
// 4. Drops widget
// 5. onDropComplete() fires
// 6. Widget compiled and rendered
```

---

## 📋 Layout Type Reference

| Type | Name | Identifier | Columns | Column Widths | Use Case |
|------|------|------------|---------|---------------|----------|
| 1 | Left | `layout-1` | 2 | 30% - 70% | Sidebar + main content |
| 2 | Center | `layout-2` | 2 | 50% - 50% | Side-by-side comparison |
| 3 | Right | `layout-3` | 2 | 70% - 30% | Main content + sidebar |
| 4 | Four Column | `layout-4` | 4 | 25% each | Grid layouts, features |
| 5 | Three Column | `layout-5` | 3 | 33.33% each | Triple comparison |
| 6 | Custom Center | `layout-6` | 2 | 50% - 50% | Question banks (max 15 each) |

---

## 🎯 Key Functions

### Directive Functions (layout-directive.js)

```javascript
// Compile and insert HTML into column
scope.compileAndAppendHtml(dropZone, htmlContent)

// Handle widget drop
scope.onDropComplete(index, data, evt, boxNo)

// Handle paste operation
scope.onPasteDropComplete(evt)

// Orchestrate paste
scope.pastecomp(event, type)
```

### Controller Functions (ngcontroller.js)

```javascript
// Create widget DOM element
$scope.findTag(data, isCustom, paraValue, jsonData)

// Add attributes and compile
$scope.addAttr(data, isCustom, paraValue, jsonData)

// Generate unique ID
$scope.generateUniqueId()

// Create outer structure
$scope.createCommonOuterStructure(iconClass, dataType, data)
```

---

## 📦 Data Model Structure

### Runtime State (savedJson)

```javascript
$scope.savedJson[pageNo][elementId] = {
    identifier: "layout-1",           // Layout type
    layoutChildren: true,              // Has nested widgets
    template1: "<div>...</div>",       // Left/first column HTML
    template2: "<div>...</div>",       // Right/second column HTML
    template3: "<div>...</div>",       // Third column (layout-4,5)
    template4: "<div>...</div>",       // Fourth column (layout-4)
    settings: {
        fullWidth: false,              // Page width toggle
        layoutType: "layout-1",        // Type identifier
        templateName: "Left",          // Display name
        templateImage: "icon-xxx",     // Icon class
        layoutPageDataIndex: "pg-1-x", // Reference ID
        questionBank: [...],           // For layout-6
        questionBank2: [...]           // For layout-6
    }
}
```

### Default JSON (layout.json)

```json
{
    "identifier": "layout-1",
    "settings": {
        "fullWidth": false,
        "layoutType": null,
        "questionBank": [
            {"questionType": "Widget Type", "questionTemplate": ""}
        ],
        "questionBank2": [
            {"questionType": "Widget Type", "questionTemplate": ""}
        ]
    },
    "custom": {
        "css": ["css/templates/layout-template.css"],
        "javascript": []
    }
}
```

---

## 🎨 Key CSS Classes

### Structural Classes

```css
.layout-container          /* Main flexbox container */
.column                    /* Individual column */
.column-content           /* Content area within column */
.editables                /* Marks droppable zone */
.save-html                /* Data persistence marker */
```

### Width Classes

```css
.one-third    { width: 30%; }
.two-thirds   { width: 70%; }
.one-half     { width: 50%; }
.one-fourth   { width: 25%; }
.one-by-three { width: 33.33%; }
```

### State Classes

```css
.layout-placeholder       /* Drag preview */
.empty-droppable-text    /* Empty state instructions */
.drag-enter              /* During drag hover */
.first-time-load         /* Initial render flag */
```

### Layout-Specific Classes

```css
.layout-1, .layout-2, .layout-3  /* Two-column variants */
.layout-4                         /* Four columns (flexbox) */
.layout-5                         /* Three columns (flexbox) */
.layout-6                         /* Custom with questions */
```

---

## 🔧 Common Operations

### Check if Layout Has Content

```javascript
if ($(column).find('.column-content').children().length > 0) {
    // Column has widgets
} else {
    // Column is empty
}
```

### Get Layout Type

```javascript
var layoutType = $(element).parents('[data-type]').attr('data-type');
// Returns: "layout-1", "layout-2", etc.
```

### Update Full Width Setting

```javascript
scope.fieldData.settings.fullWidth = true;
$(element).parents('.sd-item').eq(0).attr('data-pagemargin', 'fullwidth');
```

### Access Saved Data

```javascript
var pageNo = parseInt($('[new-toc]').attr('pagesequence'));
var elementId = $(element).attr('saved-index');
var layoutData = $scope.savedJson[pageNo][elementId];
```

---

## 📱 Responsive Breakpoints

```css
/* Desktop: > 586px */
- Multi-column layouts maintained
- Full width setting respected

/* Mobile: ≤ 586px */
- All columns stack vertically (width: 100%)
- Column padding adjusted
- Dividers hidden
```

---

## ⚠️ Common Pitfalls

### 1. Forgotten setTimeout Delay
```javascript
// ❌ Wrong - doesn't wait for DOM
scope.compileAndAppendHtml(element, content);

// ✅ Correct - waits for DOM
$timeout(function() {
    scope.compileAndAppendHtml(element, content);
});
```

### 2. Missing first-time-load Removal
```javascript
// ❌ Wrong - can cause re-triggers
currentDroppable.html($compile(content)(con));

// ✅ Correct - removes trigger class
if(content) {
    content = content.replace('first-time-load','');
}
currentDroppable.html($compile(content)(con));
```

### 3. Incorrect Scope Reference
```javascript
// ❌ Wrong - uses directive scope
scope.savedJson[pageNo][elementId] = data;

// ✅ Correct - uses controller scope
var con = angular.element(document.getElementById('myController')).scope();
con.savedJson[pageNo][elementId] = data;
```

### 4. Forgetting layoutChildren Flag
```javascript
// ❌ Wrong - parent not marked
$scope.savedJson[pageNo][elementId] = jsonData;

// ✅ Correct - marks as container
if (isCustom) {
    jsonData.layoutChildren = true;
}
$scope.savedJson[pageNo][elementId] = jsonData;
```

---

## 🐛 Debugging Tips

### Enable Verbose Logging

```javascript
// Add to layout-directive.js
var DEBUG = true;

scope.onDropComplete = function(index, data, evt, boxNo) {
    if (DEBUG) console.log('onDropComplete:', {index, data, evt, boxNo});
    // ... rest of function
}
```

### Inspect Saved State

```javascript
// In browser console
var scope = angular.element(document.getElementById('myController')).scope();
console.log('All pages:', scope.savedJson);
console.log('Current page:', scope.savedJson[1]); // Page 1
```

### Check Drop Validation

```javascript
// Add to onDropComplete
console.log('Drop validation:', {
    hasData: !!data,
    isEmpty: $(scope.dropElement).children().length === 0,
    isDroppable: localStorage.getItem("isDroppable"),
    isPastable: localStorage.getItem("isPastable")
});
```

### View Compiled HTML

```javascript
// After widget drops
console.log('Column HTML:', $(scope.dropElement).html());
console.log('fieldData:', scope.fieldData);
```

---

## 🔍 Testing Checklist

### Layout Rendering
- [ ] Layout loads with empty columns
- [ ] Columns have correct widths
- [ ] Vertical divider displays correctly
- [ ] Empty drop zone instructions visible
- [ ] Hover effects work (paste zone)

### Widget Operations
- [ ] Drag-drop widget into column works
- [ ] Widget compiles and renders
- [ ] Multiple widgets in one column
- [ ] Copy-paste widget works
- [ ] Delete widget works
- [ ] Move widget between columns

### Settings
- [ ] Click layout opens settings panel
- [ ] Full-width toggle works
- [ ] Settings persist after save
- [ ] Settings icon and name correct

### Responsive
- [ ] Desktop: Multi-column layout
- [ ] Mobile: Single column stack
- [ ] Tablet: Intermediate behavior
- [ ] Orientation change handled

### Edge Cases
- [ ] Empty layout saves correctly
- [ ] Nested layouts work
- [ ] Undo/redo operations
- [ ] Copy-paste across pages
- [ ] Maximum question bank items (layout-6)

---

## 🚨 Known Limitations

1. **No visual feedback for failed drops** - Drops fail silently
2. **Fixed 600ms undo/redo delay** - Not adaptive to widget complexity
3. **Layout-6 shuffle not implemented** - Checkbox exists but no logic
4. **No circular reference detection** - Can paste layout inside itself
5. **Hard limit of 15 questions** - No warning when limit reached
6. **localStorage dependency** - Copy-paste limited by storage quota
7. **No equal heights for layout-1,2,3** - Only 4 and 5 use flexbox
8. **jQuery-heavy** - Performance implications, migration needed

---

## 📚 Related Documentation

- **Main Technical Documentation**: `LAYOUT_COMPONENT_TECHNICAL_DOCUMENTATION.md`
- **Architecture Diagrams**: `LAYOUT_ARCHITECTURE_DIAGRAM.md`
- **Config Reference**: `config/config.js` (lines 10-80)
- **API Documentation**: See main document Appendix C

---

## 🆘 Troubleshooting

### Widget Not Appearing After Drop

**Check:**
1. Console errors (compilation issues)
2. `isDroppable` flag in localStorage
3. Drop zone is empty
4. Widget data valid in config.js
5. JSON file exists and loads

**Solution:**
```javascript
// Reset drop flags
localStorage.setItem("isDroppable", true);
localStorage.setItem("isPastable", true);

// Verify widget data
var widget = $scope.widgets[0].widget.find(w => w.dataType === 'layout-1');
console.log('Widget config:', widget);
```

### Settings Panel Not Opening

**Check:**
1. Click event propagating correctly
2. `currSettings` object exists
3. Layout has valid `data-saved-index`
4. Settings panel HTML loaded

**Solution:**
```javascript
// Manually trigger settings
var con = angular.element(document.getElementById('myController')).scope();
con.setSettingsValues($('#target'), 'settings');
```

### Full Width Toggle Not Working

**Check:**
1. `data-pagemargin` attribute set
2. CSS loaded correctly
3. Settings synced to savedJson
4. Page refresh needed

**Solution:**
```javascript
// Force attribute update
var el = $('[data-saved-index="pg-1-12345"]');
el.attr('data-pagemargin', 'fullwidth');

// Verify CSS
console.log('Computed width:', el.css('max-width'));
```

### Copy-Paste Failing

**Check:**
1. localStorage available (not private browsing)
2. Data stored: `localStorage.getItem("data")`
3. Component size < 5MB
4. Target drop zone empty

**Solution:**
```javascript
// Verify storage
console.log('Copied data:', localStorage.getItem("data"));
console.log('Copied component:', localStorage.getItem("copiedComponent"));

// Clear and retry
localStorage.removeItem("data");
localStorage.removeItem("copiedComponent");
// Re-copy and paste
```

---

## 🎓 Best Practices

### 1. Always Wait for DOM Ready
```javascript
$timeout(function() {
    // DOM operations here
});
```

### 2. Use Controller Scope for State
```javascript
var con = angular.element(document.getElementById('myController')).scope();
con.savedJson[pageNo][elementId] = data;
```

### 3. Validate Before Operations
```javascript
if (!data || !data.isDroppable || $(target).children().length > 0) {
    return; // Abort invalid operation
}
```

### 4. Track Undo/Redo Properly
```javascript
// Use promises instead of setTimeout
widgetReady(item).then(() => {
    con.undo_stack.push({...});
});
```

### 5. Sanitize User Content
```javascript
var sanitized = $sanitize(content);
currentDroppable.html($compile(sanitized)(con));
```

---

## 📞 Support

**For Questions:**
- Check main documentation first
- Review architecture diagrams
- Inspect browser console for errors
- Test with DEBUG mode enabled

**For Bugs:**
- Document steps to reproduce
- Capture console errors
- Note browser/version
- Check known issues list

**For Features:**
- Review recommendations section
- Consider impact and effort
- Plan migration path
- Test thoroughly

---

## 📊 Performance Tips

### Optimize Compilation
```javascript
// Cache compiled templates
var templateCache = {};

function getCachedTemplate(templateUrl) {
    if (!templateCache[templateUrl]) {
        templateCache[templateUrl] = $compile(template);
    }
    return templateCache[templateUrl];
}
```

### Lazy Load Off-Screen Content
```javascript
// Use Intersection Observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            compileWidget(entry.target);
            observer.unobserve(entry.target);
        }
    });
});
```

### Debounce Resize Events
```javascript
var resizeTimeout;
$(window).on('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        recalculateLayout();
    }, 250);
});
```

---

## 🔐 Security Considerations

1. **Sanitize HTML** before compilation to prevent XSS
2. **Validate JSON** structure before saving
3. **Limit nesting depth** to prevent DoS
4. **Check file sizes** before upload
5. **Implement CSP** headers for published content

---

## 📈 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Feb 17, 2026 | Initial comprehensive documentation |

---

**Quick Reference Version:** 1.0  
**Last Updated:** February 17, 2026  
**Companion Documents:** Technical Documentation, Architecture Diagrams
