# Carousel (Slideshow) Component - Technical Documentation

**Component Name:** Carousel / Slideshow  
**Component Identifier:** `slideshow`  
**Component Type:** Interactive Presentation Template  
**Version:** 1.0  
**Last Updated:** February 16, 2026

---

## Table of Contents
1. [Component Overview](#1-component-overview)
2. [Architecture & File Structure](#2-architecture--file-structure)
3. [Data Model & Schema](#3-data-model--schema)
4. [Component Variants & Styles](#4-component-variants--styles)
5. [Features & Functionality](#5-features--functionality)
6. [Data Flow & Component Lifecycle](#6-data-flow--component-lifecycle)
7. [Editor Mode Behavior](#7-editor-mode-behavior)
8. [Preview Mode Behavior](#8-preview-mode-behavior)
9. [Reader/Player Mode Behavior](#9-readerplayer-mode-behavior)
10. [Layout Types](#10-layout-types)
11. [Settings & Configurations](#11-settings--configurations)
12. [Error Handling & Known Issues](#12-error-handling--known-issues)
13. [Recommendations for Improvement](#13-recommendations-for-improvement)
14. [Architectural Diagrams](#14-architectural-diagrams)

---

## 1. Component Overview

### Purpose
The Carousel/Slideshow component enables authors to create interactive multi-slide presentations with images, videos, or text content. Each slide can contain a combination of media elements with titles, captions, and descriptive text.

### Key Characteristics
- **Multi-Media Support:** Images, videos (uploaded or YouTube), and text-only slides
- **Slide Management:** Add/delete slides (2-12 slides per component)
- **Layout Flexibility:** Vertical (stacked) or horizontal (side-by-side) layouts
- **Visual Styles:** Three distinct style variants
- **Auto-Play:** Optional automatic slide progression with configurable duration
- **Responsive:** Adapts to different screen sizes and orientations

### Use Cases
- Educational presentations and step-by-step tutorials
- Image galleries with descriptions
- Video playlists with commentary
- Sequential content delivery
- Before/after comparisons

---

## 2. Architecture & File Structure

### Core Files

```
templates/slideshow/
├── slideshow.html                          # Main template markup
├── common-template-settings-panel.html     # Settings panel UI
├── default/
│   └── slideshow.json                      # Default data schema
├── scripts/
│   └── slideshow-directive.js              # AngularJS directive & controller
└── styles/
    └── slideshow-template.css              # Component styles
```

### External Dependencies

**JavaScript Libraries:**
- AngularJS (directive framework)
- jQuery (DOM manipulation)
- bxSlider (slider functionality)
- Video.js (video playback)

**Related Files:**
- `editor/ngcontroller.js` - Main editor controller logic
- `js/player-container.js` - Reader mode initialization
- CSS files for base styles and fonts

### Component Registration
```javascript
// Defined in slideshow-directive.js
App.directive('slideShowTemplate', ['modalService', '$timeout', function(...) {
    // Directive logic
}]);
```

---

## 3. Data Model & Schema

### Data Structure (slideshow.json)

```json
{
  "identifier": "slideshow",
  "introductionText": "",
  "instructionText": "",
  "slides": [
    {
      "media": {
        "src": "images/image.jpg",
        "imageVisible": true,
        "caption": "",
        "imageSetting": {
          "imageUploadOrReplace": "Upload",
          "imageUrl": "images/image.jpg",
          "imageName": "image.jpg",
          "imageDimension": "",
          "metaTags": []
        },
        "videoSetting": {
          "videoUploadOrReplace": "Upload Video",
          "youtubeVideoName": "",
          "videoAlign": "vid-center",
          "metaTags": []
        },
        "uploadtype": "uploadbysystem",
        "youtubeId": "",
        "youtube": false,
        "poster": "",
        "videoUploaded": false
      },
      "mediaToUpload": "image",
      "slideTitle": "",
      "text": "The paragraph contains placeholder text..."
    }
  ],
  "settings": {
    "isHeaderVisible": true,
    "isInstructionVisible": true,
    "isSlideTitleVisible": true,
    "captiondisplay": true,
    "isPragraphHidden": false,
    "verticalSlide": "vertical-slideshow",
    "textPlacement": "bottom",
    "slideShowStyleType": "style-1",
    "autoSlide": false,
    "pauseDuration": 3,
    "slideValue": false,
    "slider": "with-dot",
    "outline": "outline",
    "Appearance": "#2175d1",
    "activeSlide": 1,
    "editTemplateIcon": "icon-Slideshow",
    "editTemplateName": "Slideshow",
    "showAudioBar": false,
    "transcriptText": "",
    "metaTags": [],
    "style_tab": [...]
  }
}
```

### Field Descriptions

#### Slide Object
| Field | Type | Description |
|-------|------|-------------|
| `mediaToUpload` | String | Media type: "image", "video", or "text" |
| `slideTitle` | String | Title displayed on the slide |
| `text` | String | Descriptive text content |
| `media.src` | String | Path to media resource |
| `media.imageVisible` | Boolean | Controls image visibility |
| `media.caption` | String | Caption text for media |
| `media.uploadtype` | String | "uploadbysystem" or "uploadbyurl" |
| `media.youtubeId` | String | YouTube video ID |
| `media.youtubeVideoName` | String | Name of YouTube video |

#### Settings Object
| Field | Type | Description |
|-------|------|-------------|
| `isHeaderVisible` | Boolean | Show/hide header text |
| `isInstructionVisible` | Boolean | Show/hide instruction text |
| `isSlideTitleVisible` | Boolean | Show/hide slide titles |
| `captiondisplay` | Boolean | Show/hide media captions |
| `isPragraphHidden` | Boolean | Show/hide slide text paragraphs |
| `verticalSlide` | String | Layout: "vertical-slideshow" or "horizontal-slideshow" |
| `textPlacement` | String | "top" or "bottom" (text position relative to media) |
| `slideShowStyleType` | String | "style-1", "style-2", or "style-3" |
| `autoSlide` | Boolean | Enable automatic slide progression |
| `pauseDuration` | Number | Seconds between slides (0-999) |
| `outline` | String | "outline" (no border) or "outlineBg" (with border) |
| `Appearance` | String | Hex color for action assets (#RRGGBB) |
| `activeSlide` | Number | Currently active slide index (1-based) |

---

## 4. Component Variants & Styles

The Slideshow component offers **three distinct visual styles**, each with unique navigation and presentation characteristics.

### Style 1 - Classic Navigation
**CSS Class:** `style-1`

**Characteristics:**
- Navigation arrows below the slide content
- Centered arrow placement
- Text-based pagination (e.g., "1 / 5")
- White/transparent background for controls
- Arrow icons: `icon-Back-01`, `icon-Next-01`
- Best for: Standard presentations with minimal distraction

**Visual Layout:**
```
┌─────────────────────────┐
│   [Slide Content]       │
│                         │
└─────────────────────────┘
       ← 1 / 5 →
```

**Color Application:**
- Arrows: Use `Appearance` color
- Pager background: Transparent/white
- Pager text: Black

---

### Style 2 - Colored Pager
**CSS Class:** `style-2`

**Characteristics:**
- Highlighted pagination bar with background color
- Navigation arrows below content
- Pager uses the "Action Assets" color as background
- White text on colored background
- Arrow icons: `icon-Back-01`, `icon-Next-01`
- Best for: Brand-aligned presentations with emphasis on navigation

**Visual Layout:**
```
┌─────────────────────────┐
│   [Slide Content]       │
│                         │
└─────────────────────────┘
   ← ┃ 1 / 5 ┃ →
     [Colored Bar]
```

**Color Application:**
- Arrows: White
- Pager background: Uses `Appearance` color
- Pager text: White

---

### Style 3 - Status Bar Navigation
**CSS Class:** `style-3`

**Characteristics:**
- Dedicated navigation status bar
- Full-width colored footer (light blue: #F2F5FF)
- Boxed navigation arrows with borders
- Centered pagination with "OF" text
- Arrow icons: `icon-back-arrow`, `icon-Next-arrow1`
- Best for: Professional layouts with clear separation

**Visual Layout:**
```
┌─────────────────────────┐
│   [Slide Content]       │
│                         │
└─────────────────────────┘
┌─────────────────────────┐
│  [←]   1 OF 5    [→]   │
└─────────────────────────┘
```

**Color Application:**
- Status bar background: `rgba(242, 245, 255, 1)`
- Arrows: Use `Appearance` color with 25% opacity border
- Arrows have 8px border radius
- Pager text: Black

---

### Style Selection Behavior

**In Editor Mode:**
- Style thumbnails displayed in settings panel
- Clicking a style applies it immediately
- Active style has visual indicator
- Style change triggers slider reinitialization

**Style-Specific CSS Classes:**
```css
.slideshow.style-1 { /* Style 1 specific */ }
.slideshow.style-2 { /* Style 2 specific */ }
.slideshow.style-3 { /* Style 3 specific */ }
```

---

## 5. Features & Functionality

### 5.1 Slide Management

#### Adding Slides
- **Limit:** Minimum 2, Maximum 12 slides
- **Button:** "Add Slide" button at bottom of component
- **New Slide Data:** Contains default placeholder image and text
- **Behavior:** 
  - New slide added at the end
  - Automatically navigates to new slide
  - Settings panel updates to show new slide properties
  - Button disabled when limit reached

**Implementation:**
```javascript
$scope.addSlideClick = function() {
    if ($scope.fieldData.slides.length < max_slides) {
        $scope.fieldData.slides.push({
            media: { /* default media structure */ },
            mediaToUpload: "image",
            slideTitle: "",
            text: "Default placeholder text..."
        });
        // Navigate to new slide, update UI
    }
};
```

#### Deleting Slides
- **Limit:** Cannot delete if only 2 slides remain
- **Confirmation:** Modal dialog confirms deletion
- **Behavior:**
  - Removes current slide from array
  - Updates pagination
  - Reloads slider
  - Button disabled when at minimum

**Implementation:**
```javascript
$scope.deleteSlideClick = function() {
    if (parentScope.fieldData.slides.length > min_slides) {
        // Show confirmation modal
        modalService.showModal({
            templateUrl: 'templates/alert-modal.html',
            bodyText: 'Are you sure you want to delete the slide?'
        });
    }
};
```

### 5.2 Media Support

#### Image Upload
- **Formats:** JPG, PNG, GIF, SVG
- **Upload Methods:** System file picker
- **Features:**
  - Dimension display
  - File name display
  - Preview in settings panel
  - Replace functionality
  - Cropping support

#### Video Support
- **Upload Types:**
  - **System Upload:** MP4, WebM files
  - **YouTube URL:** Enter video ID
- **Features:**
  - Video.js player integration
  - Poster image support
  - Playback controls
  - Fullscreen support
  - Auto-pause on slide change

**Video ID Entry:**
```javascript
$scope.slideVideoIDclick = function() {
    // Validates and processes YouTube video ID
    // Updates media object with video details
};
```

#### Text-Only Slides
- **Feature:** Slides can contain only text without media
- **Behavior:** 
  - Media container hidden
  - Text expands to full width
  - Minimum height increased (300-500px)

### 5.3 Auto-Play Feature

**Configuration:**
- Enable/disable checkbox in settings
- Duration: 1-999 seconds
- Default: 3 seconds

**Behavior:**
- Automatically advances slides
- Pauses on user interaction
- Resumes after interaction ends
- Videos pause when slide changes
- YouTube videos receive pause command

**Implementation:**
```javascript
data-options-autoSlide="{{fieldData.settings.autoSlide}}"
data-options-pauseDuration="{{fieldData.settings.pauseDuration}}"
```

### 5.4 Navigation

#### Manual Navigation
- **Previous/Next Arrows:** Always visible unless disabled
- **Disabled State:** First slide (prev) and last slide (next)
- **Keyboard:** Not implemented (potential enhancement)

#### Pagination
- **Format:** "1 / 5" (current / total)
- **Style 3 Format:** "1 OF 5"
- **Location:** Between navigation arrows
- **Updates:** Real-time on slide change

### 5.5 Responsive Behavior

**Desktop (>1200px):**
- Full-width layout
- Arrows positioned at 35% from edges
- Maximum image height: 500px

**Tablet (766-1200px):**
- Adjusted padding
- Arrow repositioning
- Optimized media heights

**Mobile (<766px):**
- Stacked layouts
- Arrows at screen edges (10px)
- Reduced media heights
- Smaller control buttons
- Horizontal layouts become vertical

**Responsive CSS:**
```css
@media (min-width: 200px) and (max-width: 500px) {
    .slideshow.horizontal-slide .previewSlider .slideVideoContainer {
        min-height: 90px;
    }
    .horizontal-slide .media-text,
    .horizontal-slide .slideshow-media-container {
        width: 100%;
    }
}
```

---

## 6. Data Flow & Component Lifecycle

### 6.1 Component Initialization

```
┌─────────────────────────────────────────────────────────────┐
│                    Component Lifecycle                       │
└─────────────────────────────────────────────────────────────┘

1. Template Load
   ├── HTML template inserted into DOM
   ├── Directive link function executes
   └── AngularJS compile phase

2. Data Binding
   ├── Load default JSON or saved data
   ├── Bind fieldData to scope
   └── Populate slides array

3. Slider Initialization
   ├── Assign unique IDs to slider elements
   ├── Initialize bxSlider plugin
   ├── Configure callbacks (onSlideLoad, onSlideAfter, etc.)
   └── Set initial slide (first or last if newly added)

4. Settings Panel
   ├── Load current settings
   ├── Initialize iCheck checkboxes
   ├── Bind color picker
   └── Set active style thumbnail

5. Event Listeners
   ├── Window resize handler
   ├── PostMessage listener (video fullscreen)
   ├── Media upload handlers
   └── Settings change handlers

6. Render Complete
   ├── Calculate slide heights
   ├── Apply styles
   └── Enable interactions
```

### 6.2 Slide Navigation Flow

```
User clicks Next Arrow
    ↓
onSlideNext() callback
    ↓
├── Pause all videos
├── Send YouTube pause command
├── Remove 'active-slide' class from current
├── Add 'active-slide' to next slide
├── Update pagination counter
├── Recalculate slide heights
└── Update settings panel (if in editor mode)
```

### 6.3 Media Upload Flow

```
User selects file(s)
    ↓
uploadfiles directive triggered
    ↓
File validation
    ↓
Upload to server
    ↓
Server returns URL
    ↓
Update fieldData.slides[index].media.src
    ↓
Reload slider
    ↓
Update preview
```

**Multi-Upload Handling:**
```javascript
$scope.uploadMultipleSlideshow = function(file) {
    // Handles batch uploads
    // Creates new slides if needed
    // Respects 12-slide limit
};
```

---

## 7. Editor Mode Behavior

### 7.1 Visual Indicators

**Active Slide:**
- Class: `.active-slide`
- Visual highlight/border
- Settings panel reflects active slide

**Editable Content:**
- Contenteditable fields for:
  - Header text
  - Instruction text
  - Slide titles
  - Descriptions
  - Captions

**Drag & Drop:**
- Component can be dragged/positioned
- Add/Delete buttons visible
- Hover states active

### 7.2 Settings Panel Integration

**Panel Structure:**
```html
<div id="Slideshow-settings-panel">
    ├── Settings Heading (Icon + Name)
    ├── Style Tab (3 style thumbnails)
    ├── Settings Tab
    │   ├── Auto Play toggle
    │   ├── Visibility toggles (Header, Instruction, Title, Paragraph)
    │   ├── Layout selection (Vertical/Horizontal)
    │   ├── Text placement icons
    │   ├── Slide Properties (per-slide settings)
    │   │   ├── Media type selector (Image/Video/Text)
    │   │   ├── Upload interface
    │   │   └── Caption toggle
    │   ├── Outline options
    │   └── Action Assets color picker
    └── Meta Tags / Transcript (if enabled)
```

**Panel Behavior:**
- Opens on component click
- Persists settings in real-time
- Updates preview immediately
- Switches between Style/Settings tabs
- Shows current slide index

### 7.3 Content Editing

**Header & Instruction:**
```html
<div contenteditable="true" 
     ng-model="fieldData.introductionText"
     class="sc-intro template-header">
</div>
```

**Math Support:**
- Math fields marked with `.math-read-only-field`
- Integration with math editor
- LaTeX rendering

**Save Triggers:**
- Content blur events
- Settings changes
- Media uploads
- Add/delete operations

### 7.4 Real-Time Updates

**Settings Changes:**
```javascript
$scope.onHeaderVisibilityChanged = function(state) {
    $('[slide-show-template]').scope().fieldData.settings.isHeaderVisible = state;
    enableDisableSaveButton(true);
    $scope.headervisible(id);
};
```

**Style Changes:**
```javascript
window.applystyleslideshow = function(event, optionname, styleTypeclass, index, ...) {
    // Update style class
    // Reapply colors
    // Adjust navigation layout
    // Mark style as active
};
```

---

## 8. Preview Mode Behavior

### 8.1 Preview Generation

**Function:** `createPreviewForSlideshow(data)`

**Transformations:**
1. Remove editor-specific elements:
   - Add Slide button
   - Delete Slide button
   - Border styles meant for editing
   
2. Clean markup:
   - Remove bxSlider wrapper (already rendered)
   - Remove `slide-show-template` attribute
   - Hide empty header/instruction fields
   
3. Restructure for playback:
   - Move rendered slides to `.slider` parent
   - Remove `.bx-wrapper` (bxSlider container)
   - Clean control elements

**Code:**
```javascript
$scope.createPreviewForSlideshow = function (data) {
    $(data).find('.slider-parent').removeClass('no-border');
    $(data).find('.slideshow').each(function (index, value) {
        $(value).find('.slider').prepend($(value).find(".bx-viewport").html());
        $(value).find('.slider .bx-wrapper').remove();
        
        if ($(value).find(".sc-intro").html() == "") {
            $(value).find(".introduction-text").css('display', 'none');
        }
        if ($(value).find(".sc-instr").html() == "") {
            $(value).find(".sc-instr-holder").css('display', 'none');
        }
        $(value).find('.bx-controls').remove();
    });
    
    $(data).find('.slideshow .add-slide').remove();
    $(data).find('.slideshow .char_text').remove();
    return data;
};
```

### 8.2 Preview Slider Initialization

**In:** `player-container.js`

```javascript
$('[data-type="slideshow"] .slider').each(function (index, value) {
    var targetSlider = "#" + $(this).find('.bxslider').attr('id');
    var targetPager = "#" + $(this).parent().find('.bx-pager-custom').attr('id');
    
    initSliders(
        targetSlider, 
        targetPager, 
        index, 
        $(this).attr('data-options-autoslide'), 
        $(this).attr('data-options-pauseduration')
    );
});
```

**Fresh Initialization:**
- New bxSlider instance
- Auto-play configured from settings
- Custom pager linked
- Navigation callbacks attached

### 8.3 Preview Interactions

**User Actions:**
- Click arrows to navigate
- Auto-play runs if enabled
- Videos play on demand
- Click outside to close preview

**Restrictions:**
- No editing allowed
- Add/Delete hidden
- Settings panel not accessible
- Content appears finalized

---

## 9. Reader/Player Mode Behavior

### 9.1 Reader Initialization

**Context:** Published/packaged content viewed in KITABOO Reader

**Initialization Flow:**
```
Document Load
    ↓
Find all [data-type="slideshow"]
    ↓
For each slideshow component:
    ├── Identify slider by unique ID
    ├── Link custom pager
    ├── Read auto-slide settings
    ├── Initialize bxSlider with reader config
    └── Attach event handlers
```

**Reader Configuration:**
```javascript
{
    infiniteLoop: false,
    hideControlOnEnd: true,
    useCSS: false,
    easing: 'linear',
    speed: 500,
    pagerType: 'short',
    pager: true,
    touchEnabled: true,      // Enabled in reader
    adaptiveHeight: true,
    auto: autoSlideEnabled,
    pause: pauseDuration * 1000
}
```

### 9.2 Offline/Package Support

**Required Assets:**
- All media files copied to package
- Relative paths maintained
- CSS/JS bundles included
- Fonts embedded

**Video Considerations:**
- Uploaded videos: Packaged locally
- YouTube videos: Require internet connection
- Fallback poster images for offline

**Localization:**
- Text content localized
- "OF" text in Style 3 is localizable
- Accessible via `data-localize` attributes

### 9.3 Touch & Interaction Support

**Desktop:**
- Mouse click navigation
- Hover states on arrows

**Touch Devices:**
- Swipe gestures enabled
- Touch-friendly controls
- No hover states (use active states)

**Accessibility:**
- Keyboard navigation: **Not fully implemented**
- ARIA attributes: **Limited**
- Screen reader support: **Partial**

---

## 10. Layout Types

### 10.1 Vertical Layout
**Setting:** `verticalSlide: "vertical-slideshow"`

**Characteristics:**
- Media and text stacked vertically
- Text can be above or below media
- Full-width content areas
- Better for longer descriptions

**CSS:**
```css
.slideshow.vertical-slide .slide_img_editor {
    display: flex !important;
    flex-direction: column;
}

.slideshow .slideshow-media-container {
    width: 100%;
}

.slideshow .media-text {
    width: 100%;
}
```

**Text Placement Options:**
```
┌─────────────────────────┐
│   Text Content (top)    │  ← textPlacement: "top"
├─────────────────────────┤
│   [Media]               │
└─────────────────────────┘

┌─────────────────────────┐
│   [Media]               │
├─────────────────────────┤
│   Text Content (bottom) │  ← textPlacement: "bottom"
└─────────────────────────┘
```

### 10.2 Horizontal Layout
**Setting:** `verticalSlide: "horizontal-slideshow"`

**Characteristics:**
- Media and text side-by-side
- 50/50 split by default
- Text left/media right or vice versa
- Better for comparisons

**CSS:**
```css
.slideshow.horizontal-slide .slide_img_editor {
    display: block !important;
}

.horizontal-slide .slideshow-media-container {
    float: left;
    width: 50%;
    padding: 10px 5px;
}

.slideshow.horizontal-slide .media-text {
    float: left;
    width: 50%;
    padding: 5px 5px 10px 2px;
}
```

**Text Placement Options:**
```
┌──────────┬──────────┐
│  Text    │  [Media] │  ← textPlacement: "bottom" (left)
│          │          │
└──────────┴──────────┘

┌──────────┬──────────┐
│  [Media] │   Text   │  ← textPlacement: "top" (right)
│          │          │
└──────────┴──────────┘
```

**Responsive Behavior:**
- Converts to vertical on mobile (<500px)
- Maintains horizontal on tablets (>766px)

### 10.3 Text-Only Layout

**Trigger:** `mediaToUpload === "text"`

**Behavior:**
- Media container hidden: `ng-hide="option.mediaToUpload=='text'"`
- Text expands to 100% width
- Increased height constraints (300-500px)
- Scrollable content area

**CSS:**
```css
.slideshow .onlyText .slide_img_editor {
    display: block;
}

.slideshow.horizontal-slide .slideshowPara,
.slideshow .onlyText .slideshowPara {
    min-height: 300px !important;
    max-height: 500px !important;
}
```

---

## 11. Settings & Configurations

### 11.1 Global Settings

#### Visibility Controls
| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `isHeaderVisible` | Boolean | true | Show/hide header text field |
| `isInstructionVisible` | Boolean | true | Show/hide instruction text |
| `isSlideTitleVisible` | Boolean | true | Show per-slide title |
| `isPragraphHidden` | Boolean | false | Show paragraph text (inverted logic) |
| `captiondisplay` | Boolean | true | Show media captions |

#### Layout Settings
| Setting | Type | Options | Description |
|---------|------|---------|-------------|
| `verticalSlide` | String | "vertical-slideshow", "horizontal-slideshow" | Stacked vs. side-by-side |
| `textPlacement` | String | "top", "bottom" | Text position relative to media |

#### Style Settings
| Setting | Type | Options | Description |
|---------|------|---------|-------------|
| `slideShowStyleType` | String | "style-1", "style-2", "style-3" | Visual style variant |
| `outline` | String | "outline", "outlineBg" | Border presence |
| `Appearance` | String | Hex color | Color for action assets (arrows, pager) |

#### Auto-Play Settings
| Setting | Type | Range | Description |
|---------|------|-------|-------------|
| `autoSlide` | Boolean | - | Enable automatic progression |
| `pauseDuration` | Number | 0-999 | Seconds between slides |

### 11.2 Per-Slide Settings

**Access:** Settings panel → "Slide X Properties"

#### Media Type Selection
- Radio buttons: Image / Video / Text
- Switches slide content type
- Hides/shows relevant upload UI

#### Image Settings
```javascript
imageSetting: {
    imageUploadOrReplace: "Upload" | "Replace",
    imageUrl: "path/to/image.jpg",
    imageName: "filename.jpg",
    imageDimension: "1920x1080",
    metaTags: []
}
```

#### Video Settings
```javascript
videoSetting: {
    videoUploadOrReplace: "Upload Video" | "Replace",
    youtubeVideoName: "Video Title",
    videoAlign: "vid-center",
    filename: "video.mp4",
    size: "15.2",
    duration: "2:34",
    metaTags: []
}
```

#### Content Settings
- `slideTitle`: Per-slide title (string)
- `text`: Descriptive paragraph (HTML string)
- `media.caption`: Media caption (string)

### 11.3 Advanced Settings

#### Meta Tags
- Author-defined keywords
- SEO optimization
- Searchability within KITABOO ecosystem

#### Transcript
- Accessibility feature
- Audio description text
- Enabled via `showAudioBar` setting

#### Asset Color Picker
- Hex input field
- Color swatch preview
- Real-time color application
- Dropdown color palette

---

## 12. Error Handling & Known Issues

### 12.1 Error Handling

#### File Upload Errors
**Current Behavior:**
- Silent failures in some cases
- Limited user feedback
- No upload progress indicator

**Handled Scenarios:**
- File size validation (implicit via server)
- File type checking (limited)
- Network failures (retry not implemented)

#### Video Playback Errors
**Current Behavior:**
- Video.js built-in error handling
- YouTube API errors shown to user
- Fallback to poster image

**Edge Cases:**
- Invalid YouTube IDs: Shows broken iframe
- Offline video access: May fail silently
- Codec incompatibility: Depends on browser

#### Slider Initialization Failures
**Current Behavior:**
- Try-catch not extensively used
- Race conditions possible
- Multiple initializations may conflict

**Prevention:**
- Check `if ($scope.bxSlider)` before operations
- `reloadSlider()` method for resets
- Unique IDs for each slider instance

### 12.2 Known Issues

#### Issue 1: Height Calculation Inconsistencies
**Symptoms:**
- Slides have inconsistent heights
- Content overflow or clipping
- Jarring transitions between slides

**Cause:**
- Asynchronous image loading
- Dynamic content not measured
- bxSlider `adaptiveHeight` limitations

**Workaround:**
```javascript
$scope.resizeSlideHeight = function() {
    $("[data-type='slideshow'] .slideMediaContainer").each(function(){
        var maxHeight = $(this).height();
        $(this).find(".image-style, .video-js .vjs-tech").each(function(){
            $(this).css("max-height", maxHeight);
        });
    });
};
```

**Status:** Partial mitigation implemented

---

#### Issue 2: Multiple Upload Timing
**Symptoms:**
- Uploading multiple images creates unexpected slides
- Race conditions in slide assignment
- Index mismatches

**Cause:**
```javascript
$scope.mediaSrcSlideshow = new Array(files.length);
// Asynchronous uploads populate array
// uploadMultipleSlideshow() called when all complete
```

**Impact:** Medium priority

**Workaround:** Upload files one at a time

---

#### Issue 3: Style Change Doesn't Persist on First Click
**Symptoms:**
- Clicking style thumbnail doesn't change immediately
- Requires second click

**Cause:**
- Event delegation issues
- AngularJS digest cycle timing
- `$scope.$apply()` not called consistently

**Impact:** Low priority (cosmetic)

---

#### Issue 4: YouTube Video Auto-Pause
**Symptoms:**
- YouTube videos don't always pause on slide change
- PostMessage not received

**Cause:**
```javascript
iframe.contentWindow.postMessage(
    JSON.stringify({ event: "command", func: "pauseVideo", args: "" }),
    targetOrigin
);
```
- Cross-origin restrictions
- YouTube iframe API not always loaded

**Workaround:** Check iframe readiness before posting

**Status:** Partially handled

---

#### Issue 5: Text Placement Icons Unclear
**Symptoms:**
- Users confused by icon meanings
- Vertical vs. horizontal icons look similar

**Icons:**
- Vertical: `icon-slideshow_img-top-text-bottom`, `icon-slideshow_text-top-image-bottom`
- Horizontal: `icon-slideshow_text-left-img-right`, `icon-slideshow_img-left-text-right`

**Suggestion:** Add tooltips or labels

---

#### Issue 6: Accessibility Gaps
**Symptoms:**
- Keyboard navigation not implemented
- Screen reader support incomplete
- Focus management poor

**Missing Features:**
- Arrow key navigation
- ARIA labels on controls
- Focus trap in modal
- Alt text enforcement

**Impact:** High priority for WCAG compliance

---

#### Issue 7: Mobile Horizontal Layout Issues
**Symptoms:**
- Horizontal layout cramped on mobile
- Text barely readable
- Media too small

**Current Workaround:**
```css
@media (min-width: 200px) and (max-width: 500px) {
    .horizontal-slide .media-text,
    .horizontal-slide .slideshow-media-container {
        width: 100%;  /* Forces vertical */
    }
}
```

**Status:** Addressed for most devices

---

#### Issue 8: Offline Video Placeholder
**Symptoms:**
- When offline, videos don't show helpful placeholder
- User doesn't know content is video

**Suggestion:** Show poster with "Video unavailable offline" message

---

#### Issue 9: Delete Slide Confirmation Always in English
**Symptoms:**
- Modal text not localized
- Hard-coded English string

**Code:**
```javascript
bodyText: 'Are you sure you want to delete the slide?'
```

**Fix:** Use localization key

---

#### Issue 10: Color Picker Accessibility
**Symptoms:**
- Color contrast not validated
- No WCAG AA/AAA checking
- Poor visibility possible

**Recommendation:** Add contrast checker

---

### 12.3 Browser Compatibility Issues

| Browser | Version | Status | Issues |
|---------|---------|--------|--------|
| Chrome | 90+ | ✅ Full | None |
| Firefox | 88+ | ✅ Full | None |
| Safari | 14+ | ⚠️ Partial | PostMessage timing |
| Edge | 90+ | ✅ Full | None |
| IE 11 | 11 | ❌ Limited | bxSlider issues, no flex |

---

## 13. Recommendations for Improvement

### 13.1 High Priority Improvements

#### 1. Accessibility Enhancements
**Recommendation:**
- Add keyboard navigation (Arrow keys, Tab, Enter, Space)
- Implement ARIA roles and labels
- Add skip links
- Ensure focus management
- Screen reader announcements

**Implementation:**
```javascript
// Keyboard handler
$(document).on('keydown', function(e) {
    if ($('.slideshow:focus').length) {
        if (e.key === 'ArrowRight') scope.bxSlider.goToNextSlide();
        if (e.key === 'ArrowLeft') scope.bxSlider.goToPrevSlide();
    }
});
```

**ARIA Attributes:**
```html
<div class="slideshow" role="region" aria-label="Carousel">
    <div class="bx-controls-direction">
        <button class="bx-prev" aria-label="Previous slide">←</button>
        <button class="bx-next" aria-label="Next slide">→</button>
    </div>
    <div aria-live="polite" aria-atomic="true">
        Slide {{currentSlide}} of {{totalSlides}}
    </div>
</div>
```

---

#### 2. Upload Experience
**Recommendation:**
- Show progress bars for uploads
- Display upload status (queued, uploading, complete)
- Allow drag-and-drop directly to canvas
- Batch upload with preview
- Error messages for failures

**UI Mockup:**
```
┌──────────────────────────────┐
│ Uploading image.jpg          │
│ ████████████░░░░░░░░ 60%     │
└──────────────────────────────┘
```

---

#### 3. Performance Optimization
**Recommendation:**
- Lazy load images (only visible slides)
- Preload next/previous slides only
- Optimize image sizes
- Implement virtual scrolling for 12+ slides
- Debounce resize handlers

**Lazy Loading:**
```javascript
onSlideAfter: function(currentSlide, totalSlides, currentSlideHtmlObject) {
    // Preload next and previous
    var nextSlide = (currentSlide + 1) % totalSlides;
    var prevSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    
    loadSlideMedia(nextSlide);
    loadSlideMedia(prevSlide);
}
```

---

#### 4. Error Handling & Validation
**Recommendation:**
- Try-catch blocks around critical operations
- User-friendly error messages
- Validation before save
- Graceful degradation for missing media

**Validation Example:**
```javascript
function validateSlideshow() {
    var errors = [];
    
    if (scope.fieldData.slides.length < 2) {
        errors.push("Slideshow must have at least 2 slides");
    }
    
    scope.fieldData.slides.forEach((slide, index) => {
        if (slide.mediaToUpload !== 'text' && !slide.media.src) {
            errors.push(`Slide ${index + 1}: Media is required`);
        }
        if (!slide.text.trim() && slide.mediaToUpload !== 'text') {
            errors.push(`Slide ${index + 1}: Description is recommended`);
        }
    });
    
    return errors;
}
```

---

#### 5. Localization
**Recommendation:**
- Externalize all strings
- Support RTL languages
- Use `data-localize` attributes consistently
- Translate modal messages

**Implementation:**
```javascript
// Instead of:
bodyText: 'Are you sure you want to delete the slide?'

// Use:
bodyText: localeJson['slideshow.delete.confirmation']
```

---

### 13.2 Medium Priority Improvements

#### 6. Enhanced Style Customization
**Features:**
- Custom CSS injection per slideshow
- More style presets (4-10 styles)
- Theme editor UI
- Save custom themes

#### 7. Animation Options
**Features:**
- Transition types (slide, fade, zoom, flip)
- Transition speed control
- Easing function selection
- Ken Burns effect for images

#### 8. Advanced Layout Options
**Features:**
- 3-column text-media-text layout
- Picture-in-picture video
- Lightbox image view
- Thumbnail navigation strip

#### 9. Analytics Integration
**Features:**
- Track slide views
- Time spent per slide
- Completion rate
- Heat map of interactions

#### 10. Content Reordering
**Features:**
- Drag to reorder slides
- Duplicate slide button
- Copy slide to another slideshow
- Import slides from library

---

### 13.3 Low Priority / Nice-to-Have

#### 11. Advanced Video Features
- In-slide video trimming
- Multiple video sources (HLS, DASH)
- Video chapters matching slides
- Annotations on video

#### 12. Template Library
- Pre-made slideshow templates
- Industry-specific themes
- Import/export templates
- Community sharing

#### 13. Collaboration Features
- Comments on slides
- Version history
- Review/approval workflow
- Real-time co-editing

#### 14. AI-Powered Features
- Auto-generate slide titles
- Image suggestions
- Alt text generation
- Content summarization

#### 15. Export Options
- Export as PDF
- Export as video
- Export to PowerPoint
- Standalone HTML package

---

## 14. Architectural Diagrams

### 14.1 Component Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    SLIDESHOW COMPONENT ARCHITECTURE              │
└─────────────────────────────────────────────────────────────────┘

                           ┌──────────────┐
                           │   Template   │
                           │ slideshow.   │
                           │    html      │
                           └──────┬───────┘
                                  │
                                  ▼
                    ┌─────────────────────────┐
                    │   AngularJS Directive   │
                    │  slideShowTemplate      │
                    └───────────┬─────────────┘
                                │
                ┌───────────────┼───────────────┐
                │               │               │
                ▼               ▼               ▼
        ┌──────────────┐ ┌──────────┐ ┌──────────────┐
        │  Controller  │ │   Link   │ │   Scope      │
        │  Functions   │ │ Function │ │   Data       │
        └──────┬───────┘ └────┬─────┘ └──────┬───────┘
               │              │               │
               │              │               │
               ▼              ▼               ▼
        ┌──────────────────────────────────────────┐
        │           External Dependencies          │
        ├──────────────────────────────────────────┤
        │  • bxSlider (slider functionality)       │
        │  • jQuery (DOM manipulation)             │
        │  • Video.js (video playback)             │
        │  • modalService (confirmations)          │
        │  • $timeout (async operations)           │
        └──────────────────────────────────────────┘

                           │
                           ▼
        ┌─────────────────────────────────────────────┐
        │              Settings Panel                  │
        │  common-template-settings-panel.html        │
        └──────────────────┬──────────────────────────┘
                           │
                ┌──────────┴──────────┐
                │                     │
                ▼                     ▼
        ┌──────────────┐      ┌──────────────┐
        │  Style Tab   │      │ Settings Tab │
        │  (3 styles)  │      │ (options)    │
        └──────────────┘      └──────────────┘

                           │
                           ▼
        ┌─────────────────────────────────────────────┐
        │              Data Model                      │
        │         slideshow.json                       │
        ├─────────────────────────────────────────────┤
        │  • slides[] (2-12)                          │
        │  • settings {}                              │
        │  • identifier                               │
        └─────────────────────────────────────────────┘
```

---

### 14.2 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    DATA FLOW ARCHITECTURE                        │
└─────────────────────────────────────────────────────────────────┘

                    ┌─────────────────┐
                    │  User Actions   │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
  ┌──────────┐        ┌──────────┐        ┌──────────┐
  │  Click   │        │  Edit    │        │  Upload  │
  │  Arrows  │        │  Text    │        │  Media   │
  └────┬─────┘        └────┬─────┘        └────┬─────┘
       │                   │                   │
       ▼                   ▼                   ▼
  ┌──────────────────────────────────────────────────┐
  │            Scope Event Handlers                  │
  ├──────────────────────────────────────────────────┤
  │  • $scope.bxSlider.goToNextSlide()              │
  │  • $scope.fieldData.instructionText = value     │
  │  • $scope.uploadMultipleSlideshow()             │
  └───────────────────┬──────────────────────────────┘
                      │
                      ▼
  ┌──────────────────────────────────────────────────┐
  │         Update $scope.fieldData                  │
  │         (AngularJS data binding)                 │
  └───────────────────┬──────────────────────────────┘
                      │
                      ▼
  ┌──────────────────────────────────────────────────┐
  │         AngularJS Digest Cycle                   │
  │         (detect changes & update UI)             │
  └───────────────────┬──────────────────────────────┘
                      │
        ┌─────────────┴─────────────┐
        │                           │
        ▼                           ▼
  ┌──────────┐              ┌──────────────┐
  │   DOM    │              │   Settings   │
  │  Update  │              │    Panel     │
  └────┬─────┘              └──────┬───────┘
       │                           │
       ▼                           ▼
  ┌──────────────────────────────────────────────────┐
  │         Trigger Save (enableDisableSaveButton)   │
  └───────────────────┬──────────────────────────────┘
                      │
                      ▼
  ┌──────────────────────────────────────────────────┐
  │    Persist to savedJson[pageNo][uniqueId]        │
  │        (in-memory storage)                       │
  └───────────────────┬──────────────────────────────┘
                      │
                      ▼
  ┌──────────────────────────────────────────────────┐
  │       On Save Button Click:                      │
  │       Send to Server / Package for Export        │
  └──────────────────────────────────────────────────┘
```

---

### 14.3 Slide Navigation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                  SLIDE NAVIGATION SEQUENCE                       │
└─────────────────────────────────────────────────────────────────┘

        User Clicks Next Arrow
                │
                ▼
        ┌───────────────────┐
        │ onSlideNext()     │
        │ callback fired    │
        └────────┬──────────┘
                 │
                 ▼
        ┌───────────────────┐
        │ Pause all videos  │
        │  - HTML5 video    │
        │  - YouTube iframe │
        └────────┬──────────┘
                 │
                 ▼
        ┌───────────────────┐
        │ Remove class      │
        │ 'active-slide'    │
        │ from current      │
        └────────┬──────────┘
                 │
                 ▼
        ┌───────────────────┐
        │ bxSlider          │
        │ transitions       │
        │ to next slide     │
        └────────┬──────────┘
                 │
                 ▼
        ┌───────────────────┐
        │ onSlideAfter()    │
        │ callback fired    │
        └────────┬──────────┘
                 │
                 ▼
        ┌───────────────────┐
        │ Add 'active-slide'│
        │ to new slide      │
        └────────┬──────────┘
                 │
                 ▼
        ┌───────────────────┐
        │ Update pagination │
        │ "2 / 5"           │
        └────────┬──────────┘
                 │
                 ▼
        ┌───────────────────┐
        │ Recalculate       │
        │ slide heights     │
        └────────┬──────────┘
                 │
                 ▼
        ┌───────────────────┐
        │ Update settings   │
        │ panel (editor)    │
        └────────┬──────────┘
                 │
                 ▼
        ┌───────────────────┐
        │ Navigation        │
        │ complete          │
        └───────────────────┘
```

---

### 14.4 Media Upload Sequence

```
┌─────────────────────────────────────────────────────────────────┐
│                    MEDIA UPLOAD FLOW                             │
└─────────────────────────────────────────────────────────────────┘

    User clicks Upload button / drags file
                │
                ▼
        ┌───────────────────┐
        │ File picker opens │
        │ (native dialog)   │
        └────────┬──────────┘
                 │
                 ▼
        ┌───────────────────┐
        │ User selects      │
        │ file(s)           │
        └────────┬──────────┘
                 │
                 ▼
        ┌───────────────────┐
        │ uploadfiles       │
        │ directive         │
        │ triggered         │
        └────────┬──────────┘
                 │
                 ▼
        ┌───────────────────┐
        │ Validate file     │
        │  - Type check     │
        │  - Size check     │
        └────┬───────┬──────┘
             │       │
         Valid   Invalid
             │       │
             │       ▼
             │  ┌───────────────────┐
             │  │ Show error        │
             │  │ message           │
             │  └───────────────────┘
             │
             ▼
        ┌───────────────────┐
        │ Upload to server  │
        │ (AJAX POST)       │
        └────────┬──────────┘
                 │
                 ▼
        ┌───────────────────┐
        │ Server processes  │
        │  - Stores file    │
        │  - Returns URL    │
        └────────┬──────────┘
                 │
                 ▼
        ┌───────────────────┐
        │ Update fieldData  │
        │ .slides[index]    │
        │ .media.src        │
        └────────┬──────────┘
                 │
        ┌────────┴──────────┐
        │                   │
   Single Upload      Multiple Upload
        │                   │
        ▼                   ▼
  ┌──────────┐      ┌──────────────────┐
  │ Update   │      │ Store in         │
  │ current  │      │ mediaSrcSlideshow│
  │ slide    │      │ array            │
  └────┬─────┘      └────┬─────────────┘
       │                 │
       │                 ▼
       │         ┌──────────────────┐
       │         │ Wait for all     │
       │         │ uploads complete │
       │         └────┬─────────────┘
       │              │
       │              ▼
       │         ┌──────────────────┐
       │         │ Create new slides│
       │         │ if needed        │
       │         └────┬─────────────┘
       │              │
       └──────────────┘
                 │
                 ▼
        ┌───────────────────┐
        │ Reload bxSlider   │
        │ bxSlider.         │
        │ reloadSlider()    │
        └────────┬──────────┘
                 │
                 ▼
        ┌───────────────────┐
        │ Navigate to       │
        │ updated slide     │
        └────────┬──────────┘
                 │
                 ▼
        ┌───────────────────┐
        │ Show preview      │
        │ in settings panel │
        └───────────────────┘
```

---

### 14.5 Mode Transition Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│              MODE TRANSITIONS & TRANSFORMATIONS                  │
└─────────────────────────────────────────────────────────────────┘

     ┌─────────────────────┐
     │   EDITOR MODE       │
     │  (Authoring)        │
     ├─────────────────────┤
     │ • Editable fields   │
     │ • Add/Delete btns   │
     │ • Settings panel    │
     │ • Drag/drop         │
     │ • Real-time save    │
     └──────────┬──────────┘
                │
                │ Click Preview Button
                │
                ▼
     ┌─────────────────────────────────────┐
     │  TRANSFORMATION                     │
     │  createPreviewForSlideshow()        │
     ├─────────────────────────────────────┤
     │ 1. Remove edit controls             │
     │    - Add Slide button               │
     │    - Delete Slide button            │
     │    - Border styles                  │
     │                                     │
     │ 2. Clean markup                     │
     │    - Remove bxSlider wrapper        │
     │    - Hide empty header/instruction  │
     │    - Remove contenteditable attrs   │
     │                                     │
     │ 3. Finalize structure               │
     │    - Flatten .bx-viewport content   │
     │    - Remove editor-only classes     │
     └──────────┬──────────────────────────┘
                │
                ▼
     ┌─────────────────────┐
     │   PREVIEW MODE      │
     │  (Author Testing)   │
     ├─────────────────────┤
     │ • Read-only         │
     │ • Full interaction  │
     │ • Auto-play active  │
     │ • Navigation works  │
     │ • Video playback    │
     └──────────┬──────────┘
                │
                │ Click Close / Back to Editor
                │
                ▼
     ┌─────────────────────┐
     │   EDITOR MODE       │
     │  (Return)           │
     │  - State restored   │
     └─────────────────────┘

                │
                │ Publish / Package
                │
                ▼
     ┌─────────────────────────────────────┐
     │  PACKAGING PROCESS                  │
     ├─────────────────────────────────────┤
     │ 1. Generate final HTML              │
     │ 2. Copy media assets                │
     │ 3. Bundle CSS/JS                    │
     │ 4. Optimize images                  │
     │ 5. Create manifest                  │
     └──────────┬──────────────────────────┘
                │
                ▼
     ┌─────────────────────┐
     │  READER MODE        │
     │  (End User)         │
     ├─────────────────────┤
     │ • Published content │
     │ • Offline support   │
     │ • Touch gestures    │
     │ • Performance opt   │
     │ • Analytics         │
     └─────────────────────┘
```

---

### 14.6 Component Interaction Map

```
┌─────────────────────────────────────────────────────────────────┐
│            COMPONENT INTERACTION HIERARCHY                       │
└─────────────────────────────────────────────────────────────────┘

                    ┌───────────────────┐
                    │ Main Controller   │
                    │ (ngcontroller.js) │
                    └─────────┬─────────┘
                              │
                              │ Manages
                              │
            ┌─────────────────┴─────────────────┐
            │                                   │
            ▼                                   ▼
    ┌───────────────┐                  ┌───────────────┐
    │ Page Scope    │                  │ Global State  │
    │ $scope.       │                  │ savedJson     │
    │ savedData     │                  │ [pageNo][id]  │
    └───────┬───────┘                  └───────┬───────┘
            │                                  │
            └──────────────┬───────────────────┘
                           │
                           │ Injects data
                           │
                           ▼
              ┌────────────────────────┐
              │ Slideshow Directive    │
              │ slideShowTemplate      │
              └────────────┬───────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Slide Scope  │  │  bxSlider    │  │  Settings    │
│ fieldData    │  │  Instance    │  │  Panel       │
│ .slides[]    │  │  .bxSlider   │  │  Scope       │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                 │
       └────────┬────────┴────────┬────────┘
                │                 │
                │ Communicates via│
                │ Events & Scope  │
                │                 │
        ┌───────┴──────┬──────────┴───────┐
        │              │                  │
        ▼              ▼                  ▼
┌──────────────┐ ┌──────────┐   ┌──────────────┐
│ Media        │ │ Style    │   │ Layout       │
│ Directive    │ │ Service  │   │ Manager      │
│ data-media-  │ │ (colors) │   │ (vertical/   │
│ template     │ │          │   │  horizontal) │
└──────────────┘ └──────────┘   └──────────────┘

                    │
                    │ Triggers
                    │
                    ▼
        ┌───────────────────────┐
        │  External Services    │
        ├───────────────────────┤
        │ • modalService        │
        │ • uploadfiles         │
        │ • Video.js            │
        │ • colorPicker         │
        └───────────────────────┘
```

---

### 14.7 State Management Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                  STATE MANAGEMENT FLOW                           │
└─────────────────────────────────────────────────────────────────┘

                    Application State
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Global     │  │    Page      │  │  Component   │
│    State     │  │    State     │  │    State     │
├──────────────┤  ├──────────────┤  ├──────────────┤
│• User prefs  │  │• Page config │  │• fieldData   │
│• Theme       │  │• Components  │  │• bxSlider    │
│• Locale      │  │• Layout      │  │• activeSlide │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                 │
       └────────┬────────┴────────┬────────┘
                │                 │
                │  Synchronized   │
                │     via         │
                │                 │
                ▼                 ▼
        ┌──────────────┐  ┌──────────────┐
        │  savedJson   │  │   $scope     │
        │  [pageNo]    │  │   .watch()   │
        │  [uniqueId]  │  │   .apply()   │
        └──────┬───────┘  └──────┬───────┘
               │                 │
               └────────┬────────┘
                        │
                        │ Triggers
                        │
                        ▼
               ┌────────────────┐
               │ Save Handler   │
               │ Enable Save    │
               │ Button         │
               └────────┬───────┘
                        │
                On Save Click
                        │
                        ▼
               ┌────────────────┐
               │ Persist to     │
               │ Server/DB      │
               └────────────────┘

State Flow for Setting Change:
───────────────────────────────

User toggles "Show Header"
        │
        ▼
onHeaderVisibilityChanged(state)
        │
        ▼
fieldData.settings.isHeaderVisible = state
        │
        ▼
AngularJS digest cycle
        │
        ▼
DOM updates (hide/show header)
        │
        ▼
enableDisableSaveButton(true)
        │
        ▼
Persist to savedJson
```

---

## Summary

The Carousel/Slideshow component is a robust, feature-rich presentation tool with:

### Strengths
✅ Flexible layout options (vertical/horizontal)  
✅ Multiple media types (image, video, text)  
✅ Three distinct visual styles  
✅ Auto-play functionality  
✅ Real-time editing and preview  
✅ Responsive design  
✅ Slide management (add/delete)  

### Areas for Improvement
⚠️ Accessibility gaps (keyboard nav, ARIA, screen readers)  
⚠️ Upload experience (progress, drag-drop)  
⚠️ Error handling and validation  
⚠️ Performance (lazy loading, optimization)  
⚠️ Localization consistency  
⚠️ Browser compatibility (IE11)  

### Critical Issues
🚨 Height calculation inconsistencies  
🚨 Style change timing bugs  
🚨 Offline video placeholders  
🚨 YouTube pause reliability  

### Recommended Next Steps
1. **Phase 1:** Accessibility compliance (keyboard nav, ARIA)
2. **Phase 2:** Upload UX improvements (progress, errors)
3. **Phase 3:** Performance optimization (lazy load, resize debounce)
4. **Phase 4:** Enhanced styles and animations
5. **Phase 5:** Advanced features (reordering, templates, analytics)

