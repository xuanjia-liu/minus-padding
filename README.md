# PaddingPro – Negative Padding Tool

## 🚀 Latest Updates Summary

**🔄 Element-Specific Variables**: Each element now gets its own unique variables (e.g., `NegativePadding_MyButton_Top`) for complete independence.

**🛠️ Detach Variables Control**: New manual button to instantly remove all variables while preserving negative padding appearance.

**⚡ Auto-Detach System**: Optional toggle to automatically clean up variables after any padding adjustment.

**🧹 Smart Variable Management**: Automatic cleanup of unused variables with readable naming and safe operations.

**🎨 Enhanced UI**: Modern icons, better spacing, and dedicated variable management section.

---

**Tagline:**
Effortlessly set negative padding and expand elements in Figma with real-time controls and advanced variable management.

**Category:**
Layout & Spacing

**Description:**
- Set negative padding values in auto-layout elements with element-specific variables
- Expand any element (frames, shapes, groups, sections, etc.) while keeping content in place
- Maintain content position during resizing and expansion
- Real-time updates and intuitive slider controls
- Advanced variable management with auto-cleanup functionality
- Element-specific variable system for independent control
- Copy/paste padding values between elements
- Save and recall padding presets for quick reuse

## 🔧 Core Functionality

**Auto-Layout Elements** (Frames, Components, Instances with auto-layout): 
- Adjust padding values (including negative values using element-specific variables)
- Real-time visual feedback and slider controls
- Each element gets its own unique variables for independent control
- Automatic variable cleanup and management

**Element Expansion Mode** (All other elements including Sections):
- Expand element dimensions while keeping content in place
- Children maintain their relative positions to the original element
- Perfect for creating breathing room around existing content
- Supports: Sections (always use expansion), Rectangles, Ellipses, Polygons, Stars, Vectors, Text, Groups, Component Sets, and more

**Supported Element Types:**
- 🔲 Frames & Components (padding mode when auto-layout enabled)
- 📦 Sections (always expansion mode) & Groups  
- 🔺 Basic Shapes (Rectangle, Ellipse, Polygon, Star, Vector)
- 📝 Text Elements
- 🧩 Component Sets & Instances

## ✨ New Advanced Features

### 1. **Element-Specific Variable System**
- **Independent Variables**: Each element gets its own unique variables (e.g., `NegativePadding_MyButton_Top`)
- **Smart Naming**: Uses element names or clean IDs for readable variable names
- **No Interference**: Changing one element's padding doesn't affect others
- **Clean Organization**: Variables are clearly identified by element in the "Negative Padding" collection

### 2. **Detach Variables Control**
- **Manual Detach Button**: One-click removal of all variables for selected elements
- **Preserves Visual Effect**: Negative padding appearance is maintained after detaching
- **Smart Visibility**: Button only appears when auto-layout elements are selected
- **Batch Processing**: Works with multiple selected elements simultaneously
- **Detailed Feedback**: Shows exactly how many variables were detached from how many elements

### 3. **Auto-Detach System**
- **Automatic Cleanup**: Optional auto-detach after any padding adjustment
- **Immediate Action**: Triggers after slider movements or input changes
- **Persistent Setting**: Your preference is saved across sessions
- **Toggle Control**: Enable/disable with inline checkbox
- **Visual Preservation**: Maintains negative padding effects even when variables are removed

### 4. **Enhanced Variable Management**
- **Automatic Cleanup**: Unused variables are automatically removed
- **Safe Operations**: Only removes variables that are genuinely unused
- **Performance Optimized**: Prevents variable bloat in your Figma files
- **Element Tracking**: Variables are properly associated with their owning elements

## 🔧 Functional Improvements

### 5. Copy/Paste System
- **Copy padding values**: Extract padding from selected elements
- **Paste to multiple elements**: Apply copied padding to multiple selected frames
- **Smart clipboard**: Button states update based on available clipboard data
- **Cross-element compatibility**: Works with frames, components, and instances

