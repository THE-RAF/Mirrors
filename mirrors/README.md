# Mirror Reflection Sandbox

An interactive visualization tool for exploring light reflection and mirror physics.

## 🚀 Live Examples

**Public Examples Gallery:** [gallery.html](https://yourusername.github.io/yourrepo/gallery.html)

Individual examples accessible via URL parameters:
- [Basic Reflection](https://yourusername.github.io/yourrepo/gallery.html?example=basic-reflection) - Simple layout with triangle, square, trapezoid and a vertical mirror
- [Diagonal Reflection](https://yourusername.github.io/yourrepo/gallery.html?example=diagonal-reflection) - Objects reflecting off a diagonal mirror  
- [Mirror Box](https://yourusername.github.io/yourrepo/gallery.html?example=mirror-box) - Multiple mirrors creating infinite reflections
- [Triangular Box](https://yourusername.github.io/yourrepo/gallery.html?example=triangular-box) - Triangular mirror setup with complex reflections

## 🛠️ Development

### For Public Users
- **`gallery.html`** - Interactive gallery with sidebar navigation between examples

### For Developers  
- **`index.html`** - Simple development interface
- Change examples by editing `src/config/generalConfig.js`
- Set `currentExample` to: `'basic-reflection'`, `'diagonal-reflection'`, `'mirror-box'`, or `'triangular-box'`

## 🌐 GitHub Pages Deployment

1. Push to GitHub repository
2. Enable GitHub Pages in repository settings  
3. Set source to main branch
4. **Main landing page:** `https://yourusername.github.io/yourrepo/gallery.html`
5. **Developer access:** `https://yourusername.github.io/yourrepo/index.html`

## 📁 Project Structure

```
mirrors/
├── index.html              # Developer interface (config-based)
├── gallery.html            # Public examples gallery (URL-based)
├── src/
│   ├── main.js            # Original entry point (uses config)
│   ├── gallery/           # Public gallery system
│   │   ├── galleryMain.js     # Gallery entry with URL routing
│   │   └── gallerySelector.js # URL parameter handling
│   ├── config/            # Scene configurations
│   │   ├── generalConfig.js   # Developer config file
│   │   └── scenes/            # Individual scene definitions
│   ├── core/              # Core simulation engine
│   └── utils/             # Utilities and helpers
```

## 🔧 Architecture

- **Modular Design**: Example selection system is completely separated from core codebase
- **URL-Based Routing**: Use `?example=scene-name` to load different scenes
- **Scene-Based Configuration**: Each example is defined as a scene configuration
- **SVG Rendering**: All visualizations rendered to SVG for crisp graphics

## 🌐 Deployment

This project is designed for easy GitHub Pages deployment:

1. Push to GitHub repository
2. Enable GitHub Pages in repository settings
3. Set source to main branch
4. Access via `https://yourusername.github.io/yourrepo/`

## 📝 Adding New Examples

1. Create scene configuration in `src/config/scenes/`
2. Add scene import and mapping in `src/utils/simpleLoader.js`
3. Add example metadata in `src/examples/exampleSelector.js`
