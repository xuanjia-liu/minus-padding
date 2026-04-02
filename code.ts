// This plugin allows setting negative padding values for auto-layout frames using variables
// and expanding frame dimensions for regular frames while keeping content positioned
// It provides real-time updates and slider controls for quick adjustments

// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// Show the HTML page
figma.showUI(__html__, { width: 300, height: 300, themeColors: true });

// Keep track of current selection
let currentSelection: readonly SceneNode[] = [];

// Function to check if a node is an element that we can work with
function isWorkableElement(node: SceneNode): node is FrameNode | ComponentNode | InstanceNode | SectionNode | GroupNode | RectangleNode | EllipseNode | PolygonNode | StarNode | VectorNode | TextNode | ComponentSetNode {
  return node.type === 'FRAME' ||
    node.type === 'COMPONENT' ||
    node.type === 'INSTANCE' ||
    node.type === 'SECTION' ||
    node.type === 'GROUP' ||
    node.type === 'RECTANGLE' ||
    node.type === 'ELLIPSE' ||
    node.type === 'POLYGON' ||
    node.type === 'STAR' ||
    node.type === 'VECTOR' ||
    node.type === 'TEXT' ||
    node.type === 'COMPONENT_SET';
}

// Function to check if an element has auto-layout enabled
function hasAutoLayout(element: FrameNode | ComponentNode | InstanceNode | SectionNode): boolean {
  return 'layoutMode' in element && element.layoutMode !== 'NONE';
}

// Utility: Get or create the "Negative Padding" variable collection
async function getOrCreateNegativePaddingCollection() {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  let collection = collections.find(c => c.name === "Negative Padding");
  if (!collection) {
    collection = figma.variables.createVariableCollection("Negative Padding");
  }
  return collection;
}

// Helper to remove the collection if it has no variables left
async function cleanupEmptyCollection() {
  try {
    const collections = await figma.variables.getLocalVariableCollectionsAsync();
    const collection = collections.find(c => c.name === "Negative Padding");
    if (collection && collection.variableIds.length === 0) {
      collection.remove();
    }
  } catch (e) {
    // Collection might already be removed
  }
}

// Utility: Generate a clean element identifier for variable naming
function getElementIdentifier(element: SceneNode): string {
  // Use element name if it's meaningful, otherwise use a short ID
  const cleanName = element.name.replace(/[^a-zA-Z0-9]/g, '').substring(0, 20);
  const shortId = element.id.substring(0, 8);
  return cleanName || shortId;
}

// Utility: Get or create a variable for a given side and specific element
async function getOrCreatePaddingVariable(side: string, element: SceneNode, collection: VariableCollection) {
  const elementId = getElementIdentifier(element);
  const varName = `NegativePadding_${elementId}_${side.charAt(0).toUpperCase() + side.slice(1)}`;
  const variables = await figma.variables.getLocalVariablesAsync("FLOAT");
  let variable = variables.find(v => v.name === varName && v.variableCollectionId === collection.id);
  if (!variable) {
    variable = figma.variables.createVariable(varName, collection, "FLOAT");
    // Set initial value for all modes to 0
    for (const mode of collection.modes) {
      variable.setValueForMode(mode.modeId, 0);
    }
  }
  return variable;
}

// Function to clean up unused variables for a specific element
async function cleanupElementVariables(element: SceneNode) {
  const collection = await getOrCreateNegativePaddingCollection();
  const elementId = getElementIdentifier(element);
  const variables = await figma.variables.getLocalVariablesAsync("FLOAT");

  // Find variables that belong to this element
  const elementVariables = variables.filter(v =>
    v.variableCollectionId === collection.id &&
    v.name.startsWith(`NegativePadding_${elementId}_`)
  );

  // Check which variables are still bound to the element
  const boundVariableIds = new Set();
  if (element.type === 'FRAME' || element.type === 'COMPONENT' || element.type === 'INSTANCE') {
    const frame = element as FrameNode | ComponentNode | InstanceNode;
    if (frame.boundVariables) {
      ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'].forEach(prop => {
        const bound = (frame.boundVariables as any)[prop] as VariableAlias | undefined;
        if (bound && bound.type === "VARIABLE_ALIAS") {
          boundVariableIds.add(bound.id);
        }
      });
    }
  }

  // Remove unused variables
  for (const variable of elementVariables) {
    if (!boundVariableIds.has(variable.id)) {
      try {
        variable.remove();
      } catch (e) {
        // Variable might be in use elsewhere, skip removal
      }
    }
  }

  // Cleanup collection if it's now empty
  await cleanupEmptyCollection();
}

