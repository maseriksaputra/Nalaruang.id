const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'resources', 'js', 'Dashboard', 'PortalApp.jsx');
let content = fs.readFileSync(file, 'utf8');

// Replacements
const rules = [
    { from: /bg-\[#0f172a\]/g, to: 'bg-white dark:bg-[#0f172a]' },
    { from: /bg-\[#1e293b\]/g, to: 'bg-white dark:bg-[#1e293b]' },
    { from: /border-\[#334155\]/g, to: 'border-gray-200 dark:border-[#334155]' },
    { from: /text-gray-400/g, to: 'text-gray-500 dark:text-gray-400' },
    { from: /text-gray-200/g, to: 'text-gray-800 dark:text-gray-200' },
    { from: /text-gray-100/g, to: 'text-gray-900 dark:text-gray-100' },
    { from: /text-gray-300/g, to: 'text-gray-700 dark:text-gray-300' },
    { from: /text-white/g, to: 'text-gray-900 dark:text-white' },
    { from: /bg-\[#334155\]/g, to: 'bg-gray-200 dark:bg-[#334155]' },
    { from: /hover:bg-\[#475569\]/g, to: 'hover:bg-gray-300 dark:hover:bg-[#475569]' },
    { from: /hover:bg-\[#334155\]/g, to: 'hover:bg-gray-100 dark:hover:bg-[#334155]' },
    { from: /hover:bg-\[#1e293b\]/g, to: 'hover:bg-gray-100 dark:hover:bg-[#1e293b]' },
    { from: /bg-gradient-to-r from-blue-600 to-indigo-600/g, to: 'bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-600 dark:to-indigo-600' }
];

rules.forEach(rule => {
    content = content.replace(rule.from, rule.to);
});

// We must revert "text-gray-900 dark:text-white" in primary buttons
// such as bg-indigo-600 text-white. 
// A simple way is to find combinations like "bg-blue-600 text-gray-900 dark:text-white"
// and replace back to "bg-blue-600 text-white".
const btnTextWhiteRules = [
    /bg-blue-[0-9]+[^"]*text-gray-900 dark:text-white/g,
    /bg-indigo-[0-9]+[^"]*text-gray-900 dark:text-white/g,
    /bg-red-[0-9]+[^"]*text-gray-900 dark:text-white/g,
    /text-white text-gray-900 dark:text-white/g, // if it was already white
];

btnTextWhiteRules.forEach(rule => {
    content = content.replace(rule, (match) => {
        return match.replace('text-gray-900 dark:text-white', 'text-white');
    });
});

fs.writeFileSync(file, content);
console.log('Done refactoring');
