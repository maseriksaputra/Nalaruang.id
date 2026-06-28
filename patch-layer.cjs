const fs = require('fs');
let content = fs.readFileSync('resources/js/Viewer/components/PublicLayer.jsx', 'utf8');

// 1. Add isParentHovered prop
content = content.replace(
    'const PublicLayer = ({ layer, isOpened = true, isCoverPage = true, isChildOfGroup = false }) => {',
    'const PublicLayer = ({ layer, isOpened = true, isCoverPage = true, isChildOfGroup = false, isParentHovered = false }) => {'
);

// 2. Add isHovered state
content = content.replace(
    'const elementRef = useRef(null);',
    'const elementRef = useRef(null);\n    const [isHovered, setIsHovered] = useState(false);'
);

// 3. Update wrapperStyle and add hover injection
const originalWrapperStyle = `    let wrapperStyle = {
        position: isChildOfGroup ? 'absolute' : 'absolute',
        top: layer.style?.y ? \`\${layer.style.y}%\` : '0',
        left: layer.style?.x ? \`\${layer.style.x}%\` : '0',
        width: layer.style?.width ? \`\${layer.style.width}%\` : '100%',
        height: layer.style?.height ? \`\${layer.style.height}%\` : '100%',
        transform: \`rotate(\${layer.style?.rotation || 0}deg)\`,
        opacity: layer.style?.opacity ?? 1,
        zIndex: layer.style?.zIndex || 1,
        pointerEvents: layer.interaction ? 'auto' : 'none',
    };`;

const newWrapperStyle = `    let wrapperStyle = {
        position: isChildOfGroup ? 'absolute' : 'absolute',
        top: layer.style?.y ? \`\${layer.style.y}%\` : '0',
        left: layer.style?.x ? \`\${layer.style.x}%\` : '0',
        width: layer.style?.width ? \`\${layer.style.width}%\` : '100%',
        height: layer.style?.height ? \`\${layer.style.height}%\` : '100%',
        transform: \`rotate(\${layer.style?.rotation || 0}deg)\`,
        opacity: layer.style?.opacity ?? 1,
        zIndex: layer.style?.zIndex || 1,
        pointerEvents: layer.interaction ? 'auto' : 'none',
    };

    const effectiveHover = isHovered || isParentHovered;
    if (effectiveHover && layer.interaction && layer.interaction.isButton) {
        wrapperStyle['--current-bg'] = layer.interaction.hoverBgColor || '#ff0000';
        wrapperStyle['--current-text'] = layer.interaction.hoverTextColor || '#ffffff';
        wrapperStyle['--current-border'] = layer.interaction.hoverBorderColor || '#000000';
    }`;

content = content.replace(originalWrapperStyle, newWrapperStyle);

// 4. Update the wrapper div to have onMouseEnter/onMouseLeave
const originalDiv = `<div
            id={\`wrapper-\${layer.id}\`}
            className={\`layer-wrapper \${layer.type === 'canvas_group' ? 'group' : ''}\`}
            style={wrapperStyle}
        >`;

const newDiv = `<div
            id={\`wrapper-\${layer.id}\`}
            className={\`layer-wrapper \${layer.type === 'canvas_group' ? 'group' : ''}\`}
            style={wrapperStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >`;

content = content.replace(originalDiv, newDiv);

// 5. Update canvas_group children mapping to pass isParentHovered
const originalMap = `{layer.children?.map((childLayer) => (
                                    <PublicLayer key={childLayer.id} layer={childLayer} isChildOfGroup={true} />
                                ))}`;

const newMap = `{layer.children?.map((childLayer) => (
                                    <PublicLayer key={childLayer.id} layer={childLayer} isChildOfGroup={true} isParentHovered={effectiveHover} />
                                ))}`;

content = content.replace(originalMap, newMap);

fs.writeFileSync('resources/js/Viewer/components/PublicLayer.jsx', content);