// Function to detach and delete all variables for a specific element
async function detachAndDeleteElementVariables(element: SceneNode): Promise<number> {
  let detachedCount = 0;

  if (element.type === 'FRAME' || element.type === 'COMPONENT' || element.type === 'INSTANCE') {
    const frame = element as FrameNode | ComponentNode | InstanceNode;
    const collection = await getOrCreateNegativePaddingCollection();
    const elementId = getElementIdentifier(element);
    const variables = await figma.variables.getLocalVariablesAsync("FLOAT");

    // Find variables that belong to this element
    const elementVariables = variables.filter(v =>
      v.variableCollectionId === collection.id &&
      v.name.startsWith(`NegativePadding_${elementId}_`)
    );

    // Detach all bound variables while preserving current values
    if (frame.boundVariables) {
      for (const prop of ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft']) {
        const bound = (frame.boundVariables as any)[prop] as VariableAlias | undefined;
        if (bound && bound.type === "VARIABLE_ALIAS") {
          // Check if this variable belongs to this element
          const variable = elementVariables.find(v => v.id === bound.id);
          if (variable) {
            // Get the current resolved value before detaching
            const variableCollection = await figma.variables.getVariableCollectionByIdAsync(variable.variableCollectionId);
            let currentValue = 0;
            if (variableCollection) {
              const modeId = variableCollection.modes[0].modeId;
              const variableValue = variable.valuesByMode[modeId];
              currentValue = typeof variableValue === 'number' ? variableValue : 0;
            }

            // Detach the variable
            (frame as any).setBoundVariable(prop, null);

            // Only set positive values explicitly - let Figma handle negative values preservation
            if (currentValue >= 0) {
              (frame as any)[prop] = currentValue;
            }
            // For negative values, don't set the property - this preserves the visual effect

            detachedCount++;
          }
        }
      }
    }

    // Delete all variables that belonged to this element
    for (const variable of elementVariables) {
      try {
        variable.remove();
      } catch (e) {
        // Variable might be in use elsewhere, skip removal
        console.warn(`Could not remove variable ${variable.name}: ${e}`);
      }
    }

    // Cleanup collection if it's now empty
    await cleanupEmptyCollection();
  }

  return detachedCount;
}

// Function to get current padding values from an auto-layout frame (resolves variable if present)
async function getPaddingValues(frame: FrameNode | ComponentNode | InstanceNode) {
  const result: any = {};
  const sides = ["top", "right", "bottom", "left"];
  for (const side of sides) {
    const prop = `padding${side.charAt(0).toUpperCase() + side.slice(1)}` as keyof typeof frame.boundVariables;
    const bound = frame.boundVariables && (frame.boundVariables[prop] as VariableAlias | undefined);
    if (bound && bound.type === "VARIABLE_ALIAS") {
      const variable = await figma.variables.getVariableByIdAsync(bound.id);
      if (variable) {
        const collection = await figma.variables.getVariableCollectionByIdAsync(variable.variableCollectionId);
        if (collection) {
          const modeId = collection.modes[0].modeId;
          result[side] = variable.valuesByMode[modeId] ?? 0;
          continue;
        }
      }
    }
    // Fallback to direct property
    result[side] = (frame as any)[prop] || 0;
  }
  return result;
}

// Function to get current "expansion" values for regular frames (stored in plugin data)
function getExpansionValues(frame: FrameNode | ComponentNode | InstanceNode) {
  const pluginData = frame.getPluginData('frameExpansion');
  if (pluginData) {
    try {
      return JSON.parse(pluginData);
    } catch (e) {
      // If data is corrupted, return default values
    }
  }
  return { top: 0, right: 0, bottom: 0, left: 0 };
}

// Function to get "stretch" values for any element
function getStretchValues(node: SceneNode) {
  const defaultValues = { top: 0, right: 0, bottom: 0, left: 0 };
  if (!('getPluginData' in node)) {
    return defaultValues;
  }
  const pluginData = node.getPluginData('frameStretch');
  if (pluginData) {
    try {
      return JSON.parse(pluginData);
    } catch (e) {
      return defaultValues;
    }
  }
  return defaultValues;
}


