# Sorting Component - Architecture & Data Flow Diagrams

## High-Level Architecture Diagram

```mermaid
graph TB
    subgraph "KITABOO Authoring Platform"
        A[Main Controller<br/>ngcontroller.js]
        B[Component Manager]
        C[Settings Manager]
        D[Undo/Redo Stack]
    end
    
    subgraph "Sorting Component"
        E[sortTemplate Directive<br/>sorting.js]
        F[Editor Template<br/>sorting.html]
        G[Settings Panel<br/>sorting-settings.html]
        H[Preview Script<br/>sorting-preview1.js]
        I[Styles<br/>sorting-template.css]
    end
    
    subgraph "Data Layer"
        J[JSON Configuration<br/>sorting.json]
        K[SortingStatementInfo Array]
        L[Response List]
        M[Style Settings]
    end
    
    subgraph "External Libraries"
        N[AngularJS 1.x]
        O[jQuery]
        P[jQuery UI<br/>Drag/Drop/Resizable]
        Q[easyDropDown]
    end
    
    A --> E
    A --> C
    A --> D
    B --> E
    C --> G
    E --> F
    E --> G
    E --> H
    E --> I
    E --> J
    J --> K
    K --> L
    J --> M
    E --> N
    H --> O
    H --> P
    G --> Q
    
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style E fill:#bbf,stroke:#333,stroke-width:2px
    style J fill:#bfb,stroke:#333,stroke-width:2px
    style H fill:#fbb,stroke:#333,stroke-width:2px
```

## Editor Mode Data Flow

```mermaid
sequenceDiagram
    participant U as User
    participant T as Template HTML
    participant D as sortTemplate Directive
    participant C as Main Controller
    participant J as JSON Data
    participant P as Settings Panel
    
    U->>T: Click "Add Sentence"
    T->>D: addSentenceClick(event)
    D->>J: Push new item to SortingStatementInfo[]
    D->>D: Increment counter
    D->>T: Re-render sentence list
    D->>P: Initialize dropdown settings
    D->>C: enableDisableSaveButton(true)
    
    U->>T: Click sentence
    T->>D: Click event
    D->>C: higlightObj()
    C->>P: displaySettingPanel()
    P->>U: Show settings sidebar
    
    U->>P: Click "Insert Sort Item"
    P->>D: Broadcast insertDragClick
    D->>D: Determine target sentence (rowNo)
    D->>J: Add to responseList[]
    D->>D: Compile Angular template
    D->>T: pasteHtmlAtCaret()
    T->>U: Show new drag item
    D->>C: Push to undo_stack
    
    U->>T: Edit content (contenteditable)
    T->>D: ng-model two-way binding
    D->>J: Update textData.text in real-time
    
    U->>P: Change Text/Image radio
    P->>D: Broadcast radioButtonClick
    D->>D: dragradioChange()
    D->>D: Replace element with new type
    D->>T: Update DOM
    T->>U: Show new item type
```

## Preview/Reader Mode Flow

```mermaid
sequenceDiagram
    participant L as Learner
    participant P as Preview Area
    participant D as Drop Zones
    participant J as jQuery UI
    participant E as Evaluation Logic
    participant F as Feedback
    
    Note over P,D: Component Initialization
    P->>J: Parse SortingStatementInfo
    J->>P: Clone drag items
    J->>P: Randomize order (Fisher-Yates)
    J->>J: Initialize draggable()
    J->>D: Initialize droppable()
    
    Note over L,F: User Interaction
    L->>P: Drag item
    P->>J: dragstart event
    J->>J: Create helper clone
    J->>L: Follow cursor
    
    L->>D: Drop on zone
    D->>J: drop event
    J->>J: Validate not already dropped
    J->>D: Clone item to zone
    J->>P: Mark original as .added
    J->>P: Set opacity 0.5
    J->>J: Disable draggability
    
    alt All zones filled
        J->>D: Enable Submit button
    else Some zones empty
        J->>D: Keep Submit disabled
    end
    
    L->>D: Click Submit
    D->>E: SubmitAnswerSort(event)
    E->>E: Increment attempt counter
    
    loop For each drop zone
        E->>E: Compare data-id (correct vs dropped)
        alt Match
            E->>D: Add .sort-correct class
        else No match
            E->>D: Add .sort-incorrect class
        end
    end
    
    alt All correct
        E->>F: Show success message
        E->>D: Mark correct-question
        E->>D: Disable all buttons
    else Attempts remaining
        E->>F: Show "Please try again"
        E->>D: Remove incorrect items
        E->>P: Re-enable dragging for removed
        E->>D: Enable Try Again button
    else No attempts left
        E->>F: Show "Last attempt" message
        E->>D: Disable Try Again
        E->>D: Keep incorrect visible
    end
```

