const fs = require('fs');
const file = 'resources/js/Builder/components/Panels/LeftDrawer.jsx';
let content = fs.readFileSync(file, 'utf8');

const draggableChildStr = `
import { useDraggable } from '@dnd-kit/core';

const DraggableChildItem = ({ child, parentId, isActive }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: child.id,
        data: { type: 'child', parentId }
    });

    const style = transform ? {
        transform: \`translate3d(\${transform.x}px, \${transform.y}px, 0)\`,
        zIndex: 50,
        position: 'relative'
    } : undefined;

    return (
        <div 
            ref={setNodeRef}
            style={style}
            onClick={() => useCanvasStore.getState().setActiveLayer(child.id)}
            className={\`flex items-center justify-between h-8 px-2 border cursor-pointer \${isActive ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-gray-100 hover:bg-gray-50'}\`}
        >
            <div className="flex items-center gap-2 overflow-hidden flex-1">
                <button 
                    {...attributes} 
                    {...listeners}
                    className="p-1 text-gray-300 hover:text-gray-500 rounded cursor-grab"
                    title="Geser ke layer lain"
                >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16"></path></svg>
                </button>
                <div className="w-4 h-4 bg-gray-100 rounded flex items-center justify-center shrink-0">
                    <span className="text-[8px] font-bold text-gray-500 uppercase">{child.type.charAt(0)}</span>
                </div>
                <span className="text-xs font-medium text-gray-600 truncate">{child.content || (child.type === 'image' ? 'Gambar Asset' : 'Elemen')}</span>
            </div>
            <div className="flex items-center shrink-0 ml-2">
                <button 
                    onClick={(e) => { e.stopPropagation(); useCanvasStore.getState().toggleLayerVisibility(child.id); }} 
                    className={\`p-1 rounded transition-colors \${child.isHidden ? 'text-gray-300' : 'text-gray-400 hover:text-gray-600'}\`}
                >
                    {child.isHidden ? (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"></path></svg>
                    ) : (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    )}
                </button>
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Hapus elemen ini?')) {
                            useCanvasStore.getState().deleteElement(child.id);
                        }
                    }} 
                    className="p-1 rounded text-red-300 hover:text-red-500 transition-colors ml-0.5"
                >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
            </div>
        </div>
    );
};
`;

content = content.replace("import { CSS } from '@dnd-kit/utilities';", "import { CSS } from '@dnd-kit/utilities';\n" + draggableChildStr);

content = content.replace(
    "const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: layer.id });",
    "const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: layer.id, data: { type: 'group' } });"
);

// Replace children map
const oldChildrenMap = `                    {layer.children.map(child => {
                        const isChildActive = activeLayerId === child.id;
                        return (
                            <div 
                                key={child.id}
                                onClick={() => useCanvasStore.getState().setActiveLayer(child.id)}
                                className={\`flex items-center justify-between h-8 px-2 border cursor-pointer \${isChildActive ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-gray-100 hover:bg-gray-50'}\`}
                            >
                                <div className="flex items-center gap-2 overflow-hidden flex-1">
                                    <div className="w-4 h-4 bg-gray-100 rounded flex items-center justify-center shrink-0">
                                        <span className="text-[8px] font-bold text-gray-500 uppercase">{child.type.charAt(0)}</span>
                                    </div>
                                    <span className="text-xs font-medium text-gray-600 truncate">{child.content || (child.type === 'image' ? 'Gambar Asset' : 'Elemen')}</span>
                                </div>
                                <div className="flex items-center shrink-0 ml-2">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); useCanvasStore.getState().toggleLayerVisibility(child.id); }} 
                                        className={\`p-1 rounded transition-colors \${child.isHidden ? 'text-gray-300' : 'text-gray-400 hover:text-gray-600'}\`}
                                    >
                                        {child.isHidden ? (
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"></path></svg>
                                        ) : (
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                        )}
                                    </button>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (confirm('Hapus elemen ini?')) {
                                                useCanvasStore.getState().deleteElement(child.id);
                                            }
                                        }} 
                                        className="p-1 rounded text-red-300 hover:text-red-500 transition-colors ml-0.5"
                                    >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    </button>
                                </div>
                            </div>
                        )
                    })}`;

const newChildrenMap = `                    {layer.children.map(child => (
                        <DraggableChildItem key={child.id} child={child} parentId={layer.id} isActive={activeLayerId === child.id} />
                    ))}`;

content = content.replace(oldChildrenMap, newChildrenMap);

// Replace handleDragEnd
const oldDragEnd = `            const handleDragEnd = (event) => {
                const { active, over } = event;
                if (active.id !== over.id) {
                    const oldIndex = sortedLayers.findIndex(l => l.id === active.id);
                    const newIndex = sortedLayers.findIndex(l => l.id === over.id);
                    const newSorted = arrayMove(sortedLayers, oldIndex, newIndex);
                    // Karena sortedLayers dibalik (reverse), kita harus me-reverse lagi sebelum disimpan
                    useCanvasStore.getState().setLayers([...newSorted].reverse());
                }
            };`;

const newDragEnd = `            const handleDragEnd = (event) => {
                const { active, over } = event;
                if (!over) return;

                if (active.data.current?.type === 'child') {
                    // It's a child being dragged
                    const targetGroupId = over.id; 
                    if (active.data.current.parentId !== targetGroupId) {
                        useCanvasStore.getState().moveElementToGroup(active.id, targetGroupId);
                    }
                    return;
                }

                if (active.id !== over.id) {
                    const oldIndex = sortedLayers.findIndex(l => l.id === active.id);
                    const newIndex = sortedLayers.findIndex(l => l.id === over.id);
                    const newSorted = arrayMove(sortedLayers, oldIndex, newIndex);
                    // Karena sortedLayers dibalik (reverse), kita harus me-reverse lagi sebelum disimpan
                    useCanvasStore.getState().setLayers([...newSorted].reverse());
                }
            };`;

content = content.replace(oldDragEnd, newDragEnd);

fs.writeFileSync(file, content);
