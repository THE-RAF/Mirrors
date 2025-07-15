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
    const simulation = loadSceneAndCreateSimulation({ 
        sceneName: currentExample, 
        modeConfigs: modeConfig, 
        svgCanvas 
    });

    simulation.init();
}

/**
 * Adds navigation and example info to the page
 * @param {string} currentExample - Current example name
 */
function addNavigationToPage(currentExample) {
    const app = document.getElementById('app');
    const info = getExampleInfo(currentExample);
    
    // Create main container with sidebar layout
    const mainContainer = document.createElement('div');
    mainContainer.style.cssText = `
        display: flex;
        gap: 24px;
        align-items: flex-start;
    `;
    
    // Create sidebar
    const sidebar = document.createElement('div');
    sidebar.className = 'gallery-sidebar';
    sidebar.style.cssText = `
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
    
    // Update sidebar content
    updateSidebarContent(sidebar, currentExample);
    
    // Assemble main container
    mainContainer.appendChild(sidebar);
    mainContainer.appendChild(canvasContainer);
    
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

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
