# LLM Documentation Guidelines: Balanced Documentation

## Overview
Balanced documentation approach for JavaScript projects requiring clear APIs and team understanding without excessive overhead.

## File Header Template
```javascript
/**
 * @file [FileName].js - [Brief purpose]
 * Main exports: [Key classes/functions]
 */
```

## Class Documentation Template
```javascript
/**
 * @class [ClassName]
 * [One-line description of purpose]
 */
class ClassName {
    /**
     * @param {Object} config
     * @param {type} config.requiredParam - Description
     * @param {type} [config.optionalParam] - Description if non-obvious
     */
    constructor({ requiredParam, optionalParam }) {
        // Group comments only for complex constructors
        this.requiredParam = requiredParam;
        this.optionalParam = optionalParam;
    }
}
```

## Method Documentation Rules

### ALWAYS Document:
- **Public API methods** with parameters
- **Complex business logic**
- **Methods with non-obvious return values**

### Template:
```javascript
/**
 * [What method does - one clear sentence]
 * @param {Object} config
 * @param {type} config.param - Description
 * @returns {type} What is returned
 */
methodName({ param }) { }
```

### SKIP Documentation for:
- **Simple getters/setters**
- **Standard lifecycle methods** (`update`, `render`) unless complex
- **Self-explanatory method names** with obvious implementations

## Inline Comments Rules

### USE for:
- **Complex calculations**: `// Rotate vector by random angle ±30°`
- **Important business rules**: `// Object must stay within determined bounds`
- **Non-obvious magic numbers**: `const EMIT_RATE = 100; // ms between emiisions`

### Property Grouping (Optional):
```javascript
// Only group if constructor has >6 properties
// Position and movement
this.x = x;
this.velocity = 0;
```

## Decision Algorithm

```
FOR each class:
    IF class is exported OR has public methods
        → Add @class with one-line description
    
    FOR each method:
        IF method has parameters OR complex return value
            → Add JSDoc with @param/@returns
        ELSE IF method is >10 lines OR complex logic
            → Add description only
        ELSE
            → Skip documentation

FOR each inline operation:
    IF operation is mathematically complex OR implements business rule
        → Add brief comment explaining purpose
```

## Quality Checklist
- [ ] Public APIs have parameter documentation
- [ ] Complex methods explained
- [ ] No obvious documentation
- [ ] Consistent JSDoc format
