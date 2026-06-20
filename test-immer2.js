import { produce } from 'immer';

const state = {
    sections: [
        {
            id: 's1',
            layers: [
                {
                    id: 't1',
                    children: [
                        { id: 'c1', x: 10 },
                        { id: 'c2', x: 20 },
                        { id: 'c3', x: 30 }
                    ]
                }
            ]
        }
    ],
    activeLayerIds: ['c1', 'c2']
};

const nextState = produce(state, draft => {
    const targetLayers = draft.sections[0].layers;
    const elementsToGroup = [];
    const remainingLayers = [];
    let trackToInject = null;

    for (const layer of targetLayers) {
        if (layer.children) {
            const extracted = layer.children.filter(c => draft.activeLayerIds.includes(c.id));
            if (extracted.length > 0) {
                trackToInject = layer;
                extracted.forEach(c => elementsToGroup.push(c));
                layer.children = layer.children.filter(c => !draft.activeLayerIds.includes(c.id));
            }
            remainingLayers.push(layer);
        }
    }

    const newGroup = { id: 'g1', children: elementsToGroup };
    
    // Perform the splice
    targetLayers.splice(0, targetLayers.length, ...remainingLayers);
    
    // Mutate AFTER splice
    if (trackToInject) {
        trackToInject.children.push(newGroup);
    }
});

console.log(JSON.stringify(nextState.sections[0].layers[0].children, null, 2));
