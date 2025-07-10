# LLM Behavior Guidelines: Code Simplicity

## Core Principles
Simple, clean code that's easy to understand and maintain.

## Code Guidelines

### ALWAYS Prioritize:
- **Easy to understand**  
  Code should be self-explanatory

- **Simplicity first**  
  Choose the simplest solution that works
  
- **Minimal boilerplate**  
  Remove unnecessary boilerplate code
  
- **Small files and classes**  
  Keep components focused and manageable
  
- **Destructured parameters**  
  Use `function({ param1, param2 })` instead of `function(param1, param2)` for self-documenting calls  
  Example: `createTriangle({ center: point, size: 3 })` is clearer than `createTriangle(point, 3)`

### AVOID:
- **Large classes**  
  Break into smaller, focused components
  
- **Large files**  
  Split responsibilities across multiple files
  
- **Unnecessary abstractions**  
  Don't over-engineer solutions

## Quality Checklist
- [ ] Code is self-explanatory
- [ ] Minimal necessary boilerplate
- [ ] Files are focused and small
- [ ] Classes have single responsibility
- [ ] Solutions are as simple as possible
