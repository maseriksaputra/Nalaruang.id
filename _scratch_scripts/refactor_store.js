const fs = require('fs');
const file = 'resources/js/Builder/stores/useCanvasStore.js';
let content = fs.readFileSync(file, 'utf8');

const helper = `
const findElement = (sections, id) => {
    for (const section of sections) {
        const group = section.layers.find(l => l.id === id);
        if (group) return group;
        for (const g of section.layers) {
            if (g.children) {
                const child = g.children.find(c => c.id === id);
                if (child) return child;
            }
        }
    }
    return null;
};

const useCanvasStore = create((set, get) => ({`;
content = content.replace('const useCanvasStore = create((set, get) => ({', helper);

content = content.replace(/addLayer:\s*\([\s\S]*?get\(\)\.triggerAutoSave\(\);\s*\},/, `addLayer: (layerObj) => {
        set(produce((state) => {
            const section = state.sections.find(s => s.id === state.activeSectionId) || state.sections[0];
            if (section) {
                if (layerObj.type === 'group') {
                    const newGroup = {
                        id: layerObj.id || 'layer_' + Date.now(),
                        type: 'group',
                        name: layerObj.name || 'Layer Baru',
                        children: [],
                        isHidden: false,
                        isLocked: false,
                        style: { zIndex: section.layers.length + 1 }
                    };
                    section.layers.push(newGroup);
                    state.activeLayerId = newGroup.id;
                } else {
                    let activeGroup = section.layers.find(l => l.id === state.activeLayerId);
                    if (!activeGroup) {
                        activeGroup = section.layers.find(g => g.children?.some(c => c.id === state.activeLayerId));
                    }
                    if (!activeGroup) {
                        if (section.layers.length === 0) {
                            section.layers.push({ id: 'layer_' + Date.now(), type: 'group', name: 'Layer 1', children: [], style: { zIndex: 1 } });
                        }
                        activeGroup = section.layers[section.layers.length - 1];
                    }
                    
                    const newLayer = {
                        ...layerObj,
                        id: layerObj.id || 'elem_' + Date.now(),
                        style: { 
                            x: 50, y: 50, width: 200, height: layerObj.type === 'text' ? 50 : 200, 
                            zIndex: activeGroup.children.length + 1, color: '#000000', fontSize: '24px', 
                            ...layerObj.style 
                        },
                        animation: layerObj.animation || null
                    };
                    activeGroup.children.push(newLayer);
                    state.activeLayerId = newLayer.id;
                }
            }
        }));
        get().triggerAutoSave();
    },`);

const updateMethods = ['alignLayer', 'updateLayerPosition', 'updateLayerSize', 'updateLayerStyle', 'updateLayerContent', 'updateLayerAnimation', 'toggleLayerVisibility'];

updateMethods.forEach(method => {
    const regex = new RegExp(`(?<=\n {4}${method}: \\([\\s\\S]*?get\\(\\)\\.triggerAutoSave\\(\\);\\s*\\},)`);
    // Wait, regex lookbehind can be tricky. Let's just find the block by string matching.
});

// A better way to replace the find inside update functions:
content = content.replace(/state\.sections\.forEach\(section => \{\s*const layer = section\.layers\.find\(l => l\.id === layerId\);\s*if \(layer\) \{ (.*?); \}\s*\}\);/g, (match, inner) => {
    return `const layer = findElement(state.sections, layerId);\n                if (layer) { ${inner}; }`;
});
// Need to handle multi-line block replacements too.
// Let's just do it cleanly with multi_replace_file_content instead of script.
