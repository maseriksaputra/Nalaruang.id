const fs = require('fs');

let content = fs.readFileSync('resources/js/Viewer/components/PublicLayer.jsx', 'utf8');

// 1. Add isParentHovered prop and isHovered state
content = content.replace(
    'const PublicLayer = ({ layer, isOpened = true, isCoverPage = true, isChildOfGroup = false }) => {',
    'const PublicLayer = ({ layer, isOpened = true, isCoverPage = true, isChildOfGroup = false, isParentHovered = false }) => {'
);
content = content.replace(
    'const elementRef = useRef(null);',
    'const elementRef = useRef(null);\n    const [isHovered, setIsHovered] = useState(false);\n    const effectiveHover = isHovered || isParentHovered;'
);

// 2. Add onMouseEnter / onMouseLeave to the outer layer-wrapper
content = content.replace(
    /className=\{\`layer-wrapper \$\{layer\.type === 'canvas_group' \? 'group' : ''\}\`\}\n\s+style=\{wrapperStyle\}\n\s+>/,
    "className={`layer-wrapper ${layer.type === 'canvas_group' ? 'group' : ''}`}\n            style={wrapperStyle}\n            onMouseEnter={() => setIsHovered(true)}\n            onMouseLeave={() => setIsHovered(false)}\n        >"
);

// 3. Fix background fallback
const oldBackground = "background: `var(--current-bg, ${(!layer.style?.backgroundType || layer.style?.backgroundType === 'solid') ? (layer.style?.backgroundColor || '#cbd5e1') : getGradientCss(layer.style)})`,";
const newBackground = "background: (effectiveHover && layer.interaction?.isButton) ? (layer.interaction.hoverBgColor || '#ff0000') : (!layer.style?.backgroundType || layer.style?.backgroundType === 'solid' ? (layer.style?.backgroundColor || '#cbd5e1') : getGradientCss(layer.style)),";
content = content.replace(oldBackground, newBackground);

// 4. Fix textColor fallback
const oldColor = "color: `var(--current-bg, ${layer.style?.backgroundColor || '#cbd5e1'})`,";
const newColor = "color: (effectiveHover && layer.interaction?.isButton) ? (layer.interaction.hoverBgColor || '#ff0000') : (layer.style?.backgroundColor || '#cbd5e1'),";
content = content.replace(oldColor, newColor);

// 5. Fix text component text color
const oldTextColor = "color: layer.style?.color || layer.style?.textColor || '#000000',";
const newTextColor = "color: (effectiveHover && layer.interaction?.isButton) ? (layer.interaction.hoverTextColor || '#ffffff') : (layer.style?.color || layer.style?.textColor || '#000000'),";
content = content.replace(oldTextColor, newTextColor);

// 6. Fix borderColor fallback
const oldBorderColor = "borderColor: layer.style?.borderWidth > 0 ? `var(--current-border, ${hexToRgba(layer.style.borderColor || '#000000', (layer.style.borderOpacity ?? 1) * 100)})` : undefined,";
const newBorderColor = "borderColor: layer.style?.borderWidth > 0 ? ((effectiveHover && layer.interaction?.isButton) ? (layer.interaction.hoverBorderColor || '#000000') : hexToRgba(layer.style.borderColor || '#000000', (layer.style.borderOpacity ?? 1) * 100)) : undefined,";
content = content.replace(oldBorderColor, newBorderColor);

// 7. Fix stroke fallback
const oldStroke = "stroke={layer.style?.borderWidth > 0 ? `var(--current-border, ${hexToRgba(layer.style.borderColor || '#000000', (layer.style.borderOpacity ?? 1) * 100)})` : undefined}";
const newStroke = "stroke={layer.style?.borderWidth > 0 ? ((effectiveHover && layer.interaction?.isButton) ? (layer.interaction.hoverBorderColor || '#000000') : hexToRgba(layer.style.borderColor || '#000000', (layer.style.borderOpacity ?? 1) * 100)) : undefined}";
content = content.replace(oldStroke, newStroke);

// 8. Fix canvas_group map to pass isParentHovered
const oldMap = "{layer.children?.map(child => (\n                                    <PublicLayer key={child.id} layer={child} isOpened={isOpened} isCoverPage={isCoverPage} isChildOfGroup={true} />\n                                ))}";
const newMap = "{layer.children?.map(child => (\n                                    <PublicLayer key={child.id} layer={child} isOpened={isOpened} isCoverPage={isCoverPage} isChildOfGroup={true} isParentHovered={effectiveHover} />\n                                ))}";
content = content.replace(oldMap, newMap);

fs.writeFileSync('resources/js/Viewer/components/PublicLayer.jsx', content);