// Function to store expansion values for regular frames
function setExpansionValues(frame: FrameNode | ComponentNode | InstanceNode, values: any) {
  frame.setPluginData('frameExpansion', JSON.stringify(values));
}

// Function to update the UI based on current selection
async function updateUI() {
  const selection = figma.currentPage.selection;
  const workableElements = selection.filter(node => isWorkableElement(node)) as (FrameNode | ComponentNode | InstanceNode | SectionNode | GroupNode | RectangleNode | EllipseNode | PolygonNode | StarNode | VectorNode | TextNode | ComponentSetNode)[];

  if (workableElements.length > 0) {
    // For multiple selections, show the first element's values as reference
    const firstElement = workableElements[0];
    const isAutoLayout = hasAutoLayout(firstElement as any);

    // Check if stretch mode is supported
    const supportsStretch = firstElement.type === 'FRAME' ||
      firstElement.type === 'COMPONENT' ||
      firstElement.type === 'INSTANCE' ||
      firstElement.type === 'COMPONENT_SET' ||
      firstElement.type === 'SECTION' ||
      firstElement.type === 'GROUP';

    let values;
    // Always use expansion for sections, regardless of auto-layout
    if (isAutoLayout && firstElement.type !== 'SECTION') {
      values = await getPaddingValues(firstElement as any);
    } else {
      values = getExpansionValues(firstElement as any);
    }

    figma.ui.postMessage({
      type: 'selection-changed',
      hasWorkableFrame: true,
      supportsStretch: supportsStretch,
      padding: values
    });
  } else {
    figma.ui.postMessage({
      type: 'selection-changed',
      hasWorkableFrame: false
    });
  }
}

// Function to recursively scale children
function scaleChildren(container: ChildrenMixin, scaleX: number, scaleY: number) {
  for (const child of container.children) {
    child.x *= scaleX;
    child.y *= scaleY;

    if ('resize' in child) {
      child.resize(child.width * scaleX, child.height * scaleY);
    } else if ('resizeWithoutConstraints' in child) {
      child.resizeWithoutConstraints(child.width * scaleX, child.height * scaleY);
    }

    if ('children' in child && child.children) {
      scaleChildren(child, scaleX, scaleY);
    }
  }
}

// Function to stretch an element and its children proportionally
async function stretchElement(element: SceneNode, side: string, value: number) {
  // Guard for resizable nodes
  if (!('width' in element && 'height' in element && 'x' in element && 'y' in element && ('resize' in element || 'resizeWithoutConstraints' in element))) {
    return;
  }

  const dataKey = 'frameStretch';
  const stretchData = element.getPluginData(dataKey);
  const currentStretch = stretchData ? JSON.parse(stretchData) : { top: 0, right: 0, bottom: 0, left: 0 };
  const oldValue = currentStretch[side] || 0;
  const delta = value - oldValue;

  if (delta === 0) return;

  currentStretch[side] = value;
  element.setPluginData(dataKey, JSON.stringify(currentStretch));

  const originalWidth = element.width;
  const originalHeight = element.height;
  let newWidth = originalWidth;
  let newHeight = originalHeight;

  switch (side) {
    case 'left':
      element.x -= delta;
      newWidth += delta;
      break;
    case 'right':
      newWidth += delta;
      break;
    case 'top':
      element.y -= delta;
      newHeight += delta;
      break;
    case 'bottom':
      newHeight += delta;
      break;
  }

  newWidth = Math.max(0.01, newWidth);
  newHeight = Math.max(0.01, newHeight);

  const scaleX = newWidth / originalWidth;
  const scaleY = newHeight / originalHeight;

  if ('children' in element && element.children.length > 0) {
    scaleChildren(element, scaleX, scaleY);
  }

  if (element.type === 'TEXT') {
    // For text nodes, we need to load the font before resizing
    if ('fontName' in element) {
      await figma.loadFontAsync(element.fontName as FontName);
    }
    if (element.textAutoResize !== 'NONE') {
      element.textAutoResize = 'NONE';
    }
    element.resize(newWidth, newHeight);
  } else if ('resize' in element) {
    element.resize(newWidth, newHeight);
  } else if ('resizeWithoutConstraints' in element) {
    element.resizeWithoutConstraints(newWidth, newHeight);
  }
}


