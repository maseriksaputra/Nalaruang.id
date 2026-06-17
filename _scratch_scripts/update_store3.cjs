const fs = require('fs');
const file = 'resources/js/Builder/stores/useCanvasStore.js';
let content = fs.readFileSync(file, 'utf8');

// Using regex to replace the four functions
content = content.replace(/moveLayerUp:\s*\([^)]*\)\s*=>\s*\{[\s\S]*?get\(\)\.triggerAutoSave\(\);\s*\},/, `moveLayerUp: (layerId) => {
        set(produce((state) => {
            const section = state.sections.find(s => s.id === state.activeSectionId);
            if (!section) return;
            // Check groups
            let index = section.layers.findIndex(l => l.id === layerId);
            if (index !== -1 && index < section.layers.length - 1) {
                const temp = section.layers[index];
                section.layers[index] = section.layers[index + 1];
                section.layers[index + 1] = temp;
                return;
            }
            // Check children
            for (let g of section.layers) {
                if (g.children) {
                    let cIndex = g.children.findIndex(c => c.id === layerId);
                    if (cIndex !== -1 && cIndex < g.children.length - 1) {
                        const temp = g.children[cIndex];
                        g.children[cIndex] = g.children[cIndex + 1];
                        g.children[cIndex + 1] = temp;
                        g.children.forEach((child, i) => { child.style.zIndex = i + 1; });
                        return;
                    }
                }
            }
        }));
        get().triggerAutoSave();
    },`);

content = content.replace(/moveLayerDown:\s*\([^)]*\)\s*=>\s*\{[\s\S]*?get\(\)\.triggerAutoSave\(\);\s*\},/, `moveLayerDown: (layerId) => {
        set(produce((state) => {
            const section = state.sections.find(s => s.id === state.activeSectionId);
            if (!section) return;
            // Check groups
            let index = section.layers.findIndex(l => l.id === layerId);
            if (index > 0) {
                const temp = section.layers[index];
                section.layers[index] = section.layers[index - 1];
                section.layers[index - 1] = temp;
                return;
            }
            // Check children
            for (let g of section.layers) {
                if (g.children) {
                    let cIndex = g.children.findIndex(c => c.id === layerId);
                    if (cIndex > 0) {
                        const temp = g.children[cIndex];
                        g.children[cIndex] = g.children[cIndex - 1];
                        g.children[cIndex - 1] = temp;
                        g.children.forEach((child, i) => { child.style.zIndex = i + 1; });
                        return;
                    }
                }
            }
        }));
        get().triggerAutoSave();
    },`);

content = content.replace(/moveLayerToFront:\s*\([^)]*\)\s*=>\s*\{[\s\S]*?get\(\)\.triggerAutoSave\(\);\s*\},/, `moveLayerToFront: (layerId) => {
        set(produce((state) => {
            const section = state.sections.find(s => s.id === state.activeSectionId);
            if (!section) return;
            // Check groups
            let index = section.layers.findIndex(l => l.id === layerId);
            if (index !== -1 && index < section.layers.length - 1) {
                const layer = section.layers.splice(index, 1)[0];
                section.layers.push(layer);
                return;
            }
            // Check children
            for (let g of section.layers) {
                if (g.children) {
                    let cIndex = g.children.findIndex(c => c.id === layerId);
                    if (cIndex !== -1 && cIndex < g.children.length - 1) {
                        const [layer] = g.children.splice(cIndex, 1);
                        g.children.push(layer);
                        g.children.forEach((child, i) => { child.style.zIndex = i + 1; });
                        return;
                    }
                }
            }
        }));
        get().triggerAutoSave();
    },`);

content = content.replace(/moveLayerToBack:\s*\([^)]*\)\s*=>\s*\{[\s\S]*?get\(\)\.triggerAutoSave\(\);\s*\},/, `moveLayerToBack: (layerId) => {
        set(produce((state) => {
            const section = state.sections.find(s => s.id === state.activeSectionId);
            if (!section) return;
            // Check groups
            let index = section.layers.findIndex(l => l.id === layerId);
            if (index > 0) {
                const layer = section.layers.splice(index, 1)[0];
                section.layers.unshift(layer);
                return;
            }
            // Check children
            for (let g of section.layers) {
                if (g.children) {
                    let cIndex = g.children.findIndex(c => c.id === layerId);
                    if (cIndex > 0) {
                        const [layer] = g.children.splice(cIndex, 1);
                        g.children.unshift(layer);
                        g.children.forEach((child, i) => { child.style.zIndex = i + 1; });
                        return;
                    }
                }
            }
        }));
        get().triggerAutoSave();
    },`);

fs.writeFileSync(file, content);
