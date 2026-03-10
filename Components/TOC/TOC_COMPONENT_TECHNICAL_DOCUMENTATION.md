# Table of Contents (TOC) Component — Technical Documentation

---

## Overview

The **Table of Contents (TOC)** is the central navigation panel in KITABOO Authoring. It is activated
when `TOCFlag === 'flat'` and rendered through the AngularJS `newToc` directive defined in
`editor/ngdragdrop.js`. The panel lives in the left sidebar of the authoring canvas and manages
the full lesson structure: Instructions pages, Steps, Level-of-Support (LOS) variants, and
chapter headings.

### Key Capabilities

| Capability | Description |
|---|---|
| Page Navigation | Click any TOC row to auto-save and navigate to that page |
| Add Step | "+ Add" dropdown → "Add New Step" via `#widget-popup` modal |
| Import Step | "+ Add" → "Import From Library" via Asset Library modal |
| Drag-reorder | jQuery UI Sortable on `.toc-steps-list` for reordering steps |
| Clone LOS Level | 3-dot menu → "Clone New Level" for new LOS variant |
| Edit Metadata | 3-dot menu → "Edit Metadata" via `#formsModal` |
| Delete Page | 3-dot menu → "Delete" (guarded by `canDeletePage()`) |
| Move Up / Down | Arrow buttons for fine-grained page sequence control |

---

## Component Metadata

| Property | Value |
|---|---|
| **Directive Name** | `newToc` |
| **Selector** | `[new-toc]` |
| **Activation Flag** | `TOCFlag === 'flat'` |
| **Primary Controller** | `editor/ngcontroller.js` |
| **Directive File** | `editor/ngdragdrop.js` |
| **Step Operations** | `js/page-tray.js` |
| **LOS Variants** | CORE, LIGHT, MODERATE, INTENSIVE |
| **Drag-Sort Library** | jQuery UI Sortable |
| **Icon Registry** | `TocFlatStepIcon` in `config/config.js` |

---

## File Structure

```
KITABOO_Authoring/
├── index.html                         ← TOC panel HTML (lines 983–1177)
│   └── [new-toc directive host]
│
├── editor/
│   ├── ngcontroller.js                ← All TOC lifecycle functions
│   │   ├── getTOCData(id)
│   │   ├── createGroupTOC()
│   │   ├── flattenTocArray(data)
│   │   ├── createRefidmap()
│   │   ├── setupSortableTOCList()
│   │   ├── reArrangeGroupTOC()
│   │   ├── saveTOCtoBackend()
│   │   ├── tocSectionDeletePopup()
│   │   ├── tocSectionUp() / tocSectionDown()
│   │   └── fetchTOCforInternal()
│   │
│   └── ngdragdrop.js                  ← newToc directive + tocPageClick
│       ├── App.directive('newToc')
│       ├── tocPageClick(event, isLoad)
│       └── updateActivePageToc(index)
│
├── js/
│   └── page-tray.js                   ← Step-level page operations
│       ├── toinsertNewLevelSupport()
│       ├── capitalizeLOS()
│       ├── canDeletePage()
│       ├── tocSectionEditPopup()
│       └── tocSectionClonePopup()
│
├── config/
│   └── config.js                      ← TocFlatStepIcon icon registry
│
├── templates/
│   └── toc-delete-modal.html          ← Delete confirmation modal stub
│
├── css/
│   └── authoring/
│       └── authoring-style.css        ← All TOC visual styles
│
└── assets/
    └── image_library/
        └── TOC/                       ← Step type SVG icons
            ├── Instruction.svg
            ├── genericStep.svg
            ├── Customstep.svg
            ├── FillintheBlanks.svg
            ├── DragnDrop.svg
            └── Annotation.svg
```

---

## Data Model

### Flat Page Object (`$rootScope.tocInfo[]`)

Each backend page entry flattened by `flattenTocArray()`:

