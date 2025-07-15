/**
 * @file galleryMain.js - Main entry point for the examples gallery
 * Uses URL parameters to dynamically load different examples
 */

import { generalConfig } from '../config/generalConfig.js';
import { modeConfig } from '../config/modeConfig.js';
import { loadSceneAndCreateSimulation } from '../utils/simpleLoader.js';
import { 
    getExampleFromURL, 
    updatePageTitle, 
    createExampleNavigation,
    getExampleInfo 
} from './gallerySelector.js';

/**
 * Initialize the application with example selection
 */
function initializeApp() {
    // Get current example from URL
    const currentExample = getExampleFromURL();
    
    // Update page title
    updatePageTitle(currentExample);
    
    // Add navigation to the page (only once)
    if (!document.querySelector('.gallery-sidebar')) {
        addNavigationToPage(currentExample);
    } else {
        updateNavigationContent(currentExample);
    }
    
    // Setup canvas (preserve existing canvas)
    let svgCanvas = document.getElementById('mirror-canvas');
    if (!svgCanvas) {
        svgCanvas = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgCanvas.id = 'mirror-canvas';
        svgCanvas.setAttribute('width', generalConfig.canvas.width);
        svgCanvas.setAttribute('height', generalConfig.canvas.height);
        svgCanvas.setAttribute('viewBox', `0 0 ${generalConfig.canvas.width} ${generalConfig.canvas.height}`);
        
        const canvasContainer = document.querySelector('.canvas-container');
        if (canvasContainer) {
            canvasContainer.appendChild(svgCanvas);
        }
    } else {
        // Clear existing content but keep the canvas element
        svgCanvas.innerHTML = '';
    }

    // Load and initialize simulation with selected example
    window.currentSimulation = loadSceneAndCreateSimulation({ 
        sceneName: currentExample, 
        modeConfigs: modeConfig, 
        svgCanvas 
    });

    window.currentSimulation.init();
    
    // Update controls sidebar
    updateControlsSidebar();
}

/**
 * Adds navigation and example info to the page
 * @param {string} currentExample - Current example name
 */
function addNavigationToPage(currentExample) {
    const app = document.getElementById('app');
    const info = getExampleInfo(currentExample);
    
    // Create main container with three-column layout
    const mainContainer = document.createElement('div');
    mainContainer.style.cssText = `
        display: flex;
        gap: 24px;
        align-items: flex-start;
    `;
    
    // Create left sidebar (examples)
    const leftSidebar = document.createElement('div');
    leftSidebar.className = 'gallery-sidebar';
    leftSidebar.style.cssText = `
        width: 240px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        border: 1px solid #e1e5e9;
        overflow: hidden;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    
    // Create canvas container with fixed dimensions
    const canvasContainer = document.createElement('div');
    canvasContainer.className = 'canvas-container';
    canvasContainer.style.cssText = `
        width: 800px;
        height: 800px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
        border-radius: 12px;
        background: #ffffff;
        border: 1px solid #e1e5e9;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
    `;
    
    // Create right sidebar (controls)
    const rightSidebar = document.createElement('div');
    rightSidebar.className = 'controls-sidebar';
    rightSidebar.style.cssText = `
        width: 240px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        border: 1px solid #e1e5e9;
        overflow: hidden;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    
    // Update sidebar content
    updateSidebarContent(leftSidebar, currentExample);
    createControlsSidebar(rightSidebar);
    
    // Assemble main container
    mainContainer.appendChild(leftSidebar);
    mainContainer.appendChild(canvasContainer);
    mainContainer.appendChild(rightSidebar);
    
    // Replace the app content
    app.innerHTML = '';
    app.appendChild(mainContainer);
}

/**
 * Updates sidebar content without recreating the entire layout
 * @param {HTMLElement} sidebar - Sidebar element
 * @param {string} currentExample - Current example name
 */
