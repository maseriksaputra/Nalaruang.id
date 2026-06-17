const fs = require('fs');
const file = 'resources/js/Builder/components/Canvas/LayerElement.jsx';
let content = fs.readFileSync(file, 'utf8');

const oldToolbar = `<div className="w-[1px] h-4 bg-gray-200 mx-1"></div>
                    <button 
                        onClick={() => useCanvasStore.getState().duplicateLayer(layer.id)}
                        className="p-1.5 rounded text-gray-600 hover:bg-gray-100 hover:text-indigo-600 transition-colors"
                        title="Duplikat (Salin)"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                    </button>
                    <button 
                        onClick={() => {
                            if (confirm('Hapus elemen ini?')) {
                                useCanvasStore.getState().deleteElement(layer.id);
                            }
                        }}
                        className="p-1.5 rounded text-gray-600 hover:bg-red-50 hover:text-red-500 transition-colors"
                        title="Hapus"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>`;

const newToolbar = `<div className="w-[1px] h-4 bg-gray-200 mx-1"></div>
                    <button onClick={() => useCanvasStore.getState().updateLayerStyle(layer.id, { flipX: !layer.style?.flipX })} className="p-1.5 rounded text-gray-600 hover:bg-gray-100 hover:text-indigo-600 transition-colors" title="Balik Horizontal">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                    </button>
                    <button onClick={() => useCanvasStore.getState().updateLayerStyle(layer.id, { borderRadius: (layer.style?.borderRadius || 0) === 0 ? 16 : ((layer.style?.borderRadius || 0) === 16 ? 9999 : 0) })} className="p-1.5 rounded text-gray-600 hover:bg-gray-100 hover:text-indigo-600 transition-colors" title="Ubah Sudut (Rounded)">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                    </button>
                    <button onClick={() => useCanvasStore.getState().setInspectorTab('animation')} className="p-1.5 rounded text-gray-600 hover:bg-gray-100 hover:text-indigo-600 transition-colors" title="Animasikan">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
                    </button>
                    <button onClick={() => useCanvasStore.getState().updateLayerStyle(layer.id, { opacity: (layer.style?.opacity ?? 1) - 0.25 <= 0 ? 1 : (layer.style?.opacity ?? 1) - 0.25 })} className="p-1.5 rounded text-gray-600 hover:bg-gray-100 hover:text-indigo-600 transition-colors" title="Transparansi">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
                    </button>
                    <button onClick={() => useCanvasStore.getState().setInspectorTab('design')} className="p-1.5 rounded text-gray-600 hover:bg-gray-100 hover:text-indigo-600 transition-colors" title="Posisi">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
                    </button>
                    
                    <div className="w-[1px] h-4 bg-gray-200 mx-1"></div>
                    <button 
                        onClick={() => useCanvasStore.getState().duplicateLayer(layer.id)}
                        className="p-1.5 rounded text-gray-600 hover:bg-gray-100 hover:text-indigo-600 transition-colors"
                        title="Duplikat (Salin)"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                    </button>
                    <button 
                        onClick={() => {
                            if (confirm('Hapus elemen ini?')) {
                                useCanvasStore.getState().deleteElement(layer.id);
                            }
                        }}
                        className="p-1.5 rounded text-gray-600 hover:bg-red-50 hover:text-red-500 transition-colors"
                        title="Hapus"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>`;

if (content.includes('title="Duplikat (Salin)"')) {
    content = content.replace(oldToolbar, newToolbar);
    fs.writeFileSync(file, content);
}
