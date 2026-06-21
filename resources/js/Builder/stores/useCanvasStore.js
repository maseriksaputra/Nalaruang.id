import { create } from 'zustand';
import { produce } from 'immer';
import { temporal } from 'zundo';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import apiClient from '../utils/apiClient';
import useUIStore from './useUIStore';

const findElement = (sections, id) => {
    if (!sections || !Array.isArray(sections)) return null;
    for (const section of sections) {
        if (!section || !section.layers) continue;
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

const findLayer = (layers, id) => {
    if (!layers || !Array.isArray(layers)) return null;
    const group = layers.find(l => l.id === id);
    if (group) return group;
    for (const g of layers) {
        if (g.children) {
            const child = g.children.find(c => c.id === id);
            if (child) return child;
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
    activeCanvasMode: 'mobile', // 'mobile' or 'desktop'
    clipboard: null,

    setActiveCanvasMode: (mode) => set({ activeCanvasMode: mode, activeLayerId: null, activeLayerIds: [] }),

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
            global_settings: {
                ...global_settings,
                desktop_layers: global_settings.desktop_layers || []
            },
            sections: sections,
            activeSectionId: sections[0].id,
            activeCanvasMode: 'mobile'
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
            if (state.sections.length <= 1) return;
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
            const targetLayers = state.activeCanvasMode === 'desktop' ? state.global_settings.desktop_layers : (state.sections.find(s => s.id === state.activeSectionId)?.layers || []);
            
            if (layerObj.type === 'group') {
                const newGroup = {
                    id: layerObj.id || 'layer_' + Date.now(),
                    type: 'group',
                    name: layerObj.name || 'Layer Baru',
                    children: [],
                    isHidden: false,
                    isLocked: false,
                    style: { zIndex: targetLayers.length + 1 }
                };
                targetLayers.push(newGroup);
                state.activeLayerId = newGroup.id;
            } else {
                let activeGroup = targetLayers.find(l => l.id === state.activeLayerId && l.type === 'group');
                if (!activeGroup && targetLayers.length > 0) {
                    activeGroup = targetLayers[targetLayers.length - 1];
                }
                if (!activeGroup) {
                    activeGroup = { id: 'layer_' + Date.now(), type: 'group', name: 'Layer Utama', children: [], style: { zIndex: 1 } };
                    targetLayers.push(activeGroup);
                }
                
                let smartY = 50;
                try {
                    const workspaceEl = document.getElementById('zoomable-main-area');
                    const sectionEl = document.getElementById(state.activeSectionId);
                    if (workspaceEl && sectionEl) {
                        const workspaceRect = workspaceEl.getBoundingClientRect();
                        const sectionRect = sectionEl.getBoundingClientRect();
                        const centerY = workspaceRect.top + (workspaceRect.height / 2);
                        const scale = sectionRect.width / sectionEl.offsetWidth;
                        let relativeY = (centerY - sectionRect.top) / scale;
                        
                        // Default element height assumption is ~200px, so subtract 100 to truly center it
                        relativeY -= 100;
                        
                        // Keep within bounds
                        const sectionHeight = sectionEl.offsetHeight;
                        smartY = Math.max(50, Math.min(relativeY, sectionHeight - 200));
                    }
                } catch (e) {
                    console.error('Smart Y calculation failed:', e);
                }

                const newLayer = {
                    ...layerObj,
                    id: layerObj.id || 'elem_' + Date.now(),
                    style: { 
                        x: 50, y: smartY, width: 200, height: layerObj.type === 'text' ? 50 : 200, 
                        zIndex: (activeGroup.children?.length || 0) + 1, color: '#000000', fontSize: '24px', 
                        ...layerObj.style 
                    },
                    animation: layerObj.animation || { entry: null, exit: null, isLooping: false },
                    interaction: layerObj.interaction || { isButton: false, action: '', targetId: '' }
                };
                activeGroup.children.push(newLayer);
                state.activeLayerId = newLayer.id;
            }
        }));
        get().triggerAutoSave();
    },

    moveElementToGroup: (elementId, targetGroupId) => {
        set(produce((state) => {
            const targetLayers = state.activeCanvasMode === 'desktop' ? state.global_settings.desktop_layers : (state.sections.find(s => s.id === state.activeSectionId)?.layers || []);
            
            let elementToMove = null;
            let currentGroup = null;
            
            const findAndRemove = (layers) => {
                for (let i = 0; i < layers.length; i++) {
                    const layer = layers[i];
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

            findAndRemove(targetLayers);
            
            if (elementToMove) {
                let targetGroup = null;
                const findTarget = (layers) => {
                    for (const layer of layers) {
                        if (layer.id === targetGroupId) { targetGroup = layer; return true; }
                        if (layer.children && findTarget(layer.children)) return true;
                    }
                    return false;
                };
                findTarget(targetLayers);

                if (targetGroup && targetGroup.children) {
                    targetGroup.children.push(elementToMove);
                } else if (currentGroup && currentGroup.children) {
                    currentGroup.children.push(elementToMove);
                }
            }
        }));
        get().triggerAutoSave();
    },

    moveElementToNewGroup: (elementId, insertAfterGroupId = null) => {
        set(produce((state) => {
            const targetLayers = state.activeCanvasMode === 'desktop' ? state.global_settings.desktop_layers : (state.sections.find(s => s.id === state.activeSectionId)?.layers || []);
            
            let elementToMove = null;
            const findAndRemove = (layers) => {
                for (let i = 0; i < layers.length; i++) {
                    if (layers[i].children) {
                        const childIndex = layers[i].children.findIndex(c => c.id === elementId);
                        if (childIndex !== -1) {
                            elementToMove = layers[i].children.splice(childIndex, 1)[0];
                            return true;
                        }
                        if (findAndRemove(layers[i].children)) return true;
                    }
                }
                return false;
            };
            findAndRemove(targetLayers);

            if (elementToMove) {
                const newGroup = {
                    id: 'layer_' + Date.now(),
                    type: 'group',
                    name: 'Layer Baru',
                    children: [elementToMove],
                    style: { zIndex: targetLayers.length + 1 }
                };
                
                if (insertAfterGroupId) {
                    const idx = targetLayers.findIndex(g => g.id === insertAfterGroupId);
                    targetLayers.splice(idx + 1, 0, newGroup);
                } else {
                    targetLayers.push(newGroup);
                }
            }
        }));
        get().triggerAutoSave();
    },

    moveLayerUp: (layerId) => {
        set(produce((state) => {
            const targetLayers = state.activeCanvasMode === 'desktop' ? state.global_settings.desktop_layers : (state.sections.find(s => s.id === state.activeSectionId)?.layers || []);
            
            let gIndex = targetLayers.findIndex(l => l.id === layerId);
            if (gIndex !== -1 && gIndex < targetLayers.length - 1) {
                [targetLayers[gIndex], targetLayers[gIndex + 1]] = [targetLayers[gIndex + 1], targetLayers[gIndex]];
                return;
            }
            
            for (let i = 0; i < targetLayers.length; i++) {
                let g = targetLayers[i];
                if (!g.children) continue;
                let cIndex = g.children.findIndex(c => c.id === layerId);
                if (cIndex !== -1) {
                    if (cIndex < g.children.length - 1) {
                        [g.children[cIndex], g.children[cIndex + 1]] = [g.children[cIndex + 1], g.children[cIndex]];
                    } else if (i < targetLayers.length - 1) {
                        const [child] = g.children.splice(cIndex, 1);
                        targetLayers[i + 1].children.unshift(child); 
                    }
                    return;
                }
            }
        }));
        get().triggerAutoSave();
    },

    moveLayerDown: (layerId) => {
        set(produce((state) => {
            const targetLayers = state.activeCanvasMode === 'desktop' ? state.global_settings.desktop_layers : (state.sections.find(s => s.id === state.activeSectionId)?.layers || []);
            
            let gIndex = targetLayers.findIndex(l => l.id === layerId);
            if (gIndex > 0) {
                [targetLayers[gIndex], targetLayers[gIndex - 1]] = [targetLayers[gIndex - 1], targetLayers[gIndex]];
                return;
            }
            
            for (let i = 0; i < targetLayers.length; i++) {
                let g = targetLayers[i];
                if (!g.children) continue;
                let cIndex = g.children.findIndex(c => c.id === layerId);
                if (cIndex !== -1) {
                    if (cIndex > 0) {
                        [g.children[cIndex], g.children[cIndex - 1]] = [g.children[cIndex - 1], g.children[cIndex]];
                    } else if (i > 0) {
                        const [child] = g.children.splice(cIndex, 1);
                        targetLayers[i - 1].children.push(child);
                    }
                    return;
                }
            }
        }));
        get().triggerAutoSave();
    },

    moveLayerToFront: (layerId) => {
        set(produce((state) => {
            const targetLayers = state.activeCanvasMode === 'desktop' ? state.global_settings.desktop_layers : (state.sections.find(s => s.id === state.activeSectionId)?.layers || []);
            
            let gIndex = targetLayers.findIndex(l => l.id === layerId);
            if (gIndex !== -1 && gIndex < targetLayers.length - 1) {
                const layer = targetLayers.splice(gIndex, 1)[0];
                targetLayers.push(layer);
                return;
            }
            
            for (let i = 0; i < targetLayers.length; i++) {
                let g = targetLayers[i];
                if (!g.children) continue;
                let cIndex = g.children.findIndex(c => c.id === layerId);
                if (cIndex !== -1) {
                    const [child] = g.children.splice(cIndex, 1);
                    targetLayers[targetLayers.length - 1].children.push(child);
                    return;
                }
            }
        }));
        get().triggerAutoSave();
    },

    moveLayerToBack: (layerId) => {
        set(produce((state) => {
            const targetLayers = state.activeCanvasMode === 'desktop' ? state.global_settings.desktop_layers : (state.sections.find(s => s.id === state.activeSectionId)?.layers || []);
            
            let gIndex = targetLayers.findIndex(l => l.id === layerId);
            if (gIndex > 0) {
                const layer = targetLayers.splice(gIndex, 1)[0];
                targetLayers.unshift(layer);
                return;
            }
            
            for (let i = 0; i < targetLayers.length; i++) {
                let g = targetLayers[i];
                if (!g.children) continue;
                let cIndex = g.children.findIndex(c => c.id === layerId);
                if (cIndex !== -1) {
                    const [child] = g.children.splice(cIndex, 1);
                    targetLayers[0].children.unshift(child);
                    return;
                }
            }
        }));
        get().triggerAutoSave();
    },

    groupElements: () => {
        set(produce((state) => {
            if (state.activeLayerIds.length < 2) return;
            const targetLayers = state.activeCanvasMode === 'desktop' ? state.global_settings.desktop_layers : (state.sections.find(s => s.id === state.activeSectionId)?.layers || []);

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

            if (elementsToGroup.length < 2) return;

            const groupChildren = elementsToGroup.map(el => ({
                ...el,
                style: { ...el.style, x: (el.style?.x || 0) - minX, y: (el.style?.y || 0) - minY }
            }));

            const newGroup = {
                id: 'group_' + Date.now(),
                type: 'canvas_group',
                name: 'Grup Baru',
                children: groupChildren,
                style: { x: minX, y: minY, width: maxX - minX, height: maxY - minY, zIndex: 1 }
            };

            if (trackToInject === 'root') {
                const rootGroup = {
                    id: 'layer_' + Date.now(),
                    type: 'group',
                    name: 'Layer Baru',
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
                    id: 'layer_' + Date.now(),
                    type: 'group',
                    name: 'Layer Baru',
                    children: [newGroup],
                    style: { zIndex: 1 }
                };
                targetLayers.push(rootGroup);
            }

            state.activeLayerId = newGroup.id;
            state.activeLayerIds = [newGroup.id];
        }));
        get().triggerAutoSave();
    },

    ungroupElements: () => {
        set(produce((state) => {
            if (state.activeLayerIds.length !== 1) return;
            const groupId = state.activeLayerIds[0];
            const targetLayers = state.activeCanvasMode === 'desktop' ? state.global_settings.desktop_layers : (state.sections.find(s => s.id === state.activeSectionId)?.layers || []);

            let groupToUngroup = null;
            let parentLayer = null;
            let insertIndex = -1;

            const findAndExtractGroup = (layers, parent = null) => {
                for (let i = 0; i < layers.length; i++) {
                    if (layers[i].id === groupId) {
                        groupToUngroup = layers.splice(i, 1)[0];
                        parentLayer = parent;
                        insertIndex = i;
                        return true;
                    }
                    if (layers[i].children) {
                        if (findAndExtractGroup(layers[i].children, layers[i])) return true;
                    }
                }
                return false;
            };

            findAndExtractGroup(targetLayers);

            if (!groupToUngroup || !groupToUngroup.children) return;

            const newElements = groupToUngroup.children.map(child => ({
                ...child,
                style: {
                    ...child.style,
                    x: (parseFloat(child.style?.x) || 0) + (parseFloat(groupToUngroup.style?.x) || 0),
                    y: (parseFloat(child.style?.y) || 0) + (parseFloat(groupToUngroup.style?.y) || 0)
                }
            }));

            if (parentLayer) {
                parentLayer.children.splice(insertIndex, 0, ...newElements);
            } else {
                targetLayers.splice(insertIndex, 0, ...newElements);
            }

            state.activeLayerId = newElements[0].id;
            state.activeLayerIds = newElements.map(e => e.id);
        }));
        get().triggerAutoSave();
    },
    alignLayer: (layerId, alignment) => {
        set(produce((state) => {
            const targetLayers = state.activeCanvasMode === 'desktop' ? state.global_settings.desktop_layers : (state.sections.find(s => s.id === state.activeSectionId)?.layers || []);
            const layer = findLayer(targetLayers, layerId);
            if (layer) {
                const canvasW = 390, canvasH = 844;
                const w = parseFloat(layer.style.width) || 0, h = parseFloat(layer.style.height) || 0;
                if (alignment === 'left') layer.style.x = 0;
                if (alignment === 'right') layer.style.x = canvasW - w;
                if (alignment === 'center') layer.style.x = (canvasW - w) / 2;
                if (alignment === 'top') layer.style.y = 0;
                if (alignment === 'bottom') layer.style.y = canvasH - h;
                if (alignment === 'middle') layer.style.y = (canvasH - h) / 2;
            }
        }));
        get().triggerAutoSave();
    },

    updateLayerInteraction: (layerId, interactionObj) => {
        set(produce((state) => {
            const targetLayers = state.activeCanvasMode === 'desktop' ? state.global_settings.desktop_layers : (state.sections.find(s => s.id === state.activeSectionId)?.layers || []);
            const layer = findLayer(targetLayers, layerId);
            if (layer) layer.interaction = { ...layer.interaction, ...interactionObj };
        }));
        get().triggerAutoSave();
    },

    updateLayerPosition: (layerId, position) => {
        set(produce((state) => {
            const targetLayers = state.activeCanvasMode === 'desktop' ? state.global_settings.desktop_layers : (state.sections.find(s => s.id === state.activeSectionId)?.layers || []);
            const layer = findLayer(targetLayers, layerId);
            if (layer) layer.style = { ...layer.style, ...position };
        }));
        get().triggerAutoSave();
    },

    updateLayerSize: (layerId, width, height) => {
        set(produce((state) => {
            const targetLayers = state.activeCanvasMode === 'desktop' ? state.global_settings.desktop_layers : (state.sections.find(s => s.id === state.activeSectionId)?.layers || []);
            const layer = findLayer(targetLayers, layerId);
            if (layer) { layer.style.width = width; layer.style.height = height; }
        }));
        get().triggerAutoSave();
    },

    updateLayerStyle: (layerId, styleData) => {
        set(produce((state) => {
            const targetLayers = state.activeCanvasMode === 'desktop' ? state.global_settings.desktop_layers : (state.sections.find(s => s.id === state.activeSectionId)?.layers || []);
            const layer = findLayer(targetLayers, layerId);
            if (layer) { 
                if (layer.type === 'canvas_group' && layer.children && styleData.width && styleData.height) {
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
            const contextSections = state.activeCanvasMode === 'desktop' ? [{ layers: state.global_settings.desktop_layers || [] }] : state.sections;
            const layer = findElement(contextSections, layerId);
            if (layer) { layer.content = content; }
        }));
        get().triggerAutoSave();
    },

    updateLayer: (layerId, data) => {
        set(produce((state) => {
            const contextSections = state.activeCanvasMode === 'desktop' ? [{ layers: state.global_settings.desktop_layers || [] }] : state.sections;
            const layer = findElement(contextSections, layerId);
            if (layer) {
                Object.assign(layer, data);
            }
        }));
        get().triggerAutoSave();
    },

    updateLayerAnimation: (layerId, animationData) => {
        set(produce((state) => {
            const contextSections = state.activeCanvasMode === 'desktop' ? [{ layers: state.global_settings.desktop_layers || [] }] : state.sections;
            const layer = findElement(contextSections, layerId);
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
            const contextSections = state.activeCanvasMode === 'desktop' ? [{ layers: state.global_settings.desktop_layers || [] }] : state.sections;
            const group = findElement(contextSections, groupId);
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



    updateGlobalSettings: (settingsData) => {
        set(produce((state) => {
            state.global_settings = { ...state.global_settings, ...settingsData };
        }));
        get().triggerAutoSave();
    },

    toggleLayerVisibility: (layerId) => {
        set(produce((state) => {
            const contextSections = state.activeCanvasMode === 'desktop' ? [{ layers: state.global_settings.desktop_layers || [] }] : state.sections;
            const layer = findElement(contextSections, layerId);
            if (layer) { layer.isHidden = !layer.isHidden; }
        }));
        get().triggerAutoSave();
    },

    toggleLayerLock: (layerId) => {
        set(produce((state) => {
            const contextSections = state.activeCanvasMode === 'desktop' ? [{ layers: state.global_settings.desktop_layers || [] }] : state.sections;
            const layer = findElement(contextSections, layerId);
            if (layer) { layer.isLocked = !layer.isLocked; }
        }));
        get().triggerAutoSave();
    },

    setLayers: (newLayers) => {
        set(produce((state) => {
            if (state.activeCanvasMode === 'desktop') {
                state.global_settings.desktop_layers = newLayers;
            } else {
                const section = state.sections.find(s => s.id === state.activeSectionId);
                if (section) {
                    section.layers = newLayers;
                }
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
            if (state.activeCanvasMode === 'desktop' && state.global_settings?.desktop_layers) {
                state.global_settings.desktop_layers = state.global_settings.desktop_layers.filter(l => l.id !== elementId);
                state.global_settings.desktop_layers.forEach(g => {
                    if (g.children) {
                        g.children = g.children.filter(c => c.id !== elementId);
                    }
                });
            } else {
                state.sections.forEach(section => {
                    if (section.layers) {
                        section.layers = section.layers.filter(l => l.id !== elementId);
                        section.layers.forEach(g => {
                            if (g.children) {
                                g.children = g.children.filter(c => c.id !== elementId);
                            }
                        });
                    }
                });
            }
            if (state.activeLayerId === elementId) state.activeLayerId = null;
            state.activeLayerIds = state.activeLayerIds.filter(id => id !== elementId);
        }));
        get().triggerAutoSave();
    },

    duplicateLayer: (layerId) => {
        set(produce((state) => {
            const targetLayers = state.activeCanvasMode === 'desktop' ? state.global_settings.desktop_layers : (state.sections.find(s => s.id === state.activeSectionId)?.layers || []);
            
            let foundGroupIndex = targetLayers.findIndex(l => l.id === layerId);
            if (foundGroupIndex !== -1) {
                const originalLayer = targetLayers[foundGroupIndex];
                const newLayer = JSON.parse(JSON.stringify(originalLayer));
                newLayer.id = 'layer_' + Date.now();
                newLayer.children = newLayer.children?.map(c => ({...c, id: 'elem_' + Math.random().toString(36).substr(2, 9)})) || [];
                if (newLayer.style) {
                    newLayer.style.zIndex = targetLayers.length + 1;
                }
                targetLayers.push(newLayer);
                state.activeLayerId = newLayer.id;
            } else {
                targetLayers.forEach(group => {
                    if (group.children) {
                        const childIndex = group.children.findIndex(c => c.id === layerId);
                        if (childIndex !== -1) {
                            const originalChild = group.children[childIndex];
                            const newChild = JSON.parse(JSON.stringify(originalChild));
                            newChild.id = 'elem_' + Date.now();
                            if (newChild.style) {
                                newChild.style.x = (parseFloat(newChild.style.x) || 0) + 20;
                                newChild.style.y = (parseFloat(newChild.style.y) || 0) + 20;
                                newChild.style.zIndex = group.children.length + 1;
                            }
                            group.children.push(newChild);
                            state.activeLayerId = newChild.id;
                        }
                    }
                });
            }
        }));
        get().triggerAutoSave();
    },
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