## Component State Machine

```mermaid
stateDiagram-v2
    [*] --> Initialized: Load Component
    
    Initialized --> Editing: Editor Mode
    Initialized --> Preview: Preview/Reader Mode
    
    Editing --> AddingSentence: Click Add Sentence
    Editing --> RemovingSentence: Click Delete
    Editing --> InsertingDragItem: Click Insert Sort Item
    Editing --> EditingContent: Type/Edit
    Editing --> ChangingSettings: Modify Settings
    
    AddingSentence --> Editing: Sentence Added
    RemovingSentence --> Editing: Sentence Removed
    InsertingDragItem --> Editing: Item Inserted
    EditingContent --> Editing: Content Updated
    ChangingSettings --> Editing: Settings Applied
    
    Editing --> Saved: Save
    Saved --> [*]
    
    Preview --> Ready: Items Randomized
    Ready --> Dragging: Pick Item
    Dragging --> Ready: Drop Invalid
    Dragging --> Dropped: Drop Valid
    Dropped --> Ready: More Items
    Dropped --> ReadyToSubmit: All Filled
    
    ReadyToSubmit --> Evaluating: Click Submit
    
    Evaluating --> Correct: All Correct
    Evaluating --> PartialCorrect: Some Correct, Attempts Left
    Evaluating --> Incorrect: Some Incorrect, No Attempts
    
    Correct --> Complete
    Complete --> [*]
    
    PartialCorrect --> TryingAgain: Click Try Again
    TryingAgain --> Ready: Incorrect Removed
    
    Incorrect --> ShowingAnswer: Click Show Me
    ShowingAnswer --> Complete
    
    ReadyToSubmit --> Resetting: Click Reset
    Resetting --> Ready: Reset Done
    
    PartialCorrect --> Resetting: Click Reset
```

## Evaluation Logic Flow

```mermaid
flowchart TD
    A[User Clicks Submit] --> B{All zones<br/>filled?}
    B -->|No| C[Show error message]
    C --> Z[End]
    
    B -->|Yes| D[Increment attempt counter]
    D --> E[Initialize isAllCorrectIncluded = true]
    
    E --> F{Iterate through<br/>each drop zone}
    F --> G{Compare<br/>data-id}
    
    G -->|Match| H[Apply .sort-correct class]
    H --> F
    
    G -->|No Match| I[Apply .sort-incorrect class]
    I --> J[Set isAllCorrectIncluded = false]
    J --> F
    
    F -->|More zones| G
    F -->|Done| K{isAllCorrectIncluded?}
    
    K -->|Yes| L[Mark correct-question]
    L --> M[Disable all buttons]
    M --> N[Show success]
    N --> Z
    
    K -->|No| O{Attempts < maxTries?}
    
    O -->|Yes| P[Remove incorrect items]
    P --> Q[Re-enable dragging]
    Q --> R[Enable Try Again button]
    R --> S[Show 'Try again' message]
    S --> Z
    
    O -->|No| T[Keep all items]
    T --> U[Disable Try Again]
    U --> V[Show 'Last attempt' message]
    V --> Z
    
    style A fill:#e1f5ff
    style K fill:#fff4e1
    style L fill:#d4edda
    style T fill:#f8d7da
```

## Data Structure Relationships

