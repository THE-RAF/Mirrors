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
    
    // Add navigation to the page
    addNavigationToPage(currentExample);
    
    // Setup canvas
    const svgCanvas = document.getElementById('mirror-canvas');
    svgCanvas.setAttribute('width', generalConfig.canvas.width);
    svgCanvas.setAttribute('height', generalConfig.canvas.height);

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
    sidebar.style.cssText = `
        width: 240px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        border: 1px solid #e1e5e9;
        overflow: hidden;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    
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
    
    // Assemble sidebar
    sidebar.appendChild(sidebarHeader);
    sidebar.appendChild(currentSection);
    sidebar.appendChild(navSection);
    
    // Get the canvas
    const canvas = document.getElementById('mirror-canvas');
    
    // Assemble main container
    mainContainer.appendChild(sidebar);
    mainContainer.appendChild(canvas);
    
    // Replace the app content
    app.innerHTML = '';
    app.appendChild(mainContainer);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
