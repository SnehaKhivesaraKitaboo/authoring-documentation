# Flashcard Component - Comprehensive Technical Documentation

## Table of Contents
1. [Component Overview](#component-overview)
2. [File Structure](#file-structure)
3. [Data Model](#data-model)
4. [Component Types/Variants](#component-typesvariants)
5. [Component Architecture](#component-architecture)
6. [Core Features](#core-features)
7. [Editor Mode](#editor-mode)
8. [Preview Mode](#preview-mode)
9. [Reader Mode](#reader-mode)
10. [Data Flow](#data-flow)
11. [Rendering Logic](#rendering-logic)
12. [Offline/Package Behavior](#offlinepackage-behavior)
13. [Error Handling](#error-handling)
14. [Known Issues](#known-issues)
15. [Recommendations for Improvement](#recommendations-for-improvement)

---

## Component Overview

The **Flashcard Component** is an interactive educational template that presents information through double-sided cards that can be flipped to reveal content on both sides. It supports multiple media types (text, images, audio, video) on each card face, making it suitable for various learning scenarios such as vocabulary building, concept review, and self-assessment.

### Purpose
- Enable creation of interactive flashcard-based learning content
- Support both front and back card content with multiple media types
- Provide navigation through multiple flashcards in a slide-based interface
- Offer customizable styling and appearance options

### Key Characteristics
- **Minimum Cards**: 2 (enforced)
- **Maximum Cards**: 20 (enforced)
- **Card Sides**: Each card has a front face and back face
- **Media Support**: Text, Image, Audio, Video (including YouTube)
- **Text Limit**: 150 characters per card face (when using text mode)
- **Style Variants**: 2 styles (Style-1 and Style-2)

---

## File Structure

```
templates/flashcard/
├── flashcard.html                          # Main template HTML
├── flashcard-media-template.html           # Media rendering sub-template
├── flashcard-template-setting-panel.html   # Settings panel UI
├── scripts/
│   ├── flashcard-directive.js              # Main AngularJS directive (1135 lines)
│   └── flashcard-template-preview1.js      # Preview/Reader mode logic (91 lines)
├── styles/
│   └── flashcard-template.css              # Component styling (1760 lines)
└── default/
    └── flashcard.json                      # Default data structure (310 lines)
```

---

## Data Model

### Main Data Structure

```json
{
  "identifier": "flashcard",
  "introductionText": "",
  "instructionText": "",
  "slides": [
    {
      "isBackCardActive": false,
      "frontCard": { /* Card Face Data */ },
      "backCard": { /* Card Face Data */ }
    }
  ],
  "settings": { /* Component Settings */ }
}
```

### Card Face Data Structure

Each card face (front or back) contains:

```json
{
  "src": "images/image.jpg",
  "imageVisible": true,
  "caption": "Enter caption text here",
  "imageSetting": {
    "imageUploadOrReplace": "Upload",
    "imageUrl": "images/image.jpg",
    "imageName": "image.jpg",
    "imageDimension": "",
    "metaTags": []
  },
  "audioSetting": {
    "audioUploadOrReplace": "Upload",
    "audioAlign": "aud-center",
    "audioName": "",
    "metaTags": []
  },
  "videoSetting": {
    "videoUploadOrReplace": "Upload Video",
    "youtubeVideoName": "",
    "videoUploaded": false,
    "youtube": false,
    "uploadtype": "uploadbysystem",
    "videoAlign": "vid-center",
    "metaTags": []
  },
  "isMediaEnable": false,
  "isTitleEnable": false,
  "mediaToUpload": "",
  "cardTitle": "",
  "cardText": "",
  "cardType": "text"  // "text" or "media"
}
```

### Settings Structure

```json
{
  "isHeaderVisible": true,
  "isInstructionVisible": true,
  "isFrontCardTitleVisible": true,
  "isBackCardTitleVisible": true,
  "captiondisplay": true,
  "editTemplateIcon": "icon-Flash-Cards",
  "editTemplateName": "Flashcard",
  "showAudioBar": false,
  "verticalSlide": "vertical-Flashcard",
  "transcriptText": "",
  "metaTags": [],
  "showAutoSlideSetting": true,
  "autoSlide": false,
  "pauseDuration": 3,
  "slider": "with-dot",
  "slideValue": false,
  "pagebgcolor": "#fff",
  "flashCardStyleType": "style-1",  // "style-1" or "style-2"
  "outline": "outline",
  "Appearance": "#2175d1",
  "cardColour": "#FFFFFF",
  "headerStyleSettings": true,
  "activeSlide": 1,
  "style_tab": [ /* Style configuration */ ]
}
```

---

## Component Types/Variants

The Flashcard component supports **2 style variants**:

### Style-1 (Default)
- **Type Name**: `style-1`
- **CSS Class**: `.style-1`
- **Visual Characteristics**:
  - Standard navigation arrows
  - Simple pagination indicator at bottom
  - Arrow color matches theme color (`Appearance` setting)
  - Clean, minimal design
- **Use Case**: General-purpose flashcards with standard appearance

### Style-2
- **Type Name**: `style-2`  
- **CSS Class**: `.style-2`
- **Visual Characteristics**:
  - Enhanced navigation arrows (`.style2Templateprev`, `.style2Templatenext`)
  - Progress bar at top (`.Style2Progress`)
  - Progress bar fills as user advances through cards
  - Rounded corner on progress bar when complete (100%)
  - More visual feedback for progress tracking
- **Use Case**: Learning scenarios where progress tracking is important

### Card Type Modes

Each card face can be in one of two modes:

1. **Text Mode** (`cardType: "text"`)
   - Displays editable text content
   - 150-character limit
   - Center-aligned by default
   
2. **Media Mode** (`cardType: "media"`)
   - Supports: Image, Audio, Video, YouTube video
   - Media type selected via `mediaToUpload` property
   - Each media type has its own settings object

---

## Component Architecture

### AngularJS Directive Structure

The component is implemented as an AngularJS directive: `flashCardTemplate`

```javascript
App.directive('flashCardTemplate', ['modalService', '$timeout', function(modalService, $timeout) {
  return {
    restrict: 'A',
    controller: function($scope, $compile, $rootScope) {
      // Controller logic
    },
    link: function(scope, element, attr) {
      // Link/initialization logic
    }
  }
}]);
```

### Supporting Directives

1. **onFinishRender**: Triggers event when ng-repeat rendering completes
2. **flashCardSetting**: Manages settings panel interactions
3. **mediaTemplateFlashcard**: Renders media content (images, audio, video)

### Key Dependencies

- **AngularJS**: Core framework
- **jQuery**: DOM manipulation and event handling
- **bxSlider**: Carousel/slider functionality for card navigation
- **audiojs**: Audio player library
- **Video.js**: Video player library

---

## Core Features

### 1. Card Management
- **Add Card**: Up to 20 cards maximum
- **Delete Card**: Minimum 2 cards enforced
- **Navigate Cards**: Previous/Next arrows, pagination
- **Card Flipping**: Click "Flip" button or click anywhere on card to reveal back side

### 2. Content Types
Each card face supports:
- **Text**: Plain text with 150-character limit
- **Image**: Upload or replace image with metadata
- **Audio**: Upload audio files with custom player
- **Video**: Upload video or embed YouTube/Kaltura videos

### 3. Visibility Controls
- Header text (show/hide)
- Instruction text (show/hide)
- Front card title (show/hide)
- Back card title (show/hide)

### 4. Styling Options
- **Style Selection**: Choose between Style-1 and Style-2
- **Theme Color**: Customize appearance color
- **Card Background**: Set card background color (`cardColour`)
- **Outline Mode**: Border outline option

### 5. Media Upload Options
**For Video**:
- Upload by system (local file)
- Upload by URL (YouTube embedding)

**For Images**:
- Direct upload
- Dimension tracking
- Metadata support

**For Audio**:
- Direct upload
- Custom audio player with play/pause controls

---

## Editor Mode

### Initialization Process

1. **First-time Load**:
   - Element automatically focused and scrolled into view
   - Header field receives focus
   - Settings panel configured

2. **Existing Content Load**:
   - Default visibility settings applied if missing
   - Video sources validated and updated
   - Event handlers bound to prevent inline image insertion

### Editing Capabilities

#### Header and Instruction
- Editable via `contenteditable` divs
- Placeholders guide user input
- Math rendering support (`.math-read-only-field`)

#### Card Content
- **Text Mode**: Direct editing in contenteditable div
- **Media Mode**: Upload interface in settings panel
- Character limit enforced (150 chars for card text)

#### Settings Panel Operations

1. **Card Properties** (per-card settings):
   - Switch between front/back card
   - Select card type (text/media)
   - Choose media type (image/audio/video)
   - Upload media files
   - Configure media-specific settings

2. **Global Settings**:
   - Show/hide header and instruction
   - Select style variant
   - Set theme color
   - Set card background color
   - Outline border toggle

### Key Editor Functions

```javascript
// Add new card
$scope.addSlideClick = function() {
  // Validates max card limit
  // Pushes new card with default structure
  // Reloads slider
  // Updates settings panel
}

// Delete current card
$scope.deleteSlideClick = function() {
  // Validates min card limit
  // Removes card from data
  // Reloads slider
  // Navigates to previous card
}

// Flip card
$scope.flipCard = function(val) {
  // Updates isBackCardActive flag
  // Updates settings panel to show back card settings
}

// Change style
window.applystyleflashcard = function(event, optionname, styleTypeclass, index, parentindex, styleTypestylefunction) {
  // Applies style classes
  // Updates navigation arrow styling
  // Manages progress bar for Style-2
}
```

---

## Preview Mode

### Initialization

Preview mode is activated via the preview functionality and loads:
- **Script**: `flashcard-template-preview1.js`
- **CSS**: `flashcard-template.css`

### Interactive Features

1. **Card Flipping**:
   - Click anywhere on card (except media controls)
   - Toggles `.flipped` class
   - Stops any playing media before flip

2. **Navigation**:
   - Previous/Next arrow buttons
   - Stops all media on slide change
   - Updates progress bar (Style-2)

3. **Media Handling**:
   - Audio: Stops on card flip or navigation
   - Video: Stops on card flip or navigation  
   - YouTube: Sends `stopVideo` command via postMessage API

### Key Preview Functions

```javascript
// Card flip handler
$('.add-flip').parents(".card").on('click touch', function (e) {
  // Checks if click is on media element
  // Stops all audio/video
  // Toggles card flip
});

// Navigation handlers
$(".bx-prev, .bx-next").on('click touch', function (e) {
  // Stops all media
  // Allows navigation to proceed
});

// Progress bar update (Style-2)
$("[data-type='flashcard'] .style-2").each(function(){
  var cardlength = $(this).parents('.customClass').find('.card').length;
  var width = (100/cardlength) * (1);
  // Updates progress bar width
});
```

---

## Reader Mode

Reader mode behaves identically to Preview mode. The same JavaScript file (`flashcard-template-preview1.js`) handles both modes, providing:

- Card flipping functionality
- Media playback control
- Navigation between cards
- Progress tracking (Style-2)

### Reader-Specific Considerations

1. **Offline Support**: All media should be packaged locally
2. **No Editing**: All edit controls hidden
3. **Consistent Behavior**: Same interactions as preview
4. **Resource Loading**: Relative paths resolved to packaged content

---

## Data Flow

### Component Lifecycle Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    INITIALIZATION                            │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────────┐
        │   Load flashcard.json                │
        │   (Default or Saved Data)            │
        └──────────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────────┐
        │   Angular Directive Init             │
        │   - flashCardTemplate directive      │
        │   - Controller initialization        │
        └──────────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────────┐
        │   Link Function Execution            │
        │   - Bind event handlers              │
        │   - Initialize bxSlider              │
        │   - Set visibility defaults          │
        └──────────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────────┐
        │   Render Cards (ng-repeat)           │
        │   - Loop through slides array        │
        │   - Render each card (front/back)    │
        └──────────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────────┐
        │   onFinishRender Event               │
        │   - All cards rendered               │
        │   - Initialize/Reload bxSlider       │
        └──────────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────────┐
        │   bxSlider Initialization            │
        │   - Set up navigation controls       │
        │   - Configure slide behavior         │
        │   - Apply style-specific settings    │
        └──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    READY FOR INTERACTION                     │
└─────────────────────────────────────────────────────────────┘
```

### User Interaction Flow

```
USER ACTION → EVENT HANDLER → DATA UPDATE → VIEW UPDATE → STATE SYNC

Examples:

1. Add Card:
   Click "Add Card" → addSlideClick() → Push to fieldData.slides 
   → ng-repeat renders new card → Slider reloads → Settings update

2. Flip Card:
   Click "Flip" → flipCard(true/false) → Update isBackCardActive 
   → CSS class toggle → Settings panel switches context

3. Change Style:
   Select Style → applystyleflashcard() → Update flashCardStyleType 
   → CSS classes applied → Navigation arrows styled → Progress bar shown/hidden

4. Upload Media:
   Upload file → uploadfiles directive → Update media settings object 
   → Compile media template → Render media element

5. Navigate Cards:
   Click Next → bxSlider.goToSlide() → onSlideAfter callback 
   → Update active-slide class → Stop media → Update settings panel
```

### Settings Panel ↔ Component Sync

```
Settings Panel (Right Sidebar)    ←→    Flashcard Component (Canvas)
        │                                        │
        │  User changes setting                 │
        ├────────────────────────────────────→  │
        │  Function call (e.g., setFrontMediaType) │
        │                                        │
        │                                        ├─ Update scope data
        │                                        ├─ Recompile if needed
        │                                        ├─ Apply CSS changes
        │                                        │
        │  Update UI to reflect new state       │
        │  ←────────────────────────────────────┤
        │                                        │
        │  User clicks on card                  │
        │  ←────────────────────────────────────┤
        │                                        │
        ├─ Get active card index                │
        ├─ Load card settings                   │
        ├─ Populate panel controls              │
        │                                        │
```

---

## Rendering Logic

### Card Rendering Process

1. **HTML Template Structure**:
   ```html
   <div ng-repeat="option in fieldData.slides">
     <div class="flip">
       <div class="card" ng-class="{'flipped': option.isBackCardActive}">
         <!-- Front Card -->
         <div class="front front-container">
           <!-- Text or Media -->
         </div>
         <!-- Back Card -->
         <div class="back back-container">
           <!-- Text or Media -->
         </div>
       </div>
     </div>
   </div>
   ```

2. **Conditional Rendering**:
   - Header: Shown if `isHeaderVisible = true`
   - Instruction: Shown if `isInstructionVisible = true`
   - Card content: Based on `cardType` (text/media)
   - Media element: Based on `mediaToUpload` (image/audio/video)

3. **Media Template Inclusion**:
   ```html
   <div data-media-template-flashcard data-field-data="option.frontCard"></div>
   ```
   This loads `flashcard-media-template.html` with proper data binding.

### Style Application Logic

**Style-1**:
```javascript
if($(element).hasClass("style-1")){
  // Clear progress bar background
  $(element).parents(".sd-item").find('.bx-pager.bx-default-pager').css('background-color',"");
  // Set arrow colors to theme color
  $(element).parents(".sd-item").find('.bx-controls-direction').find('.bx-prev, .bx-next').css('color',assetcolor);
}
```

**Style-2**:
```javascript
else if($(element).hasClass("style-2")){
  // Set arrow colors to theme color
  $(element).parents(".sd-item").find('.bx-controls-direction').find('.bx-prev, .bx-next').css('color',assetcolor);
  // Add style-2 specific classes
  $(element).parents(".sd-item").find('.bx-controls-direction').find('.bx-prev').addClass('style2Templateprev');
  $(element).parents(".sd-item").find('.bx-controls-direction').find('.bx-next').addClass('style2Templatenext');
  // Calculate and show progress bar
  var width = (100/slide_count) * (slide_curent + 1);
  $(element).parents(".sd-item").find('.Style2Progress').css('width', width + '%');
}
```

### Slider Configuration

```javascript
scope.bxSlider = element.find('.bxslider').bxSlider({
  infiniteLoop: false,        // No loop back to start
  hideControlOnEnd: true,     // Hide next button on last slide
  useCSS: false,              // Use jQuery animations
  easing: 'linear',
  speed: 500,
  pagerType: 'short',         // Shows "1 / 5" style pagination
  touchEnabled: false,        // Disable touch in editor
  adaptiveHeight: true,       // Adjust height per card
  onSliderLoad: function() {
    // Initial setup
  },
  onSlideAfter: function(currentSlide) {
    // Stop media, update active class
  },
  onSlideNext: function() {
    // Handle next navigation
  },
  onSlidePrev: function() {
    // Handle previous navigation
  }
});
```

---

## Offline/Package Behavior

### Resource Requirements

When packaging for offline use, ensure:

1. **Media Files**:
   - All uploaded images, audio, and videos are included in package
   - Relative paths are maintained: `images/`, `audio/`, `video/`
   
2. **CSS & JavaScript**:
   - `css/templates/flashcard-template.css`
   - `js/templates/flashcard-template-preview1.js`

3. **External Dependencies**:
   - bxSlider library
   - audiojs library
   - Video.js library
   - jQuery

4. **YouTube Videos**:
   - Require internet connection (cannot be packaged)
   - Fallback message should be displayed if offline

### Package Structure

```
package/
├── content/
│   └── flashcard_data.json      # Serialized flashcard data
├── media/
│   ├── images/
│   │   └── [uploaded_images]
│   ├── audio/
│   │   └── [uploaded_audio]
│   └── video/
│       └── [uploaded_videos]
├── css/
│   └── templates/
│       └── flashcard-template.css
└── js/
    └── templates/
        └── flashcard-template-preview1.js
```

### Path Resolution

In packaged mode, paths are resolved relative to package root:
- Editor mode: Absolute paths or data URLs
- Reader mode: Relative paths from package root

Example:
```javascript
// Editor: /api/media/12345/image.jpg
// Package: ./media/images/image.jpg
```

---

## Error Handling

### Current Error Handling

The component has minimal explicit error handling. Issues are mostly handled implicitly:

1. **Card Limits**:
   ```javascript
   if ($scope.fieldData.slides.length < max_slides) {
     // Add card
   }
   
   if (parentScope.fieldData.slides.length > min_slides) {
     // Delete card
   }
   ```

2. **Character Limit**:
   ```javascript
   $(document).on('keydown', '.card-text', function(event){
     if (event.target.textContent.length > 149 && event.keyCode != 8 && ...) {
       event.preventDefault();
       return false;
     }
   });
   ```

3. **Media Validation**:
   - Checks for youtube/kaltura flag before rendering iframe
   - Validates video upload state before showing video element
   - Checks audio source before initializing audiojs

### Missing Error Handling

Several error scenarios lack proper handling:

1. **Media Upload Failures**: No error message shown to user
2. **Invalid YouTube URLs**: No validation before embedding
3. **Network Errors**: No retry mechanism for online resources
4. **Data Corruption**: No validation of loaded JSON structure
5. **Browser Compatibility**: No feature detection for required APIs

---

## Known Issues

### 1. Character Limit Enforcement
**Issue**: Character limit only enforced on keydown, not paste
```javascript
// Current implementation
$(document).on('keydown', '.card-text', function(event){
  if (event.target.textContent.length > 149 ...) {
    event.preventDefault();
  }
});
```
**Impact**: Users can paste more than 150 characters
**Workaround**: Implemented in keyup handler, but truncation may break mid-word

### 2. Media Playback on Flip
**Issue**: Media continues playing after card flip in some scenarios
**Code Location**: `flashcard-template-preview1.js`, click handler
**Impact**: Audio/video from hidden side continues playing
**Mitigation**: Current code tries to stop media, but timing issues may occur

### 3. Slider Height Calculation
**Issue**: Slider height not always calculated correctly on window resize
```javascript
$scope.resizeSlideHeight = function(){
  // Complex height calculation commented out
  // May cause layout issues
}
```
**Impact**: Cards may overflow or have excess whitespace
**Current State**: Much of the resize logic is commented out

### 4. YouTube Video Control
**Issue**: Youtube videos require postMessage API, which may not work if iframe src origin doesn't match
```javascript
iframe.contentWindow.postMessage(
  JSON.stringify({
    event: "command",
    func: "stopVideo",
    args: ""
  }),
  targetOrigin
);
```
**Impact**: YouTube videos may not stop on navigation/flip
**Requirement**: YouTube iframe API must be enabled in embed URL

### 5. Settings Panel Synchronization
**Issue**: Settings panel occasionally shows stale data after rapid navigation
**Code Location**: `setTimeout()` delays in slide navigation handlers
**Impact**: User may see previous card's settings briefly
**Timing**: 1800ms delay hardcoded in navigation callbacks

### 6. Memory Leaks
**Issue**: Event handlers not properly cleaned up on component destruction
```javascript
$(document).on('keydown', '.card-text', ...);  // Global event handler never removed
window.addEventListener("message", receiveMessage, false);  // Never removed
```
**Impact**: Memory leaks in long-lived applications
**Accumulation**: Handlers accumulate with each component instance

### 7. Accessibility Issues
- No ARIA labels for navigation controls
- Keyboard navigation limited (only Enter key on some elements)
- No screen reader announcements for card flips
- Focus management not implemented

### 8. Browser Compatibility
- Uses deprecated jQuery methods (`.bind()`, `.attr()` mutations)
- Assumes ES5 features without polyfills
- No fallback for CSS transforms (card flip effect)

---

## Recommendations for Improvement

### High Priority

#### 1. Error Handling Enhancement
```javascript
// Recommended approach
try {
  // Upload media
  var uploadResult = await uploadMedia(file);
  if (!uploadResult.success) {
    showErrorMessage("Failed to upload media: " + uploadResult.error);
  }
} catch (error) {
  logError("Media upload exception", error);
  showErrorMessage("An unexpected error occurred during upload");
}
```

#### 2. Event Cleanup
```javascript
// Add cleanup in scope.$on('$destroy')
scope.$on('$destroy', function() {
  // Remove global event listeners
  $(document).off('keydown', '.card-text');
  $(document).off('keyup paste', '.card-text');
  window.removeEventListener("message", receiveMessage);
  
  // Destroy slider
  if (scope.bxSlider) {
    scope.bxSlider.destroySlider();
  }
});
```

#### 3. Data Validation
```javascript
// Validate on load
function validateFlashcardData(data) {
  if (!data.slides || !Array.isArray(data.slides)) {
    throw new Error("Invalid slides data");
  }
  
  if (data.slides.length < min_slides || data.slides.length > max_slides) {
    throw new Error(`Slide count must be between ${min_slides} and ${max_slides}`);
  }
  
  data.slides.forEach((slide, index) => {
    if (!slide.frontCard || !slide.backCard) {
      throw new Error(`Slide ${index} missing card data`);
    }
  });
  
  return true;
}
```

#### 4. Accessibility Improvements
```html
<!-- Add ARIA attributes -->
<div class="card" 
     role="button" 
     aria-label="Flashcard front: {cardText}, press space to flip"
     tabindex="0"
     ng-class="{'flipped': option.isBackCardActive}">
  
<button class="bx-prev" 
        aria-label="Previous card" 
        ng-disabled="isFirstCard">
        
<div role="status" 
     aria-live="polite" 
     aria-atomic="true">
  Card {{currentSlide + 1}} of {{totalSlides}}
</div>
```

### Medium Priority

#### 5. Performance Optimization
- Debounce window resize handler
- Use `$scope.$evalAsync()` instead of `$timeout(0)`
- Implement virtual scrolling for large card sets (>20 cards future support)
- Lazy load media (load images only when card becomes active)

#### 6. Code Refactoring
- Extract magic numbers to named constants
- Separate concerns (move styling logic out of directive)
- Use AngularJS services for shared functions
- Convert jQuery-heavy code to Angular-idiomatic code

#### 7. Testing
```javascript
// Unit test example
describe('FlashcardDirective', function() {
  it('should enforce minimum card limit', function() {
    var scope = createFlashcardScope();
    scope.fieldData.slides = [card1, card2];
    scope.deleteSlideClick();
    expect(scope.fieldData.slides.length).toBe(2);
  });
  
  it('should enforce maximum card limit', function() {
    var scope = createFlashcardScope();
    scope.fieldData.slides = new Array(20);
    scope.addSlideClick();
    expect(scope.fieldData.slides.length).toBe(20);
  });
});
```

#### 8. Documentation
- Add JSDoc comments to all functions
- Document expected data structure contracts
- Provide examples of media upload integration
- Create troubleshooting guide for common issues

### Low Priority

#### 9. Feature Enhancements
- **Auto-advance option**: Automatically flip and advance cards
- **Shuffle mode**: Randomize card order for repetition
- **Progress save**: Remember user's position in card deck
- **Swipe gestures**: Touch-friendly navigation
- **Keyboard shortcuts**: Full keyboard navigation support
- **Card statistics**: Track which cards viewed/flipped
- **Export/Import**: JSON export for sharing card sets

#### 10. UI/UX Improvements
- Smooth animations for card flip (CSS transitions)
- Visual feedback for card boundaries
- Better mobile responsive layout
- Touch-friendly controls (larger tap targets)
- Preview thumbnail navigation
- Fullscreen mode for presentation

#### 11. Media Enhancements
- **Image cropping**: Built-in image editor
- **Audio recording**: Record audio directly in editor
- **Video thumbnails**: Generate and display video previews
- **Media library**: Reuse media across multiple cards
- **CDN integration**: Optimize media delivery

---

## Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────────┐
│                         FLASHCARD COMPONENT ARCHITECTURE                    │
└────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                              PRESENTATION LAYER                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────┐  ┌────────────────────────────────────────┐  │
│  │  flashcard.html         │  │  flashcard-template-setting-panel.html │  │
│  │  ─────────────          │  │  ─────────────────────────────────     │  │
│  │  • Header               │  │  • Style Selection                     │  │
│  │  • Instruction          │  │  • Visibility Toggles                  │  │
│  │  • Card Container       │  │  • Card Properties                     │  │
│  │    - Front/Back Flip    │  │    - Front/Back Settings               │  │
│  │    - Media Template     │  │    - Media Upload Controls             │  │
│  │    - Navigation         │  │  • Appearance Settings                 │  │
│  │  • Add/Delete Buttons   │  │    - Theme Color                       │  │
│  └─────────────────────────┘  │    - Card Background                   │  │
│               │                │    - Outline Toggle                    │  │
│               │                └────────────────────────────────────────┘  │
│               │                                 │                           │
│               └─────────────┬──────────────────┘                           │
│                             │                                               │
│                             ▼                                               │
│               ┌─────────────────────────────────┐                          │
│               │ flashcard-media-template.html   │                          │
│               │ ─────────────────────────────   │                          │
│               │ • Image Rendering               │                          │
│               │ • Audio Player                   │                          │
│               │ • Video Player                   │                          │
│               │ • YouTube Iframe                 │                          │
│               └─────────────────────────────────┘                          │
│                                                                              │
└──────────────────────────────────────────┬───────────────────────────────────┘
                                           │
                                           │ Data Binding
                                           │
┌──────────────────────────────────────────▼───────────────────────────────────┐
│                              CONTROLLER LAYER                                 │
├───────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  flashCardTemplate Directive (Angular)                                │   │
│  │  ─────────────────────────────────────                                │   │
│  │                                                                        │   │
│  │  CONTROLLER SCOPE:                                                    │   │
│  │  ├─ $scope.fieldData          (Card data)                            │   │
│  │  ├─ $scope.bxSlider            (Slider instance)                      │   │
│  │  ├─ $scope.addSlideClick()     (Add card handler)                     │   │
│  │  ├─ $scope.deleteSlideClick()  (Delete card handler)                  │   │
│  │  ├─ $scope.flipCard(val)       (Flip card handler)                    │   │
│  │  ├─ $scope.slide_cont()        (Update slide count)                   │   │
│  │  ├─ $scope.resizeSlideHeight() (Recalculate heights)                  │   │
│  │  └─ Event listeners            (keydown, resize, message)             │   │
│  │                                                                        │   │
│  │  LINK FUNCTION:                                                       │   │
│  │  ├─ Initialize bxSlider                                               │   │
│  │  ├─ Bind event handlers                                               │   │
│  │  ├─ Set default visibility                                            │   │
│  │  ├─ Configure slider callbacks                                        │   │
│  │  │   ├─ onSliderLoad                                                  │   │
│  │  │   ├─ onSlideAfter                                                  │   │
│  │  │   ├─ onSlideNext                                                   │   │
│  │  │   └─ onSlidePrev                                                   │   │
│  │  └─ Style application logic                                           │   │
│  │                                                                        │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                    │                                          │
│                                    │                                          │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  flashCardSetting Directive                                           │   │
│  │  ──────────────────────────────                                       │   │
│  │  ├─ setFrontMediaType(type, subtype)  (Change front card media)      │   │
│  │  ├─ setBackMediaType(type, subtype)   (Change back card media)       │   │
│  │  ├─ setFrontMediaToUpload(type)       (Update front media type)      │   │
│  │  ├─ setBackMediaToUpload(type)        (Update back media type)       │   │
│  │  ├─ SlideshowOutlineChanged(outline)  (Toggle outline border)        │   │
│  │  └─ applystyleflashcard()             (Apply style variant)          │   │
│  │                                                                        │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                                │
└──────────────────────────────────────────┬────────────────────────────────────┘
                                           │
                                           │ Updates
                                           │
┌──────────────────────────────────────────▼────────────────────────────────────┐
│                               DATA MODEL LAYER                                 │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌──────────────────────────────────────────────────────────────────────┐    │
│  │  fieldData (Scope)                                                    │    │
│  │  ─────────────────                                                    │    │
│  │  {                                                                    │    │
│  │    identifier: "flashcard",                                           │    │
│  │    introductionText: "",                                              │    │
│  │    instructionText: "",                                               │    │
│  │    slides: [                                                          │    │
│  │      {                                                                │    │
│  │        isBackCardActive: false,                                       │    │
│  │        frontCard: { cardType, cardText, mediaToUpload, settings... },│    │
│  │        backCard: { cardType, cardText, mediaToUpload, settings... }  │    │
│  │      },                                                               │    │
│  │      ...                                                              │    │
│  │    ],                                                                 │    │
│  │    settings: {                                                        │    │
│  │      isHeaderVisible,                                                 │    │
│  │      isInstructionVisible,                                            │    │
│  │      flashCardStyleType,                                              │    │
│  │      Appearance,                                                      │    │
│  │      cardColour,                                                      │    │
│  │      ...                                                              │    │
│  │    }                                                                  │    │
│  │  }                                                                    │    │
│  └──────────────────────────────────────────────────────────────────────┘    │
│                                                                                 │
│  ┌──────────────────────────────────────────────────────────────────────┐    │
│  │  Default Data Source: default/flashcard.json                          │    │
│  └──────────────────────────────────────────────────────────────────────┘    │
│                                                                                 │
└────────────────────────────────────────┬────────────────────────────────────────┘
                                         │
                                         │ Loads from / Saves to
                                         │
┌────────────────────────────────────────▼─────────────────────────────────────┐
│                            PERSISTENCE LAYER                                  │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌─────────────────────────┐     ┌──────────────────────────────────────┐  │
│  │  Editor Storage         │     │  Package/Offline Storage             │  │
│  │  ──────────────          │     │  ───────────────────────              │  │
│  │  • savedJson object     │     │  • JSON file (flashcard.json)        │  │
│  │  • Page/Template index  │     │  • Media assets (images/audio/video) │  │
│  │  • Auto-save            │     │  • CSS (flashcard-template.css)      │  │
│  │                         │     │  • JS (flashcard-template-preview1)  │  │
│  └─────────────────────────┘     └──────────────────────────────────────┘  │
│                                                                               │
└───────────────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────────────────┐
│                         EXTERNAL DEPENDENCIES                                 │
├───────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│  • AngularJS (v1.x)         - Core framework                                  │
│  • jQuery                   - DOM manipulation & events                        │
│  • bxSlider                 - Carousel/slider functionality                    │
│  • audiojs                  - Audio player                                     │
│  • Video.js                 - Video player                                     │
│  • Bootstrap                - UI components                                    │
│  • iCheck                   - Custom checkboxes/radios                         │
│                                                                                │
└────────────────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────────────────┐
│                            INTERACTION FLOW                                    │
├───────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│  EDITOR MODE:                                                                  │
│  User Action → Settings Panel → Angular Controller → Data Model               │
│                     ↓                                                          │
│               Angular Binding                                                  │
│                     ↓                                                          │
│              View Update (HTML)                                                │
│                     ↓                                                          │
│            Save to savedJson                                                   │
│                                                                                │
│  PREVIEW/READER MODE:                                                          │
│  Load JSON → Parse Data → Render Cards → Initialize bxSlider                  │
│                                    ↓                                           │
│                          User Interaction                                      │
│                         (Click, Navigate)                                      │
│                                    ↓                                           │
│                         jQuery Event Handler                                   │
│                    (flashcard-template-preview1.js)                            │
│                                    ↓                                           │
│                         DOM Manipulation                                       │
│                      (Flip card, Change slide)                                 │
│                                    ↓                                           │
│                         Stop Media Playback                                    │
│                                                                                │
└────────────────────────────────────────────────────────────────────────────────┘
```

---

## Additional Technical Details

### Browser Support
- **Recommended**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Minimum**: Chrome 60+, Firefox 60+, Safari 12+, Edge 79+
- **Mobile**: iOS Safari 12+, Chrome for Android 60+

### Performance Considerations
- **Max Cards**: 20 (enforced for performance)
- **Image Size**: Recommended max 2MB per image
- **Video Size**: Recommended max 50MB per video  
- **Audio Size**: Recommended max 10MB per audio file

### Security Considerations
- Content is rendered with Angular's sanitization
- YouTube embeds use iframe sandbox
- Uploaded media should be virus-scanned server-side
- XSS protection via Angular's `ng-bind` and `ng-sanitize`

---

## Conclusion

The Flashcard component is a feature-rich, interactive learning template with comprehensive support for multiple media types and customization options. While it successfully achieves its core purpose, there are opportunities for improvement in error handling, accessibility, performance optimization, and code maintainability.

The component's architecture follows AngularJS directive patterns with jQuery for DOM manipulation and external libraries for slider and media playback functionality. The two style variants provide flexibility in presentation, and the flip card interaction creates an engaging learning experience.

**Key Strengths**:
- Versatile media support (text, image, audio, video)
- Intuitive card flipping interaction
- Configurable appearance and behavior
- Integration with authoring environment

**Areas for Improvement**:
- Enhanced error handling and validation
- Better accessibility support
- Memory leak prevention
- Code refactoring for maintainability
- Comprehensive testing coverage

This documentation serves as a complete technical reference for developers working with or maintaining the Flashcard component.