```json
{
  "id": "<pageDbId>",
  "pageSequence": 1,
  "originalPageSequence": 1,
  "pageReferenceId": "<string>",
  "pageType": "studentInstructions | teacherInstructions | <step-page>",
  "metadata": {
    "identifier": "fill-in-the-blank | multiple-choice-template | ...",
    "name": "Fill in the Blanks | ...",
    "stepTitle": "Step title text",
    "stepid": 101,
    "levelsOfSupport": ["CORE", "LIGHT", "MODERATE"],
    "pageTrayIcon": "<optional SVG path override>",
    "studentInstructions": "<text>",
    "supportContentJson": [],
    "clicData": []
  },
  "headers": []
}
```

### Grouped TOC (`$rootScope.grouptoc`)

UI-facing model built by `createGroupTOC()`:

```javascript
$rootScope.grouptoc = {
  studentInstructions: { id, pageSequence, ... },
  teacherInstructions: { id, pageSequence, ... },
  steps: [
    // Step 1 — LOS variants
    [ pageObj_CORE, pageObj_LIGHT, pageObj_MODERATE ],
    // Step 2
    [ pageObj_CORE ],
    // Step N...
  ]
}
```

The template iterates:
- **Outer**: `ng-repeat="step in grouptoc.steps"` → renders Step: 1, Step: 2, etc.
- **Inner**: `ng-repeat="pages in step"` → renders "Page 1: Title", "Page 2: Title" LOS variants.

### Icon Registry (`TocFlatStepIcon`)

Maps `metadata.identifier` to SVG file paths in `assets/image_library/TOC/`:

| Identifier | Icon File | Purpose |
|---|---|---|
| instructions | `Instruction.svg` | Instructions for Students/Teacher |
| generic | `genericStep.svg` | Generic step pages |
| fib | `FillintheBlanks.svg` | Fill in the Blank steps |
| dnd | `DragnDrop.svg` | Drag & Drop steps |
| annotation | `Annotation.svg` | Annotation steps |
| custom | `Customstep.svg` | Custom step types |

---

## UML Class Diagram

```
┌─────────────────────────────────────────────┐
│              TOCController                   │
│─────────────────────────────────────────────│
│ + tocData: Object                            │
│ + TOCFlag: String                            │
│─────────────────────────────────────────────│
│ + getTOCData(bookId)                         │
│ + createGroupTOC()                           │
│ + flattenTocArray(data): Array               │
│ + createRefidmap()                           │
│ + setupSortableTOCList()                     │
│ + reArrangeGroupTOC()                        │
│ + saveTOCtoBackend()                         │
│ + tocSectionDeletePopup(event)               │
│ + tocSectionUp(event)                        │
│ + tocSectionDown(event)                      │
└─────────────────┬───────────────────────────┘
                  │ builds
                  ▼
┌─────────────────────────────────────────────┐
│                GroupToc                      │
│─────────────────────────────────────────────│
│ + studentInstructions: TocInfo               │
│ + teacherInstructions: TocInfo               │
│ + steps: Array<Array<TocInfo>>               │
└─────────────────┬───────────────────────────┘
                  │ references
                  ▼
┌─────────────────────────────────────────────┐
│                 TocInfo                      │
│─────────────────────────────────────────────│
│ + id: String                                 │
│ + pageSequence: Number                       │
│ + originalPageSequence: Number               │
│ + pageType: String                           │
│ + metadata: TocMetadata                      │
│ + headers: Array                             │
└─────────────────┬───────────────────────────┘
                  │ contains
                  ▼
┌─────────────────────────────────────────────┐
│               TocMetadata                    │
│─────────────────────────────────────────────│
│ + identifier: String                         │
│ + name: String                               │
│ + stepTitle: String                          │
│ + stepid: Number                             │
│ + levelsOfSupport: Array                     │
│ + supportContentJson: Array                  │
└─────────────────────────────────────────────┘
```

---

## API Endpoints

