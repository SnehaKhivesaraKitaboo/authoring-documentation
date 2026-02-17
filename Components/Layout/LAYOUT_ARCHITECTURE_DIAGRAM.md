# Layout Component Architecture Diagrams

## 1. High-Level System Architecture

```mermaid
graph TB
    subgraph "User Interface Layer"
        A[Widget Panel] --> B[Main Editor Canvas]
        B --> C[Settings Panel]
    end
    
    subgraph "Controller Layer"
        D[DragDropCtrl / ngcontroller.js]
        E[layoutTemplate Directive]
    end
    
    subgraph "Service Layer"
        F[TemplateService]
        G[ShellService]
        H[modalService]
    end
    
    subgraph "Data Layer"
        I[config.js - Widget Definitions]
        J[layout.json - Default Settings]
        K[$scope.savedJson - Runtime State]
    end
    
    subgraph "Presentation Layer"
        L[layout1.html - Layout-1]
        M[layout2.html - Layout-2]
        N[layout3.html - Layout-3]
        O[layout4.html - Layout-4]
        P[layout5.html - Layout-5]
        Q[layout6.html - Layout-6]
        R[layout-template.css]
    end
    
    A -->|Widget Data| D
    B -->|Drop Event| E
    C -->|Settings Change| D
    D -->|Manages State| K
    D <-->|Calls| F
    D <-->|HTTP Requests| G
    E -->|Compiles Templates| L
    E -->|Compiles Templates| M
    E -->|Compiles Templates| N
    E -->|Compiles Templates| O
    E -->|Compiles Templates| P
    E -->|Compiles Templates| Q
    F -->|Fetches JSON| J
    I -->|Widget Metadata| D
    K -->|Data Binding| L
    R -->|Styles| L
    R -->|Styles| M
    R -->|Styles| N
    R -->|Styles| O
    R -->|Styles| P
    R -->|Styles| Q
    
    style A fill:#e1f5ff
    style B fill:#e1f5ff
    style C fill:#e1f5ff
    style D fill:#fff4e1
    style E fill:#fff4e1
    style F fill:#ffe1e1
    style G fill:#ffe1e1
    style H fill:#ffe1e1
    style I fill:#f0e1ff
    style J fill:#f0e1ff
    style K fill:#f0e1ff
    style L fill:#e1ffe1
    style M fill:#e1ffe1
    style N fill:#e1ffe1
    style O fill:#e1ffe1
    style P fill:#e1ffe1
    style Q fill:#e1ffe1
    style R fill:#e1ffe1
```

## 2. Data Flow: Widget Drop Operation

```mermaid
sequenceDiagram
    participant User
    participant WidgetPanel as Widget Panel
    participant LayoutHTML as layout1.html
    participant Directive as layoutTemplate Directive
    participant Controller as Main Controller
    participant Service as TemplateService
    participant State as savedJson
    
    User->>WidgetPanel: Selects and drags widget
    WidgetPanel->>LayoutHTML: dragstart with widget data
    User->>LayoutHTML: Drops widget on column
    activate LayoutHTML
    LayoutHTML->>Directive: ng-drop-success fires
    activate Directive
    Directive->>Directive: Validate drop (empty, isDroppable)
    alt Drop Valid
        Directive->>Controller: findTag(widgetData)
        activate Controller
        Controller->>Service: getJSONData(widget.json)
        activate Service
        Service-->>Controller: Returns default JSON
        deactivate Service
        Controller->>Controller: addAttr() creates DOM
        Controller->>State: savedJson[page][id] = widgetData
        Controller-->>Directive: Returns compiled element
        deactivate Controller
        Directive->>LayoutHTML: Append widget to column
        Directive->>Directive: Update fieldData.template1
        Directive->>Controller: Track undo/redo
        Directive->>Controller: enableDisableSaveButton(true)
        Directive-->>LayoutHTML: Widget rendered
        LayoutHTML-->>User: Widget visible in layout
    else Drop Invalid
        Directive->>Directive: Silent return
        Directive-->>User: No visual feedback
    end
    deactivate Directive
    deactivate LayoutHTML
```

