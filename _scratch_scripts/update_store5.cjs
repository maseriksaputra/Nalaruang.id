const fs = require('fs');
const file = 'resources/js/Builder/stores/useCanvasStore.js';
let content = fs.readFileSync(file, 'utf8');

const newFunctions = `    moveLayerUp: (layerId) => {
        set(produce((state) => {
            const section = state.sections.find(s => s.id === state.activeSectionId);
            if (!section) return;
            
            let gIndex = section.layers.findIndex(l => l.id === layerId);
            if (gIndex !== -1 && gIndex < section.layers.length - 1) {
                const temp = section.layers[gIndex];
                section.layers[gIndex] = section.layers[gIndex + 1];
                section.layers[gIndex + 1] = temp;
                section.layers.forEach((l, i) => { if(!l.style) l.style={}; l.style.zIndex = i + 1; });
                return;
            }
            
            for (let i = 0; i < section.layers.length; i++) {
                let g = section.layers[i];
                if (!g.children) continue;
                let cIndex = g.children.findIndex(c => c.id === layerId);
                if (cIndex !== -1) {
                    if (cIndex < g.children.length - 1) {
                        const temp = g.children[cIndex];
                        g.children[cIndex] = g.children[cIndex + 1];
                        g.children[cIndex + 1] = temp;
                    } else if (i < section.layers.length - 1) {
                        const [child] = g.children.splice(cIndex, 1);
                        section.layers[i + 1].children = section.layers[i + 1].children || [];
                        section.layers[i + 1].children.unshift(child); 
                    }
                    section.layers.forEach((layer) => {
                        if(layer.children) layer.children.forEach((c, idx) => { c.style.zIndex = idx + 1; });
                    });
                    return;
                }
            }
        }));
        get().triggerAutoSave();
    },

    moveLayerDown: (layerId) => {
        set(produce((state) => {
            const section = state.sections.find(s => s.id === state.activeSectionId);
            if (!section) return;
            
            let gIndex = section.layers.findIndex(l => l.id === layerId);
            if (gIndex > 0) {
                const temp = section.layers[gIndex];
                section.layers[gIndex] = section.layers[gIndex - 1];
                section.layers[gIndex - 1] = temp;
                section.layers.forEach((l, i) => { if(!l.style) l.style={}; l.style.zIndex = i + 1; });
                return;
            }
            
            for (let i = 0; i < section.layers.length; i++) {
                let g = section.layers[i];
                if (!g.children) continue;
                let cIndex = g.children.findIndex(c => c.id === layerId);
                if (cIndex !== -1) {
                    if (cIndex > 0) {
                        const temp = g.children[cIndex];
                        g.children[cIndex] = g.children[cIndex - 1];
                        g.children[cIndex - 1] = temp;
                    } else if (i > 0) {
                        const [child] = g.children.splice(cIndex, 1);
                        section.layers[i - 1].children = section.layers[i - 1].children || [];
                        section.layers[i - 1].children.push(child);
                    }
                    section.layers.forEach((layer) => {
                        if(layer.children) layer.children.forEach((c, idx) => { c.style.zIndex = idx + 1; });
                    });
                    return;
                }
            }
        }));
        get().triggerAutoSave();
    },

    moveLayerToFront: (layerId) => {
        set(produce((state) => {
            const section = state.sections.find(s => s.id === state.activeSectionId);
            if (!section) return;
            
            let gIndex = section.layers.findIndex(l => l.id === layerId);
            if (gIndex !== -1 && gIndex < section.layers.length - 1) {
                const layer = section.layers.splice(gIndex, 1)[0];
                section.layers.push(layer);
                section.layers.forEach((l, i) => { if(!l.style) l.style={}; l.style.zIndex = i + 1; });
                return;
            }
            
            for (let i = 0; i < section.layers.length; i++) {
                let g = section.layers[i];
                if (!g.children) continue;
                let cIndex = g.children.findIndex(c => c.id === layerId);
                if (cIndex !== -1) {
                    const [child] = g.children.splice(cIndex, 1);
                    const lastGroup = section.layers[section.layers.length - 1];
                    lastGroup.children = lastGroup.children || [];
                    lastGroup.children.push(child);
                    section.layers.forEach((layer) => {
                        if(layer.children) layer.children.forEach((c, idx) => { c.style.zIndex = idx + 1; });
                    });
                    return;
                }
            }
        }));
        get().triggerAutoSave();
    },

    moveLayerToBack: (layerId) => {
        set(produce((state) => {
            const section = state.sections.find(s => s.id === state.activeSectionId);
            if (!section) return;
            
            let gIndex = section.layers.findIndex(l => l.id === layerId);
            if (gIndex > 0) {
                const layer = section.layers.splice(gIndex, 1)[0];
                section.layers.unshift(layer);
                section.layers.forEach((l, i) => { if(!l.style) l.style={}; l.style.zIndex = i + 1; });
                return;
            }
            
            for (let i = 0; i < section.layers.length; i++) {
                let g = section.layers[i];
                if (!g.children) continue;
                let cIndex = g.children.findIndex(c => c.id === layerId);
                if (cIndex !== -1) {
                    const [child] = g.children.splice(cIndex, 1);
                    const firstGroup = section.layers[0];
                    firstGroup.children = firstGroup.children || [];
                    firstGroup.children.unshift(child);
                    section.layers.forEach((layer) => {
                        if(layer.children) layer.children.forEach((c, idx) => { c.style.zIndex = idx + 1; });
                    });
                    return;
                }
            }
        }));
        get().triggerAutoSave();
    },`;

const startIdx = content.indexOf('moveLayerUp:');
const alignIdx = content.indexOf('alignLayer:');

if (startIdx !== -1 && alignIdx !== -1) {
    const before = content.substring(0, startIdx);
    const after = content.substring(alignIdx);
    fs.writeFileSync(file, before + newFunctions + '\n    ' + after);
} else {
    console.log("Could not find insertion points");
}
