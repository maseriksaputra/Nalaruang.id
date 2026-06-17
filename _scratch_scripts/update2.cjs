const fs = require('fs');
const file = 'resources/js/Builder/components/Canvas/LayerElement.jsx';
let content = fs.readFileSync(file, 'utf8');

const onDragCode = `            onDrag={(e, d) => {
                let newX = d.x;
                let newY = d.y;
                let activeLines = [];
                const SNAP_THRESHOLD = 5;

                const store = useCanvasStore.getState();
                const section = store.sections.find(s => s.id === store.activeSectionId);
                const sectionWidth = 375;
                const sectionHeight = parseInt(section?.layout?.height || 844);

                const elWidth = typeof localSize.width === 'string' ? parseFloat(localSize.width) : localSize.width;
                const elHeight = typeof localSize.height === 'string' ? parseFloat(localSize.height) : localSize.height;
                const elCenterX = newX + elWidth / 2;
                const elCenterY = newY + elHeight / 2;

                const canvasCenterX = sectionWidth / 2;
                const canvasCenterY = sectionHeight / 2;

                if (Math.abs(elCenterX - canvasCenterX) < SNAP_THRESHOLD) {
                    newX = canvasCenterX - elWidth / 2;
                    activeLines.push({ axis: 'x', position: canvasCenterX, type: 'center' });
                }
                if (Math.abs(elCenterY - canvasCenterY) < SNAP_THRESHOLD) {
                    newY = canvasCenterY - elHeight / 2;
                    activeLines.push({ axis: 'y', position: canvasCenterY, type: 'center' });
                }
                
                if (section) {
                    const allElements = [];
                    section.layers.forEach(g => {
                        if (g.children) {
                            g.children.forEach(c => {
                                if (c.id !== layer.id) allElements.push(c);
                            });
                        }
                    });

                    allElements.forEach(otherEl => {
                        const ox = parseFloat(otherEl.style?.x || 0);
                        const oy = parseFloat(otherEl.style?.y || 0);
                        const ow = parseFloat(otherEl.style?.width || 100);
                        const oh = parseFloat(otherEl.style?.height || 100);

                        // Snap X
                        if (Math.abs(newX - ox) < SNAP_THRESHOLD) { newX = ox; activeLines.push({ axis: 'x', position: ox }); }
                        if (Math.abs(newX - (ox + ow)) < SNAP_THRESHOLD) { newX = ox + ow; activeLines.push({ axis: 'x', position: ox + ow }); }
                        if (Math.abs((newX + elWidth) - (ox + ow)) < SNAP_THRESHOLD) { newX = ox + ow - elWidth; activeLines.push({ axis: 'x', position: ox + ow }); }
                        if (Math.abs((newX + elWidth) - ox) < SNAP_THRESHOLD) { newX = ox - elWidth; activeLines.push({ axis: 'x', position: ox }); }
                        const otherCX = ox + ow / 2;
                        if (Math.abs((newX + elWidth / 2) - otherCX) < SNAP_THRESHOLD) { newX = otherCX - elWidth / 2; activeLines.push({ axis: 'x', position: otherCX }); }

                        // Snap Y
                        if (Math.abs(newY - oy) < SNAP_THRESHOLD) { newY = oy; activeLines.push({ axis: 'y', position: oy }); }
                        if (Math.abs(newY - (oy + oh)) < SNAP_THRESHOLD) { newY = oy + oh; activeLines.push({ axis: 'y', position: oy + oh }); }
                        if (Math.abs((newY + elHeight) - (oy + oh)) < SNAP_THRESHOLD) { newY = oy + oh - elHeight; activeLines.push({ axis: 'y', position: oy + oh }); }
                        if (Math.abs((newY + elHeight) - oy) < SNAP_THRESHOLD) { newY = oy - elHeight; activeLines.push({ axis: 'y', position: oy }); }
                        const otherCY = oy + oh / 2;
                        if (Math.abs((newY + elHeight / 2) - otherCY) < SNAP_THRESHOLD) { newY = otherCY - elHeight / 2; activeLines.push({ axis: 'y', position: otherCY }); }
                    });
                }

                setLocalPos({ x: newX, y: newY });
                localPosRef.current = { x: newX, y: newY };
                store.setSnapLines(activeLines);
            }}`;

const oldOnDrag = `            onDrag={(e, d) => {
                setLocalPos({ x: d.x, y: d.y });
            }}`;

content = content.replace(oldOnDrag, onDragCode);

const oldOnDragStop = `            onDragStop={(e, d) => {
                setIsDragging(false);
                if (updateLayerPosition) updateLayerPosition(layer.id, d.x, d.y);
                useCanvasStore.getState().updateLayerStyle(layer.id, { x: d.x, y: d.y });
            }}`;

const newOnDragStop = `            onDragStop={(e, d) => {
                setIsDragging(false);
                useCanvasStore.getState().setSnapLines([]);
                const finalPos = localPosRef.current;
                if (updateLayerPosition) updateLayerPosition(layer.id, finalPos.x, finalPos.y);
                useCanvasStore.getState().updateLayerStyle(layer.id, { x: finalPos.x, y: finalPos.y });
            }}`;

content = content.replace(oldOnDragStop, newOnDragStop);

const oldRef = `    const elementRef = useRef(null);`;
const newRef = `    const elementRef = useRef(null);
    const localPosRef = useRef({ x: layer.style?.x || 0, y: layer.style?.y || 0 });
    useEffect(() => { localPosRef.current = localPos; }, [localPos]);`;

content = content.replace(oldRef, newRef);

fs.writeFileSync(file, content);