## 3. Component Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Initialization
    
    Initialization --> LoadingTemplate: User adds layout to page
    LoadingTemplate --> FetchingJSON: Load layout HTML
    FetchingJSON --> CompilingDirective: TemplateService.getJSONData()
    CompilingDirective --> RenderingColumns: $compile() directive
    RenderingColumns --> AwaitingContent: Render empty columns
    
    AwaitingContent --> ActiveEditing: User drops widget
    ActiveEditing --> CompilingWidget: Widget compilation
    CompilingWidget --> AwaitingContent: Widget rendered
    
    AwaitingContent --> ShowingSettings: User clicks layout
    ShowingSettings --> AwaitingContent: Settings closed
    
    ShowingSettings --> UpdatingSettings: User toggles fullWidth
    UpdatingSettings --> ReRendering: Apply new settings
    ReRendering --> AwaitingContent: Layout updated
    
    AwaitingContent --> PreviewMode: User clicks Preview
    PreviewMode --> AwaitingContent: Back to Editor
    
    AwaitingContent --> Saving: User clicks Save
    Saving --> Persisted: JSON saved to server
    Persisted --> AwaitingContent: Continue editing
    
    AwaitingContent --> [*]: Layout deleted
    Persisted --> [*]: Page closed
```

## 4. Layout-6 Question Bank Flow

```mermaid
graph TB
    subgraph "Layout-6 Structure"
        A[Layout-6 Container]
        A --> B[Left Column questionBank]
        A --> C[Right Column questionBank2]
        
        B --> D[Question 1]
        B --> E[Question 2]
        B --> F[Question 3]
        B --> G[... up to 15]
        
        C --> H[Question 1]
        C --> I[Question 2]
        C --> J[Question 3]
        C --> K[... up to 15]
    end
    
    subgraph "Add Question Flow"
        L[User drops widget] -->|Into left column| M{Check questionIndex}
        M -->|boxNo = 0| N[Update questionBank array]
        M -->|boxNo = 1| O[Update questionBank2 array]
        N --> P{Length < 15?}
        O --> P
        P -->|Yes| Q[Add empty slot]
        P -->|No| R[Silently stop]
        Q --> S[Render new question]
    end
    
    subgraph "Shuffle Feature (Not Implemented)"
        T[shuffleQuestionCheckbox] -.->|Should trigger| U[Shuffle questionBank]
        T -.->|Should trigger| V[Shuffle questionBank2]
        U -.->|Missing logic| W[fisherYatesShuffle]
        V -.->|Missing logic| W
    end
    
    N -.-> D
    O -.-> H
    
    style A fill:#ffe1e1
    style B fill:#e1f5ff
    style C fill:#e1f5ff
    style T fill:#ffcccc
    style U fill:#ffcccc
    style V fill:#ffcccc
    style W fill:#ffcccc
```

## 5. Copy-Paste Data Flow

```mermaid
graph LR
    subgraph "Copy Phase"
        A[User right-clicks widget] --> B[Context menu: Copy]
        B --> C[componentCopy in controller]
        C --> D[Extract widget data]
        C --> E[Extract full JSON structure]
        D --> F[localStorage.setItem data]
        E --> G[localStorage.setItem copiedComponent]
    end
    
    subgraph "Paste Phase"
        H[User hovers paste zone] --> I[showPasteHere = true]
        I --> J[Zone highlights blue]
        J --> K[User clicks paste zone]
        K --> L[pastecomp fires]
        L --> M[componentPaste in controller]
        M --> N[Read from localStorage]
        N --> O[onPasteDropComplete]
        O --> P{Validate}
        P -->|Valid| Q[findTag with copiedComponent]
        P -->|Invalid| R[Silent abort]
        Q --> S[Append to column]
        S --> T[Update fieldData]
        T --> U[Compile widget]
        U --> V[Widget rendered]
    end
    
    F -.-> N
    G -.-> N
    
    style F fill:#fff4e1
    style G fill:#fff4e1
    style N fill:#e1ffe1
    style R fill:#ffcccc