```mermaid
erDiagram
    SORTING-COMPONENT ||--|| SETTINGS : contains
    SORTING-COMPONENT ||--|| STYLE : has
    SORTING-COMPONENT ||--|{ SORTING-STATEMENT-INFO : contains
    
    SORTING-STATEMENT-INFO ||--|{ RESPONSE-LIST : has
    RESPONSE-LIST ||--|{ CHOICE-LIST : contains
    CHOICE-LIST ||--|| CHOICE-INFO : wraps
    CHOICE-INFO ||--|| CHOICE : contains
    CHOICE ||--o| TEXT-DATA : has-text
    CHOICE ||--o| MEDIA : has-image
    
    SETTINGS ||--|| STYLE-TAB : references
    STYLE-TAB ||--|{ STYLE-HOLDER : contains
    
    SETTINGS {
        string maxTries
        boolean allowRestart
        boolean showmecheckbox
        boolean isHeaderVisible
        boolean isInstructionVisible
        string isText
        string outline
        string Appearance
    }
    
    SORTING-STATEMENT-INFO {
        string id
        string statement
        string selected
        array responseList
    }
    
    RESPONSE-LIST {
        string responseId
        boolean isTextorImage
        array choiceList
    }
    
    CHOICE {
        string identifier
        object textData
        object media
    }
    
    TEXT-DATA {
        string type
        string text
    }
    
    MEDIA {
        string id
        string src
        string altText
        boolean imageVisible
        object imageSetting
    }
```

## User Interaction Flow

```mermaid
journey
    title Learner Experience - Sorting Activity
    section View Activity
      Opens activity: 5: Learner
      Reads instructions: 4: Learner
      Sees randomized items: 5: System
    section Arrange Items
      Selects item: 5: Learner
      Drags to position: 4: Learner
      Drops in zone: 5: Learner, System
      Repeats for all: 3: Learner
    section Submit
      Clicks Submit: 5: Learner
      Waits for evaluation: 3: Learner, System
      Sees feedback: 4: System
    section Review
      Correct answers stay: 5: System
      Incorrect removed (if attempts left): 3: System
      Tries again: 4: Learner
    section Complete
      All correct: 5: Learner, System
      Activity complete: 5: System
```

## Component Lifecycle

```mermaid
timeline
    title Sorting Component Lifecycle
    section Creation
      Load default JSON : Component initialized
      Apply to scope : Data bound
      Compile template : Angular directives processed
    section Initialization
      Execute link function : Event handlers attached
      Load blanks : Drag items rendered
      Apply styles : CSS classes applied
      Setup resizable : jQuery UI resizable initialized
    section Editor Mode
      Author adds sentences : Max 5 sentences
      Author inserts drag items : Max 5 per sentence
      Author configures settings : Attempts, buttons, styles
      Author edits content : Real-time JSON updates
    section Save
      Validate data : Check completeness
      Serialize JSON : Convert to string
      Package assets : Include CSS, JS, images
    section Preview/Reader Mode
      Load JSON : Parse configuration
      Initialize UI : Create drag/drop
      Randomize items : Fisher-Yates shuffle
      Enable interaction : jQuery UI active
    section Learner Interaction
      Drag and drop : User arranges items
      Submit answer : Evaluation triggered
      Receive feedback : Visual and text feedback
      Try again/complete : Based on result
    section Completion
      Record score : Calculate percentage
      Save state : LMS integration
      Mark complete : Activity finished
```

## Settings Panel Interaction

```mermaid
graph LR
    subgraph "Settings Panel"
        A[Attempts Dropdown] --> A1[maxTries]
        B[Allow Restart] --> B1[allowRestart]
        C[Add Show Me] --> C1[showmecheckbox]
        D[Add Header] --> D1[isHeaderVisible]
        E[Add Instruction] --> E1[isInstructionVisible]
        F[Text/Image Radio] --> F1[isText]
        G[Outline Radio] --> G1[outline]
        H[Color Picker] --> H1[Appearance]
        I[Style Thumbnails] --> I1[selected_style]
    end
    
    subgraph "Component JSON"
        A1 --> J[settings.maxTries]
        B1 --> K[settings.allowRestart]
        C1 --> L[settings.showmecheckbox]
        D1 --> M[settings.isHeaderVisible]
        E1 --> N[settings.isInstructionVisible]
        F1 --> O[settings.isText]
        G1 --> P[settings.outline]
        H1 --> Q[settings.Appearance]
        I1 --> R[style.selected_style]
    end
    
    subgraph "Component Rendering"
        J --> S[Submit button attributes]
        K --> T[Dropdown enable/disable]
        L --> U[Show Me button visibility]
        M --> V[Header section display]
        N --> W[Instruction section display]
        O --> X[Drag item template]
        P --> Y[Border styling]
        Q --> Z[Button colors]
        R --> AA[CSS class application]
    end
    
    style A fill:#e3f2fd
    style B fill:#e3f2fd
    style C fill:#e3f2fd
    style D fill:#e3f2fd
    style E fill:#e3f2fd
    style F fill:#fff3e0
    style G fill:#fff3e0
    style H fill:#fff3e0
    style I fill:#fff3e0
```

