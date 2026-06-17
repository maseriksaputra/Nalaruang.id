const fs = require('fs');
const file = 'resources/views/client-portal.blade.php';
let content = fs.readFileSync(file, 'utf8');

// Replace duplicate classes
content = content.replace(/dark:bg-slate-800\/50 dark:bg-slate-800\/30 dark:bg-slate-950/g, 'dark:bg-slate-950');
content = content.replace(/dark:text-slate-200 dark:text-slate-200/g, 'dark:text-slate-200');
content = content.replace(/bg-white dark:bg-slate-900\/80/g, 'bg-white/80 dark:bg-slate-900/80');
content = content.replace(/dark:text-slate-400 dark:text-slate-400/g, 'dark:text-slate-400');
content = content.replace(/dark:hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-800/g, 'dark:hover:bg-slate-800');
content = content.replace(/dark:bg-slate-900 dark:bg-slate-900/g, 'dark:bg-slate-900');
content = content.replace(/dark:bg-slate-800\/50 dark:bg-slate-800\/30/g, 'dark:bg-slate-800/50');
content = content.replace(/bg-white dark:bg-slate-900 dark:bg-slate-900/g, 'bg-white dark:bg-slate-900');

fs.writeFileSync(file, content);
console.log('Cleanup complete!');
