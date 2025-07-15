/**
 * @file gallerySelector.js - URL-based example selection system for gallery
 * Separated from core codebase - handles ?example= parameter routing
 */

/**
 * Available examples mapping
 */
const AVAILABLE_EXAMPLES = {
    'basic-reflection': {
        name: 'Basic Reflection',
        description: 'Simple layout with triangle, square, trapezoid and a vertical mirror'
    },
    'diagonal-reflection': {
        name: 'Diagonal Reflection', 
        description: 'Objects reflecting off a diagonal mirror'
    },
    'mirror-box': {
        name: 'Mirror Box',
        description: 'Multiple mirrors creating infinite reflections'
    },
    'triangular-box': {
        name: 'Triangular Box',
        description: 'Triangular mirror setup with complex reflections'
    }
};

/**
 * Gets the example name from URL parameters
 * @returns {string} Example name or default
 */
export function getExampleFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const example = urlParams.get('example');
    
    // Validate example exists
    if (example && AVAILABLE_EXAMPLES[example]) {
        return example;
    }
    
    // Default to basic-reflection
    return 'basic-reflection';
}

/**
 * Gets example metadata
 * @param {string} exampleName - The example identifier
 * @returns {Object} Example metadata
 */
export function getExampleInfo(exampleName) {
    return AVAILABLE_EXAMPLES[exampleName] || AVAILABLE_EXAMPLES['basic-reflection'];
}

/**
 * Gets all available examples for navigation
 * @returns {Object} All available examples
 */
export function getAllExamples() {
    return AVAILABLE_EXAMPLES;
}

/**
 * Updates the page title based on current example
 * @param {string} exampleName - The example identifier
 */
export function updatePageTitle(exampleName) {
    const info = getExampleInfo(exampleName);
    document.title = `${info.name} - Mirror Reflection Sandbox`;
}

/**
 * Creates navigation links for all examples
 * @returns {string} HTML string with navigation links
 */
export function createExampleNavigation() {
    const currentExample = getExampleFromURL();
    const examples = getAllExamples();
    
    let nav = '<div style="display: flex; flex-direction: column; gap: 8px;">';
    
    Object.entries(examples).forEach(([key, info]) => {
        const isActive = key === currentExample;
        const baseStyle = `
            display: block;
            padding: 10px 12px;
            border-radius: 8px;
            text-decoration: none;
            font-size: 13px;
            font-weight: 500;
            transition: all 0.2s ease;
            border: 1px solid;
            text-align: left;
        `;
        
        const style = isActive ? 
            baseStyle + `
                background: #333;
                color: white;
                border-color: #333;
                transform: translateX(2px);
            ` :
            baseStyle + `
                background: #f8fafc;
                color: #374151;
                border-color: #e1e5e9;
            `;
        
        nav += `<a href="?example=${key}" style="${style}" title="${info.description}">${info.name}</a>`;
    });
    
    nav += '</div>';
    return nav;
}
