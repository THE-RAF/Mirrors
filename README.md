# Mirror Reflection Sandbox

An interactive visualization tool for exploring light reflection and mirror physics.

## 🚀 Live Examples

**Public Examples Gallery:** [gallery.html](https://the-raf.github.io/Mirrors/gallery.html)

Individual examples accessible via URL parameters:
- [Basic Reflection](https://the-raf.github.io/Mirrors/gallery.html?example=basic-reflection) - Simple layout with triangle, square, trapezoid and a vertical mirror
- [Diagonal Reflection](https://the-raf.github.io/Mirrors/gallery.html?example=diagonal-reflection) - Objects reflecting off a diagonal mirror  
- [Mirror Box](https://the-raf.github.io/Mirrors/gallery.html?example=mirror-box) - Multiple mirrors creating infinite reflections
- [Triangular Box](https://the-raf.github.io/Mirrors/gallery.html?example=triangular-box) - Triangular mirror setup with complex reflections

## 🛠️ Development

### For Public Users
- **`gallery.html`** - Interactive gallery with sidebar navigation between examples

### For Developers  
- **`index.html`** - Simple development interface
- Change examples by editing `src/config/generalConfig.js`
- Set `currentExample` to: `'basic-reflection'`, `'diagonal-reflection'`, `'mirror-box'`, or `'triangular-box'`
