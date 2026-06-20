const { produce } = require('immer');

const initialState = {
    activeLayerIds: ['c1', 'c2'],
    global_settings: {
        desktop_layers: [
            { 
                id: 'layer_1', 
                type: 'group', 
                name: 'Layer Baru', 
                children: [
                    { id: 'c1', type: 'image', style: { x: 10, y: 10, width: 100, height: 100 }, name: 'Gambar Asset' },
                    { id: 'c2', type: 'rect', style: { x: 50, y: 50, width: 50, height: 50 }, name: 'square' }
                ] 
            }
        ]
    },
    activeCanvasMode: 'desktop'
};

const newState = produce(initialState, (state) => {
    const targetLayers = state.global_settings.desktop_layers;
    const elementsToGroup = [];
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    let trackToInject = null;
    let injectIndex = -1;

    const extractElements = (layers, parent = null) => {
        for (let i = layers.length - 1; i >= 0; i--) {
            const layer = layers[i];
            if (state.activeLayerIds.includes(layer.id)) {
                elementsToGroup.unshift(layer);
                minX = Math.min(minX, layer.style?.x || 0);
                minY = Math.min(minY, layer.style?.y || 0);
                maxX = Math.max(maxX, (layer.style?.x || 0) + (parseFloat(layer.style?.width) || 0));
                maxY = Math.max(maxY, (layer.style?.y || 0) + (parseFloat(layer.style?.height) || 0));
                
                if (!trackToInject && parent) {
                    trackToInject = parent;
                    injectIndex = i;
                } else if (!trackToInject && !parent) {
                    trackToInject = 'root';
                    injectIndex = i;
                }
                
                layers.splice(i, 1);
            } else if (layer.children) {
                extractElements(layer.children, layer);
            }
        }
    };

    extractElements(targetLayers);

    const groupChildren = elementsToGroup.map(el => ({
        ...el,
        style: { ...el.style, x: (el.style?.x || 0) - minX, y: (el.style?.y || 0) - minY }
    }));

    const newGroup = {
        id: 'group_123',
        type: 'canvas_group',
        name: 'Grup Baru',
        children: groupChildren,
        style: { x: minX, y: minY, width: maxX - minX, height: maxY - minY, zIndex: 1 }
    };

    if (trackToInject === 'root') {
        const rootGroup = {
            id: 'layer_123',
            type: 'group',
            name: 'Layer Baru 2',
            children: [newGroup],
            style: { zIndex: 1 }
        };
        if (injectIndex !== -1) {
            targetLayers.splice(injectIndex, 0, rootGroup);
        } else {
            targetLayers.push(rootGroup);
        }
    } else if (trackToInject && trackToInject.children) {
        if (injectIndex !== -1) {
            trackToInject.children.splice(injectIndex, 0, newGroup);
        } else {
            trackToInject.children.push(newGroup);
        }
    } else {
        const rootGroup = {
            id: 'layer_123',
            type: 'group',
            name: 'Layer Baru 2',
            children: [newGroup],
            style: { zIndex: 1 }
        };
        targetLayers.push(rootGroup);
    }
});

console.log(JSON.stringify(newState.global_settings.desktop_layers, null, 2));