// Function to expand any element while keeping children in place (for applicable types)
function expandElement(element: FrameNode | ComponentNode | InstanceNode | SectionNode | GroupNode | RectangleNode | EllipseNode | PolygonNode | StarNode | VectorNode | TextNode | ComponentSetNode, side: string, value: number) {
  const currentExpansion = getExpansionValues(element as any);
  const oldValue = currentExpansion[side] || 0;
  const delta = value - oldValue;

  // Update the expansion values
  currentExpansion[side] = value;
  setExpansionValues(element as any, currentExpansion);

  // Apply delta based on side
  let newWidth = element.width;
  let newHeight = element.height;

  switch (side) {
    case 'left':
      element.x -= delta;
      newWidth += delta;
      if ('children' in element && element.children) {
        element.children.forEach(child => {
          child.x += delta;
        });
      }
      break;
    case 'right':
      newWidth += delta;
      break;
    case 'top':
      element.y -= delta;
      newHeight += delta;
      if ('children' in element && element.children) {
        element.children.forEach(child => {
          child.y += delta;
        });
      }
      break;
    case 'bottom':
      newHeight += delta;
      break;
  }

  // Apply new dimensions (clamp to minimum size)
  newWidth = Math.max(0.01, newWidth);
  newHeight = Math.max(0.01, newHeight);

  if ('resize' in element) {
    element.resize(newWidth, newHeight);
  } else if ('resizeWithoutConstraints' in element) {
    element.resizeWithoutConstraints(newWidth, newHeight);
  }
}

// Listen for selection changes
figma.on('selectionchange', () => {
  updateUI();
});

// Handle messages from the UI
figma.ui.onmessage = async (msg: { type: string; side?: string; value?: number, mode?: string, autoDetach?: boolean }) => {
  if (msg.type === 'get-selection') {
    await updateUI();
  }

  if (msg.type === 'get-values-for-mode') {
    const selection = figma.currentPage.selection;
    if (selection.length > 0) {
      const firstElement = selection[0];
      if (isWorkableElement(firstElement)) {
        let values;
        if (msg.mode === 'stretch') {
          values = getStretchValues(firstElement);
        } else {
          values = getExpansionValues(firstElement as any);
        }
        figma.ui.postMessage({ type: 'update-values', padding: values });
      }
    }
  }


  if (msg.type === 'update-padding') {
    const selection = figma.currentPage.selection;
    const workableElements = selection.filter(node => isWorkableElement(node)) as (FrameNode | ComponentNode | InstanceNode | SectionNode | GroupNode | RectangleNode | EllipseNode | PolygonNode | StarNode | VectorNode | TextNode | ComponentSetNode)[];

    if (workableElements.length > 0 && msg.side) {
      const side = msg.side;
      const value = msg.value || 0;
      const mode = msg.mode || 'expand';

      // Apply changes to all selected elements
      for (const element of workableElements) {
        const isAutoLayoutElement = hasAutoLayout(element as any);

        if (mode === 'stretch') {
          await stretchElement(element, side, value);
        } else if (isAutoLayoutElement && element.type !== 'SECTION') {
          // Handle auto-layout elements with padding
          const prop = `padding${side.charAt(0).toUpperCase() + side.slice(1)}`;

          // If value is 0 or above, remove variable binding and set direct value
          if (value >= 0) {
            if ((element as any).boundVariables && ((element as any).boundVariables as any)[prop]) {
              (element as any).setBoundVariable(prop, null);
              // Clean up the variable for this element and side (always when switching to non-negative)
              await cleanupElementVariables(element);
            }
            (element as any)[prop] = value;
          } else {
            // For negative values, use element-specific variable
            const collection = await getOrCreateNegativePaddingCollection();
            if (!collection) continue;

            let variable: Variable | null = null;
            const bound = (element as any).boundVariables && (((element as any).boundVariables as any)[prop] as VariableAlias | undefined);
            if (bound && bound.type === "VARIABLE_ALIAS") {
              variable = await figma.variables.getVariableByIdAsync(bound.id);
            } else {
              variable = await getOrCreatePaddingVariable(side, element, collection);
              if (variable) {
                (element as any).setBoundVariable(prop, variable);
              }
            }

            if (variable) {
              const modeId = collection.modes[0].modeId;
              variable.setValueForMode(modeId, value);
            }
          }

          // Auto-detach: Automatically detach and delete ALL variables after any adjustment
          if (msg.autoDetach) {
            await detachAndDeleteElementVariables(element);
          }
        } else {
          // Handle regular elements with expansion
          expandElement(element, side, value);
        }
      }
    }
  }
};

// Initialize UI on startup
updateUI();