```

## 6. Settings Panel Integration

```mermaid
graph TB
    A[User clicks layout background] --> B[Click event bubbles up]
    B --> C[.sd-item click handler fires]
    C --> D[Get layout identifier]
    D --> E[Get data-saved-index]
    E --> F[Filter widgets by dataType]
    F --> G[Open settings panel]
    G --> H[Populate currSettings]
    
    subgraph "currSettings Object"
        H --> I[fullWidth: boolean]
        H --> J[layoutType: string]
        H --> K[templateName: string]
        H --> L[templateImage: iconClass]
        H --> M[layoutPageDataIndex: string]
    end
    
    I --> N{User toggles fullWidth}
    N -->|Check| O[Set fullWidth = true]
    N -->|Uncheck| P[Set fullWidth = false]
    O --> Q[attr data-pagemargin=fullwidth]
    P --> R[attr data-pagemargin=narrow]
    Q --> S[CSS applies max-width: 100%]
    R --> T[CSS applies max-width: 960px]
    
    S --> U[Layout adjusts width]
    T --> U
    
    style A fill:#e1f5ff
    style G fill:#ffe1e1
    style N fill:#fff4e1
    style U fill:#e1ffe1
```

## 7. Responsive Breakpoint Logic

```mermaid
graph TB
    A[Page loads] --> B{Screen width?}
    
    B -->|> 586px Desktop| C[Apply desktop styles]
    C --> D[Multi-column layout]
    D --> E[layout-1: 30% - 70%]
    D --> F[layout-2: 50% - 50%]
    D --> G[layout-3: 70% - 30%]
    D --> H[layout-4: 25% x 4]
    D --> I[layout-5: 33.33% x 3]
    
    B -->|<= 586px Mobile| J[Apply mobile styles]
    J --> K[Single column stack]
    K --> L[All columns: width 100%]
    L --> M[Vertical spacing added]
    M --> N[First column: pb-10px]
    M --> O[Last column: pt-10px]
    
    P[Window resize] --> B
    
    Q[.mobile-view class] -.-> J
    R[.readium-multiple-column class] -.-> J
    
    style C fill:#e1f5ff
    style J fill:#ffe1e1
    style D fill:#e1ffe1
    style K fill:#ffcccc
```

## 8. Error Handling Flow

```mermaid
graph TB
    A[User attempts drop] --> B{Validation Checks}
    
    B -->|data exists?| C{Drop zone empty?}
    B -->|No data| D[Silent Abort]
    
    C -->|Yes, empty| E{isDroppable flag?}
    C -->|No, occupied| F[Silent Abort]
    
    E -->|True| G{isPastable flag?}
    E -->|False| H[Silent Abort]
    
    G -->|True| I[Proceed with drop]
    G -->|False| J[Silent Abort]
    
    I --> K[findTag creates widget]
    K --> L{Widget compilation}
    
    L -->|Success| M[Widget rendered]
    L -->|Error| N[Console.error logged]
    N --> O[Empty div shown]
    
    Q[TemplateService.getJSONData] -->|HTTP Error| R[Console.log error]
    R --> S[Widget without defaults]
    
    D --> T[No user feedback]
    F --> T
    H --> T
    J --> T
    O --> T
    S --> T
    
    style D fill:#ffcccc
    style F fill:#ffcccc
    style H fill:#ffcccc
    style J fill:#ffcccc
    style N fill:#ff9999
    style R fill:#ff9999
    style T fill:#ff6666
```

## 9. Widget Compilation Process

```mermaid
graph TB
    A[compileAndAppendHtml called] --> B[Get main controller scope]
    B --> C{Content exists?}
    C -->|Yes| D[Remove first-time-load class]
    C -->|No| E[Use empty string]
    D --> F[$compile content with scope]
    E --> F
    F --> G[Generate Angular directives]
    G --> H[Create DOM elements]
    H --> I[Initialize nested widgets]
    I --> J[Apply event listeners]
    J --> K[Process ng-model bindings]
    K --> L[Execute directive link functions]
    L --> M[Render in column-content div]
    M --> N[Widget visible]
    
    O[$timeout waits for DOM] --> A
    
    P[fieldData.template1] -.-> C
    Q[fieldData.template2] -.-> C
    R[fieldData.template3] -.-> C
    
    style A fill:#fff4e1
    style F fill:#ffe1e1
    style M fill:#e1ffe1
