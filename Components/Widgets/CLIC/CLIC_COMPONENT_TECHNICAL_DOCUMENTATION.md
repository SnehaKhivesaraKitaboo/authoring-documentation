# CLIC (Sketchpad) Component - Technical Documentation

**Component Version:** Initial Implementation  
**Document Version:** 1.0  
**Last Updated:** February 13, 2026  
**Author:** Technical Analysis Team

---

## Table of Contents

1. [Component Overview](#1-component-overview)
2. [Architecture & File Structure](#2-architecture--file-structure)
3. [Component Registration](#3-component-registration)
4. [Data Model & Configuration](#4-data-model--configuration)
5. [HTML Template Structure](#5-html-template-structure)
6. [Directive Implementation](#6-directive-implementation)
7. [CSS Styling](#7-css-styling)
8. [Data Flow & Rendering Logic](#8-data-flow--rendering-logic)
9. [Environment Configuration](#9-environment-configuration)
10. [Reader/Player Integration](#10-readerplayer-integration)
11. [CLIC Component Details](#11-clic-component-details)
12. [State Management](#12-state-management)
13. [Known Issues & Limitations](#13-known-issues--limitations)
14. [Edge Cases](#14-edge-cases)
15. [Integration Testing Considerations](#15-integration-testing-considerations)
16. [Recommendations for Improvement](#16-recommendations-for-improvement)
17. [Security Considerations](#17-security-considerations)
18. [Performance Considerations](#18-performance-considerations)
19. [Documentation & Communication](#19-documentation--communication)
20. [Comparison with Other Components](#20-comparison-with-other-components)
21. [Conclusion](#21-conclusion)

---

## 1. Component Overview

**Component Name:** CLIC Component (Sketchpad)  
**Type:** External Interactive Component Integration  
**Identifier:** `sketchpad`  
**Data Type:** `sketchpad`  
**Primary Purpose:** Embeds Carnegie Learning Instructional Components (CLIC) into KITABOO authoring and reader environments through an iframe-based integration.

### Key Characteristics
- **Form-Based Configuration:** Simple two-field form for CLIC identifier and instance name
- **Iframe Integration:** Loads external CLIC components in an isolated iframe
- **Minimal Local Logic:** Acts primarily as a wrapper/bridge to external CLIC system
- **Environment-Aware:** Dynamically selects production or staging CLIC URLs
- **No Settings Panel:** Currently has no configuration options beyond the identifier

---

## 2. Architecture & File Structure

### 2.1 Core Files

| File Path | Purpose | Lines of Code | Notes |
|-----------|---------|---------------|-------|
| `templates/sketch-pad/sketchpad.html` | Main template with form and iframe | ~40 | Single template for all modes |
| `templates/sketch-pad/scripts/sketchpad-directive.js` | AngularJS directive | ~91 | Core interaction logic |
| `templates/sketch-pad/scripts/sketchpad-preview1.js` | Reader mode script | 0 | **Empty file** |
| `templates/sketch-pad/sketchpad-settings.html` | Settings panel | 0 | **Empty file** |
| `templates/sketch-pad/styles/sketchpad.css` | Component styles | 70 | Form styling only |
| `templates/sketch-pad/default/sketchpad.json` | Default configuration | ~20 | Minimal configuration |
| `templates/sketch-pad/config.txt` | Component registration | 1 | Metadata for editor |
| `templates/sketchpad/CLIC_POC.md` | POC documentation | ~30 | Integration guide |
| `templates/sketchpad/index.html` | Standalone test page | ~50 | For testing outside editor |

### 2.2 CLIC External Resources

The component depends on Carnegie Learning's hosted CLIC library:

**Production Environment:**
- Base URL: `https://apps.carnegielearning.com/clic/`
- Library: `${baseUrl}elements/library.js`
- Polyfills: `${baseUrl}elements/polyfills.js`
- Styles: `${baseUrl}elements/styles.css`

**Staging Environment:**
- Base URL: `https://apps.qa-cli.net/clic/`
- Same structure as production

### 2.3 Integration Points

**Global Configuration Files:**
- `config/services.js` - Sets `clicBaseUrl` for staging
- `config/services_prod.js` - Sets `clicBaseUrl` for production
- `config/services_stag.js` - Sets `clicBaseUrl` for staging
- `config/services_EU.js` - Sets `clicBaseUrl` for EU production
- `config/config.js` - Component registration (Line 2199, Line 266)

**Player/Reader Integration:**
- `js/player-container.js` - Lines 6690-6750: CLIC initialization in reader
- `editor/ngcontroller.js` - Lines 13056-13068: Preview generation

---

## 2.4 Architectural Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          KITABOO Authoring Tool                         │
│                         (AngularJS Application)                         │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
         ┌──────────▼──────────┐   ┌─────────▼──────────┐
         │   Editor Mode       │   │  Preview/Reader    │
         │  (Authoring)        │   │     Mode           │
         └──────────┬──────────┘   └─────────┬──────────┘
                    │                        │
         ┌──────────┴──────────┐            │
         │                     │            │
    ┌────▼────┐         ┌─────▼─────┐      │
    │  Main   │         │ Sketchpad │      │
    │Controller│◄────────┤ Directive │      │
    │(ngCtrl) │         │           │      │
    └────┬────┘         └─────┬─────┘      │
         │                    │            │
         │              ┌─────▼──────┐     │
         │              │   Scope    │     │
         │              │ Functions  │     │
         │              └─────┬──────┘     │
         │                    │            │
         ├────────────────────┼────────────┤
         │                    │            │
    ┌────▼────────────┐ ┌─────▼──────┐    │
    │ Form Fields     │ │  Submit    │    │
    │ - clicuid       │ │  Handler   │    │
    │ - instancename  │ │            │    │
    └─────────────────┘ └─────┬──────┘    │
                              │            │
                        ┌─────▼──────┐     │
                        │ issubmitted│     │
                        │   Toggle   │     │
                        └─────┬──────┘     │
                              │            │
         ┌────────────────────┴────────────┼────────────────┐
         │                                 │                │
    ┌────▼────┐                      ┌─────▼─────┐   ┌─────▼─────┐
    │ Form    │                      │   Iframe  │   │   CLIC    │
    │  View   │                      │ Generator │   │   URL     │
    │(Hidden) │                      │           │   │   Build   │
    └─────────┘                      └─────┬─────┘   └─────┬─────┘
                                           │               │
                                           └───────┬───────┘
                                                   │
                                          ┌────────▼────────┐
                                          │   JSON Data     │
                                          │   Model         │
                                          │                 │
                                          │  • clicuid      │
                                          │  • instancename │
                                          │  • settings     │
                                          │  • issubmitted  │
                                          └────────┬────────┘
                                                   │
                                     ┌─────────────┴─────────────┐
                                     │                           │
                            ┌────────▼────────┐         ┌────────▼────────┐
                            │   localStorage  │         │  Server Storage │
                            │   (Auto-save)   │         │   (Manual Save) │
                            └─────────────────┘         └─────────────────┘


═══════════════════════════════════════════════════════════════════════════
                         PREVIEW/READER MODE
═══════════════════════════════════════════════════════════════════════════

    ┌─────────────────────────────────────────────────────┐
    │          CLIC Iframe Integration                    │
    │                                                     │
    └──────────────────┬──────────────────────────────────┘
                       │
         ┌─────────────┴─────────────┐
         │                           │
    ┌────▼──────┐          ┌─────────▼────────┐
    │ Iframe    │          │  CLIC Base URL   │
    │ Element   │          │  Configuration   │
    │           │          │                  │
    └────┬──────┘          └─────────┬────────┘
         │                           │
         │              ┌────────────▼────────────┐
         │              │  URL Construction       │
         │              │  baseUrl + ?clicid=...  │
         │              └────────────┬────────────┘
         │                           │
         └───────────┬───────────────┘
                     │
            ┌────────▼────────┐
            │  Load External  │
            │  CLIC Content   │
            └────────┬────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
    ┌────▼────────┐    ┌─────────▼────────┐
    │ CLIC        │    │  CLIC            │
    │ Library.js  │    │  Component       │
    │             │    │  Rendering       │
    └────┬────────┘    └─────────┬────────┘
         │                       │
         └───────────┬───────────┘
                     │
            ┌────────▼────────┐
            │ Student         │
            │ Interactions    │
            │ (External CLIC) │
            └────────┬────────┘
                     │
            ┌────────▼────────┐
            │ CLIC State      │
            │ Management      │
            │ (External)      │
            └─────────────────┘
```

### Component Initialization Flow

#### Editor Mode
```
index.html loads → AngularJS bootstrap → ngController init → 
Directive registration → Sketchpad template clicked → 
sketchpad directive link → Scope setup → 
Check if clicuid exists → Auto-submit if populated → 
Show form if empty → User enters clicuid & instancename → 
Click Submit → Toggle issubmitted → Generate iframe URL → 
Render iframe with CLIC content
```

#### Reader Mode  
```
Page loads → Parse JSON → Check issubmitted flag → 
Extract clicuid → Build CLIC URL (baseUrl + clicuid) → 
Render iframe → Load external CLIC resources → 
Initialize CLIC component → Student interacts → 
CLIC handles all interactions internally → 
State managed by external CLIC system
```

### Form Submission Flow

```
User in Editor → Enters CLIC UID (e.g., "pe87-65th-w5g1") → 
Enters Instance Name (e.g., "Math Problem 1") → 
Clicks Submit button → submitCLIC() triggered → 
Sets fieldData.settings.issubmitted = true → 
Calls getIframeUrl() → Constructs URL:
  window.clicBaseUrl + "?clicid=" + clicuid → 
Angular re-renders (ng-if) → Hides form → Shows iframe → 
Iframe loads CLIC content from external server
```

### URL Construction Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    CLIC URL CONSTRUCTION                     │
└──────────────────────────────────────────────────────────────┘

Environment Detection:
┌─────────────────────────────────────────────────────────────┐
│ Config File Loads → Sets window.clicBaseUrl                │
│                                                             │
│ PRODUCTION:   https://apps.carnegielearning.com/clic/      │
│ STAGING:      https://apps.qa-cli.net/clic/                │
│ EU:           https://apps.eu-location.com/clic/           │
│                                                             │
│ Fallback Chain:                                             │
│ 1. window.clicBaseUrl                                       │
│ 2. window.parent.clicBaseUrl                               │
│ 3. '' (empty string - will fail)                           │
└─────────────────────────────────────────────────────────────┘

URL Building:
┌─────────────────────────────────────────────────────────────┐
│ getIframeUrl() called                                       │
│   ↓                                                         │
│ Check if clicuid exists                                     │
│   ↓                                                         │
│ Get baseUrl from window.clicBaseUrl                         │
│   ↓                                                         │
│ Concatenate: baseUrl + "?clicid=" + clicuid                │
│   ↓                                                         │
│ Return URL (e.g., https://apps.../clic/?clicid=pe87-...)   │
│   ↓                                                         │
│ $sce.trustAsResourceUrl() for security                      │
│   ↓                                                         │
│ Set as ng-src on iframe element                             │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           EDITOR MODE                                   │
│                                                                         │
│  Author Input → AngularJS Binding → JSON Model Update →                │
│  Field Updates → Real-time validation → Submit triggers state change   │
│                                                                         │
│  Form State Management:                                                 │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ contenteditable fields → ng-keyup → updateText() →               │ │
│  │ fieldData.clicuid/instancename updated →                         │ │
│  │ Enable Submit button → Click Submit → submitCLIC() →             │ │
│  │ Toggle issubmitted → Trigger iframe render                       │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      PREVIEW/READER MODE                                │
│                                                                         │
│  Page Load → Parse JSON → Render iframe → Load external content →      │
│  CLIC takes over all interactions → State managed externally           │
│                                                                         │
│  Iframe Integration:                                                    │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ ng-if="issubmitted" → Show iframe → Set ng-src →                │ │
│  │ Iframe loads external CLIC → Initialize CLIC library →          │ │
│  │ Render CLIC component → Student interactions (external) →       │ │
│  │ State persistence (handled by CLIC system)                      │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Integration Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    KITABOO ↔ CLIC Integration                           │
└─────────────────────────────────────────────────────────────────────────┘

KITABOO Side:                          CLIC Side:
┌────────────────────┐                ┌────────────────────┐
│ Sketchpad          │                │ External CLIC      │
│ Component          │                │ Server             │
│                    │                │                    │
│ • Stores UID       │                │ • Hosts Components │
│ • Renders iframe   │◄───────────────┤ • Manages State    │
│ • Proxies content  │     HTTPS      │ • Handles Logic    │
│ • No logic inside  │                │ • Returns HTML/JS  │
└────────────────────┘                └────────────────────┘
         │                                      │
         │ Sends: clicuid parameter             │
         ├──────────────────────────────────────►
         │                                      │
         │ Receives: Full CLIC component HTML   │
         ◄──────────────────────────────────────┤
         │                                      │
         
No State Sharing:
- KITABOO only knows the UID and instance name
- All interactions happen within CLIC iframe
- CLIC manages its own state independently
- No SCORM integration from KITABOO side
- Iframe isolation prevents cross-communication
```

---

## 3. Component Registration

### 3.1 Config.js Registration

Located in `config/config.js`:

```javascript
{
    "name": "CLIC Component",
    "icon": "K",                          // Display icon character
    "iconClass": "icon-clic",             // CSS icon class
    "dataType": "sketchpad",              // Internal identifier
    "url": "templates/sketch-pad/sketchpad.html",
    "json": "templates/sketch-pad/default/sketchpad.json",
    "settingsURL": "templates/sketch-pad/sketchpad-settings.html",
    "isDroppable": true,                  // Can be dragged into layouts
    "preview": {
        "imgURL": "templates/preview/CLIC-popup.png"
    }
}
```

### 3.2 Layout Compatibility

The component is marked as compatible with specific layouts in `config.js`:

**Allowed In:**
- `layout-1` through `layout-7` (Line 2697, 2729, 2763, 2796, 2829)
- `situationbox` (Line 4088)
- Most standard content containers

**Not Allowed In:**
- Interactive templates (MCQ, FIB, etc.)
- Some specialized layouts

---

## 4. Data Model & Configuration

### 4.1 JSON Structure

Defined in `sketchpad.json`:

```json
{
  "identifier": "sketchpad",
  "templateName": "sketchPadComponent",
  "caption": "",
  "clicuid": "",                    // The CLIC component identifier
  "instancename": "",               // Instance name for this embedding
  "introductionText": "",
  "paragraph": "The paragraph contains placeholder text...",
  "settings": {
    "fullwidth": true,              // Full-width display mode
    "issubmitted": false            // Form submitted state
  },
  "custom": {
    "css": [
      "/templates/sketch-pad/styles/sketchpad.css"
    ],
    "javascript": [
      "js/templates/sketchpad-preview1.js"
    ]
  }
}
```

### 4.2 Field Descriptions

| Field | Type | Purpose | Required |
|-------|------|---------|----------|
| `clicuid` | String | Unique CLIC component identifier (e.g., "pe87-65th-w5g1") | Yes |
| `instancename` | String | Human-readable instance name | Yes |
| `settings.issubmitted` | Boolean | Tracks whether form has been submitted | Yes |
| `settings.fullwidth` | Boolean | Display mode (currently always true) | No |

---

## 5. HTML Template Structure

### 5.1 Template Overview

The template (`sketchpad.html`) has two conditional states:

```html
<div id="sketchpad" sketchpad>
    <!-- STATE 1: Submitted - Shows iframe -->
    <div class="sample-page" ng-if="fieldData.settings.issubmitted">
        <!-- iframe content -->
    </div>

    <!-- STATE 2: Not Submitted - Shows form -->
    <div class="form-container" ng-if="!fieldData.settings.issubmitted">
        <!-- form content -->
    </div>
</div>
```

### 5.2 Form State (Editor Mode)

**Visual Design:**
- Card-style form box with shadow
- Icon header (⋮⋮) + title
- Two contenteditable fields
- Submit button with play icon

**Form Fields:**

1. **CLIC Identifier Field:**
```html
<label for="clicuid" class="form-label">CLIC identifier</label>
<div 
    data-editcontent="" 
    contenteditable="true" 
    type="text" 
    id="clicuid" 
    ng-click="introclick($event);" 
    required 
    class="form-input" 
    ng-keyup="updateText($event, 'clicuid')">
</div>
```

2. **Instance Name Field:**
```html
<label for="instancename" class="form-label">Instance Name</label>
<div 
    type="text" 
    id="instancename" 
    ng-click="introclick($event);" 
    data-editcontent="" 
    contenteditable="true" 
    required 
    class="form-input" 
    ng-keyup="updateText($event, 'instancename')">
</div>
```

3. **Submit Button:**
```html
<button type="submit" ng-click="submitCLIC()" class="form-button">
    <span class="form-button-icon">▶</span> Submit
</button>
```

### 5.3 Iframe State (Preview/Reader Mode)

```html
<div class="sample-page" ng-if="fieldData.settings.issubmitted">
    <div class="col-3" ng-if="fieldData.clicuid">
        <iframe 
            data-identifier="{{fieldData.clicuid}}"
            ng-src="{{iframeUrl|trusted}}"
            width="100%" 
            height="98%" 
            allowfullscreen
            title="Clic Assignment" 
            style="border: 0;">
        </iframe>
    </div>
</div>
```

**Key Attributes:**
- `data-identifier`: Stores CLIC UID for reader initialization
- `ng-src`: Dynamically generated URL with `$sce.trustAsResourceUrl()`
- `allowfullscreen`: Permits fullscreen mode for CLIC content
- `height="98%"`: Slight padding to prevent scroll issues

---

## 6. Directive Implementation

### 6.1 Directive Definition

Located in `sketchpad-directive.js`:

```javascript
App.directive('sketchpad', ['modalService', '$timeout', '$compile','$sce', 
    function (modalService, $timeout, $compile, $sce) {
    return {
        restrict: 'EA',      // Element or Attribute
        replace: false,      // Don't replace host element
        controller: function ($scope, $element, $compile) {
            // Empty controller - no shared logic
        },
        link: function (scope, element, attr) {
            // Initialization and event handlers
        }
    }
}]);
```

**Dependencies:**
- `modalService` - Unused (legacy)
- `$timeout` - For deferred execution
- `$compile` - Unused (legacy)
- `$sce` - For URL sanitization (`$sce.trustAsResourceUrl()`)

### 6.2 Initialization Logic

**Auto-Submit on Load:**

```javascript
setTimeout(() => {
    if(scope.fieldData.clicuid){
        scope.fieldData.settings.issubmitted = true
        scope.iframeUrl = scope.getIframeUrl();
    }
}, 10);
```

This logic runs 10ms after directive linking to:
1. Check if `clicuid` is already populated
2. Auto-submit the form if data exists
3. Generate iframe URL immediately

### 6.3 Core Functions

#### 6.3.1 getIframeUrl()

```javascript
scope.getIframeUrl = function() {
    if (scope.fieldData.clicuid) {
        var baseUrl = window.clicBaseUrl || window.parent.clicBaseUrl || '';
        var url = `${baseUrl}?clicid=${scope.fieldData.clicuid}`;
        return url
    }
    return '';
};
```

**Purpose:** Constructs the CLIC iframe URL  
**URL Format:** `https://apps.{env}.{domain}/clic/?clicid={identifier}`  
**Fallback Chain:**
1. `window.clicBaseUrl` (set in config files)
2. `window.parent.clicBaseUrl` (from parent window/iframe)
3. Empty string (will fail to load)

#### 6.3.2 submitCLIC()

```javascript
scope.submitCLIC = function()  {
    scope.fieldData.settings.issubmitted = true
    scope.iframeUrl = scope.getIframeUrl();
}
```

**Purpose:** Handles form submission  
**Actions:**
1. Sets `issubmitted` flag to `true`
2. Generates iframe URL
3. Triggers Angular to re-render (show iframe, hide form)

**Note:** No validation - assumes fields are filled. The `required` attribute on fields is currently decorative.

#### 6.3.3 introclick()

**Purpose:** Opens settings panel when clicking on form fields  
**Behavior:** Currently opens an **empty settings panel** (settings HTML file is blank)

```javascript
scope.introclick = function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    var con = angular.element(document.getElementById('myController')).scope(),
        pageNo, uniqueId,
        el = $(e.currentTarget)[0],
        par_item = $(e.currentTarget).parent().parent(),
        templateScope = $(element).parents().find('[sketchpad]').scope();

    con.higlightObj(par_item, el);
    con.currentSettings = 'settings';
    
    if (e) {
        pageNo = $(e.currentTarget).parents('[page-no]').attr('page-no');
        uniqueId = $(e.currentTarget).parents('[saved-index]').attr('saved-index');
    } else {
        pageNo = $("#target").parents('[page-no]').attr('page-no');
        uniqueId = $("#target").parents('[saved-index]').attr('saved-index');
    }
    
    con.setSettingsValues($('#target'), 'settings');
    con.currSettings = con.savedJson[pageNo][uniqueId].settings;
    con.templateData = con.savedJson[pageNo][uniqueId];
    con.currSettings.showBlanksettings = false;
    con.currSettings.headerStyleSettings = true;
    con.displaySettingPanel();
    enableDisableSaveButton(true);
}
```

#### 6.3.4 updateText()

```javascript
scope.updateText = function(event, keyName) {
    scope.fieldData[keyName] = event.target.innerText;
};
```

**Purpose:** Updates data model as user types  
**Parameters:**
- `event`: Keyboard event
- `keyName`: Field name (`'clicuid'` or `'instancename'`)

**Called On:** `ng-keyup` events on contenteditable divs

#### 6.3.5 Component Click Handler

```javascript
$(element).parents('.sd-item').bind('click', function(e, isCustom) {
    e.preventDefault();
    e.stopPropagation();
    
    var con = angular.element(document.getElementById('myController')).scope(),
        el = $(this).children().eq(1).children()[0],
        par_item = $(this);
    var templateScope = $(element).parents().find('[sketchpad]').scope();
    
    con.higlightObj(par_item, el);
    $(".desktop-bottm").hide();
    $("#templateTransscriptBox").hide();
    con.currentSettings = 'settings';
    
    var pageNo = $('#target').attr('page-no');
    var uniqueId = $('#target').attr('saved-index');
    
    con.currSettings = con.savedJson[pageNo][uniqueId].settings;
    con.field = con.savedJson[pageNo][uniqueId];
    con.dirData = con.savedJson[pageNo][uniqueId];
    con.updateActivePageToc();
    con.safeApply();
    con.displaySettingPanel();
    $(this).ScreenResize();
});
```

**Purpose:** Handles clicks on the component container  
**Behavior:** Opens (empty) settings panel and highlights component

---

## 7. CSS Styling

### 7.1 Form Container

```css
.form-container {
  background-color: #e8f1f6;    /* Light blue background */
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}
```

### 7.2 Form Box

```css
.form-box {
  width: 400px;
  background-color: #e6e6e6;    /* Light gray */
  margin: 50px auto;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.2);
  border: 1px solid #ccc;
}
```

**Design:** Card-style with prominent shadow for depth

### 7.3 Form Inputs

```css
.form-input {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #aaa;
  border-radius: 4px;
  box-shadow: inset 1px 1px 2px rgba(0, 0, 0, 0.1);
  height: 46px !important;
  background: white !important;
  overflow: hidden !important;         /* Prevents multi-line */
  white-space: nowrap !important;      /* Single line only */
}
```

**Note:** `white-space: nowrap` prevents line breaks but user can still paste multi-line content.

### 7.4 Submit Button

```css
.form-button {
  background-color: #2649d6;    /* Blue */
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  cursor: pointer;
}
```

### 7.5 Pointer Events Override

```css
#sketchpad input,
#sketchpad textarea {
  pointer-events: auto !important;
}
```

**Purpose:** Ensures inputs remain interactive even if parent has `pointer-events: none`

---

## 8. Data Flow & Rendering Logic

### 8.1 Editor Mode Flow

```
1. Component Added to Page
   ↓
2. Directive Initializes
   ↓
3. Check if clicuid exists
   ├─ Yes → Auto-submit (show iframe)
   └─ No  → Show form
   ↓
4. User enters CLIC identifier
   ↓ (ng-keyup on each keystroke)
5. updateText() updates fieldData.clicuid
   ↓
6. User clicks Submit button
   ↓ (ng-click)
7. submitCLIC() called
   ├─ Sets issubmitted = true
   ├─ Generates iframe URL
   └─ Angular re-renders
   ↓
8. Form hidden, iframe shown
   ↓
9. (Note: iframe src NOT set in editor to avoid loading)
```

### 8.2 Preview Mode Flow

```
1. Page Rendered in Preview
   ↓
2. Directive Initializes
   ↓
3. Auto-submit logic runs (10ms delay)
   ↓
4. If clicuid exists:
   ├─ Sets issubmitted = true
   ├─ Generates iframe URL
   └─ Renders iframe
   ↓
5. Iframe attempts to load CLIC content
   ↓
6. May fail if:
   ├─ clicBaseUrl not configured
   ├─ Network issues
   ├─ Invalid CLIC identifier
   └─ CORS issues
```

### 8.3 Reader Mode Flow

```
1. Page Loads in Reader
   ↓
2. player-container.js initializes (Document Ready)
   ↓
3. Determine clicBaseUrl:
   ├─ Check window.clicBaseUrl
   ├─ Check window.parent.clicBaseUrl
   ├─ Check window.platform (prod/stag)
   ├─ Check <article data-platform>
   └─ Default based on environment
   ↓
4. Find all [data-type="sketchpad"] iframes
   ↓
5. For each iframe:
   ├─ Read data-identifier attribute
   ├─ Construct URL: ${baseUrl}?clicid=${identifier}
   └─ Set iframe src attribute
   ↓
6. Load CLIC external resources:
   ├─ ${baseUrl}elements/styles.css
   ├─ ${baseUrl}elements/polyfills.js
   └─ ${baseUrl}elements/library.js
   ↓
7. CLIC components initialize inside iframes
```

### 8.4 Scope Hierarchy

```
Main Controller ($scope)
    ↓
Page Scope
    ↓
Component Scope (sketchpad directive)
    ├── fieldData
    │   ├── clicuid
    │   ├── instancename
    │   └── settings
    │       ├── issubmitted
    │       └── fullwidth
    └── iframeUrl (generated)
```

---

## 9. Environment Configuration

### 9.1 Base URL Configuration

**In Config Files:**

**Staging** (`services.js`, `services_stag.js`):
```javascript
var clicBaseUrl = "https://apps.qa-cli.net/clic/";
```

**Production** (`services_prod.js`, `services_EU.js`):
```javascript
var clicBaseUrl = "https://apps.carnegielearning.com/clic/";
```

### 9.2 Runtime URL Resolution

**Priority Order:**
1. `window.clicBaseUrl` (set by config)
2. `window.parent.clicBaseUrl` (from parent iframe)
3. `window.platform` + logic (`prod` → production URL, else staging)
4. `<article data-platform>` attribute
5. Fallback empty string (error)

**Helper Function** (`ngcontroller.js` Line 67-69):
```javascript
function getClicBaseUrl() {
    return window.clicBaseUrl || window.parent.clicBaseUrl || '';
}
```

### 9.3 CLIC Resource URLs

Once base URL is determined:

| Resource | Path | Purpose |
|----------|------|---------|
| Main iframe | `${baseUrl}?clicid=${identifier}` | Hosts CLIC component |
| Styles | `${baseUrl}elements/styles.css` | CLIC component styles |
| Polyfills | `${baseUrl}elements/polyfills.js` | Browser compatibility |
| Library | `${baseUrl}elements/library.js` | CLIC web components library |

---

## 10. Reader/Player Integration

### 10.1 Player Container Initialization

Located in `player-container.js` Lines 6696-6749:

```javascript
$(function () {
  let clicBaseUrl = null;
  let platform = '';
  
  // Try to get clicBaseUrl from window or parent window
  try {
    clicBaseUrl = window.clicBaseUrl || 
                  (window.parent && window.parent.clicBaseUrl) || 
                  null;
  } catch (e) {
    console.warn('Could not access parent window for clicBaseUrl:', e);
    clicBaseUrl = window.clicBaseUrl || null;
  }
  
  // Try to get platform from window or parent if clicBaseUrl not found
  if (!clicBaseUrl) {
    try {
      platform = window.platform || 
                 (window.parent && window.parent.platform) || 
                 '';
    } catch (e) {
      platform = window.platform || '';
    }
    
    if (platform == 'prod') {
      clicBaseUrl = 'https://apps.carnegielearning.com/clic/';
    } else if (platform == 'stag') {
      clicBaseUrl = 'https://apps.qa-cli.net/clic/';
    }
  }

  // Check <article> tag's data-platform attribute
  if (!clicBaseUrl) {
    var articleTag = document.querySelector('article[data-platform]');
    platform = articleTag ? articleTag.getAttribute('data-platform') : '';
    
    if (platform == 'prod') {
      clicBaseUrl = 'https://apps.carnegielearning.com/clic/';
    } else {
      clicBaseUrl = 'https://apps.qa-cli.net/clic/';
    }
  }

  // Set iframe src for sketchpad elements
  if (clicBaseUrl) {
    $('[data-type="sketchpad"] iframe[data-identifier]').each(function () {
      var $iframe = $(this);
      var identifier = $iframe.attr('data-identifier');
      
      if (identifier) {
        var newUrl = clicBaseUrl + '?clicid=' + identifier;
        $iframe.attr('src', newUrl);
      }
    });
    
    loadCSSForCLIC(clicBaseUrl + 'elements/styles.css');
    loadJSForCLIC(clicBaseUrl + 'elements/polyfills.js');
    loadJSForCLIC(clicBaseUrl + 'elements/library.js');
  } else {
    console.error('CLIC base URL not found.');
  }
});
```

### 10.2 Resource Loading Functions

**loadCSSForCLIC:**
```javascript
function loadCSSForCLIC(href) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.getElementsByTagName('head')[0].appendChild(link);
}
```

**loadJSForCLIC:**
```javascript
function loadJSForCLIC(src) {
    var script = document.createElement('script');
    script.src = src;
    script.type = 'module';
    script.async = true;
    document.getElementsByTagName('head')[0].appendChild(script);
}
```

### 10.3 Preview Generation

Located in `ngcontroller.js` Lines 13056-13068:

```javascript
$scope.createPreviewForSketchPad = function (data) {
    $(data).find('[data-type="sketchpad"] iframe[data-identifier]').each(function () {
        var $iframe = $(this);
        var identifier = $iframe.attr('data-identifier');
        
        if (identifier) {
            var baseUrl = getClicBaseUrl();
            var newUrl = `${baseUrl}?clicid=${identifier}`;
            $iframe.attr('src', newUrl);
        }
    });
    
    return data;
}
```

**Called During:** Preview HTML generation before displaying to user

---

## 11. CLIC Component Details

### 11.1 What is CLIC?

From `CLIC_POC.md`:

> Carnegie Learning Instructional Components [CLIC] are a library of interactive, engaging, educational custom elements intended for use across CL platforms. The intent is to add CLIC elements to the CL Studio's activity elements menu to be available for students in the Clear Lesson Player.
>
> **CLIC** elements are configurable, authorable.

### 11.2 CLIC Integration Pattern

**Standard Integration:**

```html
<!-- 1. Add polyfills and library -->
<script src="https://apps.qa-cli.net/clic/elements/polyfills.js" type="module"></script>
<script src="https://apps.qa-cli.net/clic/elements/library.js" type="module"></script>

<!-- 2. Add styles -->
<link rel="stylesheet" href="https://apps.qa-cli.net/clic/elements/styles.css">

<!-- 3. Use clic-root custom element -->
<clic-root clic-uid="pe87-65th-w5g1" environment="clp"></clic-root>
```

### 11.3 CLIC Identifier Format

Example identifiers:
- `pe87-65th-w5g1`
- `p0th-987k-lvb3`

**Format:** Appears to be dash-separated random alphanumeric segments (no documented schema)

### 11.4 Environment Attribute

**Values:**
- `"clp"` - Clear Lesson Player
- (Other values not documented)

### 11.5 CLIC vs KITABOO Integration

**KITABOO Approach:**
- Wraps CLIC in iframe instead of direct custom element
- Passes identifier via URL query parameter: `?clicid={uid}`
- CLIC system handles rendering internally

**Reasons for Iframe:**
1. **Isolation:** CLIC styles/scripts don't conflict with KITABOO
2. **Security:** Sandboxed execution environment
3. **Lazy Loading:** Resources only loaded when iframe initializes
4. **Version Independence:** CLIC can update without KITABOO changes

---

## 12. State Management

### 12.1 Component States

**State 1: Form (Not Submitted)**
- `fieldData.settings.issubmitted`: `false`
- Shows form inputs
- User can edit CLIC identifier and instance name
- Submit button visible

**State 2: Iframe (Submitted)**
- `fieldData.settings.issubmitted`: `true`
- Hides form
- Shows iframe with CLIC content
- Iframe src set to CLIC URL

### 12.2 State Transitions

**Transition 1: Form → Iframe (User Action)**
```
User clicks Submit button
    ↓
submitCLIC() called
    ↓
issubmitted = true
    ↓
Angular re-renders
    ↓
Form hidden, iframe shown
```

**Transition 2: Form → Iframe (Auto)**
```
Directive initializes
    ↓
10ms setTimeout fires
    ↓
Check if clicuid exists
    ↓ (yes)
issubmitted = true
    ↓
Iframe shown immediately
```

**Note:** No transition from Iframe → Form. Once submitted, component cannot be "unsubmitted" without deleting and re-adding.

### 12.3 Data Persistence

**Saved to JSON:**
```json
{
  "clicuid": "pe87-65th-w5g1",
  "instancename": "Math Problem Set 1",
  "settings": {
    "issubmitted": true
  }
}
```

**On Page Reload:**
- If `clicuid` exists and `issubmitted` is `true` → Shows iframe
- If `clicuid` empty → Shows form
- Instance name currently not used in iframe URL

---

## 13. Known Issues & Limitations

### 13.1 Critical Issues

1. **No Validation**
   - Submit button fires without checking if fields are filled
   - Empty `clicuid` results in broken iframe URL
   - No error messaging for invalid identifiers

2. **Empty Settings Panel**
   - `sketchpad-settings.html` is completely empty
   - Clicking form fields opens blank settings panel
   - No way to reconfigure after submission

3. **Empty Preview Script**
   - `sketchpad-preview1.js` is empty
   - Component relies entirely on directive logic
   - May cause issues if preview behavior differs from editor

4. **No Unsubmit Functionality**
   - Once form is submitted, user cannot edit fields
   - Must delete component and re-add to change identifier
   - Poor user experience for typos

5. **Instance Name Unused**
   - `instancename` field is captured but not passed to CLIC
   - Unclear purpose - possibly for future use
   - Adds friction with no benefit

### 13.2 Moderate Issues

6. **Hardcoded iframe Dimensions**
   - `height="98%"` may not suit all layouts
   - No responsive adjustments
   - May clip content on small screens

7. **No Loading States**
   - No spinner or loading indicator while CLIC loads
   - User sees blank iframe during initialization
   - No error state if CLIC fails to load

8. **CORS/Security Concerns**
   - Iframe loads external content from Carnegie Learning domains
   - No explicit allowlist checking
   - Could fail if CLIC servers have CORS restrictions

9. **Missing Error Handling**
   - No try-catch around URL construction
   - No fallback if `clicBaseUrl` is undefined
   - Silent failures make debugging difficult

10. **Legacy Dependencies**
    - Directive depends on `modalService` but doesn't use it
    - `$compile` injected but never called
    - Code clutter from copy-paste boilerplate

### 13.3 Minor Issues

11. **Inconsistent setTimeout Delay**
    - 10ms delay arbitrary
    - Could use `$timeout(fn, 0)` for next digest cycle
    - Potential race condition if Angular hasn't fully initialized

12. **jQuery in Angular Directive**
    - Heavy use of jQuery instead of Angular idioms
    - Should use `angular.element()` for consistency
    - Makes testing harder

13. **Global Function Usage**
    - `enableDisableSaveButton(true)` is global
    - `con.safeApply()` tightly couples to main controller
    - Reduces modularity

14. **Inconsistent Code Style**
    - Mix of ES6 (template literals) and ES5 (function declarations)
    - Inconsistent quotes (single and double)
    - Some commented-out code

15. **No Accessibility Attributes**
    - Form has no ARIA labels
    - No focus management
    - Submit button not keyboard-accessible in all contexts

### 13.4 Documentation Issues

16. **Unclear CLIC Identifier Format**
    - No validation pattern documented
    - Unknown what constitutes valid identifier
    - No examples in code comments

17. **Missing Integration Docs**
    - No inline comments explaining iframe approach
    - POC doc in separate folder, not referenced in code
    - No troubleshooting guide

---

## 14. Edge Cases

### 14.1 Empty clicuid on Submit

**Scenario:** User clicks Submit without entering identifier

**Current Behavior:**
- Form submits successfully
- `issubmitted` becomes `true`
- Iframe shown with empty URL: `${baseUrl}?clicid=`
- CLIC likely returns error or 404

**Expected Behavior:**
- Validate before submit
- Show error message
- Prevent state transition

### 14.2 clicBaseUrl Not Configured

**Scenario:** `window.clicBaseUrl` is undefined and all fallbacks fail

**Current Behavior:**
- `getIframeUrl()` returns empty string: `""`
- Iframe `src` becomes: `""` (invalid)
- Browser may try to load same-origin page
- Console error: "CLIC base URL not found"

**Impact:** Component completely non-functional

### 14.3 Network Failure Loading CLIC Resources

**Scenario:** CLIC servers are down or unreachable

**Current Behavior:**
- Iframe shows blank/error page
- No fallback UI
- No error message to user

**Recommended:**
- Add iframe `onerror` handler
- Show user-friendly error message
- Provide retry mechanism

### 14.4 Invalid CLIC Identifier

**Scenario:** User enters non-existent CLIC ID

**Current Behavior:**
- URL constructed successfully
- CLIC system returns error (inside iframe)
- Error not surfaced to KITABOO
- User sees CLIC's error page

**Limitation:** Cannot validate identifier before submission without CLIC API call

### 14.5 Rapid Re-initialization

**Scenario:** Component added/removed/re-added quickly

**Current Behavior:**
- Multiple `setTimeout` calls may fire
- Potential duplicate iframe load attempts
- Unclear behavior

**Risk:** Low, but could cause flicker or double-requests

### 14.6 Special Characters in Identifier

**Scenario:** User enters identifier with spaces, special chars

**Current Behavior:**
- Characters passed to URL as-is
- May break URL parsing: `${baseUrl}?clicid=my id`
- CLIC system may reject

**Recommended:**
- URI encode identifier: `encodeURIComponent(clicuid)`

### 14.7 Very Long Identifier

**Scenario:** User pastes very long string

**Current Behavior:**
- CSS prevents display overflow (`white-space: nowrap; overflow: hidden`)
- Full string saved to data model
- Could exceed URL length limits (2048 chars)

**Recommended:**
- Impose character limit (e.g., 50 chars)

### 14.8 Multiple CLIC Components on Same Page

**Scenario:** Page has 2+ CLIC components

**Current Behavior:**
- Each component loads CLIC resources independently
- `player-container.js` loads resources once globally
- Multiple iframes to same domain (should work)

**Risk:** Resource duplication in editor mode

### 14.9 Offline/Package Mode

**Scenario:** EPUB exported and viewed offline

**Current Behavior:**
- Iframe tries to load external CLIC URL
- Network request fails
- Component non-functional

**Impact:** **CRITICAL** - Component unusable offline

**Recommendation:**
- Display warning in editor if component used
- Consider alternative offline fallback
- Document limitation clearly

### 14.10 Parent Window Cross-Origin Restrictions

**Scenario:** KITABOO running in iframe with different origin

**Current Behavior:**
- `window.parent.clicBaseUrl` access may throw SecurityError
- Try-catch in `player-container.js` handles this
- Falls back to `window.clicBaseUrl`

**Handled Gracefully:** Yes

---

## 15. Integration Testing Considerations

### 15.1 Unit Test Cases

**Directive Tests:**
1. `getIframeUrl()` constructs correct URL when `clicuid` set
2. `getIframeUrl()` returns empty string when `clicuid` empty
3. `submitCLIC()` sets `issubmitted` to `true`
4. `submitCLIC()` generates iframe URL
5. `updateText()` updates correct fieldData property
6. Auto-submit triggers if `clicuid` exists on init
7. Form shown if `issubmitted` is `false`
8. Iframe shown if `issubmitted` is `true`

**Configuration Tests:**
1. `clicBaseUrl` defined in config files
2. Production URL differs from staging
3. Component registered in `config.js`
4. Component allowed in expected layouts

### 15.2 Integration Test Cases

**Editor Workflow:**
1. Add CLIC component to page
2. Verify form displays
3. Enter CLIC identifier
4. Enter instance name
5. Click Submit
6. Verify iframe displays
7. Verify form hidden
8. Save page
9. Reload page
10. Verify iframe still displayed

**Preview Workflow:**
1. Create page with CLIC component
2. Submit form with valid identifier
3. Click Preview
4. Verify iframe renders
5. Verify CLIC content loads (requires network)
6. Test fullscreen functionality

**Reader Workflow:**
1. Publish content with CLIC component
2. Open in reader
3. Verify `player-container.js` sets iframe src
4. Verify CLIC resources load
5. Verify CLIC component interactive
6. Test across devices (desktop, tablet, mobile)

### 15.3 Cross-Browser Testing

**Target Browsers:**
- Chrome (latest, latest-1)
- Safari (latest, iOS Safari)
- Firefox (latest)
- Edge (latest)

**Known Compatibility:**
- Module scripts (`type="module"`) require modern browsers
- CLIC library handles its own polyfills

### 15.4 Environment Testing

**Test Scenarios:**
1. Staging environment with staging CLIC URL
2. Production environment with production CLIC URL
3. Mixed environment (staging auth, prod CLIC) - should fail gracefully
4. No `clicBaseUrl` defined - error handling
5. Invalid CLIC identifier - CLIC error page
6. CLIC servers down - network error handling

---

## 16. Recommendations for Improvement

### 16.1 High Priority

1. **Add Form Validation**
   ```javascript
   scope.submitCLIC = function() {
       if (!scope.fieldData.clicuid.trim()) {
           alert('Please enter a CLIC identifier');
           return;
       }
       
       if (!scope.fieldData.instancename.trim()) {
           alert('Please enter an instance name');
           return;
       }
       
       scope.fieldData.settings.issubmitted = true;
       scope.iframeUrl = scope.getIframeUrl();
   };
   ```

2. **Implement Un-submit Functionality**
   - Add "Edit" button when iframe is shown
   - Reset `issubmitted` to `false`
   - Clear iframe src to prevent reload issues

3. **Create Settings Panel**
   - Allow editing identifier post-submission
   - Add validation for identifier format
   - Include instance name configuration
   - Add "Test Connection" button

4. **Add Error Handling**
   ```javascript
   scope.getIframeUrl = function() {
       if (!scope.fieldData.clicuid) {
           console.error('CLIC identifier is required');
           return '';
       }
       
       var baseUrl = window.clicBaseUrl || window.parent.clicBaseUrl;
       
       if (!baseUrl) {
           console.error('CLIC base URL not configured');
           scope.showErrorMessage('CLIC service unavailable');
           return '';
       }
       
       var encodedId = encodeURIComponent(scope.fieldData.clicuid);
       return `${baseUrl}?clicid=${encodedId}`;
   };
   ```

5. **Implement Loading States**
   ```html
   <div ng-if="fieldData.settings.issubmitted && !iframeLoaded" class="loading">
       <span class="spinner"></span>
       <p>Loading CLIC component...</p>
   </div>
   
   <iframe 
       ng-if="fieldData.settings.issubmitted"
       ng-show="iframeLoaded"
       onload="angular.element(this).scope().onIframeLoad()"
       ...>
   </iframe>
   ```

### 16.2 Medium Priority

6. **Use Instance Name**
   - Pass as URL parameter: `&instance=${encodedName}`
   - Display in iframe title attribute
   - Use for analytics tracking

7. **Improve Offline Behavior**
   - Detect offline mode in editor
   - Show warning message when offline
   - Prevent submission if no network
   - Document offline limitations in help text

8. **Add Preview Script Logic**
   - Move reader initialization from `player-container.js` to preview script
   - Make component self-contained
   - Reduce coupling to global scripts

9. **Responsive Iframe**
   ```css
   .sample-page {
       position: relative;
       width: 100%;
       padding-bottom: 75%; /* 4:3 aspect ratio */
   }
   
   .sample-page iframe {
       position: absolute;
       top: 0;
       left: 0;
       width: 100%;
       height: 100%;
   }
   ```

10. **Accessibility Improvements**
    ```html
    <form aria-label="CLIC Component Configuration">
        <label for="clicuid" class="form-label">
            CLIC identifier
            <span class="required" aria-label="required">*</span>
        </label>
        <div 
            role="textbox"
            aria-required="true"
            aria-invalid="false"
            aria-describedby="clicuid-help"
            ...>
        </div>
        <small id="clicuid-help" class="help-text">
            Enter the unique CLIC component identifier
        </small>
    </form>
    ```

### 16.3 Low Priority

11. **Code Cleanup**
    - Remove unused dependencies (`modalService`, `$compile`)
    - Replace jQuery with Angular idioms
    - Add JSDoc comments
    - Consistent ES6 syntax

12. **Add Preview Thumbnail**
    - Capture CLIC iframe screenshot
    - Show in component library
    - Update when identifier changes

13. **Analytics Integration**
    - Track component usage
    - Log submission events
    - Monitor iframe load failures

14. **Internationalization**
    - Externalize form labels
    - Support RTL languages
    - Localized error messages

15. **Advanced Configuration**
    - Environment override (prod/stag toggle)
    - Custom base URL input
    - Iframe sandbox attributes
    - allowfullscreen toggle

---

## 17. Security Considerations

### 17.1 Iframe Security

**Current State:**
- No `sandbox` attribute
- Full permissions to iframe content
- `allowfullscreen` enabled

**Risks:**
- CLIC content could execute arbitrary JavaScript
- Potential clickjacking if CLIC site compromised
- No CSP restrictions

**Recommendations:**
```html
<iframe 
    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
    allow="fullscreen"
    ...>
</iframe>
```

**Note:** `allow-same-origin` needed if CLIC uses postMessage to communicate with parent.

### 17.2 URL Injection

**Vulnerability:** User could inject malicious URL if identifier not sanitized

**Current Protection:** None explicit

**Recommended:**
```javascript
scope.getIframeUrl = function() {
    if (scope.fieldData.clicuid) {
        var baseUrl = window.clicBaseUrl || window.parent.clicBaseUrl || '';
        
        // Validate baseUrl is from expected domain
        if (!/^https:\/\/(apps\.carnegielearning\.com|apps\.qa-cli\.net)\/clic\/$/.test(baseUrl)) {
            console.error('Invalid CLIC base URL');
            return '';
        }
        
        // URL encode to prevent injection
        var safeId = encodeURIComponent(scope.fieldData.clicuid);
        return `${baseUrl}?clicid=${safeId}`;
    }
    return '';
};
```

### 17.3 XSS via contenteditable

**Vulnerability:** User could paste HTML/script tags into contenteditable fields

**Current Protection:** Angular's `ng-model` sanitizes by default

**Additional Recommendation:**
```javascript
scope.updateText = function(event, keyName) {
    // Strip HTML tags
    var text = event.target.innerText.replace(/<[^>]*>/g, '');
    scope.fieldData[keyName] = text;
    
    // Update display to remove any HTML
    event.target.innerText = text;
};
```

### 17.4 Trusted Resource URL

**Protection:** `$sce.trustAsResourceUrl()` used implicitly via `| trusted` filter

**Verification:**
```html
ng-src="{{iframeUrl|trusted}}"
```

Ensures Angular's Strict Contextual Escaping (SCE) validates URL before setting iframe src.

---

## 18. Performance Considerations

### 18.1 Resource Loading

**Current Approach:**
- CLIC resources loaded on every page view
- Three separate script/CSS requests
- No caching strategy documented

**Optimization:**
- Add cache headers to CLIC resources
- Consider bundling polyfills + library
- Lazy load only when CLIC component present

### 18.2 Iframe Overhead

**Impact:**
- Each iframe creates new rendering context
- Separate JavaScript heap
- Increased memory usage

**Multiple Components:**
- 5 CLIC components = 5 iframes
- Could impact low-memory devices
- Consider component limit per page

### 18.3 setTimeout Usage

**Current:** 10ms delay on initialization

**Better Approach:**
```javascript
$timeout(function() {
    if (scope.fieldData.clicuid) {
        scope.fieldData.settings.issubmitted = true;
        scope.iframeUrl = scope.getIframeUrl();
    }
}, 0); // Use Angular's digest cycle
```

Or use `$scope.$evalAsync()` for immediate execution in same digest.

---

## 19. Documentation & Communication

### 19.1 User Documentation Needed

1. **Component Overview**
   - What is CLIC?
   - When to use this component
   - Limitations (requires internet, offline won't work)

2. **Author Guide**
   - How to obtain CLIC identifier
   - Where to find identifiers
   - Contact info for creating new CLIC components

3. **Troubleshooting**
   - Iframe doesn't load → Check identifier
   - Blank iframe → Check network/console
   - Error message → Contact Carnegie Learning support

### 19.2 Developer Documentation Needed

1. **Architecture Overview**
   - Iframe integration pattern
   - URL construction flow
   - Environment configuration

2. **Extending the Component**
   - Adding settings options
   - Implementing un-submit
   - Custom validation

3. **Testing Guide**
   - Local testing with mock CLIC server
   - Using test identifiers
   - Debugging iframe issues

---

## 20. Comparison with Other Components

### 20.1 vs Click to Reveal

| Aspect | CLIC (Sketchpad) | Click to Reveal |
|--------|------------------|-----------------|
| **Complexity** | Simple (form + iframe) | Complex (media, styles, interactions) |
| **Local Logic** | Minimal (~90 lines) | Extensive (~700 lines) |
| **Settings Panel** | Empty | Rich (color pickers, media upload) |
| **Self-Contained** | No (depends on external CLIC) | Yes (all logic local) |
| **Offline Support** | ❌ None | ✅ Full support |
| **Customization** | None (CLIC-side only) | Extensive (4 styles, colors, placement) |
| **Data Model** | 2 fields | 20+ settings |
| **Purpose** | Bridge to external system | Full-featured component |

### 20.2 Integration Pattern

**CLIC Approach:** **Embed External**
- Pro: Leverage external team's work
- Pro: Automatic updates from CLIC team
- Con: Network dependency
- Con: No offline support
- Con: Limited local customization

**Standard Approach:** **Build In-House**
- Pro: Full control over features
- Pro: Offline support
- Pro: Consistent with other components
- Con: More maintenance
- Con: Must implement all features

---

## 21. Conclusion

The CLIC (Sketchpad) component serves as a **lightweight bridge** between KITABOO and Carnegie Learning's CLIC interactive component library. Its design philosophy prioritizes:

1. **Simplicity:** Minimal local logic, delegate complexity to CLIC
2. **Isolation:** Iframe prevents style/script conflicts
3. **Flexibility:** CLIC team can update components independently

### 21.1 Strengths

- ✅ Clean separation of concerns
- ✅ Easy to add new CLIC components (just change identifier)
- ✅ No maintenance of actual interactive logic
- ✅ Secure iframe sandbox potential

### 21.2 Weaknesses

- ❌ No offline/package support (critical limitation)
- ❌ No validation or error handling
- ❌ Empty settings panel
- ❌ No un-submit functionality
- ❌ Network-dependent (single point of failure)
- ❌ Minimal documentation

### 21.3 Use Cases

**✅ Good For:**
- Online-only authoring environments
- Content requiring Carnegie Learning's specific CLIC components
- Rapid integration of external interactive elements

**❌ Not Good For:**
- Offline EPUB readers
- Packaged content for offline use
- Environments requiring full control over component behavior

### 21.4 Overall Assessment

The component is **functional but incomplete**. It successfully embeds CLIC content in online environments but lacks essential features for production readiness:

- **Validation** must be added
- **Settings panel** should be implemented
- **Offline alternative** needs consideration
- **Error handling** is critical

With these improvements, the CLIC component could be a robust integration point. Without them, it remains a proof-of-concept with significant user experience gaps.

---

## Appendix A: Key Contacts

**CLIC Development Team:**
- **Tech Lead:** Rick Parris
  - Email: rparris@carnegielearning.com
  - Slack: [Carnegie Learning Slack](https://carnegielearning.slack.com/team/U06HA6268E8)
  
- **Management:** Rich Abbott
  - Email: rabbott@carnegielearning.com
  - Slack: Carnegie Learning Slack

---

## Appendix B: File Reference Quick Guide

| File | Location | Purpose |
|------|----------|---------|
| Main Template | `templates/sketch-pad/sketchpad.html` | Form and iframe HTML |
| Directive | `templates/sketch-pad/scripts/sketchpad-directive.js` | Component logic |
| Styles | `templates/sketch-pad/styles/sketchpad.css` | Visual styling |
| Config | `templates/sketch-pad/default/sketchpad.json` | Default data model |
| Registration | `config/config.js` (Line 2199, 266) | Component metadata |
| Reader Init | `js/player-container.js` (Line 6690-6750) | Reader integration |
| Preview | `editor/ngcontroller.js` (Line 13056-13068) | Preview generation |

---

## Appendix C: Glossary

| Term | Definition |
|------|------------|
| **CLIC** | Carnegie Learning Instructional Components - external interactive component library |
| **clicuid** | Unique identifier for a CLIC component instance |
| **clicBaseUrl** | Base URL for CLIC server (production or staging) |
| **issubmitted** | Boolean flag tracking form submission state |
| **Sketchpad** | Internal codename for CLIC component integration |

---

**End of Document**