function updateSidebarContent(sidebar, currentExample) {
    const info = getExampleInfo(currentExample);
    
    // Sidebar header
    const sidebarHeader = document.createElement('div');
    sidebarHeader.style.cssText = `
        padding: 20px;
        border-bottom: 1px solid #e1e5e9;
        background: #f8fafc;
    `;
    sidebarHeader.innerHTML = `
        <div style="font-size: 16px; font-weight: 600; color: #1a1a1a; margin: 0 0 4px 0;">
            Mirror Reflection
        </div>
        <div style="font-size: 14px; color: #6b7280; margin: 0;">
            Sandbox
        </div>
    `;
    
    // Current example section
    const currentSection = document.createElement('div');
    currentSection.style.cssText = `
        padding: 16px 20px;
        border-bottom: 1px solid #e1e5e9;
    `;
    currentSection.innerHTML = `
        <div style="font-size: 12px; font-weight: 500; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 8px 0;">
            Current Example
        </div>
        <div style="font-size: 14px; font-weight: 500; color: #1a1a1a; margin: 0 0 4px 0;">
            ${info.name}
        </div>
        <div style="font-size: 12px; color: #6b7280; line-height: 1.4;">
            ${info.description}
        </div>
    `;
    
    // Navigation section
    const navSection = document.createElement('div');
    navSection.style.cssText = `
        padding: 16px 20px;
    `;
    navSection.innerHTML = `
        <div style="font-size: 12px; font-weight: 500; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 12px 0;">
            All Examples
        </div>
        ${createExampleNavigation()}
    `;
    
    // Clear and rebuild sidebar
    sidebar.innerHTML = '';
    sidebar.appendChild(sidebarHeader);
    sidebar.appendChild(currentSection);
    sidebar.appendChild(navSection);
}

/**
 * Updates navigation content when example changes
 * @param {string} currentExample - Current example name
 */
function updateNavigationContent(currentExample) {
    const sidebar = document.querySelector('.gallery-sidebar');
    if (sidebar) {
        updateSidebarContent(sidebar, currentExample);
    }
}

/**
 * Creates the controls sidebar with interactive settings
 * @param {HTMLElement} sidebar - Sidebar element
 */
function createControlsSidebar(sidebar) {
    // Get current mode config
    const currentMode = 'generalReflections'; // This could be dynamic based on scene
    const config = modeConfig[currentMode];
    
    // Header
    const header = document.createElement('div');
    header.style.cssText = `
        padding: 20px;
        border-bottom: 1px solid #e1e5e9;
        background: #f8fafc;
    `;
    header.innerHTML = `
        <div style="font-size: 16px; font-weight: 600; color: #1a1a1a; margin: 0 0 4px 0;">
            Simulation Controls
        </div>
        <div style="font-size: 14px; color: #6b7280; margin: 0;">
            Interactive Settings
        </div>
    `;
    
    // Interaction controls
    const interactionSection = createControlSection(
        'Interaction',
        [
            { key: 'draggablePolygons', label: 'Drag Polygons', value: config.interaction.draggablePolygons },
            { key: 'draggableMirrors', label: 'Drag Mirrors', value: config.interaction.draggableMirrors },
            { key: 'draggableViewers', label: 'Drag Viewers', value: config.interaction.draggableViewers }
        ]
    );
    
    // Reflection controls
    const reflectionSection = createControlSection(
        'Reflections',
        [
            { key: 'reflectionsEnabled', label: 'Enable Reflections', value: config.reflections.enabled },
            { 
                key: 'reflectionDepth', 
                label: 'Reflection Depth', 
                value: config.reflections.recursiveReflectionDepth,
                type: 'range',
                min: 0,
                max: 4
            }
        ]
    );
    
    // Light beam controls
    const lightBeamSection = createControlSection(
        'Light Beams',
        [
            { key: 'lightBeamEnabled', label: 'Project Light Beams', value: config.lightBeamProjector.enabled }
        ]
    );
    
    // Assemble sidebar
    sidebar.innerHTML = '';
    sidebar.appendChild(header);
    sidebar.appendChild(interactionSection);
    sidebar.appendChild(reflectionSection);
    sidebar.appendChild(lightBeamSection);
}