```

## 10. Undo/Redo Tracking

```mermaid
sequenceDiagram
    participant User
    participant Directive as layoutTemplate Directive
    participant Controller as Main Controller
    participant UndoStack as undo_stack Array
    
    User->>Directive: Drops widget
    Directive->>Directive: onDropComplete()
    Directive->>Controller: findTag() creates widget
    Controller-->>Directive: Returns item element
    Directive->>Directive: Append item to DOM
    
    Note over Directive: Wait 600ms for widget initialization
    Directive->>Directive: setTimeout 600ms
    
    Directive->>Directive: Extract widget metadata
    Note over Directive: Get data-type, uniqueid, pageNo, uuid
    
    Directive->>UndoStack: Push action object
    Note over UndoStack: {<br/>Action: "DragComponent",<br/>data-type: "paragraph",<br/>uniqueid: "12345",<br/>pageNo: 1,<br/>data: {...},<br/>uuid: [...],<br/>parentid: "uuid",<br/>parentdatatype: "layout-1"<br/>}
    
    User->>Controller: Clicks Undo
    Controller->>UndoStack: Pop last action
    UndoStack-->>Controller: Returns action object
    Controller->>Controller: Reverse action (remove widget)
    Controller->>Controller: Push to redo_stack
```

## 11. Full Width Toggle Mechanism

```mermaid
graph TB
    A[Layout rendered with settings] --> B{fullWidth in settings?}
    B -->|true| C[Set data-pagemargin=fullwidth]
    B -->|false| D[Set data-pagemargin=narrow]
    
    E[User opens settings panel] --> F[Checkbox reflects fullWidth state]
    F --> G[User toggles checkbox]
    G --> H[change event on .layout-width-setup]
    H --> I{Current fullWidth value?}
    
    I -->|false| J[Set fullWidth = true]
    I -->|true| K[Set fullWidth = false]
    
    J --> L[Find element by layoutPageDataIndex]
    K --> L
    L --> M[Set data-pagemargin attribute]
    M --> N[CSS reads attribute]
    
    subgraph "CSS Processing"
        N --> O{data-pagemargin value?}
        O -->|fullwidth| P[max-width: 100%]
        O -->|narrow| Q[max-width: 960px, margin: auto]
    end
    
    P --> R[Layout spans full viewport]
    Q --> S[Layout centered with margins]
    
    C --> N
    D --> N
    
    style C fill:#e1f5ff
    style D fill:#ffe1e1
    style P fill:#e1ffe1
    style Q fill:#fff4e1
```

## 12. Layout Type Comparison

```mermaid
graph TB
    subgraph "Layout Hierarchy"
        A[Layout Component System]
        
        A --> B[Two-Column Layouts]
        A --> C[Multi-Column Layouts]
        A --> D[Dynamic Layouts]
        
        B --> E[Layout-1: Left 30-70]
        B --> F[Layout-2: Center 50-50]
        B --> G[Layout-3: Right 70-30]
        
        C --> H[Layout-4: Four Column 25-25-25-25]
        C --> I[Layout-5: Three Column 33-33-33]
        
        D --> J[Layout-6: Custom Center with Questions]
    end
    
    subgraph "Common Features"
        K[Drag & Drop]
        L[Copy & Paste]
        M[Settings Panel]
        N[Full Width Toggle]
        O[Responsive Stacking]
    end
    
    subgraph "Layout-6 Unique Features"
        P[Question Banks]
        Q[Scrollable Containers]
        R[Shuffle Support*]
        S[Max 15 Questions per bank]
    end
    
    E --> K
    F --> K
    G --> K
    H --> K
    I --> K
    J --> K
    
    E --> N
    F --> N
    G --> N
    H --> N
    I --> N
    J --> N
    
    J --> P
    J --> Q
    J --> R
    J --> S
    
    style A fill:#e1f5ff
    style B fill:#ffe1e1
    style C fill:#fff4e1
    style D fill:#e1ffe1
    style R fill:#ffcccc
