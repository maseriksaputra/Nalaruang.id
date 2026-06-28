import fs from 'fs';

let content = fs.readFileSync('resources/js/Viewer/components/PublicLayer.jsx', 'utf8');

// Replace background var(--current-bg, ...) with a direct value
content = content.replace(
    /background: \`var\(--current-bg, \$\{\(\!layer\.style\?\.backgroundType \|\| layer\.style\?\.backgroundType === 'solid'\) \? \(layer\.style\?\.backgroundColor \|\| '#cbd5e1'\) : getGradientCss\(layer\.style\)\}\)\`,/g,
    \`background: (effectiveHover && layer.interaction?.isButton) ? (layer.interaction.hoverBgColor || '#ff0000') : (!layer.style?.backgroundType || layer.style?.backgroundType === 'solid' ? (layer.style?.backgroundColor || '#cbd5e1') : getGradientCss(layer.style)),\`
);

// Replace text color var(--current-bg, ...) which was actually for SVG color
content = content.replace(
    /color: \`var\(--current-bg, \$\{layer\.style\?\.backgroundColor \|\| '#cbd5e1'\}\)\`/g,
    \`color: (effectiveHover && layer.interaction?.isButton) ? (layer.interaction.hoverBgColor || '#ff0000') : (layer.style?.backgroundColor || '#cbd5e1')\`
);

// Replace border color var(--current-border, ...) for general wrapper
content = content.replace(
    /borderColor: layer\.style\?\.borderWidth > 0 \? \`var\(--current-border, \$\{hexToRgba\(layer\.style\.borderColor \|\| '#000000', \(layer\.style\.borderOpacity \?\? 1\) \* 100\)\}\)\` : undefined,/g,
    \`borderColor: layer.style?.borderWidth > 0 ? ((effectiveHover && layer.interaction?.isButton) ? (layer.interaction.hoverBorderColor || '#000000') : hexToRgba(layer.style.borderColor || '#000000', (layer.style.borderOpacity ?? 1) * 100)) : undefined,\`
);

// Replace SVG path stroke var(--current-border, ...)
content = content.replace(
    /stroke=\{layer\.style\?\.borderWidth > 0 \? \`var\(--current-border, \$\{hexToRgba\(layer\.style\.borderColor \|\| '#000000', \(layer\.style\.borderOpacity \?\? 1\) \* 100\)\}\)\` : undefined\}/g,
    \`stroke={layer.style?.borderWidth > 0 ? ((effectiveHover && layer.interaction?.isButton) ? (layer.interaction.hoverBorderColor || '#000000') : hexToRgba(layer.style.borderColor || '#000000', (layer.style.borderOpacity ?? 1) * 100)) : undefined}\`
);

// Also remove wrapperStyle['--current-bg'] injections from previous patch as we are doing it inline now
content = content.replace(
    /wrapperStyle\['--current-bg'\] = layer\.interaction\.hoverBgColor \|\| '#ff0000';/g,
    '// removed inline css var injection'
);
content = content.replace(
    /wrapperStyle\['--current-text'\] = layer\.interaction\.hoverTextColor \|\| '#ffffff';/g,
    '// removed inline css var injection'
);
content = content.replace(
    /wrapperStyle\['--current-border'\] = layer\.interaction\.hoverBorderColor \|\| '#000000';/g,
    '// removed inline css var injection'
);

// Oh wait, text layers might use --current-text somewhere! Let's check text rendering!
// The text color in PublicLayer.jsx:
content = content.replace(
    /color: layer\.style\?\.color \|\| layer\.style\?\.textColor \|\| '#000000',/g,
    \`color: (effectiveHover && layer.interaction?.isButton) ? (layer.interaction.hoverTextColor || '#ffffff') : (layer.style?.color || layer.style?.textColor || '#000000'),\`
);

fs.writeFileSync('resources/js/Viewer/components/PublicLayer.jsx', content);