/**
 * Creates a control section with multiple controls
 * @param {string} title - Section title
 * @param {Array} controls - Array of control configurations
 * @returns {HTMLElement} Section element
 */
function createControlSection(title, controls) {
    const section = document.createElement('div');
    section.style.cssText = `
        padding: 16px 20px;
        border-bottom: 1px solid #e1e5e9;
    `;
    
    const titleDiv = document.createElement('div');
    titleDiv.style.cssText = `
        font-size: 12px;
        font-weight: 500;
        color: #6b7280;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin: 0 0 12px 0;
    `;
    titleDiv.textContent = title;
    section.appendChild(titleDiv);
    
    controls.forEach(control => {
        const controlDiv = document.createElement('div');
        controlDiv.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 10px;
        `;
        
        const label = document.createElement('label');
        label.style.cssText = `
            font-size: 13px;
            color: #374151;
            cursor: pointer;
        `;
        label.textContent = control.label;
        
        let input;
        if (control.type === 'range') {
            input = document.createElement('input');
            input.type = 'range';
            input.min = control.min;
            input.max = control.max;
            input.value = control.value;
            input.style.cssText = `
                width: 80px;
                accent-color: #333;
            `;
            
            const valueDisplay = document.createElement('span');
            valueDisplay.style.cssText = `
                font-size: 12px;
                color: #6b7280;
                margin-left: 8px;
                min-width: 20px;
            `;
            valueDisplay.textContent = control.value;
            
            input.addEventListener('input', (e) => {
                valueDisplay.textContent = e.target.value;
                updateSimulationConfig(control.key, parseInt(e.target.value));
            });
            
            const rangeContainer = document.createElement('div');
            rangeContainer.style.cssText = 'display: flex; align-items: center;';
            rangeContainer.appendChild(input);
            rangeContainer.appendChild(valueDisplay);
            
            controlDiv.appendChild(label);
            controlDiv.appendChild(rangeContainer);
        } else {
            // Checkbox
            input = document.createElement('input');
            input.type = 'checkbox';
            input.checked = control.value;
            input.style.cssText = `
                accent-color: #333;
                cursor: pointer;
            `;
            
            input.addEventListener('change', (e) => {
                updateSimulationConfig(control.key, e.target.checked);
            });
            
            label.htmlFor = control.key;
            input.id = control.key;
            
            controlDiv.appendChild(label);
            controlDiv.appendChild(input);
        }
        
        section.appendChild(controlDiv);
    });
    
    return section;
}

/**
 * Updates simulation configuration and applies changes
 * @param {string} key - Configuration key
 * @param {any} value - New value
 */
function updateSimulationConfig(key, value) {
    const currentMode = 'generalReflections';
    const config = modeConfig[currentMode];
    
    // Update the configuration based on the key
    switch (key) {
        case 'draggablePolygons':
            config.interaction.draggablePolygons = value;
            break;
        case 'draggableMirrors':
            config.interaction.draggableMirrors = value;
            break;
        case 'draggableViewers':
            config.interaction.draggableViewers = value;
            break;
        case 'reflectionsEnabled':
            config.reflections.enabled = value;
            break;
        case 'reflectionDepth':
            config.reflections.recursiveReflectionDepth = value;
            break;
        case 'lightBeamEnabled':
            config.lightBeamProjector.enabled = value;
            break;
    }
    
    // Reinitialize simulation with new config
    if (window.currentSimulation) {
        const canvas = document.getElementById('mirror-canvas');
        canvas.innerHTML = '';
        
        window.currentSimulation = loadSceneAndCreateSimulation({ 
            sceneName: getExampleFromURL(), 
            modeConfigs: modeConfig, 
            svgCanvas: canvas 
        });
        
        window.currentSimulation.init();
    }
}

/**
 * Updates controls sidebar when example changes
 */
function updateControlsSidebar() {
    const controlsSidebar = document.querySelector('.controls-sidebar');
    if (controlsSidebar) {
        createControlsSidebar(controlsSidebar);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