### 6. Padding Presets System
- **Save current values**: One-click saving of current padding configuration
- **Quick access grid**: Visual grid of saved presets for instant loading
- **Preset management**: Delete presets with hover-to-reveal delete buttons
- **Persistent storage**: Presets saved in localStorage, persists across sessions
- **Smart naming**: Automatic naming format (top/right/bottom/left)
- **Limit management**: Keeps only the 6 most recent presets

## 🛠 Technical Enhancements

### 7. Improved Error Handling
- **Robust validation**: Better input sanitization and error recovery
- **Graceful degradation**: Plugin continues working even if some operations fail
- **User-friendly messages**: Clear error messages instead of silent failures

### 8. Performance Optimizations
- **Efficient variable management**: Smarter variable creation and reuse
- **Element-specific isolation**: Variables don't interfere across elements
- **Optimized UI updates**: Reduced unnecessary DOM manipulations
- **Better memory management**: Proper cleanup of event listeners and DOM elements

### 9. Enhanced Selection Handling
- **Multi-selection support**: Apply padding to multiple elements simultaneously
- **Selection count display**: Shows number of selected elements in title
- **Smart messaging**: Different messages for no selection vs. invalid selection
- **Element-specific processing**: Each element handled independently

## 🚀 New Features Overview

- **Element-Specific Variables**: Independent variable system for each element
- **Detach Variables Button**: Manual control over variable cleanup with visual preservation
- **Auto-Detach Toggle**: Automatic variable cleanup after adjustments
- **Smart Variable Naming**: Readable variable names based on element names
- **Advanced Cleanup**: Automatic removal of unused variables
- **Visual Padding Indicators**: Real-time visual representation of padding values
- **Keyboard Shortcuts**: Power-user functionality for faster workflow
- **Copy/Paste System**: Transfer padding between elements effortlessly
- **Preset System**: Save and recall commonly used padding configurations
- **Toast Notifications**: Better user feedback for all operations
- **Enhanced Input Validation**: More robust and user-friendly input handling

## 📱 UI Layout Improvements

- **Expanded height**: Increased plugin height to accommodate new features
- **Detach Controls**: Dedicated section for variable management
- **Auto-Detach Toggle**: Inline checkbox with persistent settings
- **Better spacing**: Improved visual hierarchy and spacing
- **Organized sections**: Clear separation between controls, presets, and utilities
- **Responsive design**: Adapts to different content sizes gracefully
- **Modern Icons**: Clean, intuitive icons for better user experience

## 🔄 User Experience Flow

1. **Select elements** → Plugin detects auto-layout frames and shows appropriate controls
2. **Adjust padding** → Visual feedback shows changes immediately with element-specific variables
3. **Auto-cleanup** → Variables automatically managed based on your preferences
4. **Manual control** → Use "Detach Variables" button for precise control
5. **Save presets** → Store current configuration for future use
6. **Copy/paste** → Transfer padding between different elements
7. **Cleanup optimization** → Remove unused variables to keep file optimized

## 🎯 Variable Management Modes

### **Auto-Detach Enabled** ✅
- Variables are automatically cleaned up after any adjustment
- Maintains visual appearance while keeping files clean
- Best for users who want maximum file cleanliness

### **Auto-Detach Disabled** ❌
- Variables persist for continued negative padding adjustments
- Manual control via "Detach Variables" button
- Best for users working extensively with negative padding systems

## 🔧 Advanced Usage

**Element Independence**: Each element maintains its own variables, so you can have:
- Button A with -10px top padding
- Button B with -20px top padding  
- Frame C with -5px all-around padding
- All completely independent of each other

**Variable Cleanup**: The plugin intelligently manages variables:
- Creates element-specific variables only when needed
- Automatically removes unused variables
- Preserves visual effects when detaching
- Keeps your Figma file organized and performant

The plugin now provides a comprehensive and professional experience for negative padding management while maintaining simplicity and performance. All improvements are backward-compatible and enhance existing workflows without breaking any current functionality.