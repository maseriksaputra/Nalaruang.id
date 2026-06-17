const fs = require('fs');
const file = 'resources/js/Builder/stores/useCanvasStore.js';
let content = fs.readFileSync(file, 'utf8');

const oldAlign = `    alignLayer: (layerId, position) => {
        // Implementasi logika align
    },`;

const newAlign = `    moveLayerUp: (layerId) => set(produce(state => {
        const section = state.sections.find(s => s.id === state.activeSectionId);
        if (!section) return;
        for (let g of section.layers) {
            if (g.children) {
                const idx = g.children.findIndex(c => c.id === layerId);
                if (idx !== -1 && idx < g.children.length - 1) {
                    const temp = g.children[idx];
                    g.children[idx] = g.children[idx + 1];
                    g.children[idx + 1] = temp;
                    g.children.forEach((child, i) => { child.style.zIndex = i + 1; });
                    return;
                }
            }
        }
    })),
    moveLayerDown: (layerId) => set(produce(state => {
        const section = state.sections.find(s => s.id === state.activeSectionId);
        if (!section) return;
        for (let g of section.layers) {
            if (g.children) {
                const idx = g.children.findIndex(c => c.id === layerId);
                if (idx > 0) {
                    const temp = g.children[idx];
                    g.children[idx] = g.children[idx - 1];
                    g.children[idx - 1] = temp;
                    g.children.forEach((child, i) => { child.style.zIndex = i + 1; });
                    return;
                }
            }
        }
    })),
    moveLayerToFront: (layerId) => set(produce(state => {
        const section = state.sections.find(s => s.id === state.activeSectionId);
        if (!section) return;
        for (let g of section.layers) {
            if (g.children) {
                const idx = g.children.findIndex(c => c.id === layerId);
                if (idx !== -1 && idx < g.children.length - 1) {
                    const [item] = g.children.splice(idx, 1);
                    g.children.push(item);
                    g.children.forEach((child, i) => { child.style.zIndex = i + 1; });
                    return;
                }
            }
        }
    })),
    moveLayerToBack: (layerId) => set(produce(state => {
        const section = state.sections.find(s => s.id === state.activeSectionId);
        if (!section) return;
        for (let g of section.layers) {
            if (g.children) {
                const idx = g.children.findIndex(c => c.id === layerId);
                if (idx > 0) {
                    const [item] = g.children.splice(idx, 1);
                    g.children.unshift(item);
                    g.children.forEach((child, i) => { child.style.zIndex = i + 1; });
                    return;
                }
            }
        }
    })),
    alignLayer: (layerId, position) => {
        set(produce(state => {
            const section = state.sections.find(s => s.id === state.activeSectionId);
            if (!section) return;
            for (let g of section.layers) {
                if (g.children) {
                    const child = g.children.find(c => c.id === layerId);
                    if (child) {
                        const canvasW = 390;
                        const canvasH = parseInt(section.layout.height || 844);
                        const elW = parseFloat(child.style.width || 100);
                        const elH = parseFloat(child.style.height || 100);
                        
                        if (position === 'center') child.style.x = (canvasW - elW) / 2;
                        if (position === 'middle') child.style.y = (canvasH - elH) / 2;
                        if (position === 'left') child.style.x = 0;
                        if (position === 'right') child.style.x = canvasW - elW;
                        if (position === 'top') child.style.y = 0;
                        if (position === 'bottom') child.style.y = canvasH - elH;
                        return;
                    }
                }
            }
        }));
    },`;

if (content.includes('alignLayer: (layerId, position) => {')) {
    content = content.replace(oldAlign, newAlign);
    fs.writeFileSync(file, content);
}