| Scope Variable | URL | Method | Purpose |
|---|---|---|---|
| `fetchTOCUrl` | `/services/tocServices/v1/fetchTOC` | GET | Load all TOC pages for a book |
| `saveTOCUrl` | `/services/tocServices/v1/saveAndEditTOC` | POST | Persist canvas chapter headings |
| `deleteTOCUrl` | `/services/tocServices/v1/deletTOCHeader/{pageId}` | DELETE | Remove a chapter heading from TOC |
| `savePhysicalPage` | `/services/tocServices/v1/savePhysicalPage` | POST | Create or clone a step page |
| `deletePhysicalPage` | `/services/tocServices/v1/deletePage/{pageId}` | DELETE | Permanently remove a page |
| `saveContent` | `/services/tocServices/v1/saveContent` | POST | Save canvas HTML content for a page |
| `fetchContent` | `/services/tocServices/v1/fetchContent/{pageId}` | GET | Load page content onto canvas |
| `tocSectionSequence` | `/services/htmlEditorServices/v1/updateTheSectionSequence` | PUT | Persist reordered step sequences |
| `deletePageUrl` | `/services/htmlEditorServices/deleteTocContent` | DELETE | Remove TOC heading from HTML editor |

---

## CRUD Operations

| Operation | Trigger | Handler | Backend Call |
|---|---|---|---|
| **Add Step** | + Add → "Add New Step" | `savePhysicalPage()` | POST savePhysicalPage |
| **Import from Library** | + Add → "Import From Library" | `openAssetLibrary() → addActivityFromLibrary()` | duplicatePhysicalPage() |
| **Edit Step Metadata** | Page 3-dot → "Edit Metadata" | `tocSectionEditPopup(event, pages)` | POST savePhysicalPage |
| **Clone Step (new LOS)** | Page 3-dot → "Clone New Level" | `tocSectionClonePopup(event, pages)` | POST savePhysicalPage (clone) |
| **Add LOS to Step** | Step 3-dot → "Duplicate New level" | `toinsertNewLevelSupport(event, step)` | Asset Library modal |
| **Delete Page** | Page 3-dot → "Delete" | `tocSectionDeletePopup() → deletePhysicalPage()` | DELETE deletePhysicalPage |
| **Reorder Steps** | Drag-and-drop step rows | `reArrangeGroupTOC()` | PUT tocSectionSequence |
| **Move Up / Down** | Arrow buttons | `tocSectionUp() / tocSectionDown()` | PUT tocSectionSequence |
| **Delete Canvas Heading** | Delete heading on canvas | `ngdragdrop.js direct AJAX` | DELETE deleteTOCUrl |

---

## Sequence: Initial TOC Load

```
App Bootstrap
  └─► getTOCData(bookId)
        └─► GET /fetchTOC → backend
              └─► flattenTocArray() → $rootScope.tocInfo[]
                    └─► createRefidmap() → window.orgSequenceRefidmap
                          └─► createGroupTOC() → $rootScope.grouptoc
                                └─► AngularJS digest → ng-repeat renders panel
                                      └─► GET fetchContent(firstPageId)
                                            └─► Canvas renders first page
```

## Sequence: Page Click (Navigation)

```
User clicks TOC row
  └─► tocPageClick(event, isLoad=true)
        ├─► savePageContent() → POST /saveContent
        ├─► saveTOCtoBackend() → POST /saveAndEditTOC (per heading)
        ├─► Update [new-toc] attrs: pagedbid, pagesequence
        ├─► Set .activeTocItem on clicked row
        └─► fetchPageContent(newPageId) → GET /fetchContent/{id}
              └─► Canvas renders new page
```

## Sequence: Add New Step

```
User clicks "+ Add" → "Add New Step"
  └─► Opens #widget-popup modal
        └─► User fills metadata + selects step type + LOS
              └─► savePhysicalPage(metadata) → POST /savePhysicalPage
                    └─► getTOCData() (full refresh)
                          └─► createGroupTOC() (rebuild)
                                └─► ng-repeat updates → new Step row appears
                                      └─► Navigate to new page
```

---

## Key Functions Reference

### `ngcontroller.js`