## Drag and Drop Mechanics

```mermaid
sequenceDiagram
    autonumber
    participant Item as Drag Item
    participant Helper as Helper Clone
    participant Zone as Drop Zone
    participant DOM as DOM
    participant State as Component State
    
    Note over Item,State: User picks item
    Item->>Helper: Create clone
    Helper->>Helper: Set width, cursor position
    
    Note over Item,State: User drags
    Helper->>Helper: Follow cursor
    Zone->>Zone: Add hover class
    
    Note over Item,State: User drops
    alt Valid drop zone
        Helper->>Zone: Validate zone not dropped
        Zone->>DOM: Clone item to zone
        DOM->>Item: Add .added class
        DOM->>Item: Set opacity 0.5
        Item->>Item: Disable dragging
        Zone->>Zone: Add .dropped class
        Zone->>DOM: Adjust dimensions
        State->>State: Check if all filled
        alt All zones filled
            State->>DOM: Enable Submit button
        end
    else Invalid target
        Helper->>Item: Revert to original position
        Helper->>Helper: Destroy clone
    end
```

## Style Variant Application

```mermaid
flowchart LR
    A[User clicks style thumbnail] --> B[Applystylesorting called]
    B --> C{Get template scope}
    C --> D[Remove active-style class]
    D --> E{Is Full Bleed?}
    
    E -->|Yes| F[Add full-bleed class to .sd-item]
    E -->|No| G[Skip]
    
    F --> H[Get current style class]
    G --> H
    
    H --> I[Remove old style class from .component-holder]
    I --> J[Get new style class name]
    J --> K[Add new style class]
    K --> L[Update all styleactive flags to false]
    L --> M[Set selected style's styleactive to true]
    M --> N[Add active-style to thumbnail]
    N --> O[Update JSON: fieldData.style.selected_style]
    O --> P[Trigger CSS class reflow]
    P --> Q[Component re-styled]
    
    style A fill:#e1f5ff
    style Q fill:#d4edda
```

## Error Scenarios

```mermaid
flowchart TD
    A[User Action] --> B{Validation}
    
    B -->|Add Sentence| C{Count < 5?}
    C -->|Yes| D[Add sentence]
    C -->|No| E[Disable button, show message]
    
    B -->|Remove Sentence| F{Count > 1?}
    F -->|Yes| G[Remove sentence]
    F -->|No| H[Disable button]
    
    B -->|Insert Drag Item| I{Count < 5?}
    I -->|Yes| J[Insert item]
    I -->|No| K[Disable button]
    
    B -->|Edit Text| L{Length < 150?}
    L -->|Yes| M[Update content]
    L -->|No| N[Truncate at 150]
    
    B -->|Upload Image| O{Valid format?}
    O -->|Yes| P{File size OK?}
    O -->|No| Q[Show error]
    
    P -->|Yes| R[Upload image]
    P -->|No| S[Show error]
    
    B -->|Submit Answer| T{All zones filled?}
    T -->|Yes| U[Evaluate]
    T -->|No| V[Show 'complete all' message]
    
    style E fill:#f8d7da
    style H fill:#f8d7da
    style K fill:#f8d7da
    style N fill:#fff3cd
    style Q fill:#f8d7da
    style S fill:#f8d7da
    style V fill:#fff3cd
    style D fill:#d4edda
    style G fill:#d4edda
    style J fill:#d4edda
    style M fill:#d4edda
    style R fill:#d4edda
    style U fill:#d4edda
```

---

## Diagram Legend

### Colors
- 🟦 **Blue**: User interface elements
- 🟩 **Green**: Successful operations
- 🟨 **Yellow**: Warning states
- 🟥 **Red**: Error states
- 🟪 **Purple**: Main controller/orchestrator
- 🟧 **Orange**: Settings/configuration

### Symbols
- ◆ **Diamond**: Decision point
- ▭ **Rectangle**: Process/Action
- ⬭ **Parallelogram**: Input/Output
- ⬮ **Cylinder**: Data storage

---

**Document Version**: 1.0  
**Last Updated**: February 17, 2026  
**Companion to**: TECHNICAL_DOCUMENTATION.md
