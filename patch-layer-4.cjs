const fs = require('fs');

let content = fs.readFileSync('resources/js/Viewer/components/PublicLayer.jsx', 'utf8');

// 1. Add parentInteraction prop
content = content.replace(
    'const PublicLayer = ({ layer, isOpened = true, isCoverPage = true, isChildOfGroup = false, isParentHovered = false }) => {',
    'const PublicLayer = ({ layer, isOpened = true, isCoverPage = true, isChildOfGroup = false, isParentHovered = false, parentInteraction = null }) => {'
);

// 2. Define effectiveInteraction
// We insert it right after effectiveHover
content = content.replace(
    'const effectiveHover = isHovered || isParentHovered;',
    'const effectiveHover = isHovered || isParentHovered;\n    const effectiveInteraction = layer.interaction?.isButton ? layer.interaction : (isChildOfGroup && parentInteraction?.isButton ? parentInteraction : null);'
);

// 3. Update background fallback
const oldBackground = "background: (effectiveHover && layer.interaction?.isButton) ? (layer.interaction.hoverBgColor || '#ff0000') : (!layer.style?.backgroundType || layer.style?.backgroundType === 'solid' ? (layer.style?.backgroundColor || '#cbd5e1') : getGradientCss(layer.style)),";
const newBackground = "background: (effectiveHover && effectiveInteraction) ? (effectiveInteraction.hoverBgColor || '#ff0000') : (!layer.style?.backgroundType || layer.style?.backgroundType === 'solid' ? (layer.style?.backgroundColor || '#cbd5e1') : getGradientCss(layer.style)),";
content = content.replace(oldBackground, newBackground);

// 4. Update textColor fallback
const oldColor = "color: (effectiveHover && layer.interaction?.isButton) ? (layer.interaction.hoverBgColor || '#ff0000') : (layer.style?.backgroundColor || '#cbd5e1'),";
const newColor = "color: (effectiveHover && effectiveInteraction) ? (effectiveInteraction.hoverBgColor || '#ff0000') : (layer.style?.backgroundColor || '#cbd5e1'),";
content = content.replace(oldColor, newColor);

// 5. Update text component text color
const oldTextColor = "color: (effectiveHover && layer.interaction?.isButton) ? (layer.interaction.hoverTextColor || '#ffffff') : (layer.style?.color || layer.style?.textColor || '#000000'),";
const newTextColor = "color: (effectiveHover && effectiveInteraction) ? (effectiveInteraction.hoverTextColor || '#ffffff') : (layer.style?.color || layer.style?.textColor || '#000000'),";
content = content.replace(oldTextColor, newTextColor);

// 6. Update borderColor fallback
const oldBorderColor = "borderColor: layer.style?.borderWidth > 0 ? ((effectiveHover && layer.interaction?.isButton) ? (layer.interaction.hoverBorderColor || '#000000') : hexToRgba(layer.style.borderColor || '#000000', (layer.style.borderOpacity ?? 1) * 100)) : undefined,";
const newBorderColor = "borderColor: layer.style?.borderWidth > 0 ? ((effectiveHover && effectiveInteraction) ? (effectiveInteraction.hoverBorderColor || '#000000') : hexToRgba(layer.style.borderColor || '#000000', (layer.style.borderOpacity ?? 1) * 100)) : undefined,";
content = content.replace(oldBorderColor, newBorderColor);

// 7. Update stroke fallback
const oldStroke = "stroke={layer.style?.borderWidth > 0 ? ((effectiveHover && layer.interaction?.isButton) ? (layer.interaction.hoverBorderColor || '#000000') : hexToRgba(layer.style.borderColor || '#000000', (layer.style.borderOpacity ?? 1) * 100)) : undefined}";
const newStroke = "stroke={layer.style?.borderWidth > 0 ? ((effectiveHover && effectiveInteraction) ? (effectiveInteraction.hoverBorderColor || '#000000') : hexToRgba(layer.style.borderColor || '#000000', (layer.style.borderOpacity ?? 1) * 100)) : undefined}";
content = content.replace(oldStroke, newStroke);

// 8. Pass parentInteraction to canvas_group children
const oldMap = "{layer.children?.map(child => (\n                                    <PublicLayer key={child.id} layer={child} isOpened={isOpened} isCoverPage={isCoverPage} isChildOfGroup={true} isParentHovered={effectiveHover} />\n                                ))}";
const newMap = "{layer.children?.map(child => (\n                                    <PublicLayer key={child.id} layer={child} isOpened={isOpened} isCoverPage={isCoverPage} isChildOfGroup={true} isParentHovered={effectiveHover} parentInteraction={layer.interaction} />\n                                ))}";
content = content.replace(oldMap, newMap);

fs.writeFileSync('resources/js/Viewer/components/PublicLayer.jsx', content);
