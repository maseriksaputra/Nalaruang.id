import { create } from 'zustand';
import { produce } from 'immer';
import { temporal } from 'zundo';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import apiClient from '../utils/apiClient';
import useUIStore from './useUIStore';

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

const useCanvasStore = create(temporal((set, get) => ({
    invitationId: null,
    global_settings: {},
    sections: [],
    activeLayerId: null,
    activeLayerIds: [],
    clipboard: null,

    copyElements: () => {
        set(produce((state) => {
            if (state.activeLayerIds.length === 0) return;
            const section = state.sections.find(s => s.id === state.activeSectionId);
            if (!section) return;

            const copied = [];
            const deepCopy = (item) => JSON.parse(JSON.stringify(item));

            for (const layer of section.layers) {
                // Ignore structural groups from being copied directly
                if (state.activeLayerIds.includes(layer.id) && layer.type !== 'group') {
                    copied.push(deepCopy(layer));
                } else if (layer.children) {
                    for (const child of layer.children) {
                        if (state.activeLayerIds.includes(child.id)) {
                            copied.push(deepCopy(child));
                        }
                    }
                }
            }
            if (copied.length > 0) {
                state.clipboard = copied;
            }
        }));
    },

    lastPasteTime: 0,

    pasteElements: () => {
        set(produce((state) => {
            const now = Date.now();
            if (now - state.lastPasteTime < 300) return;
            state.lastPasteTime = now;

            if (!state.clipboard || state.clipboard.length === 0) return;
            const section = state.sections.find(s => s.id === state.activeSectionId) || state.sections[0];
            if (!section) return;

            const deepCopy = (item) => JSON.parse(JSON.stringify(item));
            const newLayerIds = [];

            // Find max Z
            let maxZ = 0;
            const checkZ = (layers) => {
                layers.forEach(l => {
                    if ((l.style?.zIndex || 0) > maxZ) maxZ = l.style.zIndex;
                    if (l.children) checkZ(l.children);
                });
            };
            checkZ(section.layers);

            const pasteItem = (item) => {
                const newItem = deepCopy(item);
                
                const generateNewId = (oldId) => oldId.replace(/_[0-9]+.*$/, '') + '_' + Date.now() + Math.floor(Math.random()*1000);
                newItem.id = generateNewId(newItem.id);
                
                if (newItem.style) {
                    if (newItem.style.x !== undefined) newItem.style.x += 20;
                    if (newItem.style.y !== undefined) newItem.style.y += 20;
                    maxZ++;
                    newItem.style.zIndex = maxZ;
                }

                if (newItem.children) {
                    newItem.children = newItem.children.map(c => pasteItem(c));
                }
                return newItem;
            };

            const pastedItems = state.clipboard.map(item => pasteItem(item));
            
            // Push to active group or root
            let activeGroup = section.layers.find(l => l.id === state.activeLayerId);
            if (!activeGroup) {
                activeGroup = section.layers.find(g => g.children?.some(c => c.id === state.activeLayerId));
            }
            if (!activeGroup && section.layers.length > 0) {
                activeGroup = section.layers[section.layers.length - 1];
            }

            pastedItems.forEach(pi => {
                newLayerIds.push(pi.id);
                if (activeGroup && activeGroup.children && pi.type !== 'canvas_group' && pi.type !== 'group') {
                    activeGroup.children.push(pi);
                } else {
                    section.layers.push(pi);
                }
            });

            state.activeLayerIds = newLayerIds;
            state.activeLayerId = newLayerIds[newLayerIds.length - 1];
        }));
        get().triggerAutoSave();
    },
    activeSectionId: null,
    zoom: 1,
    activeTab: 'elements', // 'elements', 'text', 'uploads', 'layers', 'settings'
    inspectorTab: 'design',
    setInspectorTab: (tab) => set({ inspectorTab: tab }),
    isPreviewMobile: false,
    setIsPreviewMobile: (val) => set({ isPreviewMobile: val }),
    isPreviewMode: false,
    setIsPreviewMode: (val) => set({ isPreviewMode: val }),
    workspaceView: 'mobile', // 'mobile' | 'desktop'
    setWorkspaceView: (view) => set({ workspaceView: view }),
    showMockup: false,
    setShowMockup: (val) => set({ showMockup: val }),

    triggerAutoSave: debounce(async () => {
        const { invitationId, global_settings, sections } = get();
        if (!invitationId) return;

        useUIStore.getState().setIsSaving(true);
        try {
            await apiClient.put(`/api/builder/invitations/${invitationId}/auto-save`, {
                canvas_config: { global_settings, sections }
            });
            console.log('Auto-saved at', new Date().toLocaleTimeString());
        } catch (error) {
            console.error('Auto-save failed:', error);
        } finally {
            setTimeout(() => useUIStore.getState().setIsSaving(false), 500);
        }
    }, 1000),

    setCanvasData: (id, data) => {
        const sections = data?.sections?.length > 0 ? data.sections : [
            { id: 'sec_initial', layout: { height: 'auto', minHeight: '100vh', background_value: '#ffffff' }, layers: [] }
        ];
        
        let global_settings = data?.global_settings || {};
        
        // Inisialisasi konfigurasi desktop_thumbnail jika belum ada
        if (!global_settings.desktop_thumbnail) {
            global_settings.desktop_thumbnail = {
                enabled: false,
                type: 'image', // 'image', 'video', 'album'
                media: [],
                video_loop: true,
                album_duration: 3000,
                overlay_text: "The Wedding Of\nPasangan",
                text_animation: "fade-up",
                background_color: "#1a1a1a"
            };
        }

        set({
            invitationId: id,
            global_settings: global_settings,
            sections: sections,
            activeSectionId: sections[0].id
        });
    },

    setActiveTab: (tab) => set({ activeTab: tab }),
    setZoom: (zoomLevel) => set({ zoom: zoomLevel }),
    setActiveLayer: (layerId, multi = false) => set(produce(state => {
        if (!layerId) {
            state.activeLayerId = null;
            state.activeLayerIds = [];
            return;
        }
        if (multi) {
            if (state.activeLayerIds.includes(layerId)) {
                state.activeLayerIds = state.activeLayerIds.filter(id => id !== layerId);
                state.activeLayerId = state.activeLayerIds.length > 0 ? state.activeLayerIds[state.activeLayerIds.length - 1] : null;
            } else {
                state.activeLayerIds.push(layerId);
                state.activeLayerId = layerId;
            }
        } else {
            state.activeLayerId = layerId;
            state.activeLayerIds = [layerId];
        }
    })),
    setActiveSection: (sectionId) => set({ activeSectionId: sectionId }),

    addSection: () => {
        set(produce((state) => {
            const newId = 'sec_' + Date.now();
            state.sections.push({
                id: newId,
                layout: { height: 'auto', minHeight: '844px', background_value: '#ffffff' },
                layers: []
            });
            state.activeSectionId = newId;
            state.activeLayerId = null;
        }));
        get().triggerAutoSave();
    },

    removeSection: (sectionId) => {
        set(produce((state) => {
            if (state.sections.length <= 1) return; // minimal 1 section
            state.sections = state.sections.filter(s => s.id !== sectionId);
            if (state.activeSectionId === sectionId) {
                state.activeSectionId = state.sections[0].id;
                state.activeLayerId = null;
            }
        }));
        get().triggerAutoSave();
    },

    updateSectionLayout: (sectionId, layoutObj) => {
        set(produce((state) => {
            const section = state.sections.find(s => s.id === sectionId);
            if (section) {
                if (!section.layout) section.layout = {};
                section.layout = { ...section.layout, ...layoutObj };
            }
        }));
        get().triggerAutoSave();
    },

    addLayer: (layerObj) => {
        set(produce((state) => {
            const section = state.sections.find(s => s.id === state.activeSectionId) || state.sections[0];
            if (section) {
                if (layerObj.type === 'group') {
                    let maxGroupZ = 0;
                    section.layers.forEach(g => {
                        if (g.style && g.style.zIndex && g.style.zIndex > maxGroupZ) maxGroupZ = g.style.zIndex;
                    });
                    const newGroup = {
                        id: layerObj.id || 'layer_' + Date.now(),
                        type: 'group',
                        name: layerObj.name || 'Layer Baru',
                        children: [],
                        isHidden: false,
                        isLocked: false,
                        style: { zIndex: maxGroupZ + 1 }
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
                    
                    let maxZ = 0;
                    activeGroup.children.forEach(c => {
                        if (c.style && c.style.zIndex && c.style.zIndex > maxZ) maxZ = c.style.zIndex;
                    });
                    
                    const newLayer = {
                        ...layerObj,
                        id: layerObj.id || 'elem_' + Date.now(),
                        style: { 
                            x: 50, y: 50, width: 200, height: layerObj.type === 'text' ? 50 : 200, 
                            zIndex: maxZ + 1, color: '#000000', fontSize: '24px', 
                            ...layerObj.style 
                        },
                        animation: layerObj.animation || { entry: null, exit: null, isLooping: false },
                        interaction: layerObj.interaction || { isButton: false, action: '', targetId: '' }
                    };
                    activeGroup.children.push(newLayer);
                    state.activeLayerId = newLayer.id;
                }
            }
        }));
        get().triggerAutoSave();
    },

    moveElementToGroup: (elementId, targetGroupId) => {
        set(produce((state) => {
            const section = state.sections.find(s => s.id === state.activeSectionId);
            if (!section) return;
            
            // Find the element and its current group recursively
            let elementToMove = null;
            let currentGroup = null;
            
            const findAndRemove = (layers) => {
                for (const layer of layers) {
                    if (layer.children) {
                        const childIndex = layer.children.findIndex(c => c.id === elementId);
                        if (childIndex !== -1) {
                            elementToMove = layer.children[childIndex];
                            currentGroup = layer;
                            layer.children.splice(childIndex, 1);
                            return true;
                        }
                        if (findAndRemove(layer.children)) return true;
                    }
                }
                return false;
            };

            findAndRemove(section.layers);
            
            if (elementToMove) {
                // Find target group recursively
                let targetGroup = null;
                const findTarget = (layers) => {
                    for (const layer of layers) {
                        if (layer.id === targetGroupId) {
                            targetGroup = layer;
                            return true;
                        }
                        if (layer.children && findTarget(layer.children)) return true;
                    }
                    return false;
                };
                
                findTarget(section.layers);

                if (targetGroup && targetGroup.children) {
                    // Calculate new zIndex based on target group's children count
                    elementToMove.style = {
                        ...elementToMove.style,
                        zIndex: targetGroup.children.length + 1
                    };
                    targetGroup.children.push(elementToMove);
                } else if (currentGroup && currentGroup.children) {
                    // If target group not found, push back to original group
                    currentGroup.children.push(elementToMove);
                }
            }
        }));
        get().triggerAutoSave();
    },

    moveElementToNewGroup: (elementId, insertAfterGroupId = null) => {
        set(produce((state) => {
            const section = state.sections.find(s => s.id === state.activeSectionId);
            if (!section) return;

            let elementToMove = null;
            
            const findAndRemove = (layers) => {
                for (const layer of layers) {
                    if (layer.children) {
                        const childIndex = layer.children.findIndex(c => c.id === elementId);
                        if (childIndex !== -1) {
                            elementToMove = layer.children[childIndex];
                            layer.children.splice(childIndex, 1);
                            return true;
                        }
                        if (findAndRemove(layer.children)) return true;
                    }
                }
                return false;
            };

            findAndRemove(section.layers);

            if (elementToMove) {
                let maxGroupZ = 0;
                section.layers.forEach(g => {
                    if (g.style && g.style.zIndex && g.style.zIndex > maxGroupZ) maxGroupZ = g.style.zIndex;
                });
                
                const newGroup = {
                    id: 'layer_' + Date.now(),
                    type: 'group',
                    name: 'Layer Baru',
                    children: [elementToMove],
                    style: { zIndex: maxGroupZ + 1 }
                };
                
                if (insertAfterGroupId) {
                    const idx = section.layers.findIndex(g => g.id === insertAfterGroupId);
                    if (idx !== -1) {
                        section.layers.splice(idx + 1, 0, newGroup);
                    } else {
                        section.layers.push(newGroup);
                    }
                } else {
                    section.layers.push(newGroup);
                }
            }
        }));
        get().triggerAutoSave();
    },

        moveLayerUp: (layerId) => {
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
    },

    groupElements: () => {
        set(produce((state) => {
            if (state.activeLayerIds.length < 2) return;

            const section = state.sections.find(s => s.id === state.activeSectionId) || state.sections[0];
            if (!section) return;

            // Gather elements and calculate bounding box
            const elementsToGroup = [];
            let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
            let maxZ = 0;

            const remainingLayers = [];

            for (const layer of section.layers) {
                if (state.activeLayerIds.includes(layer.id)) {
                    elementsToGroup.push(layer);
                    const x = parseFloat(layer.style?.x) || 0;
                    const y = parseFloat(layer.style?.y) || 0;
                    const w = parseFloat(layer.style?.width) || 0;
                    const h = parseFloat(layer.style?.height) || 0;
                    minX = Math.min(minX, x);
                    minY = Math.min(minY, y);
                    maxX = Math.max(maxX, x + w);
                    maxY = Math.max(maxY, y + h);
                    if ((layer.style?.zIndex || 0) > maxZ) maxZ = layer.style.zIndex;
                } else if (layer.type === 'group' && layer.children) {
                    const remainingChildren = [];
                    for (const child of layer.children) {
                        if (state.activeLayerIds.includes(child.id)) {
                            elementsToGroup.push(child);
                            const x = child.style?.x || 0;
                            const y = child.style?.y || 0;
                            const w = parseFloat(child.style?.width) || 0;
                            const h = parseFloat(child.style?.height) || 0;
                            minX = Math.min(minX, x);
                            minY = Math.min(minY, y);
                            maxX = Math.max(maxX, x + w);
                            maxY = Math.max(maxY, y + h);
                            if ((child.style?.zIndex || 0) > maxZ) maxZ = child.style.zIndex;
                        } else {
                            remainingChildren.push(child);
                        }
                    }
                    layer.children = remainingChildren;
                    remainingLayers.push(layer);
                } else {
                    remainingLayers.push(layer);
                }
            }

            if (elementsToGroup.length < 2) return;

            const groupChildren = elementsToGroup.map(el => {
                return {
                    ...el,
                    style: {
                        ...el.style,
                        // Convert absolute coordinates to relative coordinates
                        x: (el.style?.x || 0) - minX,
                        y: (el.style?.y || 0) - minY
                    }
                };
            });

            const newGroupId = 'group_' + Date.now();
            const newGroup = {
                id: newGroupId,
                type: 'canvas_group',
                name: 'Grup Baru',
                children: groupChildren,
                style: {
                    x: minX,
                    y: minY,
                    width: maxX - minX,
                    height: maxY - minY,
                    zIndex: maxZ + 1
                }
            };

            // push to the last structural group, or create one
            let mainGroup = remainingLayers[remainingLayers.length - 1];
            if (!mainGroup || mainGroup.type !== 'group') {
                mainGroup = { id: 'layer_' + Date.now(), type: 'group', name: 'Layer Utama', children: [], style: { zIndex: 1 } };
                remainingLayers.push(mainGroup);
            }
            mainGroup.children.push(newGroup);

            section.layers = remainingLayers;
            state.activeLayerId = newGroupId;
            state.activeLayerIds = [newGroupId];
        }));
        get().triggerAutoSave();
    },

    ungroupElements: () => {
        set(produce((state) => {
            if (state.activeLayerIds.length !== 1) return;
            const groupId = state.activeLayerIds[0];

            const section = state.sections.find(s => s.id === state.activeSectionId) || state.sections[0];
            if (!section) return;

            let groupToUngroup = null;
            let parentLayer = null;

            for (const layer of section.layers) {
                if (layer.children) {
                    const cIdx = layer.children.findIndex(c => c.id === groupId && c.type === 'canvas_group');
                    if (cIdx !== -1) {
                        groupToUngroup = layer.children[cIdx];
                        parentLayer = layer;
                        layer.children.splice(cIdx, 1);
                        break;
                    }
                }
            }

            if (!groupToUngroup || !groupToUngroup.children || groupToUngroup.children.length === 0) return;

            const groupX = groupToUngroup.style?.x || 0;
            const groupY = groupToUngroup.style?.y || 0;

            const newElements = groupToUngroup.children.map(child => ({
                ...child,
                style: {
                    ...child.style,
                    x: (parseFloat(child.style?.x) || 0) + parseFloat(groupX),
                    y: (parseFloat(child.style?.y) || 0) + parseFloat(groupY),
                    zIndex: (child.style?.zIndex || 0) + (groupToUngroup.style?.zIndex || 0)
                }
            }));

            // Insert children at the end of the parent layer
            parentLayer.children.push(...newElements);

            state.activeLayerId = newElements[newElements.length - 1].id;
            state.activeLayerIds = newElements.map(el => el.id);
        }));
        get().triggerAutoSave();
    },
    alignLayer: (layerId, alignment) => {
        set(produce((state) => {
            state.sections.forEach(section => {
                const layer = findElement(state.sections, layerId);
                if (layer) {
                    const canvasWidth = 390;
                    const canvasHeight = 844;
                    const w = parseFloat(layer.style.width) || 0;
                    const h = parseFloat(layer.style.height) || 0;

                    if (alignment === 'left') layer.style.x = 0;
                    if (alignment === 'right') layer.style.x = canvasWidth - w;
                    if (alignment === 'center') layer.style.x = (canvasWidth - w) / 2;
                    if (alignment === 'top') layer.style.y = 0;
                    if (alignment === 'bottom') layer.style.y = canvasHeight - h;
                    if (alignment === 'middle') layer.style.y = (canvasHeight - h) / 2;
                }
            });
        }));
        get().triggerAutoSave();
    },

    updateLayerInteraction: (layerId, interactionObj) => {
        set(produce((state) => {
            const layer = findElement(state.sections, layerId);
            if (layer) {
                layer.interaction = { ...layer.interaction, ...interactionObj };
            }
        }));
        get().triggerAutoSave();
    },

    updateLayerPosition: (layerId, x, y) => {
        set(produce((state) => {
            const layer = findElement(state.sections, layerId);
            if (layer) { layer.style.x = x; layer.style.y = y; }
        }));
        get().triggerAutoSave();
    },

    updateLayerSize: (layerId, width, height) => {
        set(produce((state) => {
            const layer = findElement(state.sections, layerId);
            if (layer) { layer.style.width = width; layer.style.height = height; }
        }));
        get().triggerAutoSave();
    },

    updateLayerStyle: (layerId, styleData) => {
        set(produce((state) => {
            const layer = findElement(state.sections, layerId);
            if (layer) { 
                if (layer.type === 'canvas_group' && layer.children && styleData.width && styleData.height) {
                    const oldW = parseFloat(layer.style.width) || 1;
                    const oldH = parseFloat(layer.style.height) || 1;
                    const newW = parseFloat(styleData.width) || 1;
                    const newH = parseFloat(styleData.height) || 1;
                    const ratioW = newW / oldW;
                    const ratioH = newH / oldH;
                    
                    const scaleChildren = (children) => {
                        children.forEach(c => {
                            if (c.style) {
                                if (c.style.x !== undefined) c.style.x = parseFloat(c.style.x) * ratioW;
                                if (c.style.y !== undefined) c.style.y = parseFloat(c.style.y) * ratioH;
                                if (c.style.width !== undefined) c.style.width = parseFloat(c.style.width) * ratioW;
                                if (c.style.height !== undefined) c.style.height = parseFloat(c.style.height) * ratioH;
                                if (c.style.fontSize !== undefined) c.style.fontSize = parseFloat(c.style.fontSize) * Math.min(ratioW, ratioH);
                            }
                            if (c.children) scaleChildren(c.children);
                        });
                    };
                    scaleChildren(layer.children);
                }
                layer.style = { ...layer.style, ...styleData };
            }
        }));
        get().triggerAutoSave();
    },

    updateLayerContent: (layerId, content) => {
        set(produce((state) => {
            const layer = findElement(state.sections, layerId);
            if (layer) { layer.content = content; }
        }));
        get().triggerAutoSave();
    },

    updateLayer: (layerId, data) => {
        set(produce((state) => {
            const layer = findElement(state.sections, layerId);
            if (layer) {
                Object.assign(layer, data);
            }
        }));
        get().triggerAutoSave();
    },

    updateLayerAnimation: (layerId, animationData) => {
        set(produce((state) => {
            const layer = findElement(state.sections, layerId);
            if (layer) { 
                layer.animation = { 
                    ...layer.animation, 
                    ...animationData,
                    config: { ...(layer.animation?.config || {}), ...(animationData.config || {}) },
                    configExit: { ...(layer.animation?.configExit || {}), ...(animationData.configExit || {}) }
                }; 
            }
        }));
        get().triggerAutoSave();
    },

    offsetGroupChildrenTime: (groupId, deltaX) => {
        set(produce((state) => {
            const group = findElement(state.sections, groupId);
            if (group && group.children) {
                const shiftTime = (layer) => {
                    if (layer.animation?.config?.delay !== undefined) {
                        layer.animation.config.delay = Math.max(0, layer.animation.config.delay + deltaX);
                    }
                    if (layer.animation?.configExit?.delay !== undefined) {
                        layer.animation.configExit.delay = Math.max(0, layer.animation.configExit.delay + deltaX);
                    }
                    if (layer.children) {
                        layer.children.forEach(shiftTime);
                    }
                };
                group.children.forEach(shiftTime);
            }
        }));
        get().triggerAutoSave();
    },

    updateLayerInteraction: (layerId, interactionData) => {
        set(produce((state) => {
            const layer = findElement(state.sections, layerId);
            if (layer) { layer.interaction = { ...layer.interaction, ...interactionData }; }
        }));
        get().triggerAutoSave();
    },

    updateGlobalSettings: (settingsData) => {
        set(produce((state) => {
            state.global_settings = { ...state.global_settings, ...settingsData };
        }));
        get().triggerAutoSave();
    },

    toggleLayerVisibility: (layerId) => {
        set(produce((state) => {
            state.sections.forEach(section => {
                const layer = findElement(state.sections, layerId);
                if (layer) { layer.isHidden = !layer.isHidden; }
            });
        }));
        get().triggerAutoSave();
    },

    toggleLayerLock: (layerId) => {
        set(produce((state) => {
            state.sections.forEach(section => {
                const layer = findElement(state.sections, layerId);
                if (layer) { layer.isLocked = !layer.isLocked; }
            });
        }));
        get().triggerAutoSave();
    },

    setLayers: (newLayers) => {
        set(produce((state) => {
            const section = state.sections.find(s => s.id === state.activeSectionId);
            if (section) {
                section.layers = newLayers;
            }
        }));
        get().triggerAutoSave();
    },

    setAllSections: (newSections) => {
        set(produce((state) => {
            state.sections = newSections;
        }));
        get().triggerAutoSave();
    },

    deleteElement: (elementId) => {
        set(produce((state) => {
            state.sections.forEach(section => {
                section.layers = section.layers.filter(l => l.id !== elementId);
                section.layers.forEach(g => {
                    if (g.children) {
                        g.children = g.children.filter(c => c.id !== elementId);
                    }
                });
            });
            if (state.activeLayerId === elementId) state.activeLayerId = null;
        }));
        get().triggerAutoSave();
    },

    duplicateLayer: (layerId) => {
        set(produce((state) => {
            const section = state.sections.find(s => s.id === state.activeSectionId);
            if (section) {
                // Determine if it's a group or child
                let foundGroupIndex = section.layers.findIndex(l => l.id === layerId);
                if (foundGroupIndex !== -1) {
                    const originalLayer = section.layers[foundGroupIndex];
                    const newLayer = JSON.parse(JSON.stringify(originalLayer));
                    newLayer.id = 'layer_' + Date.now();
                    newLayer.children = newLayer.children.map(c => ({...c, id: 'elem_' + Math.random().toString(36).substr(2, 9)}));
                    if (newLayer.style) {
                        newLayer.style.zIndex = section.layers.length + 1;
                    }
                    section.layers.push(newLayer);
                    state.activeLayerId = newLayer.id;
                } else {
                    section.layers.forEach(group => {
                        if (group.children) {
                            const childIndex = group.children.findIndex(c => c.id === layerId);
                            if (childIndex !== -1) {
                                const originalChild = group.children[childIndex];
                                const newChild = JSON.parse(JSON.stringify(originalChild));
                                newChild.id = 'elem_' + Date.now();
                                if (newChild.style) {
                                    newChild.style.x += 20;
                                    newChild.style.y += 20;
                                    newChild.style.zIndex = group.children.length + 1;
                                }
                                group.children.push(newChild);
                                state.activeLayerId = newChild.id;
                            }
                        }
                    });
                }
            }
        }));
        get().triggerAutoSave();
    }
}), {
    partialize: (state) => ({ 
        sections: JSON.parse(JSON.stringify(state.sections)), 
        global_settings: JSON.parse(JSON.stringify(state.global_settings)) 
    }),
    equality: (pastState, currentState) => {
        return isEqual(pastState.sections, currentState.sections) && 
               isEqual(pastState.global_settings, currentState.global_settings);
    },
    limit: 50
}));

export default useCanvasStore;