| Function | Purpose |
|---|---|
| `getTOCData(id)` | Fetches TOC, populates tocInfo[], calls createGroupTOC + fetchPageContent |
| `createGroupTOC()` | Groups tocInfo[] by stepid into grouptoc.steps array |
| `flattenTocArray(data)` | Converts nested backend response into flat tocInfo array |
| `createRefidmap()` | Builds orgSequenceRefidmap for internal hyperlink chooser |
| `setupSortableTOCList()` | Enables jQuery UI drag-sort on .toc-steps-list |
| `reArrangeGroupTOC()` | Reads DOM order post-drag and PUTs new sequences to backend |
| `saveTOCtoBackend()` | Scans canvas for heading elements and POSTs each to saveTOCUrl |
| `tocSectionDeletePopup(event)` | Shows delete confirm; stores pageId for confirmation handler |
| `tocSectionDeleteConfirmationPopup()` | Calls deletePhysicalPage after user confirms |
| `tocSectionUp(event)` | Swaps originalPageSequence with preceding page → PUT backend |
| `tocSectionDown(event)` | Swaps originalPageSequence with following page → PUT backend |
| `fetchTOCforInternal()` | Loads TOC data for internal hyperlink picker dialog |

### `ngdragdrop.js`

| Function / Directive | Purpose |
|---|---|
| `App.directive('newToc', ...)` | Core directive wrapping TOC panel; tracks active page attrs |
| `tocPageClick(event, isLoad)` | Handles row click: save → navigate → highlight active item |
| `updateActivePageToc(index)` | Updates active TOC item after drag-delete operations |

### `page-tray.js`

| Function | Purpose |
|---|---|
| `toinsertNewLevelSupport(event, pages)` | Opens Asset Library to add new LOS variant to a step |
| `capitalizeLOS(str)` | Formats "LIGHT-MULTILINGUAL" → "Light-Multilingual" for display |
| `canDeletePage(pages)` | Guard: returns false if page is CORE with sibling LOS variants |
| `tocSectionEditPopup(event, pages)` | Opens edit modal pre-filled with step metadata |
| `tocSectionClonePopup(event, pages)` | Opens modal to clone step into a new LOS level |

---

## CSS Classes Reference

| Class | File | Description |
|---|---|---|
| `.newTocPanel` | authoring-style.css | Outer panel container with `sideBar-2` layout |
| `.toc-outer-container` | authoring-style.css | Scrollable inner area holding all TOC items |
| `.toc-container` | authoring-style.css | Single TOC row (instructions or step page) |
| `.toc-steps-list` | authoring-style.css | Drag-sortable container for step groups |
| `.toc-stepPages-container` | authoring-style.css | Per-step wrapper; holds step header + page rows |
| `.subTocName` | authoring-style.css | Inner list item for page name + type label |
| `.activeTocItem` | authoring-style.css | Highlight applied to the currently active page row |
| `.pageTypeTitle` | authoring-style.css | Small label showing step type (e.g., "Generic Step") |
| `.losTag` / `.losTagTitle` | authoring-style.css | Badge showing LOS level (CORE, LIGHT, etc.) |
| `.tocPageIcon` | authoring-style.css | 3-dot context menu trigger on each page row |
| `.tocSectionDeletePopup` | authoring-style.css | Confirmation popup for step deletion |

---

## Known Behaviors & Design Notes

1. **Auto-save on navigate**: Clicking any TOC row triggers `savePageContent()` and `saveTOCtoBackend()`
   before the new page is loaded. There is no separate "Save" button for this flow.

2. **Heading sync**: Canvas headings (`.chapter-headingNew-h1`, `[data-type="header"]`) are scanned
   and synced to the TOC on every page save to keep the chapter list current.

3. **CORE-first rule**: The CORE LOS variant must always be the first page in a step. Other variants
   (LIGHT, MODERATE, INTENSIVE) are added or cloned after CORE exists.

4. **Drag-sort scope**: Only the `.toc-steps-list` is drag-sortable. The Instructions for Students
   and Instructions for Teacher entries are fixed at the top.

5. **Internal hyperlinks**: `createRefidmap()` populates `window.orgSequenceRefidmap`, which the
   internal hyperlink picker uses to resolve page reference IDs to display titles.

6. **Full refresh after mutation**: Every add, delete, or clone calls `getTOCData()` to reload
   the authoritative server state — no optimistic local update is applied.

7. **TOCFlag check**: The entire TOC panel is wrapped in `ng-if="TOCFlag==='flat'"`. Books configured
   with a different TOC mode will not render this panel.

8. **Delete guard**: `canDeletePage()` hides the Delete option on CORE pages that have sibling
   LOS variants. Deleting CORE while dependents exist would orphan those pages.
