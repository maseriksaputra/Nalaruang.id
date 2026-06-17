const fs = require('fs');
const file = 'd:/laragon/www/Undangan/resources/js/Builder/components/Canvas/LayerElement.jsx';
let content = fs.readFileSync(file, 'utf8');

// The file is currently mangled. We know what it looks like.
// Let's grab the `Rnd` block. It starts at `    return (\n        <Rnd` and ends at `            {innerStructure}\n        </Rnd> = (`
const rndStart = content.indexOf('    return (\n        <Rnd');
const rndEndStr = '            {innerStructure}\n        </Rnd> = (\n';
const rndEnd = content.indexOf(rndEndStr);

const rndBlock = content.slice(rndStart, rndEnd) + '            {innerStructure}\n        </Rnd>\n    );\n';

// The inner structure starts at `<div ref={elementRef} className="w-full h-full relative" style={{ transform: \`rotate(${layer.style?.rotation || 0}deg)\`, opacity: layer.style?.opacity ?? 1 }}>`
// and ends at `        </div>\n    );\n\n    if (isChildOfGroup) {`
const innerStartStr = '        <div ref={elementRef} className="w-full h-full relative" style={{ transform: `rotate(${layer.style?.rotation || 0}deg)`, opacity: layer.style?.opacity ?? 1 }}>';
const innerStart = content.indexOf(innerStartStr, rndEnd);
const innerEndStr = '        </div>\n    );\n\n    if (isChildOfGroup) {';
const innerEnd = content.indexOf(innerEndStr, innerStart);

const innerBlock = '    const innerStructure = (\n' + content.slice(innerStart, innerEnd) + '        </div>\n    );\n';

// Now reconstruct the whole thing from rndStart to the end of the file.
// Wait, the end of the file has:
/*
    if (isChildOfGroup) {
        return innerStructure;
    }

    return (
        <Rnd
    );
};

export default LayerElement;
*/

// Let's replace the whole section from rndStart to the end of the file with:
// innerBlock
// if (isChildOfGroup) return innerStructure;
// rndBlock
// };
// export default LayerElement;

const beforeRnd = content.slice(0, rndStart);

const finalContent = beforeRnd + 
innerBlock + '\n' +
'    if (isChildOfGroup) {\n' +
'        return innerStructure;\n' +
'    }\n\n' +
rndBlock +
'};\n\nexport default LayerElement;\n';

fs.writeFileSync(file, finalContent);
console.log('Repaired!');
