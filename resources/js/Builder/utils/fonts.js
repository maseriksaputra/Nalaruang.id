export const FONTS = [
    // Serif (Klasik & Elegan)
    'Playfair Display', 'Merriweather', 'Lora', 'PT Serif', 'Noto Serif', 
    'Crimson Text', 'Libre Baskerville', 'EB Garamond', 'Cormorant Garamond', 'Bitter',
    'Arvo', 'Zilla Slab', 'Josefin Slab', 'Vollkorn', 'Cinzel', 
    'Tinos', 'Rokkitt', 'Frank Ruhl Libre', 'Prata', 'Abril Fatface',

    // Sans Serif (Modern & Bersih)
    'Inter', 'Roboto', 'Open Sans', 'Montserrat', 'Poppins', 
    'Lato', 'Oswald', 'Raleway', 'Nunito', 'Ubuntu', 
    'Quicksand', 'Rubik', 'Work Sans', 'Fira Sans', 'Barlow',
    'Mulish', 'PT Sans', 'Mukta', 'Heebo', 'Hind',
    'Karla', 'Jost', 'Dosis', 'Teko', 'Anton',
    'Cabin', 'Oxygen', 'Manrope', 'Signika', 'Exo 2',
    'Varela Round', 'Comfortaa', 'Tajawal', 'Asap', 'Prompt',

    // Handwriting & Script (Pernikahan / Tulisan Tangan)
    'Dancing Script', 'Pacifico', 'Caveat', 'Satisfy', 'Great Vibes',
    'Sacramento', 'Parisienne', 'Yellowtail', 'Kaushan Script', 'Cookie',
    'Handlee', 'Kalam', 'Shadows Into Light', 'Indie Flower', 'Patrick Hand',
    'Amatic SC', 'Pinyon Script', 'Alex Brush', 'Allura', 'Tangerine',
    'Marck Script', 'Bad Script', 'Nothing You Could Do', 'Homemade Apple', 'Rochester',
    'Berkshire Swash', 'Mr Dafoe', 'Leckerli One', 'Qwigley', 'Rouge Script',

    // Display / Dekoratif (Unik & Estetik)
    'Lobster', 'Righteous', 'Bebas Neue', 'Patua One', 'Concert One',
    'Fredoka One', 'Alfa Slab One', 'Fugaz One', 'Titan One', 'Boogaloo',
    'Russo One', 'Creepster', 'Permanent Marker', 'Bangers', 'Chewy',
    'Cinzel Decorative', 'Monoton', 'Carter One', 'Rye', 'Eater',
    
    // Monospace (Kode & Mesin Tik)
    'Roboto Mono', 'Space Mono', 'Fira Code', 'Inconsolata', 'Source Code Pro',
    'IBM Plex Mono', 'Cousine', 'Anonymous Pro', 'VT323', 'Share Tech Mono'
];

export const loadFont = (fontFamily) => {
    if (!fontFamily) return;
    
    // Skip system default fonts
    const systemFonts = ['Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana', 'sans-serif', 'serif', 'monospace'];
    if (systemFonts.includes(fontFamily)) return;

    const fontId = 'font-' + fontFamily.replace(/\s+/g, '-').toLowerCase();
    
    if (document.getElementById(fontId)) return; // Already loaded

    const link = document.createElement('link');
    link.id = fontId;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, '+')}:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap`;
    
    // Error handling in case font doesn't exist
    link.onerror = () => {
        console.warn(`Failed to load font: ${fontFamily}`);
    };
    
    document.head.appendChild(link);
};