```

## 13. Mode-Based Rendering

```mermaid
graph TB
    A[Layout Component] --> B{Rendering Mode}
    
    B -->|Editor Mode| C[Full Authoring Interface]
    C --> D[Show borders]
    C --> E[Show drop zones]
    C --> F[Show widget toolbars]
    C --> G[Enable drag-drop]
    C --> H[Enable settings panel]
    C --> I[Two-way data binding]
    
    B -->|Preview Mode| J[Read-Only Preview]
    J --> K[Hide borders]
    J --> L[Hide drop zones]
    J --> M[Hide toolbars]
    J --> N[Disable editing]
    J --> O[Interactive widgets active]
    
    B -->|Reader Mode| P[Published Content]
    P --> Q[Clean presentation]
    P --> R[No authoring tools]
    P --> S[Full interactivity]
    P --> T[Progress tracking]
    P --> U[Assessment submission]
    
    B -->|Offline/Package Mode| V[EPUB/SCORM Package]
    V --> W[Bundled resources]
    V --> X[Local JSON data]
    V --> Y[Queue submissions]
    V --> Z[No cloud sync]
    
    style C fill:#e1f5ff
    style J fill:#ffe1e1
    style P fill:#fff4e1
    style V fill:#e1ffe1
```

## 14. Data Persistence Flow

```mermaid
sequenceDiagram
    participant User
    participant View as Layout View
    participant Scope as $scope.savedJson
    participant Controller as Main Controller
    participant Server as Backend API
    
    User->>View: Modifies layout content
    View->>Scope: Update fieldData
    Scope->>Scope: savedJson[pageNo][elementId] updated
    
    User->>Controller: Clicks Save button
    activate Controller
    Controller->>Controller: Serialize savedJson to JSON
    Controller->>Controller: Package all page data
    Controller->>Server: POST /api/save-content
    activate Server
    Server->>Server: Validate JSON structure
    Server->>Server: Store in database
    Server-->>Controller: Success response
    deactivate Server
    Controller->>View: Show save confirmation
    Controller->>Controller: Disable save button
    deactivate Controller
    View-->>User: "Content saved successfully"
    
    Note over Scope,Server: Auto-save every 30 seconds
    Scope->>Controller: Auto-save trigger
    Controller->>Server: POST /api/auto-save
    Server-->>Controller: Success (silent)
```

---

## Legend

### Color Coding

- **Light Blue** (#e1f5ff): User Interface / Interaction Layer
- **Light Orange** (#ffe1e1): Controller / Logic Layer  
- **Light Yellow** (#fff4e1): Service / Utility Layer
- **Light Purple** (#f0e1ff): Data / Configuration Layer
- **Light Green** (#e1ffe1): Presentation / View Layer
- **Light Red** (#ffcccc): Incomplete / Not Implemented Features
- **Red** (#ff6666): Error States / Problems

### Symbols

- **Solid Lines** (→): Active data flow / implemented functionality
- **Dashed Lines** (-.->): Planned but not implemented / optional flow
- **Boxes**: Components, modules, or states
- **Diamonds**: Decision points / conditional logic

---

## Usage Notes

These diagrams use Mermaid syntax and can be rendered in:
- GitHub markdown files
- GitLab
- Visual Studio Code (with Mermaid preview extension)
- Online tools like mermaid.live
- Documentation sites like GitBook, Docusaurus

For best viewing experience, use a Mermaid-enabled markdown viewer.

---

**Diagram Version:** 1.0  
**Companion Document:** LAYOUT_COMPONENT_TECHNICAL_DOCUMENTATION.md  
**Created:** February 17, 2026
